import { useEffect, useRef, useState } from "react";
import { userStore } from "../../zustand/userStore";
import { Search, Bell, User } from "lucide-react";
import useFetchPatientData from "../../Services/usePatientData";
import { Link, useLocation } from "react-router-dom";

function SearchDropdown({
  setDropdownVisible,
  searchInputRef,
  dropdownRef,
  searchValue,
  setSearchValue,
  dropdownVisible,
  patientData,
  handleSelectPatient,
}) {
  return (
    <div className="relative mr-2">
      <div
        className="flex items-center border border-gray-200 rounded-lg px-3 py-2"
        ref={searchInputRef}
      >
        <input
          type="text"
          placeholder="Search patients"
          className="outline-none w-96 placeholder:text-sm"
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
        <Search size={18} className="text-gray-400" />
      </div>

      {dropdownVisible && searchValue.length >= 1 && (
        <div
          ref={dropdownRef}
          className="absolute z-30 top-full left-0 right-0 mt-2"
          id="patient-search-results"
          role="listbox"
        >
          <div className="bg-white border border-gray-300 rounded-lg w-full max-h-60 overflow-y-auto">
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
              patientData.data.users.map(
                (user: { nid: string; fullname: string }) => (
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
                      <p className="text-sm text-gray-500">NID: {user.nid}</p>
                    </div>
                    <button
                      type="button"
                      className="text-blue-600 hover:text-blue-800 text-sm font-medium bg-blue-50 hover:bg-blue-100 px-3 py-1 rounded-full transition-colors duration-150"
                      aria-label={`Select ${user.fullname}`}
                    >
                      Select
                    </button>
                  </Link>
                ),
              )
            ) : (
              <div className="p-4 text-gray-500 text-center">
                No matching patients found
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

function Header() {
  const { pathname } = useLocation();

  const { user } = userStore();

  const [dropdownVisible, setDropdownVisible] = useState(false);
  const dropdownRef = useRef(null);
  const searchInputRef = useRef(null);
  const [searchValue, setSearchValue] = useState("");

  const patientData = useFetchPatientData(searchValue);
  const isDoctor = user.role === "doctor";
  const isAdmin = user.role === "owner";
  const userName = user.first_name + " " + user.last_name;
  const showSearch = isDoctor || isAdmin;

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
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

  const handleSelectPatient = (selectedPatient: {
    nid: string;
    fullname: string;
  }) => {
    setSearchValue(selectedPatient.fullname);
    setDropdownVisible(false);
  };

  const userType =
    user.role === "patient"
      ? "patient"
      : user.role === "doctor"
        ? "doctor"
        : "admin";

  return (
    <header className="bg-white border-b border-gray-200 py-4 px-8">
      <div className="flex justify-between items-center">
        {showSearch && (
          <SearchDropdown
            setDropdownVisible={setDropdownVisible}
            searchInputRef={searchInputRef}
            dropdownRef={dropdownRef}
            searchValue={searchValue}
            setSearchValue={setSearchValue}
            dropdownVisible={dropdownVisible}
            patientData={patientData}
            handleSelectPatient={handleSelectPatient}
          />
        )}
        <div className="flex items-center gap-6">
          <Bell size={20} className="text-gray-700" />
          <div className="flex items-center gap-2">
            <div className="bg-purple-700 rounded-full p-2 text-white">
              <User size={20} />
            </div>
            <div className="text-sm font-medium flex flex-col">
              <p> {userName}</p>
              <p className="text-xs text-gray-500">{userType}</p>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}

export default Header;
