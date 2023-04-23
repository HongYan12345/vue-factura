<template>
  <div>
    <div>
      <a-button @click="goBack">back</a-button>
    </div>
    <a-space direction="vertical" :size="12">
    <a-date-picker v-model:value="value1" />
    </a-space>
    <div id="exportPdf" ref="exportpdf">
      <h1>h1</h1>
      <div class="text-right">right</div>
      <div style="font-size:50px;">50px</div>

      <a-row style="font-size: 10px;">
        <a-col :span="1"></a-col>
        <a-col :span="10">{{data_empresa.name}}</a-col>
        <a-col :span="2">|</a-col>
        <a-col class="text-right" :span="10">{{data_cliente.name}}</a-col>
        <a-col :span="1"></a-col>

        <a-col :span="1"></a-col>
        <a-col :span="10">{{data_empresa.direccion}}</a-col>
        <a-col :span="2">|</a-col>
        <a-col class="text-right" :span="10">{{data_cliente.direccion}}</a-col>
        <a-col :span="1"></a-col>

        <a-col :span="1"></a-col>
        <a-col :span="10">{{data_empresa.poblation}}</a-col>
        <a-col :span="2">|</a-col>
        <a-col class="text-right" :span="10">{{data_cliente.poblation}}</a-col>
        <a-col :span="1"></a-col>

        <a-col :span="1"></a-col>
        <a-col :span="10">CP:{{data_empresa.cp}}</a-col>
        <a-col :span="2">|</a-col>
        <a-col class="text-right" :span="10">CP:{{data_cliente.cp}}</a-col>
        <a-col :span="1"></a-col>

        <a-col :span="1"></a-col>
        <a-col :span="10">NIF:{{data_empresa.nif}}</a-col>
        <a-col :span="2">|</a-col>
        <a-col class="text-right" :span="10">NIF:{{data_cliente.nif}}</a-col>
        <a-col :span="1"></a-col>

        <a-col :span="1"></a-col>
        <a-col :span="10">TEL:{{data_empresa.telefono}}</a-col>
        <a-col :span="2">|</a-col>
        <a-col class="text-right" :span="10">TEL:{{data_cliente.telefono}}</a-col>
        <a-col :span="1"></a-col>
      </a-row>
      
      <div class="table1"><a-table class="table-wrapper" :dataSource="dataSource" :columns="columns" :pagination="false" :locale="{ emptyText: ' ' }" /></div>
      <div class="table2"><a-table class="table-wrapper" :dataSource="dataSource_final" :columns="columns_final" :pagination="false" /></div>
    </div>
    <div>
      <a-button @click="exportPdf">export</a-button>
    </div>

  </div>
</template>


<script lang="ts">
import { ref, reactive, toRefs, onMounted, onUpdated } from "vue"
import { useRouter } from "vue-router"
import { export_pdf} from "../util/exportPdf"
import { useStore } from 'vuex'
import { DataItem, EuroFinal, FormState} from '../util/interface'
import type { Dayjs } from 'dayjs';

export default {
  components: {},
  setup() {
    const data = reactive({
      data_empresa:ref<FormState>({
      name: "",
      direccion: "",
      nif: "",
      forma: "",
      poblation: "",
      cp: "",
      telefono: "",
    }),
      data_cliente:ref<FormState>({
      name: "",
      direccion: "",
      nif: "",
      forma: "",
      poblation: "",
      cp: "",
      telefono: "",
    }),
      dataSource: new Array<DataItem>(),
      dataSource_final: [{
        total: "",
        dto: "",
        base: "",
        iva: "",
        re: "",
        total_final: "",
    }],
        columns: [
          {
            title: 'cantidad',
            dataIndex: 'cantidad',
            key: 'cantidad',
          },
          {
            title: 'precio',
            dataIndex: 'precio',
            key: 'precio',
          },
          {
            title: 'codigo',
            dataIndex: 'codigo',
            key: 'codigo',
          },
          {
            title: 'articulo',
            dataIndex: 'articulo',
            key: 'articulo',
          },
          {
            title: 'euros',
            dataIndex: 'euros',
            key: 'euros',
          },
        ],

        columns_final: [
          {
            title: 'TOTAL BRUTO',
            dataIndex: 'total',
            key: 'total',
          },
          {
            title: '%DTO',
            dataIndex: 'dto',
            key: 'dto',
          },
          {
            title: 'BASE',
            dataIndex: 'base',
            key: 'base',
          },
          {
            title: '21%IVA',
            dataIndex: 'iva',
            key: 'iva',
          },
          {
            title: '%R.E',
            dataIndex: 're',
            key: 're',
          },
          {
            title: 'TOTAL EUROS',
            dataIndex: 'total_final',
            key: 'total_final',
          },
        ],
        value1: ref<Dayjs>(),
    });
    const refData = toRefs(data);
    const router = useRouter();
    const store = useStore()
    const goBack = () => {
      router.back();
    }

    const exportPdf = () => {
      export_pdf()
    }

    onMounted(() => {
      data.dataSource = store.state.dataArray
      data.data_cliente = store.state.data_cliente
      data.data_empresa = store.state.data_empresa
      data.dataSource_final[0] = store.state.dataFinal
      console.log(store.state.dataFinal)
      console.log("data_cliente:",data.data_cliente)
    })

    return {
      ...refData,
      goBack,
      exportPdf,
    };
  },
};
</script>
<style scoped>

</style>
