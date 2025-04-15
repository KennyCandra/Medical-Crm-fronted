import { create } from 'zustand'

type state = {
    user: string | null;
    accessToken: string | null
    role: 'patient' | 'doctor' | 'owner' | null
}


type actions = {
    setUser: (user: state['user']) => void;
    setAccessToken: (accessToken: state['accessToken']) => void;
    setRole: (role: state['role']) => void;
}

export const userStore = create<state & actions>((set) => ({
    user: null,
    accessToken: null,
    role: null,
    setUser: (user) => set({ user }),
    setAccessToken: (accessToken) => set({ accessToken }),
    setRole: (role) => set({ role })
}))