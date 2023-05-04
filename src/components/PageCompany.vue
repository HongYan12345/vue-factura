<template>
  <div class="button-container">
      <a-button @click="goBack" class="btn-back" size="large">返回</a-button>
       <a-button @click="goPdf" class="btn-next" size="large">导出</a-button>
    </div>
  <div>
  <div>
    <a class="data_empresa" @click="modificaDato">
      
      {{empresa_name}}
    </a>
  </div>
  <a-select
    v-model:value="client"
    show-search
    placeholder="Select a person"
    style="width: 100%"
    :options="clients_list">

  </a-select>
</div>
  <a-row :gutter="16">
   
     <a-col :xs="24" :sm="12" :md="8" :lg="6">
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

export default {
  components: {},
  setup() {
    const data = reactive({
      modifica_dato:false,
      empresa_name:"",
      empresa_direccion:"",
      empresa_telefono:"",
      empresa_cp:"",
      empresa_poblation:"",
      empresa_nif:"",
      
      client:"",
    })
    const refData = toRefs(data)

//router
    const router = useRouter()
//store
    const store = useStore()

//i18n
    const {t, locale} = useI18n()
    const setLocale = (lang: string) => {
      locale.value = lang
    }


//lista de clients
    const clients_list = ref([] as Array<{value: string, label: string}>)
    const confirmLoading = ref<boolean>(false);



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

    

    //export pdf
    const goPdf = () => {
      console.log("cliente select: ",data.client)
      saveAll()
      router.push({
            name: "pdf",
      })
    }

    
    const goBack = () => {
      saveAll()
      router.back()
    }

    const pageUpdate = ()=>{
      showEmpresa()
      showClient()
      saveAll()
    }
    
    const saveAll = () =>{
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
          
        }
      })
    }

    onMounted(() => {
      pageUpdate()
    })


    return {
      ...refData,
      t,
      clients_list,
      
      modificaDato,
      handleOkDato,
      goPdf,
      goBack,
      confirmLoading,
    };
  },
};
</script>
<style scoped>
</style>
