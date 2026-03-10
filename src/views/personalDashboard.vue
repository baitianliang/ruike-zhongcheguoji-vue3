<template>
  <div class="app-container">
    <!-- Header -->
    <header class="animate-in">
      <div class="header-title">
        <h1 v-i18n="'personal_title'">个人登录首页</h1>
        <p v-i18n="'welcome_message'">欢迎回来，查看您的今日概览</p>
      </div>
      <div class="header-actions">
        <div id="clock" class="clock-display">{{ currentTime }}</div>
        <LanguageSwitcher />
        <button 
          class="btn btn-outline" 
          id="theme-toggle" 
          @click="toggleTheme"
          title="切换主题"
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
      <div class="card">
        <div class="stat-header">
          <div class="stat-label" v-i18n="'task_messages'">任务消息</div>
          <div class="stat-icon">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
            </svg>
          </div>
        </div>
        <div 
          class="stat-value urgent" 
          :class="{ 'blink-anim': isUrgentBlinking }"
          title="点击标记为已读/停止闪烁"
          v-i18n="'mark_read_stop_blink'"
          @click="markUrgentAsRead"
        >
          12
        </div>
        <div class="stat-trend trend-up">
          <span v-i18n="'stat_trend_increase'">较昨日 +2</span>
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
          5
        </div>
        <div class="stat-trend trend-neutral">
          <span v-i18n="'stat_trend_stable'">保持平稳</span>
        </div>
      </div>

      <div class="card">
        <div class="stat-header">
          <div class="stat-label" v-i18n="'project_health'">项目健康度</div>
          <div class="stat-icon" style="background-color: #f0fdf4; color: #16a34a;">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M22 12h-4l-3 9L9 3l-3 9H2"></path>
            </svg>
          </div>
        </div>
        <div class="stat-value">98%</div>
        <div class="stat-trend trend-up">
          <span v-i18n="'status_excellent'">状态极佳</span>
        </div>
      </div>
    </section>

    <!-- Main Grid Layout -->
    <div class="tasks-grid-layout animate-in delay-2">
      <!-- 1. Overdue Tasks -->
      <div class="task-section">
        <h2 class="section-title title-overdue" v-i18n="'overdue_tasks'">
          <svg class="section-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="12" cy="12" r="10"></circle>
            <line x1="12" y1="8" x2="12" y2="12"></line>
            <line x1="12" y1="16" x2="12.01" y2="16"></line>
          </svg>
          逾期任务
        </h2>
        <div class="table-wrapper">
          <table id="table-overdue">
            <thead>
              <tr>
                <th width="50">#</th>
                <th v-i18n="'task_name'">任务名称</th>
                <th v-i18n="'source'">来源</th>
                <th v-i18n="'deadline'">截止时间</th>
                <th v-i18n="'upstream'">上游方</th>
                <th v-i18n="'downstream'">下游方</th>
                <th v-i18n="'owner'">负责人</th>
              </tr>
            </thead>
            <tbody>
              <tr 
                v-for="item in paginatedOverdueTasks" 
                :key="item.id"
                :class="{ 'row-blink': true }"
              >
                <td style="color: var(--text-tertiary)">{{ item.id }}</td>
                <td>
                  <div style="font-weight: 500;" class="text-red" v-i18n="item.title">{{ item.title }}</div>
                  <div style="font-size: 11px; color: var(--text-secondary)">{{ item.desc }}</div>
                </td>
                <td>
                  <span :class="['status-badge', item.sourceType]" v-i18n="item.source">{{ item.source }}</span>
                </td>
                <td class="text-red">{{ item.date }}</td>
                <td v-i18n="item.upstream">{{ item.upstream }}</td>
                <td style="color: var(--text-tertiary)" v-i18n="item.downstream">{{ item.downstream }}</td>
                <td>
                  <div class="user-row">
                    <div class="user-avatar" :style="{ backgroundColor: item.avatarColor }">
                      {{ item.owner[0] }}
                    </div>
                    <span>{{ item.owner }}</span>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <div class="pagination" id="pagination-overdue">
          <button 
            class="page-btn" 
            @click="changePage('overdue', tableState.overdue.page - 1)" 
            :disabled="tableState.overdue.page === 1"
            v-i18n="'prev_page'"
          >
          </button>
          <button 
            v-for="page in getPageRange('overdue')" 
            :key="page"
            :class="['page-btn', { active: tableState.overdue.page === page }]"
            @click="changePage('overdue', page)"
          >
            {{ page }}
          </button>
          <button 
            class="page-btn" 
            @click="changePage('overdue', tableState.overdue.page + 1)" 
            :disabled="tableState.overdue.page === totalPages('overdue')"
            v-i18n="'next_page'"
          >
          </button>
          <span style="font-size: 12px; color: var(--text-tertiary); margin-left: 8px; display: flex; align-items: center;">
            {{ tableState.overdue.page }} / {{ totalPages('overdue') }}
          </span>
        </div>
      </div>

      <!-- 2. Weekly Tasks -->
      <div class="task-section">
        <h2 class="section-title title-weekly" v-i18n="'weekly_tasks'">
          <svg class="section-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round">
            <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
            <line x1="16" y1="2" x2="16" y2="6"></line>
            <line x1="8" y1="2" x2="8" y2="6"></line>
            <line x1="3" y1="10" x2="21" y2="10"></line>
          </svg>
          本周任务
        </h2>
        <div class="table-wrapper">
          <table id="table-weekly">
            <thead>
              <tr>
                <th width="50">#</th>
                <th v-i18n="'task_name'">任务名称</th>
                <th v-i18n="'source'">来源</th>
                <th v-i18n="'deadline'">截止时间</th>
                <th v-i18n="'upstream'">上游方</th>
                <th v-i18n="'downstream'">下游方</th>
                <th v-i18n="'owner'">负责人</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="item in paginatedWeeklyTasks" :key="item.id">
                <td style="color: var(--text-tertiary)">{{ item.id }}</td>
                <td>
                  <div style="font-weight: 500;" class="text-black" v-i18n="item.title">{{ item.title }}</div>
                  <div style="font-size: 11px; color: var(--text-secondary)">{{ item.desc }}</div>
                </td>
                <td>
                  <span :class="['status-badge', item.sourceType]" v-i18n="item.source">{{ item.source }}</span>
                </td>
                <td class="text-black">{{ item.date }}</td>
                <td v-i18n="item.upstream">{{ item.upstream }}</td>
                <td style="color: var(--text-tertiary)" v-i18n="item.downstream">{{ item.downstream }}</td>
                <td>
                  <div class="user-row">
                    <div class="user-avatar" :style="{ backgroundColor: item.avatarColor }">
                      {{ item.owner[0] }}
                    </div>
                    <span>{{ item.owner }}</span>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <div class="pagination" id="pagination-weekly">
          <button 
            class="page-btn" 
            @click="changePage('weekly', tableState.weekly.page - 1)" 
            :disabled="tableState.weekly.page === 1"
            v-i18n="'prev_page'"
          >
          </button>
          <button 
            v-for="page in getPageRange('weekly')" 
            :key="page"
            :class="['page-btn', { active: tableState.weekly.page === page }]"
            @click="changePage('weekly', page)"
          >
            {{ page }}
          </button>
          <button 
            class="page-btn" 
            @click="changePage('weekly', tableState.weekly.page + 1)" 
            :disabled="tableState.weekly.page === totalPages('weekly')"
            v-i18n="'next_page'"
          >
          </button>
          <span style="font-size: 12px; color: var(--text-tertiary); margin-left: 8px; display: flex; align-items: center;">
            {{ tableState.weekly.page }} / {{ totalPages('weekly') }}
          </span>
        </div>
      </div>

      <!-- 3. Monthly Tasks -->
      <div class="task-section">
        <h2 class="section-title title-monthly">
          <svg class="section-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round">
            <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
            <line x1="16" y1="2" x2="16" y2="6"></line>
            <line x1="8" y1="2" x2="8" y2="6"></line>
            <line x1="3" y1="10" x2="21" y2="10"></line>
            <path d="M8 14h.01"></path>
            <path d="M12 14h.01"></path>
            <path d="M16 14h.01"></path>
            <path d="M8 18h.01"></path>
            <path d="M12 18h.01"></path>
            <path d="M16 18h.01"></path>
          </svg>
          <span v-i18n="'monthly_tasks'">本月任务</span>
        </h2>
        <div class="table-wrapper">
          <table id="table-monthly">
            <thead>
              <tr>
                <th width="50">#</th>
                <th v-i18n="'task_name'">任务名称</th>
                <th v-i18n="'source'">来源</th>
                <th v-i18n="'deadline'">截止时间</th>
                <th v-i18n="'upstream'">上游方</th>
                <th v-i18n="'downstream'">下游方</th>
                <th v-i18n="'owner'">负责人</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="item in paginatedMonthlyTasks" :key="item.id">
                <td style="color: var(--text-tertiary)">{{ item.id }}</td>
                <td>
                  <div style="font-weight: 500;" class="text-black" v-i18n="item.title">{{ item.title }}</div>
                  <div style="font-size: 11px; color: var(--text-secondary)">{{ item.desc }}</div>
                </td>
                <td>
                  <span :class="['status-badge', item.sourceType]" v-i18n="item.source">{{ item.source }}</span>
                </td>
                <td class="text-black">{{ item.date }}</td>
                <td v-i18n="item.upstream">{{ item.upstream }}</td>
                <td style="color: var(--text-tertiary)" v-i18n="item.downstream">{{ item.downstream }}</td>
                <td>
                  <div class="user-row">
                    <div class="user-avatar" :style="{ backgroundColor: item.avatarColor }">
                      {{ item.owner[0] }}
                    </div>
                    <span>{{ item.owner }}</span>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <div class="pagination" id="pagination-monthly">
          <button 
            class="page-btn" 
            @click="changePage('monthly', tableState.monthly.page - 1)" 
            :disabled="tableState.monthly.page === 1"
            v-i18n="'prev_page'"
          >
          </button>
          <button 
            v-for="page in getPageRange('monthly')" 
            :key="page"
            :class="['page-btn', { active: tableState.monthly.page === page }]"
            @click="changePage('monthly', page)"
          >
            {{ page }}
          </button>
          <button 
            class="page-btn" 
            @click="changePage('monthly', tableState.monthly.page + 1)" 
            :disabled="tableState.monthly.page === totalPages('monthly')"
            v-i18n="'next_page'"
          >
          </button>
          <span style="font-size: 12px; color: var(--text-tertiary); margin-left: 8px; display: flex; align-items: center;">
            {{ tableState.monthly.page }} / {{ totalPages('monthly') }}
          </span>
        </div>
      </div>

      <!-- 4. Quarterly Tasks -->
      <div class="task-section">
        <h2 class="section-title title-quarterly">
          <svg class="section-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
            <polyline points="14 2 14 8 20 8"></polyline>
            <line x1="16" y1="13" x2="8" y2="13"></line>
            <line x1="16" y1="17" x2="8" y2="17"></line>
            <polyline points="10 9 9 9 8 9"></polyline>
          </svg>
          <span v-i18n="'quarterly_tasks'">季度任务</span>
        </h2>
        <div class="table-wrapper">
          <table id="table-quarterly">
            <thead>
              <tr>
                <th width="50">#</th>
                <th v-i18n="'task_name'">任务名称</th>
                <th v-i18n="'source'">来源</th>
                <th v-i18n="'deadline'">截止时间</th>
                <th v-i18n="'upstream'">上游方</th>
                <th v-i18n="'downstream'">下游方</th>
                <th v-i18n="'owner'">负责人</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="item in paginatedQuarterlyTasks" :key="item.id">
                <td style="color: var(--text-tertiary)">{{ item.id }}</td>
                <td>
                  <div style="font-weight: 500;" class="text-black" v-i18n="item.title">{{ item.title }}</div>
                  <div style="font-size: 11px; color: var(--text-secondary)">{{ item.desc }}</div>
                </td>
                <td>
                  <span :class="['status-badge', item.sourceType]" v-i18n="item.source">{{ item.source }}</span>
                </td>
                <td class="text-black">{{ item.date }}</td>
                <td v-i18n="item.upstream">{{ item.upstream }}</td>
                <td style="color: var(--text-tertiary)" v-i18n="item.downstream">{{ item.downstream }}</td>
                <td>
                  <div class="user-row">
                    <div class="user-avatar" :style="{ backgroundColor: item.avatarColor }">
                      {{ item.owner[0] }}
                    </div>
                    <span>{{ item.owner }}</span>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <div class="pagination" id="pagination-quarterly">
          <button 
            class="page-btn" 
            @click="changePage('quarterly', tableState.quarterly.page - 1)" 
            :disabled="tableState.quarterly.page === 1"
            v-i18n="'prev_page'"
          >
          </button>
          <button 
            v-for="page in getPageRange('quarterly')" 
            :key="page"
            :class="['page-btn', { active: tableState.quarterly.page === page }]"
            @click="changePage('quarterly', page)"
          >
            {{ page }}
          </button>
          <button 
            class="page-btn" 
            @click="changePage('quarterly', tableState.quarterly.page + 1)" 
            :disabled="tableState.quarterly.page === totalPages('quarterly')"
            v-i18n="'next_page'"
          >
          </button>
          <span style="font-size: 12px; color: var(--text-tertiary); margin-left: 8px; display: flex; align-items: center;">
            {{ tableState.quarterly.page }} / {{ totalPages('quarterly') }}
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import LanguageSwitcher from '../components/LanguageSwitcher.vue';

