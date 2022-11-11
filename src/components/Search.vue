<template>
  <el-input
    size="large"
    v-model="condition"
    placeholder="Search..."
    :prefix-icon="Search"
    @keyup.enter.prevent="onTypeInputed"
  />
</template>

<script lang="ts" setup>
import { ref, Ref } from "@vue/reactivity";
import { Search } from "@element-plus/icons-vue";
import { defineEmits } from "@vue/runtime-core";
const emits = defineEmits(["typeInputed"]);

const condition: Ref<string> = ref("");

const onTypeInputed = () => {
  emits("typeInputed", condition.value);
};
</script>

<style scoped>
</style>