<template>
  <div>
    <div>
      <a-button @click="goBack">back</a-button>
    </div>
    <div id="exportPdf" ref="exportPdf">
       <div><a-table :dataSource="dataSource" :columns="columns" :pagination="false" /></div>
      
    </div>
    <div>
      <a-button :onClick="exportPdf">export</a-button>
    </div>

  </div>
</template>


<script lang="ts">
import { reactive, toRefs, onMounted, onUpdated } from "vue"
import { useRouter } from "vue-router"
import { export_pdf} from "../util/exportPdf"
import { useStore } from 'vuex'
import {DataItem} from '../store/store'
import jsPDF from "jspdf";

export default {
  components: {},
  setup() {
    const data = reactive({
       dataSource: new Array<DataItem>(),

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
            title: 'euro',
            dataIndex: 'euro',
            key: 'euro',
          },
        ]
    });
    const refData = toRefs(data);
    const router = useRouter();
    const store = useStore()
    const goBack = () => {
      router.back();
    }

    const exportPdf = () => {
      const elementToPrint = document.getElementById("exportPdf")!;
  const pdf = new jsPDF("p", "pt", "a4");

  pdf.html(elementToPrint, {
    callback: function (pdf) {
      pdf.save("invoice.pdf");
    },
    x: 10,
    y: 10
  });
    }

    onMounted(() => {
      data.dataSource = store.state.dataArray
      console.log(data.dataSource)
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
