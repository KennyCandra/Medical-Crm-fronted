import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useParams } from "react-router-dom";
import CustomButton from "../../components/CustomButton/CustomButton";
import instance from "../../axios/instance";
import { useEffect, useState } from "react";
import { ClipboardCheck, ClipboardList } from "lucide-react";

type Report = {
  id: string;
  doctorName: string;
  patientName: string;
  description: string;
  reviewed: boolean;
};

type DataAPI = {
  message: string;
  singleReport: Report;
};

function SinglePageReport() {
  const { reportId } = useParams();
  const [err, setErr] = useState<string | null>(null);
  const { data, isLoading } = useQuery<DataAPI>({
    queryKey: ["singleReport", reportId],
    queryFn: () =>
      axios.get(`https://medical-crm-backend-production.up.railway.app/reports/${reportId}`).then((res) => {
        console.log(res.data)
        return res.data;
      }),
  });

  const [reviewed, setReviewed] = useState<boolean | undefined>(
    data?.singleReport.reviewed
  );
  
  useEffect(() => {
    if (data) {
      setReviewed(data.singleReport.reviewed);
    }
  }, [data]);

  const handleMarkAsReviewed = () => {
    instance
      .put(`reports/edit/${reportId}`)
      .then(() => {
        setReviewed(true);
      })
      .catch((err) => {
        console.log(err.status);
        if (err.status === 401) {
          setErr("Unauthorized, this report does not belong to you");
          return;
        }
        if (err.status === 404) {
          console.log(err);
          setErr(err.response.data.message);
          return;
        }
        if (err.status === 500) {
          setErr("Server error, please try again later");
          return;
        }
        console.log(err);
        setReviewed(false);
      });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-8 bg-gray-50">
        <div className="w-24 h-24 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-6"></div>
        <p className="text-2xl text-gray-700 font-medium">
          Loading report details...
        </p>
      </div>
    );
  }

  const ReviewStatusBadge = ({ isReviewed }: { isReviewed: boolean }) => {
    const statusConfig = {
      true: {
        color: "bg-green-100 text-green-800 border-green-200",
        label: "Reviewed",
        icon: <ClipboardCheck className="w-8 h-8 text-green-600" />
      },
      false: {
        color: "bg-yellow-100 text-yellow-800 border-yellow-200",
        label: "Pending Review",
        icon: <ClipboardList className="w-8 h-8 text-yellow-600" />
      },
    };

    const config = statusConfig[String(isReviewed) as keyof typeof statusConfig] || {
      color: "bg-gray-100 text-gray-800 border-gray-200",
      label: "Unknown",
      icon: <ClipboardList className="w-8 h-8 text-gray-600" />
    };

    return (
      <div className="flex items-center space-x-3">
        <span
          className={`px-4 py-2 rounded-full text-lg font-medium border ${config.color}`}
        >
          {config.label}
        </span>
        {config.icon}
      </div>
    );
  };

  return (
    <div className="max-w-6xl mx-auto p-8 bg-white rounded-xl shadow-lg">
      <div className="border-b border-gray-200 pb-6 mb-8">
        <h1 className="text-5xl font-primary font-bold text-center mb-8 text-gray-800">
          Medical Report Details
        </h1>

        <div className="flex flex-col md:flex-row justify-between gap-8">
          <div className="bg-blue-50 rounded-xl p-6 flex-1">
            <h2 className="text-lg text-blue-600 font-medium mb-3">DOCTOR</h2>
            <p className="text-2xl font-secondary font-semibold text-gray-800">
              {data?.singleReport.doctorName}
            </p>
          </div>

          <div className="bg-purple-50 rounded-xl p-6 flex-1">
            <h2 className="text-lg text-purple-600 font-medium mb-3">
              PATIENT
            </h2>
            <p className="text-2xl font-secondary font-semibold text-gray-800">
              {data?.singleReport.patientName}
            </p>
          </div>
        </div>
      </div>

      <div className="mb-10">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div>
            <h2 className="text-2xl font-secondary font-bold mb-4 text-gray-700">
              Report Status
            </h2>
            <ReviewStatusBadge isReviewed={reviewed || false} />
          </div>

          {!reviewed && (
            <div className="flex flex-col gap-2 items-end">
              <CustomButton
                onClick={handleMarkAsReviewed}
                className="bg-green-600 hover:bg-green-700 text-white px-8 py-3 text-lg font-medium rounded-lg transition shadow-md"
              >
                Mark as Reviewed
              </CustomButton>
              {err && (
                <div className="mt-4 bg-red-50 border-l-4 border-red-500 p-4 w-full rounded">
                  <div className="flex">
                    <div className="flex-shrink-0">
                      <svg
                        className="h-5 w-5 text-red-500"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>
                    <div className="ml-3">
                      <p className="text-sm text-red-700">{err}</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      <div className="mb-10 bg-yellow-50 p-6 rounded-xl border border-yellow-100">
        <h2 className="text-2xl font-secondary font-bold mb-4 text-gray-700">
          Report Details
        </h2>
        <div className="bg-white p-5 rounded-lg shadow-sm border border-yellow-200">
          {data?.singleReport.description ? (
            <p className="text-lg text-gray-700 whitespace-pre-line">
              {data.singleReport.description}
            </p>
          ) : (
            <p className="text-lg text-gray-500 italic">
              No description provided for this report.
            </p>
          )}
        </div>
      </div>

      <div className="mt-8 border-t border-gray-200 pt-6 text-center">
        <p className="text-gray-500 text-lg">
          Report ID: <span className="font-medium text-gray-700">{reportId}</span>
        </p>
        <p className="text-gray-500 text-lg mt-2">
          Status:{" "}
          <span className="font-medium text-gray-700">
            {reviewed ? "Reviewed" : "Pending Review"}
          </span>
        </p>
      </div>
    </div>
  );
}

export default SinglePageReport;