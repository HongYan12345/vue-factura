<template>
  <a-button @click="goClient">cliente</a-button>
  <a-button @click="modificaDato">修改公司信息</a-button>
  <a-button @click="modificaProducto">修改产品信息</a-button>
  <a-modal
      v-model:visible="modifica_producto"
      title="Title"
      :confirm-loading="confirmLoading"
      @ok="handleOkProducto"
    >
    <a-input
      :value="producto_name"
    >nombre de producto:</a-input>
    </a-modal>
  <div>
    <a-button class="editable-add-btn" @click="handleAdd" :disabled="error||isAdd" style="margin-bottom: 8px">添加</a-button>
  </div>
  
  <a-input-number v-model:value="dto" @change="calcula"  addon-before="DTO" addon-after="%"></a-input-number>
  <a-checkbox :checked="isIva" @click="checkIva">+21%IVA</a-checkbox>
  <a-checkbox :checked="isRe" @click="checkRe">+5.2%R.E.</a-checkbox>
  <a-button @click="clearTable">clear</a-button>
  <div v-if="error">
    <a-alert message="Error Text" type="error" :visible="error" />
  </div>
  
  <a-table bordered :data-source="dataSource" :columns="columns" :pagination="false">
    <template v-for="col in ['cantidad', 'precio', 'codigo']" #[col]="{ text, record }" :key="col">
      <div>
        <a-input
          v-if="editableData[record.key]"
          v-model:value="editableData[record.key][col]"
          style="margin: -5px 0"
        />
        <template v-else>
          {{ text }}
        </template>
      </div>
    </template>
    <template #articulo="{ text, record }" :key="articulo">
      <div>
        
        <a-select
          v-if="editableData[record.key]"
          v-model:value="editableData[record.key].articulo"
          show-search
          style="width: 100%"
          placeholder="选择一个"
          
        >
          <a-select-option value="bañador">Bañador</a-select-option>
          <a-select-option value="bikini">Bikini</a-select-option>
          <a-select-option value="bolso">Bolso</a-select-option>
          <a-select-option value="bufanda">Bufanda</a-select-option>
          <a-select-option value="bodi">Bodi</a-select-option>
          <a-select-option value="camisa">Camisa</a-select-option>
          <a-select-option value="camiseta">Camiseta</a-select-option>
          <a-select-option value="chalego">Chalego</a-select-option>
          <a-select-option value="chaqueta">Chaqueta</a-select-option>
          <a-select-option value="conjunto">Conjunto</a-select-option>
          <a-select-option value="falda">Falda</a-select-option>
          <a-select-option value="jersey">Jersey</a-select-option>
          <a-select-option value="mallas">Mallas</a-select-option>
          <a-select-option value="mono">Mono</a-select-option>
          <a-select-option value="pantalon">Pantalon</a-select-option>
          <a-select-option value="pichi">Pichi</a-select-option>
          <a-select-option value="sudatela">Sudatela</a-select-option>
          <a-select-option value="vestido">Vestido</a-select-option>
          <a-select-option value="portes">PORTES</a-select-option>
        </a-select>
        <template v-else>
          {{ text }}
        </template>
      </div>
    </template>
    
    <template #operation="{ record }">
      <div class="editable-row-operations">
        <span v-if="editableData[record.key]">
          <button @click="save(record.key)">保存</button>
          
        </span>
        <span v-else>
          <button @click="edit(record.key)">修改</button>
        </span>
      </div>
      <a-popconfirm
        v-if="dataSource.length"
        title="确定删除吗?"
        @confirm="onDelete(record.key)"
      >
        <button>删除</button>
      </a-popconfirm>
      
    </template>
    
  </a-table>
  <div>
    <a-row>
    <a-col :span="6">total:{{total}}</a-col>
    <a-col :span="6">{{dto}}%DTO:{{Number(total*0.01*dto).toFixed(2)}}</a-col>
    <a-col :span="6">base:{{Number(total-total*0.01*dto).toFixed(2)}}</a-col>
    <a-col :span="6">21%IVA:{{iva}}</a-col>
    <a-col :span="6">5.2%R.E:{{re}}</a-col>
    <a-col :span="6">TOTAL EUROS:{{total_euros.toFixed(2)}}</a-col>
  </a-row>
  </div>
  <a-button @click="goPdf">导出</a-button>
  
