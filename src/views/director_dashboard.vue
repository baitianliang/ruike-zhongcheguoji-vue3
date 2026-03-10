<template>
  <div class="app-container">
    <header class="animate-in">
      <div class="header-title">
        <h1>{{ t('director_title') }}</h1>
        <p>{{ t('welcome_message') }}</p>
      </div>
      <div class="header-actions">
        <div id="clock" class="clock-display">{{ clockText }}</div>
        <button
          class="btn btn-outline theme-toggle"
          type="button"
          :title="t('switch_theme')"
          @click="toggleTheme"
        >
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
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

    <section class="stats-grid animate-in delay-1">
      <div class="card">
        <div class="stat-header">
          <div class="stat-label">{{ t('task_messages') }}</div>
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
          <span>{{ t('trend_increase_daily') }}</span>
        </div>
      </div>

      <div class="card">
        <div class="stat-header">
          <div class="stat-label">{{ t('pending_emails') }}</div>
          <div class="stat-icon" style="background-color: #fff7ed; color: #ea580c;">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
              <polyline points="22,6 12,13 2,6"></polyline>
            </svg>
          </div>
        </div>
        <div class="stat-value urgent">5</div>
        <div class="stat-trend trend-neutral">
          <span>{{ t('stat_trend_stable') }}</span>
        </div>
      </div>

      <div class="card">
        <div class="stat-header">
          <div class="stat-label">{{ t('project_health') }}</div>
          <div class="stat-icon" style="background-color: #f0fdf4; color: #16a34a;">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M22 12h-4l-3 9L9 3l-3 9H2"></path>
            </svg>
          </div>
        </div>
        <div class="stat-value">98%</div>
        <div class="stat-trend trend-up">
          <span>{{ t('status_excellent') }}</span>
        </div>
      </div>
    </section>

    <div class="main-content animate-in delay-2">
      <section>
        <div class="section-header">
          <h2 class="section-title">{{ t('current_tasks') }}</h2>
          <div class="search-wrapper" :class="{ active: searchActive }">
            <input
              v-model="query"
              type="text"
              class="search-input"
              :placeholder="t('search_placeholder')"
            >
            <svg
              class="search-close"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              @click="closeSearch"
            >
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
            <button class="btn btn-outline" type="button" @click="openSearch">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <circle cx="11" cy="11" r="8"></circle>
                <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
              </svg>
              <span>{{ t('search_button') }}</span>
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
                <th>{{ t('table_task') }}</th>
                <th>{{ t('table_source') }}</th>
                <th>{{ t('table_deadline') }}</th>
                <th>{{ t('table_upstream') }}</th>
                <th>{{ t('table_downstream') }}</th>
                <th>{{ t('table_owner') }}</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="task in pagedTasks" :key="task.id">
                <td style="color: var(--text-tertiary);">{{ formatId(task.id) }}</td>
                <td>
                  <div style="font-weight: 500;">{{ t(task.titleKey) }}</div>
                  <div style="font-size: 12px; color: var(--text-secondary); margin-top: 2px;">{{ task.desc }}</div>
                </td>
                <td>
                  <span class="status-badge" :class="task.sourceType">{{ t(task.sourceKey) }}</span>
                </td>
                <td>{{ task.date }}</td>
                <td style="font-size: 12px;">{{ t(task.upstreamKey) }}</td>
                <td style="font-size: 12px; color: var(--text-tertiary);">{{ t(task.downstreamKey) }}</td>
                <td>
                  <div class="user-cell">
                    <div class="user-avatar" :style="task.color ? { backgroundColor: task.color } : null">{{ task.avatar }}</div>
                    <span>{{ t(task.ownerKey) }}</span>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>

          <div v-if="totalPages > 1" class="pagination-controls">
            <button class="page-btn" type="button" :disabled="currentPage === 1" @click="goPrev">
              {{ t('prev_page') }}
            </button>
            <button
              v-for="page in totalPages"
              :key="page"
              class="page-btn"
              :class="{ active: page === currentPage }"
              type="button"
              @click="goPage(page)"
            >
              {{ page }}
            </button>
            <button class="page-btn" type="button" :disabled="currentPage === totalPages" @click="goNext">
              {{ t('next_page') }}
            </button>
          </div>
        </div>
      </section>

      <section>
        <div class="section-header">
          <h2 class="section-title">{{ t('module_metrics') }}</h2>
        </div>
        <div class="metrics-grid">
          <div class="metric-item">
            <div class="metric-info">
              <h4>{{ t('overall_progress') }}</h4>
              <div class="val">{{ t('metric_progress_normal') }}</div>
            </div>
            <div class="metric-status status-green"></div>
          </div>
          <div class="metric-item">
            <div class="metric-info">
              <h4>{{ t('business_docking') }}</h4>
              <div class="val">{{ t('metric_follow_up') }}</div>
            </div>
            <div class="metric-status status-orange"></div>
          </div>
          <div class="metric-item">
            <div class="metric-info">
              <h4>{{ t('design_completion') }}</h4>
              <div class="val">95%</div>
            </div>
            <div class="metric-status status-blue"></div>
          </div>
          <div class="metric-item">
            <div class="metric-info">
              <h4>{{ t('procurement_process') }}</h4>
              <div class="val">{{ t('status_completed') }}</div>
            </div>
            <div class="metric-status status-green"></div>
          </div>
          <div class="metric-item">
            <div class="metric-info">
              <h4>{{ t('site_installation') }}</h4>
              <div class="val">{{ t('status_processing') }}</div>
            </div>
            <div class="metric-status status-blue"></div>
          </div>
          <div class="metric-item">
            <div class="metric-info">
              <h4>{{ t('system_debugging') }}</h4>
              <div class="val" style="color: var(--text-tertiary);">{{ t('metric_not_started') }}</div>
            </div>
            <div class="metric-status status-gray"></div>
          </div>
        </div>
      </section>
    </div>
  </div>
