import { defineStore } from 'pinia'
import { ref, computed } from "vue"

export const useAudioStore = defineStore("audio", () => {
  const curidx = ref<number>(-1)
  const curCount = ref<number>(0)

  const add = () => {
    curCount.value++
  }

  const currentCount = computed(() => {
    return curCount.value
  })

  const $reset = () => {
    curidx.value = -1
    curCount.value = 0
  }

  return {
    curidx,
    curCount,
    add,
    currentCount,
    $reset
  }
})