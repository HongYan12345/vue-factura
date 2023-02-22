
import Vuex from "vuex";

interface DataItem {
  key: string;
  cantidad: string;
  precio: string;
  codigo:string;
  articulo: string;
  euros: string;
}

export const store = new Vuex.Store({
  state: {
    dataArray: new Array<DataItem>(),
    euroBase: 0,
    dto:0,
    isRe: false,
    isIva: false,
  },

  mutations: {
    saveData: (state, objStorage) => {
      state.dataArray = objStorage.dataArray;
      state.euroBase = objStorage.euroBase;
      state.dto = objStorage.dto;
      state.isIva = objStorage.isIva;
      state.isRe = objStorage.isRe;
    },

  },

  actions: {
    saveData({ commit }, payload) {
      console.log("[Store:] saveData", payload);
      commit("saveData", payload);
    },
  }
});