</template>

<script setup>
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue';
import { useI18n } from '@/utils/i18n';

const { t, formatDate } = useI18n();

const clockText = ref('');
const clockTimer = ref(null);
const langVersion = ref(0);
let onLanguageChangedHandler = null;

const updateClock = () => {
  const now = new Date();
  clockText.value = formatDate(now) || now.toLocaleString();
};

const tasks = [
  {
    id: 1,
    titleKey: 'task_ui_design',
    desc: 'UI/UX Design',
    sourceKey: 'source_design',
    sourceType: 'design',
    date: '2023-10-20',
    upstreamKey: 'role_senior_designer',
    downstreamKey: 'group_frontend',
    ownerKey: 'role_frontend',
    avatar: 'UI',
    color: ''
  },
  {
    id: 2,
    titleKey: 'task_api_dev',
    desc: 'Backend Dev',
    sourceKey: 'source_dev',
    sourceType: 'dev',
    date: '2023-10-22',
    upstreamKey: 'role_architect',
    downstreamKey: 'group_frontend',
    ownerKey: 'role_backend_expert',
    avatar: 'BE',
    color: '#8b5cf6'
  },
  {
    id: 3,
    titleKey: 'task_db_opt',
    desc: 'Database',
    sourceKey: 'source_ops',
    sourceType: 'ops',
    date: '2023-10-25',
    upstreamKey: 'role_dba',
    downstreamKey: 'group_backend',
    ownerKey: 'role_dba',
    avatar: 'DB',
    color: '#f59e0b'
  },
  {
    id: 4,
    titleKey: 'task_uat',
    desc: 'QA Testing',
    sourceKey: 'source_design',
    sourceType: 'design',
    date: '2023-10-28',
    upstreamKey: 'group_dev',
    downstreamKey: 'unit_client',
    ownerKey: 'role_qa',
    avatar: 'QA',
    color: '#ec4899'
  },
  {
    id: 5,
    titleKey: 'task_mobile_adapt',
    desc: 'Responsive',
    sourceKey: 'source_dev',
    sourceType: 'dev',
    date: '2023-10-30',
    upstreamKey: 'group_ui',
    downstreamKey: 'group_qa',
    ownerKey: 'role_frontend',
    avatar: 'FE',
    color: '#10b981'
  },
  {
    id: 6,
    titleKey: 'task_log_upgrade',
    desc: 'DevOps',
    sourceKey: 'source_ops',
    sourceType: 'ops',
    date: '2023-11-01',
    upstreamKey: 'role_architect',
    downstreamKey: 'group_ops',
    ownerKey: 'role_devops',
    avatar: 'OP',
    color: '#3b82f6'
  },
  {
    id: 7,
    titleKey: 'task_payment_int',
    desc: 'Payment',
    sourceKey: 'source_dev',
    sourceType: 'dev',
    date: '2023-11-03',
    upstreamKey: 'unit_product',
    downstreamKey: 'role_payment',
    ownerKey: 'role_payment',
    avatar: 'PY',
    color: '#6366f1'
  },
  {
    id: 8,
    titleKey: 'role_security',
    desc: 'Security',
    sourceKey: 'source_ops',
    sourceType: 'ops',
    date: '2023-11-05',
    upstreamKey: 'role_security',
    downstreamKey: 'group_dev',
    ownerKey: 'role_security',
    avatar: 'SC',
    color: '#ef4444'
  },
  {
    id: 9,
    titleKey: 'role_tech_writer',
    desc: 'Documentation',
    sourceKey: 'source_design',
    sourceType: 'design',
    date: '2023-11-07',
    upstreamKey: 'unit_ops',
    downstreamKey: 'unit_client',
    ownerKey: 'role_tech_writer',
    avatar: 'TW',
    color: '#8b5cf6'
  },
  {
    id: 10,
    titleKey: 'task_log_upgrade',
    desc: 'Infrastructure',
    sourceKey: 'source_ops',
    sourceType: 'ops',
    date: '2023-11-10',
    upstreamKey: 'role_architect',
    downstreamKey: 'group_dev',
    ownerKey: 'role_architect',
    avatar: 'AR',
    color: '#f59e0b'
  }
];

