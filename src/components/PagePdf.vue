<template>
  <div>
    <div>
      <a-button @click="goBack">back</a-button>
    </div>
    <div id="exportPdf" ref="exportpdf">
      <div>公司信息</div>
      <div>客户信息</div>
      <div>日期</div>
      <div>号码</div>
       <div><a-table :dataSource="dataSource" :columns="columns" :pagination="false" /></div>
      <div><a-table :dataSource="dataSource_final" :columns="columns_final" :pagination="false" /></div>
    </div>
    <div>
      <a-button @click="exportPdf">export</a-button>
    </div>

  </div>
</template>


<script lang="ts">
import { reactive, toRefs, onMounted, onUpdated } from "vue"
import { useRouter } from "vue-router"
import { export_pdf} from "../util/exportPdf"
import { useStore } from 'vuex'
import {DataItem} from '../store/store'

export default {
  components: {},
  setup() {
    const data = reactive({
       dataSource: new Array<DataItem>(),
      dataSource_final: [
        {

        }
      ],
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
        ]
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
