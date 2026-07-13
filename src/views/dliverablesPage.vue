<template>
  <div class="dliverables-page">
    <div class="dliverables-container">
      <div class="upper-section">
        <aside class="sidebar dliverables-card">
          <div class="logo">
            <span class="logo-red" v-i18n="'TIC Design Deliverables'">TIC Design Deliverables</span>
          </div>

          <div class="filter-group">
            <div class="date-range" style="justify-content: center">
              {{ currentTime }}
            </div>
          </div>

          <div class="filter-group" style="position: absolute; bottom: 20px">
            <div class="date-range">
              <input v-model="startDate" type="date" />
              <span>-</span>
              <input v-model="endDate" type="date" />
            </div>
          </div>
          <div class="filter-group">
            <label v-i18n="'File Type'">File Type</label>
            <div class="multiselect" ref="disciplineRef">
              <div class="select-box" @click="disciplineOpen = !disciplineOpen">
                <div class="selected-options">{{ disciplineLabel }}</div>
                <div class="arrow"></div>
              </div>
              <div class="options-container" :class="{ hidden: !disciplineOpen }">
                <label v-for="item in disciplineOptions" :key="item" class="option">
                  <input
                    type="checkbox"
                    :value="item"
                    :checked="selectedDisciplines.includes(item)"
                    @change="onDisciplineChange(item, $event.target.checked)"
                  />
                  <span v-i18n="item">{{ item }}</span>
                </label>
              </div>
            </div>
          </div>

          <div class="filter-group">
            <label v-i18n="'Completion Status'">Completion Status</label>
            <div class="multiselect" ref="statusRef">
              <div class="select-box" @click="statusOpen = !statusOpen">
                <div class="selected-options">{{ completionStatusLabel }}</div>
                <div class="arrow"></div>
              </div>
              <div class="options-container" :class="{ hidden: !statusOpen }">
                <label class="option">
                  <input
                    type="checkbox"
                    value="All"
                    :checked="completionStatus.includes('All')"
                    @change="onCompletionStatusChange('All', $event.target.checked)"
                  />
                  <span>All</span>
                </label>
                <label v-for="item in statusOptions" :key="item" class="option">
                  <input
                    type="checkbox"
                    :value="item.value"
                    :checked="completionStatus.includes(item.value)"
                    @change="onCompletionStatusChange(item.value, $event.target.checked)"
                    v-i18n="item.label"
                  />
                  <span v-i18n="item.label">{{ item.label }}</span>
                </label>
              </div>
            </div>
          </div>

          <!-- <div class="filter-group">
            <label v-i18n="'Completion Status'">Completion Status</label>
            <select v-model="completionStatus" class="ctl">
              <option value="All">All</option>
              <option v-for="item in statusOptions" :key="item.value" :value="item.value" v-i18n="item.label">{{ item.label }}</option>
            </select>
          </div> -->

          <div class="filter-group">
            <label v-i18n="'Design Phase'">Design Phase</label>
            <select v-model="selectedDesignPhase">
              <option value="All">All</option>
              <option v-for="item in designPhases" :key="item" :value="item" v-i18n="item">{{ item }}</option>
            </select>
          </div>

          <div class="filter-group">
            <label v-i18n="'Version'">Version</label>
            <select v-model="selectedVersion">
              <option value="All">All</option>
              <option v-for="item in versions" :key="item" :value="item" v-i18n="item">{{ item }}</option>
            </select>
          </div>

          <!-- <div class="filter-group search-box">
            <input v-model="searchText" type="text" placeholder="Search for a code" />
          </div> -->
        </aside>

        <main class="main-content">
          <div class="row top-charts">
            <div class="dliverables-card chart-card" v-auto-scroll>
              <div class="card-header" v-i18n="'Statistical Analysis Of Milestone Completion Status'">Statistical Analysis Of Milestone Completion Status
                <LanguageSwitcher style="margin-left: 10px;" />
                <button 
                  class="btn btn-outline"
                  style="margin-left: 10px;"
                  @click="router.push('/newDliverables')"
                  v-i18n="'深色'"
                >新页面
                </button>
                <!-- <el-radio-group style="position: absolute; right: 0px" v-model="radio" size="large">
                  <el-radio-button label="图表" value="0" />
                  <el-radio-button label="表格" value="1" />
                </el-radio-group> -->
                <div style="position: absolute; right: 20px; top: 5px; display: flex">
                  <div style="margin-right: 20px; display: flex; flex-direction: column; align-items: center;">
                    <div v-i18n="'Percentage of Plan Completion'">Percentage of Plan Completion</div>
                    <div style="color: #52c41a">{{ workScheduleRows[0]?.ZT_JHWCBL }}%</div>
                  </div>
                  <div style="display: flex; flex-direction: column; align-items: center;">
                    <div v-i18n="'Actual Completion Percentage'">Actual Completion Percentage</div>
                    <div style="color: #1976d2">{{ workScheduleRows[0]?.ZT_SJWCBL }}%</div>
                  </div>
                </div>
              </div>
              <div v-show="radio === '0'" ref="reviewChartRef" class="chart-container" @mouseenter="isActive = false" @mouseleave="isActive = true"></div>
              <div v-if="radio === '1'" class="table-container table-wrap">
                <table class="work-schedule-table table-body">
                  <thead>
                    <tr>
                      <th v-i18n="'WBS Name'">WBS Name</th>
                      <th v-i18n="'Task Name'">Task Name</th>
                      <th v-i18n="'Task Owner'">Task Owner</th>
                      <th v-i18n="'Plan Date'">Plan Date</th>
                      <th v-i18n="'Progress'">Progress</th>
                      <th v-i18n="'Actual Date'">Actual Date</th>
                      <th v-i18n="'Related Deliverables'">Related Deliverables</th>
                      <th v-i18n="'Approved by Owner'">Approved by Owner</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="row in workScheduleRows" :key="row.CRRC_JL_WBSMC">
                      <td>{{ row.CRRC_JL_WBSMC }}</td>
                      <td>{{ row.CRRC_PCA_ZYMC }}</td>
                      <td>{{ row.CRRC_JL_ZYFZR }}</td>
                      <td>{{ row.CRRC_JL_JHWC }}</td>
                      <td>{{ row.CRRC_JL_WCBFB }}%</td>
                      <td>{{ row.CRRC_JL_SJWC }}</td>
                      <td>{{ row.GLSJJFWSL }}</td>
                      <td>{{ row.TGYZPFSL }}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          <div class="row middle-section">
            <div class="dliverables-card summary-card">
              <div class="card-header" v-i18n="'Distribution of Deliverable Status'">Distribution of Deliverable Status</div>

              <div class="task-table-container table-wrap">
                <table class="task-table table-body">
                  <thead>
                    <tr>
                      <th v-i18n="'File Type'">File Type</th>
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
            <div class="dliverables-card kpi-card">
              <div class="approval-row">
                <div class="approval-item">
                  <div class="kpi-value">{{ kpi.spvCount }}</div>
                  <div class="kpi-label" v-i18n="'Approval Documents'">Approval Documents</div>
                  <div ref="gaugeSPVRef" class="gauge-chart"></div>
                </div>
                <div class="approval-item">
                  <div class="kpi-value">{{ kpi.tuvCount }}</div>
                  <div class="kpi-label" v-i18n="'Forecast Documents'">Forecast Documents</div>
                  <div ref="gaugeTUVRef" class="gauge-chart"></div>
                </div>
                <!-- <div class="approval-item">
                  <div class="kpi-value">{{ kpi.ownerCount }}</div>
                  <div class="kpi-label">After approval by the Owner</div>
                  <div ref="gaugeOwnerRef" class="gauge-chart"></div>
                </div> -->
              </div>
            </div>
          </div>
        </main>
      </div>

      <main class="bottom-section right-col">
        <div class="chart-card" style="position: relative;">
          <div style="position: absolute">
            <div class="card-header" v-i18n="'Distribution Chart Of Completion Status For Each Specialty'">Distribution Chart Of Completion Status For Each Specialty</div>
            <div class="kpi-label" v-i18n="'Total Quantity'">Total Quantity</div>
            <div style="color: #0d3a8b; font-weight: bold; font-size: 24px">{{ filteredData.length }}</div>
          </div>
          <!-- <div class="chart-header">
            <div>
              <h5 v-i18n="'Total inputs deliverables: '">Total inputs deliverables: <span class="text-primary">{{ totalDeliverables }}</span></h5>
              <div class="status-legend">
                <span v-i18n="'Delayed'"><i class="dot delay-unfinished"></i>Delayed</span>
                <span v-i18n="'Delivered'"><i class="dot completed"></i>Delivered</span>
                <span v-i18n="'In Progress'"><i class="dot unfinished"></i>In Progress</span>
                <span v-i18n="'Under Discussion'"><i class="dot delay-completed"></i>Under Discussion</span>
              </div>
            </div>
            <div class="progress-ring">
              <svg width="150" height="120">
                <path d="M10,90 A65,65 0 0,1 140,90" stroke="#e0e0e0" stroke-width="12" fill="transparent" />
                <path
                  d="M10,90 A65,65 0 0,1 140,90"
                  stroke="#28a745"
                  stroke-width="12"
                  fill="transparent"
                  :stroke-dasharray="circumference"
                  :stroke-dashoffset="progressOffset"
                />
              </svg>
              <div class="progress-text">{{ completePercent }}%</div>
            </div>
          </div> -->
          <div ref="chartRef" class="deliverables-chart"></div>
        </div>
      </main>

      <div class="bottom-section">
        <div class="dliverables-card table-card">
          <div class="task-table-container table-wrap">
            <table class="task-table table-body">
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
              <tbody>
                <tr v-for="(item, index) in tableRows" :key="index">
                  <td>{{ item.CRHK_DDLI_CPTM }}</td>
                  <td>{{ item.CRHK_RL_JFWMC }}</td>
                  <td v-i18n="item.CRHK_PPR_WJLX_XL">{{ item.CRHK_PPR_WJLX_XL }}</td>
                  <td v-i18n="item.CRHK_DDL_SJJD_PD">{{ item.CRHK_DDL_SJJD_PD }}</td>
                  <td v-i18n="item.CRHK_DDLI_DQBB_XL">{{ item.CRHK_DDLI_DQBB_XL }}</td>
                  <td>{{ item.CRHK_DDLI_TJLBBSJ }}</td>
                  <td>{{ item.CRHK_DDR_WCBL_SM }}</td>
                  <td>{{ item.CRHK_DDLI_STRASJWC }}</td>
                  <td v-i18n="statusLabel(item.COMPLETION_STATUS)">
                    <span class="dot" :style="statusOption(item.COMPLETION_STATUS)"></span>
                    {{ statusLabel(item.COMPLETION_STATUS) }}
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
import * as echarts from 'echarts'
import { computed, nextTick, onBeforeUnmount, onMounted, onUnmounted, ref, watch } from 'vue'
import axios from "../assets/axios/dliverablesPage.js"
import LanguageSwitcher from '../components/LanguageSwitcher.vue';
import router from '@/router'

