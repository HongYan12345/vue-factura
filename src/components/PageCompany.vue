<template>
  <div class="button-container">
      <a-button @click="goBack" class="btn-back" size="large">{{$t('back')}}</a-button>
       <a-button @click="goPdf" class="btn-next" size="large">{{$t('next')}}</a-button>
    </div>
  <div>
  <div>
    <a  @click="modificaDato">
      <div class="data_empresa">
        <div class="company_title">
          {{empresa_name}}
        </div>
      
      {{empresa_direccion}}
      <br>
      {{empresa_poblation}}
      {{empresa_cp}}
      <br>
      NIF: {{empresa_nif}}
      TEL: {{empresa_telefono}}

      </div>
    </a>
  </div>
  <a-select
    
    show-search
    placeholder="Select a person"
    style="width: 100%"
    :options="clients_list"
    @select="selectCliente"
    >

  </a-select>
  <div v-if="client_name" class="data_empresa">
        <div class="company_title">
          {{client_name}}
        </div>
      
      {{client_direccion}}
      <br>
      {{client_poblation}}
      {{client_cp}}
      <br>
      NIF: {{client_nif}}
      TEL: {{client_telefono}}

      </div>
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
import { reactive, 
        ref, toRefs,
        onMounted} from 'vue'
import { useRouter} from 'vue-router'
import { useStore } from 'vuex'
import { insertEmpresa,
        queryEmpresa, queryAllTree, selectClient} from '../util/dbSqlite'
import { useI18n} from "vue-i18n"

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
      client_name:"",
      client_direccion:"",
      client_telefono:"",
      client_cp:"",
      client_poblation:"",
      client_nif:"",
      client_forma:"",
      
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
          id:1,
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
          console.log(r)
          clients_list.value.push({
            value: r.telefono,
            label: r.telefono + ' ' + r.name
          })
        })
        console.log("list_client:", clients_list)
      })
    }

    

    //export pdf
    const goPdf = () => {
      console.log("cliente select: ",data.client_name)
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

    const selectCliente = (value: any, option: any)=>{
      console.log(value)
      selectClient(Number(value)).then((value) => {
        console.log("select dato client:",value)
        if(value[0]){
          data.client_name = value[0].name
          data.client_direccion = value[0].direccion
          data.client_telefono = value[0].telefono
          data.client_cp = value[0].cp
          data.client_poblation = value[0].poblation
          data.client_nif = value[0].nif
          data.client_forma = value[0].forma
        }
      })
    }

    const saveCliente = ()=>{

        store.commit("saveCliente",{
          name:data.client_name,
          direccion: data.client_direccion,
          telefono: data.client_telefono,
          cp: data.client_cp,
          poblation: data.client_poblation,
          nif: data.client_nif,
          forma: data.client_forma
          })
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
      saveCliente()
    }

    onMounted(() => {
      pageUpdate()
    })


    return {
      ...refData,
      t,
      store,
      clients_list,
      selectCliente,
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
