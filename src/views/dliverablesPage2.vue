<template>
  <div class="dliverables-page">
    <canvas id="bgCanvas"></canvas>
    <div class="grid-bg"></div>
    <div class="glow-orb orb1"></div>
    <div class="glow-orb orb2"></div>
    <div class="glow-orb orb3"></div>
    <div class="data-flow-line line1"></div>
    <div class="data-flow-line line2"></div>

    <div class="page">
      <header class="header">
        <div class="header-time" id="headerTime">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="12" cy="12" r="10" />
            <path d="M12 6v6l4 2" stroke-linecap="round" />
          </svg>
          <span>{{ currentTime }}</span>
        </div>
        <div class="header-title">
          <h1 v-i18n="'TIC Design Deliverables'">TIC设计交付物看板</h1>
        </div>
        <div class="nav-right">
          <button class="nav-btn" @click="router.push('/dliverables')" v-i18n="'浅色'">旧页面</button>
          <button class="nav-btn" @click="toggleLanguage">中/EN</button>
        </div>
      </header>

      <div class="main">
        <aside class="sidebar">
          <div class="panel">
            <div class="panel-body-no-header">
              <div class="filter-section">
                <label class="filter-label" v-i18n="'File Type'">文件类型</label>
                <div class="select-wrapper">
                  <select class="filter-select" v-model="filters.selectedDisciplines">
                    <option v-for="item in disciplineOptions" :key="item" :value="item" v-i18n="item">{{ item }}</option>
                  </select>
                </div>
              </div>

              <div class="filter-section">
                <label class="filter-label" v-i18n="'Completion Status'">完成状态</label>
                <div class="select-wrapper">
                  <select class="filter-select" v-model="filters.completionStatus">
                    <option value="All">All</option>
                    <option v-for="item in statusOptions" :key="item" :value="item.value" v-i18n="item.label">{{ item.label }}</option>
                  </select>
                </div>
              </div>

              <div class="filter-section">
                <label class="filter-label" v-i18n="'Design Phase'">设计阶段</label>
                <div class="select-wrapper">
                  <select class="filter-select" v-model="filters.selectedDesignPhase">
                    <option value="All">All</option>
                    <option v-for="item in designPhases" :key="item" :value="item" v-i18n="item">{{ item }}</option>
                  </select>
                </div>
              </div>

              <div class="filter-section">
                <label class="filter-label" v-i18n="'Version'">版本号</label>
                <div class="select-wrapper">
                  <select class="filter-select" v-model="filters.selectedVersion">
                    <option value="All">All</option>
                    <option v-for="item in versions" :key="item" :value="item" v-i18n="item">{{ item }}</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        </aside>

        <section class="content-area">
          <div class="panel">
            <div class="panel-header">
              <div class="panel-title" v-i18n="'Statistical Analysis Of Milestone Completion Status'">里程碑节点完成情况统计<span class="breathing-dot blue"></span></div>
              <div class="panel-header-stats">
                <div class="header-stat-item">
                  <span class="header-stat-label" v-i18n="'Percentage of Plan Completion'">总体计划完成比例</span>
                  <span class="header-stat-value" style="color: #00f0c8;">{{ milestoneData[0]?.ZT_JHWCBL }}%</span>
                </div>
                <div class="header-stat-item">
                  <span class="header-stat-label" v-i18n="'Actual Completion Percentage'">总体实际完成比例</span>
                  <span class="header-stat-value" style="color: #00d4ff;">{{ milestoneData[0]?.ZT_SJWCBL }}%</span>
                </div>
              </div>
            </div>
            <div class="panel-body-no-header">
              <div class="chart-nav">
                <button class="chart-nav-btn" @click="milestonePrevPage">&lt;</button>
                <div class="chart-container" ref="completionChartRef"></div>
                <button class="chart-nav-btn" @click="milestoneNextPage">&gt;</button>
              </div>
            </div>
          </div>
        </section>
      </div>

      <div class="bottom-section">
        <div class="panel bottom-panel">
          <div class="panel-header">
            <div class="panel-title" v-i18n="'统计概览'">统计概览<span class="breathing-dot green"></span></div>
          </div>
          <div class="panel-body">
            <div class="stats-overview-grid">
              <div class="stat-big-card">
                <div class="stat-big-label" v-i18n="'Approval Documents'">已提交数量</div>
                <div class="stat-big-value cyan">{{ stats.submittedCount }}</div>
              </div>
              <div class="stat-big-card">
                <div class="stat-big-label" v-i18n="'Forecast Documents'">设计交付物清单总数</div>
                <div class="stat-big-value purple">{{ stats.totalCount }}</div>
              </div>
              <div class="gauge-wrapper">
                <div class="gauge-item">
                  <div class="gauge-chart" ref="gauge1Ref"></div>
                  <div class="gauge-label" v-i18n="'Percentage of STSTRA Submissions'">STSTRA提交占比</div>
                </div>
                <div class="gauge-item">
                  <div class="gauge-chart" ref="gauge2Ref"></div>
                  <div class="gauge-label" v-i18n="'Progress by Doc.Deliveries'">文件审批占比</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="panel bottom-panel">
          <div class="panel-header">
            <div class="panel-title" v-i18n="'Distribution Chart Of Completion Status For Each Specialty'">各专业完成状态分布图<span class="breathing-dot orange"></span></div>
          </div>
          <div class="panel-body-no-header">
            <div class="chart-container" ref="professionChartRef"></div>
          </div>
        </div>
      </div>

      <div class="bottom-section full-width">
        <div class="panel">
          <div class="panel-header">
            <div class="panel-title" v-i18n="'Distribution of Deliverable Status'">交付物状态分布<span class="breathing-dot purple"></span></div>
          </div>
          <div class="panel-body">
            <table class="data-table">
              <thead>
                <tr>
                  <th v-i18n="'File Type'">版本</th>
                  <th v-for="item in statisticsTableColumns" :key="item" v-i18n="item">{{ item }}</th>
                  <th v-i18n="'TOTAL'">TOTAL</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(item, index) in statisticsTable" :key="index">
                  <td>
                    <div v-if="index < statisticsTable.length - 1">Delivery - {{ item.FILE_VERSION }}</div>
                    <div v-else>{{ item.FILE_VERSION }}</div>
                  </td>
                  <td v-for="_item in statisticsTableColumns" :key="_item">{{ item[_item.replaceAll(' ', '_')] }}</td>
                  <td>{{ item.TOTAL }}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <div class="bottom-section full-width">
        <div class="panel">
          <div class="panel-header">
            <div class="panel-title" v-i18n="'任务清单'">任务清单<span class="breathing-dot cyan"></span></div>
            <nav class="pagination" v-if="totalPages > 1">
              <button class="page-btn" :class="{ disabled: currentPage === 1 }" @click="prevPage" :disabled="currentPage === 1" v-i18n="'prev_page'">上一页</button>
              <button 
                v-for="page in totalPages" 
                :key="page"
                class="page-btn" 
                :class="{ active: currentPage === page }"
                @click="goToPage(page)"
              >{{ page }}</button>
              <button class="page-btn" :class="{ disabled: currentPage === totalPages }" @click="nextPage" :disabled="currentPage === totalPages" v-i18n="'next_page'">下一页</button>
            </nav>
          </div>
          <div class="panel-body">
            <table class="data-table task-table">
              <thead>
                <tr>
                  <th v-i18n="'File Number'">File Number</th>
                  <th v-i18n="'Deliverable Name'">Deliverable Name</th>
                  <th v-i18n="'File Type'">File Type</th>
                  <th v-i18n="'Design Phase'">Design Phase</th>
                  <th v-i18n="'Version'">Version</th>
                  <th v-i18n="'Due Date'">Due Date</th>
                  <th v-i18n="'Progress'">Progress</th>
                  <th v-i18n="'Actual Date'">Actual Date</th>
                  <th v-i18n="'Completion Status'">Completion Status</th>
                </tr>
              </thead>
              <tbody id="taskListBody">
                <tr 
                  v-for="task in tableRows" 
                  :key="task.id"
                  :data-filetype="task.selectedDisciplines"
                  :data-status="task.COMPLETION_STATUS"
                  :data-stage="task.stage"
                  :data-version="task.version"
                >
                  <td>{{ task.CRHK_DDLI_CPTM }}</td>
                  <td>{{ task.CRHK_RL_JFWMC }}</td>
                  <td v-i18n="task.CRHK_PPR_WJLX_XL">{{ task.CRHK_PPR_WJLX_XL }}</td>
                  <td v-i18n="task.CRHK_DDL_SJJD_PD">{{ task.CRHK_DDL_SJJD_PD }}</td>
                  <td v-i18n="task.CRHK_DDLI_DQBB_XL">{{ task.CRHK_DDLI_DQBB_XL }}</td>
                  <td>{{ task.CRHK_DDLI_TJLBBSJ }}</td>
                  <td class="num">{{ task.CRHK_DDR_WCBL_SM && task.CRHK_DDR_WCBL_SM}}</td>
                  <td>{{ task.CRHK_DDLI_STRASJWC || '--' }}</td>
                  <td>
                    <span :class="getStatusBadgeClass(task.COMPLETION_STATUS)" v-i18n="getStatusLabel(task.COMPLETION_STATUS)">{{ getStatusLabel(task.COMPLETION_STATUS) }}</span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted, onUnmounted, onBeforeUnmount, watch, nextTick } from 'vue'
