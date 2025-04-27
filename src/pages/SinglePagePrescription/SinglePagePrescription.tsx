import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useParams } from "react-router-dom";
import type { prescription } from "../../../public/types/types";

type dataAPI = {
  message: string;
  prescription: prescription;
};

function SinglePagePrescription() {
  const { id } = useParams();

  const { data, isLoading } = useQuery<dataAPI>({
    queryKey: ["singlePresc", id],
    queryFn: () =>
      axios.get(`http://localhost:8001/presc/${id}`).then((res) => {
        return res.data;
      }),
  });

  if (isLoading) return <div>loading....</div>;

  return (
    <div className="flex flex-col justify-center ml-5 space-y-5">
      <h1 className="text-4xl font-primary font-semibold self-center mt-4">
        Single Prescrption
      </h1>
      <h1 className="text-2xl font-secondary font-medium ">
        Doctor Name: {data?.prescription.patient.user.first_name}{" "}
        {data?.prescription.patient.user.last_name}
      </h1>
      <h1 className="text-2xl font-secondary font-medium">
        Patient Name: {data?.prescription.patient.user.first_name}{" "}
        {data?.prescription.patient.user.last_name}
      </h1>
      <div>
        Status:{" "}
        {data?.prescription.status === "done" ? (
          <>
            <h1 className="inline"> Done</h1>{" "}
            <img className="inline" src="/images/done.svg" />
          </>
        ) : (
          <>
            <h1 className="inline"> taking </h1>
            <img className="inline" src="/images/taking.svg" />
          </>
        )}
      </div>
      <table className="font-primary text-md border border-gray-600 rounded-lg w-[90%] table-auto shadow-lg overflow-hidden">
        <thead className="bg-gray-200">
          <tr>
            <th className="px-4 py-2 text-left text-gray-700 font-semibold">Drug Name</th>
            <th className="px-4 py-2 text-left text-gray-700 font-semibold">Dose</th>
            <th className="px-4 py-2 text-left text-gray-700 font-semibold">Times Per Day</th>
          </tr>
        </thead>
        <tbody>
          {data?.prescription.prescribedDrugs &&
          data.prescription.prescribedDrugs.length > 0 ? (
            data?.prescription.prescribedDrugs.map((drug, index) => (
              <tr
                key={index}
                className={`${
                  index % 2 === 0 ? "bg-gray-100" : "bg-white"
                } hover:bg-gray-200`}
              >
                <td className="px-4 py-2 border-t border-gray-300">{drug.drug.name}</td>
                <td className="px-4 py-2 border-t border-gray-300">{drug.dosage}</td>
                <td className="px-4 py-2 border-t border-gray-300">{drug.frequency}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td
                colSpan={3}
                className="px-4 py-2 text-center text-gray-500 border-t border-gray-300"
              >
                No Drugs
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

export default SinglePagePrescription;
