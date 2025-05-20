import { NavLink, useNavigate } from "react-router-dom";
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
  FileTextIcon,
} from "lucide-react";
import { useEffect } from "react";
import { BASEURL } from "../../axios/instance";

const navigationItems = [
  {
    path: "/dashboard",
    name: "Dashboard",
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
  const { user, setAccessToken, setUser } = userStore();
  const navigate = useNavigate();

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
      await axios.delete(`${BASEURL}/auth/logout`, {
        withCredentials: true,
      });
      setAccessToken("");
      setUser(null);
      navigate("/auth/login");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <aside
      className={`bg-purple-700 w-72 justify-between text-white h-screen flex flex-col p-6 gap-6 sticky top-0 left-0 shadow-lg`}
    >
      <div className="flex flex-col gap-10">
        <div className={`flex items-center gap-4`}>
          <img src="/images/logo.png" className="w-8" color="black" />
          <span className="font-bold text-xl">Sanova</span>
        </div>
        <ul className="flex flex-col gap-3">
          {navigationItems
            .filter((item) => item.allowedRoles.includes(user.role))
            .map((item) => (
              <li key={item.path}>
                <NavLink
                  to={item.path}
                  className={({ isActive }) => `
                    flex items-center p-3 rounded-lg transition-colors relative
                    ${
                      isActive && item.path !== undefined
                        ? "bg-white text-purple-700 font-medium shadow-md"
                        : "text-white hover:bg-white/15"
                    }
                    ${isCollapsed ? "justify-center" : "px-4"}
                  `}
                >
                  {({ isActive }) => (
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
                  )}
                </NavLink>
              </li>
            ))}
        </ul>
      </div>

      <button
        onClick={handleLogout}
        className={`flex items-center p-3 bg-white text-purple-700 cursor-pointer hover:bg-red-400 hover:text-white rounded-lg transition-colors`}
      >
        <LogOut size={20} />
        <span className="ml-3">Logout</span>
      </button>
    </aside>
  );
}

export default AsideNormalLayout;
