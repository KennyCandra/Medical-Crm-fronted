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

export function usePrescriptions() {
  const { user } = userStore();

  const prescriptionsQuery = useQuery<PrescriptionAPIResponse>({
    queryKey: ["prescriptions", { id: user.id, role: user.role }],
    queryFn: async () => {
      if (!user) throw new Error("User data not available");

      const endpoint = `/presc/${user.role}/${user.id}`;

      const { data } = await instance.get(endpoint);
      console.log(data);

      return data;
    },
    enabled: !!user,
  });

  return {
    prescriptionsQuery,
  };
}
