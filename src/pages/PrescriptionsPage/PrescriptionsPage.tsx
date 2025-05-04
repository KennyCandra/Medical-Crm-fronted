import { Link } from "react-router-dom";
import { usePrescriptions } from "../../Services/usePrescriptions";
import { userStore } from "../../zustand/userStore";

function PrescriptionsPage() {
  const { user, role } = userStore();
  const { prescriptionsQuery, userIdQuery } = usePrescriptions();

  const tableHeaders = [
    { id: 1, label: "Doctor" },
    { id: 2, label: "Patient" },
    { id: 3, label: "Prescription ID" },
    { id: 4, label: "Start Date" },
    { id: 5, label: "Status" },
  ];

  if (userIdQuery.isLoading || prescriptionsQuery.isLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-gray-50">
        <div className="w-20 h-20 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-6"></div>
        <p className="text-xl text-gray-700 font-medium">
          {userIdQuery.isLoading
            ? "Loading user information..."
            : "Loading prescriptions..."}
        </p>
      </div>
    );
  }

  if (userIdQuery.error || prescriptionsQuery.error) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-gray-50">
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-6 rounded max-w-xl w-full">
          <div className="flex items-center mb-3">
            <svg
              className="w-8 h-8 mr-3"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                clipRule="evenodd"
              />
            </svg>
            <p className="font-bold text-lg">Error</p>
          </div>
          <p className="text-base">
            {userIdQuery.error
              ? userIdQuery.error.message
              : prescriptionsQuery.error.message}
          </p>
          <button
            className="mt-5 bg-red-500 hover:bg-red-600 text-white py-2.5 px-5 rounded text-base font-medium transition"
            onClick={() => window.location.reload()}
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  const prescriptions = prescriptionsQuery.data?.prescriptions || [];

  const StatusBadge = ({ status }) => {
    const statusConfig = {
      taking: {
        color: "bg-green-100 text-green-800 border-green-200",
        label: "Active",
      },
      completed: {
        color: "bg-blue-100 text-blue-800 border-blue-200",
        label: "Completed",
      },
      cancelled: {
        color: "bg-red-100 text-red-800 border-red-200",
        label: "Cancelled",
      },
      pending: {
        color: "bg-yellow-100 text-yellow-800 border-yellow-200",
        label: "Pending",
      },
    };

    const config = statusConfig[status] || {
      color: "bg-gray-100 text-gray-800 border-gray-200",
      label: status,
    };

    return (
      <span
        className={`px-4 py-1.5 rounded-full text-sm font-medium border ${config.color}`}
      >
        {config.label}
      </span>
    );
  };

  return (
    <div className="p-8 max-w-7xl mx-auto bg-white rounded-lg shadow">
      <div className="border-b pb-5 mb-8">
        <h1 className="font-secondary text-4xl font-bold text-gray-800">
          Your Prescriptions
        </h1>
        <div className="flex items-center mt-3">
          <div className="bg-blue-100 text-blue-800 font-medium px-4 py-1.5 rounded-full text-base">
            {role === "doctor" ? "Doctor" : "Patient"}
          </div>
          <span className="ml-3 text-gray-600 font-medium text-lg">{user}</span>
        </div>
      </div>

      {prescriptions.length === 0 ? (
        <div className="py-20 flex flex-col items-center justify-center text-center">
          <svg
            className="w-24 h-24 text-gray-400 mb-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
            />
          </svg>
          <h3 className="text-2xl font-bold text-gray-700 mb-2">
            No prescriptions found
          </h3>
          <p className="text-gray-500 text-lg">
            You don't have any prescriptions yet.
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-lg border border-gray-200">
          <table className="font-primary text-base w-full">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                {tableHeaders.map((header) => (
                  <th
                    key={header.id}
                    className="px-8 py-4 text-left text-sm font-medium text-gray-500 uppercase tracking-wider"
                  >
                    {header.label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {prescriptions.map((prescription) => (
                <tr
                  key={prescription.id}
                  className="hover:bg-gray-50 transition-colors"
                >
                  <td className="px-8 py-5 whitespace-nowrap">
                    <div className="font-medium text-gray-900 text-base">
                      {prescription.doctor.user.first_name}{" "}
                      {prescription.doctor.user.last_name}
                    </div>
                  </td>
                  <td className="px-8 py-5 whitespace-nowrap">
                    <div className="font-medium text-gray-900 text-base">
                      {prescription.patient.user.first_name}{" "}
                      {prescription.patient.user.last_name}
                    </div>
                  </td>
                  <td className="px-8 py-5 whitespace-nowrap">
                    <Link
                      className="text-blue-600 hover:text-blue-800 font-medium transition text-base"
                      to={`/prescription/${prescription.id}`}
                    >
                      #{prescription.id.substring(0, 8)}...
                    </Link>
                  </td>
                  <td className="px-8 py-5 whitespace-nowrap text-base">
                    {new Date(prescription.start_date).toLocaleDateString(
                      "en-US",
                      {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      }
                    )}
                  </td>
                  <td className="px-8 py-5 whitespace-nowrap">
                    <StatusBadge status={prescription.status} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default PrescriptionsPage;
