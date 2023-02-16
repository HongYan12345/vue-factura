<template>
  <div>
    <router-view></router-view>
  </div>
</template>
<script lang="ts">
import { reactive, toRefs, onMounted, onUpdated} from 'vue';
import { useRouter} from 'vue-router';

export default {
  components: {
    
  },
  setup() {
    const data = reactive({
      
    })
    const refData = toRefs(data)
    const router = useRouter()
    
  
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
      
    };
  },
};
</script>
<style scoped>


</style>