// 国际化处理函数
const $t = (key) => {
  // 这里保持原有的国际化逻辑
  // 在实际项目中，这里应该调用你的i18n库
  return window.i18nManager ? window.i18nManager.getText(key) : key
}

// 响应式数据
const currentTime = ref('')
const isUrgentBlinking = ref(true)
const isEmailBlinking = ref(true)

// 数据生成函数
const generateData = (count, startId) => {
  const sources = [
    { name: 'source_design', type: 'design', color: '#e0e7ff' },
    { name: 'source_dev', type: 'dev', color: '#dbeafe' },
    { name: 'source_ops', type: 'ops', color: '#fce7f3' },
    { name: 'source_design', type: 'design', color: '#e0e7ff' }
  ]
  const people = [
    { name: '张三', color: '#6366f1' },
    { name: '李四', color: '#8b5cf6' },
    { name: '王五', color: '#f59e0b' },
    { name: '赵六', color: '#ec4899' },
    { name: '钱七', color: '#10b981' }
  ]
  
  return Array.from({ length: count }, (_, i) => {
    const src = sources[Math.floor(Math.random() * sources.length)]
    const person = people[Math.floor(Math.random() * people.length)]
    const titles = ['task_ui_design', 'task_api_dev', 'task_db_opt', 'task_uat', 'task_mobile_adapt', 'task_log_upgrade', 'task_payment_int']
    const descs = ['UI/UX Design', 'Backend Dev', 'Database', 'QA Testing', 'Responsive', 'Infrastructure', 'Payment']
    const upstreams = ['dept_product', 'role_architect', 'role_dba', 'group_dev', 'group_ui']
    const downstreams = ['group_frontend', 'group_backend', 'group_ops', 'role_client', 'group_qa']
    
    return {
      id: String(startId + i).padStart(2, '0'),
      title: titles[i % 7],
      desc: descs[i % 7],
      source: src.name,
      sourceType: `badge-${src.type}`,
      date: '2023-10-2' + (i % 9),
      upstream: upstreams[i % 5],
      downstream: downstreams[i % 5],
      owner: person.name,
      avatarColor: person.color
    }
  })
}

