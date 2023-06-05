<template>
<div>
<div class="button-container">
      <a-button @click="goBack" class="btn-back" size="large">{{$t('back')}}</a-button>
    </div>
<a-list
        class="a-list"
        item-layout="horizontal"
        :data-source="sortedFacturaList"
        :locale="{ emptyText: ' ' }"
      >
        <template #renderItem="{ item }">
          <a-list-item>
            <div class="item-row">
              <a class="item-details" @click="goFactura(item)">
                <div>
                  <div>{{parsedItem(item)}}</div>
                 
                </div>
                
              </a>
              <a-button @click="newFactura(item)">
                  <CopyOutlined />
              </a-button>
              &nbsp
              <a-button @click="deletFactura(item)">
                  <DeleteOutlined />
                </a-button>
            </div>
          </a-list-item>
        </template>
      </a-list>
</div>
 
</template>

<script lang="ts">
import { defineComponent, reactive, toRefs, ref,
        onMounted, computed } from 'vue'
import { queryFactura, deleteFactura} from '../util/dbSqlite'
import { useRouter} from 'vue-router'
import { useStore } from 'vuex'
import { useI18n} from "vue-i18n"
import { CopyOutlined, DeleteOutlined} from '@ant-design/icons-vue'
import { FacturaState} from '../util/interface'
import { deleteData, getAllData} from "../util/dbFirebase"

export default defineComponent({
  components: {
    CopyOutlined,
    DeleteOutlined
  },
  setup() {
    const data = reactive({
    })
    const refData = toRefs(data)

//i18n
    const {t, locale} = useI18n()
    

//router
    const router = useRouter()
//store
    const store = useStore()
    
    const factura_list = ref([] as Array<FacturaState>)
    const showFactura =() => {
      if(!store.state.isVisitor){
        getAllData("facturas").then(allData => {
          console.log("[PageHistory]factura en FireBase:",allData);
          allData.forEach((r: FacturaState) => {
            factura_list.value.push(r)
          })
        }).catch(error => {
          console.error("Error getting data: ", error);
        });
      }
      else{
        queryFactura().then((value) => {
        console.log("[PageHistory]factura en base de dato:",value)
        value.forEach((r: FacturaState) => {
          factura_list.value.push(r)
        })
      })
      }
      
    }

    const sortedFacturaList = computed(() => {
      return [...factura_list.value].sort((a, b) => {
        // Convert date from "DD/MM/YYYY" to "YYYY-MM-DD"
        const dateA = a.factura_date.split('/').reverse().join('-');
        const dateB = b.factura_date.split('/').reverse().join('-');
        return  new Date(dateB).getTime() - new Date(dateA).getTime();
      });
    });
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

    const goFactura = (item:FacturaState) => {
      saveAll(item)
      router.push({
       name: "pdf",
       params: { history: 1 },
      });
    };

    const newFactura = (item:FacturaState) => {
      saveAll(item)
      router.push({
       name: "company",
      });
    };

    const deletFactura = (item:FacturaState) => {
      if(!store.state.isVisitor){
        deleteData("facturas", item.id)
      }
      else{
        deleteFactura(item.id)
      }
      
    }

    const parsedItem = (item:FacturaState)=>{
      const parsedEmpresa = JSON.parse(item.empresa);
      return "Nº: " + item.factura_num + ", " + item.factura_date + ", "  + parsedEmpresa.name;
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
      newFactura,
      sortedFacturaList,
      deletFactura,
    }
  },
});
</script>
<style scoped>


</style>
