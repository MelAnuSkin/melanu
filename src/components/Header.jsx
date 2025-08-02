import { LogOut } from "lucide-react";
import { useState } from "react";




export default function Header({handleLogout}) {


    return(
        <>
        <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-12">
          <div className="container mx-auto px-4">
            <div className="flex justify-between items-center">
              <div className="text-center flex-1">
                <h1 className="text-4xl font-bold mb-2">Admin Dashboard</h1>
                <p className="text-blue-100">Manage your products and customer messages</p>
              </div>
              <div className="text-right">
                <p className="text-blue-100 mb-2">Welcome, Admin</p>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-2 bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-md transition-colors text-sm cursor-pointer"
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