// 数据集合
const dataSets = ref({
  'overdue': generateData(12, 1),
  'weekly': generateData(18, 13),
  'monthly': generateData(25, 31),
  'quarterly': generateData(8, 56)
})

// 分页状态
const tableState = ref({
  'overdue': { page: 1, limit: 3 },
  'weekly': { page: 1, limit: 3 },
  'monthly': { page: 1, limit: 5 },
  'quarterly': { page: 1, limit: 5 }
})

// 计算属性
const paginatedOverdueTasks = computed(() => {
  const data = dataSets.value.overdue
  const state = tableState.value.overdue
  const start = (state.page - 1) * state.limit
  const end = start + state.limit
  return data.slice(start, end)
})

const paginatedWeeklyTasks = computed(() => {
  const data = dataSets.value.weekly
  const state = tableState.value.weekly
  const start = (state.page - 1) * state.limit
  const end = start + state.limit
  return data.slice(start, end)
})

const paginatedMonthlyTasks = computed(() => {
  const data = dataSets.value.monthly
  const state = tableState.value.monthly
  const start = (state.page - 1) * state.limit
  const end = start + state.limit
  return data.slice(start, end)
})

const paginatedQuarterlyTasks = computed(() => {
  const data = dataSets.value.quarterly
  const state = tableState.value.quarterly
  const start = (state.page - 1) * state.limit
  const end = start + state.limit
  return data.slice(start, end)
})

