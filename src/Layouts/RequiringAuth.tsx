import { Outlet, Navigate, useNavigate, useLocation } from "react-router-dom";
import { useJwt } from "react-jwt";
import { userStore } from "../zustand/userStore";
import axios from "axios";
import { useQuery } from "@tanstack/react-query";
import { BASEURL } from "../axios/instance";

function RequiringAuth() {
  const { accessToken, setUser, setAccessToken, user } = userStore();
  const { isExpired } = useJwt(accessToken || "");

  const shouldRefresh = !accessToken || isExpired;

  const refreshToken = async () => {
    const response = await axios.get(`${BASEURL}/auth/refreshToken`, {
      withCredentials: true,
    });
    const data = response.data;
    setUser(data.user);
    setAccessToken(data.accessToken);
    return data;
  };

  const { isLoading, isError } = useQuery({
    queryKey: ["authentication"],
    enabled: shouldRefresh,
    retry: false,
    queryFn: async () => {
      return await refreshToken();
    },
  });

  if (isLoading) return <div>Authenticating...</div>;
  if (isError) return <Navigate to="/auth/login" />;

  return user ? <Outlet /> : <Navigate to="/auth/login" />;
}

export default RequiringAuth;
