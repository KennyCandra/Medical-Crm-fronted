import { create } from 'zustand'

type state = {
    user: string | null;
    accessToken: string | null
    role: 'patient' | 'doctor' | 'owner' | null
    isAuthenticated: boolean
    medLiscence: string
}


type actions = {
    setUser: (user: state['user']) => void;
    setAccessToken: (accessToken: state['accessToken']) => void;
    setRole: (role: state['role']) => void;
    setIsAuthenticated: (isAuthenticated: state['isAuthenticated']) => void;
    setMedLiscence: (medLiscence: state['medLiscence']) => void
}

export const userStore = create<state & actions>((set) => ({
    user: null,
    accessToken: null,
    role: null,
    isAuthenticated: false,
    medLiscence: '',
    setUser: (user) => set({ user }),
    setAccessToken: (accessToken) => set({ accessToken }),
    setRole: (role) => set({ role }),
    setIsAuthenticated: (isAuthenticated) => set({ isAuthenticated }),
    setMedLiscence: (medLiscence) => set({ medLiscence })
}))