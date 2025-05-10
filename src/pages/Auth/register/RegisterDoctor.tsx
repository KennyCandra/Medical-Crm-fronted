import axios from "axios";
import { useQuery } from "@tanstack/react-query";
import { ErrorMessage, Field, Formik, Form } from "formik";
import * as Yup from "yup";
import { Link } from "react-router-dom";
import {
  User,
  Lock,
  UserCircle,
  Award,
  Stethoscope,
  ArrowLeft,
  Calendar,
} from "lucide-react";

interface MyFormValues {
  firstName: string;
  lastName: string;
  NID: string;
  password: string;
  role: "doctor";
  license: string;
  gender: "male" | "female";
  speciality: speciality | "";
  birth_date: Date;
}

type speciality = {
  id: string;
  description: null;
  name: string;
};

type fetchedData = {
  message: string;
  specializations: speciality[];
};

function Register() {
  const { data, isLoading, isError } = useQuery<fetchedData>({
    queryKey: ["specialities"],
    queryFn: () =>
      axios.get("https://medical-crm-backend-production.up.railway.app/spec").then((res) => res.data),
  });

  const initialValues: MyFormValues = {
    firstName: "",
    lastName: "",
    NID: "",
    password: "",
    role: "doctor",
    license: "",
    gender: "male",
    speciality: "",
    birth_date: new Date(),
  };

  const validationSchema = Yup.object({
    firstName: Yup.string().required("First name is required"),
    lastName: Yup.string().required("Last name is required"),
    NID: Yup.string().required("National ID is required"),
    license: Yup.string().required("License number is required"),
    password: Yup.string()
      .min(6, "Password must be at least 6 characters")
      .required("Password is required"),
    speciality: Yup.string().required("Speciality is required"),
  });

  return (
    <div className="w-full max-w-md">
      <div className="flex items-center mb-6">
        <Link to="/signup" className="text-[#663fba] hover:text-[#5a36a3] mr-3">
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <h1 className="text-2xl font-['Poppins'] font-bold text-[#663fba]">
          Doctor Registration
        </h1>
      </div>

      <Formik
        initialValues={initialValues}
        onSubmit={async (values, { setSubmitting }) => {
          try {
            setSubmitting(true);
            const res = await axios.post(
              "https://medical-crm-backend-production.up.railway.app/auth/sign-up",
              values
            );
            console.log(res);
          } catch (err) {
            console.error("Error during registration:", err);
          } finally {
            setSubmitting(false);
          }
        }}
        validationSchema={validationSchema}
      >
        {({ isSubmitting, errors, touched, setFieldValue, values }) => (
          <Form className="space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label
                  htmlFor="firstName"
                  className="block text-sm font-medium font-['Poppins'] text-[#7a7a7a] mb-1"
                >
                  First Name
                </label>
                <div className="relative">
                  <Field
                    type="text"
                    name="firstName"
                    id="firstName"
                    className={`pl-10 block w-full px-3 py-2 border rounded-lg shadow-sm focus:outline-none font-['Work_Sans'] sm:text-sm ${
                      errors.firstName && touched.firstName
                        ? "border-red-500 focus:ring-red-500 focus:border-red-500"
                        : "border-gray-300 focus:ring-[#663fba] focus:border-[#663fba]"
                    }`}
                    placeholder="Enter your first name"
                  />
                  <User className="absolute left-3 top-2.5 h-4 w-4 text-[#7a7a7a]" />
                </div>
                <ErrorMessage
                  name="firstName"
                  component="div"
                  className="text-red-500 text-xs mt-1 font-['Work_Sans']"
                />
              </div>
              <div>
                <label
                  htmlFor="lastName"
                  className="block text-sm font-medium font-['Poppins'] text-[#7a7a7a] mb-1"
                >
                  Last Name
                </label>
                <div className="relative">
                  <Field
                    type="text"
                    name="lastName"
                    id="lastName"
                    className={`pl-10 block w-full px-3 py-2 border rounded-lg shadow-sm focus:outline-none font-['Work_Sans'] sm:text-sm ${
                      errors.lastName && touched.lastName
                        ? "border-red-500 focus:ring-red-500 focus:border-red-500"
                        : "border-gray-300 focus:ring-[#663fba] focus:border-[#663fba]"
                    }`}
                    placeholder="Enter your last name"
                  />
                  <User className="absolute left-3 top-2.5 h-4 w-4 text-[#7a7a7a]" />
                </div>
                <ErrorMessage
                  name="lastName"
                  component="div"
                  className="text-red-500 text-xs mt-1 font-['Work_Sans']"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label
                  htmlFor="NID"
                  className="block text-sm font-medium font-['Poppins'] text-[#7a7a7a] mb-1"
                >
                  National ID
                </label>
                <div className="relative">
                  <Field
                    type="text"
                    name="NID"
                    id="NID"
                    className={`pl-10 block w-full px-3 py-2 border rounded-lg shadow-sm focus:outline-none font-['Work_Sans'] sm:text-sm ${
                      errors.NID && touched.NID
                        ? "border-red-500 focus:ring-red-500 focus:border-red-500"
                        : "border-gray-300 focus:ring-[#663fba] focus:border-[#663fba]"
                    }`}
                    placeholder="Enter your national ID"
                  />
                  <UserCircle className="absolute left-3 top-2.5 h-4 w-4 text-[#7a7a7a]" />
                </div>
                <ErrorMessage
                  name="NID"
                  component="div"
                  className="text-red-500 text-xs mt-1 font-['Work_Sans']"
                />
              </div>
              <div>
                <label
                  htmlFor="password"
                  className="block text-sm font-medium font-['Poppins'] text-[#7a7a7a] mb-1"
                >
                  Password
                </label>
                <div className="relative">
                  <Field
                    type="password"
                    name="password"
                    id="password"
                    className={`pl-10 block w-full px-3 py-2 border rounded-lg shadow-sm focus:outline-none font-['Work_Sans'] sm:text-sm ${
                      errors.password && touched.password
                        ? "border-red-500 focus:ring-red-500 focus:border-red-500"
                        : "border-gray-300 focus:ring-[#663fba] focus:border-[#663fba]"
                    }`}
                    placeholder="Enter your password"
                  />
                  <Lock className="absolute left-3 top-2.5 h-4 w-4 text-[#7a7a7a]" />
                </div>
                <ErrorMessage
                  name="password"
                  component="div"
                  className="text-red-500 text-xs mt-1 font-['Work_Sans']"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="birth_date"
                className="block text-sm font-medium font-['Poppins'] text-[#7a7a7a] mb-1"
              >
                Date of Birth
              </label>
              <div className="relative">
                <Field
                  type="date"
                  name="birth_date"
                  id="birth_date"
                  className={`pl-10 block w-full px-3 py-2 border rounded-lg shadow-sm focus:outline-none font-['Work_Sans'] sm:text-sm ${
                    errors.birth_date && touched.birth_date
                      ? "border-red-500 focus:ring-red-500 focus:border-red-500"
                      : "border-gray-300 focus:ring-[#663fba] focus:border-[#663fba]"
                  }`}
                  value={
                    values.birth_date
                      ? new Date(values.birth_date).toISOString().split("T")[0]
                      : ""
                  }
                  onChange={(e) => {
                    const dateValue = e.target.value;
                    const dateObject = dateValue ? new Date(dateValue) : null;
                    console.log(dateObject);
                    setFieldValue("birth_date", dateObject);
                  }}
                />
                <Calendar className="absolute left-3 top-2.5 h-4 w-4 text-[#7a7a7a]" />
              </div>
              <ErrorMessage
                name="birth_date"
                component="div"
                className="text-red-500 text-xs mt-1 font-['Work_Sans']"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label
                  htmlFor="license"
                  className="block text-sm font-medium font-['Poppins'] text-[#7a7a7a] mb-1"
                >
                  Medical License Number
                </label>
                <div className="relative">
                  <Field
                    type="text"
                    name="license"
                    id="license"
                    className={`pl-10 block w-full px-3 py-2 border rounded-lg shadow-sm focus:outline-none font-['Work_Sans'] sm:text-sm ${
                      errors.license && touched.license
                        ? "border-red-500 focus:ring-red-500 focus:border-red-500"
                        : "border-gray-300 focus:ring-[#663fba] focus:border-[#663fba]"
                    }`}
                    placeholder="Enter license number"
                  />
                  <Award className="absolute left-3 top-2.5 h-4 w-4 text-[#7a7a7a]" />
                </div>
                <ErrorMessage
                  name="license"
                  component="div"
                  className="text-red-500 text-xs mt-1 font-['Work_Sans']"
                />
              </div>
              <div>
                <label
                  htmlFor="gender"
                  className="block text-sm font-medium font-['Poppins'] text-[#7a7a7a] mb-1"
                >
                  Gender
                </label>
                <div className="mt-1">
                  <Field
                    as="select"
                    name="gender"
                    id="gender"
                    className="block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-[#663fba] focus:border-[#663fba] font-['Work_Sans'] sm:text-sm"
                  >
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                  </Field>
                </div>
              </div>
            </div>

            <div>
              <label
                htmlFor="speciality"
                className="block text-sm font-medium font-['Poppins'] text-[#7a7a7a] mb-1"
              >
                Speciality
              </label>
              <div className="relative">
                <Field
                  as="select"
                  name="speciality"
                  id="speciality"
                  className={`pl-10 block w-full px-3 py-2 border rounded-lg shadow-sm focus:outline-none font-['Work_Sans'] sm:text-sm ${
                    errors.speciality && touched.speciality
                      ? "border-red-500 focus:ring-red-500 focus:border-red-500"
                      : "border-gray-300 focus:ring-[#663fba] focus:border-[#663fba]"
                  }`}
                  disabled={isLoading}
                >
                  <option value="">Select your speciality</option>
                  {data?.specializations?.map((spec) => (
                    <option key={spec.id} value={spec.id}>
                      {spec.name}
                    </option>
                  ))}
                </Field>
                <Stethoscope className="absolute left-3 top-2.5 h-4 w-4 text-[#7a7a7a]" />
                {isLoading && (
                  <div className="absolute right-3 top-2.5">
                    <div className="w-4 h-4 border-2 border-t-[#663fba] border-r-[#663fba] border-b-[#663fba] border-l-transparent rounded-full animate-spin"></div>
                  </div>
                )}
              </div>
              <ErrorMessage
                name="speciality"
                component="div"
                className="text-red-500 text-xs mt-1 font-['Work_Sans']"
              />
              {isError && (
                <div className="text-red-500 text-xs mt-1 font-['Work_Sans']">
                  Unable to load specialities. Please try again later.
                </div>
              )}
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-[#663fba] hover:bg-[#5a36a3] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#663fba] transition duration-150 ease-in-out"
              >
                {isSubmitting ? (
                  <div className="w-5 h-5 border-2 border-t-transparent border-white rounded-full animate-spin"></div>
                ) : (
                  "Register"
                )}
              </button>
            </div>

            <div className="text-center mt-4 text-sm text-[#7a7a7a] font-['Work_Sans']">
              Already have an account?{" "}
              <Link
                to="/login"
                className="text-[#663fba] hover:text-[#5a36a3] font-medium"
              >
                Login
              </Link>
            </div>
            <div className="mt-3 text-center">
              <p className="text-sm font-['Work_Sans'] text-[#7a7a7a]">
                Sign up as a patient?{" "}
                <Link
                  to="/register/patient"
                  className="font-medium text-[#663fba] hover:text-[#5a36a3]"
                >
                  Patient Registration
                </Link>
              </p>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
}

export default Register;
