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
              <a class="item-details" @click="goFactura(item.value)">
                <div>
                  <div>{{parsedItem(item.value)}}</div>
                 
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
      clearAll()
      router.back();
    }

    const clearAll = () => {
      store.commit("RESET_STATE")
    }

    const saveAll = (item:any) => {
      const parsedEmpresa = JSON.parse(item.empresa);
      const parsedEuro = JSON.parse(item.euro_final);
      const parsedList = JSON.parse(item.item_list);
      const parsedCliente = JSON.parse(item.user)
      console.log(parsedEuro)

      store.commit("saveCliente",parsedCliente)
      
      store.commit("saveData", {
        dataArray: parsedList,
        euroBase: parsedEuro.total,
        dto: parsedEuro.dto,
        isRe: parsedEuro.re!=0,
        isIva: parsedEuro.iva!=0,
      })
      store.commit("saveFinal", parsedEuro)

      store.commit("saveEmpresa", parsedEmpresa)
      store.commit("saveNum",{
          num:item.factura_num,
          date:item.factura_date,
          forma:item.forma
       })
    }

    const goFactura = (item:any) => {
      saveAll(item)
      router.push({
       name: "pdf",
       params: { history: 1 },
      });
    };

    const parsedItem = (item:any)=>{
      const parsedEmpresa = JSON.parse(item.empresa);
      console.log(parsedEmpresa)
      return "Nº: " + item.factura_num + ", " + parsedEmpresa.name + ", " + item.factura_date;
    }

    onMounted(() => {
     showFactura()
    })
   

    return {
      ...refData,
      t,
      factura_list,
      goBack,
      parsedItem,
      goFactura,
    }
  },
});
</script>
<style scoped>


</style>
