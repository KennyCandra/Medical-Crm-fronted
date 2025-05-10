import { Link } from "react-router-dom";
import { useReports } from "../../Services/useReport";
import { userStore } from "../../zustand/userStore";
import { ClipboardList } from "lucide-react";

function ReportPage() {
  const { user, role } = userStore();
  const reportsQuery = useReports();

  const tableHeaders = [
    { id: 1, label: "Doctor" },
    { id: 2, label: "Patient" },
    { id: 3, label: "Report ID" },
    { id: 4, label: "Review Status" },
  ];

  if (reportsQuery.isLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-gray-50">
        <div className="w-20 h-20 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-6"></div>
        <p className="text-xl text-gray-700 font-medium">Loading reports...</p>
      </div>
    );
  }

  if (reportsQuery.error) {
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
            {(reportsQuery.error as Error)?.message || "Failed to load reports"}
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

  const reports = reportsQuery.data?.finalResults || [];

  const ReviewStatusBadge = ({ reviewed }: { reviewed: boolean }) => {
    const statusConfig = {
      true: {
        color: "bg-green-100 text-green-800 border-green-200",
        label: "Reviewed",
      },
      false: {
        color: "bg-yellow-100 text-yellow-800 border-yellow-200",
        label: "Pending Review",
      },
    };

    const config = statusConfig[
      reviewed.toString() as keyof typeof statusConfig
    ] || {
      color: "bg-gray-100 text-gray-800 border-gray-200",
      label: "Unknown",
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
          Medical Reports
        </h1>
        <div className="flex items-center mt-3">
          <div className="bg-blue-100 text-blue-800 font-medium px-4 py-1.5 rounded-full text-base">
            {"Owner"}
          </div>
          <span className="ml-3 text-gray-600 font-medium text-lg">{user}</span>
        </div>
      </div>

      {reports.length === 0 ? (
        <div className="py-20 flex flex-col items-center justify-center text-center">
          <ClipboardList className="w-24 h-24 text-gray-400 mb-6" />
          <h3 className="text-2xl font-bold text-gray-700 mb-2">
            No reports found
          </h3>
          <p className="text-gray-500 text-lg">
            You don't have any medical reports yet.
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
              {reports.map((report) => (
                <tr
                  key={report.id}
                  className="hover:bg-gray-50 transition-colors"
                >
                  <td className="px-8 py-5 whitespace-nowrap">
                    <div className="font-medium text-gray-900 text-base">
                      {report.doctorName}
                    </div>
                  </td>
                  <td className="px-8 py-5 whitespace-nowrap">
                    <div className="font-medium text-gray-900 text-base">
                      {report.patientName}
                    </div>
                  </td>
                  <td className="px-8 py-5 whitespace-nowrap">
                    <Link
                      className="text-blue-600 hover:text-blue-800 font-medium transition text-base"
                      to={`/report/${report.id}`}
                    >
                      #{report.id.substring(0, 8)}...
                    </Link>
                  </td>
                  <td className="px-8 py-5 whitespace-nowrap">
                    <ReviewStatusBadge reviewed={report.reviewed} />
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

export default ReportPage;
