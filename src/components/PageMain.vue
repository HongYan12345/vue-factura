<template>

  <a-collapse v-model:activeKey="activeKey" :bordered="false" style="background-color:gray;" expandIconPosition="right">
    
    <a-collapse-panel>
    <template #header>
      <div class="panel-header">
        <span>TOTAL EUROS:</span>
        <span>{{total_euros.toFixed(2)}}</span>
        <div class="spacer"></div>
      </div>
    </template>
    <a-row>
        <a-col :span="12">
          &nbsptotal:</a-col>
          <a-col :span="12" class="text-right">
          {{total.toFixed(2)}}
        </a-col>

        <a-col :span="12">
          &nbsp{{dto}}%DTO:</a-col>
          <a-col :span="12" class="text-right">
          -{{Number(total * 0.01 * dto).toFixed(2)}}
        </a-col>

        <a-col :span="12">
          &nbsp21%IVA:</a-col>
          <a-col :span="12" class="text-right">
          {{iva.toFixed(2)}}
        </a-col>

        <a-col :span="12">
          &nbsp5.2%R.E:</a-col>
          <a-col :span="12" class="text-right">
          {{re.toFixed(2)}}
        </a-col>
      </a-row>
    
    </a-collapse-panel>
  </a-collapse>
  <a-row :gutter="16">
    <a-col :xs="18" :sm="12" :md="12" :lg="6">
      <a-input-number v-model:value="dto" @change="calcula"  addon-before="DTO" addon-after="%" :min="0" :max="99"></a-input-number>
    </a-col>
    <a-col :xs="12" :sm="12" :md="12" :lg="6">
      <a-checkbox :checked="isIva" @click="checkIva">+21%IVA</a-checkbox>
    </a-col>
    <a-col :xs="12" :sm="12" :md="12" :lg="6">
      <a-checkbox :checked="isRe" @click="checkRe">+5.2%R.E.</a-checkbox>
       
    </a-col>
  </a-row>
  <a-row>
    
       <a-col :xs="24" :sm="12" :md="8" :lg="6">
          <a-button @click="clearTable">{{$t('clear')}}</a-button>
        </a-col>
      
  </a-row>
  <div>
  <a-select
    v-model:value="client"
    show-search
    style="width: 100%"
    :options="clients_list">

  </a-select>
</div>
  <a-row :gutter="16">
    <a-col :xs="24" :sm="12" :md="8" :lg="6">
      <a-button @click="goClient">{{$t('cliente')}}</a-button>
    </a-col>
   
     <a-col :xs="24" :sm="12" :md="8" :lg="6">
      <a-button @click="modificaDato">{{$t('modifica_comp')}}</a-button>
      <a-modal
      v-model:visible="modifica_dato"
      title="Title"
      :confirm-loading="confirmLoading"
      @ok="handleOkDato"
    >
    公司名称:
    <a-input v-model:value="empresa_name"></a-input>
    地址:
    <a-input v-model:value="empresa_direccion"></a-input>
    区分:
    <a-input v-model:value="empresa_poblation"></a-input>
    邮编:
    <a-input v-model:value="empresa_cp"></a-input>
    税号:
    <a-input v-model:value="empresa_nif"></a-input>
    电话:
    <a-input v-model:value="empresa_telefono"></a-input>
    </a-modal>
    </a-col>
    <a-col :xs="24" :sm="12" :md="8" :lg="6">
      <a-button @click="modificaArticulo">{{$t('modifica_articulo')}}</a-button>
      <a-modal
      v-model:visible="modifica_articulo"
      title="修改产品类型"
      :confirm-loading="confirmLoading"
      @ok="handleOkArticulo"
    >
    <a-input
      v-model:value="articulo_name"
    >{{$t('name_producto')}}:</a-input>
    </a-modal>
    </a-col>
  </a-row>
