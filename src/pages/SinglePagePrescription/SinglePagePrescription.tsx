import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useParams } from "react-router-dom";
import type { prescription } from "../../../public/types/types";
import CustomButton from "../../components/CustomButton/CustomButton";
import instance from "../../axios/instance";
import { useEffect, useState } from "react";
import { set } from "lodash";

type dataAPI = {
  message: string;
  prescription: prescription;
};

function SinglePagePrescription() {
  const { id } = useParams();
  const [err, setErr] = useState<string | null>(null);
  const { data, isLoading } = useQuery<dataAPI>({
    queryKey: ["singlePresc", id],
    queryFn: () =>
      axios.get(`http://localhost:8001/presc/${id}`).then((res) => {
        return res.data;
      }),
  });

  const [status, setStatus] = useState<string | undefined>(
    data?.prescription.status
  );
  useEffect(() => {
    if (data) {
      setStatus(data.prescription.status);
    }
  }, [data]);

  const handleChangeStatus = () => {
    instance
      .put(`presc/edit/${id}`)
      .then((res) => {
        setStatus("done");
        console.log(res.data);
      })
      .catch((err) => {
        console.log(err.status);
        if (err.status === 401) {
          setErr("Unauthorized, this prescription does not belong to you");
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
        setStatus("taking");
      });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-8 bg-gray-50">
        <div className="w-24 h-24 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-6"></div>
        <p className="text-2xl text-gray-700 font-medium">
          Loading prescription details...
        </p>
      </div>
    );
  }

  const StatusBadge = ({ currentStatus }: { currentStatus: string }) => {
    const statusConfig = {
      done: {
        color: "bg-green-100 text-green-800 border-green-200",
        label: "Completed",
        icon: "/images/done.svg",
      },
      taking: {
        color: "bg-blue-100 text-blue-800 border-blue-200",
        label: "Taking",
        icon: "/images/taking.svg",
      },
      cancelled: {
        color: "bg-red-100 text-red-800 border-red-200",
        label: "Cancelled",
        icon: "/images/cancelled.svg",
      },
    };

    const config = statusConfig[currentStatus as keyof typeof statusConfig] || {
      color: "bg-gray-100 text-gray-800 border-gray-200",
      label: currentStatus,
      icon: "/images/default.svg",
    };

    return (
      <div className="flex items-center space-x-3">
        <span
          className={`px-4 py-2 rounded-full text-lg font-medium border ${config.color}`}
        >
          {config.label}
        </span>
        <img className="w-8 h-8" src={config.icon} alt={config.label} />
      </div>
    );
  };

  return (
    <div className="max-w-6xl mx-auto p-8 bg-white rounded-xl shadow-lg">
      <div className="border-b border-gray-200 pb-6 mb-8">
        <h1 className="text-5xl font-primary font-bold text-center mb-8 text-gray-800">
          Prescription Details
        </h1>

        <div className="flex flex-col md:flex-row justify-between gap-8">
          <div className="bg-blue-50 rounded-xl p-6 flex-1">
            <h2 className="text-lg text-blue-600 font-medium mb-3">DOCTOR</h2>
            <p className="text-2xl font-secondary font-semibold text-gray-800">
              {data?.prescription.doctor.user.first_name}{" "}
              {data?.prescription.doctor.user.last_name}
            </p>
          </div>

          <div className="bg-purple-50 rounded-xl p-6 flex-1">
            <h2 className="text-lg text-purple-600 font-medium mb-3">
              PATIENT
            </h2>
            <p className="text-2xl font-secondary font-semibold text-gray-800">
              {data?.prescription.patient.user.first_name}{" "}
              {data?.prescription.patient.user.last_name}
            </p>
          </div>
        </div>
      </div>

      <div className="mb-10">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div>
            <h2 className="text-2xl font-secondary font-bold mb-4 text-gray-700">
              Prescription Status
            </h2>
            <StatusBadge currentStatus={status || "taking"} />
          </div>

          {status !== "done" && (
            <div className="flex flex-col gap-2 items-end">
              <CustomButton
                onClick={handleChangeStatus}
                className="bg-green-600 hover:bg-green-700 text-white px-8 py-3 text-lg font-medium rounded-lg transition shadow-md"
              >
                Mark as Completed
              </CustomButton>
              <CustomButton
                onClick={() => console.log("hello")}
                className="bg-red-600 hover:bg-red-700 text-white px-8 py-3 text-lg font-medium rounded-lg transition shadow-md"
              >
                report prescription
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

      <div className="bg-gray-50 p-6 rounded-xl">
        <h2 className="text-2xl font-secondary font-bold mb-6 text-gray-700">
          Prescribed Medications
        </h2>
        <div className="overflow-x-auto rounded-lg border border-gray-200">
          <table className="font-primary text-lg w-full">
            <thead>
              <tr className="bg-gray-100 border-b border-gray-200">
                <th className="px-8 py-4 text-left text-gray-700 font-semibold">
                  Drug Name
                </th>
                <th className="px-8 py-4 text-left text-gray-700 font-semibold">
                  Dose
                </th>
                <th className="px-8 py-4 text-left text-gray-700 font-semibold">
                  Times Per Day
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {data?.prescription.prescribedDrugs &&
              data.prescription.prescribedDrugs.length > 0 ? (
                data?.prescription.prescribedDrugs.map((drug, index) => (
                  <tr
                    key={index}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-8 py-5 font-medium text-gray-900">
                      {drug.drug.name}
                    </td>
                    <td className="px-8 py-5 text-gray-800">{drug.dosage}</td>
                    <td className="px-8 py-5 text-gray-800">
                      {drug.frequency}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={3}
                    className="px-8 py-8 text-center text-gray-500 text-lg"
                  >
                    <div className="flex flex-col items-center">
                      <svg
                        className="w-16 h-16 text-gray-400 mb-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
                        />
                      </svg>
                      <p>No medications have been prescribed</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div className="mt-8 border-t border-gray-200 pt-6 text-center">
        <p className="text-gray-500 text-lg">
          Prescription ID:{" "}
          <span className="font-medium text-gray-700">{id}</span>
        </p>
        <p className="text-gray-500 text-lg mt-2">
          Start Date:{" "}
          <span className="font-medium text-gray-700">
            {new Date(data?.prescription.start_date || "").toLocaleDateString(
              "en-US",
              { year: "numeric", month: "long", day: "numeric" }
            )}
          </span>
        </p>
      </div>
    </div>
  );
}

export default SinglePagePrescription;
