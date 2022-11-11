<template>
  <p class="art-title" :style="styleList">
    <span :style="artStyle">{{ content.h }}</span>
    <span :style="deputyTStyle">{{ content.t }}</span>
  </p>
</template>

<script setup lang="ts">
import { computed } from "@vue/runtime-core";

interface ArtStyleModel {
  fontSize?: number;
  fontFamily?: string;
  color?: string;
}

const props = defineProps({
  text: String,
  width: {
    type: Number,
    default: 60,
  },
  height: {
    type: Number,
    default: 100,
  },
  fontSize: {
    type: Number,
    default: 70,
  },
  fontFamily: {
    type: String
  },
  color: {
    type: String,
    default: "#ccc",
  },
  artFontSize: {
    type: Number,
    default: 80,
  },
  artColor: {
    type: String,
    default: "#3fc7f5",
  },
  artFamily: String,
  deputyFontStyle: Object,
});

const styleList = computed(() => ({
  width: props.width + "%",
  height: props.height + "px",
  "font-size": props.fontSize + "px",
  fontFamily: props.fontFamily,
  color: props.color,
}));

const artStyle = computed(() => ({
  "font-size": props.artFontSize + "px",
  color: props.artColor,
  "font-family": props.artFamily,
}));

const deputyTStyle = computed(() => {
  if(!props.deputyFontStyle){
    return {}
  }
  return {
    "font-size": (props.deputyFontStyle as ArtStyleModel).fontSize + "px",
    color: (props.deputyFontStyle as ArtStyleModel).color,
    "font-family": (props.deputyFontStyle as ArtStyleModel).fontFamily,
  };
});

const content = computed(() => {
  let [h, t] = ["", ""];
  if (props.text) {
    const index = props.text.indexOf(" ");
    h = props.text.substring(0, index);
    t = props.text.substring(index);
  }
  return {
    h,
    t,
  };
});
</script>

<style lang="scss" scoped>
@import "../style/animation.scss";
.art-title {
  &:hover {
    animation: text-scale 0.8s;
  }
}
@keyframes text-scale {
  0% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.2);
  }
  100% {
    transform: scale(1);
  }
}
</style>