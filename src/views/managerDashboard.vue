<template>
  <div class="manager-dashboard">
    <!-- Header -->
    <header class="animate-in">
      <div class="header-title">
        <h1 v-i18n="'Department Manager'">部门经理</h1>
        <p v-i18n="'welcome_message'">欢迎回来，查看您的今日概览</p>
      </div>
      <div class="header-actions">
        <div id="clock" class="clock-display">{{ currentTime }}</div>
        <LanguageSwitcher />
        <button 
          class="btn btn-outline"
          id="theme-toggle"
          title="切换主题"
          @click="toggleTheme"
          v-i18n="'switch_theme'"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="12" cy="12" r="5"></circle>
            <line x1="12" y1="1" x2="12" y2="3"></line>
            <line x1="12" y1="21" x2="12" y2="23"></line>
            <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
            <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
            <line x1="1" y1="12" x2="3" y2="12"></line>
            <line x1="21" y1="12" x2="23" y2="12"></line>
            <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
            <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
          </svg>
        </button>
      </div>
    </header>

    <!-- Top Stats -->
    <section class="stats-grid animate-in delay-1">
      <div class="card" style="cursor: pointer" @click="puPush('project_tasks')">
        <div class="stat-header">
          <div class="stat-label" v-i18n="'task_messages'">任务消息</div>
          <div class="stat-icon">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
            </svg>
          </div>
        </div>
        <div class="stat-value urgent">{{ baseForm.ZSL }}</div>
        <div class="stat-trend trend-up">
          <!-- <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <polyline points="23 6 13.5 15.5 8.5 10.5 1 18"></polyline>
            <polyline points="17 6 23 6 23 12"></polyline>
          </svg>
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <polyline points="23 18 13.5 8.5 8.5 13.5 1 6"></polyline>
            <polyline points="17 18 23 18 23 12"></polyline>
          </svg> -->
          <span v-i18n="'Vs. Yesterday'">Vs. Yesterday</span>
          <span> <span v-if="baseForm.RWZL > -1">+</span>{{ baseForm.RWZL }}</span>
        </div>
      </div>

      <div class="card">
        <div class="stat-header">
          <div class="stat-label" v-i18n="'pending_emails'">待处理邮件</div>
          <div class="stat-icon" style="background-color: #fff7ed; color: #ea580c;">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
              <polyline points="22,6 12,13 2,6"></polyline>
            </svg>
          </div>
        </div>
        <div 
          class="stat-value urgent" 
          :class="{ 'blink-anim': isEmailBlinking }"
          title="点击标记为已读/停止闪烁"
          v-i18n="'mark_read_stop_blink'"
          @click="markEmailAsRead"
        >
          0
        </div>
        <div class="stat-trend trend-neutral">
          <span v-i18n="'stat_trend_stable'">保持平稳</span>
        </div>
      </div>

      <div class="card">
        <div class="stat-header">
          <div class="stat-label" v-i18n="'Design Completion Rate'">设计完成度</div>
          <div class="stat-icon" style="background-color: #f0fdf4; color: #16a34a;">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M22 12h-4l-3 9L9 3l-3 9H2"></path>
            </svg>
          </div>
        </div>
        <div class="stat-value">{{ baseForm.JFWWCL }}</div>
        <div class="stat-trend trend-up">
          <!-- <span v-i18n="'status_excellent'">状态极佳</span> -->
        </div>
      </div>
    </section>

    <div class="main-content animate-in delay-2">
      <!-- Task List -->

      <!-- Upstream & Downstream Performance -->
      <div class="split-section">
        <section class="split-module">
          <div class="section-header">
            <h2 class="section-title" v-i18n="'team_performance'">团队成员表现</h2>
            <div class="search-wrapper" :class="{ active: isSearchActive }">
              <input 
                type="text" 
                class="search-input" 
                v-model="searchQuery"
                :placeholder="$t('search_placeholder_manager')"
                @focus="isSearchActive = true"
                v-i18n="'search_placeholder_manager'"
              />
              <svg 
                class="search-close" 
                @click="clearSearch" 
                width="16" 
                height="16" 
                viewBox="0 0 24 24" 
                fill="none" 
                stroke="currentColor" 
                stroke-width="2"
              >
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
              <button 
                class="btn btn-outline" 
                @click="toggleSearch"
                style="font-size: 12px; padding: 4px 12px; display: flex; align-items: center; gap: 4px;"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <circle cx="11" cy="11" r="8"></circle>
                  <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                </svg>
                <span v-i18n="'search'">搜索</span>
              </button>
            </div>
          </div>
          <div class="table-container">
            <table style="table-layout: fixed; width: 100%;">
              <thead>
                <tr>
                  <th v-i18n="'name'">name</th>
                  <th v-i18n="'Position'">Position</th>
                  <th v-i18n="'weekly_task_count'">本周任务数</th>
                  <th v-i18n="'Completed Count'">完成</th>
                  <th v-i18n="'Overdue Count'">延误</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="member in paginatedMembers" :key="member.id" style="cursor: pointer;" @click="showDetail(member)">
                  <td>
                    <div class="user-cell">
                      <!-- <div 
                        class="user-avatar" 
                        :style="member.color ? 'background-color: ' + member.color : ''"
                      >
                        {{ member.avatar }}
                      </div> -->
                      <span style="font-weight: 500;">{{ member.FZRXM }}</span>
                    </div>
                  </td>
                  <td>
                    <span 
                      class="status-badge" 
                      style="background-color: #f1f5f9; color: var(--text-secondary);"
                      v-i18n="member.RYGW"
                    >
                    </span>
                  </td>
                  <td style="font-weight: 600;">{{ member.BZRWSL }}</td>
                  <td style="color: #10b981;">{{ member.BZRWWCSL }}</td>
                  <td :style="member.YWSL > 0 ? 'color: #ef4444; font-weight: 600;' : 'color: var(--text-tertiary);'">
                    {{ member.YWSL }}
                  </td>
                </tr>
              </tbody>
            </table>
            <div class="pagination-controls" v-if="totalPages > 1">
              <button 
                class="page-btn" 
                @click="prevPage" 
                :disabled="currentPage === 1"
                v-i18n="'prev_page'"
              >
              </button>
              
              <button 
                v-for="page in totalPages" 
                :key="page"
                :class="['page-btn', { active: currentPage === page }]"
                @click="goToPage(page)"
              >
                {{ page }}
              </button>
              
              <button 
                class="page-btn" 
                @click="nextPage" 
                :disabled="currentPage === totalPages"
                v-i18n="'next_page'"
              >
              </button>
            </div>
          </div>
        </section>
        <section class="split-module">
          <div class="section-header">
            <h2 class="section-title" v-i18n="'Design Change Status'">设计变更情况</h2>
          </div>
          <table class="simple-table">
            <thead>
              <tr>
                <th v-i18n="'Change Topic'">变更主题</th>
                <th v-i18n="'Change Type'">变更类型</th>
                <th v-i18n="'Change Impact'">变更影响</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="item in designChangeList" :key="item.id">
                <td>{{ item.CRHK_DCA_BGZT }}</td>
                <td>{{ item.CRHK_DCA_BGLB }}</td>
                <td>{{ item.CRHK_DCA_BGYX }}</td>
              </tr>
            </tbody>
          </table>
        </section>
      </div>

      <div class="split-section">
        <section class="split-module">
          <div class="section-header">
            <h2 class="section-title" v-i18n="'upstream_performance'">上游表现</h2>
          </div>
          <table class="simple-table">
            <thead>
              <tr>
                <th v-i18n="'unit_name'">单位名</th>
                <th v-i18n="'task_count'">本周任务数</th>
                <th v-i18n="'Completed Count'">完成数</th>
                <th v-i18n="'completion_rate'">完成比例</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="item in upstreamData" :key="item.id">
                <td>{{ item.CRHK_DDLI_SYFDW }}</td>
                <td>{{ item.BZRWSL }}</td>
                <td>{{ item.BZRWWCSL }}</td>
                <td>
                  <div style="display: flex; align-items: center; gap: 8px;">
                    <div style="flex: 1; height: 6px; background: #e2e8f0; border-radius: 3px; width: 60px;">
                      <div :style="{ width: item.WCBL, height: '100%', background: '#6366f1', borderRadius: '3px' }"></div>
                    </div>
                    <span style="font-size: 12px;">{{ item.WCBL }}</span>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </section>
        <section class="split-module">
          <div class="section-header">
            <h2 class="section-title" v-i18n="'downstream_performance'">下游表现</h2>
          </div>
          <table class="simple-table">
            <thead>
              <tr>
                <th v-i18n="'unit_name'">单位名</th>
                <th v-i18n="'task_count'">本周任务数</th>
                <th v-i18n="'Completed Count'">完成数</th>
                <th v-i18n="'completion_rate'">完成比例</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="item in downstreamData" :key="item.id">
                <td>{{ item.DWM }}</td>
                <td>{{ item.BZRWSL }}</td>
                <td>{{ item.BZRWWCSL }}</td>
                <td>
                  <div style="display: flex; align-items: center; gap: 8px;">
                    <div style="flex: 1; height: 6px; background: #e2e8f0; border-radius: 3px; width: 60px;">
                      <div :style="{ width: item.WCBL, height: '100%', background: '#10b981', borderRadius: '3px' }"></div>
                    </div>
                    <span style="font-size: 12px;">{{ item.WCBL }}</span>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </section>
      </div>
    </div>

    <el-dialog
      v-model="dialogVisible"
      :title="getTrans('overdue_tasks')"
    >
      <section style="margin: 20px">
        <table class="simple-table">
          <thead>
            <tr>
              <th width="50">#</th>
              <th v-i18n="'task_name'">任务名称</th>
              <th v-i18n="'source'">来源</th>
              <th v-i18n="'deadline'">截止时间</th>
              <th v-i18n="'upstream'">上游方</th>
              <th v-i18n="'downstream'">下游方</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(item, index) in paginatedOverdueTasks" :key="index">
              <td style="color: #94a3b8">{{ index + 1 }}</td>
              <td style="cursor: pointer" @click="puPush({'设计交付物清单报工': 'uxddr', '输入清单报工': 'uxilowr'}[item.RWMC1])">
                <div style="font-weight: 500; color: #dc3545">{{ item.RWMC1 }}</div>
                <div style="font-size: 11px; color: #cbd5e1">{{ item.RWMC2 }}</div>
              </td>
              <td>
                <span :class="['status-badge', 'badge-design']">{{ item.source }}</span>
              </td>
              <td style="color: #dc3545">{{ item.JZRQ }}</td>
              <td>{{ item.SYF }}</td>
              <td style="color: #94a3b8">{{ item.XYF }}</td>
            </tr>
          </tbody>
        </table>
      </section>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, watch } from 'vue'