// 方法
function updateClock() {
  const now = new Date()
  const timeString = `${now.getFullYear()}-${String(now.getMonth()+1).padStart(2,'0')}-${String(now.getDate()).padStart(2,'0')} ${String(now.getHours()).padStart(2,'0')}:${String(now.getMinutes()).padStart(2,'0')}`
  currentTime.value = timeString
}

function toggleTheme() {
  const root = document.documentElement
  const newTheme = root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark'
  root.setAttribute('data-theme', newTheme)
}

function markUrgentAsRead() {
  if (isUrgentBlinking.value) {
    isUrgentBlinking.value = false
    const element = document.querySelector('.stat-value.urgent:first-child')
    if (element) {
      element.style.cursor = 'default'
      element.title = ''
    }
  }
}

function markEmailAsRead() {
  if (isEmailBlinking.value) {
    isEmailBlinking.value = false
    const element = document.querySelectorAll('.stat-value.urgent')[1]
    if (element) {
      element.style.cursor = 'default'
      element.title = ''
    }
  }
}

function changePage(type, newPage) {
  const data = dataSets.value[type]
  const state = tableState.value[type]
  const totalPages = Math.ceil(data.length / state.limit)

  if (newPage >= 1 && newPage <= totalPages) {
    state.page = newPage
  }
}

