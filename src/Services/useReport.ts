import { useQuery } from "@tanstack/react-query";
import instance from "../axios/instance";

type Res = {
    message: string;
    finalResults: {
        doctorName: string
        patientName: string
        id: string
        reviewed: boolean
    }[]
}

export const useReports = () => {
    return useQuery<Res>({
        queryKey: ["reports"],
        queryFn: async () => {
            const res = await instance.get('/reports/all');
            return res.data;
        },
    });

};