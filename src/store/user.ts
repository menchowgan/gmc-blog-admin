import { ref, computed } from "vue"
import { defineStore } from 'pinia';
import { UserModel, PhotoModel } from "../utils/interfaces"
import { UserManager } from "@/utils/managers"

const userManager = new UserManager()

export const useUserInfoStore = defineStore("userinfo", () => {
  const userInfo = ref<UserModel>({})

  const getUserInfo = async () => {
    const info = await userManager.getSimpleInfo()
    if (info) {
      userInfo.value = info as UserModel;
    }
  }

  const photos = computed(() => {
    let photos: PhotoModel[] = [];
    if (userInfo.value.photos && userInfo.value.photos.length) {
      userInfo.value.photos.forEach((item, index) => {
        if (index < 6) {
          photos.push(item);
        }
      });
    }
    return photos
  })

  return {
    userInfo,
    getUserInfo,
    photos
  }
})