function totalPages(type) {
  const data = dataSets.value[type]
  const state = tableState.value[type]
  return Math.ceil(data.length / state.limit)
}

function getPageRange(type) {
  const total = totalPages(type)
  const current = tableState.value[type].page
  const maxVisible = 5
  
  if (total <= maxVisible) {
    return Array.from({ length: total }, (_, i) => i + 1)
  }
  
  let startPage = Math.max(1, current - 2)
  let endPage = Math.min(total, startPage + maxVisible - 1)
  
  if (endPage - startPage < maxVisible - 1) {
    startPage = Math.max(1, endPage - maxVisible + 1)
  }
  
  return Array.from({ length: endPage - startPage + 1 }, (_, i) => startPage + i)
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
  
  // 清理定时器和事件监听器
  onUnmounted(() => {
    clearInterval(clockInterval)
  })
})
</script>

<style scoped>

/* 
    * ==========================================
    * Design System Copied from dashboard.html
    * ==========================================
    */
:root {
    /* Light Theme */
    --bg-body: #f8fafc;
    --bg-surface: #ffffff;
    --bg-surface-hover: #f1f5f9;
    --text-primary: #0f172a;
    --text-secondary: #64748b;
    --text-tertiary: #94a3b8;
    --border-color: #e2e8f0;
    
    --primary-color: #4f46e5;
    --primary-hover: #4338ca;
    --primary-light: #eef2ff;
    
    --shadow-sm: 0 1px 2px 0 rgb(0 0 0 / 0.05);
    --shadow-md: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1);
    --shadow-lg: 0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1);
    
    /* Button Variables */
    --btn-height: 40px;
    --btn-radius: 8px;
    --btn-padding: 0 16px;
    --btn-gap: 8px;
    --btn-font-size: 14px;
    --btn-font-weight: 500;
    
    --radius-md: 8px;
    --radius-lg: 16px;
    
    --transition-base: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
}

[data-theme="dark"] {
    /* Dark Theme */
    --bg-body: #0f172a;
    --bg-surface: #1e293b;
    --bg-surface-hover: #334155;
    --text-primary: #f8fafc;
    --text-secondary: #cbd5e1;
    --text-tertiary: #64748b;
    --border-color: #334155;
    
    --primary-color: #6366f1;
    --primary-hover: #818cf8;
    --primary-light: rgba(99, 102, 241, 0.1);
    
    --shadow-sm: 0 1px 2px 0 rgb(0 0 0 / 0.3);
    --shadow-md: 0 4px 6px -1px rgb(0 0 0 / 0.3);
}

