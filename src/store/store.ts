
import Vuex from "vuex"
import {ref} from "vue"
import { DataItem, FormState, EuroFinal} from '../util/interface'
import dayjs from 'dayjs'

export const store = new Vuex.Store({
  state: {
    dataArray: new Array<DataItem>(),
    dataFinal:ref<EuroFinal>(),
    data_empresa:ref<FormState>(),
    data_cliente:ref<FormState>(),
    euroBase: 0,
    dto:0,
    isRe: false,
    isIva: false,
    forma:ref('EFECTIVO'),
    date: ref(dayjs().format('DD/MM/YYYY')),
    num: "",
  },

  mutations: {
    saveData: (state, objStorage) => {
      console.log("[store]savaArray:",objStorage)
      state.dataArray = objStorage.dataArray;
      state.euroBase = objStorage.euroBase;
      state.dto = objStorage.dto;
      state.isIva = objStorage.isIva;
      state.isRe = objStorage.isRe;
    },
    saveFinal: (state, objStorage) => {
      state.dataFinal = objStorage
      console.log("[store]savaFinal:",objStorage)
    },
    saveCliente: (state, objStorage) => {
      state.data_cliente = objStorage 
    },

    saveEmpresa: (state, objStorage) =>{
      state.data_empresa= objStorage
    },

    saveNum: (state, objStorage) =>{
      state.num = objStorage.num
      state.date = objStorage.date
      state.forma = objStorage.forma
    },


  },

  
});
