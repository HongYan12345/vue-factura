<template>
<div>
<div class="button-container">
      <a-button @click="goBack" class="btn-back" size="large">{{$t('back')}}</a-button>
    </div>
<a-list
        class="a-list"
        item-layout="horizontal"
        :data-source="factura_list"
        :locale="{ emptyText: ' ' }"
      >
        <template #renderItem="{ item }">
          <a-list-item>
            <div class="item-row">
              <a class="item-details" @click="">
                <div>
                  <div>{{parsedEmpresaName(item.value.empresa)}}</div>
                 
                </div>
                
              </a>
              
            </div>
          </a-list-item>
        </template>
      </a-list>
</div>
 
</template>

<script lang="ts">
import { defineComponent, reactive, toRefs, ref,
        onMounted,} from 'vue'
import { queryFactura } from '../util/dbSqlite'
import { useRouter} from 'vue-router'
import { useStore } from 'vuex'
import { useI18n} from "vue-i18n"


export default defineComponent({
  components: {
  },
  setup() {
    const data = reactive({
      
      
    })

    const factura_list = ref([] as Array<{}>);
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

    const showFactura =() => {
      queryFactura().then((value) => {
        console.log("factura en base de dato:",value)
        value.forEach((r: any) => {
          factura_list.value.push({
            value: r,
          });
      })
      
        })
    }

    const goBack = () => {
      router.back();
    }

    const parsedEmpresaName = (empresa:string)=>{
      
      const parsedEmpresa = JSON.parse(empresa);
      return parsedEmpresa.name;
    }

    onMounted(() => {
     showFactura()
    })
   

    return {
      ...refData,
      t,
      factura_list,
      goBack,
      parsedEmpresaName,
    }
  },
});
</script>
<style scoped>


</style>
