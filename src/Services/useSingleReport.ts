import { useQuery } from "@tanstack/react-query";
import instance from "../axios/instance";

export const useReport = (reportId: string) => {
    return useQuery({
        queryKey: ["reports", reportId],
        queryFn: async () => {
            const res = await instance.get(`/reports/${reportId}`);
            return res.data;
        },
    });

};