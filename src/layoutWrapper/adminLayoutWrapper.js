"use client";

import React, { useState, useEffect } from "react";
import HeaderAdmin from "./HeaderAdmin/HeaderAdmin";

export default function AdminLayoutWrapper({ children }) {
  const [isMenuOpen, setIsMenuOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    // Check if we're on client-side
    if (typeof window !== "undefined") {
      // Initial check
      setIsMobile(window.innerWidth < 768);

      // Set up resize listener
      const handleResize = () => {
        setIsMobile(window.innerWidth < 768);
      };

      window.addEventListener("resize", handleResize);
      return () => window.removeEventListener("resize", handleResize);
    }
  }, []);

  return (
    <div className="flex flex-col min-h-screen">
      <HeaderAdmin
        isMenuOpen={isMenuOpen}
        setIsMenuOpen={setIsMenuOpen}
        isMobile={isMobile}
      />
      <main
        className={`flex-grow p-4 bg-white transition-all duration-300 md:p-6 ${
          isMenuOpen && !isMobile ? "ml-70" : "ml-0"
        }`}
      >
        {children}
      </main>

      {isMenuOpen && isMobile && (
        <div
          onClick={() => setIsMenuOpen(false)}
          className="fixed inset-0 bg-white bg-opacity-50 z-40"
        ></div>
      )}
    </div>
  );
}
