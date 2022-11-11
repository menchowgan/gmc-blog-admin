<template>
  <div class="article-card">
    <NoData v-if="length === 0" />
    <el-card
      shadow="hover"
      class="card"
      :body-style="{ height: '96%', width: '100%' }"
      v-for="item in (articleSimpleInfos as ArticleSimpleInfoModel[])"
      :key="item.id"
      @click="() => toArticleInfo(item.id as number)"
    >
      <div class="content flex row">
        <el-image fit="cover" :src="item.imgUrl" class="image" />
        <div class="section flex column">
          <span class="title">{{ item.title }}</span>
          <p style="text-align: left">{{ item.brief }}</p>
          <el-button type="text" class="button"> Read More </el-button>
        </div>
      </div>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, watchEffect } from "vue"
import { useRouter } from "vue-router";
import { ArticleSimpleInfoModel } from "../utils/interfaces/index";
import NoData from "./common/NoData.vue";
const router = useRouter()

const length = ref<number>(0)

const props = defineProps({
  articleSimpleInfos: {
    type: Array,
    default: () => ([]),
  },
});

watchEffect(() => {
  length.value = props.articleSimpleInfos?.length || 0
})

const toArticleInfo = (id: number) => {
  router.push({
    name: "ArticleInfo",
    params: {
      articleId: id
    }
  })
}

const content = (content: string): string => {
  return content.substring(0, 200);
};
</script>

<style scoped lang="scss">
@import "../style/theme.scss";
@import "../style/flex-style.scss";
.article-card {
  width: 99%;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  .card {
    width: 100%;
    height: 360px;
    margin-top: 20px;
    border-radius: 20px;
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    &:hover {
      cursor: pointer;
    }
    .content {
      width: 100%;
      height: 96%;
      justify-content: flex-start;
      align-items: flex-start;
      .image {
        flex: 1;
        display: block;
        height: 86%;
        margin-top: 30px;
        border-radius: 16px;
        border: 1px solid $theme-color;
      }
      .section {
        flex: 3;
        height: 100%;
        padding: 14px;
        justify-content: space-between;
        align-items: flex-end;
        .title {
          flex: 1;
          font-size: 30px;
          &:hover {
            @include hover-style;
          }
        }
        p {
          flex: 5;
          font-size: 24px;
          color: #999;
          margin-top: 13px;
          margin-left: 13px;
          &:hover {
            @include hover-style;
          }
        }
        .button {
          flex: 1;
          color: $theme-color;
        }
      }
    }
  }
}
</style>
