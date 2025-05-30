import { userStore } from "../../zustand/userStore";
import { useState } from "react";
import useFetchDoctorData from "../../Services/useFetchDoctorData";
import { usePrescriptions } from "../../Services/usePrescriptions";
import useFetchPatientDiagnosis from "../../Services/useFetchPatientDiagnosis";
import Presentational from "./Presentational";

export type card = {
  id: number;
  text: string;
  number: number | string;
  color: string | null;
  allowedRoles?: string[];
  textUrl?: string;
};

export type PrescriptionCard = {
  id: number;
  status: string;
  text: string;
  number: number;
  color: string;
  icon?: string;
  link?: string;
};

const actions = [
  {
    id: 1,
    action: "Create a Prescription",
    img: "/images/prescription.svg",
    link: "/prescription/create",
    allowedRoles: ["doctor", "owner"],
  },
  {
    id: 2,
    action: "Make a Diagnosis",
    img: "/images/report-medical.svg",
    link: "/diagnosis/create",
    allowedRoles: ["doctor", "owner"],
  },
  {
    id: 3,
    action: "Define Your Allergies",
    img: "/images/allergies-solid.svg",
    link: "/allergy/create",
    allowedRoles: ["patient"],
  },
];

export default function Profile() {
  const { prescriptionsQuery } = usePrescriptions();

  const { user } = userStore();
  const [err, setErr] = useState<string>("");

  const name = user?.first_name + " " + user?.last_name;

  const header = (role: "doctor" | "patient" | "owner") => {
    switch (role) {
      case "doctor":
        return `Dr: ${name}`;
      case "patient":
        return "Your Health Dashboard";
      default:
        return "Dashboard";
    }
  };
  const doctor = useFetchDoctorData(name, setErr, user.role);

  const diagnosisQuery = useFetchPatientDiagnosis(user.NID);
  const diagnsis =
    diagnosisQuery?.data?.diagnosis.map((diagnoses) => {
      return diagnoses.disease.name;
    }) || [];

  const qrData = `http://192.168.1.10:5173/patient/${user.NID}`;

  const prescriptions: PrescriptionCard[] = [
    {
      id: 1,
      text: "Active Prescriptions",
      link: "/prescription?status=taking",
      number: prescriptionsQuery.data?.notCompleted || 0,
      status: "Active",
      color: "bg-green-100 text-green-800",
      icon: "💊",
    },
    {
      id: 2,
      text: "Completed Prescriptions",
      number: prescriptionsQuery.data?.completed || 0,
      status: "Completed",
      link: "/prescription?status=completed",
      color: "bg-blue-100 text-blue-500",
      icon: "✓",
    },
  ];

  const cardsInputs: card[] = [
    {
      id: 1,
      text: "prescriptions",
      number: 0,
      color: " bg-linear-to-r from-primary via-primary to-white text-white",
      allowedRoles: ["doctor", "patient"],
      textUrl: "/prescription",
    },
    {
      id: 2,
      text: "diagnosis",
      number:
        user.role === "patient"
          ? diagnsis.length > 0
            ? `this patient is diagnosed with ${diagnsis.join(", ")}`
            : "No diagnosis available"
          : 100,
      color: null,
      allowedRoles: ["doctor", "patient"],
    },
    {
      id: 3,
      text: "speciality",
      number: doctor.data?.speciality ? doctor.data.speciality : "N/A",
      color: null,
      allowedRoles: ["doctor"],
    },
    {
      id: 4,
      text: "Allergies",
      number: "None reported",
      color: null,
      allowedRoles: ["patient"],
      textUrl: "/allergy/create",
    },
  ];

  if (prescriptionsQuery.isLoading) return <div>loading</div>;

  return (
    <Presentational
      err={err}
      actions={actions}
      cardsInputs={cardsInputs}
      header={header(user.role)}
      nid={user.NID}
      qrData={qrData}
      role={user.role}
      prescriptions={prescriptions}
      showQrCode={true}
      prescriptionsQuery={prescriptionsQuery}
      key={"1"}
      user={name}
    />
  );
}
