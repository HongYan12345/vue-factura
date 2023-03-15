<template>
  <a-button @click="goClient">{{$t('cliente')}}</a-button>
  <a-dropdown>
      <template #overlay>
        <a-menu @click="handleMenuClick">
          <a-menu-item key="1">
            Español
          </a-menu-item>
          <a-menu-item key="2">
            English
          </a-menu-item>
          <a-menu-item key="3">
            简体中文
          </a-menu-item>
        </a-menu>
      </template>
      <a-button>
        {{$t('lenguage')}}
        <DownOutlined />
      </a-button>
    </a-dropdown>
  <a-button @click="modificaDato">{{$t('modifica_comp')}}</a-button>
  <a-modal
      v-model:visible="modifica_dato"
      title="Title"
      :confirm-loading="confirmLoading"
      @ok="handleOkDato"
    >
    数量:
    <a-input v-model:value="cantidad"></a-input>
    价格:
    <a-input v-model:value="precio"></a-input>
    型号:
    <a-input v-model:value="codigo"></a-input>
    </a-modal>
  <a-button @click="modificaProducto">{{$t('modifica_person')}}</a-button>
  <a-modal
      v-model:visible="modifica_producto"
      title="Title"
      :confirm-loading="confirmLoading"
      @ok="handleOkProducto"
    >
    <a-input
      :value="producto_name"
    >{{$t('name_producto')}}:</a-input>
    </a-modal>

    <a-button @click="addProducto">{{$t('add_producto')}}</a-button>
   <a-modal
      v-model:visible="add_producto"
      title="add"
      :confirm-loading="confirmLoading"
      @ok="handleOkAdd"
    >
    数量:
    <a-input v-model:value="cantidad"></a-input>
    价格:
    <a-input v-model:value="precio"></a-input>
    型号:
    <a-input v-model:value="codigo"></a-input>
    选择:
    <a-select
          v-model:value="articulo"
          show-search
          style="width: 100%"
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
    </a-modal>

  
  <a-input-number v-model:value="dto" @change="calcula"  addon-before="DTO" addon-after="%"></a-input-number>
  <a-checkbox :checked="isIva" @click="checkIva">+21%IVA</a-checkbox>
  <a-checkbox :checked="isRe" @click="checkRe">+5.2%R.E.</a-checkbox>
  <a-button @click="clearTable">{{$t('clear')}}</a-button>
  <div v-if="error">
    <a-alert message="Error Text" type="error" :visible="error" />
  </div>

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


  <a-list item-layout="horizontal" :data-source="dataSource">
    <template #renderItem="{ item }">
        
      <a-list-item>
        <a class="a-list" @click="editProducto(item)">
            <h3>{{item.euros}} €, {{item.codigo}}</h3>
            <div>{{item.cantidad}} x {{item.precio}} €</div>
        </a>
      </a-list-item>
    </template>
  </a-list>
  
  <a-button @click="goPdf">导出</a-button>
  
</template>
<script lang="ts">
import { computed, defineComponent, reactive, Ref, ref, UnwrapRef , toRefs, toRaw, onUpdated, onMounted, getCurrentInstance} from 'vue'
import { CheckOutlined, EditOutlined,DownOutlined } from '@ant-design/icons-vue'
import { useRouter} from 'vue-router'
import { cloneDeep } from 'lodash-es'
import { useStore } from 'vuex'
import { initTable, insertProducto, insertClient, deleteClient, queryAllTree} from '../util/dbSqlite'
import { useI18n } from "vue-i18n"
import type { MenuProps } from 'ant-design-vue'


interface DataItem {
  key: string;
  cantidad: string;
  precio: string;
  codigo:string;
  articulo: string;
  euros: number;
}