import LanguageSwitcher from '../components/LanguageSwitcher.vue';
import axios from "../assets/axios/base.js"

// 国际化处理函数
const $t = (key) => {
  // 这里保持原有的国际化逻辑
  // 在实际项目中，这里应该调用你的i18n库
  return key
}

// 响应式数据
const currentTime = ref('')
const searchQuery = ref('')
const isSearchActive = ref(false)
const currentPage = ref(1)
const selectedLanguage = ref('zh')

// 角色和单位映射
const roleMap = {
  '高级设计师': 'role_senior_designer',
  '后端专家': 'role_backend_expert',
  '数据库管理员': 'role_dba',
  'QA工程师': 'role_qa',
  '前端工程师': 'role_frontend',
  'DevOps': 'role_devops',
  '支付专家': 'role_payment',
  '安全顾问': 'role_security',
  '技术文档': 'role_tech_writer',
  '系统架构': 'role_architect'
}

const unitMap = {
  '产品部': 'unit_product',
  '设计组': 'unit_design',
  '架构组': 'unit_arch',
  '测试组': 'unit_test',
  '运维组': 'unit_ops',
  '客户方': 'unit_client'
}

// 团队数据
const teamMembers = ref([])

const designChangeList = ref([])

// 上下游数据
const upstreamData = ref([])