* {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
}

body {
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", sans-serif;
    background-color: var(--bg-body);
    color: var(--text-primary);
    line-height: 1.5;
    transition: background-color 0.3s ease, color 0.3s ease;
    -webkit-font-smoothing: antialiased;
}

/* Layout */
.app-container {
    max-width: 1600px;
    margin: 0 auto;
    padding: 24px;
    display: flex;
    flex-direction: column;
    gap: 24px;
    min-height: 100vh;
}

/* Header Section */
header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding-bottom: 24px;
    border-bottom: 1px solid var(--border-color);
}

.header-title h1 {
    font-size: 24px;
    font-weight: 700;
    letter-spacing: -0.025em;
}

.header-title p {
    color: var(--text-secondary);
    font-size: 14px;
    margin-top: 4px;
}

.header-actions {
    display: flex;
    gap: 16px;
    align-items: center;
}

/* Buttons & Components */
.btn {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    height: var(--btn-height);
    padding: var(--btn-padding);
    border-radius: var(--btn-radius);
    font-size: var(--btn-font-size);
    font-weight: var(--btn-font-weight);
    cursor: pointer;
    transition: var(--transition-base);
    border: 1px solid transparent;
    gap: var(--btn-gap);
    line-height: 1;
}

.btn-outline {
    background-color: var(--bg-surface);
    border-color: var(--border-color);
    color: var(--text-primary);
}

.btn-outline:hover {
    background-color: var(--bg-surface-hover);
    border-color: var(--text-secondary);
}

/* Language Switcher Styling */
.lang-switcher {
    appearance: none;
    -webkit-appearance: none;
    background-color: transparent;
    padding-right: 28px;
    padding-left: 12px;
    background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e");
    background-position: right 8px center;
    background-repeat: no-repeat;
    background-size: 16px;
    text-align: left;
    min-width: 90px;
    line-height: 1.5;
    padding-top: 0;
    padding-bottom: 0;
}

.clock-display {
    font-family: 'SF Pro Display', sans-serif;
    font-size: 14px;
    font-weight: 500;
    color: var(--text-primary);
    height: var(--btn-height);
    padding: var(--btn-padding);
    background: var(--bg-surface);
    border: 1px solid var(--border-color);
    border-radius: var(--btn-radius);
    box-shadow: var(--shadow-sm);
    display: flex;
    align-items: center;
    justify-content: center;
}

/* Top Stats Cards */
.stats-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: 24px;
}

.card {
    background-color: var(--bg-surface);
    border-radius: var(--radius-lg);
    padding: 12px; /* Reduced from 16px */
    box-shadow: var(--shadow-sm);
    border: 1px solid var(--border-color);
    transition: var(--transition-base);
    display: flex;
    flex-direction: column;
}

.card:hover {
    transform: translateY(-2px);
    box-shadow: var(--shadow-md);
}

.stat-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 4px; /* Reduced from 8px */
}

.stat-label {
    color: var(--text-secondary);
    font-size: 14px;
    font-weight: 500;
}

.stat-icon {
    width: 32px;
    height: 32px;
    border-radius: 8px;
    background-color: var(--primary-light);
    color: var(--primary-color);
    display: flex;
    align-items: center;
    justify-content: center;
}

.stat-value {
    font-size: 24px;
    font-weight: 700;
    color: var(--text-primary);
}

