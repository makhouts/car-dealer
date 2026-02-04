from fastapi import FastAPI, APIRouter, HTTPException, UploadFile, File, Form
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
from pathlib import Path
from pydantic import BaseModel, Field, ConfigDict
from typing import List, Optional
import uuid
from datetime import datetime, timezone
import base64

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

# Create the main app
app = FastAPI()

# Create a router with the /api prefix
api_router = APIRouter(prefix="/api")

# ============ MODELS ============

class CarBase(BaseModel):
    brand: str
    model: str
    year: int
    price: float
    mileage: int
    fuel_type: str  # Petrol, Diesel, Electric, Hybrid
    transmission: str  # Automatic, Manual
    body_type: str  # Sedan, SUV, Coupe, Hatchback, Sports, Truck
    color: str
    engine: str
    description: str
    features: List[str] = []
    images: List[str] = []  # Base64 or URLs
    is_featured: bool = False
    status: str = "available"  # available, sold, reserved

class CarCreate(CarBase):
    pass

class CarUpdate(BaseModel):
    brand: Optional[str] = None
    model: Optional[str] = None
    year: Optional[int] = None
    price: Optional[float] = None
    mileage: Optional[int] = None
    fuel_type: Optional[str] = None
    transmission: Optional[str] = None
    body_type: Optional[str] = None
    color: Optional[str] = None
    engine: Optional[str] = None
    description: Optional[str] = None
    features: Optional[List[str]] = None
    images: Optional[List[str]] = None
    is_featured: Optional[bool] = None
    status: Optional[str] = None

class Car(CarBase):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    updated_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class InquiryBase(BaseModel):
    car_id: str
    name: str
    email: str
    phone: str
    message: str

class InquiryCreate(InquiryBase):
    pass

class Inquiry(InquiryBase):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    status: str = "new"  # new, contacted, closed
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class ContactMessage(BaseModel):
    name: str
    email: str
    phone: Optional[str] = None
    message: str

class ContactMessageDB(ContactMessage):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class AdminLogin(BaseModel):
    username: str
    password: str

# ============ CAR ROUTES ============

@api_router.get("/")
async def root():
    return {"message": "Velocità Motors API"}

@api_router.post("/cars", response_model=Car)
async def create_car(car: CarCreate):
    car_obj = Car(**car.model_dump())
    doc = car_obj.model_dump()
    doc['created_at'] = doc['created_at'].isoformat()
    doc['updated_at'] = doc['updated_at'].isoformat()
    await db.cars.insert_one(doc)
    return car_obj

@api_router.get("/cars", response_model=List[Car])
async def get_cars(
    brand: Optional[str] = None,
    body_type: Optional[str] = None,
    fuel_type: Optional[str] = None,
    transmission: Optional[str] = None,
    min_price: Optional[float] = None,
    max_price: Optional[float] = None,
    min_year: Optional[int] = None,
    max_year: Optional[int] = None,
    min_mileage: Optional[int] = None,
    max_mileage: Optional[int] = None,
    status: Optional[str] = None,
    is_featured: Optional[bool] = None,
    limit: int = 100
):
    query = {}
    
    if brand:
        query["brand"] = {"$regex": brand, "$options": "i"}
    if body_type:
        query["body_type"] = body_type
    if fuel_type:
        query["fuel_type"] = fuel_type
    if transmission:
        query["transmission"] = transmission
    if status:
        query["status"] = status
    if is_featured is not None:
        query["is_featured"] = is_featured
    
    if min_price is not None or max_price is not None:
        query["price"] = {}
        if min_price is not None:
            query["price"]["$gte"] = min_price
        if max_price is not None:
            query["price"]["$lte"] = max_price
        if not query["price"]:
            del query["price"]
    
    if min_year is not None or max_year is not None:
        query["year"] = {}
        if min_year is not None:
            query["year"]["$gte"] = min_year
        if max_year is not None:
            query["year"]["$lte"] = max_year
        if not query["year"]:
            del query["year"]
    
    if min_mileage is not None or max_mileage is not None:
        query["mileage"] = {}
        if min_mileage is not None:
            query["mileage"]["$gte"] = min_mileage
        if max_mileage is not None:
            query["mileage"]["$lte"] = max_mileage
        if not query["mileage"]:
            del query["mileage"]
    
    cars = await db.cars.find(query, {"_id": 0}).sort("created_at", -1).to_list(limit)
    
    for car in cars:
        if isinstance(car.get('created_at'), str):
            car['created_at'] = datetime.fromisoformat(car['created_at'])
        if isinstance(car.get('updated_at'), str):
            car['updated_at'] = datetime.fromisoformat(car['updated_at'])
    
    return cars

