import { useQuery } from "@tanstack/react-query";
import axios from "axios";
type Prescription = {
  start_date: string; // ISO date string
  status: "taking" | "done";
  doctor: {
    user: {
      first_name: string;
      last_name: string;
    };
  };
  patient: {
    user: {
      first_name: string;
      last_name: string;
      role: string;
    };
  };
};

type PrescriptionAPIResponse = {
  prescriptions: Prescription[];
  message: string;
};

function PrescriptionsPage() {
  const prescription = useQuery<PrescriptionAPIResponse>({
    queryKey: ["prescription"],
    queryFn: () =>
      axios
        .get<PrescriptionAPIResponse>(
          `http://localhost:8001/presc/doctor/04ebb97d-adfe-43fc-95b0-d0800909312e`
        )
        .then((res) => {
          console.log(res.data);
          return res.data;
        }),
  });
  return (
    <div className="pl-3">
      <h1 className="font-secondary text-3xl font-bold">
        All your Prescriptions
      </h1>
      <table className="border">
        <tr className="border">
          <th className="border px-20">doctor</th>
          <th className="border px-20">patient</th>
          <th className="border px-20">start date</th>
          <th className="border px-20">status</th>
        </tr>
        {prescription.data?.prescriptions.map((prescription) => (
          <tr className="border">
            <td className="border px-2 py-1">
              {prescription.doctor.user.first_name}{" "}
              {prescription.doctor.user.last_name}
            </td>
            <td className="border px-2 py-1">
              {prescription.patient.user.first_name}{" "}
              {prescription.patient.user.last_name}
            </td>
            <td className="border px-2 py-1">
              {new Date(prescription.start_date).toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </td>
            <td className="px-2 py-1 flex justify-between">
              {prescription.status}{" "}
              {prescription.status === "taking" ? (
                <img src="/images/taking.svg" />
              ) : (
                <img src="/images/done.svg" />
              )}
            </td>
          </tr>
        ))}
      </table>
    </div>
  );
}

export default PrescriptionsPage;
