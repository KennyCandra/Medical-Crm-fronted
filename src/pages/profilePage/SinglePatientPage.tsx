import { Link, useParams } from "react-router-dom";
import { QRCodeSVG } from "qrcode.react";
import ProfilePageCard from "../../components/ProfilePageCard/ProfilePageCard";
import Actions from "../../components/Actions/Actions";
import useFetchPatientData from "../../Services/useFetchPatientAllData";

type PrescriptionCard = {
  id: number | string;
  status: string;
  text: string;
  number: number;
  color: string;
  icon?: string;
  link?: string;
};

type CardInput = {
  id: number;
  text: string;
  number: number | string;
  color: string | null;
  textUrl?: string;
};

const PatientEndpoint = () => {
  const { nid } = useParams<{ nid: string }>();
  const patientData = useFetchPatientData(nid, "singlepage" + nid);
  const calculateAge = (birthDate: string) => {
    const today = new Date();
    const birth = new Date(birthDate);
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();

    if (
      monthDiff < 0 ||
      (monthDiff === 0 && today.getDate() < birth.getDate())
    ) {
      age--;
    }

    return age;
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const createCardInputs = (): CardInput[] => {
    if (!patientData.data) return [];

    const patient = patientData.data;
    return [
      {
        id: 1,
        text: "Blood Type",
        number: patientData.data.patient?.blood_type || "Unknown",
        color: "bg-red-100 text-red-800",
      },
      {
        id: 2,
        text: "Age",
        number: calculateAge(patient?.user?.birth_date),
        color: "bg-blue-100 text-blue-800",
      },
      {
        id: 3,
        text: "Prescriptions",
        number: patient?.prescriptions?.length || 0,
        color: "bg-green-100 text-green-800",
        textUrl: `/prescription/patient/${patient?.user?.NID}`,
      },
      {
        id: 4,
        text: "Allergies",
        number: patient?.allergies?.length || 0,
        color: "bg-yellow-100 text-yellow-800",
        textUrl: `/allergy/patient/${patient?.user?.NID}`,
      },
      {
        id: 5,
        text: "Diagnoses",
        number: patient?.diagnoses?.length || 0,
        color: "bg-purple-100 text-purple-800",
        textUrl: `/diagnosis/patient/${patient?.user?.NID}`,
      },
    ];
  };

  const generatePrescriptionCards = (): PrescriptionCard[] => {
    if (!patientData?.data) return [];

    const activePrescriptions =
      patientData?.data?.prescriptions?.filter(
        (p) => p.status === "taking" || p.status === "active"
      ) || [];
    const completedPrescriptions =
      patientData?.data?.prescriptions?.filter(
        (p) => p.status === "done" || p.status === "completed"
      ) || [];

    return [
      {
        id: 1,
        text: "Active Prescriptions",
        link: `/prescription/patient/${patientData?.data?.user?.NID}?status=taking`,
        number: activePrescriptions.length,
        status: "Active",
        color: "bg-green-100 text-green-800",
        icon: "💊",
      },
      {
        id: 2,
        text: "Completed Prescriptions",
        number: completedPrescriptions?.length,
        status: "Completed",
        link: `/prescription/patient/${patientData.data?.user?.NID}?status=completed`,
        color: "bg-gray-100 text-gray-800",
        icon: "✓",
      },
    ];
  };

  const patientActions = [
    {
      id: 1,
      action: "Create New Prescription",
      img: "/images/prescription.svg",
      link: `/prescription/create?nid=${nid}`,
      allowedRoles: ["doctor", "owner"],
    },
    {
      id: 2,
      action: "Make a Diagnosis",
      img: "/images/report-medical.svg",
      link: `/diagnosis/create?nid=${nid}`,
      allowedRoles: ["doctor", "owner"],
    },
    {
      id: 3,
      action: "Add Allergy Information",
      img: "/images/allergies-solid.svg",
      link: `/allergy/create/${nid}`,
      allowedRoles: ["doctor", "owner", "patient"],
    },
  ];

  if (patientData.isLoading) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <div className="bg-white rounded-2xl p-6 shadow-md border border-gray-200 flex justify-center items-center min-h-[300px]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading patient information...</p>
          </div>
        </div>
      </div>
    );
  }

  if (patientData.error || patientData.data === null) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <div className="bg-white rounded-2xl p-6 shadow-md border border-gray-200 flex justify-center items-center min-h-[300px]">
          <div className="text-center">
            <div className="bg-red-100 text-red-700 p-4 rounded-lg mb-4">
              <p>{patientData.error.message || "Patient not found"}</p>
            </div>
            <a href="/patients" className="text-blue-500 hover:underline">
              Back to Patients List
            </a>
          </div>
        </div>
      </div>
    );
  }
  const qrData = "";

  const cardInputs = createCardInputs();
  const prescriptionCards = generatePrescriptionCards();

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">
          Patient Profile: {patientData.data?.user?.first_name}{" "}
          {patientData.data?.user?.last_name}
        </h1>

        <div className="bg-white rounded-2xl p-6 shadow-md border border-gray-200 mb-6">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="mb-4 md:mb-0">
              <h2 className="font-bold text-xl text-gray-800 mb-2">
                Patient Information
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-gray-600">
                    <span className="font-semibold">Name:</span>{" "}
                    {patientData.data?.user?.first_name}{" "}
                    {patientData.data?.user?.last_name}
                  </p>
                  <p className="text-gray-600">
                    <span className="font-semibold">Gender:</span>{" "}
                    {patientData.data?.user?.gender.charAt(0).toUpperCase() +
                      patientData.data?.user?.gender.slice(1)}
                  </p>
                  <p className="text-gray-600">
                    <span className="font-semibold">Birth Date:</span>{" "}
                    {formatDate(patientData.data?.user?.birth_date)}
                  </p>
                </div>
                <div>
                  <p className="text-gray-600">
                    <span className="font-semibold">NID:</span>{" "}
                    {patientData.data?.user.NID}
                  </p>
                  <p className="text-gray-600">
                    <span className="font-semibold">Patient ID:</span>{" "}
                    {patientData.data?.patient.id}
                  </p>
                  <p className="text-gray-600">
                    <span className="font-semibold">Blood Type:</span>{" "}
                    {patientData.data?.patient.blood_type}
                  </p>
                </div>
              </div>
            </div>
            <div className="flex flex-col items-center">
              <QRCodeSVG
                value={qrData}
                size={160}
                bgColor={"#FFFFFF"}
                fgColor={"#000000"}
                level={"H"}
              />
              <p className="text-sm text-gray-500 mt-2">
                Scan for quick access
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 bg-gray-50 rounded-2xl p-6 shadow-sm border border-gray-200">
          {cardInputs.map((input) => (
            <ProfilePageCard
              textUrl={input.textUrl}
              key={input.id}
              text={input.text}
              number={input.number}
              color={input.color || ""}
            />
          ))}
        </div>
      </div>

      <div className="bg-gray-50 rounded-2xl p-6 shadow-sm border border-gray-200">
        <h2 className="font-bold text-2xl text-gray-800 mb-6 flex items-center">
          <span className="mr-2">🩺</span> Patient Management
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {patientActions.map((action) => (
            <Actions
              link={action.link}
              img={action.img}
              action={action.action}
              key={action.id}
            />
          ))}
        </div>
      </div>

      {patientData.data?.diagnoses &&
        patientData?.data?.diagnoses.length > 0 && (
          <div className="bg-gray-50 rounded-2xl p-6 shadow-sm border border-gray-200 mt-8">
            <h2 className="font-bold text-2xl text-gray-800 mb-6 flex items-center">
              <span className="mr-2">🔍</span> Current Diagnoses
            </h2>
            <div className="bg-white rounded-lg shadow-md p-6">
              <ul className="list-disc list-inside space-y-2">
                {patientData.data?.diagnoses.map((diagnosis, index) => (
                  <li key={index} className="text-gray-700">
                    {diagnosis}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}

      {patientData.data?.allergies &&
        patientData.data?.allergies?.length > 0 && (
          <div className="bg-gray-50 rounded-2xl p-6 shadow-sm border border-gray-200 mt-8">
            <h2 className="font-bold text-2xl text-gray-800 mb-6 flex items-center">
              <span className="mr-2">⚠️</span> Allergies
            </h2>
            <div className="bg-white rounded-lg shadow-md p-6">
              <ul className="list-disc list-inside space-y-2">
                {patientData.data.allergies.map((allergy) => (
                  <li key={allergy.id} className="text-gray-700">
                    {allergy.allergy}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}

      <div className="bg-gray-50 rounded-2xl p-6 shadow-sm border border-gray-200 mt-8">
        <h2 className="font-bold text-2xl text-gray-800 mb-6 flex items-center">
          <span className="mr-2">📋</span> Prescriptions Summary
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {prescriptionCards.map((prescription) => (
            <div
              className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow duration-200"
              key={prescription?.id}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="h-14 w-14 bg-blue-100 rounded-full flex items-center justify-center mr-4 text-2xl">
                    {prescription?.icon}
                  </div>
                  <div>
                    <a
                      className="text-lg font-medium text-gray-800 hover:underline transition"
                      href={prescription?.link}
                    >
                      {prescription?.text}
                    </a>
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-blue-600">
                    {prescription?.number}
                  </div>
                  <span
                    className={`text-xs font-semibold px-3 py-1 rounded-full ${prescription?.color}`}
                  >
                    {prescription.status}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {patientData.data?.prescriptions &&
        patientData.data?.prescriptions.length > 0 && (
          <div className="bg-gray-50 rounded-2xl p-6 shadow-sm border border-gray-200 mt-8">
            <h2 className="font-bold text-2xl text-gray-800 mb-6 flex items-center">
              <span className="mr-2">📝</span> Recent Prescriptions
            </h2>
            <div className="overflow-x-auto">
              <table className="min-w-full bg-white rounded-lg shadow-md overflow-hidden">
                <thead className="bg-gray-200 text-gray-700">
                  <tr>
                    <th className="py-3 px-4 text-left">Date</th>
                    <th className="py-3 px-4 text-left">Doctor</th>
                    <th className="py-3 px-4 text-left">Status</th>
                    <th className="py-3 px-4 text-left">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {patientData.data?.prescriptions
                    ?.slice(0, 5)
                    .map((prescription) => (
                      <tr
                        key={prescription.id}
                        className="border-b border-gray-200 hover:bg-gray-50"
                      >
                        <td className="py-3 px-4">
                          {formatDate(prescription.start_date)}
                        </td>
                        <td className="py-3 px-4">
                          Dr. {prescription.doctor.user.first_name}{" "}
                          {prescription.doctor.user.last_name}
                        </td>
                        <td className="py-3 px-4">
                          <span
                            className={`text-xs font-semibold px-2 py-1 rounded-full ${
                              prescription.status === "done" ||
                              prescription.status === "completed"
                                ? "bg-gray-100 text-gray-800"
                                : "bg-green-100 text-green-800"
                            }`}
                          >
                            {prescription.status.charAt(0).toUpperCase() +
                              prescription.status.slice(1)}
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          <Link
                            to={`/prescription/${prescription.id}`}
                            className="text-blue-500 hover:underline mr-3"
                          >
                            View
                          </Link>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
              {patientData.data?.prescriptions?.length > 5 && (
                <div className="text-center mt-4">
                  <a
                    href={`/prescription/patient/${patientData.data?.user?.NID}`}
                    className="text-blue-500 hover:underline"
                  >
                    View all prescriptions (
                    {patientData.data?.prescriptions?.length})
                  </a>
                </div>
              )}
            </div>
          </div>
        )}
    </div>
  );
};

export default PatientEndpoint;
