<template>
<div class="btn-right">
      <a-button @click="goCompany" class="btn-next" size="large">{{$t('next')}}</a-button>
      
    </div>
  <a-collapse
    :bordered="false"
    class="collapse-total"
    
  >
    <a-collapse-panel >
      <template #header>
        <div style="margin-left: 0;"> <span>TOTAL EUROS</span></div>
        <div class="space"></div>
        <div class="large-font"><span >{{ total_euros.toFixed(2) }}€</span></div>
          
      </template>
      <a-row :gutter="16">
        <a-col :xs="18" :sm="12" :md="12" :lg="6">
          <a-input-number
            size="small"
            style="padding-bottom: 8px"
            v-model:value="displayDto"
            @change="calcula"
            addon-before="DTO"
            :min="0"
            :max="99"
            >%</a-input-number
          >
        </a-col>
      </a-row>
      <a-row>
        <a-col :span="12"> &nbspTotal:</a-col>
        <a-col :span="12" class="text-right">
          {{ total.toFixed(2) }}
        </a-col>
      </a-row>
      <a-row v-if="dto > 0">
        <a-col :span="12"> &nbsp{{ dto }}%DTO:</a-col>
        <a-col :span="12" class="text-right">
          -{{ Number(total * 0.01 * dto).toFixed(2) }}
        </a-col>
      </a-row>
      <a-row>
        <a-col :span="12">
          &nbsp<a-checkbox :checked="isIva" @click="checkIva"
            >+21%IVA</a-checkbox
          ></a-col
        >
        <a-col :span="12" class="text-right">
          {{ iva.toFixed(2) }}
        </a-col>
      </a-row>
      <a-row>
        <a-col :span="12">
          &nbsp<a-checkbox :checked="isRe" @click="checkRe"
            >+5.2%R.E.</a-checkbox
          ></a-col
        >
        <a-col :span="12" class="text-right">
          {{ re.toFixed(2) }}
        </a-col>
      </a-row>
    </a-collapse-panel>
  </a-collapse>

  <a-modal
    v-model:visible="modifica_articulo"
    title="修改产品类型"
    :confirm-loading="confirmLoading"
    @ok="handleOkArticulo"
  >
    <a-input v-model:value="articulo_name">{{ $t("name_producto") }}:</a-input>
  </a-modal>

  <a-row>
    <a-col :span="24">
      <a-button @click="addProducto" class="btn-add" type="text" block
        ><template #icon><PlusOutlined style="font-size: 20px;"/></template
      ></a-button>
      <a-list
        class="a-list"
        item-layout="horizontal"
        :data-source="dataSource"
        :locale="{ emptyText: ' ' }"
      >
        <template #renderItem="{ item }">
          <a-list-item>
            <div class="item-row">
              <a class="item-details" @click="editProducto(item)">
                <div>
                  <div>{{item.codigo}}, {{item.articulo}}</div>
                  <div>{{ item.cantidad }} x {{ Number(item.precio).toFixed(2) }} €</div>
                </div>
                
                <div class="list-font">{{Number(item.euros).toFixed(2)}} €</div>
              </a>
              
            </div>
          </a-list-item>
        </template>
      </a-list>
    </a-col>
  </a-row>
  <!-- <a-row>
    <a-col :xs="24" :sm="12" :md="8" :lg="6">
      
      <a-button  @click="clearTable">{{ $t("clear") }}</a-button>
    </a-col>
    <a-button @click="modificaArticulo">{{ $t("modifica_articulo") }}</a-button>
  </a-row> -->

  <a-modal
    v-model:visible="add_producto"
    title="add"
    :confirm-loading="confirmLoading"
    @ok="saveProducto"
  >
    <a-row>
      <a-col :span="5">数量：</a-col>
      <a-col :span="17">
        <a-input
          v-model:value="cantidad"
          :bordered="false"
          class="text-right"
        ></a-input>
      </a-col>
    </a-row>
    <a-row>
      <a-col :span="5">价格:</a-col>
      <a-col :span="17">
        <a-input
          v-model:value="precio"
          :bordered="false"
          class="text-right"
        ></a-input>
      </a-col>
    </a-row>
    <a-row>
      <a-col :span="5">型号:</a-col>
      <a-col :span="17">
        <a-input
          v-model:value="codigo"
          :bordered="false"
          class="text-right"
        ></a-input>
      </a-col>
    </a-row>
    <a-select
      v-model:value="articulo"
      show-search
      placeholder="Select"
      style="width: 100%"
      :options="articulo_list"
    >
    </a-select>
    <template #footer>
       <div class="button-container">
        <a-button
          v-if="isEdit!=''"
          size="large"
          type="primary"
          danger
          @click="deleteProducto(codigo)"
          >删除</a-button>
        <a-button :class="{ 'center-button': !isEdit!='' }" key="submit" type="primary" size="large"  @click="saveProducto">保存</a-button>
       </div>
        
      </template>
  </a-modal>
  
  
</template>


<script lang="ts">
import {
  computed,
  defineComponent,
  reactive,
  Ref,
  ref,
  UnwrapRef,
  toRefs,
  toRaw,
  onUpdated,
  onMounted,
  getCurrentInstance,
} from "vue";
import { PlusOutlined } from "@ant-design/icons-vue";
import { useRouter } from "vue-router";
import { useStore } from "vuex";
import {
  initAllTable,
  insertArticulo,
  queryAllTree,
  queryAllArticulo,
  selectClient,
} from "../util/dbSqlite";
import { useI18n } from "vue-i18n";
import { DataItem, FormState } from "../util/interface";