const ITEMS_PER_PAGE = 5;
const currentPage = ref(1);
const query = ref('');
const searchActive = ref(false);

const normalizedQuery = computed(() => query.value.trim().toLowerCase());

const filteredTasks = computed(() => {
  langVersion.value;
  if (!normalizedQuery.value) {
    return tasks;
  }
  return tasks.filter((task) => {
    const title = t(task.titleKey).toLowerCase();
    const source = t(task.sourceKey).toLowerCase();
    const desc = task.desc.toLowerCase();
    return title.includes(normalizedQuery.value) || source.includes(normalizedQuery.value) || desc.includes(normalizedQuery.value);
  });
});

const totalPages = computed(() => Math.max(1, Math.ceil(filteredTasks.value.length / ITEMS_PER_PAGE)));

const pagedTasks = computed(() => {
  const start = (currentPage.value - 1) * ITEMS_PER_PAGE;
  return filteredTasks.value.slice(start, start + ITEMS_PER_PAGE);
});

const openSearch = () => {
  searchActive.value = true;
};

const closeSearch = () => {
  searchActive.value = false;
  query.value = '';
};

const goPrev = () => {
  if (currentPage.value > 1) {
    currentPage.value -= 1;
  }
};

const goNext = () => {
  if (currentPage.value < totalPages.value) {
    currentPage.value += 1;
  }
};

const goPage = (page) => {
  currentPage.value = page;
};

const formatId = (value) => String(value).padStart(2, '0');

const toggleTheme = () => {
  const root = document.documentElement;
  const currentTheme = root.getAttribute('data-theme');
  const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
  root.setAttribute('data-theme', newTheme);
  localStorage.setItem('theme', newTheme);
};

const applyThemePreference = () => {
  const root = document.documentElement;
  const savedTheme = localStorage.getItem('theme');
  const systemDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
  if (savedTheme === 'dark' || (!savedTheme && systemDark)) {
    root.setAttribute('data-theme', 'dark');
  } else {
    root.setAttribute('data-theme', 'light');
  }
};

watch(normalizedQuery, () => {
  currentPage.value = 1;
});

