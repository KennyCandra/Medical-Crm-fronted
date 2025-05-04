import { ErrorMessage, Field } from "formik";

const DoctorId = ({ userIdQuery }) => {
  return (
    <div className="w-full mb-5">
      <label
        htmlFor="doctorId"
        className="block text-sm font-medium text-gray-700 mb-1"
      >
        Doctor NID
      </label>
      <Field
        type="text"
        name="doctorId"
        id="doctorId"
        className="block w-full px-4 py-3 border rounded-lg shadow-sm focus:outline-none sm:text-sm border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-gray-50 transition duration-150"
        value={userIdQuery.data?.profileId || ""}
        disabled
      />
      <ErrorMessage
        name="doctorId"
        component="div"
        className="text-red-500 text-sm mt-1"
      />
    </div>
  );
};

export default DoctorId;
