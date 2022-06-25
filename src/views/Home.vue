<template>
  <div class="admin-container flex column">
    hello vite + vue3
  </div>
</template>

<script lang="ts" setup>
</script>

<style scoped lang="scss">
@import "../style/theme.scss";
@import "../style/flex-style.scss";

.admin-container {
  width: 100%;
  height: 100vh;
  justify-content: center;
  align-items: center;
  background-image: url("@/assets/images/background.webp");
  background-size:cover;
  background-attachment: fixed;
}
</style>