import * as echarts from 'echarts'
import axios from "../assets/axios/dliverablesPage.js"
import router from '@/router'

// 响应式数据
const currentTime = ref('')
const completionChartRef = ref(null)
const professionChartRef = ref(null)
const gauge1Ref = ref(null)
const gauge2Ref = ref(null)

// 筛选条件
const filters = reactive({
  selectedDisciplines: 'All',
  completionStatus: 'All',
  selectedDesignPhase: 'All',
  selectedVersion: 'All'
})

// 统计数据
const stats = reactive({
  submittedCount: 0,
  totalCount: 0
})

// 任务数据
const tasks = ref([])

// 筛选后的任务列表
const filteredTasks = computed(() => {
  const query = {
    version: filters.selectedVersion === 'All' ? '' : filters.selectedVersion,
    designPhase: filters.selectedDesignPhase === 'All' ? '' : filters.selectedDesignPhase,
    fileType: filters.selectedDisciplines === 'All' ? '' : filters.selectedDisciplines,
  }
  axios.getTable3Data(query)
  .then(res => {
    statisticsTable.value = filters.selectedVersion === 'All' ? res.data.data : res.data.data.filter(item => [filters.selectedVersion, '总计'].includes(item.FILE_VERSION))
    statisticsTableColumns.value = filters.selectedDisciplines === 'All' ? FileTypeOptions : [ filters.selectedDisciplines ]
    currentPage.value = 1
  })
  return tasks.value.filter(task => {
    if (filters.selectedDisciplines !== 'All' && task.CRHK_PPR_WJLX_XL !== filters.selectedDisciplines) return false
    if (filters.completionStatus !== 'All' && task.COMPLETION_STATUS !== filters.completionStatus) return false
    if (filters.selectedDesignPhase !== 'All' && task.CRHK_DDL_SJJD_PD !== filters.selectedDesignPhase) return false
    if (filters.selectedVersion !== 'All' && task.CRHK_DDLI_DQBB_XL !== filters.selectedVersion) return false
    return true
  })
})

const currentPage = ref(1)
const ITEMS_PER_PAGE = 100
const totalPages = computed(() => Math.ceil(filteredTasks.value.length / ITEMS_PER_PAGE))

const tableRows = computed(() => {
  const start = (currentPage.value - 1) * ITEMS_PER_PAGE
  return filteredTasks.value.slice(start, start + ITEMS_PER_PAGE)
  // return filteredTasks.value.slice(0, 100)
})
const prevPage = () => { if (currentPage.value > 1) currentPage.value-- }
const nextPage = () => { if (currentPage.value < totalPages.value) currentPage.value++ }
const goToPage = (page) => { currentPage.value = page }

