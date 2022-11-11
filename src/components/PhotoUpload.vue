<template>
  <div class="photo-upload flex column">
    <p>Pictures -- {{ title }}</p>
    <el-upload
      class="el-upload flex row"
      :action="`/photo/user/photos/upload/${userStore.userInfo.id}`"
      list-type="picture-card"
      :disabled="cannotUpload"
      :on-preview="handlePictureCardPreview"
      :before-remove="beforeRemove"
      :on-remove="handleRemove"
      :file-list="fileList"
    >
      <el-icon><Plus /></el-icon>
    </el-upload>

    <transition name="fade" mode="out-in">
      <div class="dialog flex row" @click="dialogVisible = false" v-if="dialogVisible">
        <img :src="dialogImageUrl" alt="Preview Image" />
      </div>
    </transition>
  </div>
</template>

<script setup lang="ts">
import { nextTick, ref, watch, watchEffect, onActivated, onMounted } from "vue";
import { Plus } from "@element-plus/icons-vue";
import { ElMessage, UploadProps, UploadUserFile, ElMessageBox } from "element-plus";
import { useUserInfoStore } from "@/store";
import { PhotosManager } from "@/utils/managers";

const props = defineProps({
  photoList: {
    type: Array,
    default: () => [],
  },
  curImgUrl: {
    type: String,
    default: "",
  },
  cannotUpload: {
    type: Boolean,
    default: false,
  },
  title: {
    type: String,
    default: "view",
  },
});


const userStore = useUserInfoStore();
const fileList = ref<UploadUserFile[]>([]);

const photosManager = new PhotosManager()

watchEffect(() => {
  fileList.value = props.photoList as UploadUserFile[];
});

onActivated(() => {
  fileList.value = (userStore.userInfo as any).photos as UploadUserFile[];
});

const dialogImageUrl = ref<string>("");
const dialogVisible = ref<boolean>(false);

watch(
  () => props.curImgUrl,
  (curImgUrl) => {
    if (curImgUrl) {
      dialogImageUrl.value = curImgUrl;
      nextTick(() => {
        dialogVisible.value = true;
      });
    }
  },
  {
    immediate: true
  }
);

const beforeRemove: UploadProps["beforeRemove"] = async (uploadFile, uploadFiles) => {
  return await new Promise<boolean>((resolve, reject) => {
    ElMessageBox.confirm("确定要删除这张图片吗?", "提示", {
      confirmButtonText: "确定",
      cancelButtonText: "取消",
      type: "warning",
      center: true,
      draggable: true,
    })
      .then(() => {
        resolve(true);
      })
      .catch(() => {
        ElMessage({
          type: "info",
          message: "已取消",
        });
        reject(false);
      });
  });
};

const handleRemove: UploadProps["onRemove"] = async (uploadFile, uploadFiles) => {
  console.log(uploadFile, uploadFiles);
  let params = uploadFile.url?.split("/") as Array<string>;
  let url = `${params[params?.length - 2]}/${params[params?.length - 1]}`;
  const success = await photosManager.deleteUserPhoto(url)
  if (success) {
    ElMessage.success("图片删除成功！");
  }
};

const handlePictureCardPreview: UploadProps["onPreview"] = (uploadFile) => {
  dialogImageUrl.value = uploadFile.url!;
  dialogVisible.value = true;
  console.log(uploadFile, fileList);
};
</script>

<style lang="scss" scoped>
@import "../style/flex-style.scss";
@import "../style/theme.scss";

.photo-upload {
  width: 99%;
  height: 900px;
  margin-top: 5px;
  justify-content: flex-start;
  align-items: flex-start;
  border-radius: 10px;
  box-shadow: var(--el-box-shadow);
  p {
    margin-left: 20px;
    font-size: 30px;
    color: $theme-color;
  }
  .el-upload {
    flex: 1;
    width: 96%;
    margin-top: 20px;
    margin-left: 20px;
    margin-right: 20px;
    justify-content: flex-start;
    align-items: flex-start;
    flex-wrap: wrap;
  }

  .dialog {
    position: absolute;
    top: 0;
    left: 0;
    z-index: 9999;
    width: 100%;
    height: 100%;
    justify-content: center;
    align-items: center;
    img {
      border: 2px solid $theme-color;
      box-shadow: var(--el-box-shadow);
    }
  }
}

.fade-enter-active {
  &,
  .fade-leave-active {
    transition: opacity 0.2s ease;
  }
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
