import { create } from 'zustand';

/* state 관리를 위한 코드로, 전역으로 사용함
언제든 여기 있는 값을 추출하여 사용하면 됨 */
export const useStore = create((set) => ({
  username: null,
  roomId: null,
  setUsername: (username) => set(() => ({ username })),
  setRoomId: (roomId) => set(() => ({ roomId: roomId })),
}));