export default defineComponent({
  components: {
    CheckOutlined,
    EditOutlined,
    DownOutlined,
  },
  setup() {
    const data = reactive({
      error: false,
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
      add_producto:false,
      isEdit:"",
      producto_name:"",
      empresa_name:"",
      cantidad:"",
      codigo:"",
      precio:"",
      articulo:"",
    })
    const refData = toRefs(data)

//i18n
    const {t, locale} = useI18n()
    const setLocale = (lang: string) => {
      locale.value = lang
    };
    
    const handleMenuClick: MenuProps['onClick'] = e => {
      if(e.key == 1){
        setLocale('es')
      }
      else if(e.key == 2){
        setLocale('en')
      }
      else{
        setLocale('zh')
      }
    };

//lista de producto
    const dataSource: Ref<DataItem[]> = ref([])
    const count = computed(() => dataSource.value.length + 1)
    const confirmLoading = ref<boolean>(false);
//router
    const router = useRouter()
//store
    const store = useStore()

//lista de clients
    const clients = ref([] as Array<{value: string, label: string}>)

//添加客户公司信息
    const modificaDato = () => {
      data.modifica_dato = true
    }
    const handleOkDato = () => {
      confirmLoading.value = true
         
    }

//添加商品
    const addProducto = () => {
        data.add_producto = true

    }

    const editProducto = (item:DataItem) => {
        data.add_producto = true
        data.cantidad = item.cantidad
        data.precio = item.precio
        data.codigo = item.cantidad
        data.articulo = item.articulo
        data.isEdit = item.key
    }

    const handleOkAdd = () => {
      confirmLoading.value = true
      const newData = {
        key: `${count.value}`,
        cantidad: data.cantidad,
        codigo: data.codigo,
        precio: data.precio,
        articulo: data.articulo,
        euros : Number(data.cantidad)*Number(data.precio)
      }
      if(data.isEdit != ""){
        dataSource.value = dataSource.value.filter(item => item.key !== data.isEdit)
      }
      dataSource.value.push(newData)
      data.add_producto = false
      data.total += Number(data.cantidad)*Number(data.precio)
      calcula()
      data.cantidad = ""
      data.codigo = ""
      data.precio = ""
      data.articulo = ""
      console.log("total:", data.total)
      console.log(dataSource.value)
      confirmLoading.value = false
      
    }
//添加产品
    const modificaProducto = () => {
      data.modifica_producto = true;

    }
    const handleOkProducto = () => {
      confirmLoading.value = true;
      insertProducto(data.producto_name).then((value) => {
        data.modifica_producto = false
        confirmLoading.value = false
      })
        
    }

    //清空表格
    const clearTable = () => {
      dataSource.value = new Array<DataItem>()
      data.total = 0
      calcula()
    }

//calcula
    const checkRe = () => {
      data.isRe = !data.isRe
      calcula()
    }

    const checkIva = () => {
      data.isIva = !data.isIva
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
          data.iva = 0
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


//export pdf
    const goPdf = () => {
      console.log(dataSource.value)
      store.commit("saveData",{
        dataArray: dataSource.value,
        euroBase: data.total,
        dto:data.dto,
        isRe:data.isRe,
        isIva:data.isIva,
      })
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
      router.push({
        name: "client",
      })
    }
    
    onMounted(() => {
      data.dto = store.state.dto
      dataSource.value = store.state.dataArray
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
      t,
      labelCol: { style: { width: '150px' } },
      wrapperCol: { span: 14 },
      dataSource,
      editingKey: '',
      checkRe,
      checkIva,
      calcula,
      goPdf,
      goClient,
      clearTable,
      clients,
      modificaDato,
      handleOkDato,
      handleOkAdd,
      modificaProducto,
      addProducto,
      editProducto,
      handleOkProducto,
      confirmLoading,
      setLocale,
      handleMenuClick,
    }
  },
});
</script>
<style scoped>
.editable-row-operations a {
  margin-right: 8px;
}

.a-list{
    background-color:azure; 
    display: block;
    width: auto;
    line-height: 30px;
    padding:0px 10px;
    border-top:1px solid aquamarine;
    border-bottom: 1px solid aquamarine;
    color: black;
    
}
.a-list:hover{
    background-color:aqua;
}

</style>
