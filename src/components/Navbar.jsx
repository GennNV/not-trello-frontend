import React from "react";
import { Link, useLocation } from "wouter";
import { useAuthStore } from "../store/authStore";
import { LogOut, LayoutDashboard, ListTodo, Settings } from "lucide-react";

const Navbar = () => {
  const { user, isAuthenticated, logout } = useAuthStore();
  const [location] = useLocation();

  const handleLogout = () => {
    logout();
  };

  if (!isAuthenticated) return null;

  return (
    <nav className="bg-blue-600 text-white shadow-lg">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-8">
            <Link
              href="/"
              className="flex items-center space-x-2 text-xl font-bold"
            >
              <LayoutDashboard className="w-6 h-6" />
              <span>TrelloClone</span>
            </Link>

            <div className="flex space-x-4">
              <Link
                href="/tableros"
                className={`flex items-center space-x-1 px-3 py-2 rounded hover:bg-blue-700 transition ${
                  location === "/tableros" ? "bg-blue-700" : ""
                }`}
              >
                <ListTodo className="w-4 h-4" />
                <span>Tableros</span>
              </Link>

              {user?.rol === "Admin" && (
                <Link
                  href="/admin"
                  className={`flex items-center space-x-1 px-3 py-2 rounded hover:bg-blue-700 transition ${
                    location === "/admin" ? "bg-blue-700" : ""
                  }`}
                >
                  <Settings className="w-4 h-4" />
                  <span>Admin</span>
                </Link>
              )}
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <div className="text-sm">
              <div className="font-medium">{user?.nombre}</div>
              <div className="text-blue-200 text-xs">{user?.rol}</div>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center space-x-1 px-3 py-2 bg-blue-700 rounded hover:bg-blue-800 transition"
            >
              <LogOut className="w-4 h-4" />
              <span>Salir</span>
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