<a-button @click="addProducto" class="btn-add" block><template #icon><PlusOutlined /></template></a-button>
   <a-modal
      v-model:visible="add_producto"
      title="add"
      :confirm-loading="confirmLoading"
      @ok="handleOkAdd"
    >
    <a-row>
      <a-col :span="5">数量：</a-col>
      <a-col :span="17">
        <a-input v-model:value="cantidad" :bordered="false" class="text-right"></a-input>
      </a-col>
    </a-row>
    <a-row>
      <a-col :span="5">价格:</a-col>
      <a-col :span="17">
        <a-input v-model:value="precio" :bordered="false" class="text-right"></a-input>
      </a-col>
    </a-row>
    <a-row>
      <a-col :span="5">型号:</a-col>
      <a-col :span="17">
        <a-input v-model:value="codigo" :bordered="false" class="text-right"></a-input>
      </a-col>
    </a-row>
    <a-select
          v-model:value="articulo"
          show-search
          placeholder="Select a person"
          style="width: 100%"
          :options="articulo_list"
    >
        </a-select>
    </a-modal>

  

  <div v-if="error">
    <a-alert message="Error Text" type="error" :visible="error" />
  </div>

  

  <a-row>
    <a-col :span="24">
      <a-list item-layout="horizontal" :data-source="dataSource" :locale="{ emptyText: '' }">
        <template #renderItem="{ item }">
          <a-list-item>
            <a class="a-list" @click="editProducto(item)">
               <h3>{{item.euros}} €, {{item.codigo}}</h3>
              <div>{{item.cantidad}} x {{item.precio}} €</div>
            </a>
            <a-button @click="deleteProducto(item.key, item.euros)">delete</a-button>
          </a-list-item>
        </template>
      </a-list>
    </a-col>
  </a-row>

  <a-row>
    <a-col :xs="24" :sm="12" :md="8" :lg="6">
      <a-button @click="goPdf">导出</a-button>
    </a-col>
  </a-row>
  
</template>

<script lang="ts">
import { computed, defineComponent, reactive, 
        Ref, ref, UnwrapRef , toRefs, toRaw, 
        onUpdated, onMounted, getCurrentInstance} from 'vue'
import { PlusOutlined} from '@ant-design/icons-vue'
import { useRouter} from 'vue-router'
import { useStore } from 'vuex'
import { initAllTable,  
        insertArticulo, insertEmpresa,
        queryEmpresa, queryAllTree, queryAllArticulo, selectClient} from '../util/dbSqlite'
import { useI18n} from "vue-i18n"
import { DataItem, FormState} from '../util/interface'


