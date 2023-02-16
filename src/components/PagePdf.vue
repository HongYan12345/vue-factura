<template>
  <div>
    <div>
      <a-button @click="goBack">back</a-button>
    </div>
    <div id="exportPdf" ref="exportPdf">111111111111111</div>
    <div>
      <a-button @click="exportPdf">export</a-button>
    </div>

  </div>
</template>


<script lang="ts">
import { reactive, toRefs, onMounted, onUpdated } from "vue";
import { useRouter } from "vue-router";
import { export_pdf} from "../util/exportPdf"

export default {
  components: {},
  setup() {
    const data = reactive({});
    const refData = toRefs(data);
    const router = useRouter();

    const goBack = () => {
      router.back();
    };

    const exportPdf = () => {
      export_pdf()
    };

    return {
      ...refData,
      goBack,
      exportPdf,
    };
  },
};
</script>
<style scoped>
</style>
