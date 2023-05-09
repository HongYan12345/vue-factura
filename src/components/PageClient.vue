<template>
  <div>
    <!-- <div class="button-container">
      <a-button @click="goBack" class="btn-back" size="large">{{$t('back')}}</a-button>
    </div> -->

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
                  {{item.value.name}}
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
      title="创建新客户"
      :visible="visible"
      :body-style="{ paddingBottom: '80px' }"
      :footer-style="{ textAlign: 'right' }"
      @close="onClose"
    >
      <div v-if="errorClient"><a-alert message="错误" type="error" /></div>

      <a-form
        :model="formState"
      >
        <a-form-item label="名字">
          <a-input v-model:value="formState.name" />
        </a-form-item>
        <a-form-item label="电话">
          <a-input v-model:value="formState.telefono" />
        </a-form-item>
        <a-form-item label="地址">
          <a-input v-model:value="formState.direccion" />
        </a-form-item>
        <a-form-item label="区分">
          <a-input v-model:value="formState.poblation" />
        </a-form-item>
        <a-form-item label="NIF">
          <a-input v-model:value="formState.nif" />
        </a-form-item>
        <a-form-item label="CP">
          <a-input v-model:value="formState.cp" />
        </a-form-item>
        <a-form-item label="付款方式">
          <a-radio-group v-model:value="formState.forma">
            <a-radio value="tarjeta">TARJETA</a-radio>
            <a-radio value="efectivo">EFECTIVO</a-radio>
          </a-radio-group>
        </a-form-item>
        <a-form-item :wrapper-col="{ span: 14, offset: 4 }">
          <a-button type="primary" @click="onSubmit">创建</a-button>
        </a-form-item>
      </a-form>
    </a-drawer>

    <!-- <a-drawer
      title="删除老客户"
      :visible="visibleTable"
      :body-style="{ paddingBottom: '80px' }"
      :footer-style="{ textAlign: 'right' }"
      @close="onCloseTable"
    >
      <a-select
        v-model:value="valueClient"
        show-search
        placeholder="Select a person"
        style="width: 200px"
        :options="clients"
        @change="handleChange"
      >
      </a-select>
      <div>
        {{ valueClient }}
      </div>
      
      <a-button @click="dbDelete">删除</a-button>
      
    </a-drawer> -->
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
} from "../util/dbSqlite"
import { FormState} from '../util/interface'

export default {
  components: {
    PlusOutlined, DeleteOutlined
  },
  setup() {
    const data = reactive({
      errorClient: false,
      valueClient: "",
    })
    const refData = toRefs(data)
    const router = useRouter()

    const clients = ref([] as Array<{ value: string; label: string }>)
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
      showClient()
    }

    const visibleTable = ref<boolean>(false)
    const showTable = () => {
      visibleTable.value = true
    }
    const onCloseTable = () => {
      visibleTable.value = false
      showClient()
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
            label: r.name,
          })
        })
        console.log("lista clients:", clients.value)
      })
    }

    const handleChange = () => {
      console.log(data.valueClient)
    }

    const editCliente = (item: FormState) => {
      
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
      visible,
      visibleTable,
      delectCliente,
      clients,
      handleChange,
    }
  },
}
</script>
<style scoped>
</style>
