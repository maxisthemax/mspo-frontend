import create from "zustand";
import { devtools } from "zustand/middleware";

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

const createStore = create(devtools(store));

export default createStore;
