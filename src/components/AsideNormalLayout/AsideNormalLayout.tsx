import { NavLink } from "react-router-dom";
import { userStore } from "../../zustand/userStore";
import axios from "axios";
import {
  Home,
  FileText,
  Activity,
  PieChart,
  Calendar,
  Settings,
  LogOut,
  AlertCircle,
  Users,
  User,
  FileTextIcon,
} from "lucide-react";
import { useEffect } from "react";
import { Tooltip } from "../Tooltip/Tooltip";

const navigationItems = [
  {
    path: "/",
    name: "Home",
    icon: Home,
    allowedRoles: ["patient", "doctor", "owner"],
  },
  {
    path: undefined,
    name: "Appointments",
    icon: Calendar,
    allowedRoles: ["doctor", "owner"],
  },
  {
    path: "/prescription",
    name: "Prescriptions",
    icon: FileText,
    allowedRoles: ["patient", "doctor", "owner"],
  },
  {
    path: "/diagnosis/create",
    name: "Diagnosis",
    icon: Activity,
    allowedRoles: ["doctor"],
  },
  {
    path: undefined,
    name: "Patients",
    icon: Users,
    allowedRoles: ["doctor", "owner"],
  },
  {
    path: "/allergy/create",
    name: "Allergies",
    icon: AlertCircle,
    allowedRoles: ["patient"],
  },
  {
    path: "/analytics",
    name: "Analytics",
    icon: PieChart,
    allowedRoles: ["owner"],
  },
  {
    path: "/reports",
    name: "Reports",
    icon: FileTextIcon,
    allowedRoles: ["owner"],
  },
  {
    path: undefined,
    name: "Settings",
    icon: Settings,
    allowedRoles: ["patient", "doctor", "owner"],
  },
];

function AsideNormalLayout({ isCollapsed, setIsCollapsed }) {
  const { user, role, setAccessToken, setIsAuthenticated, setRole, setUser } =
    userStore();

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setIsCollapsed(true);
      }
    };

    window.addEventListener("resize", handleResize);
    handleResize();

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleLogout = async () => {
    try {
      await axios.delete("https://medical-crm-backend-production.up.railway.app/auth/logout", {
        withCredentials: true,
      });
      setAccessToken("");
      setIsAuthenticated(false);
      setRole(null);
      setUser("");
      window.location.href = "/login";
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <aside
      className={`bg-primary text-white h-full transition-all duration-300 ease-in-out ${
        isCollapsed ? "w-16" : "w-64"
      } flex flex-col h-screen fixed top-0 left-0 shadow-lg`}
    >
      <button
        className="self-end p-2 m-2 hover:bg-purple-600 rounded-lg md:block hidden"
        onClick={() => setIsCollapsed(!isCollapsed)}
      >
        {isCollapsed ? (
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <polyline points="9 18 15 12 9 6" />
          </svg>
        ) : (
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <polyline points="15 18 9 12 15 6" />
          </svg>
        )}
      </button>

      <div
        className={`flex items-center justify-center py-6 ${
          isCollapsed ? "" : "px-4"
        }`}
      >
        <div className="bg-white p-2 rounded">
          <img
            src="/images/logo.png"
            className="w-6 h-6 filter invert sepia saturate-200 hue-rotate-180 brightness-90 contrast-100"
            color="black"
          />
        </div>
        {!isCollapsed && <span className="ml-3 font-bold text-xl">Sanova</span>}
      </div>
      <nav className="flex-1 overflow-y-auto py-4">
        <ul className="space-y-2 px-2">
          {navigationItems
            .filter((item) => item.allowedRoles.includes(role))
            .map((item) => (
              <li key={item.path}>
                <NavLink
                  to={item.path}
                  className={({ isActive }) => `
                    flex items-center p-3 rounded-lg transition-colors relative
                    ${
                      isActive && item.path !== undefined
                        ? "bg-white text-purple-800 font-medium shadow-md"
                        : "text-white  hover:bg-primary-hover hover:bg-opacity-10"
                    }
                    ${isCollapsed ? "justify-center" : "px-4"}
                  `}
                >
                  {({ isActive }) => (
                    <Tooltip content={isCollapsed ? item.name : ""}>
                      <div className="flex items-center w-full z-100">
                        <item.icon
                          size={20}
                          className={
                            isActive && item.path !== undefined
                              ? "text-purple-800"
                              : "text-white"
                          }
                        />
                        {!isCollapsed && (
                          <span
                            className={`ml-3 truncate ${
                              isActive ? "font-medium" : ""
                            }`}
                          >
                            {item.name}
                          </span>
                        )}
                        {isActive && (
                          <div className="absolute left-0 top-0 bottom-0 w-1  rounded-r"></div>
                        )}
                      </div>
                    </Tooltip>
                  )}
                </NavLink>
              </li>
            ))}
        </ul>
      </nav>

      {!isCollapsed && (
        <div className="px-4 py-2 border-t border-purple-600">
          <div className="flex items-center mb-2">
            <div className="bg-purple-800 p-2 rounded-full">
              <User size={16} className="text-white" />
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium truncate">{user || "User"}</p>
              <p className="text-xs text-purple-300 capitalize">{role}</p>
            </div>
          </div>
        </div>
      )}

      <button
        onClick={handleLogout}
        className={`
          flex items-center p-3 cursor-pointer text-red-200 hover:bg-red-500 hover:bg-opacity-20 rounded-lg mb-4 mx-2
          ${isCollapsed ? "justify-center" : "px-4"}
        `}
      >
        <LogOut size={20} className="text-red-200" />
        {!isCollapsed && <span className="ml-3">Logout</span>}
      </button>
    </aside>
  );
}

export default AsideNormalLayout;
