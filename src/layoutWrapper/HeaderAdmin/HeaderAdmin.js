"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import React, { useState, useEffect, useRef } from "react";
import {
  FaBell,
  FaBars,
  FaSignOutAlt,
  FaEllipsisV,
  FaCheck,
  FaSpinner,
} from "react-icons/fa";

import SideNav from "./SlideNav/SideNav";
import {
  getNotifications,
  markAllNotificationIsRead,
  markNotificationIsRead,
} from "@/apiServices/notification";
import { allMenuItems, typeMessageNavigation } from "@/utils/constants";

export default function HeaderAdmin({ isMenuOpen, setIsMenuOpen, isMobile }) {
  const [localIsMenuOpen, setLocalIsMenuOpen] = useState(true);
  const [localIsMobile, setLocalIsMobile] = useState(true);
  const [userRole, setUserRole] = useState(null);
  const [user, setUser] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const router = useRouter();
  const [currentPage, setCurrentPage] = useState(1);
  const [limit, setLimit] = useState(10);

  const notificationRef = useRef(null);
  const scrollRef = useRef(null);

  const effectiveIsMenuOpen =
    isMenuOpen !== undefined ? isMenuOpen : localIsMenuOpen;
  const effectiveSetIsMenuOpen = setIsMenuOpen || setLocalIsMenuOpen;
  const effectiveIsMobile = isMobile !== undefined ? isMobile : localIsMobile;

  useEffect(() => {
    if (typeof window !== "undefined") {
      const userData = JSON.parse(localStorage.getItem("user") || "{}");
      setUser(userData);
      setUserRole(userData.role || null);
    }
  }, []);

  useEffect(() => {
    if (isMobile === undefined && typeof window !== "undefined") {
      setLocalIsMobile(window.innerWidth < 768);

      const handleResize = () => {
        setLocalIsMobile(window.innerWidth < 768);
        if (window.innerWidth >= 1024 && !localIsMobile && localIsMenuOpen) {
          setLocalIsMenuOpen(true);
        }
      };

      window.addEventListener("resize", handleResize);
      return () => window.removeEventListener("resize", handleResize);
    }
  }, [localIsMenuOpen, localIsMobile, isMobile]);

  // Click outside to close notification
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        notificationRef.current &&
        !notificationRef.current.contains(event.target)
      ) {
        setIsNotificationOpen(false);
        setActiveDropdown(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const toggleMenu = () => {
    effectiveSetIsMenuOpen(!effectiveIsMenuOpen);
  };

  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("user");
    router.push("/dang-nhap");
  };

  const menuItems = allMenuItems
    .filter((item) => userRole && item.roles.includes(userRole))
    .map((item) => ({
      ...item,
      submenu: item.submenu
        ? item.submenu.filter((subItem) => subItem.roles.includes(userRole))
        : undefined,
    }));

  const fetchNotifications = async (page = 1, reset = false) => {
    if (isLoading || (!hasMore && !reset)) return;

    setIsLoading(true);
    try {
      const response = await getNotifications(page, limit);
      if (response.data) {
        if (reset) {
          setNotifications(response.data);
        } else {
          setNotifications((prev) => [...prev, ...response.data]);
        }
        setHasMore(response.data.length === limit);
      }
    } catch (error) {
      console.log("Error: ", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications(1, true);
  }, []);

  const handleScroll = () => {
    const scrollElement = scrollRef.current;
    if (scrollElement) {
      const { scrollTop, scrollHeight, clientHeight } = scrollElement;
      if (
        scrollTop + clientHeight >= scrollHeight - 5 &&
        hasMore &&
        !isLoading
      ) {
        setCurrentPage((prev) => {
          const nextPage = prev + 1;
          fetchNotifications(nextPage);
          return nextPage;
        });
      }
    }
  };

  const handleMarkNotificationIsRead = async (_id, event) => {
    event.stopPropagation();
    try {
      const response = await markNotificationIsRead(_id);
      if (response.success) {
        setNotifications((prev) =>
          prev.map((notif) =>
            notif._id === _id ? { ...notif, isRead: true } : notif
          )
        );
      }
    } catch (error) {
      console.log("Error: ", error);
    }
    setActiveDropdown(null);
  };

  const handleNotificationClick = async (notification) => {
    if (activeDropdown === notification._id) return;

    // Đánh dấu đã đọc nếu chưa đọc
    if (!notification.isRead) {
      try {
        const response = await markNotificationIsRead(notification._id);
        if (response.success) {
          setNotifications((prev) =>
            prev.map((notif) =>
              notif._id === notification._id
                ? { ...notif, isRead: true }
                : notif
            )
          );
        }
      } catch (error) {
        console.log("Error marking notification as read: ", error);
      }
    }

    // Chuyển trang
    router.push(typeMessageNavigation[notification.type]);
  };

  const handleAllMarkNotificationsIsRead = async () => {
    try {
      const response = await markAllNotificationIsRead();
      if (response.success) {
        setNotifications((prev) =>
          prev.map((notif) => ({ ...notif, isRead: true }))
        );
      }
    } catch (error) {
      console.log("Error: ", error);
    }
  };

  const toggleNotificationDropdown = () => {
    setIsNotificationOpen(!isNotificationOpen);
    setActiveDropdown(null);
    if (!isNotificationOpen) {
      setCurrentPage(1);
      fetchNotifications(1, true);
    }
  };

  const toggleDropdown = (notificationId, event) => {
    event.stopPropagation();
    setActiveDropdown(
      activeDropdown === notificationId ? null : notificationId
    );
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 1) {
      return "Hôm nay";
    } else if (diffDays === 2) {
      return "Hôm qua";
    } else if (diffDays <= 7) {
      return `${diffDays - 1} ngày trước`;
    } else {
      return date.toLocaleDateString("vi-VN");
    }
  };

  return (
    <div
      className={`flex flex-col transition-all duration-300 ${
        effectiveIsMenuOpen && !effectiveIsMobile ? "ml-70" : "ml-0"
      }`}
    >
      <header className="bg-secondary shadow-sm flex justify-between items-center p-2.5 px-5 sticky top-0 z-30">
        <div className="flex items-center rounded-md">
          <button
            onClick={toggleMenu}
            className="flex items-center justify-center h-10 w-10 rounded-md hover:bg-gray-100 transition-colors"
            aria-label="Toggle menu"
          >
            <FaBars size={20} />
          </button>
        </div>
        <div className="flex items-center">
          <div className="relative" ref={notificationRef}>
            <button
              onClick={toggleNotificationDropdown}
              className="relative flex items-center justify-center h-10 w-10 rounded-md hover:bg-gray-100 transition-colors"
              aria-label="Thông báo"
            >
              <FaBell size={18} className="text-gray-600" />
              {notifications.filter((notif) => !notif.isRead).length > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-xs font-bold">
                    {notifications.filter((notif) => !notif.isRead).length > 99
                      ? "99+"
                      : notifications.filter((notif) => !notif.isRead).length}
                  </span>
                </span>
              )}
            </button>

            {isNotificationOpen && (
              <div className="absolute right-0 mt-2 w-96 bg-white shadow-xl rounded-lg border border-gray-200 z-50 overflow-hidden">
                <div className="p-4 border-b bg-gray-50">
                  <div className="flex justify-between items-center">
                    <h3 className="text-lg font-semibold text-gray-800">
                      Thông báo
                    </h3>
                    <button
                      onClick={handleAllMarkNotificationsIsRead}
                      className="text-sm text-blue-600 hover:text-blue-800 font-medium transition-colors"
                    >
                      Đánh dấu tất cả là đã đọc
                    </button>
                  </div>
                </div>

                <div
                  ref={scrollRef}
                  className="max-h-96 overflow-y-auto"
                  onScroll={handleScroll}
                >
                  {notifications.length === 0 ? (
                    <div className="p-8 text-center">
                      <div className="text-gray-400 mb-2">
                        <FaBell size={24} />
                      </div>
                      <p className="text-gray-500">Không có thông báo</p>
                    </div>
                  ) : (
                    <>
                      {notifications.map((notification) => (
                        <div
                          key={notification._id}
                          onClick={() => handleNotificationClick(notification)}
                          className={`relative p-4 border-b cursor-pointer hover:bg-gray-50 transition-colors ${
                            notification.isRead
                              ? "bg-white opacity-70"
                              : "bg-blue-50 border-l-4 border-l-blue-500"
                          }`}
                        >
                          <div className="flex justify-between items-start">
                            <div className="flex-1 pr-3">
                              <p
                                className={`text-sm ${
                                  notification.isRead
                                    ? "text-gray-600"
                                    : "text-gray-800 font-medium"
                                }`}
                              >
                                {notification.message}
                              </p>
                              <p className="text-xs text-gray-500 mt-1">
                                {formatDate(notification.createdAt)}
                              </p>
                            </div>

                            <div className="relative">
                              <button
                                onClick={(e) =>
                                  toggleDropdown(notification._id, e)
                                }
                                className="p-1 hover:bg-gray-200 rounded-full transition-colors"
                              >
                                <FaEllipsisV
                                  size={12}
                                  className="text-gray-500"
                                />
                              </button>

                              {activeDropdown === notification._id && (
                                <div className="absolute right-0 mt-1 w-48 bg-white shadow-lg rounded-md border border-gray-200 z-60">
                                  {!notification.isRead && (
                                    <button
                                      onClick={(e) =>
                                        handleMarkNotificationIsRead(
                                          notification._id,
                                          e
                                        )
                                      }
                                      className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2"
                                    >
                                      <FaCheck
                                        size={12}
                                        className="text-green-500"
                                      />
                                      Đánh dấu đã đọc
                                    </button>
                                  )}
                                </div>
                              )}
                            </div>
                          </div>

                          {!notification.isRead && (
                            <div className="absolute top-4 right-8 w-2 h-2 bg-blue-500 rounded-full"></div>
                          )}
                        </div>
                      ))}

                      {isLoading && (
                        <div className="p-4 text-center">
                          <FaSpinner
                            className="animate-spin text-gray-500 mx-auto"
                            size={20}
                          />
                        </div>
                      )}

                      {!hasMore && notifications.length > 0 && (
                        <div className="p-4 text-center text-gray-500 text-sm">
                          Không còn thông báo nào
                        </div>
                      )}
                    </>
                  )}
                </div>
              </div>
            )}
          </div>

          <div className="relative ml-2">
            <Image
              height={40}
              width={40}
              src="/images/admin.png"
              alt="User avatar"
              className="rounded-full border-2 border-gray-200"
            />
            <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white" />
          </div>

          <button
            onClick={handleLogout}
            className="ml-2 flex items-center justify-center h-10 w-10 rounded-md hover:bg-gray-100 transition-colors"
            aria-label="Đăng xuất"
            title="Đăng xuất"
          >
            <FaSignOutAlt size={18} className="text-gray-600" />
          </button>
        </div>
      </header>

      <SideNav
        isOpen={effectiveIsMenuOpen}
        menuItems={menuItems}
        isMobile={effectiveIsMobile}
        closeMenu={() => effectiveSetIsMenuOpen(false)}
        userData={user}
      />

      {effectiveIsMenuOpen && effectiveIsMobile && (
        <div
          onClick={toggleMenu}
          className="fixed inset-0 bg-black bg-opacity-50 z-40"
        />
      )}
    </div>
  );
}
