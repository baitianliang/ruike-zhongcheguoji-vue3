<template>
  <div class="app-container">
    <!-- Header -->
    <header class="animate-in">
      <div class="header-title">
        <h1 v-i18n="'director_title'"></h1>
        <p v-i18n="'welcome_message'"></p>
      </div>
      <div class="header-actions">
        <div id="clock" class="clock-display">{{ currentTime }}</div>
        <LanguageSwitcher />
        <button class="btn btn-outline" id="theme-toggle" @click="toggleTheme" title="切换主题" v-i18n="'switch_theme'">
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
      <div class="card">
        <div class="stat-header">
          <div class="stat-label" v-i18n="'task_messages'"></div>
          <div class="stat-icon">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
            </svg>
          </div>
        </div>
        <div class="stat-value urgent">12</div>
        <div class="stat-trend trend-up">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <polyline points="23 6 13.5 15.5 8.5 10.5 1 18"></polyline>
            <polyline points="17 6 23 6 23 12"></polyline>
          </svg>
          <span v-i18n="'trend_increase_daily'"></span>
        </div>
      </div>

      <div class="card">
        <div class="stat-header">
          <div class="stat-label" v-i18n="'pending_emails'"></div>
          <div class="stat-icon" style="background-color: #fff7ed; color: #ea580c;">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
              <polyline points="22,6 12,13 2,6"></polyline>
            </svg>
          </div>
        </div>
        <div class="stat-value urgent">5</div>
        <div class="stat-trend trend-neutral">
          <span v-i18n="'stat_trend_stable'"></span>
        </div>
      </div>

      <div class="card">
        <div class="stat-header">
          <div class="stat-label" v-i18n="'project_health'"></div>
          <div class="stat-icon" style="background-color: #f0fdf4; color: #16a34a;">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M22 12h-4l-3 9L9 3l-3 9H2"></path>
            </svg>
          </div>
        </div>
        <div class="stat-value">98%</div>
        <div class="stat-trend trend-up">
          <span v-i18n="'status_excellent'"></span>
        </div>
      </div>
    </section>

    <div class="main-content animate-in delay-2">
      <!-- Task List -->
      <section>
        <div class="section-header">
          <h2 class="section-title" v-i18n="'current_tasks'"></h2>
          <div class="search-wrapper" :class="{ active: isSearchActive }">
            <input 
              type="text" 
              class="search-input" 
              v-model="searchQuery"
              placeholder="搜索任务名称、描述或状态..."
              @focus="isSearchActive = true"
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
            <button class="btn btn-outline" @click="toggleSearch">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <circle cx="11" cy="11" r="8"></circle>
                <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
              </svg>
              <span v-i18n="'search_button'"></span>
            </button>
          </div>
        </div>
        <div class="table-container">
          <table style="table-layout: fixed; width: 100%;">
            <colgroup>
              <col style="width: 60px;">
              <col style="width: 25%;">
              <col style="width: 15%;">
              <col style="width: 15%;">
              <col style="width: 15%;">
              <col style="width: 15%;">
              <col style="width: 15%;">
            </colgroup>
            <thead>
              <tr>
                <th>#</th>
                <th v-i18n="'table_task'"></th>
                <th v-i18n="'table_source'"></th>
                <th v-i18n="'table_deadline'"></th>
                <th v-i18n="'table_upstream'"></th>
                <th v-i18n="'table_downstream'"></th>
                <th v-i18n="'table_owner'"></th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="task in paginatedTasks" :key="task.id">
                <td style="color: var(--text-tertiary);">{{ String(task.id).padStart(2, '0') }}</td>
                <td>
                  <div style="font-weight: 500;">{{ task.title }}</div>
                  <div style="font-size: 12px; color: var(--text-secondary); margin-top: 2px;">{{ task.desc }}</div>
                </td>
                <td>
                  <span :class="['status-badge', task.sourceType]" v-i18n="`source_${task.sourceType}`">
                  </span>
                </td>
                <td>{{ task.date }}</td>
                <td style="font-size: 12px;">{{ task.upstream }}</td>
                <td style="font-size: 12px; color: var(--text-tertiary);">{{ task.downstream }}</td>
                <td>
                  <div class="user-cell">
                    <div class="user-avatar" :style="task.color ? 'background-color: ' + task.color : ''">
                      {{ task.avatar }}
                    </div>
                    <span>{{ task.owner }}</span>
                  </div>
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

      <!-- Side Metrics -->
      <section>
        <div class="section-header">
          <h2 class="section-title" v-i18n="'module_metrics'"></h2>
        </div>
        <div class="metrics-grid">
          <div class="metric-item">
            <div class="metric-info">
              <h4 v-i18n="'overall_progress'"></h4>
              <div class="val" v-i18n="'metric_progress_normal'"></div>
            </div>
            <div class="metric-status status-green"></div>
          </div>
          <div class="metric-item">
            <div class="metric-info">
              <h4 v-i18n="'business_docking'"></h4>
              <div class="val" v-i18n="'metric_follow_up'"></div>
            </div>
            <div class="metric-status status-orange"></div>
          </div>
          <div class="metric-item">
            <div class="metric-info">
              <h4 v-i18n="'design_completion'"></h4>
              <div class="val">95%</div>
            </div>
            <div class="metric-status status-blue"></div>
          </div>
          <div class="metric-item">
            <div class="metric-info">
              <h4 v-i18n="'procurement_process'"></h4>
              <div class="val" v-i18n="'status_completed'"></div>
            </div>
            <div class="metric-status status-green"></div>
          </div>
          <div class="metric-item">
            <div class="metric-info">
              <h4 v-i18n="'site_installation'"></h4>
              <div class="val" v-i18n="'status_processing'"></div>
            </div>
            <div class="metric-status status-blue"></div>
          </div>
          <div class="metric-item">
            <div class="metric-info">
              <h4 v-i18n="'system_debugging'"></h4>
              <div class="val" style="color: var(--text-tertiary);" v-i18n="'metric_not_started'">
              </div>
            </div>
            <div class="metric-status status-gray"></div>
          </div>
        </div>
      </section>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, watch } from 'vue'
