<template>
  <div>
    <!-- <div class="button-container">
      <a-button @click="goBack" class="btn-back" size="large">{{$t('back')}}</a-button>
    </div> -->
    <div>
      <a-button @click="modificaArticulo">{{ $t("modifica_articulo") }}</a-button>
    </div>
    
  
    <div>
      <a-button @click="showDrawer" class="btn-add" type="text" block
        ><template #icon><PlusOutlined style="font-size: 20px;"/></template
      ></a-button>

    
    </div>
    
    <div>
      <a-list
        class="a-list"
        item-layout="horizontal"
        :data-source="clients"
        :locale="{ emptyText: ' ' }"
      >
        <template #renderItem="{ item }">
          <a-list-item>
            <div class="item-row">

              <a class="item-details" @click="editCliente(item.value)">
                <div>
                 {{item.value.name}} , {{item.value.telefono}} 
                </div>
                
              </a>
              <a-button @click="delectCliente(item.value.telefono)">
                  <template #icon><DeleteOutlined /></template>
                </a-button>
            </div>
          </a-list-item>
        </template>
      </a-list>
    </div>


    <a-drawer
      :title="$t('cliente')"
      :visible="visible"
      :body-style="{ paddingBottom: '80px' }"
      :footer-style="{ textAlign: 'right' }"
      @close="onClose"
    >
      <div v-if="errorClient"><a-alert message="错误" type="error" /></div>

      <a-form
        :model="formState"
      >
        <a-form-item :label="$t('name')">
          <a-input v-model:value="formState.name" />
        </a-form-item>
        <a-form-item :label="$t('telefono')">
          <a-input v-model:value="formState.telefono" />
        </a-form-item>
        <a-form-item :label="$t('direccion')">
          <a-input v-model:value="formState.direccion" />
        </a-form-item>
        <a-form-item :label="$t('poblation')">
          <a-input v-model:value="formState.poblation" />
        </a-form-item>
        <a-form-item :label="$t('nif')">
          <a-input v-model:value="formState.nif" />
        </a-form-item>
        <a-form-item :label="$t('cp')">
          <a-input v-model:value="formState.cp" />
        </a-form-item>
        <a-form-item :wrapper-col="{ span: 14, offset: 4 }">
          <a-button type="primary" @click="onSubmit">{{$t('crear')}}</a-button>
        </a-form-item>
      </a-form>
    </a-drawer>

    <a-modal
    v-model:visible="modifica_articulo"
    title="修改产品类型"
    :confirm-loading="confirmLoading"
    @ok="handleOkArticulo"
  >
    <a-input v-model:value="articulo_name">{{ $t("name_producto") }}:</a-input>
  </a-modal>

    
  </div>
</template>


<script lang="ts">
import {
  reactive,
  toRefs,
  onMounted,
  onUpdated,
  ref,
  toRaw,
  UnwrapRef,
} from "vue"
import { useRouter } from "vue-router"
import { PlusOutlined, DeleteOutlined} from '@ant-design/icons-vue'
import {
  initAllTable,
  insertClient,
  deleteClient,
  queryAllTree,
  insertArticulo,
  queryAllArticulo,
} from "../util/dbSqlite"
import { FormState} from '../util/interface'
import { update } from 'lodash-es'
import { message } from 'ant-design-vue';

export default {
  components: {
    PlusOutlined, DeleteOutlined
  },
  setup() {
    const data = reactive({
      errorClient: false,
      valueClient: "",
      modifica_articulo: false,
      articulo_name: "",
    })
    const refData = toRefs(data)
    const router = useRouter()
    const confirmLoading = ref<boolean>(false);
    const clients = ref([] as Array<{ value: string; label: string }>)
    const articulo_list = ref([] as Array<{ value: string }>);

    const formState: UnwrapRef<FormState> = reactive({
      name: "",
      direccion: "",
      nif: "",
      forma: "",
      poblation: "",
      cp: "",
      telefono: "",
    })
    const onSubmit = () => {
      if (
        formState.name == "" &&
        formState.direccion == "" &&
        formState.nif == "" &&
        formState.forma == "" &&
        formState.poblation == "" &&
        formState.cp == "" &&
        formState.telefono == ""
      ) {
        data.errorClient = true
      } else {
        data.errorClient = false
        console.log("submit!", toRaw(formState))
        message.success('Submit client success')
        dbStart()
        onClose()
      }
    }

    //新建用户信息
    const visible = ref<boolean>(false)

    const showDrawer = () => {
      visible.value = true
    }

    const onClose = () => {
      visible.value = false
      updatePage()
    }

    //add articulo
    const modificaArticulo = () => {
      data.modifica_articulo = true;
    };
    const handleOkArticulo = () => {
      confirmLoading.value = true;
      insertArticulo(data.articulo_name).then((value) => {
        data.modifica_articulo = false;
        confirmLoading.value = false;
        data.articulo_name = "";
        showArticulo();
      });
    };

    const showArticulo = () => {
      queryAllArticulo().then((value) => {
        console.log("[PageTable]articulo en base de dato:", value);
        value.forEach((r: any) => {
          articulo_list.value.push({
            value: r.name,
          });
        });
      });
    };

    const visibleTable = ref<boolean>(false)

    const showTable = () => {
      visibleTable.value = true
    }
    const onCloseTable = () => {
      visibleTable.value = false
      updatePage()
    }

    const goBack = () => {
      router.back()
    }

    const dbStart = () => {
      initAllTable()
      const dato = {
        telefono: formState.telefono,
        name: formState.name,
        direccion: formState.direccion,
        poblation: formState.poblation,
        cp: formState.cp,
        nif: formState.nif,
        forma: formState.forma,
      }
      console.log("bd:", dato)
      insertClient(dato)
      formState.name = "" 
      formState.direccion = ""
      formState.nif = ""
      formState.forma = ""
      formState.poblation = ""
      formState.cp = ""
      formState.telefono = ""
      updatePage()
    }

    const delectCliente = (telefono: string) => {
      deleteClient(Number(telefono))
      updatePage()
    }
    const showClient = () => {
      clients.value = []
      queryAllTree().then((value) => {
        value.forEach((r: any) => {
          clients.value.push({
            value: r,
            label: r.name + ' ,' + r.telefono,
          })
        })
        console.log("lista clients:", clients.value)
      })
    }

    const handleChange = () => {
      console.log(data.valueClient)
    }

    const editCliente = (item: FormState) => {
      visible.value = true
      formState.name = item.name
      formState.telefono = item.telefono
      formState.direccion = item.direccion
      formState.nif = item.nif
      formState.poblation = item.poblation
      formState.cp = item.cp
    }
    
    const updatePage = () => {
      showClient()
    }


    onMounted(() => {
      console.log("up")
      showClient()
    })

    return {
      ...refData,
      formState,
      onSubmit,
      goBack,
      showDrawer,
      onClose,
      onCloseTable,
      editCliente,
      visible,
      visibleTable,
      delectCliente,
      clients,
      handleChange,
      modificaArticulo,
      handleOkArticulo,
      confirmLoading,
    }
  },
}
</script>
<style scoped>
</style>
