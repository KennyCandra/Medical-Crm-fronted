import { Link } from "react-router-dom";
import { usePrescriptions } from "../../axios/usePrescriptions";
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

  if (userIdQuery.isLoading) {
    return (
      <div className="p-4 flex justify-center">Loading user information...</div>
    );
  }

  if (userIdQuery.error) {
    return (
      <div className="p-4 text-red-500">
        Error loading user information: {userIdQuery.error.message}
      </div>
    );
  }

  if (prescriptionsQuery.isLoading) {
    return (
      <div className="p-4 flex justify-center">Loading prescriptions...</div>
    );
  }

  if (prescriptionsQuery.error) {
    return (
      <div className="p-4 text-red-500">
        Error loading prescriptions: {prescriptionsQuery.error.message}
      </div>
    );
  }

  const prescriptions = prescriptionsQuery.data?.prescriptions || [];

  return (
    <div className="p-6">
      <h1 className="font-secondary text-3xl font-bold mb-3">
        All your Prescriptions
      </h1>
      <h2 className="mb-6 font-secondary text-2xl font-semibold">{role === "doctor" && 'Doctor'} :{user}</h2>

      {prescriptions.length === 0 ? (
        <div className="text-gray-500">No prescriptions found.</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="font-primary text-md border border-gray-300 rounded-lg w-full table-auto shadow-lg overflow-hidden">
            <thead className="bg-gray-200">
              <tr>
                {tableHeaders.map((header) => (
                  <th
                    key={header.id}
                    className="px-4 py-3 text-left text-gray-700 font-semibold"
                  >
                    {header.label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {prescriptions.map((prescription, index) => (
                <tr
                  key={prescription.id}
                  className={`${
                    index % 2 === 0 ? "bg-gray-100" : "bg-white"
                  } hover:bg-gray-200`}
                >
                  <td className="p-4 border-t border-gray-300">
                    {prescription.doctor.user.first_name}{" "}
                    {prescription.doctor.user.last_name}
                  </td>
                  <td className="p-4 border-t border-gray-300">
                    {prescription.patient.user.first_name}{" "}
                    {prescription.patient.user.last_name}
                  </td>
                  <td className="p-4 border-t border-gray-300">
                    <Link
                      className="text-blue-600 hover:underline transition cursor-pointer"
                      to={`/prescription/${prescription.id}`}
                    >
                      {prescription.id}
                    </Link>
                  </td>
                  <td className="p-4 border-t border-gray-300">
                    {new Date(prescription.start_date).toLocaleDateString(
                      "en-US",
                      {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      }
                    )}
                  </td>
                  <td className="p-4 border-t border-gray-300">
                    <div className="flex items-center space-x-2">
                      <span
                        className={
                          prescription.status === "taking"
                            ? "text-green-600"
                            : "text-gray-600"
                        }
                      >
                        {prescription.status}
                      </span>
                      <img
                        className="w-5 h-5"
                        src={`/images/${prescription.status}.svg`}
                        alt={prescription.status}
                      />
                    </div>
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