// 更新时间
const updateTime = () => {
  const now = new Date()
  const year = now.getFullYear()
  const month = String(now.getMonth() + 1).padStart(2, '0')
  const day = String(now.getDate()).padStart(2, '0')
  const hours = String(now.getHours()).padStart(2, '0')
  const minutes = String(now.getMinutes()).padStart(2, '0')
  const seconds = String(now.getSeconds()).padStart(2, '0')
  currentTime.value = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`
}

// 状态标签和样式辅助函数
const getStatusLabel = (status) => {
  const found = statusOptions.find((item) => item.value === status)
  return found ? found.label : value
}

const getStatusBadgeClass = (status) => {
  const map = {
    '如期完成': 'status-badge status-completed',
    '进行中': 'status-badge status-inprogress',
    '延期未完成': 'status-badge status-delayed',
    '延期已完成': 'status-badge status-pending'
  }
  return map[status] || 'status-badge'
}

// 图表实例
let completionChart = null
let professionChart = null
let gauge1 = null
let gauge2 = null

// 里程碑数据
const milestoneData = ref([
  { name: 'RDA001', plan: 0, actual: 0 },
  { name: 'RDA002', plan: 0, actual: 0 },
  { name: 'TEL001', plan: 19.02, actual: 0 },
  { name: 'TEL002', plan: 0, actual: 0 },
  { name: 'SIN001', plan: 62.5, actual: 46.88 },
  { name: 'SIN002', plan: 22.22, actual: 22.22 },
  { name: 'ENB001-018', plan: 0, actual: 0 },
  { name: 'ENB019', plan: 0, actual: 0 },
  { name: 'RAM001', plan: 35.5, actual: 20.0 },
  { name: 'RAM002', plan: 48.0, actual: 30.5 },
  { name: 'INT001', plan: 15.0, actual: 10.0 },
  { name: 'INT002', plan: 25.0, actual: 18.0 }
])

let currentMilestonePage = 0
const itemsPerPage = 6

// 里程碑翻页
const milestonePrevPage = () => {
  if (currentMilestonePage > 0) {
    currentMilestonePage--
    updateMilestoneChart()
  }
}

const milestoneNextPage = () => {
  if (currentMilestonePage < totalPages - 1) {
    currentMilestonePage++
    updateMilestoneChart()
  }
}

const updateMilestoneChart = () => {
  if (!completionChart) return
  const start = currentMilestonePage * itemsPerPage
  const end = Math.min(start + itemsPerPage, milestoneData.value.length)
  const pageData = milestoneData.value.slice(start, end)
  
  completionChart.setOption({
    xAxis: {
      data: pageData.map(item => item.CRRC_PCA_ZYMC)
    },
    series: [
      { data: pageData.map(item => item.JHWCBL) },
      { data: pageData.map(item => item.SJWCBL) }
    ]
  })
}

// 初始化所有图表
const renderReviewChart = () => {
  if (!completionChartRef.value) return
  
  completionChart = echarts.init(completionChartRef.value)

  const completionOption = {
    backgroundColor: 'transparent',
    tooltip: {
      trigger: 'axis',
      axisPointer: { type: 'shadow' },
      backgroundColor: 'rgba(6, 18, 48, 0.95)',
      borderColor: 'rgba(0, 212, 255, 0.2)',
      borderWidth: 1,
      textStyle: { color: '#eaf4ff' }
    },
    legend: {
      data: [window.i18nManager.getText('计划完成比例'), window.i18nManager.getText('实际完成比例')],
      textStyle: { color: '#a3ccec' },
      top: 15,
      left: 'center'
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '12%',
      top: 45,
      containLabel: true
    },
    xAxis: {
      type: 'category',
      data: milestoneData.value.slice(0, itemsPerPage).map(item => item.CRRC_PCA_ZYMC),
      axisLine: { lineStyle: { color: 'rgba(0, 180, 255, 0.2)' } },
      axisLabel: { color: '#6b9ec4', fontSize: 11 },
      axisTick: { show: false }
    },
    yAxis: {
      type: 'value',
      name: '完成比例',
      nameTextStyle: { color: '#6b9ec4', fontSize: 11 },
      min: 0,
      max: 100,
      interval: 20,
      axisLine: { show: false },
      axisLabel: { color: '#6b9ec4', fontSize: 10, formatter: '{value}%' },
      splitLine: { lineStyle: { color: 'rgba(0, 180, 255, 0.08)', type: 'dashed' } }
    },
    series: [
      {
        name: window.i18nManager.getText('计划完成比例'),
        type: 'bar',
        data: milestoneData.value.slice(0, itemsPerPage).map(item => item.JHWCBL),
        barWidth: '22%',
        itemStyle: {
          color: '#00e5b8',
          borderRadius: [4, 4, 0, 0],
          shadowColor: 'rgba(0, 229, 184, 0.5)',
          shadowBlur: 15,
          shadowOffsetY: 3,
          borderColor: '#00ffd7',
          borderWidth: 1
        },
        label: {
          show: true,
          position: 'top',
          color: '#00e5b8',
          fontSize: 11,
          formatter: '{c}%',
          fontWeight: 'bold'
        }
      },
      {
        name: window.i18nManager.getText('实际完成比例'),
        type: 'bar',
        data: milestoneData.value.slice(0, itemsPerPage).map(item => item.SJWCBL),
        barWidth: '22%',
        itemStyle: {
          color: '#00c8ff',
          borderRadius: [4, 4, 0, 0],
          shadowColor: 'rgba(0, 200, 255, 0.5)',
          shadowBlur: 15,
          shadowOffsetY: 3,
          borderColor: '#00e0ff',
          borderWidth: 1
        },
        label: {
          show: true,
          position: 'top',
          color: '#00c8ff',
          fontSize: 11,
          formatter: '{c}%',
          fontWeight: 'bold'
        }
      }
    ]
  }


  completionChart.setOption(completionOption)
}

const renderChart = () => {
  professionChart = echarts.init(professionChartRef.value)
  gauge1 = echarts.init(gauge1Ref.value)
  gauge2 = echarts.init(gauge2Ref.value)

  const labels = disciplineOptions.map(item => window.i18nManager.getText(item));
  labels.shift();

  const statusMap = {
    '如期完成': { key: window.i18nManager.getText('completed'), color: new echarts.graphic.LinearGradient(0, 0, 1, 0, [
      { offset: 0, color: '#00ffd7' },
      { offset: 0.5, color: '#00e5b8' },
      { offset: 1, color: '#00b38c' }
    ]), shadowColor: 'rgba(0, 229, 184, 0.6)', borderColor: '#00ffd7'},
    '延期未完成': { key: window.i18nManager.getText('Delayed But Not'), color: new echarts.graphic.LinearGradient(0, 0, 1, 0, [
      { offset: 0, color: '#ff6b7a' },
      { offset: 0.5, color: '#ff4757' },
      { offset: 1, color: '#cc3945' }
    ]), shadowColor: 'rgba(255, 71, 87, 0.6)', borderColor: '#ff6b7a'},
    '进行中': { key: window.i18nManager.getText('In Progress'), color: new echarts.graphic.LinearGradient(0, 0, 1, 0, [
      { offset: 0, color: '#00e0ff' },
      { offset: 0.5, color: '#00c8ff' },
      { offset: 1, color: '#00a0cc' }
    ]), shadowColor: 'rgba(0, 200, 255, 0.6)', borderColor: '#00e0ff'},
    '延期已完成': { key: window.i18nManager.getText('Delayed But Completed'), color: new echarts.graphic.LinearGradient(0, 0, 1, 0, [
      { offset: 0, color: '#ffb86c' },
      { offset: 0.5, color: '#ff9f43' },
      { offset: 1, color: '#cc7f36' }
    ]), shadowColor: 'rgba(255, 159, 67, 0.6)', borderColor: '#ffb86c'},
  };

  // 2. 为每个 discipline 计算各状态的数量
  const rawData = labels.map((sp) => {
    const statusCounts = {};
    Object.keys(statusMap).forEach((label) => {
      statusCounts[label] = filteredTasks.value.filter(
        (item) => window.i18nManager.getText(item.CRHK_PPR_WJLX_XL) === sp && item.COMPLETION_STATUS === label
      ).length;
    });
    return { name: sp, counts: statusCounts, total: Object.values(statusCounts).reduce((a,b) => a+b, 0) };
  });

  // 3. 过滤掉 total === 0 的类别
  const filteredRawData = rawData.filter(item => item.total > 0);

  // 4. 生成最终的 labels 和 datasets
  const finalLabels = filteredRawData.map(item => item.name);

  const datasets = Object.keys(statusMap).map((label) => {
    const cfg = statusMap[label];
    return {
      name: cfg.key,
      type: 'bar',
      stack: 'total',
      data: filteredRawData.map(item => item.counts[label]),
      barWidth: '55%',
      itemStyle: {
        color: cfg.color,
        borderRadius: [4, 4, 4, 4],
        shadowColor: cfg.shadowColor,
        shadowBlur: 15,
        shadowOffsetX: 3,
        shadowOffsetY: 3,
        borderColor: cfg.borderColor,
        borderWidth: 2
      },
      label: {
        show: true,
        position: 'inside',
        color: '#fff',
        fontSize: 12,
        fontWeight: 'bold',
        formatter: (params) => params.value > 0 ? params.value : ''
      },
      icon: 'circle',
    };
  });

  const professionOption = {
    backgroundColor: 'transparent',
    tooltip: {
      trigger: 'axis',
      axisPointer: { type: 'shadow' },
      backgroundColor: 'rgba(6, 18, 48, 0.95)',
      borderColor: 'rgba(0, 212, 255, 0.2)',
      borderWidth: 1,
      textStyle: { color: '#eaf4ff' }
    },
    legend: {
      data: datasets,
      textStyle: { color: '#a3ccec', fontSize: 13 },
      top: 8,
      left: 'center',
      itemWidth: 12,
      itemHeight: 12,
      itemGap: 20
    },
    grid: {
      left: '1%',
      right: '8%',
      bottom: '12%',
      top: 54,
      containLabel: true
    },
    xAxis: {
      type: 'value',
      name: '数量',
      nameTextStyle: { color: '#8bb8dc', fontSize: 13, fontWeight: 'bold' },
      axisLine: { lineStyle: { color: 'rgba(0, 180, 255, 0.35)' } },
      axisLabel: { color: '#8bb8dc', fontSize: 12, fontWeight: 'bold' },
      splitLine: { lineStyle: { color: 'rgba(0, 180, 255, 0.08)', type: 'dashed' } },
      min: 0,
    },
    yAxis: {
      type: 'category',
      data: finalLabels,
      axisLine: { lineStyle: { color: 'rgba(0, 180, 255, 0.25)' } },
      axisLabel: { color: '#8bb8dc', fontSize: 14, fontWeight: 'bold' }
    },
    series: datasets
  }

  professionChart.off('click'); // 避免重复绑定
  professionChart.on('click', function(params) {
    if (params.componentType === 'series') {
      const originalDisciplineName = params.name;
      // 找到在原始 disciplineOptions 中的位置（需要处理国际化匹配）
      const originalIndex = disciplineOptions.findIndex(
        opt => window.i18nManager.getText(opt) === originalDisciplineName
      );
      if (originalIndex > -1) {
        filters.selectedDisciplines = disciplineOptions[originalIndex];
      }
      
      Object.keys(statusMap).forEach((label) => {
        if (statusMap[label].key === params.seriesName) {
          filters.completionStatus = label;
        }
      });
    }
  });

  const total = filteredTasks.value.length || 1
  stats.submittedCount = filteredTasks.value.filter((item) => ['0版本', '通过SPV审批', '通过TUV审批', '通过业主批复'].includes(item.CRHK_DDLI_DQBB_XL)).length
  stats.totalCount = total
  const gaugeOption1 = {
    backgroundColor: 'transparent',
    series: [{
      type: 'gauge',
      startAngle: 200,
      endAngle: -20,
      center: ['50%', '72%'],
      radius: '92%',
      min: 0,
      max: 100,
      splitNumber: 10,
      axisLine: {
        lineStyle: {
          width: 14,
          color: [
            [filteredTasks.value.filter((item) => ['0版本', '通过SPV审批', '通过TUV审批', '通过业主批复'].includes(item.CRHK_DDLI_DQBB_XL)).length / total, new echarts.graphic.LinearGradient(0, 0, 1, 0, [
              { offset: 0, color: '#00f0c8' },
              { offset: 1, color: '#00d4ff' }
            ])],
            [1, 'rgba(0, 180, 255, 0.08)']
          ]
        }
      },
      pointer: { show: false },
      axisTick: { show: false },
      splitLine: { show: false },
      axisLabel: { show: false },
      detail: {
        show: true,
        valueAnimation: true,
        formatter: '{value}%',
        color: '#00f0c8',
        fontSize: 24,
        fontWeight: 'bold',
        offsetCenter: [0, 0],
        textShadowColor: 'rgba(0, 240, 200, 0.8)',
        textShadowBlur: 12
      },
      data: [{ value: Math.ceil((filteredTasks.value.filter((item) => ['0版本', '通过SPV审批', '通过TUV审批', '通过业主批复'].includes(item.CRHK_DDLI_DQBB_XL)).length / total) * 100) }]
    }]
  }

  const gaugeOption2 = {
    backgroundColor: 'transparent',
    series: [{
      type: 'gauge',
      startAngle: 200,
      endAngle: -20,
      center: ['50%', '72%'],
      radius: '92%',
      min: 0,
      max: 100,
      splitNumber: 10,
      axisLine: {
        lineStyle: {
          width: 14,
          color: [
            [filteredTasks.value.filter((item) => ['通过业主批复'].includes(item.CRHK_DDLI_DQBB_XL)).length / total, new echarts.graphic.LinearGradient(0, 0, 1, 0, [
              { offset: 0, color: '#d8b4fe' },
              { offset: 0.5, color: '#a78bfa' },
              { offset: 1, color: '#7c3aed' }
            ])],
            [1, 'rgba(139, 92, 246, 0.08)']
          ]
        }
      },
      pointer: { show: false },
      axisTick: { show: false },
      splitLine: { show: false },
      axisLabel: { show: false },
      detail: {
        show: true,
        valueAnimation: true,
        formatter: '{value}%',
        color: '#a78bfa',
        fontSize: 24,
        fontWeight: 'bold',
        offsetCenter: [0, 0],
        textShadowColor: 'rgba(167, 139, 250, 0.8)',
        textShadowBlur: 12
      },
      data: [{ value: Math.ceil((filteredTasks.value.filter((item) => ['通过业主批复'].includes(item.CRHK_DDLI_DQBB_XL)).length / total) * 100) }]
    }]
  }

  professionChart.setOption(professionOption)
  gauge1.setOption(gaugeOption1)
  gauge2.setOption(gaugeOption2)
}

// 背景动画 canvas
let animationFrameId = null
let canvasCtx = null
let canvasWidth = 0
let canvasHeight = 0
let particles = []
let lines = []

const initBackgroundCanvas = () => {
  const canvas = document.getElementById('bgCanvas')
  if (!canvas) return
  canvasCtx = canvas.getContext('2d')
  
  const resize = () => {
    canvasWidth = canvas.width = window.innerWidth
    canvasHeight = canvas.height = window.innerHeight
  }
  resize()
  window.addEventListener('resize', resize)

  const PARTICLE_COUNT = 50
  const LINE_COUNT = 6

  const createParticle = () => ({
    x: Math.random() * canvasWidth,
    y: Math.random() * canvasHeight,
    vx: (Math.random() - 0.5) * 0.3,
    vy: (Math.random() - 0.5) * 0.3,
    r: Math.random() * 1.5 + 0.5,
    alpha: Math.random() * 0.3 + 0.1,
    pulse: Math.random() * Math.PI * 2,
    pulseSpeed: Math.random() * 0.01 + 0.005
  })

  const createLine = () => ({
    x: Math.random() * canvasWidth,
    y: Math.random() * canvasHeight,
    length: Math.random() * 200 + 100,
    speed: Math.random() * 0.5 + 0.2,
    alpha: Math.random() * 0.08 + 0.02,
    horizontal: Math.random() > 0.5,
    progress: Math.random()
  })

  for (let i = 0; i < PARTICLE_COUNT; i++) {
    particles.push(createParticle())
  }
  for (let i = 0; i < LINE_COUNT; i++) {
    lines.push(createLine())
  }

  const draw = () => {
    if (!canvasCtx) return
    canvasCtx.clearRect(0, 0, canvasWidth, canvasHeight)

    particles.forEach(p => {
      p.x += p.vx
      p.y += p.vy
      p.pulse += p.pulseSpeed
      if (p.x < 0) p.x = canvasWidth
      if (p.x > canvasWidth) p.x = 0
      if (p.y < 0) p.y = canvasHeight
      if (p.y > canvasHeight) p.y = 0

      const currentAlpha = p.alpha * (0.5 + 0.5 * Math.sin(p.pulse))
      canvasCtx.beginPath()
      canvasCtx.arc(p.x, p.y, p.r, 0, Math.PI * 2)
      canvasCtx.fillStyle = `rgba(0, 200, 255, ${currentAlpha})`
      canvasCtx.fill()
      canvasCtx.beginPath()
      canvasCtx.arc(p.x, p.y, p.r * 3, 0, Math.PI * 2)
      canvasCtx.fillStyle = `rgba(0, 200, 255, ${currentAlpha * 0.15})`
      canvasCtx.fill()
    })

    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x
        const dy = particles[i].y - particles[j].y
        const dist = Math.sqrt(dx * dx + dy * dy)
        if (dist < 150) {
          const lineAlpha = (1 - dist / 150) * 0.06
          canvasCtx.beginPath()
          canvasCtx.moveTo(particles[i].x, particles[i].y)
          canvasCtx.lineTo(particles[j].x, particles[j].y)
          canvasCtx.strokeStyle = `rgba(0, 180, 255, ${lineAlpha})`
          canvasCtx.lineWidth = 0.5
          canvasCtx.stroke()
        }
      }
    }

    lines.forEach(l => {
      l.progress += l.speed * 0.002
      if (l.progress > 1) l.progress = 0
      const alpha = l.alpha * Math.sin(l.progress * Math.PI)
      canvasCtx.beginPath()
      if (l.horizontal) {
        const startX = l.x - l.length / 2
        const endX = l.x + l.length / 2
        const grad = canvasCtx.createLinearGradient(startX, l.y, endX, l.y)
        grad.addColorStop(0, `rgba(0, 180, 255, 0)`)
        grad.addColorStop(0.5, `rgba(0, 180, 255, ${alpha})`)
        grad.addColorStop(1, `rgba(0, 180, 255, 0)`)
        canvasCtx.strokeStyle = grad
        canvasCtx.moveTo(startX, l.y)
        canvasCtx.lineTo(endX, l.y)
      } else {
        const startY = l.y - l.length / 2
        const endY = l.y + l.length / 2
        const grad = canvasCtx.createLinearGradient(l.x, startY, l.x, endY)
        grad.addColorStop(0, `rgba(0, 180, 255, 0)`)
        grad.addColorStop(0.5, `rgba(0, 180, 255, ${alpha})`)
        grad.addColorStop(1, `rgba(0, 180, 255, 0)`)
        canvasCtx.strokeStyle = grad
        canvasCtx.moveTo(l.x, startY)
        canvasCtx.lineTo(l.x, endY)
      }
      canvasCtx.lineWidth = 0.5
      canvasCtx.stroke()
    })

    animationFrameId = requestAnimationFrame(draw)
  }

  draw()
}

// 监听筛选变化重新计算统计
// watch([filteredTasks], () => {
//   stats.submittedCount = filteredTasks.value.filter(t => t.status === 'completed').length
// }, { immediate: true })

// 窗口 resize 处理
const handleResize = () => {
  if (completionChart) completionChart.resize()
  if (professionChart) professionChart.resize()
  if (gauge1) gauge1.resize()
  if (gauge2) gauge2.resize()
}

const mockData = ref([])
let disciplineOptions = ['All']
const statusOptions = [
  { value: '如期完成', label: 'completed', background: '#28a745' },
  { value: '延期未完成', label: 'Delayed But Not', background: '#dc3545' },
  { value: '进行中', label: 'In Progress', background: '#007bff' },
  { value: '延期已完成', label: 'Delayed But Completed', background: '#FFA500' },
]
let designPhases = []
let versions = []
let FileTypeOptions = []
const statisticsTableColumns = ref([])
const statisticsTable = ref([])

onMounted(async () => {
  // window.addEventListener('languageChanged', updateLanguage);
  updateTime()
  const timeInterval = setInterval(updateTime, 1000)

  const res = await axios.getTableData()
  milestoneData.value = res.data.data
  renderReviewChart()
  const res2 = await axios.getTable2Data()
  tasks.value = res2.data.data
  const optionRes = await axios.getOptionsList()
  designPhases = optionRes.data.data.sjjfw.DesignPhase
  disciplineOptions.push(...optionRes.data.data.sjjfw.FileType)
  FileTypeOptions = optionRes.data.data.sjjfw.FileType
  statisticsTableColumns.value = [...FileTypeOptions]
  versions.push(...optionRes.data.data.sjjfw.Version)
  renderChart()

  initBackgroundCanvas()
  window.addEventListener('resize', handleResize)
  
  onBeforeUnmount(() => {
    clearInterval(timeInterval)
    if (animationFrameId) cancelAnimationFrame(animationFrameId)
    window.removeEventListener('resize', handleResize)
    if (completionChart) completionChart.dispose()
    if (professionChart) professionChart.dispose()
    if (gauge1) gauge1.dispose()
    if (gauge2) gauge2.dispose()
  })
})
// const updateLanguage = () => {
//   renderChart()
// }
// onUnmounted(() => {
//   window.removeEventListener('languageChanged', updateLanguage);
// });
watch(filteredTasks, () => {
  renderChart()
})
const toggleLanguage = () => {
  if (window.i18nManager) {
    window.i18nManager.setLanguage(window.i18nManager.currentLang == 'zh' ? 'en' : 'zh');
    renderChart();
    renderReviewChart()
  }
}
</script>

<style lang="scss" scoped>
@import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@400;700;900&display=swap');

.dliverables-page {
  width: 100%;
  min-height: 100vh;
  background: #0A1936;
  // background: radial-gradient(ellipse at 15% 5%, rgba(0, 100, 255, 0.12) 0%, transparent 45%),
  //       radial-gradient(ellipse at 85% 5%, rgba(139, 92, 246, 0.08) 0%, transparent 45%),
  //       radial-gradient(ellipse at 50% 95%, rgba(0, 60, 180, 0.1) 0%, transparent 50%),
  //       radial-gradient(ellipse at 50% 50%, rgba(0, 40, 100, 0.06) 0%, transparent 60%),
  //       linear-gradient(180deg, #020a18 0%, #061228 40%, #0a1a3a 70%, #020a18 100%);
  font-family: "Microsoft YaHei", "PingFang SC", sans-serif;
  color: #eaf4ff;
  position: relative;
  overflow-x: hidden;

  #bgCanvas {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 0;
    pointer-events: none;
  }

  .grid-bg {
    position: fixed;
    inset: 0;
    z-index: 0;
    pointer-events: none;
    background-image: linear-gradient(rgba(0, 180, 255, 0.03) 1px, transparent 1px),
      linear-gradient(90deg, rgba(0, 180, 255, 0.03) 1px, transparent 1px);
    background-size: 60px 60px;
    mask-image: radial-gradient(ellipse at center, rgba(0, 0, 0, 0.5) 0%, transparent 75%);
    -webkit-mask-image: radial-gradient(ellipse at center, rgba(0, 0, 0, 0.5) 0%, transparent 75%);
  }

  .glow-orb {
    position: fixed;
    border-radius: 50%;
    pointer-events: none;
    z-index: 0;
    filter: blur(80px);
    animation: orbBreathe 8s ease-in-out infinite;
  }

  .orb1 {
    width: 400px;
    height: 400px;
    background: radial-gradient(circle, rgba(0, 100, 255, 0.08) 0%, transparent 70%);
    top: -100px;
    left: -100px;
  }

  .orb2 {
    width: 350px;
    height: 350px;
    background: radial-gradient(circle, rgba(139, 92, 246, 0.06) 0%, transparent 70%);
    top: 30%;
    right: -80px;
    animation-delay: 3s;
  }

  .orb3 {
    width: 300px;
    height: 300px;
    background: radial-gradient(circle, rgba(0, 212, 255, 0.05) 0%, transparent 70%);
    bottom: -50px;
    left: 30%;
    animation-delay: 5s;
  }

  .data-flow-line {
    position: fixed;
    pointer-events: none;
    z-index: 0;
  }

  .line1 {
    top: 15%;
    left: 0;
    width: 100%;
    height: 1px;
    background: linear-gradient(90deg, transparent 0%, rgba(0, 212, 255, 0.06) 20%, rgba(0, 212, 255, 0.12) 50%, rgba(0, 212, 255, 0.06) 80%, transparent 100%);
    animation: flowPulse 6s ease-in-out infinite;
  }

  .line2 {
    bottom: 25%;
    left: 0;
    width: 100%;
    height: 1px;
    background: linear-gradient(90deg, transparent 0%, rgba(139, 92, 246, 0.05) 20%, rgba(139, 92, 246, 0.1) 50%, rgba(139, 92, 246, 0.05) 80%, transparent 100%);
    animation: flowPulse 8s ease-in-out infinite;
    animation-delay: 2s;
  }

  @keyframes orbBreathe {
    0%, 100% { opacity: 0.6; transform: scale(1); }
    50% { opacity: 1; transform: scale(1.15); }
  }

  @keyframes flowPulse {
    0%, 100% { opacity: 0.3; }
    50% { opacity: 1; }
  }

  .page {
    position: relative;
    z-index: 1;
    width: 100%;
    // min-height: 100vh;
    display: flex;
    flex-direction: column;
    padding: 0 0 4px 0;
    animation: pageIn 1s ease-out both;
    gap: 4px;
  }

  @keyframes pageIn {
    from { opacity: 0; transform: translateY(12px); }
    to { opacity: 1; transform: translateY(0); }
  }

  .header {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 72px;
    padding: 0 24px;
    position: relative;
    flex-shrink: 0;
    border-bottom: 0px;
    // margin-bottom: -8px;

    &::before {
      content: '';
      position: absolute;
      bottom: -1px;
      left: 3%;
      right: 3%;
      height: 6px;
      background: linear-gradient(90deg, transparent 0%, rgba(0, 212, 255, 0.06) 15%, rgba(0, 212, 255, 0.12) 50%, rgba(0, 212, 255, 0.06) 85%, transparent 100%);
      filter: blur(4px);
    }
  }

  .header-time {
    position: absolute;
    left: 24px;
    display: flex;
    align-items: center;
    gap: 10px;
    color: #00d4ff;
    font-size: 19px;
    font-weight: 600;
    letter-spacing: 1.5px;
    // font-family: 'Orbitron', monospace;
    text-shadow: 0 0 16px rgba(0, 212, 255, 0.35);
  }

  .nav-right {
    display: flex;
    gap: 10px;
    position: absolute;
    right: 24px;
  }

  .nav-btn {
    padding: 8px 22px;
    border: 1px solid rgba(0, 180, 255, 0.2);
    background: rgba(0, 40, 100, 0.3);
    backdrop-filter: blur(12px);
    color: #a3ccec;
    font-size: 17px;
    cursor: pointer;
    border-radius: 8px;
    transition: all 0.35s cubic-bezier(0.4, 0, 0.2, 1);
    position: relative;
    overflow: hidden;

    &:hover {
      background: rgba(0, 100, 200, 0.3);
      border-color: #00d4ff;
      color: #00d4ff;
      box-shadow: 0 0 20px rgba(0, 212, 255, 0.2), inset 0 0 20px rgba(0, 212, 255, 0.05);
      transform: translateY(-1px);
    }
  }

  .header-title h1 {
    font-size: 28px;
    font-weight: 800;
    letter-spacing: 6px;
    background: linear-gradient(135deg, #ffffff 0%, #7ec8ff 40%, #a78bfa 70%, #00d4ff 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    filter: drop-shadow(0 0 20px rgba(0, 180, 255, 0.3));
    animation: titleShimmer 4s ease-in-out infinite;
    background-size: 200% 100%;
  }

  @keyframes titleShimmer {
    0%, 100% { background-position: 0% 50%; }
    50% { background-position: 100% 50%; }
  }

  .main {
    flex: 1;
    display: grid;
    grid-template-columns: 280px 1fr;
    gap: 4px;
    margin-top: 0;
    padding: 0 20px;
    padding-bottom: 0;
    min-height: 0;
  }

  .sidebar {
    flex-shrink: 0;
    display: flex;
    flex-direction: column;
    gap: 4px;
    min-height: 0;
    .panel {
      flex: 1;
    }
  }

  .content-area {
    display: flex;
    flex-direction: column;
    gap: 4px;
    min-height: 0;
    // margin-bottom: -32px;
  }

  .bottom-section {
    display: grid;
    grid-template-columns: 2fr 3fr;
    gap: 4px;
    padding: 0 20px 4px 20px;
    // margin-top: -24px;

    &.full-width {
      grid-template-columns: 1fr;
      margin-top: 0;
      padding: 0 20px 4px 20px;
    }
  }

  .panel {
    position: relative;
    padding: 10px 0px;
    border: 1px solid rgba(0, 180, 255, 0.15);
    // background: rgba(6, 18, 48, 0.65);
    background: #0F254A;
    backdrop-filter: blur(20px) saturate(1.4);
    border-radius: 14px;
    overflow: hidden;
    transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
    animation: panelIn 0.8s ease-out both;
    display: flex;
    flex-direction: column;
    min-height: 0;
    margin: 0;

    &:hover {
      border-color: rgba(0, 212, 255, 0.45);
      // background: rgba(10, 28, 68, 0.75);
      box-shadow: 0 8px 40px rgba(0, 100, 255, 0.1), 0 0 1px rgba(0, 212, 255, 0.3);
      transform: translateY(-2px);
    }

    &::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      height: 1px;
      background: linear-gradient(90deg, transparent 0%, rgba(0, 212, 255, 0.5) 30%, rgba(139, 92, 246, 0.4) 70%, transparent 100%);
      z-index: 2;
    }

    &::after {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      height: 40px;
      background: linear-gradient(180deg, rgba(0, 180, 255, 0.04) 0%, transparent 100%);
      pointer-events: none;
      z-index: 1;
    }
  }

  @keyframes panelIn {
    from { opacity: 0; transform: translateY(16px) scale(0.98); }
    to { opacity: 1; transform: translateY(0) scale(1); }
  }

  .panel-header {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 14px 20px 0px;
    position: relative;
    z-index: 2;

    &::before {
      content: '';
      width: 3px;
      height: 18px;
      background: linear-gradient(180deg, #00d4ff, #8b5cf6);
      border-radius: 2px;
      box-shadow: 0 0 10px rgba(0, 212, 255, 0.4);
      flex-shrink: 0;
    }
  }

  .panel-title {
    font-size: 19px;
    font-weight: 700;
    color: #ffffff;
    letter-spacing: 1.5px;
    display: flex;
    align-items: center;
    gap: 10px;
  }

  .breathing-dot {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    flex-shrink: 0;

    &.cyan {
      background: #00d4ff;
      box-shadow: 0 0 8px #00d4ff;
      animation: breatheCyan 2s ease-in-out infinite;
    }
    &.blue {
      background: #2a7fff;
      box-shadow: 0 0 8px #2a7fff;
      animation: breatheBlue 2s ease-in-out infinite;
    }
    &.purple {
      background: #8b5cf6;
      box-shadow: 0 0 8px #8b5cf6;
      animation: breathePurple 2s ease-in-out infinite;
    }
    &.orange {
      background: #ff9f43;
      box-shadow: 0 0 8px #ff9f43;
      animation: breatheOrange 2s ease-in-out infinite;
    }
    &.green {
      background: #00f0c8;
      box-shadow: 0 0 8px #00f0c8;
      animation: breatheGreen 2s ease-in-out infinite;
    }
  }

  @keyframes breatheCyan {
    0%, 100% { box-shadow: 0 0 6px #00d4ff; opacity: 0.7; }
    50% { box-shadow: 0 0 14px #00d4ff, 0 0 20px #00d4ff; opacity: 1; }
  }
  @keyframes breatheBlue {
    0%, 100% { box-shadow: 0 0 6px #2a7fff; opacity: 0.7; }
    50% { box-shadow: 0 0 14px #2a7fff, 0 0 20px #2a7fff; opacity: 1; }
  }
  @keyframes breathePurple {
    0%, 100% { box-shadow: 0 0 6px #8b5cf6; opacity: 0.7; }
    50% { box-shadow: 0 0 14px #8b5cf6, 0 0 20px #8b5cf6; opacity: 1; }
  }
  @keyframes breatheOrange {
    0%, 100% { box-shadow: 0 0 6px #ff9f43; opacity: 0.7; }
    50% { box-shadow: 0 0 14px #ff9f43, 0 0 20px #ff9f43; opacity: 1; }
  }
  @keyframes breatheGreen {
    0%, 100% { box-shadow: 0 0 6px #00f0c8; opacity: 0.7; }
    50% { box-shadow: 0 0 14px #00f0c8, 0 0 20px #00f0c8; opacity: 1; }
  }

  .panel-body {
    padding: 10px 20px 14px;
    position: relative;
    z-index: 2;
    overflow: auto;
  }

  .panel-body-no-header {
    padding: 0px 20px 4px;
    position: relative;
    z-index: 2;
    overflow: auto;
  }

  .filter-section {
    margin-bottom: 12px;

    &:last-child {
      margin-bottom: 0;
    }
  }

  .filter-label {
    font-size: 12px;
    color: #6b9ec4;
    margin-bottom: 6px;
    display: block;
    letter-spacing: 0.5px;
  }

  .filter-select {
    width: 100%;
    padding: 7px 12px;
    border: 1px solid rgba(0, 180, 255, 0.15);
    background: rgba(0, 40, 100, 0.3);
    backdrop-filter: blur(8px);
    color: #eaf4ff;
    font-size: 13px;
    border-radius: 8px;
    cursor: pointer;
    transition: all 0.3s;
    appearance: none;
    font-family: inherit;

    &:hover {
      border-color: rgba(0, 212, 255, 0.35);
      background: rgba(0, 60, 120, 0.3);
    }
    &:focus {
      outline: none;
      border-color: #00d4ff;
      box-shadow: 0 0 12px rgba(0, 212, 255, 0.2);
    }
  }

  .select-wrapper {
    position: relative;

    &::after {
      content: '\25BC';
      position: absolute;
      right: 12px;
      top: 50%;
      transform: translateY(-50%);
      color: #00d4ff;
      font-size: 12px;
      pointer-events: none;
      z-index: 1;
    }
  }

  .stats-overview-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    grid-template-rows: auto auto;
    gap: 4px;
    align-items: start;
  }

  .stat-big-card {
    text-align: center;
    padding: 10px 6px;
    background: rgba(10, 30, 60, 0.5);
    border-radius: 10px;
    border: 1px solid rgba(0, 212, 255, 0.15);
  }

  .stat-big-value {
    font-size: 28px;
    font-weight: 700;
    // font-family: 'Orbitron', monospace;
    line-height: 1.2;

    &.cyan { color: #00d4ff; text-shadow: 0 0 20px rgba(0, 212, 255, 0.4); }
    &.purple { color: #8b5cf6; text-shadow: 0 0 20px rgba(139, 92, 246, 0.4); }
  }

  .stat-big-label {
    font-size: 11px;
    color: #6b9ec4;
    margin-bottom: 2px;
  }

  .gauge-wrapper {
    grid-column: 1 / -1;
    display: flex;
    justify-content: space-around;
    align-items: flex-start;
    gap: 4px;
  }

  .gauge-item {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 4px;
  }

  .gauge-label {
    font-size: 11px;
    color: #6b9ec4;
    letter-spacing: 0.5px;
    text-align: center;
    white-space: nowrap;
  }

  .gauge-chart {
    width: 160px;
    height: 140px;
  }

  .chart-container {
    width: 100%;
    height: 100%;
    min-height: 260px;
  }

  .chart-nav {
    display: flex;
    align-items: center;
    gap: 4px;
    width: 100%;
    height: 100%;
  }

  .chart-nav-btn {
    width: 32px;
    height: 60px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: rgba(0, 60, 140, 0.3);
    border: 1px solid rgba(0, 180, 255, 0.2);
    color: #00d4ff;
    font-size: 18px;
    font-weight: bold;
    cursor: pointer;
    border-radius: 8px;
    transition: all 0.3s ease;
    flex-shrink: 0;

    &:hover {
      background: rgba(0, 100, 200, 0.4);
      border-color: #00d4ff;
      box-shadow: 0 0 15px rgba(0, 212, 255, 0.2);
    }
    &:active {
      transform: scale(0.95);
    }
  }

  .panel-header-stats {
    position: absolute;
    right: 20px;
    top: 50%;
    transform: translateY(-50%);
    display: flex;
    gap: 16px;
    align-items: center;
  }

  .header-stat-item {
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    gap: 2px;
  }

  .header-stat-label {
    font-size: 11px;
    color: rgba(255, 255, 255, 0.5);
    letter-spacing: 0.5px;
  }

  .header-stat-value {
    font-size: 16px;
    font-weight: 700;
    // font-family: 'Orbitron', monospace;
    letter-spacing: 0.5px;
  }

  .data-table {
    width: 100%;
    border-collapse: separate;
    border-spacing: 0;
    font-size: 15px;

    th {
      padding: 10px 8px;
      text-align: center;
      color: #6b9ec4;
      font-weight: 600;
      font-size: 14px;
      letter-spacing: 0.5px;
      border-bottom: 1px solid rgba(0, 180, 255, 0.15);
      background: rgba(0, 40, 100, 0.15);
      white-space: nowrap;

      &:first-child { border-radius: 8px 0 0 0; text-align: left; }
      &:last-child { border-radius: 0 8px 0 0; }
    }

    td {
      padding: 10px 8px;
      color: #a3ccec;
      border-bottom: 1px solid rgba(0, 180, 255, 0.06);
      text-align: center;
      transition: background 0.25s;
      white-space: nowrap;

      &:first-child { text-align: left; color: #ffffff; font-weight: 500; }
    }

    tr:hover td { background: rgba(0, 150, 255, 0.06); }
    tr:last-child td { border-bottom: none; }
    tr:last-child td:first-child { border-radius: 0 0 0 8px; }
    tr:last-child td:last-child { border-radius: 0 0 8px 0; }
  }

  
  .pagination {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 6px;
    margin-left: auto;
  }

  .page-btn {
    min-width: 38px;
    height: 38px;
    padding: 0 12px;
    border: 1px solid rgba(0, 180, 255, 0.15);
    background: rgba(0, 40, 100, 0.25);
    backdrop-filter: blur(8px);
    color: #a3ccec;
    font-size: 16px;
    cursor: pointer;
    border-radius: 6px;
  }
  .page-btn.active {
    background: linear-gradient(135deg, #8b5cf6, #6d28d9);
    color: #fff;
    border-color: #8b5cf6;
  }
  .page-btn.disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
  .page-btn:hover:not(.disabled) {
    border-color: rgba(0, 212, 255, 0.35);
    color: #00d4ff;
  }


  .num {
    font-weight: 700;
    color: #00d4ff !important;
    // font-family: 'Orbitron', monospace;
    font-size: 16px;
  }

  .highlight-row {
    background: rgba(0, 100, 200, 0.08);
  }

  .task-table {
    font-size: 13px;

    th {
      font-size: 12px;
      padding: 8px 6px;
      white-space: nowrap;
    }
    td {
      padding: 8px 6px;
      font-size: 12px;

      &:nth-child(2) {
        text-align: left;
        max-width: 300px;
        word-break: break-word;
        white-space: normal;
      }
    }
  }

  .status-badge {
    display: inline-flex;
    align-items: center;
    gap: 4px;
    padding: 2px 8px;
    border-radius: 10px;
    font-size: 11px;
    font-weight: 600;
    letter-spacing: 0.5px;

    &::before {
      content: '';
      width: 6px;
      height: 6px;
      border-radius: 50%;
      flex-shrink: 0;
    }

    &.status-inprogress {
      background: rgba(0, 200, 255, 0.12);
      color: #00d4ff;
      border: 1px solid rgba(0, 200, 255, 0.2);
      &::before { background: #00d4ff; box-shadow: 0 0 6px #00d4ff; }
    }
    &.status-completed {
      background: rgba(0, 240, 200, 0.12);
      color: #00f0c8;
      border: 1px solid rgba(0, 240, 200, 0.2);
      &::before { background: #00f0c8; box-shadow: 0 0 6px #00f0c8; }
    }
    &.status-delayed {
      background: rgba(255, 71, 87, 0.12);
      color: #ff4757;
      border: 1px solid rgba(255, 71, 87, 0.2);
      &::before { background: #ff4757; box-shadow: 0 0 6px #ff4757; }
    }
    &.status-pending {
      background: rgba(255, 159, 67, 0.12);
      color: #ff9f43;
      border: 1px solid rgba(255, 159, 67, 0.2);
      &::before { background: #ff9f43; box-shadow: 0 0 6px #ff9f43; }
    }
  }

  @media (max-width: 1400px) {
    .main { grid-template-columns: 260px 1fr; }
  }
  @media (max-width: 1024px) {
    .main { grid-template-columns: 1fr; }
    .sidebar { order: 2; }
    .content-area { order: 1; }
  }
}
</style>