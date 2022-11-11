<template>
  <div class="admin flex column">
    <el-icon class="back-icon" @click="onBack"><arrow-left-bold /></el-icon>
    <div class="article-edit-cmp flex column">
      <div class="header flex column">
        <el-avatar :size="150" :src="circleUrl" />
        <ArtText :height="30" :font-size="32" :art-font-size="40" :text="nickname" />
      </div>
      <div class="body flex column">
        <Creator :defaultEdit="editPart" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import ArtText from "@/components/ArtText.vue";
import Creator from "@/components/Creator.vue";
import { ref, watchEffect } from "vue";
import { useUserInfoStore } from "@/store";
import { UserModel } from "@/utils/interfaces";
import { useRouter } from "vue-router";
const userStore = useUserInfoStore();

const router = useRouter()

const circleUrl = ref<string>("");
const nickname = ref<string>("");
const editPart = ref<string>("")

watchEffect(() => {
  circleUrl.value = (userStore.userInfo as UserModel).avatar as string;
  nickname.value = (userStore.userInfo as UserModel).nickname as string;
})

const onBack = () => {
  router.go(-1);
};

</script>

<style lang="scss" scoped>
@import "../../style/flex-style.scss";
@import "../../style/theme.scss";
.admin {
  width: 100vw;
  justify-content: center;
  align-items: center;
  .back-icon {
    width: 40px;
    height: 40px;
    border-radius: 20px;
    border: 2px solid $theme-color;
    color: $theme-color;
    position: absolute;
    top: 30px;
    left: 30px;
    box-shadow: var(--el-box-shadow);
    &:hover {
      border: 2px solid #ccc;
      color: #ccc;
      cursor: pointer;
    }
  }
  .article-edit-cmp {
    width: 100%;
    justify-content: center;
    align-items: center;
    .header {
      width: 80%;
      height: 350px;
      justify-content: center;
      align-items: center;
      .el-avatar {
        border: 10px solid $theme-color;
        box-shadow: var(--el-box-shadow);
      }
    }
    .body {
      width: 70%;
      height: 1800px;
      overflow: auto;
      justify-content: flex-start;
      background-image: url("../../assets/images/creaton_background.webp");
      .container {
        width: 100%;
        min-height: 100px;
        flex: 3;
        overflow: auto;
        justify-content: flex-start;
        align-items: center;
        background-color: #ccc;
        border-radius: 10px;
        box-shadow: var(--el-box-shadow-dark);
      }
    }
  }
}
</style>
