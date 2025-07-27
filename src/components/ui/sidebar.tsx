"use client";
import React, { useState, useEffect } from "react";
import {
  Home,
  User,
  Settings,
  LogOut,
  Menu,
  X,
  ChevronLeft,
  ChevronRight,
  BarChart3,
  FileText,
  Bell,
  Search,
  HelpCircle,
} from "lucide-react";

// Add custom styles for animations
const sidebarStyles = `
  @keyframes slideInLeft {
    from {
      opacity: 0;
      transform: translateX(-20px);
    }
    to {
      opacity: 1;
      transform: translateX(0);
    }
  }
  
  .scrollbar-thin::-webkit-scrollbar {
    width: 4px;
  }
  
  .scrollbar-thumb-emerald-200::-webkit-scrollbar-thumb {
    background-color: rgb(167 243 208);
    border-radius: 2px;
  }
  
  .scrollbar-track-transparent::-webkit-scrollbar-track {
    background: transparent;
  }
`;

interface NavigationItem {
  id: string;
  name: string;
  icon: React.ComponentType<{ className?: string }>;
  href: string;
  badge?: string;
}

interface SidebarProps {
  className?: string;
}

// Updated navigation items - remove logout from here
const navigationItems: NavigationItem[] = [
  { id: "dashboard", name: "Dashboard", icon: Home, href: "/dashboard" },
  { id: "analytics", name: "Analytics", icon: BarChart3, href: "/analytics" },
  {
    id: "documents",
    name: "Documents",
    icon: FileText,
    href: "/documents",
    badge: "3",
  },
  {
    id: "notifications",
    name: "Notifications",
    icon: Bell,
    href: "/notifications",
    badge: "12",
  },
  { id: "profile", name: "Profile", icon: User, href: "/profile" },
  { id: "settings", name: "Settings", icon: Settings, href: "/settings" },
  { id: "help", name: "Help & Support", icon: HelpCircle, href: "/help" },
];

