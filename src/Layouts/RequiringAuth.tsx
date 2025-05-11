import { Outlet, Navigate } from "react-router-dom";
import { useJwt } from "react-jwt";
import { userStore } from "../zustand/userStore";
import axios from "axios";
import { useQuery } from "@tanstack/react-query";
import { BASEURL } from "../axios/instance";

function RequiringAuth() {
  const {
    isAuthenticated,
    accessToken,
    setUser,
    setRole,
    setAccessToken,
    setIsAuthenticated,
    setNid,
  } = userStore();

  const { isExpired } = useJwt(accessToken!);
  const refreshToken = async () => {
    const response = await axios.get(
      `${BASEURL}/auth/refreshToken`,
      {
        withCredentials: true,
      }
    );
    const data = response.data;

    setIsAuthenticated(true);
    setUser(`${data.user.first_name} ${data.user.last_name}`);
    setRole(data.user.role);
    setAccessToken(data.accessToken);
    setNid(data.user.NID);

    return data;
  };

  const { isLoading } = useQuery({
    queryKey: ["authentication"],
    enabled: !isAuthenticated || isExpired,
    retry: false,
    queryFn: async () => {
      try {
        return await refreshToken();
      } catch (error) {
        window.location.href = "/login";
        throw error;
      }
    },
  });

  if (isLoading) return <div>Loading from authentication...</div>;

  return isAuthenticated ? <Outlet /> : <Navigate to="/login" />;
}

export default RequiringAuth;
