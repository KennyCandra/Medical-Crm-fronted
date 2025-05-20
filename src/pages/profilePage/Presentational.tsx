import ProfilePageCard from "../../components/ProfilePageCard/ProfilePageCard";
import Actions from "../../components/Actions/Actions";
import { QRCodeSVG } from "qrcode.react";
import { Link, useLocation } from "react-router-dom";
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
  const { pathname } = useLocation();

  const Headline =
    pathname.split("/")[1].charAt(0).toUpperCase() +
    pathname.split("/")[1].slice(1);

  return (
    <div className="p-8 flex flex-col gap-8 bg-gray-50 h-full">
      {role === "patient" && showQrCode && (
        <div className="bg-white p-6 border">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="mb-4 md:mb-0">
              <h2 className="font-bold text-xl text-gray-800">Quick Access</h2>
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
              />
            </div>
          </div>
        </div>
      )}
      <h1 className="text-3xl font-semibold text-gray-700">{Headline}</h1>
      <div className="grid grid-cols-3 gap-6">
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
            ),
        )}
      </div>

      <div className="flex flex-col gap-6">
        <h2 className="font-semibold text-2xl text-gray-700 flex items-center gap-2">
          <span>🩺</span>
          {role.charAt(0).toUpperCase() + role.slice(1)} Actions
        </h2>
        <div className="grid grid-cols-3 gap-6">
          {actions.map(
            (action) =>
              action.allowedRoles.includes(role) && (
                <Actions
                  link={action.link}
                  img={action.img ? action.img : ""}
                  action={action.action}
                  key={action.id}
                />
              ),
          )}
        </div>
      </div>

      <div className="flex flex-col gap-6">
        <h2 className="font-semibold text-2xl text-gray-700 flex items-center gap-2">
          <span>📋</span> Prescriptions Summary
        </h2>
        <div className="grid grid-cols-3 gap-6">
          {!prescriptionsQuery.isLoading &&
            prescriptions.map((prescription) => (
              <div
                className="bg-white p-6 cursor-pointer border border-gray-200 rounded-lg hover:bg-gray-100 transition-all group flex items-center justify-between gap-4"
                key={prescription.id}
              >
                <div className="flex items-center gap-4">
                  <div className="h-14 w-14 bg-blue-100 rounded-full flex items-center justify-center text-2xl">
                    {prescription.icon}
                  </div>
                  <div>
                    <Link
                      className="text-lg font-medium text-gray-700"
                      to={prescription.link}
                    >
                      {prescription.text}
                    </Link>
                  </div>
                </div>
                <div className="flex flex-col items-center">
                  <div className="text-3xl font-bold text-gray-700">
                    {prescription.number}
                  </div>
                  <span
                    className={`text-xs font-semibold px-3 py-1 rounded-full ${prescription.color}`}
                  >
                    {prescription.status}
                  </span>
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