export default defineComponent({
  components: {
    PlusOutlined,
  },
  setup() {
    initAllTable()
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
      modifica_articulo:false,
      modifica_dato:false,
      add_producto:false,
      isEdit:"",
      articulo_name:"",
      empresa_name:"",
      empresa_direccion:"",
      empresa_telefono:"",
      empresa_cp:"",
      empresa_poblation:"",
      empresa_nif:"",
      cantidad:"",
      codigo:"",
      precio:"",
      articulo:"",
      client:"",
    })
    const refData = toRefs(data)

//i18n
    const {t, locale} = useI18n()
    const setLocale = (lang: string) => {
      locale.value = lang
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
    const clients_list = ref([] as Array<{value: string, label: string}>)
//lista de articulo
    const articulo_list = ref([] as Array<{value: string}>)

//添加自家公司信息
    const modificaDato = () => {
      data.modifica_dato = true
    }
    const handleOkDato = () => {
      confirmLoading.value = true
      const newData = {
          name: data.empresa_name,
          direccion: data.empresa_direccion,
          telefono: data.empresa_telefono,
          cp: data.empresa_cp,
          poblation: data.empresa_poblation,
          nif: data.empresa_nif
      }
      insertEmpresa(newData).then((value) => {
        data.modifica_dato = false
        confirmLoading.value = false
      })
    }

//añadir producto
    const addProducto = () => {
        data.add_producto = true
    }
//modificar producto
    const editProducto = (item:DataItem) => {
        data.add_producto = true
        data.cantidad = item.cantidad
        data.precio = item.precio
        data.codigo = item.codigo
        data.articulo = item.articulo
        data.isEdit = item.key
        data.ante_euro = item.euros
        console.log("ante_euro:", data.ante_euro)
    }
//delete producto
    const deleteProducto = (key:string, euros:number) => {
      data.total -= euros
      calcula()
      dataSource.value = dataSource.value.filter(item => item.key !== key)
    }
//save producto
    const handleOkAdd = () => {
      confirmLoading.value = true
      
      if(data.isEdit != ""){
        for(const item of dataSource.value) {
          if(item.key === data.isEdit){
            item.cantidad = data.cantidad 
            item.precio = data.precio
            item.codigo = data.codigo
            item.articulo = data.articulo
            item.euros = Number(data.cantidad)*Number(data.precio)
            break
          }
        }
        data.total -= data.ante_euro
        data.ante_euro = 0
        data.isEdit = ""
      }
      else{
        const newData = {
        key: `${count.value}`,
        cantidad: data.cantidad,
        codigo: data.codigo,
        precio: data.precio,
        articulo: data.articulo,
        euros : Number(data.cantidad)*Number(data.precio)
        }
        dataSource.value.push(newData)
      }
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
//add articulo
    const modificaArticulo = () => {
      data.modifica_articulo = true;

    }
    const handleOkArticulo = () => {
      confirmLoading.value = true;
      insertArticulo(data.articulo_name).then((value) => {
        data.modifica_articulo = false
        confirmLoading.value = false
        data.articulo_name = ""
        showArticulo()
      })
        
    }

//clear tabla
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
      console.log(data.isIva)
      calcula()
    }

    const calcula = () => {
      console.log("funcion calcula")
      if(data.dto < 0){
        data.dto = 0
      }
      
      if(data.isIva){
        data.iva = Number((data.total*(100-data.dto)*0.01*0.21).toFixed(2))
      }
      else{
        data.iva = 0
      }
        
      if(data.isRe){
        data.re = Number((data.total*(100-data.dto)*0.01*0.052).toFixed(2))    
      }
      else{
        data.re = 0
      }
      data.total_euros = Number((data.total*(100-data.dto)*0.01+data.iva+data.re).toFixed(2))
      
    }


//export pdf
    const goPdf = () => {
      console.log("lista de producto: ",dataSource.value)
      console.log("cliente select: ",data.client)
      store.commit("saveData",{
        dataArray: dataSource.value,
        euroBase: data.total,
        dto:data.dto,
        isRe:data.isRe,
        isIva:data.isIva,
      })
      store.commit("saveEmpresa",{
          name: data.empresa_name,
          direccion: data.empresa_direccion,
          telefono: data.empresa_telefono,
          cp: data.empresa_cp,
          poblation: data.empresa_poblation,
          nif: data.empresa_nif
      })
      selectClient(Number(data.client)).then((value) => {
        console.log("select dato client:",value)
        if(value[0]){
          store.commit("saveCliente",{
          name: value[0].name,
          direccion: value[0].direccion,
          telefono: value[0].telefono,
          cp: value[0].cp,
          poblation: value[0].poblation,
          nif: value[0].nif,
          forma: value[0].forma
          })
          router.push({
            name: "pdf",
          })
        }
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

    const showEmpresa = () => {
      queryEmpresa().then((value) => {
        console.log("empresa en base de dato:",value)
        if(value[0]){
          data.empresa_name = value[0].name
          data.empresa_telefono = value[0].telefono
          data.empresa_direccion = value[0].direccion
          data.empresa_cp = value[0].cp
          data.empresa_nif = value[0].nif
          data.empresa_poblation = value[0].poblation
        }
      })
    }

    const showClient = () => {
      queryAllTree().then((value) => {
        
        value.forEach((r: any) => {
          clients_list.value.push({
            value: r.telefono,
            label: r.name + r.telefono,
          })
        })
        console.log("list_client:", clients_list)
      })
    }

    const showArticulo = () => {
      queryAllArticulo().then((value) => {
        console.log("articulo en base de dato:",value)
        value.forEach((r: any) => {
          articulo_list.value.push({
            value: r.name,
          })
        })
      })
    }

    const pageUpdate = ()=>{
      calcula()
      showArticulo()
      showEmpresa()
      showClient()
    }
    
    onMounted(() => {
      data.dto = store.state.dto
      dataSource.value = store.state.dataArray
      data.total = store.state.euroBase
      data.isRe = store.state.isRe
      data.isIva = store.state.isIva
      pageUpdate()
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
      clients_list,
      articulo_list,
      modificaDato,
      handleOkDato,
      handleOkAdd,
      modificaArticulo,
      addProducto,
      deleteProducto,
      editProducto,
      handleOkArticulo,
      confirmLoading,
      setLocale,
    }
  },
});
</script>
<style scoped>


</style>
