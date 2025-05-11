import axios from "axios";
import { ErrorMessage, Field, Formik, Form } from "formik";
import * as Yup from "yup";
import { Link } from "react-router-dom";
import {
  User,
  Lock,
  Droplet,
  UserCircle,
  ArrowLeft,
  Calendar,
} from "lucide-react";
import { BASEURL } from "../../../axios/instance";

interface MyFormValues {
  firstName: string;
  lastName: string;
  NID: string;
  password: string;
  role: "patient";
  license: string;
  gender: "male" | "female";
  blood_type: bloodType;
  birth_date: Date;
}

type bloodType =
  | "A+"
  | "A-"
  | "B+"
  | "B-"
  | "O+"
  | "O-"
  | "AB+"
  | "AB-"
  | "unknown";

const bloodTypeOptions = [
  { id: 1, name: "A+" },
  { id: 2, name: "A-" },
  { id: 3, name: "B+" },
  { id: 4, name: "B-" },
  { id: 5, name: "O+" },
  { id: 6, name: "O-" },
  { id: 7, name: "AB+" },
  { id: 8, name: "AB-" },
  { id: 9, name: "unknown" },
];

function RegisterPatient() {
  const initialValues: MyFormValues = {
    firstName: "",
    lastName: "",
    NID: "",
    password: "",
    role: "patient",
    license: "",
    gender: "male",
    blood_type: "unknown",
    birth_date: new Date(),
  };

  const validationSchema = Yup.object({
    firstName: Yup.string().required("First name is required"),
    lastName: Yup.string().required("Last name is required"),
    NID: Yup.string().required("National ID is required"),
    password: Yup.string()
      .min(6, "Password must be at least 6 characters")
      .required("Password is required"),
  });

  return (
    <div className="w-full max-w-md">
      <div className="flex items-center mb-6">
        <Link to="/signup" className="text-[#663fba] hover:text-[#5a36a3] mr-3">
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <h1 className="text-2xl font-['Poppins'] font-bold text-[#663fba]">
          Patient Registration
        </h1>
      </div>

      <Formik
        initialValues={initialValues}
        onSubmit={async (values, { setSubmitting }) => {
          try {
            setSubmitting(true);
            const res = await axios.post(
              `${BASEURL}/auth/sign-up`,
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
        {({ isSubmitting, errors, touched, values, setFieldValue }) => (
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
                  placeholder="Enter your National ID"
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

            <Field type="hidden" name="role" value="patient" />
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
                  htmlFor="gender"
                  className="block text-sm font-medium font-['Poppins'] text-[#7a7a7a] mb-1"
                >
                  Gender
                </label>
                <Field
                  as="select"
                  name="gender"
                  id="gender"
                  className={`block w-full px-3 py-2 border rounded-lg shadow-sm focus:outline-none font-['Work_Sans'] sm:text-sm ${
                    errors.gender && touched.gender
                      ? "border-red-500 focus:ring-red-500 focus:border-red-500"
                      : "border-gray-300 focus:ring-[#663fba] focus:border-[#663fba]"
                  }`}
                >
                  <option value="">Select your gender</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                </Field>
                <ErrorMessage
                  name="gender"
                  component="div"
                  className="text-red-500 text-xs mt-1 font-['Work_Sans']"
                />
              </div>

              <div>
                <label
                  htmlFor="blood_type"
                  className="block text-sm font-medium font-['Poppins'] text-[#7a7a7a] mb-1"
                >
                  Blood Type
                </label>
                <div className="relative">
                  <Field
                    as="select"
                    name="blood_type"
                    id="blood_type"
                    className={`pl-10 block w-full px-3 py-2 border rounded-lg shadow-sm focus:outline-none font-['Work_Sans'] sm:text-sm ${
                      errors.blood_type && touched.blood_type
                        ? "border-red-500 focus:ring-red-500 focus:border-red-500"
                        : "border-gray-300 focus:ring-[#663fba] focus:border-[#663fba]"
                    }`}
                  >
                    <option value="">Select your Blood Type</option>
                    {bloodTypeOptions.map((blood) => (
                      <option key={blood.id} value={blood.name}>
                        {blood.name}
                      </option>
                    ))}
                  </Field>
                  <Droplet className="absolute left-3 top-2.5 h-4 w-4 text-[#fe91ad]" />
                </div>
                <ErrorMessage
                  name="blood_type"
                  component="div"
                  className="text-red-500 text-xs mt-1 font-['Work_Sans']"
                />
              </div>
            </div>

            <div className="pt-4">
              <button
                type="submit"
                className="cursor-pointer w-full flex justify-center items-center gap-2 py-2 px-4 border border-transparent rounded-lg shadow-sm text-sm font-['Poppins'] font-medium text-white bg-[#663fba] hover:bg-[#5a36a3] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#663fba] transition-all duration-300 disabled:bg-gray-400 disabled:cursor-not-allowed"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Registering..." : "Complete Registration"}
              </button>
            </div>
          </Form>
        )}
      </Formik>

      <div className="mt-6 text-center">
        <p className="text-sm font-['Work_Sans'] text-[#7a7a7a]">
          Already have an account?{" "}
          <Link
            to="/login"
            className="font-medium text-[#663fba] hover:text-[#5a36a3]"
          >
            Login
          </Link>
        </p>
      </div>
      <div className="mt-3 text-center">
        <p className="text-sm font-['Work_Sans'] text-[#7a7a7a]">
          Sign up as a doctor?{" "}
          <Link
            to="/register/doctor"
            className="font-medium text-[#663fba] hover:text-[#5a36a3]"
          >
            Doctor Registration
          </Link>
        </p>
      </div>
    </div>
  );
}

export default RegisterPatient;
