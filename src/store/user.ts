import { defineStore } from 'pinia';
import { UserModel, PhotoModel } from "../utils/interfaces"
import { UserManager } from "@/utils/managers"

const userManager = new UserManager()

export const useUserInfoStore = defineStore("userinfo", {
  state: () => ({
    userInfo: {} as UserModel
  }),
  actions: {
    async getUserInfo() {
      const info = await userManager.getSimpleInfo()
      if (info) {
        this.userInfo = info as UserModel;
      }
    }
  },
  getters: {
    photos() {
      let photos: PhotoModel[] = [];
      if (this.userInfo.photos && this.userInfo.photos.length) {
        this.userInfo.photos.forEach((item, index) => {
          if (index < 6) {
            photos.push(item);
          }
        });
      }
      return photos
    }
  }
})