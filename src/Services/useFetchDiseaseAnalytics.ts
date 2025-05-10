import { useQuery } from "@tanstack/react-query"
import instance from "../axios/instance"

type item = {
    count: number;
    cumulativeCount: number;
    diseaseName: string;
    month: number;
    monthName: string;
};

const useFetchDiseaseAnalytics = (diseaseId: string, role: 'patient' | 'doctor' | 'owner') => {
    return useQuery<item[]>({
        queryKey: ['analytics', diseaseId],
        queryFn: () => (
            instance.get(`/analytics/diseases/${diseaseId}`).then(res => res.data)
        ),
        enabled: role === "owner"
    })
}

export default useFetchDiseaseAnalytics