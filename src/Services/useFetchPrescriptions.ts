import { useQuery } from "@tanstack/react-query"
import instance from "../axios/instance"

const useFetchPrescriptions = (nid, url) => {
    return useQuery({
        queryKey: ['prescriptions', nid],
        queryFn: () => instance(url),
        staleTime: 1000 * 60 * 5,
    })
}

export default useFetchPrescriptions