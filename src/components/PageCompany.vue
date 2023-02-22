<template>
  <div>
    <div>
      1111111111111111111111
    </div>
  </div>
</template>


<script lang="ts">
import { reactive, toRefs } from "vue"

export default {
  components: {},
  setup() {
    const data = reactive({})
    const refData = toRefs(data)

    return {
      ...refData,
    };
  },
};
</script>
<style scoped>
</style>
