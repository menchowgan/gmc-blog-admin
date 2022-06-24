import { request } from '@/utils/http';
import { ArticleSimpleInfoModel } from "../interfaces"

export default class ArticleManager {
  constructor() { }

  /**
   * queryById
   */
  public async queryById(articleId: string): Promise<ArticleSimpleInfoModel | null> {
    try {
      const res = await request("ARTICLE_QUERY", articleId);
      if (res.code === 200) {
        return res?.data
      }
      return null
    } catch(e) {
      return null
    }
  }

  public async queryByType(
    userid: number,
    type: string): Promise<Array<ArticleSimpleInfoModel>> {
    try {
      const res = await request(
        "ARTICLE_QUERY_BY_TYPE",
        `${userid}/${type}`
      );
      if (res.code === 200) {
        return res.data;
      }
      return []
    } catch (e) {
      return []
    }
  }

  public async articleUpload(params: ArticleSimpleInfoModel): Promise<boolean> {
    try {
      const res = await request("ARTICLE_UPLOAD", params);
      if (res.code === 0) {
        return true
      } else {
        return false
      }
    } catch (e) {
      return false
    }
  }
}