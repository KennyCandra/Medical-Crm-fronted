import { useQuery } from '@tanstack/react-query';
import instance from '../axios/instance';

export type Patient = {
    id: string;
    user: {
        id: string;
        first_name: string;
        last_name: string;
        gender: string;
        NID: string;
        role: string;
        birth_date: string;
    };
    allergies: Array<{
        id: string;
        allergy: string;
    }>;
    diagnoses: string[];
    prescriptions: Array<{
        id: string;
        start_date: string;
        status: string;
        doctor: {
            id: string;
            medical_license_number: string;
            user: {
                id: string;
                first_name: string;
                last_name: string;
                gender: string;
                NID: string;
                role: string;
                birth_date: string;
            };
        };
        patient: {
            id: string;
            blood_type: string;
            user: {
                id: string;
                first_name: string;
                last_name: string;
                gender: string;
                NID: string;
                role: string;
                birth_date: string;
            };
        };
    }>;
    patient: {
        id: string;
        blood_type: string;
        user: {
            id: string;
            first_name: string;
            last_name: string;
            gender: string;
            NID: string;
            role: string;
            birth_date: string;
        };
    };
};

const useFetchPatientAllData = (nid: string | undefined, key: string) => {
    return useQuery<Patient>({
        queryKey: [key],
        queryFn: () => instance.get(`http://localhost:8001/auth/patient/${nid}`).then(res => res.data),
        enabled: !!nid,
        refetchOnWindowFocus: false,
        staleTime: 5 * 60 * 1000,
    })
};

export default useFetchPatientAllData;