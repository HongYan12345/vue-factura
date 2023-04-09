<template>
  <div>
    <a-dropdown class="lenguage">
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
      <a-button>
        {{$t('lenguage')}}
        <DownOutlined />
      </a-button>
    </a-dropdown>
    <div></div>
    <router-view></router-view>
  </div>
</template>
<script lang="ts">
import { reactive, toRefs, onMounted, onUpdated} from 'vue'
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
      
    })
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
    };
  
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
      handleMenuClick
    };
  },
};
</script>
<style scoped>

.lenguage{
  
}
</style>
