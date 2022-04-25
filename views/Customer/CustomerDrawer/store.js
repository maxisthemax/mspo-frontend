import create from "zustand";

const store = (set) => ({
  open: false,
  params: {},
  openDrawer: (data) => {
    set(() => ({ open: true, params: data.params }));
  },
  closeDrawer: () => {
    set(() => ({ open: false, params: {} }));
  },
});

const createStore = create(store);

export default createStore;
