import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { ErrorMessage, Field } from "formik";
import { debounce } from "lodash";
import { useEffect, useRef, useState } from "react";
import { BASEURL } from "../../axios/instance";

type Disease = {
  id: string;
  name: string;
};

type DiseasesResponse = {
  diseases: Disease[];
};

const DiseaseId = ({
  selectedDisease,
  setSelectedDisease,
  searchTerm,
  setSearchTerm,
  setFieldValue,
  errors,
  touched,
}) => {
  const [dropdownVisible, setDropdownVisible] = useState<boolean>(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const debouncedSearch = useRef(
    debounce((value: string) => {
      if (value.length >= 1) {
        setSearchTerm(value);
        setDropdownVisible(true);
      } else {
        setSearchTerm("");
        setDropdownVisible(false);
      }
    }, 300)
  ).current;

  useEffect(() => {
    return () => {
      debouncedSearch.cancel();
    };
  }, [debouncedSearch]);

  const diseaseQuery = useQuery<DiseasesResponse>({
    queryKey: ["diseases", searchTerm],
    queryFn: () =>
      axios.get(`${BASEURL}/disease/${searchTerm}`).then((res) => res.data),
    enabled: searchTerm.length >= 1,
  });

  const handleDiseaseSelect = (disease: Disease, setFieldValue) => {
    setSelectedDisease(disease);
    setFieldValue("diseaseId", disease.id);
    setDropdownVisible(false);
    setSearchTerm(disease.name);
  };

  const handleSearchInputChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    setFieldValue
  ) => {
    const value = e.target.value;
    setSearchTerm(value);
    if (!selectedDisease) {
      setFieldValue("diseaseId", "");
    }
    debouncedSearch(value);
  };
  return (
    <div className="w-full">
      <label
        htmlFor="diseaseId"
        className="block text-sm font-medium text-gray-700 mb-1"
      >
        Search Disease
      </label>
      <div className="relative">
        <input
          type="text"
          id="diseaseId"
          placeholder="Type to search diseases..."
          value={searchTerm}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
            handleSearchInputChange(e, setFieldValue);
            setSelectedDisease(null);
          }}
          onFocus={() => {
            if (searchTerm && searchTerm.length >= 1) {
              setDropdownVisible(true);
            }
          }}
          className={`block w-full px-4 py-3 border rounded-lg shadow-sm sm:text-sm transition duration-150 ${
            errors && touched
              ? "border-red-300 focus:ring-red-500 focus:border-red-500"
              : "border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          }`}
        />

        <Field
          type="hidden"
          name="diseaseId"
          value={selectedDisease?.id || ""}
        />
        {selectedDisease && (
          <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex items-center">
            <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full mr-1">
              {selectedDisease.name}
            </span>
            <button
              type="button"
              className="text-gray-400 hover:text-gray-600"
              onClick={() => {
                setSelectedDisease(null);
                setSearchTerm("");
                setFieldValue("diseaseId", "");
              }}
            >
              &times;
            </button>
          </div>
        )}
      </div>
      <ErrorMessage
        name="diseaseId"
        component="div"
        className="text-red-500 text-sm mt-1"
      />

      {dropdownVisible && searchTerm.length >= 1 && (
        <div ref={dropdownRef} className="relative">
          <div className="absolute z-10 bg-white border border-gray-200 rounded-lg shadow-lg w-full max-h-60 overflow-y-auto mt-1">
            {diseaseQuery.isLoading ? (
              <div className="p-3 text-gray-500 text-center flex items-center justify-center">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-500 mr-2"></div>
                Searching...
              </div>
            ) : diseaseQuery.isError ? (
              <div className="p-3 text-red-500 text-center">
                Error fetching diseases
              </div>
            ) : diseaseQuery.data?.diseases?.length ? (
              diseaseQuery.data.diseases.map((disease) => (
                <div
                  key={disease.id}
                  className="p-3 border-b border-gray-100 flex justify-between items-center transition duration-150 hover:bg-gray-50 cursor-pointer"
                  onClick={() => handleDiseaseSelect(disease, setFieldValue)}
                >
                  <div>
                    <p className="font-medium text-gray-800">{disease.name}</p>
                    <p className="text-xs text-gray-500">ID: {disease.id}</p>
                  </div>
                  <button
                    type="button"
                    className="text-blue-600 hover:text-blue-800 text-sm font-medium px-3 py-1 hover:bg-blue-50 rounded-md transition duration-150"
                  >
                    Select
                  </button>
                </div>
              ))
            ) : (
              <div className="p-3 text-gray-500 text-center">
                No matching diseases found
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default DiseaseId;
