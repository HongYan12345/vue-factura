<template>
  <div>
    <div>
      <a-button @click="goBack">back</a-button>
    </div>
    <a-space direction="vertical" :size="12">
      <a-date-picker v-model:value="date" value-format="DD/MM/YYYY"/>
      <a-input-number v-model:value="num" :min="1"></a-input-number>
    </a-space>
    <div id="exportPdf" ref="exportpdf">
      <div>Nº: {{num}}</div>
      <div>{{date}}</div>
      <div style="display: flex">
        <div style="flex: 1">{{ data_empresa.name }}</div>
        <div style="flex: 1; text-align: right">{{ data_cliente.name }}</div>
      </div>
      <div style="display: flex">
        <div style="flex: 1">{{ data_empresa.direccion }}</div>
        <div style="flex: 1; text-align: right">
          {{ data_cliente.direccion }}
        </div>
      </div>
      <div style="display: flex">
        <div style="flex: 1">{{ data_empresa.poblation }}</div>
        <div style="flex: 1; text-align: right">
          {{ data_cliente.poblation }}
        </div>
      </div>
      <div style="display: flex">
        <div style="flex: 1">CP:{{ data_empresa.cp }}</div>
        <div style="flex: 1; text-align: right">CP:{{ data_cliente.cp }}</div>
      </div>
      <div style="display: flex">
        <div style="flex: 1">NIF:{{ data_empresa.nif }}</div>
        <div style="flex: 1; text-align: right">NIF:{{ data_cliente.nif }}</div>
      </div>
      <div style="display: flex">
        <div style="flex: 1">TEL:{{ data_empresa.telefono }}</div>
        <div style="flex: 1; text-align: right">
          TEL:{{ data_cliente.telefono }}
        </div>
      </div>

      <table
        class="table1"
        style="width: 100%; border-collapse: collapse; margin-top: 20px"
      >
        <thead>
          <tr>
            <th style="border: 1px solid #000; padding: 5px">cantidad</th>
            <th style="border: 1px solid #000; padding: 5px">precio</th>
            <th style="border: 1px solid #000; padding: 5px">codigo</th>
            <th style="border: 1px solid #000; padding: 5px">articulo</th>
            <th style="border: 1px solid #000; padding: 5px">euros</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in dataSource" :key="item.key">
            <td style="border: 1px solid #000; padding: 5px">
              {{ item.cantidad }}
            </td>
            <td style="border: 1px solid #000; padding: 5px">
              {{ item.precio }}
            </td>
            <td style="border: 1px solid #000; padding: 5px">
              {{ item.codigo }}
            </td>
            <td style="border: 1px solid #000; padding: 5px">
              {{ item.articulo }}
            </td>
            <td style="border: 1px solid #000; padding: 5px">
              {{ item.euros }}
            </td>
          </tr>
        </tbody>
      </table>
      <table
        class="table2"
        style="width: 100%; border-collapse: collapse; margin-top: 20px"
      >
        <thead>
          <tr>
            <th style="border: 1px solid #000; padding: 5px">TOTAL BRUTO</th>
            <th style="border: 1px solid #000; padding: 5px">%DTO</th>
            <th style="border: 1px solid #000; padding: 5px">BASE</th>
            <th style="border: 1px solid #000; padding: 5px">21%IVA</th>
            <th style="border: 1px solid #000; padding: 5px">%R.E</th>
            <th style="border: 1px solid #000; padding: 5px">TOTAL EUROS</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in dataSource_final" :key="item.total">
            <td style="border: 1px solid #000; padding: 5px">
              {{ item.total }}
            </td>
            <td style="border: 1px solid #000; padding: 5px">{{ item.dto }}</td>
            <td style="border: 1px solid #000; padding: 5px">
              {{ item.base }}
            </td>
            <td style="border: 1px solid #000; padding: 5px">{{ item.iva }}</td>
            <td style="border: 1px solid #000; padding: 5px">{{ item.re }}</td>
            <td style="border: 1px solid #000; padding: 5px">
              {{ item.total_final }}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <div>
      <a-button @click="exportPdf">export</a-button>
    </div>
  </div>
</template>


<script lang="ts">
import { ref, reactive, toRefs, onMounted, onUpdated } from "vue";
import { useRouter } from "vue-router";
import { export_pdf } from "../util/exportPdf";
import { useStore } from "vuex";
import { DataItem, EuroFinal, FormState } from "../util/interface";
import type { Dayjs } from "dayjs";
import dayjs from 'dayjs';

export default {
  components: {},
  setup() {
    const data = reactive({
      data_empresa: ref<FormState>({
        name: "",
        direccion: "",
        nif: "",
        forma: "",
        poblation: "",
        cp: "",
        telefono: "",
      }),
      data_cliente: ref<FormState>({
        name: "",
        direccion: "",
        nif: "",
        forma: "",
        poblation: "",
        cp: "",
        telefono: "",
      }),
      dataSource: new Array<DataItem>(),
      dataSource_final: [
        {
          total: "",
          dto: "",
          base: "",
          iva: "",
          re: "",
          total_final: "",
        },
      ],
      columns: [
        {
          title: "cantidad",
          dataIndex: "cantidad",
          key: "cantidad",
        },
        {
          title: "precio",
          dataIndex: "precio",
          key: "precio",
        },
        {
          title: "codigo",
          dataIndex: "codigo",
          key: "codigo",
        },
        {
          title: "articulo",
          dataIndex: "articulo",
          key: "articulo",
        },
        {
          title: "euros",
          dataIndex: "euros",
          key: "euros",
        },
      ],

      columns_final: [
        {
          title: "TOTAL BRUTO",
          dataIndex: "total",
          key: "total",
        },
        {
          title: "%DTO",
          dataIndex: "dto",
          key: "dto",
        },
        {
          title: "BASE",
          dataIndex: "base",
          key: "base",
        },
        {
          title: "21%IVA",
          dataIndex: "iva",
          key: "iva",
        },
        {
          title: "%R.E",
          dataIndex: "re",
          key: "re",
        },
        {
          title: "TOTAL EUROS",
          dataIndex: "total_final",
          key: "total_final",
        },
      ],
      date: ref<Dayjs>(),
      num: "",
    });
    const refData = toRefs(data);
    const router = useRouter();
    const store = useStore();
    const goBack = () => {
      router.back();
    };

    const exportPdf = () => {
      export_pdf();
    };

    const today = () => {
      return dayjs().format('YYYY-MM-DD HH:mm:ss');
    };

    onMounted(() => {
      data.dataSource = store.state.dataArray;
      data.data_cliente = store.state.data_cliente;
      data.data_empresa = store.state.data_empresa;
      data.dataSource_final[0] = store.state.dataFinal;
      console.log(store.state.dataFinal);
      console.log("data_cliente:", data.data_cliente);
    });

    return {
      ...refData,
      goBack,
      exportPdf,
      today,
    };
  },
};
</script>
<style scoped>
</style>
