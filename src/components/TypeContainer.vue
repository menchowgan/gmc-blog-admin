<template>
  <spa class="type-container">{{typeName}}</spa>
</template>

<script setup lang="ts">
defineProps({
  typeName: {
    type: String
  }
})
</script>

<style scoped>
.type-container{
  padding: 10px;
  background-color: aquamarine;
  border-radius: 3px;
  font-size: 20px;
}
</style>