watch(filteredTasks, () => {
  if (currentPage.value > totalPages.value) {
    currentPage.value = 1;
  }
});

onMounted(() => {
  applyThemePreference();
  updateClock();
  clockTimer.value = window.setInterval(updateClock, 1000);

  onLanguageChangedHandler = () => {
    langVersion.value += 1;
    updateClock();
  };

  window.addEventListener('languageChanged', onLanguageChangedHandler);
});

onBeforeUnmount(() => {
  if (onLanguageChangedHandler) {
    window.removeEventListener('languageChanged', onLanguageChangedHandler);
  }
  if (clockTimer.value) {
    clearInterval(clockTimer.value);
    clockTimer.value = null;
  }
});
</script>

<style scoped>
:global(:root) {
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

:global([data-theme="dark"]) {
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
  --shadow-lg: 0 10px 15px -3px rgb(0 0 0 / 0.3);
}

:global(body) {
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", sans-serif;
  background-color: var(--bg-body);
  color: var(--text-primary);
  line-height: 1.5;
  transition: background-color 0.3s ease, color 0.3s ease;
  -webkit-font-smoothing: antialiased;
}

* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

.app-container {
  max-width: 1400px;
  margin: 0 auto;
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 20px;
  min-height: 100vh;
}

header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-bottom: 16px;
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

.btn-primary {
  background-color: var(--primary-color);
  color: white;
  box-shadow: var(--shadow-sm);
}

.btn-primary:hover {
  background-color: var(--primary-hover);
  transform: translateY(-1px);
  box-shadow: var(--shadow-md);
}

.btn-outline {
  background-color: transparent;
  border-color: var(--border-color);
  color: var(--text-primary);
}

.btn-outline:hover {
  background-color: var(--bg-surface-hover);
  border-color: var(--text-secondary);
}

.header-actions .btn,
.header-actions .clock-display {
  height: var(--btn-height);
  border-radius: var(--btn-radius);
  box-shadow: var(--shadow-sm);
}

.theme-toggle {
  width: var(--btn-height);
  height: var(--btn-height);
  padding: 0;
  border-radius: var(--btn-radius);
}

.clock-display {
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  font-size: var(--btn-font-size);
  font-weight: var(--btn-font-weight);
  color: var(--text-primary);
  margin-right: 0;
  padding: var(--btn-padding);
  background: var(--bg-surface);
  border: 1px solid var(--border-color);
  border-radius: var(--btn-radius);
  box-shadow: var(--shadow-sm);
  display: inline-flex;
  align-items: center;
  gap: var(--btn-gap);
  transition: var(--transition-base);
}

.clock-display:hover {
  box-shadow: var(--shadow-md);
  transform: translateY(-1px);
  border-color: var(--text-secondary);
  background-color: var(--bg-surface-hover);
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 24px;
}

.card {
  background-color: var(--bg-surface);
  border-radius: var(--radius-lg);
  padding: 16px;
  box-shadow: var(--shadow-sm);
  border: 1px solid var(--border-color);
  transition: var(--transition-base);
  display: flex;
  flex-direction: column;
}

.card:hover {
  box-shadow: var(--shadow-md);
  transform: translateY(-2px);
}

.stat-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
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

.stat-label {
  color: var(--text-secondary);
  font-size: 14px;
  font-weight: 500;
}

.stat-value {
  font-size: 24px;
  font-weight: 700;
  color: var(--text-primary);
}

.stat-trend {
  font-size: 12px;
  margin-top: 4px;
  display: flex;
  align-items: center;
  gap: 4px;
}

.trend-up {
  color: #10b981;
}

.trend-neutral {
  color: var(--text-secondary);
}

.main-content {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.section-title {
  font-size: 18px;
  font-weight: 600;
  color: var(--text-primary);
}

.table-container {
  background-color: var(--bg-surface);
  border-radius: var(--radius-lg);
  border: 1px solid var(--border-color);
  overflow: hidden;
  box-shadow: var(--shadow-sm);
}

.table-container table td {
  padding: 10px 16px;
}

.table-container table th {
  padding: 10px 16px;
}

table {
  width: 100%;
  border-collapse: collapse;
  text-align: left;
}

th {
  background-color: var(--bg-body);
  color: var(--text-secondary);
  font-weight: 600;
  font-size: 12px;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  border-bottom: 1px solid var(--border-color);
}

td {
  border-bottom: 1px solid var(--border-color);
  color: var(--text-primary);
  font-size: 14px;
  transition: background-color 0.1s;
}

tr:last-child td {
  border-bottom: none;
}

tr:hover td {
  background-color: var(--bg-surface-hover);
}

.user-avatar {
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background-color: var(--primary-color);
  color: white;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-size: 10px;
  margin-right: 8px;
}

.user-cell {
  display: flex;
  align-items: center;
}

.status-badge {
  padding: 4px 8px;
  border-radius: 9999px;
  font-size: 12px;
  font-weight: 500;
}

.status-badge.design {
  background-color: #e0e7ff;
  color: #4338ca;
}

.status-badge.dev {
  background-color: #dbeafe;
  color: #1e40af;
}

.status-badge.ops {
  background-color: #fce7f3;
  color: #9d174d;
}

.metrics-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
  gap: 16px;
}

.metric-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px;
  background-color: var(--bg-surface);
  border: 1px solid var(--border-color);
  border-radius: var(--radius-md);
  transition: var(--transition-base);
}

