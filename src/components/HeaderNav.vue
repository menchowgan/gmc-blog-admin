<template>
  <div class="header-nav">
    <p
      v-for="item in types"
      :key="item.value"
      @click="() => selectedType(item.value)"
    >
      <span>{{ item.label }}</span>
    </p>
  </div>
</template>

<script setup lang="ts">
import { defineEmits } from "@vue/runtime-core";
const emits = defineEmits(["type-selected"]);
const types = [
  {
    label: "技术博客",
    value: "TEC_BLOG",
  },
  {
    label: "日常生活",
    value: "DAILY_LIFE",
  },
  {
    label: "兴趣分享",
    value: "HOBBY_SHARE",
  },
  {
    label: "音乐相关",
    value: "MUSIC_ABOUT",
  },
];

const selectedType = (type: string) => {
  emits("type-selected", type);
};
</script>

<style scoped lang="scss">
@import "../style/animation.scss";
@import "../style/theme.scss";

.header-nav {
  width: 99%;
  height: 100%;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  border-radius: 10px;
  border: 1px solid $theme-color;
  box-shadow: var(--el-box-shadow);
  p {
    height: 100%;
    flex: 1;
    color: $theme-color;
    font-size: 24px;
    background-color: #6e6e6e;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    border-radius: 10px;
    &:hover {
      background-color: $theme-color;
      color: #6e6e6e;
      animation: bounce 0.5s;
      border: 5px solid #6e6e6e;
      border-radius: 32px;
      transform: rotateZ(-10deg) scale(1.2);
      cursor: pointer;
    }
    span {
      line-height: 90px;
    }
  }
}
</style>
