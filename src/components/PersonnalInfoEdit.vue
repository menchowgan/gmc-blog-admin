<template>
  <div class="personnal-info-edit">
    <el-form :model="form" label-width="120px">
      <el-form-item label="昵称">
        <el-input v-model="nickname" />
      </el-form-item>
      <el-form-item label="性别">
        <el-select v-model="gender" placeholder="">
          <el-option label="男" value="m" />
          <el-option label="女" value="f" />
        </el-select>
      </el-form-item>
      <el-form-item label="兴趣">
        <el-tag
          v-for="tag in hobbies"
          :key="tag"
          class="mx-1"
          closable
          :disable-transitions="false"
          @close="handleClose(tag)"
        >
          {{ tag }}
        </el-tag>
        <el-input
          v-if="inputVisible"
          ref="InputRef"
          v-model="inputValue"
          class="ml-1 w-20"
          size="small"
          @keyup.enter="handleInputConfirm"
          @blur="handleInputConfirm"
        />
        <el-button v-else class="button-new-tag ml-1" size="small" @click="showInput">
          + New Tag
        </el-button>
      </el-form-item>
      <el-form-item label="简介">
        <el-input v-model="brief" type="textarea" />
      </el-form-item>
      <el-form-item label="头像">
        <el-upload
          class="avatar-uploader"
          :action="`/photo/avatar/upload/${props.userid}`"
          :show-file-list="true"
          :on-success="handleAvatarSuccess"
          :before-upload="beforeAvatarUpload"
        >
          <img v-if="imageUrl" :src="imageUrl" class="avatar" />
          <el-icon v-else class="avatar-uploader-icon"><Plus /></el-icon>
        </el-upload>
      </el-form-item>
      <el-form-item label="是否新增用户">
        <el-switch v-model="isAdd" class="ml-2" active-color="#3fc7f5" />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onSubmit">创建</el-button>
        <el-button>取消</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script lang="ts" setup>
import { reactive, ref, watchEffect, onActivated, toRefs, onMounted } from "vue";
import { nextTick } from "@vue/runtime-core";
import { UserModel } from "../utils/interfaces/index";
import type { ElInput } from "element-plus";
import type { UploadProps } from "element-plus";
import { ElMessage } from "element-plus";
import { Plus } from "@element-plus/icons-vue";
import { useUserInfoStore } from "@/store";
import { UserManager } from "@/utils/managers";

const props = defineProps({
  userid: {
    type: Number,
  },
});

const userStore = useUserInfoStore();
const InputRef = ref<InstanceType<typeof ElInput>>();
const hobbies = ref<string[]>([]);

const form = reactive<UserModel>({
  nickname: "",
  gender: "",
  hobbies: "",
  avatar: "",
  brief: "",
});

const { nickname, gender, brief } = toRefs(form);

const isAdd = ref<boolean>(false);
const inputValue = ref("");
const inputVisible = ref(false);
const imageUrl = ref<string>("");

const userManager = new UserManager();

watchEffect(() => {
  if (!isAdd.value) {
    form.id = (userStore.userInfo as UserModel).id;
    console.log("is update", form.id);
  } else {
    form.id = undefined;
  }
});

onActivated(async () => {
  const info = await userManager.getInfo(UserManager.USER_ID);
  if (info) {
    form.id = info.id;
    form.nickname = info.nickname;
    form.gender = info.gender;
    form.hobbies = info.hobbies;
    if (form.hobbies) {
      hobbies.value = form.hobbies.split(",");
    }
    let avatarPath = info.avatar?.split("/") as Array<string>;
    form.avatar = avatarPath[avatarPath?.length - 1] as string;
    imageUrl.value = info.avatar as string;
    form.brief = info.brief;
  }
});

const handleClose = (tag: string) => {
  hobbies.value.splice(hobbies.value.indexOf(tag), 1);
};
const handleInputConfirm = () => {
  if (inputValue.value) {
    hobbies.value.push(inputValue.value);
  }
  inputVisible.value = false;
  inputValue.value = "";
};

const showInput = () => {
  inputVisible.value = true;
  nextTick(() => {
    InputRef.value!.input!.focus();
  });
};

const onSubmit = async () => {
  console.log("form data", form);
  form.hobbies = hobbies.value.join(",");
  const success = await userManager.infoPost({ ...form });
  if (success) {
    const userStore = useUserInfoStore();
    userStore.getUserInfo();
    ElMessage.success("用户信息上传成功");
  }
};

const handleAvatarSuccess: UploadProps["onSuccess"] = (response, uploadFile) => {
  imageUrl.value = URL.createObjectURL(uploadFile.raw!);
  console.log("image url", response);
  if (response.code === 200) {
    form.avatar = response.data;
    ElMessage.success("用户头像图片上传成功");
  } else if (response.code === 900) {
    ElMessage.error(response.message);
  }
};

const beforeAvatarUpload: UploadProps["beforeUpload"] = (rawFile) => {
  console.log("rawFILE", rawFile);

  if (!["image/jpeg", "images/jpg", "image/png"].includes(rawFile.type)) {
    ElMessage.error("Avatar picture must be JPG or JPEG OR PNG format!");
    return false;
  } else if (rawFile.size / 1024 / 1024 > 2) {
    return false;
  }
  return true;
};
</script>

<style lang="scss" scoped>
@import "../style/flex-style.scss";
@import "../style/theme.scss";

.personnal-info-edit {
  width: 100%;
  height: 100%;
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
