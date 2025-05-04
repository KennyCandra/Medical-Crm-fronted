import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useState, useEffect, useRef } from "react";
import { useUserId } from "../../Services/usePrescriptions";
import * as Yup from "yup";
import { ErrorMessage, Field, Form, Formik } from "formik";
import { debounce } from "lodash";
import instance from "../../axios/instance";
import useFetchPatientDiagnosis from "../../Services/useFetchPatientDiagnosis";
import PatientId from "../../components/formValues/PatientId";

type Disease = {
  id: string;
  name: string;
};

type DiseasesResponse = {
  diseases: Disease[];
};
interface DiagnosisFormValues {
  doctorId: string;
  patientId: string;
  diseaseId: string;
  severity: "acute" | "severe" | "mild" | "chronic";
}

function CreateDiagnosis() {
  const { userIdQuery } = useUserId();
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [patientId, setPatientId] = useState<string>("");
  const [selectedDisease, setSelectedDisease] = useState<Disease | null>(null);
  const [dropdownVisible, setDropdownVisible] = useState<boolean>(false);
  const [message, setMessage] = useState<string>("");
  const [messageStatus, setMessageStatus] = useState<"success" | "error" | "">(
    ""
  );
  const dropdownRef = useRef<HTMLDivElement>(null);

  const diagnosisQuery = useFetchPatientDiagnosis(patientId);

  const validationSchema = Yup.object({
    doctorId: Yup.string().required("Doctor ID is required"),
    patientId: Yup.string().required("Patient ID is required"),
    diseaseId: Yup.string().required("Disease is required"),
    severity: Yup.string().required("Severity is required"),
  });

  const initialValues: DiagnosisFormValues = {
    doctorId: userIdQuery.data?.profileId || "",
    patientId: "",
    diseaseId: "",
    severity: "mild",
  };

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
      axios
        .get(`http://localhost:8001/disease/${searchTerm}`)
        .then((res) => res.data),
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

  const handleRemoveDiagnosis = async (diagnosisId: string) => {
    try {
      await instance.delete(`/diagnosis/remove/${diagnosisId}`);
      setMessage("Diagnosis removed successfully");
      setMessageStatus("success");
      diagnosisQuery.refetch();
    } catch (err) {
      console.error(err);
      setMessage("An error occurred while removing the diagnosis record.");
      setMessageStatus("error");
    } finally {
      setTimeout(() => {
        setMessage("");
        setMessageStatus("");
      }, 3000);
    }
  };

  if (userIdQuery.isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-pulse flex space-x-2">
          <div className="h-3 w-3 bg-blue-400 rounded-full"></div>
          <div className="h-3 w-3 bg-blue-400 rounded-full"></div>
          <div className="h-3 w-3 bg-blue-400 rounded-full"></div>
        </div>
        <span className="ml-3 text-gray-600">Loading user data...</span>
      </div>
    );
  }

  if (userIdQuery.isError) {
    return (
      <div className="p-4 bg-red-50 text-red-700 rounded-md border border-red-200">
        <div className="flex items-center">
          <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
              clipRule="evenodd"
            ></path>
          </svg>
          Error loading user data. Please try again later.
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto max-w-4xl px-4 py-8">
      <div className="bg-white rounded-2xl shadow-md p-8 border border-gray-200">
        <h1 className="text-3xl font-bold mb-2 text-gray-800">
          Patient Diagnosis Management
        </h1>
        <h2 className="text-xl mb-6 text-gray-600">
          Doctor ID: {userIdQuery.data?.profileId}
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-6">
            <div className="bg-blue-50 rounded-lg p-4 mb-4 border border-blue-100">
              <h3 className="text-lg font-medium text-blue-800 mb-2">
                Create New Diagnosis
              </h3>
              <p className="text-sm text-blue-600">
                Enter patient information and select a disease to diagnose
              </p>
            </div>

            <Formik
              initialValues={initialValues}
              enableReinitialize
              onSubmit={async (
                values: DiagnosisFormValues,
                { setSubmitting, resetForm }
              ) => {
                try {
                  await instance.post("/diagnosis/create", values);
                  setMessage("Diagnosis created successfully");
                  setMessageStatus("success");
                  resetForm();
                  setSelectedDisease(null);
                  setSearchTerm("");
                  if (patientId) {
                    diagnosisQuery.refetch();
                  }

                  setTimeout(() => {
                    setMessage("");
                    setMessageStatus("");
                  }, 3000);
                } catch (err) {
                  console.error(err);
                  setMessage("An error occurred while creating diagnosis.");
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
              {({ isSubmitting, errors, touched, setFieldValue, values }) => (
                <Form className="space-y-4 flex flex-col w-full">
                  <div className="w-full">
                    <label
                      htmlFor="doctorId"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Doctor ID
                    </label>
                    <Field
                      type="text"
                      name="doctorId"
                      id="doctorId"
                      value={values.doctorId}
                      disabled
                      className="block w-full px-4 py-3 bg-gray-100 border rounded-lg shadow-sm sm:text-sm transition duration-150 border-gray-300"
                    />
                  </div>

                  <PatientId
                    errors={errors.patientId}
                    touched={touched.patientId}
                    patientId={patientId}
                    setPatientId={setPatientId}
                    setFieldValue={setFieldValue}
                    key={"patientId"}
                  />

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
                          errors.diseaseId && touched.diseaseId
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
                                onClick={() =>
                                  handleDiseaseSelect(disease, setFieldValue)
                                }
                              >
                                <div>
                                  <p className="font-medium text-gray-800">
                                    {disease.name}
                                  </p>
                                  <p className="text-xs text-gray-500">
                                    ID: {disease.id}
                                  </p>
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

                  <div className="w-full">
                    <label
                      htmlFor="severity"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Severity
                    </label>
                    <Field
                      as="select"
                      name="severity"
                      id="severity"
                      className={`block w-full px-4 py-3 border rounded-lg shadow-sm sm:text-sm transition duration-150 ${
                        errors.severity && touched.severity
                          ? "border-red-300 focus:ring-red-500 focus:border-red-500"
                          : "border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      }`}
                    >
                      <option value="mild">Mild</option>
                      <option value="acute">Acute</option>
                      <option value="severe">Severe</option>
                      <option value="chronic">Chronic</option>
                    </Field>
                    <ErrorMessage
                      name="severity"
                      component="div"
                      className="text-red-500 text-sm mt-1"
                    />
                  </div>

                  <div className="mt-4">
                    <button
                      type="submit"
                      className="w-full cursor-pointer flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-gray-400 disabled:cursor-not-allowed transition duration-150"
                      disabled={
                        isSubmitting ||
                        !values.patientId ||
                        !values.diseaseId ||
                        !values.severity
                      }
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
                          Creating...
                        </>
                      ) : (
                        "Create Diagnosis"
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
                Current Patient Diagnoses
              </h3>
              <p className="text-sm text-yellow-600">
                {patientId
                  ? "These diagnoses are recorded for this patient"
                  : "Enter a patient ID to view their diagnoses"}
              </p>
            </div>

            <div className="bg-white border border-gray-200 rounded-lg shadow-sm">
              {patientId && diagnosisQuery.isLoading ? (
                <div className="p-6 text-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-2"></div>
                  <p className="text-gray-500">Loading diagnoses...</p>
                </div>
              ) : patientId && diagnosisQuery.isError ? (
                <div className="p-6 text-center text-red-500">
                  <p>Error loading diagnosis data</p>
                </div>
              ) : patientId && diagnosisQuery.data?.diagnosis?.length ? (
                <ul className="divide-y divide-gray-200 z-50">
                  {diagnosisQuery.data.diagnosis.map((diagnosis) => (
                    <li
                      key={diagnosis.id}
                      className="p-4 hover:bg-gray-50 transition duration-150"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <div className="bg-blue-100 text-blue-800 p-2 rounded-full mr-3">
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
                                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                              />
                            </svg>
                          </div>
                          <div>
                            <p className="text-gray-800 font-medium">
                              {diagnosis.disease.name}
                            </p>
                            <div className="flex items-center mt-1">
                              <span
                                className={`text-xs px-2 py-1 rounded-full ${
                                  diagnosis.severity === "mild"
                                    ? "bg-green-100 text-green-800"
                                    : diagnosis.severity === "acute"
                                    ? "bg-yellow-100 text-yellow-800"
                                    : diagnosis.severity === "severe"
                                    ? "bg-red-100 text-red-800"
                                    : "bg-purple-100 text-purple-800"
                                }`}
                              >
                                {diagnosis.severity.charAt(0).toUpperCase() +
                                  diagnosis.severity.slice(1)}
                              </span>
                              <p className="text-xs text-gray-500 ml-2">
                                ID: {diagnosis.id}
                              </p>
                            </div>
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={() => handleRemoveDiagnosis(diagnosis.id)}
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
              ) : patientId ? (
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
                  <p>No diagnoses recorded for this patient</p>
                </div>
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
                      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                    />
                  </svg>
                  <p>Enter a patient ID to view their diagnoses</p>
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

export default CreateDiagnosis;
