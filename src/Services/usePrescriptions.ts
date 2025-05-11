import { useQuery } from "@tanstack/react-query";
import instance from "../axios/instance";
import { userStore } from "../zustand/userStore";

type Prescription = {
    id: string;
    start_date: string;
    status: "taking" | "done";
    doctor: {
        user: {
            first_name: string;
            last_name: string;
        };
    };
    patient: {
        user: {
            first_name: string;
            last_name: string;
            role: string;
        };
    };
};

type PrescriptionAPIResponse = {
    prescriptions: Prescription[];
    message: string;
    notCompleted: number;
    completed: number;
};

type UserAPIResponse = {
    profileId: string;
    role: "doctor" | "patient";
};

export const useUserId = () => {
    const { user } = userStore.getState()
    const userIdQuery = useQuery<UserAPIResponse>({
        queryKey: ["userId", user],
        queryFn: async () => {
            const { data } = await instance.get("/auth/userId");
            return data
        },
    });

    return {
        userIdQuery,
    }
}


export function usePrescriptions() {
    const { userIdQuery } = useUserId()
    const prescriptionsQuery = useQuery<PrescriptionAPIResponse>({
        queryKey: ["prescriptions", userIdQuery.data?.profileId, userIdQuery.data?.role],
        queryFn: async () => {
            if (!userIdQuery.data) throw new Error("User data not available");

            const { role, profileId } = userIdQuery.data;
            const endpoint = role === "doctor"
                ? `/presc/doctor/${profileId}`
                : `/presc/patient/${profileId}`;

            const { data } = await instance.get(endpoint);
            return data;
        },
        enabled: !!userIdQuery.data && !userIdQuery.isLoading,
    });

    return {
        userIdQuery,
        prescriptionsQuery,
    };
}