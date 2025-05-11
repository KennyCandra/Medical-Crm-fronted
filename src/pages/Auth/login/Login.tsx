import { useState } from "react";
import axios from "axios";
import { ErrorMessage, Field, Form, Formik } from "formik";
import * as Yup from "yup";
import { userStore } from "../../../zustand/userStore";
import { useNavigate, Link } from "react-router-dom";
import { User, Lock } from "lucide-react";
import { BASEURL } from "../../../axios/instance";

// Improved type definition with required fields
interface LoginFormValues {
  nid: string;
  password: string;
  rememberMe: boolean;
}

function Login() {
  const navigate = useNavigate();
  const { setAccessToken, setIsAuthenticated, setRole, setUser, setNid } =
    userStore();
  const [isLoading, setIsLoading] = useState(false);
  const [loginError, setLoginError] = useState("");

  // Enhanced validation schema
  const validationSchema = Yup.object({
    nid: Yup.string()
      .required("NID is required")
      .min(13, "NID must be at least 13 digits")
      .matches(/^\d+$/, "NID must contain only digits"),
    password: Yup.string()
      .required("Password is required")
      .min(6, "Password must be at least 6 characters"),
    rememberMe: Yup.boolean(),
  });

  const initialValues: LoginFormValues = {
    nid: "",
    password: "",
    rememberMe: false,
  };

  const handleLogin = async (
    values: LoginFormValues,
    { setSubmitting, setFieldError }
  ) => {
    setIsLoading(true);
    setLoginError("");

    try {
      const res = await axios.post(
        `${BASEURL}/auth/login`,
        values,
        { withCredentials: true }
      );

      setIsAuthenticated(true);
      setUser(`${res.data.user.first_name} ${res.data.user.last_name}`);
      setRole(res.data.user.role);
      setAccessToken(res.data.accessToken);
      setNid(res.data.user.NID);
      navigate("/", { replace: true });
    } catch (err) {
      if (err.response) {
        if (err.response.status === 401) {
          setFieldError("password", "Incorrect password");
        } else if (err.response.status === 404) {
          setFieldError("nid", "NID not found");
        } else {
          setLoginError("Login failed. Please try again later.");
        }
      } else if (err.request) {
        setLoginError(
          "Cannot connect to server. Please check your internet connection."
        );
      } else {
        setLoginError("An unexpected error occurred. Please try again.");
      }
      console.error("Login error:", err);
    } finally {
      setIsLoading(false);
      setSubmitting(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
      <h1 className="text-3xl font-bold text-center text-[#663fba] mb-6 font-['Poppins']">
        Welcome Back
      </h1>

      {loginError && (
        <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
          {loginError}
        </div>
      )}

      <Formik
        initialValues={initialValues}
        onSubmit={handleLogin}
        validationSchema={validationSchema}
      >
        {({ isSubmitting, errors, touched }) => (
          <Form className="space-y-5">
            <div>
              <label
                htmlFor="nid"
                className="block text-sm font-medium font-['Poppins'] text-[#7a7a7a] mb-1"
              >
                National ID
              </label>
              <div className="relative">
                <Field
                  type="text"
                  name="nid"
                  id="nid"
                  className={`pl-10 block w-full px-3 py-2 border rounded-lg shadow-sm focus:outline-none font-['Work_Sans'] sm:text-sm ${
                    errors.nid && touched.nid
                      ? "border-red-500 focus:ring-red-500 focus:border-red-500"
                      : "border-gray-300 focus:ring-[#663fba] focus:border-[#663fba]"
                  }`}
                  placeholder="Enter your 13-digit NID"
                  autoComplete="username"
                />
                <User className="absolute left-3 top-2.5 h-4 w-4 text-[#7a7a7a]" />
              </div>
              <ErrorMessage
                name="nid"
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
                  autoComplete="current-password"
                />
                <Lock className="absolute left-3 top-2.5 h-4 w-4 text-[#7a7a7a]" />
              </div>
              <ErrorMessage
                name="password"
                component="div"
                className="text-red-500 text-xs mt-1 font-['Work_Sans']"
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <Field
                  type="checkbox"
                  name="rememberMe"
                  id="rememberMe"
                  className="h-4 w-4 text-[#663fba] focus:ring-[#663fba] border-gray-300 rounded"
                />
                <label
                  htmlFor="rememberMe"
                  className="ml-2 block text-sm text-[#7a7a7a] font-['Work_Sans']"
                >
                  Remember me
                </label>
              </div>
              <div className="text-sm">
                <a
                  href="/forgot-password"
                  className="font-medium text-[#663fba] hover:text-[#5a36a3] font-['Work_Sans']"
                >
                  Forgot password?
                </a>
              </div>
            </div>

            <div>
              <button
                type="submit"
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-[#663fba] hover:bg-[#5a36a3] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#663fba] disabled:bg-[#a28ad4] disabled:cursor-not-allowed transition duration-150 ease-in-out"
                disabled={isSubmitting || isLoading}
              >
                {isSubmitting || isLoading ? (
                  <div className="w-5 h-5 border-2 border-t-transparent border-white rounded-full animate-spin"></div>
                ) : (
                  "Sign In"
                )}
              </button>
            </div>
          </Form>
        )}
      </Formik>

      <div className="mt-6 text-center">
        <p className="text-sm text-[#7a7a7a] font-['Work_Sans']">
          Don't have an account?{" "}
          <Link
            to="/signup"
            className="font-medium text-[#663fba] hover:text-[#5a36a3]"
          >
            Create Account
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Login;