.stat-value.urgent { color: #ef4444; }

.stat-trend {
    font-size: 12px;
    margin-top: 4px;
    display: flex;
    align-items: center;
    gap: 4px;
}
.trend-up { color: #10b981; }
.trend-neutral { color: var(--text-secondary); }

/* Tasks Grid Layout (2x2) */
.tasks-grid-layout {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(600px, 1fr));
    gap: 12px; /* Reduced from 20px */
}

@media (max-width: 1200px) {
    .tasks-grid-layout {
        grid-template-columns: 1fr;
    }
}

.task-section {
    background-color: var(--bg-surface);
    border-radius: var(--radius-lg);
    border: 1px solid var(--border-color);
    box-shadow: var(--shadow-sm);
    padding: 20px;
    display: flex;
    flex-direction: column;
    gap: 16px;
}

.section-title {
    font-size: 18px;
    font-weight: 700;
    display: flex;
    align-items: center;
    gap: 8px;
    margin-bottom: 4px;
}

.section-icon {
    width: 20px;
    height: 20px;
    stroke-width: 2.5;
}

.section-title::before {
    content: '#';
    color: var(--text-tertiary);
    font-weight: 400;
}

.title-overdue { color: #ef4444; }
.title-weekly { color: #ea580c; } /* Orange */
.title-monthly { color: #000000; }
.title-quarterly { color: #000000; }

/* Row Blinking Animation */
@keyframes rowBlink {
    0%, 100% { opacity: 1; background-color: rgba(220, 53, 69, 0.15); }
    50% { opacity: 0.8; background-color: rgba(220, 53, 69, 0.35); }
}

.row-blink {
    animation: rowBlink 2s infinite ease-in-out;
}

/* Ensure text remains readable during blink */
.row-blink td {
    transition: color 0.3s;
}


/* Table Styles */
.table-wrapper {
    overflow-x: auto;
}

table {
    width: 100%;
    border-collapse: collapse;
    text-align: left;
    min-width: 600px;
}

th {
    color: var(--text-secondary);
    font-weight: 600;
    font-size: 12px;
    padding: 12px;
    border-bottom: 1px solid var(--border-color);
}

td {
    padding: 12px;
    border-bottom: 1px solid var(--border-color);
    color: var(--text-primary);
    font-size: 13px;
}

tr:last-child td { border-bottom: none; }
tr:hover td { background-color: var(--bg-surface-hover); }

/* Badges & Avatars */
.status-badge {
    padding: 2px 8px;
    border-radius: 99px;
    font-size: 11px;
    font-weight: 500;
    display: inline-block;
}
.badge-design { background: #e0e7ff; color: #4338ca; }
.badge-dev { background: #dbeafe; color: #1e40af; }
.badge-ops { background: #fce7f3; color: #9d174d; }

.user-avatar {
    width: 24px;
    height: 24px;
    border-radius: 50%;
    background: var(--primary-color);
    color: white;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    font-size: 10px;
    margin-right: 6px;
}

.user-row {
    display: flex;
    align-items: center;
}

/* Pagination */
.pagination {
    display: flex;
    justify-content: center;
    gap: 8px;
    margin-top: auto;
    padding-top: 12px;
}
.page-dot {
    width: 24px;
    height: 24px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 4px;
    font-size: 12px;
    cursor: pointer;
    color: var(--text-secondary);
}
.page-dot.active {
    background-color: var(--primary-color);
    color: white;
}

/* Animations */
@keyframes fadeIn {
    from { opacity: 0; transform: translateY(10px); }
    to { opacity: 1; transform: translateY(0); }
}

@keyframes blink {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.4; }
}

.blink-anim {
    animation: blink 1s infinite ease-in-out;
    cursor: pointer;
}

.blink-anim:hover {
    animation-play-state: paused;
}

.animate-in { animation: fadeIn 0.5s ease-out forwards; }
.delay-1 { animation-delay: 0.1s; }
.delay-2 { animation-delay: 0.2s; }

/* Compact Adjustments */
td, th {
    padding: 8px 12px; /* Reduced padding */
}

.task-section {
    padding: 16px; /* Reduced padding */
    gap: 12px;
}

.section-title {
    margin-bottom: 4px;
}

.pagination {
    padding-top: 8px;
}

/* Pagination Buttons */
.page-btn {
    padding: 4px 10px;
    border: 1px solid var(--border-color);
    background-color: var(--bg-surface);
    border-radius: var(--radius-md);
    cursor: pointer;
    font-size: 12px;
    color: var(--text-primary);
    transition: var(--transition-base);
}

.page-btn:hover:not(:disabled) {
    background-color: var(--bg-surface-hover);
    border-color: var(--primary-color);
}

.page-btn:disabled {
    opacity: 0.5;
    cursor: not-allowed;
}

.page-btn.active {
    background-color: var(--primary-color);
    color: white;
    border-color: var(--primary-color);
}

.text-red { color: #dc3545 !important; }
.text-black { color: #000000 !important; }
</style>