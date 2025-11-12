import React, { useState } from "react";
import { Link, useLocation } from "wouter";
import { useAuthStore } from "../store/authStore";
import { useThemeStore } from "../store/themeStore";
import { LogOut, LayoutDashboard, ListTodo, Settings, Moon, Sun, Image } from "lucide-react";
import BackgroundModal from "./BackgroundModal";

const Navbar = () => {
  const { user, isAuthenticated, logout } = useAuthStore();
  const { darkMode, toggleDarkMode } = useThemeStore();
  const [location] = useLocation();
  const [showBackgroundModal, setShowBackgroundModal] = useState(false);

  const handleLogout = () => {
    logout();
  };

  if (!isAuthenticated) return null;

  const navStyle = {
    backgroundColor: darkMode ? 'rgb(31, 41, 55)' : 'rgb(37, 99, 235)',
    transition: 'background-color 0.2s'
  };

  const hoverBtnStyle = darkMode ? 'hover:bg-gray-700' : 'hover:bg-blue-700';
  const activeBtnStyle = darkMode ? 'bg-gray-700' : 'bg-blue-700';
  const secondaryTextStyle = darkMode ? 'text-gray-400' : 'text-blue-200';

  return (
    <nav className="text-white shadow-lg transition-colors duration-200" style={navStyle}>
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-8">
            <Link href="/" className="flex items-center space-x-2 text-xl font-bold">
              <LayoutDashboard className="w-6 h-6" />
              <span>TrelloClone</span>
            </Link>

            <div className="flex space-x-4">
              <Link 
                href="/tableros"
                className={`flex items-center space-x-1 px-3 py-2 rounded ${hoverBtnStyle} transition ${
                  location === "/tableros" ? activeBtnStyle : ""
                }`}
              >
                <ListTodo className="w-4 h-4" />
                <span>Tableros</span>
              </Link>

              {user?.rol === "Admin" && (
                <Link 
                  href="/admin"
                  className={`flex items-center space-x-1 px-3 py-2 rounded ${hoverBtnStyle} transition ${
                    location === "/admin" ? activeBtnStyle : ""
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
              className={`p-2 rounded ${hoverBtnStyle} transition`}
              title="Cambiar fondo"
            >
              <Image className="w-5 h-5" />
            </button>
            <button
              onClick={toggleDarkMode}
              className={`p-2 rounded ${hoverBtnStyle} transition`}
              title={darkMode ? "Modo claro" : "Modo oscuro"}
            >
              {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>
            <div className="text-sm">
              <div className="font-medium">{user?.nombre}</div>
              <div className={`text-xs ${secondaryTextStyle}`}>{user?.rol}</div>
            </div>
            <button
              onClick={handleLogout}
              className={`flex items-center space-x-1 px-3 py-2 ${activeBtnStyle} rounded hover:bg-blue-800 transition`}
              style={darkMode ? { backgroundColor: 'rgb(55, 65, 81)' } : {}}
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
