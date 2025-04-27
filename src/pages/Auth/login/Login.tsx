import axios from "axios";
import { ErrorMessage, Field, Form, Formik } from "formik";
import * as Yup from "yup";
import { userStore } from "../../../zustand/userStore";
import { useNavigate } from "react-router-dom";

interface MyFormValues {
  nid: string | null;
  password: string | null;
}

function Login() {
  const navigate = useNavigate();
  const { setAccessToken, setIsAuthenticated, setRole, setUser } = userStore();
  const validationSchema = Yup.object({
    nid: Yup.string()
      .required("NID is required")
      .min(13, "NID must be at least 13 digits"),
    password: Yup.string()
      .required("Password is required")
      .min(6, "Password must be at least 6 characters"),
  });

  const initialValues: MyFormValues = { nid: "", password: "" };

  const formFields = [
    {
      label: "NID",
      type: "string",
      name: "nid",
      placeholder: "Enter your NID",
    },
    {
      label: "Password",
      type: "password",
      name: "password",
      placeholder: "Enter your password",
    },
  ];

  return (
    <div className="w-[75%] max-w-[400px] flex flex-col justify-center items-center">
      <h1 className="text-2xl font-bold text-center mb-6">Log In</h1>
      <Formik
        initialValues={initialValues}
        onSubmit={async (
          values: MyFormValues,
          { setSubmitting, setFieldError }
        ) => {
          try {
            const res = await axios.post(
              "http://localhost:8001/auth/login",
              values,
              { withCredentials: true }
            );

            if (res.status === 401) {
              setFieldError("password", "wrong password");
            }

            if (res.status === 404) {
              setFieldError("nid", "wrond nid");
            }

            setIsAuthenticated(true);
            setUser(`${res.data.user.first_name} ${res.data.user.last_name}`);
            setRole(res.data.user.role);
            setAccessToken(res.data.accessToken);
            navigate("/", { replace: true });
          } catch (err) {
            if (err.response) {
              if (err.response.status === 401) {
                setFieldError("password", "wrong password");
              } else if (err.response.status === 404) {
                setFieldError("nid", "wrong NID");
              }
            }
            console.log(err);
          } finally {
            setSubmitting(true);
          }
        }}
        validationSchema={validationSchema}
      >
        {({ isSubmitting, errors, touched }) => (
          <Form className="space-y-6 flex flex-col w-full max-w-[300px]">
            {formFields.map((field) => (
              <div key={field.name}>
                <label
                  htmlFor={field.name}
                  className="block text-sm font-medium text-gray-700"
                >
                  {field.label}
                </label>
                <Field
                  type={field.type}
                  name={field.name}
                  id={field.name}
                  className={`mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none sm:text-sm ${
                    errors[field.name as keyof MyFormValues] &&
                    touched[field.name as keyof MyFormValues]
                      ? "border-red-500 focus:ring-red-500 focus:border-red-500"
                      : "border-gray-300 focus:ring-primary focus:border-primary"
                  }`}
                  placeholder={field.placeholder}
                />
                <ErrorMessage
                  name={field.name}
                  component="div"
                  className="text-red-500 text-sm mt-1"
                />
              </div>
            ))}

            <div>
              <button
                type="submit"
                className="cursor-pointer disabled:bg-gray-500 w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Logging in..." : "Log In"}
              </button>
            </div>
          </Form>
        )}
      </Formik>

      <div className="mt-6 text-center">
        <p className="text-sm text-gray-600">
          <a
            href="/forgot-password"
            className="font-medium text-primary hover:text-primary-dark"
          >
            Forgot your password?
          </a>
        </p>
        <p className="text-sm text-gray-600 mt-2">
          Don't have an account?{" "}
          <a
            href="/signup"
            className="font-medium text-primary hover:text-primary-dark"
          >
            Sign Up
          </a>
        </p>
      </div>
    </div>
  );
}

export default Login;
