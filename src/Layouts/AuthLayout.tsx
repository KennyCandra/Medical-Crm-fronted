import { Outlet, useNavigate } from "react-router-dom";
import { userStore } from "../zustand/userStore";
import { useJwt } from "react-jwt";
import { BASEURL } from "../axios/instance";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useEffect } from "react";

function AuthLayout() {
  const features = [
    "Simplified patient management",
    "Streamlined appointment scheduling",
    "Secure medical records",
    "Integrated billing system",
  ];

  return (
    <div className="flex min-h-screen">
      <div className="bg-purple-700 flex justify-center items-center w-[40%] text-white">
        <div className="w-[80%] flex flex-col gap-10">
          <div className="flex gap-4 items-center">
            <img src="/images/logo.png" className="size-8" />
            <h1 className="text-2xl font-bold">Sanova</h1>
          </div>
          <div className="flex flex-col gap-8">
            <div className="flex flex-col gap-4">
              <p className="text-4xl font-bold">
                Healthcare reimagined with the first medical assistant
              </p>
              <div className="text-2xl">
                Providing accessible healthcare solutions that empower both
                patients and doctors.
              </div>
            </div>
            <div className="flex flex-col gap-2">
              {features.map((feature, index) => (
                <div key={index} className="flex text-lg gap-4 items-center">
                  <div className="h-6 w-6 rounded-full bg-white/20 flex items-center justify-center">
                    <svg
                      className="h-4 w-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  </div>
                  <p>{feature}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="text-white">© 2025 Sanova. All rights reserved.</div>
        </div>
      </div>
      <div className="flex justify-center items-center w-[60%] h-screen overflow-y-auto">
        <Outlet />
      </div>
    </div>
  );
}

export default AuthLayout;