</template>
<script lang="ts">
import { computed, defineComponent, reactive, Ref, ref, UnwrapRef , toRefs, toRaw, onUpdated, onMounted} from 'vue'
import { CheckOutlined, EditOutlined } from '@ant-design/icons-vue'
import { useRouter} from 'vue-router'
import { cloneDeep } from 'lodash-es'
import { useStore } from 'vuex'
import { initTable, insertProducto, insertClient, deleteClient, queryAllTree} from '../util/dbSqlite'

interface DataItem {
  key: string;
  cantidad: string;
  precio: string;
  codigo:string;
  articulo: string;
  euros: string;
}


export default defineComponent({
  components: {
    CheckOutlined,
    EditOutlined,
    
  },
  setup() {
    const data = reactive({
      error: false,
      isAdd: false,
      total:0,
      iva:0,
      re:0,
      total_euros:0,
      dto:0,
      isRe: false,
      isIva: false,
      ante_euro:0,
      modifica_producto:false,
      modifica_dato:false,
      producto_name:"",
    })
    const refData = toRefs(data)
    const router = useRouter()
    const store = useStore()
    const clients = ref([] as Array<{value: string, label: string}>)
    const columns = [
      {
        title: '数量',
        dataIndex: 'cantidad',
        width: '15%',
        slots: { customRender: 'cantidad' },
      },
      {
        title: '型号',
        dataIndex: 'codigo',
        width: '25%',
        slots: { customRender: 'codigo' },
      },
      {
        title: '样子',
        dataIndex: 'articulo',
        width: '35%',
        slots: { customRender: 'articulo' },
      },
       {
        title: '价格',
        dataIndex: 'precio',
        width: '15%',
        slots: { customRender: 'precio' },
      },
      {
        title: '€UROS',
        dataIndex: 'euros',
        width: '25%',
      },
      {
        title: '修改',
        dataIndex: 'operation',
        
        slots: { customRender: 'operation' },
      },
    ]
    const dataSource: Ref<DataItem[]> = ref([])

    const count = computed(() => dataSource.value.length + 1)
    const editableData: UnwrapRef<Record<string, DataItem>> = reactive({})

    const edit = (key: string) => {
      editableData[key] = cloneDeep(dataSource.value.filter(item => key === item.key)[0])
      data.ante_euro = Number(editableData[key].euros)
      console.log("edit",key)
    }
    const save = (key: string) => {
      if(editableData[key].cantidad != null && editableData[key].precio != null && editableData[key].articulo != null && editableData[key].codigo != null){
        editableData[key].euros = String(Number(editableData[key].cantidad)*Number(editableData[key].precio))
        data.total = data.total+Number(editableData[key].euros)-data.ante_euro
        calcula()
        data.ante_euro = 0
        console.log("articula:", editableData[key].articulo)
        Object.assign(dataSource.value.filter(item => key === item.key)[0], editableData[key])
        delete editableData[key]
        console.log("data:", dataSource.value)
        data.isAdd = false
        data.error = false
      }
      else{
        data.error = true
      }
    };
    const cancel = (key: string) => {
      delete editableData[key]
    };

    const onDelete = (key: string) => {
      
      data.total = data.total-Number(dataSource.value.filter(item => item.key === key)[0].euros)
      calcula()
      dataSource.value = dataSource.value.filter(item => item.key !== key)
      console.log("----", dataSource.value.filter(item => item.key === key)[0])
      data.isAdd = false
      data.error = false
    };
    const handleAdd = () => {
      data.isAdd = true
      const newData = {
        key: `${count.value}`,
        cantidad: "",
        codigo: "",
        precio: "",
        articulo: "",
        euros : ""
      }
      dataSource.value.push(newData)
      editableData[`${count.value-1}`] = cloneDeep(dataSource.value.filter(item => `${count.value-1}` === item.key)[0])
    }

    const checkRe = () => {
      data.isRe = !data.isRe
      calcula()
    }

    const checkIva = () => {
      data.isIva = !data.isIva
      console.log(data.isIva)
      calcula()
    }

    const calcula = () => {
      if(data.dto < 0){
        data.dto = 0
      }
      if(data.dto == 0){
        if(data.isIva){
          data.iva = Number((data.total*0.21).toFixed(2))
          data.total_euros = data.total+data.iva
        }
        else{
          data.total_euros = data.total
        }
        
        if(data.isRe){
          data.re = Number((data.total*0.052).toFixed(2))
          data.total_euros = data.total_euros+data.re
        }
        else{
          data.total_euros = data.total_euros-data.re
          data.re = 0
        }
      }
      else{
        if(data.isIva){
          data.iva = Number((data.total*(100-data.dto)*0.01*0.21).toFixed(2))
          data.total_euros = Number((data.total*(100-data.dto)*0.01+data.iva).toFixed(2))
        }
        else{
          data.total_euros = Number((data.total*(100-data.dto)*0.01).toFixed(2))
        }
        
        if(data.isRe){
          data.re = Number((data.total*(100-data.dto)*0.01*0.052).toFixed(2))
          data.total_euros = data.total_euros+data.re
        }
        else{
          data.total_euros = data.total_euros-data.re
          data.re = 0
        }
      }
    }

//清空表格
    const clearTable = () => {
      dataSource.value = new Array<DataItem>()
      data.total = 0
      calcula()
    }

//导出pdf
    const goPdf = () => {
      console.log(dataSource.value)
      store.commit("saveData",{
        dataArray: dataSource.value,
        euroBase: data.total,
        dto:data.dto,
        isRe:data.isRe,
        isIva:data.isIva,
      })
      console.log("vuex:", store.state.dataSource)
      router.push({
        name: "pdf",
      })
    }

//管理客户
    const goClient = () => {
      store.commit("saveData",{
        dataArray: dataSource.value,
        euroBase: data.total,
        dto:data.dto,
        isRe:data.isRe,
        isIva:data.isIva,
      })
      console.log("vuex:", store.state.dataSource)
      router.push({
        name: "client",
      })
    }
    
    const modificaDato = () => {
      
    }

    const modificaProducto = () => {
      data.modifica_producto = true;
    }

    const confirmLoading = ref<boolean>(false);

    const handleOkProducto = () => {
      confirmLoading.value = true;
      insertProducto(data.producto_name).then((value) => {
        data.modifica_producto = false
        confirmLoading.value = false
      })
        
    }

    onMounted(() => {
      data.dto = store.state.dto
      if(store.state.dataStore){
        dataSource.value = store.state.dataSource
      }
      data.total = store.state.euroBase
      data.isRe = store.state.isRe
      data.isIva = store.state.isIva
      calcula()
    })

    onUpdated(() => {
      //console.log("up")
      //showClient()
    })
   

    return {
      ...refData,
      labelCol: { style: { width: '150px' } },
      wrapperCol: { span: 14 },
      columns,
      onDelete,
      handleAdd,
      dataSource,
      editableData,
      count,
      editingKey: '',
      edit,
      save,
      cancel,
      checkRe,
      checkIva,
      calcula,
      clearTable,
      goPdf,
      goClient,
      clients,
      modificaDato,
      modificaProducto,
      handleOkProducto,
      confirmLoading
    }
  },
});
</script>
<style scoped>
.editable-row-operations a {
  margin-right: 8px;
}
</style>
