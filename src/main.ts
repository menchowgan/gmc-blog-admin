import { createApp } from 'vue'
import App from './App.vue'
import { createPinia } from "pinia"
import router from "./router/index"
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'

import { Axios } from "./utils/http/index"

const app = createApp(App)

for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component)
}

app.use(createPinia())
  .use(router)
  .use(Axios)
  .use(ElementPlus)
  .mount('#app')