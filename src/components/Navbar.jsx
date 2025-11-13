import React, { useState } from "react";
import { Link, useLocation } from "wouter";
import { useAuthStore } from "../store/authStore";
import { useThemeStore } from "../store/themeStore";
import { LogOut, LayoutDashboard, ListTodo, Settings, Moon, Sun, ImageIcon } from "lucide-react";
import BackgroundModal from "./BackgroundModal";

const Navbar = () => {
  const { user, isAuthenticated, logout } = useAuthStore();
  const { isDark, toggleTheme } = useThemeStore();
  const [location] = useLocation();
  const [showBackgroundModal, setShowBackgroundModal] = useState(false);

  const handleLogout = () => {
    logout();
  };

  if (!isAuthenticated) return null;

  return (
    <nav className="bg-blue-600 dark:bg-gray-800 text-white shadow-lg transition-colors duration-200">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-8">
            <Link
              href="/"
              className="flex items-center space-x-2 text-xl font-bold cursor-pointer hover:opacity-80 transition"
            >
              <LayoutDashboard className="w-6 h-6" />
              <span>Not-Trello</span>
            </Link>

            <div className="flex space-x-4">
              <Link
                href="/tableros"
                className={`flex items-center space-x-1 px-3 py-2 rounded hover:bg-blue-700 dark:hover:bg-gray-700 transition cursor-pointer ${
                  location === "/tableros" ? "bg-blue-700 dark:bg-gray-700" : ""
                }`}
              >
                <ListTodo className="w-4 h-4" />
                <span>Tableros</span>
              </Link>

              {user?.rol === "Admin" && (
                <Link
                  href="/admin"
                  className={`flex items-center space-x-1 px-3 py-2 rounded hover:bg-blue-700 dark:hover:bg-gray-700 transition cursor-pointer ${
                    location === "/admin" ? "bg-blue-700 dark:bg-gray-700" : ""
                  }`}
                >
                  <Settings className="w-4 h-4" />
                  <span>Admin</span>
                </Link>
              )}
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <button
              onClick={() => setShowBackgroundModal(true)}
              className="flex items-center justify-center w-10 h-10 bg-blue-700 dark:bg-gray-700 rounded-full hover:bg-blue-800 dark:hover:bg-gray-600 transition cursor-pointer"
              title="Cambiar fondo"
            >
              <ImageIcon className="w-5 h-5" />
            </button>
            <button
              onClick={toggleTheme}
              className="flex items-center justify-center w-10 h-10 bg-blue-700 dark:bg-gray-700 rounded-full hover:bg-blue-800 dark:hover:bg-gray-600 transition cursor-pointer"
              title={isDark ? "Modo claro" : "Modo oscuro"}
            >
              {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>
            <div className="text-sm">
              <div className="font-medium">{user?.nombre}</div>
              <div className="text-blue-200 dark:text-gray-400 text-xs">{user?.rol}</div>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center space-x-1 px-3 py-2 bg-blue-700 dark:bg-gray-700 rounded hover:bg-blue-800 dark:hover:bg-gray-600 transition cursor-pointer"
            >
              <LogOut className="w-4 h-4" />
              <span>Salir</span>
            </button>
          </div>
        </div>
      </div>
      
      <BackgroundModal 
        isOpen={showBackgroundModal} 
        onClose={() => setShowBackgroundModal(false)} 
      />
    </nav>
  );
};

export default Navbar;