const downstreamData = ref([])

const ITEMS_PER_PAGE = 5

// 计算属性
const filteredMembers = computed(() => {
  if (!searchQuery.value) return teamMembers.value
  
  const query = searchQuery.value.toLowerCase()
  return teamMembers.value.filter(member => member.FZRXM.toLowerCase().includes(query))
})

const totalPages = computed(() => {
  return Math.ceil(filteredMembers.value.length / ITEMS_PER_PAGE)
})

const paginatedMembers = computed(() => {
  const start = (currentPage.value - 1) * ITEMS_PER_PAGE
  const end = start + ITEMS_PER_PAGE
  return filteredMembers.value.slice(start, end)
})

// 方法
function updateClock() {
  const now = new Date()
  const year = now.getFullYear()
  const month = String(now.getMonth() + 1).padStart(2, '0')
  const day = String(now.getDate()).padStart(2, '0')
  const hours = String(now.getHours()).padStart(2, '0')
  const minutes = String(now.getMinutes()).padStart(2, '0')
  
  // Format: YYYY-MM-DD HH:mm
  currentTime.value = `${year}-${month}-${day} ${hours}:${minutes}`
}

function toggleTheme() {
  const root = document.documentElement
  const currentTheme = root.getAttribute('data-theme')
  const newTheme = currentTheme === 'dark' ? 'light' : 'dark'
  
  root.setAttribute('data-theme', newTheme)
  localStorage.setItem('theme', newTheme)
  
  const svg = document.querySelector('#theme-toggle svg')
  if (svg) {
    svg.style.transform = 'rotate(360deg)'
    svg.style.transition = 'transform 0.5s ease'
    setTimeout(() => {
      svg.style.transform = 'none'
      svg.style.transition = 'none'
    }, 500)
  }
}

function toggleSearch() {
  isSearchActive.value = true
  const searchInput = document.querySelector('.search-input')
  if (searchInput) searchInput.focus()
}

function clearSearch() {
  searchQuery.value = ''
  isSearchActive.value = false
  currentPage.value = 1
}

function prevPage() {
  if (currentPage.value > 1) {
    currentPage.value--
  }
}

