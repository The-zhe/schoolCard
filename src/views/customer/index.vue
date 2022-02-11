<template>
  <div class="customer-page">
    <navHeader> </navHeader>
  </div>
</template>

<script>
import navHeader from "@/components/navigation/header";
import { empcustomer } from "@/api/empcustomer";
export default {
  data() {
    return {};
  },
  mounted() {
    const { id } = this.$route.params;
    this.id = id;
    this.getInfo();
  },
  methods: {
    async getInfo() {
      try {
        const { data } = await empcustomer(this.id);
      } catch (e) {
        Toast.clear();
      }
    },
  },
  filters: {},
  components: {
    navHeader,
  },
};
</script>

<style lang="less">
@import "../../styles/_var.less";
.customer-page {
  padding-bottom: 1.2rem;
  background: #f5f5f5;
}
</style>
