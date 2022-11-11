<template>
  <div class="images">
    <el-image
      v-for="item in (photos as Array<PhotoModel>)"
      :key="item.id"
      :src="item.url"
      fit="cover"
      @click="() => toPhotos({url: item.url, id: item.id})"
    />
  </div>
</template>

<script setup lang="ts">
import { PhotoModel } from "../utils/interfaces/index"

const emits = defineEmits(['toPhotos'])

defineProps({
  photos: {
    type: Array,
    default: () => []
  }
})

const toPhotos = (photo: PhotoModel) => {
  emits("toPhotos", photo)
}

</script>

<style scoped lang="scss">
.images {
  width: 100%;
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  flex-wrap: wrap;
  .el-image {
    width: 6vw;
    height: 6vw;
    margin-left: 35px; 
    margin-bottom: 30px;
    border-radius: 10px;
    border: 1px solid #eee;
    &:hover {
      animation: bounce 0.5s;
      transform: scale(1.5);
      cursor: pointer;
    }
    @media screen and (min-width: 1500px) {
      width: 3vw;
      height: 3vw;
    }
  }
}

@keyframes bounce {
  0% {
    transform: scale(1);
  }
  100% {
    transform: scale(1.5);
  }
}
</style>