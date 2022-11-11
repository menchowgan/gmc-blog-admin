<template>
  <div class="music-info-edit">
    <el-form :model="musicForm" label-width="120px">
      <el-form-item label="歌名">
        <el-input v-model="title" />
      </el-form-item>
      <el-form-item label="艺术家">
        <el-input v-model="artist" />
      </el-form-item>
      <el-form-item label="音乐">
        <el-upload
          class="avatar-uploader"
          :action="`/music/cover/upload/${userStore.userInfo.id}`"
          :show-file-list="true"
          :on-success="handleCoverSuccess"
        >
          <p>picture</p>
          <img v-if="coverUrl" :src="coverUrl" class="avatar" />
          <el-icon class="avatar-uploader-icon"><Plus /></el-icon>
        </el-upload>
        <el-upload
          class="avatar-uploader"
          :action="`/music/upload/${userStore.userInfo.id}`"
          :show-file-list="true"
          :on-success="handleMusicSuccess"
        >
          <p>audio</p>
          <el-icon class="avatar-uploader-icon"><Plus /></el-icon>
        </el-upload>
      </el-form-item>
      <el-form-item label="评价">
        <el-input v-model="evalution" type="textarea" />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onMusicSubmit">创建</el-button>
        <el-button>取消</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref, toRefs } from "vue";
import { MusicModel } from "../utils/interfaces/index";
import type { UploadProps } from "element-plus";
import { ElMessage } from "element-plus";
import { Plus } from "@element-plus/icons-vue";
import { MusicManager } from "@/utils/managers";
import { useUserInfoStore } from "@/store"

const userStore = useUserInfoStore()

const coverUrl = ref<string>("");

const musicForm = reactive<MusicModel>({
  title: "",
  avatar: "",
  audioUrl: "",
  artist: "",
  evalution: "太好听了！",
});

const { title, artist, evalution } = toRefs(musicForm)

const musicManager = new MusicManager();

const emits = defineEmits(["refresh"]);

const handleCoverSuccess: UploadProps["onSuccess"] = (response, uploadFile) => {
  coverUrl.value = URL.createObjectURL(uploadFile.raw!);
  console.log("music avatar", response);
  if (response.code === 200) {
    musicForm.avatar = response.data;
    ElMessage.success("歌曲封面上传成功");
  } else if (response.code === 900) {
    ElMessage.error(response.message);
  }
};

const handleMusicSuccess: UploadProps["onSuccess"] = (response, uploadFile) => {
  console.log("music url", response);
  if (response.code === 200) {
    musicForm.audioUrl = response.data;
    ElMessage.success("歌曲音频上传成功");
  } else if (response.code === 900) {
    ElMessage.error(response.message);
  }
};

const onMusicSubmit = async () => {
  console.log("music form data", { ...musicForm });
  const success = await musicManager.musicInfoUpload({
    userId: userStore.userInfo.id,
    ...musicForm,
  });
  if (success) {
    ElMessage.success("歌曲音频上传成功");
    emits("refresh");
  }
};
</script>

<style lang="scss" scoped>
@import "../style/flex-style.scss";
@import "../style/theme.scss";
.music-info-edit {
  width: 99%;
  padding-top: 5px;
  padding-bottom: 5px;
  justify-content: flex-start;
  align-items: flex-start;
  background-color: white;
  border-radius: 10px;
  box-shadow: var(--el-box-shadow);
  .el-form {
    font-size: 26px;
    margin-top: 30px;
    margin-left: 20px;
    margin-right: 20px;
    & ::v-deep .avatar-uploader {
      .el-upload {
        border: 1px dashed $theme-color;
        border-radius: 6px;
        cursor: pointer;
        position: relative;
        overflow: hidden;
        transition: var(--el-transition-duration-fast);
        &:hover {
          border-color: var(--el-color-primary);
        }
      }
    }
  }
}
.el-icon.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  margin-left: 10px;
  text-align: center;
  border: 1px solid #ccc;
}
</style>
