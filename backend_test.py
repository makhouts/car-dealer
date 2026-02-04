import requests
import sys
import json
from datetime import datetime

class CarDealershipAPITester:
    def __init__(self, base_url="https://vehicle-resale-1.preview.emergentagent.com/api"):
        self.base_url = base_url
        self.tests_run = 0
        self.tests_passed = 0
        self.test_results = []
        self.created_car_id = None
        self.created_inquiry_id = None

    def log_result(self, test_name, success, details="", response_data=None):
        """Log test result"""
        self.tests_run += 1
        if success:
            self.tests_passed += 1
            print(f"✅ {test_name} - PASSED")
        else:
            print(f"❌ {test_name} - FAILED: {details}")
        
        self.test_results.append({
            "test": test_name,
            "success": success,
            "details": details,
            "response_data": response_data
        })

    def run_test(self, name, method, endpoint, expected_status, data=None, headers=None):
        """Run a single API test"""
        url = f"{self.base_url}/{endpoint}" if endpoint else self.base_url
        if headers is None:
            headers = {'Content-Type': 'application/json'}

        print(f"\n🔍 Testing {name}...")
        
        try:
            if method == 'GET':
                response = requests.get(url, headers=headers, timeout=10)
            elif method == 'POST':
                response = requests.post(url, json=data, headers=headers, timeout=10)
            elif method == 'PUT':
                response = requests.put(url, json=data, headers=headers, timeout=10)
            elif method == 'DELETE':
                response = requests.delete(url, headers=headers, timeout=10)

            success = response.status_code == expected_status
            response_data = None
            
            try:
                response_data = response.json()
            except:
                response_data = response.text

            if success:
                self.log_result(name, True, f"Status: {response.status_code}", response_data)
                return True, response_data
            else:
                self.log_result(name, False, f"Expected {expected_status}, got {response.status_code}", response_data)
                return False, response_data

        except Exception as e:
            self.log_result(name, False, f"Error: {str(e)}")
            return False, {}

    def test_root_endpoint(self):
        """Test root API endpoint"""
        return self.run_test("Root API Endpoint", "GET", "", 200)

    def test_seed_database(self):
        """Test database seeding"""
        return self.run_test("Seed Database", "POST", "seed", 200)

    def test_get_cars(self):
        """Test getting all cars"""
        return self.run_test("Get All Cars", "GET", "cars", 200)

    def test_get_featured_cars(self):
        """Test getting featured cars"""
        return self.run_test("Get Featured Cars", "GET", "cars/featured", 200)

    def test_get_brands(self):
        """Test getting car brands"""
        return self.run_test("Get Car Brands", "GET", "cars/brands", 200)

    def test_get_car_stats(self):
        """Test getting car statistics"""
        return self.run_test("Get Car Stats", "GET", "cars/stats", 200)

    def test_car_filters(self):
        """Test car filtering"""
        # Test brand filter
        success1, _ = self.run_test("Filter Cars by Brand", "GET", "cars?brand=BMW", 200)
        
        # Test price filter
        success2, _ = self.run_test("Filter Cars by Price", "GET", "cars?min_price=50000&max_price=150000", 200)
        
        # Test year filter
        success3, _ = self.run_test("Filter Cars by Year", "GET", "cars?min_year=2020&max_year=2024", 200)
        
        # Test fuel type filter
        success4, _ = self.run_test("Filter Cars by Fuel Type", "GET", "cars?fuel_type=Petrol", 200)
        
        return success1 and success2 and success3 and success4

    def test_create_car(self):
        """Test creating a new car"""
        car_data = {
            "brand": "Test Brand",
            "model": "Test Model",
            "year": 2023,
            "price": 75000,
            "mileage": 15000,
            "fuel_type": "Petrol",
            "transmission": "Automatic",
            "body_type": "Sedan",
            "color": "Black",
            "engine": "2.0L Turbo",
            "description": "Test car for API testing",
            "features": ["Test Feature 1", "Test Feature 2"],
            "images": ["https://example.com/test1.jpg", "https://example.com/test2.jpg"],
            "is_featured": False,
            "status": "available"
        }
        
        success, response_data = self.run_test("Create New Car", "POST", "cars", 200, car_data)
        if success and response_data and 'id' in response_data:
            self.created_car_id = response_data['id']
        return success

    def test_get_specific_car(self):
        """Test getting a specific car by ID"""
        if not self.created_car_id:
            self.log_result("Get Specific Car", False, "No car ID available from previous test")
            return False
        
        return self.run_test("Get Specific Car", "GET", f"cars/{self.created_car_id}", 200)[0]

    def test_update_car(self):
        """Test updating a car"""
        if not self.created_car_id:
            self.log_result("Update Car", False, "No car ID available from previous test")
            return False
        
        update_data = {
            "price": 80000,
            "description": "Updated test car description",
            "is_featured": True
        }
        
        return self.run_test("Update Car", "PUT", f"cars/{self.created_car_id}", 200, update_data)[0]

    def test_create_inquiry(self):
        """Test creating an inquiry"""
        if not self.created_car_id:
            self.log_result("Create Inquiry", False, "No car ID available for inquiry")
            return False
        
        inquiry_data = {
            "car_id": self.created_car_id,
            "name": "Test Customer",
            "email": "test@example.com",
            "phone": "+1234567890",
            "message": "I'm interested in this test car"
        }
        
        success, response_data = self.run_test("Create Inquiry", "POST", "inquiries", 200, inquiry_data)
        if success and response_data and 'id' in response_data:
            self.created_inquiry_id = response_data['id']
        return success

    def test_get_inquiries(self):
        """Test getting all inquiries"""
        return self.run_test("Get All Inquiries", "GET", "inquiries", 200)[0]

    def test_get_inquiry_stats(self):
        """Test getting inquiry statistics"""
        return self.run_test("Get Inquiry Stats", "GET", "inquiries/stats", 200)[0]

    def test_update_inquiry_status(self):
        """Test updating inquiry status"""
        if not self.created_inquiry_id:
            self.log_result("Update Inquiry Status", False, "No inquiry ID available")
            return False
        
        return self.run_test("Update Inquiry Status", "PUT", f"inquiries/{self.created_inquiry_id}/status?status=contacted", 200)[0]

    def test_contact_form(self):
        """Test contact form submission"""
        contact_data = {
            "name": "Test Contact",
            "email": "contact@example.com",
            "phone": "+1234567890",
            "message": "This is a test contact message"
        }
        
        return self.run_test("Submit Contact Form", "POST", "contact", 200, contact_data)[0]

    def test_get_contacts(self):
        """Test getting contact messages"""
        return self.run_test("Get Contact Messages", "GET", "contacts", 200)[0]

    def test_admin_login(self):
        """Test admin login"""
        # Test valid credentials
        valid_creds = {
            "username": "admin",
            "password": "velocita2024"
        }
        success1, _ = self.run_test("Admin Login (Valid)", "POST", "admin/login", 200, valid_creds)
        
        # Test invalid credentials
        invalid_creds = {
            "username": "admin",
            "password": "wrongpassword"
        }
        success2, _ = self.run_test("Admin Login (Invalid)", "POST", "admin/login", 401, invalid_creds)
        
        return success1 and success2

    def test_delete_car(self):
        """Test deleting a car (cleanup)"""
        if not self.created_car_id:
            self.log_result("Delete Car", False, "No car ID available for deletion")
            return False
        
        return self.run_test("Delete Car", "DELETE", f"cars/{self.created_car_id}", 200)[0]

    def run_all_tests(self):
        """Run all API tests"""
        print("🚀 Starting Car Dealership API Tests")
        print("=" * 50)
        
        # Basic API tests
        self.test_root_endpoint()
        self.test_seed_database()
        
        # Car-related tests
        self.test_get_cars()
        self.test_get_featured_cars()
        self.test_get_brands()
        self.test_get_car_stats()
        self.test_car_filters()
        
        # CRUD operations
        self.test_create_car()
        self.test_get_specific_car()
        self.test_update_car()
        
        # Inquiry tests
        self.test_create_inquiry()
        self.test_get_inquiries()
        self.test_get_inquiry_stats()
        self.test_update_inquiry_status()
        
        # Contact form tests
        self.test_contact_form()
        self.test_get_contacts()
        
        # Admin tests
        self.test_admin_login()
        
        # Cleanup
        self.test_delete_car()
        
        # Print results
        print("\n" + "=" * 50)
        print(f"📊 Test Results: {self.tests_passed}/{self.tests_run} tests passed")
        
        if self.tests_passed == self.tests_run:
            print("🎉 All tests passed!")
            return 0
        else:
            print("⚠️  Some tests failed. Check the details above.")
            failed_tests = [r for r in self.test_results if not r['success']]
            print("\nFailed Tests:")
            for test in failed_tests:
                print(f"  - {test['test']}: {test['details']}")
            return 1

def main():
    tester = CarDealershipAPITester()
    return tester.run_all_tests()

if __name__ == "__main__":
    sys.exit(main())