export default {
  components: {
    PlusOutlined,
  },
  setup() {
    const data = reactive({
      total: 0,
      iva: 0,
      re: 0,
      total_euros: 0,
      dto: 0,
      ante_euro: 0,
      isRe: false,
      isIva: false,
      add_producto: false,
      cantidad: "",
      codigo: "",
      precio: "",
      articulo: "",
      isEdit: "",
      modifica_articulo: false,
      articulo_name: "",
    });
    const refData = toRefs(data);

    const displayDto = computed({
      get: () => (data.dto === 0 ? "" : data.dto),
      set: (value: number | string) => {
        data.dto = value === "" ? 0 : Number(value);
      },
    });

    //router
    const router = useRouter();
    //store
    const store = useStore();

    //i18n
    const { t, locale } = useI18n();
    const setLocale = (lang: string) => {
      locale.value = lang;
    };

    //lista de producto
    const dataSource: Ref<DataItem[]> = ref([]);
    const count = computed(() => dataSource.value.length + 1);
    const confirmLoading = ref<boolean>(false);
    //lista de articulo
    const articulo_list = ref([] as Array<{ value: string }>);

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

    //calcula
    const checkRe = () => {
      data.isRe = !data.isRe;
      calcula();
    };

    const checkIva = () => {
      data.isIva = !data.isIva;
      calcula();
    };

    const calcula = () => {
      console.log("[PageTable]funcion calcula");
      data.total = 0
      for (const item of dataSource.value) {
        data.total += item.euros

      }
      if (data.dto < 0) {
        data.dto = 0;
      }

      if (data.isIva) {
        data.iva = Number(
          (data.total * (100 - data.dto) * 0.01 * 0.21).toFixed(2)
        );
      } else {
        data.iva = 0;
      }

      if (data.isRe) {
        data.re = Number(
          (data.total * (100 - data.dto) * 0.01 * 0.052).toFixed(2)
        );
      } else {
        data.re = 0;
      }
      data.total_euros = Number(
        (data.total * (100 - data.dto) * 0.01 + data.iva + data.re).toFixed(2)
      );
    };

    //clear tabla
    const clearTable = () => {
      dataSource.value = new Array<DataItem>();
      data.total = 0;
      calcula();
    };

    //añadir producto
    const addProducto = () => {
      data.add_producto = true;
    };
    //modificar producto
    const editProducto = (item: DataItem) => {
      data.add_producto = true;
      data.cantidad = item.cantidad;
      data.precio = item.precio;
      data.codigo = item.codigo;
      data.articulo = item.articulo;
      data.isEdit = item.key;
      data.ante_euro = item.euros;
    };
    //delete producto
    const deleteProducto = (codigo: string) => {
      data.add_producto = false;
      data.isEdit = "";
      data.cantidad = "";
      data.codigo = "";
      data.precio = "";
      data.articulo = "";
      dataSource.value = dataSource.value.filter((item) => item.codigo !== codigo);
      calcula();
    }

    //save producto
    const saveProducto = () => {
      confirmLoading.value = true;

      if (data.isEdit != "") {
        for (const item of dataSource.value) {
          if (item.key === data.isEdit) {
            item.cantidad = data.cantidad;
            item.precio = data.precio;
            item.codigo = data.codigo;
            item.articulo = data.articulo;
            item.euros = Number(data.cantidad) * Number(data.precio);
            break;
          }
        }
        //data.total -= data.ante_euro;
        //data.ante_euro = 0;
        data.isEdit = "";
      } else {
        const newData = {
          key: `${count.value}`,
          cantidad: data.cantidad,
          codigo: data.codigo,
          precio: data.precio,
          articulo: data.articulo,
          euros: Number(data.cantidad) * Number(data.precio),
        };
        dataSource.value.push(newData);
      }
      data.add_producto = false;
      //data.total += Number(data.cantidad) * Number(data.precio);
      calcula();
      data.cantidad = "";
      data.codigo = "";
      data.precio = "";
      data.articulo = "";
      console.log("[PageTable]producto saved");
      confirmLoading.value = false;
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

    const pageUpdate = () => {
      console.log("[PageTable]funcion pageUpdate");
      showArticulo();
      calcula();
      saveAll();
    };

    const goCompany = () => {
      pageUpdate();
      router.push({
        name: "company",
      });
    };

    const saveAll = () => {
      store.commit("saveData", {
        dataArray: dataSource.value,
        euroBase: data.total,
        dto: data.dto,
        isRe: data.isRe,
        isIva: data.isIva,
      });
      store.commit("saveFinal", {
        total: data.total,
        dto: data.dto,
        base: data.total - data.dto,
        iva: data.iva,
        re: data.re,
        total_final: data.total_euros,
      });
    };

    onMounted(() => {
      console.log("[PageTable]funcion onMounted");
      data.dto = store.state.dto;
      dataSource.value = store.state.dataArray;
      data.total = store.state.euroBase;
      data.isRe = store.state.isRe;
      data.isIva = store.state.isIva;
      calcula();
      pageUpdate();
    });

    return {
      ...refData,
      t,
      displayDto,
      dataSource,
      checkIva,
      checkRe,
      calcula,
      addProducto,
      saveProducto,
      deleteProducto,
      editProducto,
      clearTable,
      confirmLoading,
      goCompany,
      articulo_list,
      modificaArticulo,
      handleOkArticulo,
    };
  },
};
</script>
<style scoped>




.delete-button {
  display: flex;
  align-items: center;
  justify-content: center;
  margin-left: 10px;
}
</style>
