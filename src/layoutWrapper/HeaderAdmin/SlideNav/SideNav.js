import React, { useState } from "react";
import Link from "next/link";
import {
  FaTimes,
  FaChevronDown,
  FaChevronRight,
  FaChevronLeft,
} from "react-icons/fa";
import Image from "next/image";

const SideNav = ({ isOpen, menuItems, isMobile, closeMenu, userData }) => {
  const [expandedMenus, setExpandedMenus] = useState({});

  const toggleSubmenu = (menuKey) => {
    setExpandedMenus((prev) => ({
      ...prev,
      [menuKey]: !prev[menuKey],
    }));
  };

  const SidebarContent = () => (
    <div className="h-full flex flex-col bg-gradient-to-br from-white via-blue-50 to-indigo-100 shadow-xl">
      {/* Header */}
      <div className="p-4 sm:p-6 border-b border-blue-200/50 bg-white/80 backdrop-blur-sm">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2 sm:space-x-3">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center shadow-lg">
              <Image
                src="/images/K.png"
                alt="K Logo"
                height={70}
                width={70}
                priority
              />
            </div>
            <div className="min-w-0 flex-1">
              <h2 className="text-lg sm:text-xl font-bold text-gray-800 truncate">
                Bepanphu
              </h2>
              <p className="text-xs sm:text-sm text-blue-600 truncate">
                Admin Panel
              </p>
            </div>
          </div>
          <button
            onClick={closeMenu}
            className="text-gray-500 hover:text-gray-700 transition-colors p-2 hover:bg-gray-100 rounded-lg flex-shrink-0"
            title="Collapse Sidebar"
          >
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="currentColor"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M8.47365 11.7183C8.11707 12.0749 8.11707 12.6531 8.47365 13.0097L12.071 16.607C12.4615 16.9975 12.4615 17.6305 12.071 18.021C11.6805 18.4115 11.0475 18.4115 10.657 18.021L5.83009 13.1941C5.37164 12.7356 5.37164 11.9924 5.83009 11.5339L10.657 6.707C11.0475 6.31653 11.6805 6.31653 12.071 6.707C12.4615 7.09747 12.4615 7.73053 12.071 8.121L8.47365 11.7183Z"
                fillOpacity="0.9"
              ></path>
              <path
                d="M14.3584 11.8336C14.0654 12.1266 14.0654 12.6014 14.3584 12.8944L18.071 16.607C18.4615 16.9975 18.4615 17.6305 18.071 18.021C17.6805 18.4115 17.0475 18.4115 16.657 18.021L11.6819 13.0459C11.3053 12.6693 11.3053 12.0587 11.6819 11.6821L16.657 6.707C17.0475 6.31653 17.6805 6.31653 18.071 6.707C18.4615 7.09747 18.4615 7.73053 18.071 8.121L14.3584 11.8336Z"
                fillOpacity="0.4"
              ></path>
            </svg>
          </button>
        </div>
      </div>

      {/* Navigation - Hidden Scrollbar */}
      <nav className="flex-1 px-3 sm:px-4 py-4 sm:py-6 overflow-y-auto scrollbar-hide">
        <style jsx>{`
          .scrollbar-hide {
            -ms-overflow-style: none;
            scrollbar-width: none;
          }
          .scrollbar-hide::-webkit-scrollbar {
            display: none;
          }
        `}</style>

        <ul className="space-y-1 sm:space-y-2">
          {menuItems.map((item, index) => (
            <li key={index}>
              {item.hasSubmenu ? (
                <div>
                  <button
                    onClick={() => toggleSubmenu(item.key)}
                    className="w-full flex items-center justify-between py-2.5 sm:py-3 px-3 sm:px-4 rounded-xl text-gray-700 hover:text-gray-900 hover:bg-white/80 hover:shadow-md transition-all duration-200 group"
                  >
                    <div className="flex items-center space-x-2 sm:space-x-3 min-w-0 flex-1">
                      <span className="text-blue-500 group-hover:text-indigo-600 transition-colors flex-shrink-0">
                        {item.icon}
                      </span>
                      <span className="font-medium text-sm sm:text-base truncate">
                        {item.label}
                      </span>
                    </div>
                    <span className="text-gray-400 group-hover:text-gray-600 transition-colors flex-shrink-0">
                      {expandedMenus[item.key] ? (
                        <FaChevronDown size={12} />
                      ) : (
                        <FaChevronRight size={12} />
                      )}
                    </span>
                  </button>

                  {/* Submenu */}
                  <div
                    className={`overflow-hidden transition-all duration-300 ${
                      expandedMenus[item.key]
                        ? "max-h-100 opacity-100"
                        : "max-h-0 opacity-0"
                    }`}
                  >
                    <ul className="mt-2 ml-3 sm:ml-4 space-y-1 border-l-2 border-blue-200 pl-3 sm:pl-4">
                      {item.submenu?.map((subItem, subIndex) => (
                        <li key={subIndex}>
                          <Link
                            href={subItem.link}
                            onClick={isMobile ? closeMenu : undefined}
                          >
                            <span className="flex items-center space-x-2 sm:space-x-3 py-2 sm:py-2.5 px-3 sm:px-4 rounded-lg text-gray-600 hover:text-gray-900 hover:bg-white/60 hover:shadow-sm transition-all duration-200 group">
                              <span className="text-blue-400 group-hover:text-indigo-500 transition-colors flex-shrink-0">
                                {subItem.icon}
                              </span>
                              <span className="text-xs sm:text-sm font-medium truncate">
                                {subItem.label}
                              </span>
                            </span>
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              ) : (
                <Link
                  href={item.link}
                  onClick={isMobile ? closeMenu : undefined}
                >
                  <span className="flex items-center space-x-2 sm:space-x-3 py-2.5 sm:py-3 px-3 sm:px-4 rounded-xl text-gray-700 hover:text-gray-900 hover:bg-white/80 hover:shadow-md transition-all duration-200 group">
                    <span className="text-blue-500 group-hover:text-indigo-600 transition-colors flex-shrink-0">
                      {item.icon}
                    </span>
                    <span className="font-medium text-sm sm:text-base truncate">
                      {item.label}
                    </span>
                  </span>
                </Link>
              )}
            </li>
          ))}
        </ul>
      </nav>

      {/* Footer */}
      <div className="p-3 sm:p-4 border-t border-blue-200/50 bg-white/60 backdrop-blur-sm">
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200/50 rounded-xl p-3 sm:p-4 shadow-sm">
          <div className="flex items-center space-x-2 sm:space-x-3">
            <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full flex items-center justify-center shadow-md flex-shrink-0">
              <span className="text-white text-xs sm:text-sm font-bold">A</span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-gray-800 font-medium text-xs sm:text-sm truncate">
                {userData?.userName || "Admin User"}
              </p>
              <p className="text-blue-600 text-xs truncate">
                {userData?.email || "admin@Bepanphu.com"}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile Sidebar */}
      {isMobile && (
        <>
          {/* Backdrop */}
          {isOpen && (
            <div
              className="fixed inset-0 bg-black/30 backdrop-blur-sm z-40"
              onClick={closeMenu}
            />
          )}
          <div
            className={`fixed top-0 left-0 h-full w-72 sm:w-80 transform transition-transform duration-300 ease-in-out ${
              isOpen ? "translate-x-0" : "-translate-x-full"
            } z-50 shadow-2xl`}
          >
            <SidebarContent />
          </div>
        </>
      )}

      {/* Desktop Sidebar */}
      {!isMobile && (
        <div
          className={`fixed top-0 left-0 h-full w-64 lg:w-72 transform transition-transform duration-300 ease-in-out ${
            isOpen ? "translate-x-0" : "-translate-x-full"
          } z-50 shadow-xl`}
        >
          <SidebarContent />
        </div>
      )}
    </>
  );
};

export default SideNav;
