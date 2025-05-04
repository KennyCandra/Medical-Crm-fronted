import { useQuery } from "@tanstack/react-query";
import { medication } from "../../pages/createPrescription/CreatePrescription";
import instance from "../../axios/instance";
import { AlertTriangle, Check, X, AlertCircle, Info } from "lucide-react";

interface props {
  medication: medication[];
  patientNid: string;
}

type interaction = {
  description: string;
  drug1: string;
  drug2: string;
  severity: string;
};

interface Allergy {
  drug: string;
  allergen: string;
  severity: string;
}

interface APICall {
  hasAllergies: boolean;
  allergies: Allergy[];
  hasInteractions: boolean;
  interactions: interaction[];
  recommendation: string;
}

function DrugOldDrugInteraction({ medication, patientNid }: props) {
  const drug = medication.map((drug) => {
    return drug.drug.name;
  });

  const { data, isLoading, isError } = useQuery<APICall>({
    queryKey: ["interaction", drug],
    queryFn: async () => {
      return instance
        .get(`/drug/${patientNid}/`, {
          params: {
            newDrugs: drug,
          },
        })
        .then((res) => {
          return res.data;
        });
    },
    enabled: medication.length >= 1 && patientNid !== "",
    staleTime: 0
  });

  if (!patientNid) {
    return (
      <div className="w-full p-4 bg-gray-50 rounded-lg flex items-center justify-center text-gray-500">
        <Info className="mr-2 text-blue-500" size={20} />
        <p>Please select a patient to view drug interactions</p>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="w-full h-[200px] flex items-center justify-center">
        <div className="animate-pulse flex flex-col items-center">
          <div className="h-8 w-64 bg-gray-200 rounded mb-4"></div>
          <div className="h-4 w-32 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="w-full p-4 bg-red-50 rounded-lg border border-red-200 flex items-center justify-center">
        <AlertCircle className="mr-2 text-red-500" size={20} />
        <p className="font-semibold text-red-500">
          Error fetching interaction data
        </p>
      </div>
    );
  }

  const getSeverityDisplay = (severity: string) => {
    switch (severity.toLowerCase()) {
      case "critical":
        return {
          bgColor: "bg-red-50",
          textColor: "text-red-700",
          borderColor: "border-red-200",
          icon: <AlertTriangle className="text-red-500" size={20} />,
        };
      case "serious":
        return {
          bgColor: "bg-orange-50",
          textColor: "text-orange-700",
          borderColor: "border-orange-200",
          icon: <AlertTriangle className="text-orange-500" size={20} />,
        };
      case "moderate":
        return {
          bgColor: "bg-yellow-50",
          textColor: "text-yellow-700",
          borderColor: "border-yellow-200",
          icon: <Info className="text-yellow-500" size={20} />,
        };
      default:
        return {
          bgColor: "bg-blue-50",
          textColor: "text-blue-700",
          borderColor: "border-blue-200",
          icon: <Info className="text-blue-500" size={20} />,
        };
    }
  };
  return (
    <div className="w-full font-sans">
      <div className="flex items-center justify-between mb-2">
        <h1 className="font-semibold text-md text-gray-800">
          Drug Interaction Analysis
        </h1>
        {data?.hasInteractions || data?.hasAllergies ? (
          <div className="px-3 py-1 bg-red-100 text-red-700 rounded-full text-sm font-semibold flex items-center">
            <AlertTriangle size={16} className="mr-1" />
            {data.hasInteractions && data.hasAllergies
              ? "Interactions & Allergies Found"
              : data.hasInteractions
              ? "Interactions Found"
              : "Allergies Found"}
          </div>
        ) : (
          <div className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-semibold flex items-center">
            <Check size={16} className="mr-1" />
            No Concerns Found
          </div>
        )}
      </div>

      <div className="w-full border rounded-xl overflow-hidden shadow-sm">
        {!data?.hasInteractions && !data?.hasAllergies ? (
          <div className="p-6 flex flex-col items-center justify-center bg-green-50 h-[200px]">
            <Check size={40} className="text-green-500 mb-2" />
            <p className="text-green-700 font-medium">
              No drug interactions or allergies detected
            </p>
          </div>
        ) : (
          <div className="max-h-[350px] overflow-y-auto">
            {data?.hasInteractions && (
              <div>
                <div className="px-4 py-3 bg-gray-50 border-b">
                  <h2 className="font-semibold text-gray-700">
                    Drug Interactions
                  </h2>
                </div>
                <div className="divide-y">
                  {data.interactions.map((interaction, index) => {
                    const { bgColor, textColor, borderColor, icon } =
                      getSeverityDisplay(interaction.severity);
                    return (
                      <div
                        key={index}
                        className={`p-4 ${bgColor} border-l-4 ${borderColor}`}
                      >
                        <div className="flex justify-between items-start">
                          <div className="flex items-start space-x-2">
                            <div className="mt-1">{icon}</div>
                            <div>
                              <p className={`font-semibold ${textColor}`}>
                                {interaction.drug1} × {interaction.drug2}
                              </p>
                              <p className="text-gray-700 mt-1">
                                {interaction.description}
                              </p>
                            </div>
                          </div>
                          <span
                            className={`px-2 py-1 rounded text-xs font-bold uppercase ${textColor} ${bgColor}`}
                          >
                            {interaction.severity}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {data?.hasAllergies && (
              <div>
                <div className="px-4 py-3 bg-gray-50 border-b border-t">
                  <h2 className="font-semibold text-gray-700">
                    Allergy Alerts
                  </h2>
                </div>
                <div className="divide-y">
                  {data.allergies.map((allergy, index) => {
                    const { bgColor, textColor, borderColor, icon } =
                      getSeverityDisplay(allergy.severity);
                    console.log(allergy.severity);
                    return (
                      <div
                        key={index}
                        className={`p-4 ${bgColor} border-l-4 ${borderColor}`}
                      >
                        <div className="flex justify-between items-start">
                          <div className="flex items-start space-x-2">
                            <div className="mt-1">{icon}</div>
                            <div>
                              <p className={`font-semibold ${textColor}`}>
                                {allergy.drug} contains {allergy.allergen}
                              </p>
                              <p className="text-gray-700 mt-1">
                                Patient has a known allergy to this ingredient
                              </p>
                            </div>
                          </div>
                          <span
                            className={`px-2 py-1 rounded text-xs font-bold uppercase ${textColor} ${bgColor}`}
                          >
                            {allergy.severity}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        )}

        {data?.recommendation &&
          (data?.hasInteractions || data?.hasAllergies) && (
            <div className="p-4 bg-blue-50 border-t">
              <p className="text-sm font-medium text-gray-700">
                Recommendation:
              </p>
              <p className="text-gray-700">{data.recommendation}</p>
            </div>
          )}
      </div>
    </div>
  );
}

export default DrugOldDrugInteraction;
