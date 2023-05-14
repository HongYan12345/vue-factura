<template>
<div>
  <a-button @click="goCreate" class="btn-crear">
  <PlusOutlined style="font-size: 50px;" />
</a-button>
<a-button @click="goHistory" class="btn-crear">
  <FileSearchOutlined style="font-size: 50px;" />
</a-button>

</div>
 
</template>

<script lang="ts">
import { defineComponent, reactive, toRefs,
        onMounted,} from 'vue'
import { PlusOutlined, FileSearchOutlined} from '@ant-design/icons-vue'
import { useRouter} from 'vue-router'
import { useStore } from 'vuex'
import { initAllTable ,queryFactura } from '../util/dbSqlite'
import { useI18n} from "vue-i18n"


export default defineComponent({
  components: {
    PlusOutlined,
    FileSearchOutlined,
  },
  setup() {
    initAllTable()
    const data = reactive({
      error: false,
      isCreate: false,
      
    })
    const refData = toRefs(data)

//i18n
    const {t, locale} = useI18n()
    const setLocale = (lang: string) => {
      locale.value = lang
    };
    

//router
    const router = useRouter()
//store
    const store = useStore()


    const goCreate =() => {
      data.isCreate = true
      router.push({
            name: "table",
      })
    }

    const goHistory =() => {
      data.isCreate = true
      router.push({
            name: "history",
      })
    }

    const showFactura =() => {
      queryFactura().then((value) => {
        console.log("factura en base de dato:",value)
      })
    }


    onMounted(() => {
     showFactura()
    })
   

    return {
      ...refData,
      t,
      goCreate,
      goHistory,
    }
  },
});
</script>
<style scoped>


</style>