let disciplineOptions = ['All']
let designPhases = []
let versions = []
const statusOptions = [
  { value: '如期完成', label: 'completed', background: '#28a745' },
  { value: '延期未完成', label: 'Delayed But Not', background: '#dc3545' },
  { value: '进行中', label: 'In Progress', background: '#007bff' },
  { value: '延期已完成', label: 'Delayed But Completed', background: '#FFA500' },
]

const statusOption = (value) => {
  const found = statusOptions.find((item) => item.value === value)
  return found ? `background: ${found.background};` : ''
}

function statusLabel(value) {
  const found = statusOptions.find((item) => item.value === value)
  return found ? found.label : value
}
const currentTime = ref('')
const startDate = ref('')
const endDate = ref('')
const selectedDesignPhase = ref('All')
const selectedVersion = ref('All')
const completionStatus = ref(['All'])
const selectedDisciplines = ref(['All'])
const searchText = ref('')
const disciplineOpen = ref(false)
const statusOpen = ref(false)

const radio = ref('0')

const disciplineRef = ref(null)
const statusRef = ref(null)
const reviewChartRef = ref(null)
const gaugeSPVRef = ref(null)
const gaugeTUVRef = ref(null)
// const gaugeOwnerRef = ref(null)

const charts = {
  review: null,
  spv: null,
  tuv: null,
  // owner: null,
}

