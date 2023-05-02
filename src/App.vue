<template>
  <div >
    <a-dropdown class="lenguage" :trigger="['click']">
      <template #overlay>
        <a-menu @click="handleMenuClick">
          <a-menu-item key="1">
            Español
          </a-menu-item>
          <a-menu-item key="2">
            English
          </a-menu-item>
          <a-menu-item key="3">
            简体中文
          </a-menu-item>
        </a-menu>
      </template>
      <a-button class="btn-main">
        {{$t('lenguage')}}
        <DownOutlined />
      </a-button>
    </a-dropdown>
  </div>
  <div>
    <router-view></router-view>
  </div>
  <div>
      <div v-if="isCreate">
      <a-steps direction="horizontal"  size="small" :responsive="false">
      <template #progressDot="{ index, status, prefixCls }">
        <a-popover>
          <template #content>
            <span>step {{ index }} status: {{ status }}</span>
          </template>
          <span :class="`${prefixCls}-icon-dot`" />
        </a-popover>
      </template>
      <a-step :title="$t('step1')" />
      <a-step :title="$t('step2')"  />
      <a-step :title="$t('step3')" />
    </a-steps>
    <a-divider />
    </div>
  </div>
</template>
<script lang="ts">
import { reactive, toRefs, onMounted, onUpdated, ref} from 'vue'
import { useRouter} from 'vue-router'
import { useI18n } from "vue-i18n"
import { DownOutlined } from '@ant-design/icons-vue'
import type { MenuProps } from 'ant-design-vue'

export default {
  components: {
    DownOutlined
  },
  setup() {
    const data = reactive({
      isCreate:false,
    })

    const current = ref<number>(0);
    const refData = toRefs(data)
    const router = useRouter()
    //i18n
    const {t, locale} = useI18n()
    const setLocale = (lang: string) => {
      locale.value = lang
    };

    

    const handleMenuClick: MenuProps['onClick'] = e => {
      if(e.key == 1){
        setLocale('es')
      }
      else if(e.key == 2){
        setLocale('en')
      }
      else{
        setLocale('zh')
      }
    }

    
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
      console.log("onMounted")


      router.push({
        name: "main",
      })

    })

    /*
    onUpdated(() => {
      console.log("up")

    })
   */

    return {
      ...refData,
      handleMenuClick,
      current,
      t,

      //changeStep,
    };
  },
};
</script>
<style scoped>


</style>
