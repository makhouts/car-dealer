import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { ArrowLeft, Lock, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

const AdminLogin = () => {
  const navigate = useNavigate();
  const [credentials, setCredentials] = useState({
    username: "",
    password: ""
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await axios.post(`${API}/admin/login`, credentials);
      if (response.data.success) {
        localStorage.setItem("adminLoggedIn", "true");
        toast.success("Login successful!");
        navigate("/admin/dashboard");
      }
    } catch (error) {
      toast.error("Invalid credentials. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-zinc-950 flex items-center justify-center p-6 noise-overlay">
      <div className="relative z-10 w-full max-w-md">
        {/* Back Link */}
        <Link to="/" className="inline-flex items-center gap-2 text-zinc-400 hover:text-white mb-8 transition-colors" data-testid="back-to-home-link">
          <ArrowLeft size={18} />
          Back to Website
        </Link>

        {/* Login Card */}
        <div className="glass rounded-2xl p-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-white mb-2">Admin Portal</h1>
            <p className="text-zinc-400">Sign in to manage your inventory</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="relative">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500" size={18} />
              <input
                type="text"
                placeholder="Username"
                value={credentials.username}
                onChange={(e) => setCredentials({ ...credentials, username: e.target.value })}
                className="w-full bg-zinc-900/50 border border-zinc-800 rounded-xl pl-12 pr-4 py-4 text-white placeholder:text-zinc-600 focus:border-white focus:outline-none transition-colors"
                required
                data-testid="admin-username"
              />
            </div>

            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500" size={18} />
              <input
                type="password"
                placeholder="Password"
                value={credentials.password}
                onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
                className="w-full bg-zinc-900/50 border border-zinc-800 rounded-xl pl-12 pr-4 py-4 text-white placeholder:text-zinc-600 focus:border-white focus:outline-none transition-colors"
                required
                data-testid="admin-password"
              />
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-white text-black hover:bg-zinc-200 rounded-full py-6 text-lg font-medium"
              data-testid="admin-login-btn"
            >
              {loading ? "Signing in..." : "Sign In"}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-zinc-500 text-sm">
              Default credentials: admin / velocita2024
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
