import { useQuery } from "@tanstack/react-query";
import { medication } from "../../pages/createPrescription/CreatePrescription";
import axios from "axios";
import { AlertTriangle, Check, AlertCircle, PlusCircle } from "lucide-react";

interface props {
  medication: medication[];
  patientNid: string;
}

interface APICall {
  text: string[];
}

function DrugDrugInteraction({ medication, patientNid }: props) {
  const drug = medication.map((drug) => drug.drug.name).join(" with ");

  const { data, isLoading, isError } = useQuery<APICall>({
    queryKey: ["interaction", drug, patientNid],
    queryFn: async () => {
      return axios
        .get(`https://medical-crm-backend-production.up.railway.app/drug/interaction?drug=${drug}`)
        .then((res) => {
          return res.data;
        });
    },
    enabled: medication.length > 1,
  });

  if (isLoading) {
    return (
      <div className="w-full h-[200px] rounded-2xl font-sans">
        <h1 className="font-primary font-semibold text-2xl mb-2">
          Drug Drug Interaction in Your Prescription
        </h1>
        <div className="w-full h-[90%] border rounded-2xl font-sans flex items-center justify-center bg-gray-50">
          <div className="animate-pulse flex flex-col items-center">
            <div className="h-4 w-32 bg-gray-200 rounded mb-2"></div>
            <div className="h-4 w-48 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="w-full h-[200px] rounded-2xl font-sans">
        <h1 className="font-primary font-semibold text-2xl mb-2">
          Drug Drug Interaction in Your Prescription
        </h1>
        <div className="w-full h-[90%] border rounded-2xl font-sans bg-red-50 flex items-center justify-center">
          <div className="text-center">
            <AlertCircle className="text-red-500 mx-auto mb-2" size={32} />
            <p className="font-semibold text-red-500">
              Error fetching interaction data
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full font-sans">
      <div className="flex items-center justify-between mb-2">
        <h1 className="font-primary font-semibold text-md text-gray-800">
          Drug Drug Interaction in Your Prescription
        </h1>

        {medication.length > 1 && data?.text[0] === "No" ? (
          <div className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-semibold flex items-center">
            <Check size={16} className="mr-1" />
            Safe Combination
          </div>
        ) : medication.length > 1 ? (
          <div className="px-3 py-1 bg-red-100 text-red-700 rounded-full text-sm font-semibold flex items-center">
            <AlertTriangle size={16} className="mr-1" />
            Interaction Detected
          </div>
        ) : null}
      </div>

      {medication.length < 2 ? (
        <div className="w-full border rounded-xl shadow-sm bg-blue-50 p-6 flex flex-col items-center justify-center h-[150px]">
          <PlusCircle className="text-blue-500 mb-3" size={32} />
          <p className="text-blue-700 font-medium text-center">
            Add at least one more medication to check for drug interactions
          </p>
        </div>
      ) : (
        <div className="w-full border rounded-xl shadow-sm overflow-hidden">
          {data?.text[0] === "No" ? (
            <div className="relative p-6 bg-green-50">
              <div className="flex items-center mb-4">
                <Check className="text-green-500 mr-2" size={24} />
                <span className="font-semibold text-green-700">
                  No Interaction Found
                </span>
              </div>
              <div className="absolute bottom-0 left-0 w-full h-2 bg-green-400"></div>
            </div>
          ) : (
            <div>
              <div className="relative p-4 bg-red-50 border-b border-red-100">
                <div className="flex items-center mb-1">
                  <AlertTriangle className="text-red-500 mr-2" size={24} />
                  <span className="font-semibold text-red-700">
                    {data?.text[2]}
                  </span>
                </div>
                <div className="absolute bottom-0 left-0 w-full h-2 bg-red-500"></div>
              </div>
              <div className="p-4 bg-white">
                <p className="text-gray-700">{data?.text[1]}</p>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default DrugDrugInteraction;
