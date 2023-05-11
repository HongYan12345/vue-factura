<template>
  <div>
    <div class="button-container">
      <a-button @click="goBack" class="btn-back" size="large">{{$t('back')}}</a-button>
    </div>
    <a-space direction="vertical" :size="12">
      <a-date-picker v-model:value="date" value-format="DD/MM/YYYY" :showToday="false"/>
      <a-input-number addon-before="Nº" v-model:value="num" :min="1"></a-input-number>
      <a-radio-group class="btn-select" v-model:value="forma" button-style="solid" @change="handleChange">
        <a-radio-button value="EFECTIVO">EFECTIVO</a-radio-button>
        <a-radio-button value="TRANSFERENCIA">TRANSFERENCIA</a-radio-button>
        <a-radio-button value="TARJETA">TARJETA</a-radio-button>
      </a-radio-group>
    </a-space>
    <div id="exportPdf" ref="exportpdf" style="
        border: 1px solid grey;
        padding: 10px;
        background-color: white;">
      <div style="text-align: right">Nº: {{num}}</div>
      <div style="text-align: right">{{date}}</div>
      <div style="text-align: right">{{forma}}</div>
      <br/>
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

     <table style="width: 90%; border-collapse: collapse; margin-top: 20px; margin-left: auto; margin-right: auto;">
  <thead>
    <tr>
      <th style="border: 1px solid #000; padding: 3px; background-color: white;">cantidad</th>
      <th style="border: 1px solid #000; padding: 3px; background-color: white;">precio</th>
      <th style="border: 1px solid #000; padding: 3px; background-color: white;">codigo</th>
      <th style="border: 1px solid #000; padding: 3px; background-color: white;">articulo</th>
      <th style="border: 1px solid #000; padding: 3px; background-color: white;">euros</th>
    </tr>
  </thead>
  <tbody>
    <tr v-for="item in dataSource" :key="item.key">
      <td style="border: 1px solid #000; padding: 2px; background-color: white;">
        {{ item.cantidad }}
      </td>
      <td style="border: 1px solid #000; padding: 2px; background-color: white;">
        {{ item.precio }}
      </td>
      <td style="border: 1px solid #000; padding: 2px; background-color: white;">
        {{ item.codigo }}
      </td>
      <td style="border: 1px solid #000; padding: 2px; background-color: white;">
        {{ item.articulo }}
      </td>
      <td style="border: 1px solid #000; padding: 2px; background-color: white;">
        {{ item.euros }}
      </td>
    </tr>
    <tr v-for="n in (10 - dataSource.length)" v-if="dataSource.length < 10" style="border-left:1px solid #000; border-right:1px solid #000;">
      <td style="background-color: white;">&nbsp;</td>
      <td style="background-color: white;">&nbsp;</td>
      <td style="background-color: white;">&nbsp;</td>
      <td style="background-color: white;">&nbsp;</td>
      <td style="background-color: white;">&nbsp;</td>
    </tr>
    <tr v-for="item in dataSource_final" :key="item.total">
      <td colspan="5">
        <table style="width: 100%; border-collapse: collapse; margin-top: 0; border: none;">
          <thead>
            <tr>
              <th style="border: 1px solid #000; padding: 3px; background-color: white;">TOTAL BRUTO</th>
              <th style="border: 1px solid #000; padding: 3px; background-color: white;">%DTO</th>
              <th style="border: 1px solid #000; padding: 3px; background-color: white;">BASE</th>
              <th style="border: 1px solid #000; padding: 3px; background-color: white;">21%IVA</th>
              <th style="border: 1px solid #000; padding: 3px; background-color: white;">%R.E</th>
              <th style="border: 1px solid #000; padding: 3px; background-color: white;">TOTAL EUROS</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td style="border: 1px solid #000; padding: 5px; background-color: white;">
                {{ item.total }}
              </td>
              <td style="border: 1px solid #000; padding: 5px; background-color: white;">
                {{ item.dto }}
              </td>
              <td style="border: 1px solid #000; padding: 5px; background-color: white;">
                {{ item.base }}
              </td>
              <td style="border: 1px solid #000; padding: 5px; background-color: white;">
                {{ item.iva }}
              </td>
              <td style="border: 1px solid #000; padding: 5px; background-color: white;">
                {{ item.re }}
              </td>
              <td style="border: 1px solid #000; padding: 5px; background-color: white;">
                {{ item.total_final }}
              </td>
            </tr>
          </tbody>
        </table>
      </td>
    </tr>
  </tbody>
</table>
    </div>
    <div>
      <a-button @click="savePdf">{{$t('save')}}</a-button>
    </div>
    <div>
      <a-button @click="exportPdf">{{$t('export')}}</a-button>
    </div>
  </div>
</template>


<script lang="ts">
import { ref, reactive, toRefs, onMounted, onUpdated } from "vue";
import { useRouter } from "vue-router";
import { export_pdf } from "../util/exportPdf";
import { useStore } from "vuex";
import {
  insertFactura } from "../util/dbSqlite"
import { DataItem, EuroFinal, FormState } from "../util/interface";
import dayjs from 'dayjs';
import { DatePicker, message } from 'ant-design-vue';
import "../css/PdfStyle.css"

export default {
  components: { DatePicker},
  setup() {
    const data = reactive({
      forma:ref('EFECTIVO'),
      date: ref(dayjs().format('DD/MM/YYYY')),
      num: "",

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

    const handleChange = () => {
      console.log(data.forma)
    }

    const savePdf = () => {
      const dataItemJson = JSON.stringify(data.dataSource);
      const dataFinalJson = JSON.stringify(data.dataSource_final[0]);
      const dataEmpresaJson = JSON.stringify(data.data_empresa);
      const dataClienteJson = JSON.stringify(data.data_cliente);
      insertFactura(dataClienteJson, dataEmpresaJson, dataItemJson, data.num, data.date, data.forma, dataFinalJson)
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
      savePdf,
      today,
      handleChange,
    };
  },
};
</script>
<style scoped>

</style>
