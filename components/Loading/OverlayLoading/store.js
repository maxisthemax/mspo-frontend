import create from "zustand";

const store = (set) => ({
  open: false,
  openOverlayLoading: () => {
    set(() => ({ open: true }));
  },
  closeOverlayLoading: () => {
    set(() => ({ open: false }));
  },
});

const createStore = create(store);

export default createStore;
