import { request } from '@/utils/http';
import { UserModel } from "../interfaces"

export default class UserManager {
  public static USER_ID = 12

  constructor() {
    
  }

  public getUserId() { 
    return localStorage.getItem("myblog-userid")
  }

  public setUserId(id: number) {
    localStorage.setItem("myblog-userid", String(id))
  }

  public async searchById(id: number): Promise<UserModel | null> {
    try {
      const res = await request("SEARCH_USER_BRIEF", id);
      if (res && res.data) {
        console.log("res", res);
        return res.data;
      }
      return null
    } catch (e) {
      return null
    }
  }

  public async getSimpleInfo(): Promise<UserModel | null> {
    try {
      const res = await request("GET_USER_SIMPLE_INFO", UserManager.USER_ID)
      if (res && res.data) {
        return res.data
      }
      return null
    } catch (e) {
      return null
    }
  }

  /**
   * infoPost
   */
  public async infoPost(info: UserModel): Promise<boolean> {
    try {
      const res = await request("POST_USER_INFO", {
        ...info,
      });
      console.log("user info post", res);
      if (res.code === 0) {
        return true
      }
      return false
    } catch (e) {
      return false
    }
  }

  /**
   * getInfo
   */
  public async getInfo(userid: number): Promise<UserModel | null> {
    try {
      const res = await request("GET_INFO", userid)
      console.log("get info: ", res);
      if (res.code === 200) {
        if (res.data) {
          return res.data
        }
      }
      return null
    } catch (e) {
      return null
    }
  }
}