function nextPage() {
  if (currentPage.value < totalPages.value) {
    currentPage.value++
  }
}

function goToPage(page) {
  currentPage.value = page
}

function getTrans(key, defaultText) {
  // 这里保持原有的国际化逻辑
  // 在实际项目中，这里应该调用你的i18n库
  return window.i18nManager ? window.i18nManager.getText(key) : defaultText
}

function getTranslatedLevel(level) {
  const roleKey = roleMap[level] || level
  return getTrans(roleKey, level)
}

function getTranslatedUnit(unitName) {
  const unitKey = unitMap[unitName] || unitName
  return getTrans(unitKey, unitName)
}

function handleLanguageChange(event) {
  const newLang = event.target.value
  selectedLanguage.value = newLang
  localStorage.setItem('app_language', newLang)
  
  if (window.i18nManager) {
    window.i18nManager.setLanguage(newLang)
  }
  
  // 触发语言变化事件
  window.dispatchEvent(new CustomEvent('languageChanged'))
}

const projectId = window.top?.getCurrentProjectId && window.top.getCurrentProjectId() || 1012
const userId = window.top._P?.data?.navbean?.user?.userid || 1000

const baseForm = ref({})
// 生命周期
onMounted(() => {
  init()
  axios.getTableData('CRHK_XMZJDLSY_RWK')
  .then(res => {
    const data = res.data.data.filter(el => el.PROJECT_ID === projectId && el.USERID === userId)
    baseForm.value = data.length > 0 ? { ...baseForm.value, ...data[0] } : { ...baseForm.value, ZSL: 0, RWZL: 0 }
  })
  axios.getTableData('CRHK_XMZJDLSY_JFWQD')
  .then(res => {
    const data = res.data.data.filter(el => el.PROJECT_ID === projectId)
    baseForm.value = data.length > 0 ? { ...baseForm.value, ...data[0] } : { ...baseForm.value, JFWWCL: 0 }
  })


  axios.getTableData('CRHK_BMJLDLSY_SJTDBX')
  .then(res => {
    teamMembers.value = res.data.data.filter(el => el.PROJECT_ID === projectId)
  })

  axios.getTableData('CRHK_XMZJDLSY_XMBGQK')
  .then(res => {
    designChangeList.value = res.data.data.filter(el => el.PROJECT_ID === projectId)
  })

  axios.getTableData('CRHK_XMZJDLSY_SYBX')
  .then(res => {
    upstreamData.value = res.data.data.filter(el => el.PROJECT_ID === projectId)
  })
  axios.getTableData('CRHK_XMZJDLSY_XYBX')
  .then(res => {
    downstreamData.value = res.data.data.filter(el => el.PROJECT_ID === projectId)
  })
  axios.getTableData('V_CRHK_GRDLSY_RWQD')
  .then(res => {
    allItems.value = res.data.data
  })
})

function init() {
  // 初始化主题
  const savedTheme = localStorage.getItem('theme')
  const systemDark = window.matchMedia('(prefers-color-scheme: dark)').matches
  
  if (savedTheme === 'dark' || (!savedTheme && systemDark)) {
    document.documentElement.setAttribute('data-theme', 'dark')
  }
  
  // 初始化语言
  const savedLang = localStorage.getItem('app_language') || 'zh'
  selectedLanguage.value = savedLang
  
  // 初始化时钟
  updateClock()
  const clockInterval = setInterval(updateClock, 1000)
  
  // 监听语言变化事件
  window.addEventListener('languageChanged', () => {
    // 当语言变化时，可以触发重新渲染
    // 这里不做具体操作，因为getTrans函数会在模板中实时获取翻译
  })
  
  // 清理定时器和事件监听器
  onUnmounted(() => {
    clearInterval(clockInterval)
    window.removeEventListener('languageChanged', () => {})
  })
}

const puPush = (path) => {
  top?.setNavigationKey(path)
}

const allItems = ref([])
const paginatedOverdueTasks = ref([])
const dialogVisible = ref(false)
const showDetail = (item) => {
  paginatedOverdueTasks.value = allItems.value.filter(el => el.LY && el.LY.includes(String(item.USERID)) && el.PROJECT_ID === item.PROJECT_ID && el.SFBZ === 1 && el.SFYQ === 1)
  console.log(paginatedOverdueTasks.value)
  paginatedOverdueTasks.value.forEach(el => {
    el.source = item.FZRXM
  })
  dialogVisible.value = true
}

// 监听搜索变化，重置页码
watch(searchQuery, () => {
  currentPage.value = 1
})
</script>

<style lang="scss" scoped>
.manager-dashboard {
  margin: 0 auto;
  width: 100%;
  padding: 20px 100px;
  display: flex;
  flex-direction: column;
  gap: 24px;
  min-height: 100vh;
}
</style>