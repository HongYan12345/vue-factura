<template>
  <div class="menu-container">
    <a-menu
      style="background-color: #47b28c; padding: 10px 0 0"
      v-model:selectedKeys="current"
      mode="horizontal"
      @click="handleMenu"
      :key="selectedLanguage"
    >
      <a-menu-item key="1">
        {{ $t("factura") }}
      </a-menu-item>
      <a-menu-item key="2">
        {{ $t("clien") }}
      </a-menu-item>
      
    </a-menu>

    <a-dropdown class="btn-lenguage" :trigger="['click']">
      <template #overlay>
        <a-menu @click="handleMenuClick">
          <a-menu-item key="1"> Español </a-menu-item>
          <a-menu-item key="2"> English </a-menu-item>
          <a-menu-item key="3"> 简体中文 </a-menu-item>
        </a-menu>
      </template>
      <a-button class="btn-main">
        {{ $t("lenguage") }}
        <DownOutlined />
      </a-button>
    </a-dropdown>
  </div>
  <div>
    <router-view></router-view>
  </div>
</template>
<script lang="ts">
import { reactive, toRefs, onMounted, onUpdated, ref } from "vue";
import { useRouter } from "vue-router";
import { useI18n } from "vue-i18n";
import { DownOutlined } from "@ant-design/icons-vue";
import type { MenuProps } from "ant-design-vue";
import './css/AppStyle.css';

export default {
  components: {
    DownOutlined,
  },
  setup() {
    const data = reactive({
      isCreate: false,
      selectedLanguage:'',
    });

    const current = ref(["1"]);
    const refData = toRefs(data);
    const router = useRouter();
    //i18n
    const { t, locale } = useI18n();
    const setLocale = (lang: string) => {
      locale.value = lang;
      data.selectedLanguage = lang;
    };

    // const titleClick = (e: Event) => {
    //   console.log('titleClick', e);
    // };

    const handleMenuClick: MenuProps["onClick"] = (e) => {
      if (e.key == 1) {
        setLocale("es");
      } else if (e.key == 2) {
        setLocale("en");
      } else if (e.key == 3) {
        setLocale("zh");
      }
    };

    const handleMenu: MenuProps["onClick"] = (e) => {
      console.log(e.key);
      console.log(current.value);
      if (e.key == 1) {
        if (current.value[0] == "2") {
          router.back();
        }
      } else if (e.key == 2) {
        goClient();
      } else {
      }
    };

    //管理客户
    const goClient = () => {
      router.push({
        name: "client",
      });
    };

    /*
    const changeStep =() => {
      console.log("step:", current.value)
      switch(current.value){
        case 0: {
          router.push({
            name: "table",
          })
          break;
        }
        case 1: {
          router.push({
            name: "client",
          })
          break;
        }
        case 2: {
          router.push({
            name: "pdf",
          })
          break;
        }

      }
    };
*/

    onMounted(() => {
      console.log("onMounted");

      router.push({
        name: "main",
      });
    });

    /*
    onUpdated(() => {
      console.log("up")

    })
   */

    return {
      ...refData,
      handleMenuClick,
      current,
      handleMenu,
      t,
      locale,

      //changeStep,
    };
  },
};
</script>
<style scoped>
</style>
