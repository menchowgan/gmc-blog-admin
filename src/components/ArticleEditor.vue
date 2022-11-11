<template>
  <div class="article-editor">
    <el-form :model="article" label-width="80px">
      <el-form-item label="标题：">
        <el-input placeholder="请输入标题" v-model="article.title" />
      </el-form-item>
      <el-form-item label="性别：">
        <el-select :multiple="true" v-model="typeSelected" placeholder="请选择类型">
          <el-option
            v-for="opt in (options as OptModel)"
            :key="opt.value"
            :label="opt.label"
            :value="`${opt.label}_${opt.value}`"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="封面：">
        <el-upload
          class="avatar-uploader"
          :action="`/article/avatar/upload/${userid}`"
          :show-file-list="true"
          :on-success="handleArticleAvatarSuccess"
          :before-upload="beforeArticleAvatarUpload"
        >
          <img v-if="imageUrl" :src="imageUrl" class="avatar" />
          <el-icon v-else class="avatar-uploader-icon"><Plus /></el-icon>
        </el-upload>
      </el-form-item>
      <el-form-item label="摘要">
        <el-input v-model="article.brief" :rows="5" type="textarea" />
      </el-form-item>
    </el-form>
    <Toolbar
      class="toolbar"
      :editor="editorRef"
      :defaultConfig="toolbarConfig"
      :mode="mode"
    />
    <Editor
      class="editor"
      style="height: 900px; overflow-y: hidden"
      v-model="valueHtml"
      :defaultConfig="editorConfig"
      :mode="mode"
      @onCreated="handleCreated"
    />
    <el-row>
      <el-col :span="24" style="margin-top: 20px">
        <el-button class="submit-btn" type="primary" @click="onSubmit"> 提交 </el-button>
        <el-button class="cancel-btn" @click="onCancel"> 取消 </el-button>
      </el-col>
    </el-row>
  </div>
</template>

<script setup lang="ts">
import "@wangeditor/editor/dist/css/style.css"; // 引入 css

import { onBeforeUnmount, ref, shallowRef, onMounted, onActivated } from "vue";
import { Editor, Toolbar } from "@wangeditor/editor-for-vue";
import { IEditorConfig } from "@wangeditor/core";
import { useUserInfoStore } from "@/store";
import { UserModel, ArticleSimpleInfoModel } from "../utils/interfaces/index";
import { ElMessage, ElMessageBox } from "element-plus";
import type { UploadProps } from "element-plus";
import { ArticleManager } from "@/utils/managers";
import { useRoute } from "vue-router";
import { GMessage } from "@/plugins";

const route = useRoute();

type OptModel = Array<{ label: string; value: string }>;

const options: OptModel = [
  { label: "旅游 Travel", value: "REAVEL" },
  { label: "日常 Daily", value: "DAILY_LIFE" },
  { label: "技术博客 Tec", value: "TEC_BLOG" },
  { label: "工作计划 Plan", value: "JOB_PLAN" },
  { label: "音乐分享 Music Sharing", value: "MUSIC_SHARE" },
  { label: "游戏趣谈 Game Gossip", value: "GAME_GOSSIP" },
];

const articleManager = new ArticleManager();

const typeSelected = ref<Array<string>>([]);
const userStore = useUserInfoStore();
const article = ref<ArticleSimpleInfoModel>({});
// 编辑器实例，必须用 shallowRef
const editorRef = shallowRef();
const userid = ref<number>((userStore.userInfo as UserModel)?.id as number);
const mode = ref<string>("default");
const imageUrl = ref<string>("");
// 内容 HTML
const valueHtml = ref("<p> 无内容 </p>");

const onSubmit = () => {
  ElMessageBox.confirm("确定要提交这次修改吗?", "提示", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning",
    center: true,
    draggable: true,
  })
    .then(async () => {
      article.value.type = typeSelected.value?.join(";");
      article.value.content = valueHtml.value;
      article.value.userId = userid.value;
      if (article.value.imgUrl?.startsWith("http")) {
        let imgUrl = (article.value.imgUrl as string).split("/");
        article.value.imgUrl = imgUrl[imgUrl.length - 1];
      }
      console.log("editor value: ", valueHtml.value, article);
      const success = await articleManager.articleUpload({ ...article.value });
      if (success) {
        ElMessage.success("更新成功");
      }
    })
    .catch(() => {
      ElMessage({
        type: "info",
        message: "已取消",
      });
    });
};

const onCancel = () => {
  ElMessageBox.confirm("确定要取消这次修改吗?", "提示", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning",
    center: true,
    draggable: true,
  })
    .then(() => {
      article.value = {};
      typeSelected.value = [];
      valueHtml.value = "<p> 无内容 </p>";
      imageUrl.value = "";
    })
    .catch(() => {
      ElMessage({
        type: "info",
        message: "已取消",
      });
    });
};

