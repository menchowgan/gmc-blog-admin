<template>
  <div class="music-player flex column">
    <div class="player flex row">
      <el-icon v-if="paused" @click="() => onPlay()"><video-play /></el-icon>
      <el-icon v-else @click="() => onPause()"><video-pause /></el-icon>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "@vue/reactivity";
import { watch } from "@vue/runtime-core";
import { useAudioStore } from "@/store";
const no_ = ref(0)

const audioStore = useAudioStore()

const paused = ref<boolean>(true);

let player: HTMLAudioElement = document.getElementById(`player${audioStore.currentCount+1}`) as any;
if (!player) {
  const p = document.createElement("audio")
  p.id = `player${audioStore.currentCount+1}`
  p.controls = true
  p.style.opacity = "0"
  p.preload = "auto"
  p.loop = true
  p.innerHTML = "您的浏览器不支持audio"
  document.body.append(p)
  audioStore.add()
  no_.value = audioStore.currentCount
  player = p
}

const emits = defineEmits(["curMusicStateChanged", "shouldRotate"]);

const props = defineProps({
  music: {
    type: String,
    default: "",
  },
  shouldPaused: Boolean,
  musicIdx: Number,
});

if (audioStore.curidx === props.musicIdx) {
  paused.value = player.paused;
  emits("shouldRotate", {idx: props.musicIdx, pause: paused.value})
}

watch(
  () => props.shouldPaused,
  (pause: boolean) => {
    paused.value = pause;
  }
);

const onPlay = () => {
  player.src = props.music;
  if (player.paused) {
    try{
      player.play();
      paused.value = false;
      audioStore.curidx = props.musicIdx as number
      emits("curMusicStateChanged", {
        idx: props.musicIdx,
        paused: paused.value,
      });
    }catch(e){}
  }
};

const onPause = () => {
  try{
    player.pause();
    paused.value = true;
    audioStore.curidx = props.musicIdx as number
    emits("curMusicStateChanged", { idx: props.musicIdx, paused: paused.value });
  }catch(e){}
};

</script>

<style lang="scss" scoped>
@import "../../style/flex-style.scss";
@import "../../style/theme.scss";

.music-player {
  justify-content: flex-start;
  align-items: flex-start;
  .player {
    justify-content: flex-start;
    align-items: center;
    .el-icon {
      color: $theme-color;
      margin-left: 10px;
      margin-right: 20px;
      width: 56px;
      height: 56px;
      &:hover {
        cursor: pointer;
      }
      svg {
        width: 100%;
        height: 100%;
      }
    }
    .el-progress--line {
      width: 400px;
    }
  }
  audio {
    margin-top: 20px;
  }
}
</style>