.metric-item:hover {
  transform: translateX(4px);
  border-color: var(--primary-color);
}

.metric-info h4 {
  font-size: 14px;
  color: var(--text-secondary);
  font-weight: 500;
  margin-bottom: 4px;
}

.metric-info .val {
  font-size: 16px;
  font-weight: 600;
  color: var(--text-primary);
}

.metric-status {
  width: 8px;
  height: 8px;
  border-radius: 50%;
}

.status-green {
  background-color: #10b981;
  box-shadow: 0 0 0 4px rgba(16, 185, 129, 0.1);
}

.status-blue {
  background-color: #3b82f6;
  box-shadow: 0 0 0 4px rgba(59, 130, 246, 0.1);
}

.status-orange {
  background-color: #f59e0b;
  box-shadow: 0 0 0 4px rgba(245, 158, 11, 0.1);
}

.status-gray {
  background-color: #94a3b8;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-in {
  animation: fadeIn 0.5s ease-out forwards;
}

.delay-1 {
  animation-delay: 0.1s;
}

.delay-2 {
  animation-delay: 0.2s;
}

.delay-3 {
  animation-delay: 0.3s;
}

@keyframes blink {
  0%,
  100% {
    opacity: 1;
  }
  50% {
    opacity: 0.4;
  }
}

.blink-anim {
  animation: blink 2s infinite ease-in-out;
}

.stat-value.urgent {
  color: #ef4444;
  animation: blink 1s infinite ease-in-out;
}

.search-wrapper {
  display: flex;
  align-items: center;
  gap: 8px;
  position: relative;
}

.search-input {
  width: 0;
  padding: 0;
  border: none;
  outline: none;
  background: transparent;
  transition: width 0.3s ease, padding 0.3s ease;
  font-size: 14px;
  color: var(--text-primary);
  opacity: 0;
}

.search-wrapper.active .search-input {
  width: 200px;
  padding: 6px 12px;
  border: 1px solid var(--border-color);
  border-radius: var(--radius-md);
  background-color: var(--bg-surface);
  opacity: 1;
}

.search-close {
  display: none;
  cursor: pointer;
  color: var(--text-tertiary);
}

.search-wrapper.active .search-close {
  display: block;
}

.pagination-controls {
  display: flex;
  justify-content: center;
  align-items: center;
  padding-top: 16px;
  gap: 8px;
}

.page-btn {
  padding: 6px 12px;
  border: 1px solid var(--border-color);
  background-color: var(--bg-surface);
  border-radius: var(--radius-md);
  cursor: pointer;
  font-size: 14px;
  color: var(--text-primary);
  transition: var(--transition-base);
}

.page-btn:hover:not(:disabled) {
  background-color: var(--bg-background);
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
</style>
