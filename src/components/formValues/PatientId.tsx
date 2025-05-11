import { useEffect, useRef, useState } from "react";
import useFetchPatientData from "../../Services/usePatientData";
import { useLocation } from "react-router-dom";
import { ErrorMessage, Field } from "formik";
import { debounce } from "lodash";
import type { User } from "../../Services/usePatientData";

const PatientId = ({
  setFieldValue,
  errors,
  touched,
  patientId,
  setPatientId,
}) => {
  const location = useLocation();
  const [searchValue, setSearchValue] = useState<string>("");
  const [dropdownVisiblePatient, setDropdownVisiblePatient] = useState<boolean>(false);
  const [selectedPatient, setSelectedPatient] = useState<User | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const patientData = useFetchPatientData(searchValue);
  const query = new URLSearchParams(location.search);
  const nid = query.get("nid");

  const debouncedSearch = useRef(
    debounce((value: string) => {
      if (value.length >= 1) {
        setSearchValue(value);
        setDropdownVisiblePatient(true);
      } else {
        setSearchValue("");
        setDropdownVisiblePatient(false);
      }
    }, 300)
  ).current;

  const handlePatientSelect = (user: User) => {
    setPatientId(user.nid);
    setSelectedPatient(user);
    setDropdownVisiblePatient(false);
    setSearchValue("");
  };

  const clickedPatient = useFetchPatientData(nid || "");

  const handleSearchInputChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    setFieldValue
  ) => {
    const value = e.target.value;
    setFieldValue("patientId", value);
    debouncedSearch(value);

    if (selectedPatient && value !== selectedPatient.nid) {
      setSelectedPatient(null);
    }
  };

  useEffect(() => {
    return () => {
      debouncedSearch.cancel();
    };
  }, [debouncedSearch]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setDropdownVisiblePatient(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    if (nid && !clickedPatient.isLoading) {
      handlePatientSelect(clickedPatient?.data?.users[0]);
      setFieldValue("patientId", clickedPatient?.data?.users[0].nid);
    }
  }, [nid, clickedPatient.isLoading]);

  return (
    <div>
      <label
        htmlFor="patientId"
        className="block text-sm font-medium text-gray-700 mb-1"
      >
        <div className="flex items-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-4 w-4 mr-1 text-gray-500"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"
            />
          </svg>
          Patient NID
        </div>
      </label>
      <div className="relative">
        <Field
          type="text"
          name="patientId"
          id="patientId"
          placeholder="Enter patient NID (min 3 characters)"
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            handleSearchInputChange(e, setFieldValue)
          }
          onFocus={() => {
            if (searchValue && searchValue.length >= 1) {
              setDropdownVisiblePatient(true);
            }
          }}
          className={`block w-full px-4 py-3 rounded-lg border shadow-sm focus:outline-none sm:text-sm ${
            errors && touched
              ? "border-red-300 text-red-900 placeholder-red-300 focus:ring-red-500 focus:border-red-500"
              : "border-gray-300 focus:ring-blue-500 focus:border-blue-500"
          }`}
        />
        {selectedPatient && (
          <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex items-center">
            <span className="text-xs bg-green-100 text-green-800 px-3 py-1 rounded-full font-medium">
              {selectedPatient.fullname}
            </span>
            <button
              type="button"
              className="ml-1 text-gray-400 hover:text-gray-600 focus:outline-none"
              onClick={() => {
                setSelectedPatient(null);
                setFieldValue("patientId", "");
                setPatientId("");
              }}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
        )}
      </div>
      <ErrorMessage
        name="patientId"
        component="div"
        className="text-red-500 text-sm mt-1"
      />

      {dropdownVisiblePatient && searchValue.length >= 1 && (
        <div ref={dropdownRef} className="relative">
          <div className="absolute z-30 bg-white border border-gray-300 rounded-lg shadow-lg w-full max-h-60 overflow-y-auto mt-1">
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
              patientData.data.users.map((user) => (
                <div
                  key={user.nid}
                  className="p-3 hover:bg-blue-50 cursor-pointer border-b border-gray-100 flex justify-between items-center transition-colors duration-150"
                  onClick={() => {
                    handlePatientSelect(user);
                    setFieldValue("patientId", user.nid);
                  }}
                >
                  <div>
                    <p className="font-medium text-gray-800">{user.fullname}</p>
                    <p className="text-sm text-gray-500">NID: {user.nid}</p>
                  </div>
                  <button
                    type="button"
                    className="text-blue-600 hover:text-blue-800 text-sm font-medium bg-blue-50 hover:bg-blue-100 px-3 py-1 rounded-full transition-colors duration-150"
                  >
                    Select
                  </button>
                </div>
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

      {errors && touched && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md mt-2 text-sm">
          <div className="flex">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 mr-2 text-red-400"
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
            {errors}
          </div>
        </div>
      )}
    </div>
  );
};

export default PatientId;
