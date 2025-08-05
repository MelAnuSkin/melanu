import { LogOut } from "lucide-react";
import { useState } from "react";

export default function Header({handleLogout}) {
    return(
        <>
        <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-8 sm:py-12">
          <div className="container mx-auto px-4">
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4 sm:gap-0">
              {/* Title Section - Mobile Responsive */}
              <div className="text-center flex-1 order-1 sm:order-1">
                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-1 sm:mb-2">Admin Dashboard</h1>
                <p className="text-blue-100 text-sm sm:text-base">Manage your products and customer messages</p>
              </div>
              
              {/* User Info & Logout - Mobile Responsive */}
              <div className="text-center sm:text-right order-2 sm:order-2">
                <p className="text-blue-100 mb-2 text-sm sm:text-base">Welcome, Admin</p>
                <button
                  onClick={handleLogout}
                  className="flex items-center justify-center sm:justify-start gap-2 bg-red-500 hover:bg-red-600 text-white px-3 py-1.5 sm:py-1 rounded-md transition-colors text-sm cursor-pointer mx-auto sm:mx-0"
                >
                  <LogOut size={14} />
                  Logout
                </button>
              </div>
            </div>
          </div>
        </div> 
        </>
    )
}