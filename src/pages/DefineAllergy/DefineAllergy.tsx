import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useState, useEffect, useRef } from "react";
import * as Yup from "yup";
import { ErrorMessage, Field, Form, Formik } from "formik";
import { debounce } from "lodash";
import { userStore } from "../../zustand/userStore";
import instance, { BASEURL } from "../../axios/instance";
import useFetchPatientAllergy from "../../Services/useFetchPatientAllergy";

type allergy = {
  name: string;
  id: string;
};

type allergyAPI = allergy[];

interface MyFormValues {
  allergyId: string;
}

function DefineAllergy() {
  const { user, nid, role } = userStore();
  const [message, setMessage] = useState<string>("");
  const [messageStatus, setMessageStatus] = useState<"success" | "error" | "">(
    ""
  );
  const [searchValue, setSearchValue] = useState<string>("");
  const [dropdownVisible, setDropdownVisible] = useState<boolean>(false);
  const [selectedAllergy, setSelectedAllergy] = useState<string | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setDropdownVisible(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const allergiesQuery = useFetchPatientAllergy(nid, role);

  const handleRemove = async (pallergyId: string | null) => {
    try {
      await instance.delete(`/allergy/remove/${pallergyId}`);
      setMessage("Allergy removed successfully");
      setMessageStatus("success");
      allergiesQuery.refetch();
    } catch (err) {
      console.error(err);
      setMessage("An error occurred while removing your allergy record.");
      setMessageStatus("error");
    } finally {
      setTimeout(() => {
        setMessage("");
        setMessageStatus("");
      }, 3000);
    }
  };

  const validationSchema = Yup.object({
    allergyId: Yup.string().required(
      "Please select an allergy from the dropdown"
    ),
  });

  const initialValues: MyFormValues = {
    allergyId: "",
  };

  const debouncedSearch = useRef(
    debounce((value: string) => {
      if (value.length >= 1) {
        setSearchValue(value);
        setDropdownVisible(true);
      } else {
        setSearchValue("");
        setDropdownVisible(false);
      }
    }, 300)
  ).current;

  useEffect(() => {
    return () => {
      debouncedSearch.cancel();
    };
  }, [debouncedSearch]);

  const allergyQuery = useQuery<allergyAPI>({
    queryKey: ["allergies", searchValue],
    queryFn: () =>
      axios
        .get(`${BASEURL}/allergy/specific/${searchValue}`)
        .then((res) => {
          return res.data;
        }),
    enabled: searchValue.length >= 1,
  });

  const [selectedAllergyId, setSelectedAllergyId] = useState<string | null>(
    null
  );

  const isAllergyAlreadyAdded = (allergyId: string): boolean => {
    if (!allergiesQuery.data?.allergies) return false;
    return allergiesQuery.data.allergies.some(
      (allergy) => allergy.allergy === allergyId
    );
  };

  const handleAllergySelection = (allergy: allergy, setFieldValue) => {
    if (isAllergyAlreadyAdded(allergy.name)) {
      setMessage(`You already have "${allergy.name}" in your allergies list`);
      setMessageStatus("error");
      setTimeout(() => {
        setMessage("");
        setMessageStatus("");
      }, 3000);
      return;
    }

    setFieldValue("allergyId", allergy.id);
    setSearchValue(allergy.name);
    setDropdownVisible(false);
    setSelectedAllergy(allergy.name);
    setSelectedAllergyId(allergy.id);
  };

  const handleSearchInputChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    setFieldValue
  ) => {
    const value = e.target.value;
    setSearchValue(value);
    if (!selectedAllergyId) {
      setFieldValue("allergyId", "");
    }
    debouncedSearch(value);
  };

  return (
    <div className="container mx-auto max-w-4xl px-4 py-8">
      <div className="bg-white rounded-2xl shadow-md p-8 border border-gray-200">
        <h1 className="text-3xl font-bold mb-2 text-gray-800">
          Define Your Allergies
        </h1>
        <h2 className="text-xl mb-6 text-gray-600">Patient: {user}</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-6">
            <div className="bg-blue-50 rounded-lg p-4 mb-4 border border-blue-100">
              <h3 className="text-lg font-medium text-blue-800 mb-2">
                Add New Allergy
              </h3>
              <p className="text-sm text-blue-600">
                Search and select allergies to add to your medical record
              </p>
            </div>

            <Formik
              initialValues={initialValues}
              enableReinitialize
              onSubmit={async (
                values: MyFormValues,
                { setSubmitting, resetForm }
              ) => {
                try {
                  await instance.post("/allergy/add", { values });
                  setMessage("Allergy added successfully");
                  setMessageStatus("success");
                  resetForm();
                  setSelectedAllergy(null);
                  setSelectedAllergyId(null);
                  setSearchValue("");
                  allergiesQuery.refetch(); 

                  setTimeout(() => {
                    setMessage("");
                    setMessageStatus("");
                  }, 3000);
                } catch (err) {
                  console.error(err);
                  setMessage("An error occurred while adding your allergy.");
                  setMessageStatus("error");

                  setTimeout(() => {
                    setMessage("");
                    setMessageStatus("");
                  }, 3000);
                } finally {
                  setSubmitting(false);
                }
              }}
              validationSchema={validationSchema}
            >
              {({ isSubmitting, errors, touched, setFieldValue }) => (
                <Form className="space-y-4 flex flex-col w-full">
                  <div className="w-full">
                    <label
                      htmlFor="allergyId"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Search Allergy
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        id="allergyId"
                        placeholder="Type to search allergies..."
                        value={searchValue}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                          handleSearchInputChange(e, setFieldValue);
                          setSelectedAllergy(null);
                          setSelectedAllergyId(null);
                        }}
                        onFocus={() => {
                          if (searchValue && searchValue.length >= 1) {
                            setDropdownVisible(true);
                          }
                        }}
                        className={`block w-full px-4 py-3 border rounded-lg shadow-sm sm:text-sm transition duration-150 ${
                          errors.allergyId && touched.allergyId
                            ? "border-red-300 focus:ring-red-500 focus:border-red-500"
                            : "border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        }`}
                      />

                      <Field
                        type="hidden"
                        name="allergyId"
                        value={selectedAllergyId || ""}
                      />
                      {selectedAllergy && (
                        <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex items-center">
                          <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full mr-1">
                            {selectedAllergy}
                          </span>
                          <button
                            type="button"
                            className="text-gray-400 hover:text-gray-600"
                            onClick={() => {
                              setSelectedAllergy(null);
                              setSelectedAllergyId(null);
                              setSearchValue("");
                              setFieldValue("allergyId", "");
                            }}
                          >
                            &times;
                          </button>
                        </div>
                      )}
                    </div>
                    <ErrorMessage
                      name="allergyId"
                      component="div"
                      className="text-red-500 text-sm mt-1"
                    />

                    {dropdownVisible && searchValue.length >= 1 && (
                      <div ref={dropdownRef} className="relative">
                        <div className="absolute z-10 bg-white border border-gray-200 rounded-lg shadow-lg w-full max-h-60 overflow-y-auto mt-1">
                          {allergyQuery.isLoading ? (
                            <div className="p-3 text-gray-500 text-center flex items-center justify-center">
                              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-500 mr-2"></div>
                              Searching...
                            </div>
                          ) : allergyQuery.isError ? (
                            <div className="p-3 text-red-500 text-center">
                              Error fetching allergies
                            </div>
                          ) : allergyQuery.data?.length ? (
                            allergyQuery.data.map((allergy) => {
                              const alreadyAdded = isAllergyAlreadyAdded(
                                allergy.id
                              );
                              return (
                                <div
                                  key={allergy.id}
                                  className={`p-3 border-b border-gray-100 flex justify-between items-center transition duration-150 ${
                                    alreadyAdded
                                      ? "bg-gray-100 cursor-not-allowed"
                                      : "hover:bg-gray-50 cursor-pointer"
                                  }`}
                                  onClick={() =>
                                    !alreadyAdded &&
                                    handleAllergySelection(
                                      allergy,
                                      setFieldValue
                                    )
                                  }
                                >
                                  <div>
                                    <p className="font-medium text-gray-800">
                                      {allergy.name}
                                    </p>
                                    <p className="text-sm text-gray-500">
                                      ID: {allergy.id}
                                    </p>
                                  </div>
                                  {alreadyAdded ? (
                                    <span className="text-sm font-medium px-3 py-1 bg-gray-200 text-gray-600 rounded-md">
                                      Already Added
                                    </span>
                                  ) : (
                                    <button
                                      type="button"
                                      className="text-blue-600 hover:text-blue-800 text-sm font-medium px-3 py-1 hover:bg-blue-50 rounded-md transition duration-150"
                                    >
                                      Select
                                    </button>
                                  )}
                                </div>
                              );
                            })
                          ) : (
                            <div className="p-3 text-gray-500 text-center">
                              No matching allergies found
                            </div>
                          )}
                        </div>
                      </div>
                    )}

                    {errors.allergyId && touched.allergyId && (
                      <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md mt-2">
                        {errors.allergyId}
                      </div>
                    )}
                  </div>

                  <div className="mt-4">
                    <button
                      type="submit"
                      className="w-full cursor-pointer flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-gray-400 disabled:cursor-not-allowed transition duration-150"
                      disabled={isSubmitting || !selectedAllergyId}
                    >
                      {isSubmitting ? (
                        <>
                          <svg
                            className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
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
                          Adding...
                        </>
                      ) : (
                        "Add Allergy"
                      )}
                    </button>
                  </div>
                </Form>
              )}
            </Formik>
          </div>

          <div>
            <div className="bg-yellow-50 rounded-lg p-4 mb-4 border border-yellow-100">
              <h3 className="text-lg font-medium text-yellow-800 mb-2">
                Your Current Allergies
              </h3>
              <p className="text-sm text-yellow-600">
                These allergies are recorded in your medical profile
              </p>
            </div>

            <div className="bg-white border border-gray-200 rounded-lg shadow-sm">
              {allergiesQuery.isLoading ? (
                <div className="p-6 text-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-2"></div>
                  <p className="text-gray-500">Loading your allergies...</p>
                </div>
              ) : allergiesQuery.isError ? (
                <div className="p-6 text-center text-red-500">
                  <p>Error loading allergies data</p>
                </div>
              ) : allergiesQuery.data?.allergies?.length ? (
                <ul className="divide-y divide-gray-200 z-50">
                  {allergiesQuery.data.allergies.map((allergy) => (
                    <li
                      key={allergy.id}
                      className="p-4 hover:bg-gray-50 transition duration-150"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <div className="bg-red-100 text-red-800 p-2 rounded-full mr-3">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-5 w-5"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                              />
                            </svg>
                          </div>
                          <div>
                            <p className="text-gray-800 font-medium">
                              {allergy.allergy}
                            </p>
                            <p className="text-xs text-gray-500">
                              ID: {allergy.id}
                            </p>
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={() => handleRemove(allergy.id)}
                          className="ml-2 text-red-600 hover:text-red-800 text-sm font-medium px-3 py-1 hover:bg-red-50 rounded-md transition duration-150 flex items-center"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-4 w-4 mr-1"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                            />
                          </svg>
                          Remove
                        </button>
                      </div>
                    </li>
                  ))}
                </ul>
              ) : (
                <div className="p-6 text-center text-gray-500">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-12 w-12 mx-auto mb-2 text-gray-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1}
                      d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    />
                  </svg>
                  <p>No allergies recorded yet</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {message && (
          <div
            className={`mt-6 p-4 rounded-lg ${
              messageStatus === "success"
                ? "bg-green-50 text-green-700 border border-green-200"
                : "bg-red-50 text-red-700 border border-red-200"
            }`}
          >
            <div className="flex items-center">
              {messageStatus === "success" ? (
                <svg
                  className="w-5 h-5 mr-2"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  ></path>
                </svg>
              ) : (
                <svg
                  className="w-5 h-5 mr-2"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                    clipRule="evenodd"
                  ></path>
                </svg>
              )}
              {message}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default DefineAllergy;
