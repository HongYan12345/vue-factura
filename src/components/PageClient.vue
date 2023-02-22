<template>
  <div>
    <div>
      <a-button @click="goBack">back</a-button>
    </div>
    
    <a-button type="primary" @click="showDrawer">
      <template #icon><PlusCircleOutlined /></template>
      新建客户
    </a-button>
    <a-button type="primary" @click="showTable">
      <template #icon><DeleteOutlined /></template>
      删除老客户
    </a-button>
    
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
        :label-col="labelCol"
        :wrapper-col="wrapperCol"
      >
        <a-form-item label="名字">
          <a-input v-model:value="formState.name" />
        </a-form-item>
        <a-form-item label="电话">
          <a-input v-model:value="formState.telefono" />
        </a-form-item>
        <a-form-item label="地址">
          <a-input v-model:value="formState.direction" />
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

    <a-drawer
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
      
    </a-drawer>
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
import { PlusCircleOutlined, DeleteOutlined} from '@ant-design/icons-vue'
import {
  initTable,
  insertClient,
  deleteClient,
  queryAllTree,
} from "../util/dbSqlite"

export default {
  components: {
    PlusCircleOutlined, DeleteOutlined
  },
  setup() {
    const data = reactive({
      errorClient: false,
      valueClient: null,
    })
    const refData = toRefs(data)
    const router = useRouter()

    interface FormState {
      name: string;
      direction: string;
      nif: string;
      forma: string;
      cp: string;
      telefono: string;
    }

    const clients = ref([] as Array<{ value: string; label: string }>)
    const formState: UnwrapRef<FormState> = reactive({
      name: "",
      direction: "",
      nif: "",
      forma: "",
      cp: "",
      telefono: "",
    })
    const onSubmit = () => {
      if (
        formState.name == "" &&
        formState.direction == "" &&
        formState.nif == "" &&
        formState.forma == "" &&
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
      initTable()
      const dato = {
        telefono: formState.telefono,
        name: formState.name,
        direction: formState.direction,
        cp: formState.cp,
        nif: formState.nif,
        forma: formState.forma,
      }
      console.log("bd:", dato)
      insertClient(dato)
    }

    const dbDelete = (telefono: string) => {
      deleteClient(Number(telefono))
      queryAllTree().then((value) => {
      })
    }
    const showClient = () => {
      clients.value = []
      queryAllTree().then((value) => {
        console.log("clients:",value)
        value.forEach((r: any) => {
          clients.value.push({
            value: r.telephone,
            label: r.name,
          })
        })
      })
    }

    const handleChange = () => {

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
      showTable,
      onClose,
      onCloseTable,
      visible,
      visibleTable,
      dbDelete,
      clients,
      handleChange,
    }
  },
}
</script>
<style scoped>
</style>
