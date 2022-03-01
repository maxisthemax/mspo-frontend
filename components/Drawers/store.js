import create from "zustand";

const store = (set) => ({
  open: false,
  drawerId: "",
  params: {},
  openDrawer: (data) => {
    set(() => ({ open: true, drawerId: data.drawerId, params: data.params }));
  },
  closeDrawer: () => {
    set(() => ({ open: false }));
  },
});

const createStore = create(store);

export default createStore;