import LanguageSwitcher from '../components/LanguageSwitcher.vue';
// import { useI18n } from './i18n-directive'

// const { t, formatDate, setLanguage, lang } = useI18n()
// console.log(formatDate)

// 响应式数据
const currentTime = ref('')
const searchQuery = ref('')
const isSearchActive = ref(false)
const currentPage = ref(1)

// 任务数据
const tasks = ref([
  { id: 1, title: '完成界面设计初稿', desc: 'UI/UX Design', source: '产品部', sourceType: 'design', date: '2023-10-20', upstream: '李产品', downstream: '前端组', owner: '张三', avatar: '张', color: '' },
  { id: 2, title: '后端API接口开发', desc: 'Backend Dev', source: '技术部', sourceType: 'dev', date: '2023-10-22', upstream: '架构师', downstream: '前端组', owner: '李四', avatar: '李', color: '#8b5cf6' },
  { id: 3, title: '数据库优化', desc: 'Database', source: '运维部', sourceType: 'ops', date: '2023-10-25', upstream: 'DBA', downstream: '后端组', owner: '王五', avatar: '王', color: '#f59e0b' },
  { id: 4, title: '用户验收测试', desc: 'QA Testing', source: '测试部', sourceType: 'design', date: '2023-10-28', upstream: '开发组', downstream: '客户', owner: '赵六', avatar: '赵', color: '#ec4899' },
  { id: 5, title: '移动端适配', desc: 'Responsive', source: '技术部', sourceType: 'dev', date: '2023-10-30', upstream: 'UI组', downstream: '测试组', owner: '钱七', avatar: '钱', color: '#10b981' },
  { id: 6, title: '性能监控部署', desc: 'DevOps', source: '运维部', sourceType: 'ops', date: '2023-11-01', upstream: '技术总监', downstream: '运维组', owner: '孙八', avatar: '孙', color: '#3b82f6' },
  { id: 7, title: '第三方支付集成', desc: 'Payment', source: '技术部', sourceType: 'dev', date: '2023-11-03', upstream: '产品经理', downstream: '财务', owner: '周九', avatar: '周', color: '#6366f1' },
  { id: 8, title: '安全漏洞修复', desc: 'Security', source: '安全部', sourceType: 'ops', date: '2023-11-05', upstream: '安全顾问', downstream: '开发组', owner: '吴十', avatar: '吴', color: '#ef4444' },
  { id: 9, title: '帮助文档编写', desc: 'Documentation', source: '产品部', sourceType: 'design', date: '2023-11-07', upstream: '运营', downstream: '用户', owner: '郑十一', avatar: '郑', color: '#8b5cf6' },
  { id: 10, title: '日志系统升级', desc: 'Infrastructure', source: '运维部', sourceType: 'ops', date: '2023-11-10', upstream: 'CTO', downstream: '全员', owner: '王十二', avatar: '王', color: '#f59e0b' }
])

const ITEMS_PER_PAGE = 5

// 计算属性
const filteredTasks = computed(() => {
  if (!searchQuery.value) return tasks.value
  
  const query = searchQuery.value.toLowerCase()
  return tasks.value.filter(task => 
    task.title.toLowerCase().includes(query) || 
    task.desc.toLowerCase().includes(query) ||
    task.source.toLowerCase().includes(query)
  )
})

const totalPages = computed(() => {
  return Math.ceil(filteredTasks.value.length / ITEMS_PER_PAGE)
})

const paginatedTasks = computed(() => {
  const start = (currentPage.value - 1) * ITEMS_PER_PAGE
  const end = start + ITEMS_PER_PAGE
  return filteredTasks.value.slice(start, end)
})

// 方法
function updateClock() {
  const now = new Date()
  currentTime.value = now.toLocaleString()
}

function toggleTheme() {
  const root = document.documentElement
  const currentTheme = root.getAttribute('data-theme')
  const newTheme = currentTheme === 'dark' ? 'light' : 'dark'
  
  root.setAttribute('data-theme', newTheme)
  localStorage.setItem('theme', newTheme)
  
  const svg = document.querySelector('.theme-toggle svg')
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

// 生命周期
onMounted(() => {
  // 初始化主题
  const savedTheme = localStorage.getItem('theme')
  const systemDark = window.matchMedia('(prefers-color-scheme: dark)').matches
  
  if (savedTheme === 'dark' || (!savedTheme && systemDark)) {
    document.documentElement.setAttribute('data-theme', 'dark')
  }
  
  // 初始化时钟
  updateClock()
  const clockInterval = setInterval(updateClock, 1000)
  
  // 清理定时器
  onUnmounted(() => clearInterval(clockInterval))
})

// 监听搜索变化，重置页码
watch(searchQuery, () => {
  currentPage.value = 1
})
</script>