export function Sidebar({ className = "" }: SidebarProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [activeItem, setActiveItem] = useState("dashboard");

  // Auto-open sidebar on desktop
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setIsOpen(true);
      } else {
        setIsOpen(false);
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const toggleSidebar = () => setIsOpen(!isOpen);
  const toggleCollapse = () => setIsCollapsed(!isCollapsed);

  const handleItemClick = (itemId: string) => {
    setActiveItem(itemId);
    if (window.innerWidth < 768) {
      setIsOpen(false);
    }
  };

  return (
    <>
      <style jsx>{sidebarStyles}</style>
      {/* Mobile hamburger button */}
      <button
        onClick={toggleSidebar}
        className="fixed top-6 left-6 z-50 p-3 rounded-lg bg-white dark:bg-slate-800 shadow-md border border-slate-100 dark:border-slate-700 md:hidden hover:bg-slate-50 dark:hover:bg-slate-700 hover:shadow-lg hover:scale-105 transition-all duration-300 ease-out"
        aria-label="Toggle sidebar"
      >
        <div className="relative w-5 h-5">
          <X className={`absolute inset-0 h-5 w-5 text-slate-600 dark:text-slate-300 transition-all duration-300 ease-in-out ${isOpen ? 'opacity-100 rotate-0 scale-100' : 'opacity-0 rotate-90 scale-75'}`} />
          <Menu className={`absolute inset-0 h-5 w-5 text-slate-600 dark:text-slate-300 transition-all duration-300 ease-in-out ${!isOpen ? 'opacity-100 rotate-0 scale-100' : 'opacity-0 -rotate-90 scale-75'}`} />
        </div>
      </button>

      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/40 dark:bg-black/60 backdrop-blur-sm z-30 md:hidden animate-in fade-in duration-300"
          onClick={toggleSidebar}
        />
      )}

      {/* Sidebar */}
      <div
        className={`
          fixed top-0 left-0 h-full bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-700 z-40 transition-all duration-500 ease-in-out flex flex-col shadow-xl dark:shadow-2xl
          ${isOpen ? "translate-x-0" : "-translate-x-full"}
          ${isCollapsed ? "w-20" : "w-72"}
          md:translate-x-0 md:static md:z-auto md:shadow-none dark:md:shadow-none
          ${className}
        `}
      >
        {/* Header with logo and collapse button */}
        <div className="flex items-center justify-between p-5 border-b border-slate-200 dark:border-slate-700 bg-gradient-to-r from-slate-50/80 to-emerald-50/20 dark:from-slate-800/80 dark:to-emerald-900/20">
          <div className={`flex items-center transition-all duration-500 ease-out ${isCollapsed ? 'justify-center w-full' : 'space-x-2.5'}`}>
            <div className="w-9 h-9 bg-gradient-to-br from-emerald-500 to-emerald-600 dark:from-emerald-400 dark:to-emerald-500 rounded-lg flex items-center justify-center shadow-md hover:shadow-lg transition-all duration-300 hover:scale-105">
              <span className="text-white font-bold text-base">D</span>
            </div>
            
            <div className={`flex flex-col transition-all duration-500 ease-out overflow-hidden ${isCollapsed ? 'w-0 opacity-0' : 'w-auto opacity-100'}`}>
              <span className="font-semibold text-slate-800 dark:text-slate-100 text-base whitespace-nowrap">
                DoctorNet
              </span>
              <span className="text-xs text-slate-500 dark:text-slate-400 whitespace-nowrap">
                Healthcare Platform
              </span>
            </div>
          </div>

          {/* Desktop collapse button */}
          <button
            onClick={toggleCollapse}
            className={`hidden md:flex p-1.5 rounded-md hover:bg-emerald-50 dark:hover:bg-emerald-900/30 hover:scale-110 transition-all duration-300 ease-out ${isCollapsed ? 'ml-0' : 'ml-2'}`}
            aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            <ChevronRight className={`h-4 w-4 text-emerald-500 dark:text-emerald-400 transition-all duration-500 ease-out ${isCollapsed ? 'rotate-0' : 'rotate-180'}`} />
          </button>
        </div>

        {/* Search Bar */}
        <div className={`px-4 transition-all duration-500 ease-out overflow-hidden ${isCollapsed ? 'py-0 max-h-0 opacity-0' : 'py-3 max-h-20 opacity-100'}`}>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-3.5 w-3.5 text-emerald-400 dark:text-emerald-300 transition-colors duration-300" />
            <input
              type="text"
              placeholder="Search..."
              className="w-full pl-9 pr-4 py-2 bg-gradient-to-r from-slate-50 to-emerald-50/30 dark:from-slate-800 dark:to-emerald-900/30 border border-slate-200 dark:border-slate-600 rounded-lg text-sm placeholder-slate-400 dark:placeholder-slate-500 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-emerald-400 dark:focus:ring-emerald-500 focus:border-emerald-300 dark:focus:border-emerald-400 focus:bg-white dark:focus:bg-slate-800 focus:shadow-md transition-all duration-300 ease-out hover:shadow-sm"
            />
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3 py-2 overflow-y-auto scrollbar-thin scrollbar-thumb-emerald-200 scrollbar-track-transparent">
          <ul className="space-y-1">
            {navigationItems.map((item, index) => {
              const Icon = item.icon;
              const isActive = activeItem === item.id;

              return (
                <li 
                  key={item.id}
                  className={`transform transition-all duration-300 ease-out`}
                  style={{ 
                    animationDelay: `${index * 50}ms`,
                    animation: isOpen ? 'slideInLeft 0.5s ease-out forwards' : 'none'
                  }}
                >
                  <button
                    onClick={() => handleItemClick(item.id)}
                    className={`
                      w-full flex items-center px-3 py-2.5 rounded-xl text-left transition-all duration-300 ease-out group relative overflow-hidden hover:scale-105 hover:shadow-sm
                      ${
                        isActive
                          ? "bg-gradient-to-r from-emerald-50 to-emerald-100/50 dark:from-emerald-900/50 dark:to-emerald-800/30 text-emerald-700 dark:text-emerald-300 shadow-sm border border-emerald-200/50 dark:border-emerald-700/50"
                          : "text-slate-600 dark:text-slate-300 hover:bg-gradient-to-r hover:from-slate-50 hover:to-emerald-50/30 dark:hover:from-slate-800/50 dark:hover:to-emerald-900/20 hover:text-slate-900 dark:hover:text-slate-100"
                      }
                      ${isCollapsed ? "justify-center px-2" : "space-x-3"}
                    `}
                    title={isCollapsed ? item.name : undefined}
                  >
                    {/* Active indicator */}
                    <div className={`absolute left-0 top-1/2 transform -translate-y-1/2 w-1 rounded-r-full bg-emerald-500 dark:bg-emerald-400 transition-all duration-300 ease-out ${isActive ? 'h-8 opacity-100' : 'h-0 opacity-0'}`} />
                    
                    <div className="flex items-center justify-center min-w-[24px] relative">
                      <Icon
                        className={`
                          h-5 w-5 flex-shrink-0 transition-all duration-300 ease-out
                          ${
                            isActive
                              ? "text-emerald-600 dark:text-emerald-400 scale-110"
                              : "text-slate-500 dark:text-slate-400 group-hover:text-emerald-500 dark:group-hover:text-emerald-400 group-hover:scale-105"
                          }
                        `}
                      />
                    </div>

                    <div className={`flex items-center justify-between w-full transition-all duration-500 ease-out overflow-hidden ${isCollapsed ? 'max-w-0 opacity-0' : 'max-w-full opacity-100'}`}>
                      <span
                        className={`text-sm whitespace-nowrap transition-all duration-300 ${
                          isActive ? "font-semibold" : "font-medium"
                        }`}
                      >
                        {item.name}
                      </span>
                      {item.badge && (
                        <span
                          className={`
                            px-2 py-0.5 text-xs font-medium rounded-full transition-all duration-300 ease-out hover:scale-110
                            ${
                              isActive
                                ? "bg-emerald-200 dark:bg-emerald-800 text-emerald-800 dark:text-emerald-200 shadow-sm"
                                : "bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300 group-hover:bg-emerald-100 dark:group-hover:bg-emerald-800 group-hover:text-emerald-700 dark:group-hover:text-emerald-300"
                            }
                          `}
                        >
                          {item.badge}
                        </span>
                      )}
                    </div>

                    {/* Badge for collapsed state */}
                    {isCollapsed && item.badge && (
                      <div className="absolute -top-1 -right-1 w-5 h-5 flex items-center justify-center rounded-full bg-emerald-500 dark:bg-emerald-400 border-2 border-white dark:border-slate-900 shadow-md animate-pulse">
                        <span className="text-[10px] font-bold text-white dark:text-slate-900">
                          {parseInt(item.badge) > 9 ? "9+" : item.badge}
                        </span>
                      </div>
                    )}

                    {/* Tooltip for collapsed state */}
                    {isCollapsed && (
                      <div className="absolute left-full ml-3 px-3 py-2 bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 text-sm rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 ease-out whitespace-nowrap z-50 shadow-lg border border-slate-700 dark:border-slate-300">
                        {item.name}
                        {item.badge && (
                          <span className="ml-2 px-1.5 py-0.5 bg-emerald-600 dark:bg-emerald-500 text-white dark:text-slate-900 rounded-full text-xs font-medium">
                            {item.badge}
                          </span>
                        )}
                        <div className="absolute left-0 top-1/2 transform -translate-y-1/2 -translate-x-1 w-2 h-2 bg-slate-900 dark:bg-slate-100 rotate-45 border-l border-b border-slate-700 dark:border-slate-300" />
                      </div>
                    )}
                  </button>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Bottom section with profile and logout */}
        <div className="mt-auto border-t border-slate-200/50 dark:border-slate-700/50 bg-gradient-to-r from-slate-50/50 to-emerald-50/20 dark:from-slate-800/50 dark:to-emerald-900/20">
          {/* Profile Section */}
          <div className={`border-b border-slate-200/50 dark:border-slate-700/50 transition-all duration-500 ease-out ${isCollapsed ? "py-4 px-2" : "p-4"}`}>
            <div className={`flex items-center transition-all duration-500 ease-out hover:scale-105 ${isCollapsed ? 'justify-center' : 'px-3 py-2 rounded-xl bg-white/70 dark:bg-slate-800/70 hover:bg-white dark:hover:bg-slate-800 hover:shadow-md'}`}>
              <div className="relative">
                <div className="w-9 h-9 bg-gradient-to-br from-emerald-400 to-emerald-600 dark:from-emerald-300 dark:to-emerald-500 rounded-full flex items-center justify-center shadow-md transition-all duration-300 hover:shadow-lg">
                  <span className="text-white dark:text-slate-900 font-bold text-sm">JD</span>
                </div>
                <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-400 dark:bg-green-300 rounded-full border-2 border-white dark:border-slate-900 shadow-sm animate-pulse" />
              </div>
              
              <div className={`flex-1 min-w-0 ml-3 transition-all duration-500 ease-out overflow-hidden ${isCollapsed ? 'max-w-0 opacity-0' : 'max-w-full opacity-100'}`}>
                <p className="text-sm font-semibold text-slate-800 dark:text-slate-100 truncate">
                  Dr. John Doe
                </p>
                <p className="text-xs text-emerald-600 dark:text-emerald-400 truncate font-medium">
                  Healthcare Admin
                </p>
              </div>
            </div>
          </div>

          {/* Logout Button */}
          <div className="p-3">
            <button
              onClick={() => handleItemClick("logout")}
              className={`
                w-full flex items-center rounded-xl text-left transition-all duration-300 ease-out group hover:scale-105
                text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/30 hover:text-red-700 dark:hover:text-red-300 hover:shadow-sm
                ${
                  isCollapsed
                    ? "justify-center p-3"
                    : "space-x-3 px-3 py-2.5"
                }
              `}
              title={isCollapsed ? "Logout" : undefined}
            >
              <div className="flex items-center justify-center min-w-[24px]">
                <LogOut className="h-5 w-5 flex-shrink-0 text-red-500 dark:text-red-400 group-hover:text-red-600 dark:group-hover:text-red-300 transition-all duration-300 group-hover:scale-110" />
              </div>

              <span className={`text-sm font-medium transition-all duration-500 ease-out overflow-hidden whitespace-nowrap ${isCollapsed ? 'max-w-0 opacity-0' : 'max-w-full opacity-100'}`}>
                Logout
              </span>

              {/* Tooltip for collapsed state */}
              {isCollapsed && (
                <div className="absolute left-full ml-3 px-3 py-2 bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 text-sm rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 ease-out whitespace-nowrap z-50 shadow-lg">
                  Logout
                  <div className="absolute left-0 top-1/2 transform -translate-y-1/2 -translate-x-1 w-2 h-2 bg-slate-900 dark:bg-slate-100 rotate-45" />
                </div>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div
        className={`
          transition-all duration-500 ease-in-out w-full
          ${isCollapsed ? "md:ml-20" : "md:ml-72"}
        `}
      >
        {/* Your content remains the same */}
      </div>
    </>
  );
}
