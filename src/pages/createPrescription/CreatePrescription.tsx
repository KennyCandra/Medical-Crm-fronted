import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useState, useEffect, useRef } from "react";
import { useUserId } from "../../Services/usePrescriptions";
import * as Yup from "yup";
import { Form, Formik, Field, ErrorMessage } from "formik";
import { debounce } from "lodash";
import DrugDrugInteraction from "../../components/DrugDrugInteraction/DrugDrugInteraction";
import instance from "../../axios/instance";
import DrugOldDrugInteraction from "../../components/DrugDrugInteraction/DrugOldDrugInteraction";
import MedicationsTable from "../../components/MedicationsTable/MedicationTable";
import PatientId from "../../components/formValues/PatientId";
import DoctorId from "../../components/formValues/DoctorId";

type drug = {
  id: string;
  name: string;
  route: string;
};

type drugAPI = {
  message: string;
  drugs: drug[];
};

export type medication = {
  drug: drug;
  frequency: string;
  dose: string;
};

interface MyFormValues {
  doctorId: string;
  patientId: string;
  medication: medication[];
  description: string;
}

function CreatePrescription() {
  const { userIdQuery } = useUserId();
  const [patientId, setPatientId] = useState<string>("");
  const [select, setSelect] = useState<medication[]>([]);
  const [drugSearchValue, setDrugSearchValue] = useState<string>("");
  const [message, setMessage] = useState("");

  const validationSchema = Yup.object({
    doctorId: Yup.string().required("Doctor ID is required"),
    patientId: Yup.string().required("Patient ID is required"),
    medication: Yup.array().min(1, "At least one medication is required"),
    description: Yup.string().max(
      500,
      "Description must be less than 500 characters"
    ),
  });

  const initialValues: MyFormValues = {
    doctorId: userIdQuery.data?.profileId || "",
    patientId: "",
    medication: select,
    description: "",
  };

  const debouncedSearchDrug = useRef(
    debounce((value: string) => {
      if (drugSearchValue.length >= 1) {
        setDrugSearchValue(value);
      } else {
        setDrugSearchValue("");
      }
    }, 300)
  ).current;

  useEffect(() => {
    return () => {
      debouncedSearchDrug.cancel();
    };
  }, [debouncedSearchDrug]);

  const drugQuery = useQuery<drugAPI>({
    queryKey: ["drugs", drugSearchValue],
    queryFn: () =>
      axios
        .post("http://localhost:8001/drug/", {
          value: drugSearchValue,
        })
        .then((res) => res.data),
    enabled: drugSearchValue.length >= 2,
  });

  const handleAddToSelect = (drug: drug) => {
    if (!select.some((med) => med.drug.id === drug.id)) {
      setSelect([
        ...select,
        {
          drug: drug,
          dose: "",
          frequency: "",
        },
      ]);
    }
  };

  if (userIdQuery.isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-pulse flex flex-col items-center">
          <div className="w-12 h-12 rounded-full bg-blue-100"></div>
          <div className="mt-4 text-blue-600 font-medium">
            Loading user data...
          </div>
        </div>
      </div>
    );
  }

  if (userIdQuery.isError) {
    return (
      <div className="p-6 bg-red-50 text-red-700 rounded-lg border border-red-200 shadow-sm">
        <div className="flex items-center mb-2">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6 mr-2"
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
          <h3 className="font-bold">Error</h3>
        </div>
        <p>Error loading user data. Please try again later.</p>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen py-8 px-4 sm:px-6 lg:px-8 font-secondary">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white rounded-xl shadow-md overflow-hidden p-6 sm:p-8">
          <div className="border-b border-gray-200 pb-5 mb-6">
            <h1 className="text-3xl font-primary font-bold text-gray-900 flex items-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-8 w-8 mr-3 text-blue-600"
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
              Create Prescription
            </h1>
            <p className="mt-2 text-sm text-gray-500">
              Add patient information and prescribe medications
            </p>
          </div>

          <Formik
            initialValues={initialValues}
            onSubmit={async (
              values: MyFormValues,
              { setSubmitting, setFieldError, resetForm }
            ) => {
              try {
                console.log(values);
                if (values.medication.length === 0) {
                  setFieldError(
                    "medication",
                    "At least one medication is required"
                  );
                  return;
                }

                const res = await instance.post("presc/create", values);
                if (res.status === 201) {
                  resetForm();
                  setSelect([]);
                  setMessage("created successfully");
                  window.scrollTo({ top: 0, behavior: "smooth" });
                }
                if (res.status === 404) {
                  if (res.data.message === "doctor") {
                    setFieldError("doctorId", "Doctor ID is invalid");
                  } else if (res.data.message === "patient") {
                    setFieldError("patientId", "Patient ID is required");
                  }
                }
              } catch (err) {
                if (err.response) {
                  if (err.response.status === 401) {
                    setFieldError(
                      "general",
                      "Unauthorized. Please log in again."
                    );
                  } else if (
                    err.response.status === 404 &&
                    err.data.meesage === "patient"
                  ) {
                    setFieldError("patientId", "Patient not found");
                  } else if (
                    err.response.status === 404 &&
                    err.data.meesage === "doctor"
                  ) {
                    setFieldError("doctorId", "Doctor ID is invalid");
                  } else {
                    setFieldError(
                      "general",
                      `Error: ${err.response.data.message || "Unknown error"}`
                    );
                  }
                } else {
                  setFieldError("general", "Network error. Please try again.");
                }
                console.error(err);
              } finally {
                setSubmitting(false);
              }
            }}
            validationSchema={validationSchema}
          >
            {({ isSubmitting, errors, touched, setFieldValue, values }) => (
              <Form className="space-y-8" onClick={() => console.log(values)}>
                {message && (
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6 shadow-sm animate-fade-in">
                    <div className="flex">
                      <div className="flex-shrink-0">
                        <svg
                          className="h-5 w-5 text-green-400"
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path
                            fillRule="evenodd"
                            d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </div>
                      <div className="ml-3">
                        <h3 className="text-sm font-medium text-green-800">
                          Success
                        </h3>
                        <div className="mt-2 text-sm text-green-700">
                          <p>Prescription created successfully!</p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                  <div className="lg:col-span-1 space-y-6">
                    <div className="bg-blue-50 p-4 rounded-lg border border-blue-100 mb-6">
                      <h2 className="text-lg font-medium text-blue-800 mb-2">
                        Prescription Information
                      </h2>
                      <p className="text-sm text-blue-600">
                        Fill in the details below to create a new prescription
                      </p>
                    </div>

                    <DoctorId userIdQuery={userIdQuery} key={"doctorId"} />

                    <PatientId
                      errors={errors.patientId}
                      touched={touched.patientId}
                      patientId={patientId}
                      setPatientId={setPatientId}
                      setFieldValue={setFieldValue}
                    />

                    <div className="mb-4">
                      <label
                        htmlFor="description"
                        className="block text-sm font-medium text-gray-700 mb-1"
                      >
                        Prescription Description
                      </label>
                      <div className="mt-1 relative rounded-md shadow-sm">
                        <Field
                          as="textarea"
                          id="description"
                          name="description"
                          rows={4}
                          placeholder="Add notes or instructions about this prescription..."
                          className="block w-full rounded-md border-gray-300 focus:ring-blue-500 focus:border-blue-500 sm:text-sm p-3"
                        />
                        <div className="text-xs text-gray-500 mt-1 text-right">
                          {values.description.length}/500 characters
                        </div>
                      </div>
                      <ErrorMessage
                        name="description"
                        component="div"
                        className="mt-1 text-sm text-red-600"
                      />
                    </div>

                    <div className="relative">
                      <h2 className="text-lg font-medium text-gray-700 mb-2 flex items-center">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-5 w-5 mr-2 text-blue-500"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                          />
                        </svg>
                        Search Medications
                      </h2>
                      <div className="mb-3">
                        <div className="relative">
                          <input
                            type="text"
                            placeholder="Search for medications..."
                            value={drugSearchValue}
                            onChange={(e) => setDrugSearchValue(e.target.value)}
                            className="w-full px-4 py-3 pl-10 border rounded-lg shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                          />
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-5 w-5 text-gray-400"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                              />
                            </svg>
                          </div>
                        </div>
                      </div>

                      {errors.medication &&
                        typeof errors.medication === "string" && (
                          <div className="text-red-500 text-sm mb-2 flex items-center">
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
                                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                              />
                            </svg>
                            {errors.medication}
                          </div>
                        )}

                      {drugSearchValue.length >= 1 && (
                        <div className="border rounded-lg overflow-hidden absolute w-full z-20 bg-white shadow-lg">
                          {drugQuery.isLoading ? (
                            <div className="p-4 text-center text-gray-500 flex items-center justify-center">
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
                              Searching medications...
                            </div>
                          ) : drugQuery.isError ? (
                            <div className="p-4 text-center text-red-500">
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
                              Error loading medications
                            </div>
                          ) : drugQuery.data?.drugs?.length > 1 ? (
                            <div className="max-h-64 overflow-y-auto">
                              <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                  <tr>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                      Name
                                    </th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                      Route
                                    </th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                      Action
                                    </th>
                                  </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                  {drugQuery.data.drugs.map((drug) => (
                                    <tr
                                      key={drug.id}
                                      className="hover:bg-blue-50 transition-colors duration-150"
                                    >
                                      <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-800">
                                        {drug.name}
                                      </td>
                                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-600">
                                        {drug.route}
                                      </td>
                                      <td className="px-4 py-3 whitespace-nowrap text-sm">
                                        <button
                                          type="button"
                                          onClick={() => {
                                            handleAddToSelect(drug);
                                            setDrugSearchValue("");
                                          }}
                                          disabled={select.some(
                                            (med) => med.drug.id === drug.id
                                          )}
                                          className={`text-white px-3 py-1 rounded-full text-sm font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 ${
                                            select.some(
                                              (med) => med.drug.id === drug.id
                                            )
                                              ? "bg-gray-300 cursor-not-allowed"
                                              : "bg-blue-600 hover:bg-blue-700 focus:ring-blue-500"
                                          }`}
                                        >
                                          {select.some(
                                            (med) => med.drug.id === drug.id
                                          )
                                            ? "Added"
                                            : "Add"}
                                        </button>
                                      </td>
                                    </tr>
                                  ))}
                                </tbody>
                              </table>
                            </div>
                          ) : (
                            <div className="p-4 text-center text-gray-500">
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
                              No medications found
                            </div>
                          )}
                        </div>
                      )}
                    </div>

                    <div className="pt-6">
                      <button
                        type="submit"
                        className={`w-full flex justify-center items-center py-3 px-4 border rounded-lg shadow-sm text-base font-medium text-white focus:outline-none focus:ring-2 focus:ring-offset-2 transition-colors duration-200 ${
                          isSubmitting ||
                          !values.patientId ||
                          select.length === 0
                            ? "bg-gray-400 cursor-not-allowed"
                            : "bg-blue-600 hover:bg-blue-700 focus:ring-blue-500"
                        }`}
                        disabled={
                          isSubmitting ||
                          !values.patientId ||
                          select.length === 0
                        }
                      >
                        {isSubmitting ? (
                          <>
                            <svg
                              className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
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
                          <>
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-5 w-5 mr-2"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                              />
                            </svg>
                            Create Prescription
                          </>
                        )}
                      </button>
                    </div>
                  </div>

                  <div className="lg:col-span-2 grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
                      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 px-4 py-3 border-b border-gray-200">
                        <h3 className="text-lg font-medium text-gray-800">
                          Drug-Drug Interactions
                        </h3>
                        <p className="text-sm text-gray-600">
                          Current prescription interactions
                        </p>
                      </div>
                      <div className="p-4">
                        <DrugDrugInteraction
                          patientNid={patientId}
                          medication={select}
                        />
                      </div>
                    </div>

                    <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
                      <div className="bg-gradient-to-r from-purple-50 to-pink-50 px-4 py-3 border-b border-gray-200">
                        <h3 className="text-lg font-medium text-gray-800">
                          Drug-History Interactions
                        </h3>
                        <p className="text-sm text-gray-600">
                          Interactions with previously prescribed medications
                        </p>
                      </div>
                      <div className="p-4">
                        <DrugOldDrugInteraction
                          medication={select}
                          patientNid={patientId}
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-8 bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
                  <div className="bg-gradient-to-r from-green-50 to-teal-50 px-6 py-4 border-b border-gray-200">
                    <h3 className="text-lg font-medium text-gray-800 flex items-center">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5 mr-2 text-green-600"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                        />
                      </svg>
                      Prescription Medications
                    </h3>
                    <p className="text-sm text-gray-600">
                      {select.length === 0
                        ? "No medications selected yet"
                        : `${select.length} medication${
                            select.length === 1 ? "" : "s"
                          } selected`}
                    </p>
                  </div>
                  <div className="p-6">
                    <MedicationsTable
                      select={select}
                      setSelect={setSelect}
                      setFieldValue={setFieldValue}
                    />

                    {select.length === 0 && (
                      <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-12 w-12 text-gray-300 mb-4"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                          />
                        </svg>
                        <h3 className="text-lg font-medium text-gray-900 mb-1">
                          No medications added
                        </h3>
                        <p className="text-gray-500 max-w-sm">
                          Use the search box above to find and add medications
                          to this prescription
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </Form>
            )}
          </Formik>
        </div>
      </div>
    </div>
  );
}

export default CreatePrescription;
