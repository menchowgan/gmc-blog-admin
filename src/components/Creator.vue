<template>
  <el-tabs v-model="activeName" type="card" class="tabs">
    <el-tab-pane label="用户注册" name="PERSONNAL_INFO_EDIT">
      <PersonnalInfoEdit :userid="userid" />
    </el-tab-pane>
    <el-tab-pane label="文章创作" name="ARTICLE_EDIT">
      <ArticleEditor />
    </el-tab-pane>
    <el-tab-pane label="图片创作" name="PHOTO_EDIT">
      <PhotoUpload :photo-list="userStore.photos" />
    </el-tab-pane>
    <el-tab-pane label="音乐收藏" name="MUSIC_UPLOAD">
      <MusicUpload />
    </el-tab-pane>
    <el-tab-pane label="视频分享" name="VIDEO_EDIT">
      <VideoUpload />
    </el-tab-pane>
  </el-tabs>
</template>

<script setup lang="ts">
import { ref, watchEffect } from 'vue';
import ArticleEditor from "@/components/ArticleEditor.vue";
import PersonnalInfoEdit from "@/components/PersonnalInfoEdit.vue";
import PhotoUpload from "@/components/PhotoUpload.vue";
import MusicUpload from "@/components/MusicUpload.vue";
import VideoUpload from "@/components/VideoUpload.vue";
import { useUserInfoStore } from '@/store';
import { UserModel } from '@/utils/interfaces';

const userStore = useUserInfoStore()
const activeName = ref<string>("PERSONNAL_INFO_EDIT")
const userid = ref<number>((userStore.userInfo as UserModel).id as number)

const props = defineProps({
  defaultEdit: {
    type: String,
    default: "PERSONNAL_INFO_EDIT"
  }
})

watchEffect(() => {
  if (props.defaultEdit) {
    activeName.value = props.defaultEdit
  }
})

</script>

<style lang="scss" scoped>
.tabs {
  width: 100%;
  background-color: white;
  padding: 10px;
}
</style>