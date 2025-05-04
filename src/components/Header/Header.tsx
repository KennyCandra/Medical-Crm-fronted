import { useEffect, useRef, useState } from "react";
import { userStore } from "../../zustand/userStore";
import { Search, Bell, User } from "lucide-react";
import useFetchPatientData from "../../Services/usePatientData";
import { Link } from "react-router-dom";

function Header() {
  const { user, role } = userStore();
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const dropdownRef = useRef(null);
  const searchInputRef = useRef(null);
  const [searchValue, setSearchValue] = useState("");

  const patientData = useFetchPatientData(searchValue);
  const isDoctor = role === "doctor";
  const isAdmin = role === "owner";
  const showSearch = isDoctor || isAdmin;

  useEffect(() => {
    function handleClickOutside(event) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target) &&
        searchInputRef.current &&
        !searchInputRef.current.contains(event.target)
      ) {
        setDropdownVisible(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleSelectPatient = (selectedPatient) => {
    setSearchValue(selectedPatient.fullname);
    setDropdownVisible(false);
  };

  const userType =
    role === "patient" ? "patient" : role === "doctor" ? "doctor" : "admin";

  return (
    <header className="bg-white border-b border-gray-200 py-2 px-4">
      <div className="flex justify-between items-center">
        <div className="flex items-center">
          <div className="bg-purple-700 text-white p-2 rounded mr-2">
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M12 3L20 7.5V16.5L12 21L4 16.5V7.5L12 3Z"
                stroke="white"
                strokeWidth="2"
                strokeLinejoin="round"
              />
              <path
                d="M12 8L16 10.5V15.5L12 18L8 15.5V10.5L12 8Z"
                fill="white"
              />
            </svg>
          </div>
          <h1 className="text-purple-700 text-2xl font-bold">Sanova</h1>
        </div>

        <div className="flex items-center">
          {showSearch && (
            <div className="relative mr-2">
              <div
                className="flex items-center border rounded-lg px-3 py-2"
                ref={searchInputRef}
              >
                <Search size={18} className="text-gray-400 mr-2" />
                <input
                  type="text"
                  placeholder="Search patients"
                  className="outline-none w-64"
                  value={searchValue}
                  onChange={(e) => {
                    setSearchValue(e.target.value);
                    setDropdownVisible(true);
                  }}
                  onFocus={() => setDropdownVisible(true)}
                  aria-label="Search patients"
                  aria-expanded={dropdownVisible}
                  aria-controls="patient-search-results"
                />
              </div>

              {dropdownVisible && searchValue.length >= 1 && (
                <div
                  ref={dropdownRef}
                  className="absolute z-30 top-full left-0 right-0 mt-1"
                  id="patient-search-results"
                  role="listbox"
                >
                  <div className="bg-white border border-gray-300 rounded-lg shadow-lg w-full max-h-60 overflow-y-auto">
                    {patientData.isLoading ? (
                      <div className="p-4 text-gray-500 text-center flex items-center justify-center">
                        <svg
                          className="animate-spin h-5 w-5 mr-2 text-blue-500"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          ></circle>
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          ></path>
                        </svg>
                        Searching...
                      </div>
                    ) : patientData.isError ? (
                      <div className="p-4 text-red-500 text-center">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-5 w-5 mx-auto mb-1"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                          />
                        </svg>
                        Error fetching patients
                      </div>
                    ) : patientData.data?.users?.length ? (
                      patientData.data.users.map((user, index) => (
                        <Link
                          to={`/patient/${user.nid}`}
                          key={user.nid}
                          className="p-3 hover:bg-blue-50 cursor-pointer border-b border-gray-100 flex justify-between items-center transition-colors duration-150"
                          onClick={() => handleSelectPatient(user)}
                          role="option"
                          aria-selected="false"
                          tabIndex={0}
                          onKeyDown={(e) => {
                            if (e.key === "Enter") handleSelectPatient(user);
                          }}
                        >
                          <div>
                            <p className="font-medium text-gray-800">
                              {user.fullname}
                            </p>
                            <p className="text-sm text-gray-500">
                              NID: {user.nid}
                            </p>
                          </div>
                          <button
                            type="button"
                            className="text-blue-600 hover:text-blue-800 text-sm font-medium bg-blue-50 hover:bg-blue-100 px-3 py-1 rounded-full transition-colors duration-150"
                            aria-label={`Select ${user.fullname}`}
                          >
                            Select
                          </button>
                        </Link>
                      ))
                    ) : (
                      <div className="p-4 text-gray-500 text-center">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-5 w-5 mx-auto mb-1"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M20 12H4"
                          />
                        </svg>
                        No matching patients found
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}

          <div className="flex items-center ml-4">
            <Bell size={20} className="text-gray-600 mr-4" />
            <div className="flex items-center bg-gray-100 rounded-full px-3 py-1">
              <div className="bg-purple-700 text-white rounded-full p-1 mr-2">
                <User size={16} />
              </div>
              <span className="text-sm font-medium mr-1">{user}</span>
              <span className="text-xs text-gray-500">{userType}</span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}

export default Header;
