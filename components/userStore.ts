// userStore.ts
import { create, SetState } from 'zustand';
import { Team } from '../view/Types';
import { Proyecto } from '../view/Types';

interface UserStoreState {
  token: string | null;
  setToken: (newToken: string) => void;
  clearToken: () => void;
  clearTeam: () => void;
  clearProject: () => void;
  selectedProject: Proyecto | null;
  setSelectedProject: (project: Proyecto | null) => void;
  selectedTeam: Team | null;
  setSelectedTeam: (team: Team | null) => void;
  apiUrl: string; // Nueva variable de tipo URL
}

const useUserStore = create<UserStoreState>((set: SetState<UserStoreState>) => ({
  token: null,
  setToken: (newToken: string) => set({ token: newToken }),
  clearToken: () => set({ token: '' }),
  clearTeam: () => set({ selectedTeam: null }),
  clearProject: () => set({ selectedProject: null }),
  selectedProject: null,
  setSelectedProject: (project: Proyecto | null) => set({ selectedProject: project }),
  selectedTeam: null,
  setSelectedTeam: (team: Team | null) => set({ selectedTeam: team }),
  apiUrl: `http://10.127.107.21`,
}));

export default useUserStore;
