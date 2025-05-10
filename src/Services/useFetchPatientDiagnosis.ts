import { useQuery } from "@tanstack/react-query"
import axios from "axios"
type Disease = {
    id: string;
    name: string;
};

type Diagnosis = {
    id: string;
    severity: "mild" | "moderate" | "acute" | "severe"; // you can expand or adjust this union as needed
    notes: string | null;
    diagnosed_at: string; // or Date if you parse it
    disease: Disease;
};

type APIRes = {
    message: string;
    diagnosis: Diagnosis[]
}

const useFetchPatientDiagnosis = (nid: string) => {
    return useQuery<APIRes>({
        queryKey: ['patientDiagnosis', nid],
        queryFn: () => axios(`https://medical-crm-backend-production.up.railway.app/diagnosis/${nid}`).then(res => res.data),
        staleTime: 1000 * 60 * 5,
    })
}

export default useFetchPatientDiagnosis