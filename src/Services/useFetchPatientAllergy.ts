import { useQuery } from "@tanstack/react-query"
import axios from "axios"
import { BASEURL } from "../axios/instance";

type allergies = {
    allergy: string;
    id: string
}
type allergyAPI = {
    allergies: allergies[];
}

const useFetchPatientAllergy = (nid: string, role: 'patient' | 'doctor' | 'owner') => {
    return useQuery<allergyAPI>({
        queryKey: ['patientAllergy', nid],
        queryFn: () => axios(`${BASEURL}/allergy/${nid}`).then(res => res.data),
        staleTime: 1000 * 60 * 5,
        enabled: role === "patient",
    })

}

export default useFetchPatientAllergy