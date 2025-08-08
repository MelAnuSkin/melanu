import { LogOut } from "lucide-react";
import { useState } from "react";

export default function Header({ handleLogout }) {
  return (
    <>
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-6 sm:py-8 md:py-12">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4 sm:gap-6">
            
            {/* Title Section */}
            <div className="text-center sm:text-left flex-1 order-1">
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-1 sm:mb-2">
                Admin Dashboard
              </h1>
              <p className="text-blue-100 text-sm sm:text-base md:text-lg">
                Manage your products and customer messages
              </p>
            </div>

            {/* User Info & Logout */}
            <div className="text-center sm:text-right order-2 w-full sm:w-auto">
              <p className="text-blue-100 mb-2 text-sm sm:text-base">
                Welcome, Admin
              </p>
              <button
                onClick={handleLogout}
                className="flex items-center justify-center sm:justify-start gap-2 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md transition-colors text-sm sm:text-base w-full sm:w-auto"
              >
                <LogOut size={16} />
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
