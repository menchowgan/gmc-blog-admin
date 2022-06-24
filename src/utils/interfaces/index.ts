interface ArticleSimpleInfoModel {
  id?: number
  userId?: number
  imgUrl?: string
  title?: string
  content?: string
  created_at?: string
  date?: string
  brief?: string 
  type?: string 
}

interface UserModel {
  id?: number
  nickname?: string
  gender?: string
  hobbies?: string
  fans?: number
  evaluate?: number
  brief?: string
  avatar?: string
  photos?: Array<PhotoModel>
  audios?: Array<MusicModel>
  videos?: Array<VideoModel>
  articleSimpleInfos?: Array<ArticleSimpleInfoModel>
}

interface PhotoModel {
  id: number
  url: string
}

interface MusicModel {
  id?: number
  userId?: string | number
  avatar?: string
  audioUrl?: string
  title?: string
  artist?: string
  evalution?: string
  paused?: boolean
}

interface VideoModel {
  id?: number
  userId?: string | number
  avatar?: string
  videoUrl?: string
  title?: string
  artist?: string
  evalution?: string
  paused?: boolean
}

export {
  ArticleSimpleInfoModel,
  UserModel,
  PhotoModel,
  MusicModel,
  VideoModel
}