<template>
  <div class="video-info-edit">
    <el-form :model="videoForm" label-width="120px">
      <el-form-item label="名称">
        <el-input v-model="title" />
      </el-form-item>
      <el-form-item label="创建者">
        <el-input v-model="artist" />
      </el-form-item>
      <el-form-item label="视频">
        <el-upload
          class="avatar-uploader"
          :action="`/video/cover/upload/${userid}`"
          :show-file-list="true"
          :on-success="handleCoverSuccess"
        >
          <p>picture</p>
          <img v-if="coverUrl" :src="coverUrl" class="avatar" />
          <el-icon class="avatar-uploader-icon"><Plus /></el-icon>
        </el-upload>
        <el-upload
          class="avatar-uploader"
          :action="`/video/upload/${userid}`"
          :show-file-list="true"
          :on-success="handleVideoSuccess"
        >
          <p>audio</p>
          <el-icon class="avatar-uploader-icon"><Plus /></el-icon>
        </el-upload>
      </el-form-item>
      <el-form-item label="评价">
        <el-input v-model="evalution" type="textarea" />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onVideoSubmit">创建</el-button>
        <el-button>取消</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref, toRefs } from "@vue/reactivity";
import { UserModel, VideoModel } from "../utils/interfaces/index";
import type { UploadProps } from "element-plus";
import { ElMessage } from "element-plus";
import { Plus } from "@element-plus/icons-vue";
import { useUserInfoStore } from "@/store";
import { VideoManager } from "@/utils/managers";

const userStore = useUserInfoStore();
const userid = ref<number>((userStore.userInfo as UserModel)?.id as number);
const coverUrl = ref<string>("");
const videoForm = reactive<VideoModel>({
  title: "",
  avatar: "",
  videoUrl: "",
  artist: "",
  evalution: "太有意思了！",
});

const { title, artist, evalution } = toRefs(videoForm)

const emits = defineEmits(["refresh"]);

const videoManager = new VideoManager();

const handleCoverSuccess: UploadProps["onSuccess"] = (response, uploadFile) => {
  coverUrl.value = URL.createObjectURL(uploadFile.raw!);
  console.log("video avatar", response);
  if (response.code === 200) {
    videoForm.avatar = response.data;
    ElMessage.success("歌曲封面上传成功");
  } else if (response.code === 900) {
    ElMessage.error(response.message);
  }
};

const handleVideoSuccess: UploadProps["onSuccess"] = (response, uploadFile) => {
  console.log("video url", response);
  if (response.code === 200) {
    videoForm.videoUrl = response.data;
    ElMessage.success("视频上传成功");
  } else if (response.code === 900) {
    ElMessage.error(response.message);
  }
};

const onVideoSubmit = async () => {
  console.log("video form data", { ...videoForm });
  const success = await videoManager.uploadUserVideo({
    userId: userid.value,
    ...videoForm,
  });
  if (success) {
    ElMessage.success("视频上传成功");
    emits("refresh");
  }
};
</script>

<style lang="scss" scoped>
@import "../style/flex-style.scss";
@import "../style/theme.scss";
.video-info-edit {
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
