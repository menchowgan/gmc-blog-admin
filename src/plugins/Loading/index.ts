import Loading from "./components/Loading.vue"
import { createVNode, render } from "vue";

const div = document.createElement("div")

document.body.appendChild(div)

const oldvnode = createVNode(Loading, { loading: false })
render(oldvnode, div)

let timer: any = null

export default (loading: boolean, delay: number = 200) => {
  let newvnode = null
  if (!timer && delay) {
    timer = setTimeout(() => {
      newvnode = createVNode(Loading, { loading })
      clearTimeout(timer)
    }, delay)
  } else {
    newvnode = createVNode(Loading, { loading })
  }
  render(newvnode, div)
  div.style.display = "block"
  div.addEventListener("click", () => {
    div.style.display = "none"
  })
}