@api_router.get("/cars/featured", response_model=List[Car])
async def get_featured_cars():
    cars = await db.cars.find({"is_featured": True, "status": "available"}, {"_id": 0}).to_list(10)
    for car in cars:
        if isinstance(car.get('created_at'), str):
            car['created_at'] = datetime.fromisoformat(car['created_at'])
        if isinstance(car.get('updated_at'), str):
            car['updated_at'] = datetime.fromisoformat(car['updated_at'])
    return cars

@api_router.get("/cars/brands")
async def get_brands():
    brands = await db.cars.distinct("brand")
    return brands

@api_router.get("/cars/stats")
async def get_car_stats():
    total = await db.cars.count_documents({})
    available = await db.cars.count_documents({"status": "available"})
    sold = await db.cars.count_documents({"status": "sold"})
    reserved = await db.cars.count_documents({"status": "reserved"})
    featured = await db.cars.count_documents({"is_featured": True})
    
    return {
        "total": total,
        "available": available,
        "sold": sold,
        "reserved": reserved,
        "featured": featured
    }

@api_router.get("/cars/{car_id}", response_model=Car)
async def get_car(car_id: str):
    car = await db.cars.find_one({"id": car_id}, {"_id": 0})
    if not car:
        raise HTTPException(status_code=404, detail="Car not found")
    
    if isinstance(car.get('created_at'), str):
        car['created_at'] = datetime.fromisoformat(car['created_at'])
    if isinstance(car.get('updated_at'), str):
        car['updated_at'] = datetime.fromisoformat(car['updated_at'])
    
    return car

@api_router.put("/cars/{car_id}", response_model=Car)
async def update_car(car_id: str, car_update: CarUpdate):
    existing = await db.cars.find_one({"id": car_id}, {"_id": 0})
    if not existing:
        raise HTTPException(status_code=404, detail="Car not found")
    
    update_data = {k: v for k, v in car_update.model_dump().items() if v is not None}
    update_data["updated_at"] = datetime.now(timezone.utc).isoformat()
    
    await db.cars.update_one({"id": car_id}, {"$set": update_data})
    
    updated_car = await db.cars.find_one({"id": car_id}, {"_id": 0})
    if isinstance(updated_car.get('created_at'), str):
        updated_car['created_at'] = datetime.fromisoformat(updated_car['created_at'])
    if isinstance(updated_car.get('updated_at'), str):
        updated_car['updated_at'] = datetime.fromisoformat(updated_car['updated_at'])
    
    return updated_car

