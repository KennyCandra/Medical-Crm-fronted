


import { useQuery } from "@tanstack/react-query"
import axios from "axios";
import { BASEURL } from "../axios/instance";

export type User = {
    fullname: string;
    id: string;
    nid: string;
};

type userAPI = {
    users: User[];
};

const useFetchPatientData = (searchValue: string) => {
    return useQuery<userAPI>({
        queryKey: ["patientData", searchValue],
        queryFn: () =>
            axios.get(`${BASEURL}/auth/${searchValue}`).then((res) => {
                return res.data;
            }),
        enabled: searchValue.length >= 1,
        staleTime: 60000,
        retry: 1,
    });
}

export default useFetchPatientData