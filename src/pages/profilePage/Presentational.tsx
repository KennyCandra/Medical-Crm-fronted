import ProfilePageCard from "../../components/ProfilePageCard/ProfilePageCard";
import Actions from "../../components/Actions/Actions";
import { QRCodeSVG } from "qrcode.react";
import { Link } from "react-router-dom";
import type { PrescriptionCard, card } from "./Profile";

type props = {
  err: string;
  header: string;
  role: "doctor" | "patient" | "owner";
  qrData: string;
  showQrCode: boolean;
  nid: string;
  cardsInputs: card[];
  actions: {
    id: number;
    action: string;
    img?: string;
    link: string;
    allowedRoles: string[];
  }[];
  prescriptionsQuery: { isLoading: boolean };
  prescriptions: PrescriptionCard[];
  user: string;
};

function Presentational({
  header,
  role,
  qrData,
  showQrCode,
  nid,
  cardsInputs,
  actions,
  prescriptions,
  prescriptionsQuery,
}: props) {
  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">{header}</h1>

        {role === "patient" && showQrCode && (
          <div className="bg-white rounded-2xl p-6 shadow-md border border-gray-200 mb-6">
            <div className="flex flex-col md:flex-row items-center justify-between">
              <div className="mb-4 md:mb-0">
                <h2 className="font-bold text-xl text-gray-800 mb-2">
                  Quick Access
                </h2>
                <p className="text-gray-600 max-w-md">
                  Scan this QR code with your phone to access your health
                  information on the go.
                </p>
                <p className="text-sm text-blue-600 mt-2">Patient ID: {nid}</p>
              </div>
              <div className="flex flex-col items-center">
                <QRCodeSVG
                  value={qrData}
                  size={160}
                  bgColor={"#FFFFFF"}
                  fgColor={"#000000"}
                  level={"H"}
                  includeMargin={true}
                />
              </div>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 bg-gray-50 rounded-2xl p-6 shadow-sm border border-gray-200">
          {cardsInputs.map(
            (input) =>
              input.allowedRoles?.includes(role) && (
                <ProfilePageCard
                  textUrl={input.textUrl}
                  key={input.id}
                  text={input.text}
                  number={input.number}
                  color={input.color ? input.color : ""}
                />
              )
          )}
        </div>
      </div>

      <div className="bg-gray-50 rounded-2xl p-6 shadow-sm border border-gray-200">
        <h2 className="font-bold text-2xl text-gray-800 mb-6 flex items-center">
          <span className="mr-2">🩺</span>{" "}
          {role.charAt(0).toUpperCase() + role.slice(1)} Actions
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {actions.map(
            (action) =>
              action.allowedRoles.includes(role) && (
                <Actions
                  link={action.link}
                  img={action.img ? action.img : ""}
                  action={action.action}
                  key={action.id}
                />
              )
          )}
        </div>
      </div>

      <div className="bg-gray-50 rounded-2xl p-6 shadow-sm border border-gray-200 mt-8">
        <h2 className="font-bold text-2xl text-gray-800 mb-6 flex items-center">
          <span className="mr-2">📋</span> Prescriptions Summary
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {!prescriptionsQuery.isLoading &&
            prescriptions.map((prescription) => (
              <div
                className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow duration-200"
                key={prescription.id}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="h-14 w-14 bg-blue-100 rounded-full flex items-center justify-center mr-4 text-2xl">
                      {prescription.icon}
                    </div>
                    <div>
                      <Link
                        className="text-lg font-medium text-gray-800 hover:underline transition"
                        to={prescription.link}
                      >
                        {prescription.text}
                      </Link>
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-blue-600">
                      {prescription.number}
                    </div>
                    <span
                      className={`text-xs font-semibold px-3 py-1 rounded-full ${prescription.color}`}
                    >
                      {prescription.status}
                    </span>
                  </div>
                </div>
              </div>
            ))}

          {prescriptionsQuery.isLoading && (
            <div className="col-span-2 text-center p-4">
              <p className="text-gray-500">Loading prescription data...</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Presentational;