// 模拟 ajax 异步获取内容
onMounted(() => {});

onActivated(async () => {
  if (route.params.articleId && Number(route.params.articleId) > 0) {
    const data = await articleManager.queryById(route.params.articleId as string);
    if (data) {
      imageUrl.value = data.imgUrl as string;
      valueHtml.value = data.content as string;
      article.value.id = data.id;
      article.value.brief = data.brief;
      article.value.title = data.title;
      article.value.created_at = data.created_at;
      if (data.imgUrl) {
        let url = data.imgUrl.split("/");
        article.value.imgUrl = data.imgUrl ? url[url.length - 1] : "";
      }
      typeSelected.value = data.type?.split(";") as string[];
    }
  }
});

const toolbarConfig = {};
const editorConfig: Partial<IEditorConfig> = {
  placeholder: "请输入内容...",
  MENU_CONF: {
    uploadImage: {
      server: `/article/photo/upload/${(userStore.userInfo as UserModel)?.id}`,
      // 上传之前触发
      onBeforeUpload(file: any) {
        return file;
      },
      // 上传进度的回调函数
      onProgress(progress: number) {
        // progress 是 0-100 的数字
        console.log("progress", progress);
        GMessage(`图片上传进度:${progress}%`, {
          type: "success"
        })
      },
      // 单个文件上传成功之后
      onSuccess(file: File, res: any) {
        console.log(`${file.name} 上传成功`, res);
        GMessage(`上传成功:${file.name}`, {
          type: "success"
        })
      },
      // 单个文件上传失败
      onFailed(file: File, res: any) {
        console.log(`${file.name} 上传失败`, res);
        GMessage(`${file.name} 上传失败`, {
          type: "error"
        })
      },
      // 上传错误，或者触发 timeout 超时
      onError(file: File, err: any, res: any) {
        console.log(`${file.name} 上传出错`, err, res);
      },
    },
    uploadVideo: {
      server: `/article/video/upload/${(userStore.userInfo as UserModel)?.id}`,
      timeout: 15 * 1000,
      maxFileSize: 5 * 1024 * 1024 * 1024,
      // 上传之前触发
      onBeforeUpload(file: any) {
        // file 选中的文件，格式如 { key: file }
        return file;

        // 可以 return
        // 1. return file 或者 new 一个 file ，接下来将上传
        // 2. return false ，不上传这个 file
      },
      // 上传进度的回调函数
      onProgress(progress: number) {
        // progress 是 0-100 的数字
        console.log("progress", progress);
        GMessage(`图片上传进度:${progress}%`, {
          type: "success"
        })
      },
      // 单个文件上传成功之后
      onSuccess(file: File, res: any) {
        console.log(`${file.name} 上传成功`, res);
        GMessage(`上传成功:${file.name}`, {
          type: "success"
        })
      },
      // 单个文件上传失败
      onFailed(file: File, res: any) {
        console.log(`${file.name} 上传失败`, res);
        GMessage(`${file.name} 上传失败`, {
          type: "error"
        })
      },
      // 上传错误，或者触发 timeout 超时
      onError(file: File, err: any, res: any) {
        console.log(`${file.name} 上传出错`, err, res);
        GMessage(`${file.name} 上传出错`, {
          type: "error"
        })
      },
    },
  },
};

// 组件销毁时，也及时销毁编辑器
onBeforeUnmount(() => {
  const editor = editorRef.value;
  if (editor == null) return;
  editor.destroy();
});

const handleCreated = (editor: any) => {
  editorRef.value = editor; // 记录 editor 实例，重要！
};

const handleArticleAvatarSuccess: UploadProps["onSuccess"] = (response, uploadFile) => {
  imageUrl.value = URL.createObjectURL(uploadFile.raw!);
  console.log("image url", response);
  if (response.errno === 0) {
    article.value.imgUrl = response.data.href;
    console.log("article image url: ", article.value.imgUrl);
  } else if (response.code === 900) {
    ElMessage.error(response.message);
  }
};

const beforeArticleAvatarUpload: UploadProps["beforeUpload"] = (rawFile) => {
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
@import "../style/theme.scss";

.article-editor {
  padding: 10px;
  background-color: white;
  .toolbar {
    border: 1px solid #eee;
  }
  .editor {
    border: 1px solid #eee;
  }
  .submit-btn {
    background-color: $theme-color;
    border-color: $theme-color;
  }
  .cancel-btn {
    &:hover {
      color: $theme-color;
      border-color: $theme-color;
    }
  }

  .el-icon.avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 178px;
    height: 178px;
    margin-left: 10px;
    text-align: center;
    border: 1px solid #eee;
  }
}
</style>
