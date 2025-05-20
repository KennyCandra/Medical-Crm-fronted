import { create } from "zustand";

type state = {
  user: {
    NID: string;
    first_name: string;
    last_name: string;
    gender: string;
    id: string;
    role: "doctor" | "admin" | "patient";
    birth_date: string;
  };
  accessToken: string | null;
};

type actions = {
  setUser: (user: state["user"]) => void;
  setAccessToken: (accessToken: state["accessToken"]) => void;
};

export const userStore = create<state & actions>((set) => ({
  user: null,
  accessToken: null,
  setUser: (user) => set({ user }),
  setAccessToken: (accessToken) => set({ accessToken }),
}));
