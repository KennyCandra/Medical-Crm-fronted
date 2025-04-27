import axios from "axios";
import { useQuery } from "@tanstack/react-query";
import { ErrorMessage, Field, Formik, Form } from "formik";
import * as Yup from "yup";
import { Link } from "react-router-dom";

interface MyFormValues {
  firstName: string;
  lastName: string;
  NID: string;
  password: string;
  role: "doctor";
  license: string;
  gender: "male" | "female";
  speciality: speciality | "";
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
  const { data } = useQuery<fetchedData>({
    queryKey: ["specialities"],
    queryFn: () =>
      axios.get("http://localhost:8001/spec").then((res) => res.data),
  });
  const formFields = [
    {
      label: "First name",
      type: "text",
      name: "firstName",
      placeholder: "Enter your first name",
    },
    {
      label: "last Name",
      type: "text",
      name: "lastName",
      placeholder: "Enter your last name",
    },
    {
      label: "NID",
      type: "text",
      name: "NID",
      placeholder: "Enter your NID",
    },
    {
      label: "role",
      type: "text",
      name: "role",
      placeholder: "Enter your role",
      readOnly: true,
    },
    {
      label: "license",
      type: "text",
      name: "license",
      placeholder: "Enter your NID",
    },
    {
      label: "Password",
      type: "password",
      name: "password",
      placeholder: "Enter your password",
    },
  ];
  const initialValues: MyFormValues = {
    firstName: "",
    lastName: "",
    NID: "",
    password: "",
    role: "doctor",
    license: "",
    gender: "male",
    speciality: "",
  };
  const validationSchema = Yup.object();

  return (
    <div className="w-[75%] max-w-[400px] flex flex-col justify-center items-center">
      <h1 className="text-2xl font-bold text-center mb-6">sign up</h1>
      <Formik
        initialValues={initialValues}
        onSubmit={async (values, { setSubmitting }) => {
          try {
            setSubmitting(true);
            const res = await axios.post(
              "http://localhost:8001/auth/sign-up",
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
                  readOnly={field.readOnly}
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
              <label
                htmlFor="gender"
                className="block text-sm font-medium text-gray-700"
              >
                Gender
              </label>
              <Field
                as="select"
                name="gender"
                id="gender"
                className={`mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none sm:text-sm ${
                  errors.gender && touched.gender
                    ? "border-red-500 focus:ring-red-500 focus:border-red-500"
                    : "border-gray-300 focus:ring-primary focus:border-primary"
                }`}
              >
                <option value="">Select your gender</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
              </Field>
              <ErrorMessage
                name="gender"
                component="div"
                className="text-red-500 text-sm mt-1"
              />
            </div>

            <div>
              <label
                htmlFor="speciality"
                className="block text-sm font-medium text-gray-700"
              >
                Speciality
              </label>
              <Field
                as="select"
                name="speciality"
                id="speciality"
                className={`mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none sm:text-sm ${
                  errors.speciality && touched.speciality
                    ? "border-red-500 focus:ring-red-500 focus:border-red-500"
                    : "border-gray-300 focus:ring-primary focus:border-primary"
                }`}
              >
                <option value="">Select your speciality</option>
                {data?.specializations.map((speciality) => (
                  <option key={speciality.id} value={speciality.id}>
                    {speciality.name}
                  </option>
                ))}
              </Field>
              <ErrorMessage
                name="speciality"
                component="div"
                className="text-red-500 text-sm mt-1"
              />
            </div>

            <div>
              <button
                type="submit"
                className="cursor-pointer disabled:bg-gray-500 w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Submitting..." : "Sign Up"}
              </button>
            </div>
          </Form>
        )}
      </Formik>

      <div className="mt-6 text-center">
        <p className="text-sm text-gray-600 mt-2">
          already have account??{" "}
          <Link
            to="/login"
            className="font-medium text-primary hover:text-primary-dark"
          >
            login
          </Link>
        </p>
      </div>
      <div className="mt-6 text-center">
        <p className="text-sm text-gray-600 mt-2">
          sign up as a patient{" "}
          <Link
            to="/register/patient"
            className="font-medium text-primary hover:text-primary-dark"
          >
            Sign Up
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Register;
