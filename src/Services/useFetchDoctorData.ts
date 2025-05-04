import { useQuery } from "@tanstack/react-query";
import instance from "../axios/instance";

const useFetchDoctorData = (user: string, setErr: React.Dispatch<React.SetStateAction<string>>, role) => {
    return useQuery({
        queryKey: ["doctorData", user],
        queryFn: async () => {
            const res = await instance.get(`/auth/doctor/`);
            if (res.status !== 200) {
                setErr("Network response was not ok");
                return null;
            }
            return res.data;
        },
        enabled: role === "doctor",
        refetchOnWindowFocus: false,
    });
};

export default useFetchDoctorData;