@api_router.delete("/cars/{car_id}")
async def delete_car(car_id: str):
    result = await db.cars.delete_one({"id": car_id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Car not found")
    return {"message": "Car deleted successfully"}

# ============ INQUIRY ROUTES ============

@api_router.post("/inquiries", response_model=Inquiry)
async def create_inquiry(inquiry: InquiryCreate):
    # Verify car exists
    car = await db.cars.find_one({"id": inquiry.car_id})
    if not car:
        raise HTTPException(status_code=404, detail="Car not found")
    
    inquiry_obj = Inquiry(**inquiry.model_dump())
    doc = inquiry_obj.model_dump()
    doc['created_at'] = doc['created_at'].isoformat()
    await db.inquiries.insert_one(doc)
    return inquiry_obj

@api_router.get("/inquiries", response_model=List[Inquiry])
async def get_inquiries(status: Optional[str] = None):
    query = {}
    if status:
        query["status"] = status
    
    inquiries = await db.inquiries.find(query, {"_id": 0}).sort("created_at", -1).to_list(1000)
    for inq in inquiries:
        if isinstance(inq.get('created_at'), str):
            inq['created_at'] = datetime.fromisoformat(inq['created_at'])
    return inquiries

@api_router.put("/inquiries/{inquiry_id}/status")
async def update_inquiry_status(inquiry_id: str, status: str):
    result = await db.inquiries.update_one(
        {"id": inquiry_id},
        {"$set": {"status": status}}
    )
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Inquiry not found")
    return {"message": "Status updated"}

@api_router.get("/inquiries/stats")
async def get_inquiry_stats():
    total = await db.inquiries.count_documents({})
    new_count = await db.inquiries.count_documents({"status": "new"})
    contacted = await db.inquiries.count_documents({"status": "contacted"})
    closed = await db.inquiries.count_documents({"status": "closed"})
    
    return {
        "total": total,
        "new": new_count,
        "contacted": contacted,
        "closed": closed
    }

# ============ CONTACT ROUTES ============

@api_router.post("/contact", response_model=ContactMessageDB)
async def create_contact(contact: ContactMessage):
    contact_obj = ContactMessageDB(**contact.model_dump())
    doc = contact_obj.model_dump()
    doc['created_at'] = doc['created_at'].isoformat()
    await db.contacts.insert_one(doc)
    return contact_obj

@api_router.get("/contacts", response_model=List[ContactMessageDB])
async def get_contacts():
    contacts = await db.contacts.find({}, {"_id": 0}).sort("created_at", -1).to_list(1000)
    for c in contacts:
        if isinstance(c.get('created_at'), str):
            c['created_at'] = datetime.fromisoformat(c['created_at'])
    return contacts

# ============ ADMIN AUTH ============

ADMIN_USERNAME = os.environ.get("ADMIN_USERNAME", "admin")
ADMIN_PASSWORD = os.environ.get("ADMIN_PASSWORD", "velocita2024")

@api_router.post("/admin/login")
async def admin_login(credentials: AdminLogin):
    if credentials.username == ADMIN_USERNAME and credentials.password == ADMIN_PASSWORD:
        return {"success": True, "message": "Login successful"}
    raise HTTPException(status_code=401, detail="Invalid credentials")

# ============ SEED DATA ============

@api_router.post("/seed")
async def seed_database():
    # Check if data already exists
    existing = await db.cars.count_documents({})
    if existing > 0:
        return {"message": "Database already seeded", "count": existing}
    
    sample_cars = [
        {
            "brand": "Porsche",
            "model": "911 Turbo S",
            "year": 2022,
            "price": 189900,
            "mileage": 12500,
            "fuel_type": "Petrol",
            "transmission": "Automatic",
            "body_type": "Sports",
            "color": "GT Silver",
            "engine": "3.8L Twin-Turbo Flat-6",
            "description": "Immaculate Porsche 911 Turbo S with full service history. Features Sport Chrono package, PCCB ceramic brakes, and premium leather interior.",
            "features": ["Sport Chrono", "PCCB Brakes", "Bose Sound", "Heated Seats", "Navigation"],
            "images": ["https://images.unsplash.com/photo-1614162692292-7ac56d7f7f1e?w=800", "https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=800"],
            "is_featured": True,
            "status": "available"
        },
        {
            "brand": "Mercedes-Benz",
            "model": "G63 AMG",
            "year": 2023,
            "price": 175000,
            "mileage": 8200,
            "fuel_type": "Petrol",
            "transmission": "Automatic",
            "body_type": "SUV",
            "color": "Obsidian Black",
            "engine": "4.0L V8 Biturbo",
            "description": "Nearly new G63 AMG with AMG Night Package. Exceptional condition with full manufacturer warranty remaining.",
            "features": ["AMG Night Package", "Burmester Sound", "360 Camera", "Heated/Cooled Seats", "Ambient Lighting"],
            "images": ["https://images.unsplash.com/photo-1606611013016-969c19ba27bb?w=800", "https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?w=800"],
            "is_featured": True,
            "status": "available"
        },
        {
            "brand": "BMW",
            "model": "M4 Competition",
            "year": 2023,
            "price": 89500,
            "mileage": 15600,
            "fuel_type": "Petrol",
            "transmission": "Automatic",
            "body_type": "Coupe",
            "color": "Isle of Man Green",
            "engine": "3.0L Twin-Turbo I6",
            "description": "Stunning M4 Competition in rare Isle of Man Green. Carbon fiber roof, M Carbon bucket seats, and track package.",
            "features": ["M Carbon Seats", "Carbon Roof", "M Track Package", "Harman Kardon", "Head-Up Display"],
            "images": ["https://images.unsplash.com/photo-1617531653332-bd46c24f2068?w=800", "https://images.unsplash.com/photo-1555215695-3004980ad54e?w=800"],
            "is_featured": True,
            "status": "available"
        },
        {
            "brand": "Audi",
            "model": "RS7 Sportback",
            "year": 2022,
            "price": 115000,
            "mileage": 22000,
            "fuel_type": "Petrol",
            "transmission": "Automatic",
            "body_type": "Sedan",
            "color": "Nardo Grey",
            "engine": "4.0L V8 TFSI",
            "description": "Performance meets practicality. This RS7 features the Carbon Optic package and dynamic all-wheel steering.",
            "features": ["Carbon Optic Package", "Dynamic Steering", "Bang & Olufsen", "Night Vision", "Massage Seats"],
            "images": ["https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=800", "https://images.unsplash.com/photo-1603584173870-7f23fdae1b7a?w=800"],
            "is_featured": True,
            "status": "available"
        },
        {
            "brand": "Range Rover",
            "model": "Sport SVR",
            "year": 2021,
            "price": 95000,
            "mileage": 28500,
            "fuel_type": "Petrol",
            "transmission": "Automatic",
            "body_type": "SUV",
            "color": "Santorini Black",
            "engine": "5.0L Supercharged V8",
            "description": "The ultimate performance SUV. SVR styling with supercharged V8 power and luxurious interior.",
            "features": ["SVR Carbon Fiber Pack", "Meridian Sound", "Panoramic Roof", "Adaptive Cruise", "Terrain Response 2"],
            "images": ["https://images.unsplash.com/photo-1606016159991-dfe4f2746ad5?w=800", "https://images.unsplash.com/photo-1519641471654-76ce0107ad1b?w=800"],
            "is_featured": False,
            "status": "available"
        },
        {
            "brand": "Tesla",
            "model": "Model S Plaid",
            "year": 2023,
            "price": 108000,
            "mileage": 5200,
            "fuel_type": "Electric",
            "transmission": "Automatic",
            "body_type": "Sedan",
            "color": "Pearl White",
            "engine": "Tri-Motor AWD",
            "description": "The quickest production car ever made. Full Self-Driving capability with premium interior upgrades.",
            "features": ["Full Self-Driving", "Yoke Steering", "Premium Audio", "Glass Roof", "Gaming Computer"],
            "images": ["https://images.unsplash.com/photo-1617788138017-80ad40651399?w=800", "https://images.unsplash.com/photo-1536700503339-1e4b06520771?w=800"],
            "is_featured": True,
            "status": "available"
        },
        {
            "brand": "Lamborghini",
            "model": "Huracán EVO",
            "year": 2021,
            "price": 265000,
            "mileage": 8900,
            "fuel_type": "Petrol",
            "transmission": "Automatic",
            "body_type": "Sports",
            "color": "Verde Mantis",
            "engine": "5.2L V10",
            "description": "Breathtaking Huracán EVO in stunning Verde Mantis. Lift system, sport exhaust, and carbon ceramic brakes.",
            "features": ["Lift System", "Carbon Ceramics", "Sport Exhaust", "Sensonum Sound", "LDVI System"],
            "images": ["https://images.unsplash.com/photo-1544636331-e26879cd4d9b?w=800", "https://images.unsplash.com/photo-1621135802920-133df287f89c?w=800"],
            "is_featured": True,
            "status": "available"
        },
        {
            "brand": "Toyota",
            "model": "Land Cruiser",
            "year": 2022,
            "price": 72000,
            "mileage": 18500,
            "fuel_type": "Petrol",
            "transmission": "Automatic",
            "body_type": "SUV",
            "color": "Army Green",
            "engine": "3.5L Twin-Turbo V6",
            "description": "Legendary reliability meets modern luxury. Heritage Edition with exclusive features and premium leather.",
            "features": ["Heritage Edition", "Multi-Terrain Select", "JBL Audio", "Panoramic View", "Crawl Control"],
            "images": ["https://images.unsplash.com/photo-1594502184342-2e12f877aa73?w=800", "https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?w=800"],
            "is_featured": False,
            "status": "available"
        },
        {
            "brand": "Mercedes-Benz",
            "model": "AMG GT",
            "year": 2020,
            "price": 125000,
            "mileage": 16200,
            "fuel_type": "Petrol",
            "transmission": "Automatic",
            "body_type": "Coupe",
            "color": "Selenite Grey",
            "engine": "4.0L V8 Biturbo",
            "description": "Pure driving excitement. AMG GT with AMG Aerodynamic Package and exclusive interior appointments.",
            "features": ["AMG Aero Package", "Burmester High-End", "AMG Track Pace", "Nappa Leather", "Performance Exhaust"],
            "images": ["https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?w=800", "https://images.unsplash.com/photo-1580274455191-1c62238fa333?w=800"],
            "is_featured": False,
            "status": "available"
        },
        {
            "brand": "BMW",
            "model": "X7 M50i",
            "year": 2023,
            "price": 98500,
            "mileage": 11200,
            "fuel_type": "Petrol",
            "transmission": "Automatic",
            "body_type": "SUV",
            "color": "Carbon Black",
            "engine": "4.4L Twin-Turbo V8",
            "description": "Ultimate luxury SUV with M Performance DNA. Executive lounge seating and sky lounge panoramic roof.",
            "features": ["Executive Lounge", "Sky Lounge Roof", "Bowers & Wilkins", "6 Seats", "Gesture Control"],
            "images": ["https://images.unsplash.com/photo-1579091337137-3da292da7bc0?w=800", "https://images.unsplash.com/photo-1556189250-72ba954cfc2b?w=800"],
            "is_featured": False,
            "status": "available"
        }
    ]
    
    for car_data in sample_cars:
        car_obj = Car(**car_data)
        doc = car_obj.model_dump()
        doc['created_at'] = doc['created_at'].isoformat()
        doc['updated_at'] = doc['updated_at'].isoformat()
        await db.cars.insert_one(doc)
    
    return {"message": "Database seeded successfully", "count": len(sample_cars)}

# Include the router in the main app
app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get('CORS_ORIGINS', '*').split(','),
    allow_methods=["*"],
    allow_headers=["*"],
)

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()
