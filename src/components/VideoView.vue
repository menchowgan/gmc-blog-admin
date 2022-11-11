<template>
  <div class="video-view flex column">
    <el-card
      shadow="hover"
      class="card flex row"
      :body-style="{ height: '96%', width: '100%' }"
      v-for="(item, index) in videoInfos"
      :key="item.id"
    >
      <div class="content flex row">
        <el-avatar :size="250" :src="item.avatar" shape="square" class="image" />
        <div class="section flex column">
          <span class="title"
            >{{ item.title }} <span class="artist"> - {{ item.artist }} </span>
          </span>
          <video id="myVideo" controls>
            <source :src="item.videoUrl" type="video/mp4">
            您的浏览器不支持Video标签。
          </video>
          <div class="evaluation"><span>评价：</span> {{ item.evalution }}</div>
        </div>
      </div>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, watchEffect } from "vue";
import { VideoModel } from "../utils/interfaces/index";

let videourl = ref<string>("")

const props = defineProps({
  videos: {
    type: Array,
    default: () => [],
  },
});

const videoInfos = ref<VideoModel[]>([]);

watchEffect(() => {
  videoInfos.value = props.videos as VideoModel[];
});

const curMusicStateChanged = (cur: { idx: number; paused: boolean }) => {
  videoInfos.value.forEach((info, index) => {
    if (cur.idx === index) {
      info.paused = cur.paused;
    } else {
      info.paused = true;
    }
  });
};

const setRotate = (state: { idx: number; pause: boolean }) => {
  videoInfos.value[state.idx].paused = state.pause;
};

const onPlay = (url: string) => {
  console.log("video url: ", url);
  (document.getElementById("myVideo") as any).src = url
};
</script>

<style lang="scss" scoped>
@import "../style/flex-style.scss";
@import "../style/theme.scss";

.video-view {
  width: 99%;
  margin-top: 5px;
  justify-content: flex-start;
  align-items: center;
  border-radius: 10px;
  box-shadow: var(--el-box-shadow);
  .card {
    width: 98%;
    margin-top: 10px;
    margin-bottom: 20px;
    border-radius: 20px;
    justify-content: center;
    align-items: flex-start;
    .content {
      width: 100%;
      height: 96%;
      justify-content: flex-start;
      align-items: flex-start;
      .section {
        width: 74%;
        height: 100%;
        padding: 14px;
        justify-content: center;
        align-items: flex-start;
        .title {
          flex: 1;
          font-size: 36px;
          margin-bottom: 20px;
          margin-left: 30px;
          &:hover {
            @include hover-style;
          }
          .artist {
            font-size: 34px;
            color: $theme-color;
          }
        }
        .evaluation {
          flex: 5;
          margin-left: 30px;
          margin-bottom: 20px;
          margin-top: 20px;
          color: #aaa;
          font-size: 24px;
          span {
            font-size: 32px;
            color: $theme-color;
          }
        }
        #myVideo {
          flex: 8;
          width: 100%;
          margin-left: 30px;
        }
      }
      .image {
        margin-top: 20px;
        margin-left: 20px;
        border-radius: 15px;
        border: 5px solid $theme-color;
        box-shadow: var(--el-box-shadow);
        &:hover {
          cursor: pointer;
        }
      }
    }
  }
}

.fade-enter-active {
  &,
  .fade-leave-active {
    transition: opacity 0.5s ease;
  }
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