const chartRef = ref(null)

function renderChart() {
  let chart = echarts.init(chartRef.value)
  const labels = disciplineOptions.map(item => window.i18nManager.getText(item));
  labels.shift();

  const statusMap = {
    '如期完成': { key: window.i18nManager.getText('completed'), color: '#28a745' },
    '延期未完成': { key: window.i18nManager.getText('Delayed But Not'), color: '#dc3545' },
    '进行中': { key: window.i18nManager.getText('In Progress'), color: '#007bff' },
    '延期已完成': { key: window.i18nManager.getText('Delayed But Completed'), color: '#FFA500' },
  };

  const start = startDate.value ? new Date(startDate.value) : null
  const end = endDate.value ? new Date(endDate.value) : null
  const keyword = searchText.value.trim().toLowerCase()
  const dataList = mockData.value.filter((item) => {
    let inDate = true
    const baseline = new Date(String(item.CRHK_DDLI_TJLBBSJ).replace(/\//g, '-'))
    if (start && baseline < start) inDate = false
    if (end && baseline > end) inDate = false
    // const inDate = (item.CRHK_DDLI_TJLBBSJ >= start && item.CRHK_DDLI_TJLBBSJ <= end) || (item.CRHK_DDLI_STRASJWC >= start && item.CRHK_DDLI_STRASJWC <= end)
    const matchPhase = selectedDesignPhase.value === 'All' || item.CRHK_DDL_SJJD_PD === selectedDesignPhase.value
    const matchKeyword = !keyword || item.code.toLowerCase().includes(keyword) || item.task.toLowerCase().includes(keyword)
    return inDate && matchPhase && matchKeyword
  })

  // 2. 为每个 discipline 计算各状态的数量
  const rawData = labels.map((sp) => {
    const statusCounts = {};
    Object.keys(statusMap).forEach((label) => {
      statusCounts[label] = dataList.filter(
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
      itemStyle: { color: cfg.color },
      label: {
        show: true,
        position: 'inside',
        formatter: function (params) {
          return params.value < 1 ? '' : params.value;
        },
      },
      data: filteredRawData.map(item => item.counts[label]),
    };
  });

  // 5. 点击事件需要重新适配索引
  chart.off('click'); // 避免重复绑定
  chart.on('click', function(params) {
    if (params.componentType === 'series') {
      const originalDisciplineName = params.name;
      // 找到在原始 disciplineOptions 中的位置（需要处理国际化匹配）
      const originalIndex = disciplineOptions.findIndex(
        opt => window.i18nManager.getText(opt) === originalDisciplineName
      );
      if (originalIndex > -1) {
        selectedDisciplines.value = [disciplineOptions[originalIndex]];
      }
      
      Object.keys(statusMap).forEach((label) => {
        if (statusMap[label].key === params.seriesName) {
          completionStatus.value = [label];
        }
      });
    }
  });

  // 6. 设置图表
  chart.setOption({
    tooltip: { trigger: 'axis', axisPointer: { type: 'shadow' } },
    legend: { top: 0, width: '100%', selectedMode: false },
    grid: { left: '5%', right: '3%', bottom: '8%', containLabel: true },
    xAxis: { 
      type: 'category', 
      data: finalLabels,  // 使用过滤后的 labels
      axisLabel: { interval: 0, fontSize: 14 * fontSize, overflow: 'break', width: 130 * fontSize } 
    },
    yAxis: { type: 'value' },
    series: datasets,
  });
}
function updateClock() {
  const now = new Date()
  currentTime.value = now.toLocaleString().replaceAll('/', '-')
}

function generateDate(start, end) {
  return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()))
}

function formatDate(date) {
  if (!date) return ''
  return date.toISOString().slice(0, 10)
}

let mockData = ref([])
const mockStart = new Date('2025-01-01')
const mockEnd = new Date('2028-12-31')

// for (let i = 0; i < 220; i++) {
//   const begin = generateDate(mockStart, mockEnd)
//   const finish = new Date(begin.getTime() + (Math.random() * 35 + 3) * 24 * 3600 * 1000)
//   const status = statuses[Math.floor(Math.random() * statuses.length)]
//   const deliveryDate = ['Delivered', 'Approved', 'Approved with comment', 'For Correction'].includes(status)
//     ? new Date(finish.getTime() + (Math.random() * 10 - 3) * 24 * 3600 * 1000)
//     : null

//   const discipline = disciplineOptions[Math.floor(Math.random() * (disciplineOptions.length - 1)) + 1]

//   mockData.push({
//     id: i + 1,
//     code: `1CRR00324-FPR-SYS-${String(Math.floor(Math.random() * 100000)).padStart(5, '0')}`,
//     task: `BIM - MODEL - ${discipline} - SECTION ${String.fromCharCode(65 + Math.floor(Math.random() * 6))}`,
//     workflow: workflows[Math.floor(Math.random() * workflows.length)],
//     deliveryStatus: status,
//     startDate: begin,
//     finishDate: finish,
//     deliveryDate,
//     owner: owners[Math.floor(Math.random() * owners.length)],
//     discipline,
//     designPhase: designPhases[Math.floor(Math.random() * designPhases.length)],
//     version: versions[Math.floor(Math.random() * versions.length)],
//   })
// }

let workScheduleRows = ref([])

// const workScheduleRows = computed(() => {
//   const wbsList = ['1.1 项目管理', '1.2 设计管理', '1.3 技术设计', '1.4 施工配合', '1.5 竣工验收']
//   return wbsList.map((wbs, index) => {
//     const planDate = new Date()
//     planDate.setDate(planDate.getDate() + index * 7)
//     const progress = Math.min(100, 55 + index * 10)
//     return {
//       wbs,
//       task: ['项目启动', '需求分析', '初步设计', '详细设计', '施工图设计'][index],
//       owner: owners[index % owners.length],
//       planDate: formatDate(planDate),
//       progress,
//       actualDate: progress === 100 ? formatDate(new Date()) : '',
//       relCount: 3 + index,
//       approvedCount: Math.max(0, 2 + index - 1),
//     }
//   })
// })

const filteredData = computed(() => {
  const start = startDate.value ? new Date(startDate.value) : null
  const end = endDate.value ? new Date(endDate.value) : null
  const keyword = searchText.value.trim().toLowerCase()
  const allSelected = selectedDisciplines.value.includes('All')
  const allStatus = completionStatus.value.includes('All')
  const query = {
    version: selectedVersion.value === 'All' ? '' : selectedVersion.value,
    designPhase: selectedDesignPhase.value === 'All' ? '' : selectedDesignPhase.value,
    fileType: selectedDisciplines.value.includes('All') ? '' : selectedDisciplines.value.join(','),
  }
  axios.getTable3Data(query)
  .then(res => {
    statisticsTable.value = selectedVersion.value === 'All' ? res.data.data : res.data.data.filter(item => [selectedVersion.value, '总计'].includes(item.FILE_VERSION))
  })
  return mockData.value.filter((item) => {
    let inDate = true
    const baseline = new Date(String(item.CRHK_DDLI_TJLBBSJ).replace(/\//g, '-'))
    if (start && baseline < start) inDate = false
    if (end && baseline > end) inDate = false
    // const inDate = (item.CRHK_DDLI_TJLBBSJ >= start && item.CRHK_DDLI_TJLBBSJ <= end) || (item.CRHK_DDLI_STRASJWC >= start && item.CRHK_DDLI_STRASJWC <= end)
    const matchDiscipline = allSelected || selectedDisciplines.value.includes(item.CRHK_PPR_WJLX_XL)
    const matchStatus = allStatus || completionStatus.value.includes(item.COMPLETION_STATUS)
    const matchPhase = selectedDesignPhase.value === 'All' || item.CRHK_DDL_SJJD_PD === selectedDesignPhase.value
    const matchVersion = selectedVersion.value === 'All' || item.CRHK_DDLI_DQBB_XL === selectedVersion.value
    // const matchStatus = completionStatus.value === 'All' || item.COMPLETION_STATUS === completionStatus.value
    const matchKeyword = !keyword || item.code.toLowerCase().includes(keyword) || item.task.toLowerCase().includes(keyword)
    return inDate && matchDiscipline && matchPhase && matchVersion && matchStatus && matchKeyword
  })
})

const tableRows = computed(() => {
  return filteredData.value.slice(0, 100)
  return filteredData.value
})

const disciplineLabel = computed(() => {
  if (selectedDisciplines.value.includes('All')) {
    statisticsTableColumns.value = FileTypeOptions
    return 'All'
  }
  if (selectedDisciplines.value.length === 0) {
    statisticsTableColumns.value = []
    return 'None'
  }
  statisticsTableColumns.value = [ ...selectedDisciplines.value ]
  if (selectedDisciplines.value.length <= 3) {
    const arr = selectedDisciplines.value.map((item) => window.i18nManager.getText(item))
    return arr.join(', ')
  }
  return `${selectedDisciplines.value.length} selected`
})

const completionStatusLabel = computed(() => {
  if (completionStatus.value.includes('All')) {
    return 'All'
  }
  if (completionStatus.value.length === 0) {
    return 'None'
  }
  if (completionStatus.value.length <= 3) {
    const arr = completionStatus.value.map((item) => window.i18nManager.getText(item))
    return arr.join(', ')
  }
  return `${completionStatus.value.length} selected`
})

const kpi = computed(() => {
  const total = filteredData.value.length || 1
  const spvCount = filteredData.value.filter((item) => ['0版本', '通过SPV审批', '通过TUV审批', '通过业主批复'].includes(item.CRHK_DDLI_DQBB_XL)).length
  const tuvCount = total
  // const ownerCount = filteredData.value.filter((item) => item.CRHK_DDLI_DQBB_XL === '通过业主批复').length
  // const total = spvCount + tuvCount + ownerCount
  return {
    total,
    spvCount,
    tuvCount,
    // ownerCount,
    spvPct: Math.ceil((filteredData.value.filter((item) => ['0版本', '通过SPV审批', '通过TUV审批', '通过业主批复'].includes(item.CRHK_DDLI_DQBB_XL)).length / total) * 100),
    tuvPct: Math.ceil((filteredData.value.filter((item) => ['通过业主批复'].includes(item.CRHK_DDLI_DQBB_XL)).length / total) * 100),
    // ownerPct: Math.ceil((ownerCount / total) * 100),
  }
})

function onDisciplineChange(value, checked) {
  if (value === 'All') {
    selectedDisciplines.value = checked ? ['All'] : []
    return
  }

  const next = selectedDisciplines.value.filter((item) => item !== 'All')
  if (checked && !next.includes(value)) next.push(value)
  if (!checked) {
    const idx = next.indexOf(value)
    if (idx >= 0) next.splice(idx, 1)
  }
  selectedDisciplines.value = next.length ? next : ['All']
}

function onCompletionStatusChange(value, checked) {
  if (value === 'All') {
    completionStatus.value = checked ? ['All'] : []
    return
  }

  const next = completionStatus.value.filter((item) => item !== 'All')
  if (checked && !next.includes(value)) next.push(value)
  if (!checked) {
    const idx = next.indexOf(value)
    if (idx >= 0) next.splice(idx, 1)
  }
  completionStatus.value = next.length ? next : ['All']
}

function renderGauge(chart, value, color, title) {
  if (!chart) return
  chart.setOption({
    series: [
      {
        type: 'gauge',
        startAngle: 180,
        endAngle: 0,
        center: ['50%', '75%'],
        radius: '100%',
        min: 0,
        max: 100,
        splitNumber: 1,
        axisLine: {
          lineStyle: {
            width: 18,
            color: [[1, '#f0f0f0']],
          },
        },
        progress: {
          show: true,
          width: 18,
          itemStyle: { color },
        },
        pointer: { show: false },
        axisTick: { show: false },
        splitLine: { show: false },
        axisLabel: {
          formatter: '\n\n\n{value}%',
          distance: -25,
          // show: false 
        },
        detail: {
          valueAnimation: true,
          fontSize: 16,
          fontWeight: 'bold',
          offsetCenter: [0, '-15%'],
          formatter: '{value}%',
        },
        data: [{ value,
          name: title,
          title: {
            offsetCenter: [0, '-120%'],
            fontSize: 16 * fontSize,
          },
        }],
      },
    ],
  })
}

function getRemSize() {
  const html = document.documentElement;
  const clientWidth = html.clientWidth;
  return clientWidth / 2560;
}
const fontSize = getRemSize()

let isActive = ref(true)
function renderReviewChart(val, num) {
  if(!isActive.value) {
    return setTimeout(() => {
      renderReviewChart(val, num);
    }, 5000)
  }
  if(!charts.review) return;
  if(workScheduleRows.value.length > 8) {
    let startNum = 0, endNum = 0, nextNum = num
    if((num + 1) * 8 < workScheduleRows.value.length) {
      startNum = num * 8
      endNum = (num + 1) * 8
      nextNum += 1
    } else if (num * 8 < workScheduleRows.value.length && (num + 1) * 8 >= workScheduleRows.value.length) {
      endNum = workScheduleRows.value.length
      startNum = endNum - 8
      nextNum += 1
    } else {
      startNum = 0
      endNum = 8
      nextNum = 1
    }
    setTimeout(() => {
      renderReviewChart(workScheduleRows.value.slice(startNum, endNum), nextNum)
    }, 5000)
  }
  const disciplines = val.map(el => el.CRRC_PCA_ZYMC)
  const groups = val.map(el => el.JHWCBL)
  const jfwNum = val.map(el => el.SJWCBL)

  charts.review.setOption({
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'cross',
        crossStyle: {
          color: '#999'
        },
      }
    },
    legend: { data: [window.i18nManager.getText('计划完成比例'), window.i18nManager.getText('实际完成比例')] },
    grid: { left: '3%', right: '4%', bottom: '3%', containLabel: true },
    xAxis: [{
      type: 'category',
      data: disciplines,
      axisLabel: {
        interval: 0,
        fontSize: 14 * fontSize,
        overflow: 'break',
        width: 130 * fontSize,
      },
    }],
    // yAxis: { type: 'value', name: 'Total number of tasks' },
    yAxis: [
      {
        type: 'value',
        name: '完成比例',
        min: 0,
        max: 100,
        axisLabel: {
          formatter: '{value} %'
        }
      },
    ],
    series: [
      {
        name: window.i18nManager.getText('计划完成比例'),
        type: 'bar',
        barWidth: '20%',
        itemStyle: { color: '#52c41a' },
        data: groups,
        label: {
          show: true,
          formatter: '{c}%',
          position: 'top'
        },
      },
      {
        name: window.i18nManager.getText('实际完成比例'),
        type: 'bar',
        barWidth: '20%',
        itemStyle: { color: '#1976d2' },
        data: jfwNum,
        label: {
          show: true,
          formatter: '{c}%',
          position: 'top'
        },
      },
    ],
  })
}

function updateCharts() {
  // renderReviewChart()
  renderGauge(charts.spv, kpi.value.spvPct, '#52c41a', window.i18nManager.getText('Percentage of STSTRA Submissions'))
  // renderGauge(charts.tuv, kpi.value.tuvPct, '#1890ff')
  renderGauge(charts.tuv, kpi.value.tuvPct, '#52c41a', window.i18nManager.getText('Progress by Doc.Deliveries'))
  // renderGauge(charts.owner, kpi.value.ownerPct, '#faad14')
}

function handleDocClick(e) {
  if (!disciplineRef.value) return
  if (!disciplineRef.value.contains(e.target)) disciplineOpen.value = false
  if (!statusRef.value.contains(e.target)) statusOpen.value = false
}

function resizeCharts() {
  Object.values(charts).forEach((chart) => chart && chart.resize())
}

let FileTypeOptions = []
const statisticsTableColumns = ref([])
const statisticsTable = ref([])
onMounted(async () => {
  window.addEventListener('languageChanged', updateLanguage);
  // 初始化时钟
  updateClock()
  const clockInterval = setInterval(updateClock, 1000)
  charts.review = echarts.init(reviewChartRef.value)
  charts.spv = echarts.init(gaugeSPVRef.value)
  charts.tuv = echarts.init(gaugeTUVRef.value)
  getTableData()
  const res2 = await axios.getTable2Data()
  mockData.value = res2.data.data
  const optionRes = await axios.getOptionsList()
  designPhases = optionRes.data.data.sjjfw.DesignPhase
  disciplineOptions.push(...optionRes.data.data.sjjfw.FileType)
  FileTypeOptions = optionRes.data.data.sjjfw.FileType
  statisticsTableColumns.value = [...FileTypeOptions]
  versions.push(...optionRes.data.data.sjjfw.Version)
  renderChart()
  await nextTick()
  // charts.owner = echarts.init(gaugeOwnerRef.value)
  updateCharts()
  window.addEventListener('resize', resizeCharts)
  document.addEventListener('click', handleDocClick)
  // 清理定时器
  onUnmounted(() => clearInterval(clockInterval))
})
async function getTableData() {
  const res = await axios.getTableData()
  workScheduleRows.value = res.data.data
  renderReviewChart(workScheduleRows.value.slice(0, 8), 1)
}

const updateLanguage = () => {
  renderChart()
  updateCharts()
  renderReviewChart(workScheduleRows.value.slice(0, 8), 1)
}
onUnmounted(() => {
  window.removeEventListener('languageChanged', updateLanguage);
});

onBeforeUnmount(() => {
  window.removeEventListener('resize', resizeCharts)
  document.removeEventListener('click', handleDocClick)
  Object.keys(charts).forEach((key) => {
    if (charts[key]) charts[key].dispose()
  })
})

watch([filteredData, kpi], () => {
  updateCharts()
  renderChart()
})
</script>

<style lang="scss" scoped>
.dliverables-page {
  --primary-bg: #f5f6fa;
  --card-bg: #ffffff;
  --text-color: #333;
  --border-color: #e0e0e0;
  --brand-red: #d32f2f;
  --brand-blue: #1976d2;
  --header-bg: #f9fafb;
  height: 100%;
  * {
    box-sizing: border-box;
  }

  .dliverables-container {
    height: 100%;
    padding: 20px;
    display: flex;
    flex-direction: column;
    gap: 20px;
    background-color: var(--primary-bg);
    color: var(--text-color);
  }

  .upper-section {
    display: flex;
    gap: 15px;
    min-height: 0;
    flex: 0 0 auto;
  }

  .dliverables-card {
    background: var(--card-bg);
    border-radius: 8px;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
    padding: 15px;
    display: flex;
    flex-direction: column;
  }

  .sidebar {
    position: relative;
    width: 280px;
    gap: 20px;
    overflow-y: auto;
  }

  .main-content {
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 15px;
    min-width: 0;
  }

  .logo {
    font-size: 20px;
    font-weight: bold;
  }

  .logo-red {
    color: var(--brand-red);
  }

  .filter-group {
    display: flex;
    flex-direction: column;
    gap: 8px;

    label {
      font-weight: 600;
      font-size: 14px;
      color: #555;
    }

    select,
    input[type='text'] {
      padding: 8px;
      border: 1px solid var(--border-color);
      border-radius: 4px;
      width: 100%;
      background-color: #fff;
    }
  }

  .date-range {
    display: flex;
    align-items: center;
    gap: 6px;
    background: #f0f0f0;
    padding: 8px 10px;
    border-radius: 4px;

    input {
      border: none;
      background: transparent;
      font-size: 13px;
    }
  }

  .search-box {
    margin-top: auto;

    input {
      padding: 10px 12px;
      border-radius: 6px;
    }
  }

  .row {
    display: flex;
    gap: 15px;
  }

  .top-charts {
    height: 400px;
  }

  .chart-card {
    flex: 1;
    min-width: 0;
  }

  .card-header {
    position: relative;
    font-weight: bold;
    margin-bottom: 10px;
    font-size: 16px;
  }

  .table-container {
    flex: 1;
    overflow: auto;
  }

  .work-schedule-table,
  .task-table {
    width: 100%;
    border-collapse: collapse;
    font-size: 12px;

    th,
    td {
      padding: 8px;
      text-align: center;
      border-bottom: 1px solid #eee;
      white-space: nowrap;
    }

    th {
      font-weight: 600;
      background-color: var(--header-bg);
      position: sticky;
      top: 0;
      z-index: 1;
    }

    // tbody {
    //   max-width: 100%;
    // }

    tbody tr:hover {
      background-color: #f9f9f9;
    }
  }

  .middle-section {
    height: 300px;
  }

  .summary-card {
    flex: 7;
    overflow: hidden;
  }

  .kpi-card {
    flex: 3;
  }

  .chart-container,
  .gauge-chart {
    width: 100%;
    height: 100%;
  }

  .approval-row {
    display: flex;
    flex: 1;
    gap: 10px;
  }

  .approval-item {
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
  }

  .kpi-value {
    font-size: 24px;
    font-weight: bold;
    margin-bottom: 5px;
  }

  .kpi-label {
    font-size: 12px;
    color: #777;
    margin-bottom: 10px;
  }

  .bottom-section {
    flex: 2;
    min-height: 0;
    display: flex;
  }

  .table-card {
    width: 100%;
    overflow: hidden;
    padding: 0;
  }

  .task-table-container {
    flex: 1;
    overflow: auto;
  }

  .task-table {
    width: 100%;
    table-layout: auto;
    th,
    td {
      padding: 10px 8px;
      word-wrap: break-word;       /* 允许长单词换行 */
      // word-break: break-word;       /* 强制长单词换行 */
      white-space: normal;          /* 允许文本换行 */
    }
  }

  .dliverables-card {
    .task-table {
      width: 100%;
      table-layout: auto;
      th,
      td {
        padding: 10px 8px;
        word-wrap: unset;
        white-space: nowrap;
      }
    }
  }

  .multiselect {
    position: relative;
    width: 100%;
  }

  .select-box {
    padding: 10px 12px;
    border: 1px solid var(--border-color);
    border-radius: 6px;
    background-color: #fff;
    cursor: pointer;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .arrow {
    width: 0;
    height: 0;
    border-left: 5px solid transparent;
    border-right: 5px solid transparent;
    border-top: 5px solid #666;
  }

  .options-container {
    position: absolute;
    top: 100%;
    left: 0;
    right: 0;
    background: #fff;
    border: 1px solid var(--border-color);
    z-index: 10;
    max-height: 250px;
    overflow-y: auto;
    border-radius: 0 0 6px 6px;
  }

  .options-container.hidden {
    display: none;
  }

  .option {
    padding: 10px 12px;
    cursor: pointer;
    display: flex;
    align-items: center;
    gap: 10px;
  }

  .right-col {
    .chart-card {
      background: #fff;
      border-radius: 8px;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
      padding: 12px;
    }
  }
  .dot {
    display: inline-block;
    width: 10px;
    height: 10px;
    border-radius: 50%;
    margin-right: 4px;

    &.delay-unfinished {
      background: #dc3545;
    }

    &.completed {
      background: #28a745;
    }

    &.unfinished {
      background: #007bff;
    }

    &.delay-completed {
      background: #FFA500;
    }
  }
  .deliverables-chart {
    margin-top: 10px;
    height: 100%;
    width: 100%;
  }
}
</style>
