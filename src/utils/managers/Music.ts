import { request } from '@/utils/http';
import { MusicModel } from "../interfaces"

export default class MusicManager {
  constructor() { }

  /**
   * musicInfoUpload
   */
  public async musicInfoUpload(params: MusicModel): Promise<boolean> {
    try {
      const res = await request("MUSIC_USER_UPLOAD", params);
      console.log("user music info post", res);
      if (res.code === 0) {
        return true
      }
      return false
    } catch (e) {
      return false
    }
  }
}