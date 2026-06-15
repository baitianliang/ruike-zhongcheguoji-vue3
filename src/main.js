import { createApp } from 'vue'
import 'element-plus/dist/index.css'
import ElementPlus from 'element-plus'
import zhCn from 'element-plus/es/locale/lang/zh-cn'
import './element-variables.scss'
import App from './App.vue'
import router from './router'
import { createPinia } from 'pinia'
// import './utils/i18n.js'
import { i18nPlugin } from './utils/i18n.js'
import autoScrollDirective from './api/autoScroll'

const app = createApp(App)
const pinia = createPinia()

app.use(ElementPlus, {
  locale: zhCn,
})
app.use(router)
app.use(pinia)
app.use(i18nPlugin)
app.directive('auto-scroll', autoScrollDirective)
app.mount('#app')


function setRem() {
  if(window.location.href.indexOf('/customTable') > -1) return;
  const baseSize = 16 // 基准大小
  const designWidth = 1920 // 设计稿宽度
  const currentWidth = Math.min(document.documentElement.clientWidth, 1920)
  const rem = (currentWidth / designWidth) * baseSize
  document.documentElement.style.fontSize = rem + 'px'
}
window.addEventListener('resize', setRem) // 监听窗口变化
setRem() // 初始化
