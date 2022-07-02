import { defineStore } from 'pinia'

export const useAudioStore = defineStore("audio", {
  state: () => ({
    curidx: -1
  })
})