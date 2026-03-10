<template>
  <div class="qingdan-page">
    <div class="container-wrap">
      <div class="layout-row">
        <aside class="left-col">
          <div class="filter-section">
            <div class="logo">
              <span class="logo-red" v-i18n="'TIC Design Deliverables'">TIC Design Deliverables</span>
              <LanguageSwitcher style="position: absolute; right: 0px" />
            </div>
            <div class="filter-block">
              <div class="date-range">
                <input v-model="startDate" type="date" />
                <span>-</span>
                <input v-model="endDate" type="date" />
              </div>
            </div>
            <!-- <div class="filter-block">
              <label>Start Date</label>
              <input v-model="startDate" type="date" class="ctl" />
            </div>
            <div class="filter-block">
              <label>End Date</label>
              <input v-model="endDate" type="date" class="ctl" />
            </div> -->
            <div class="filter-block">
              <label v-i18n="'Specialty'">Specialty</label>
              <select v-model="specialty" class="ctl">
                <option value="all">All</option>
                <option v-for="item in specialties" :key="item" :value="item" v-i18n="item">{{ item }}</option>
              </select>
            </div>
            <div class="filter-block">
              <label v-i18n="'Design Phase'">Design Phase</label>
              <select v-model="designPhase" class="ctl">
                <option value="all">All</option>
                <option v-for="item in designPhases" :key="item" :value="item">{{ item }}</option>
              </select>
            </div>
            <div class="filter-block">
              <label v-i18n="'Completion Status'">Completion Status</label>
              <select v-model="completionStatus" class="ctl">
                <option value="all">All</option>
                <option v-for="item in statusOptions" :key="item.value" :value="item.value" v-i18n="item.label">{{ item.label }}</option>
              </select>
            </div>
          </div>
        </aside>

        <main class="right-col">
          <div class="chart-card">
            <div class="chart-header">
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
            </div>
            <div ref="chartRef" class="deliverables-chart"></div>
          </div>
        </main>
      </div>

      <div class="table-card" v-auto-scroll>
        <h5 v-i18n="'Deliverables List'">Deliverables List</h5>
        <div class="table-wrap">
          <table class="table-body">
            <thead>
              <tr>
                <th v-i18n="'List Number'">List Number</th>
                <th v-i18n="'Content'">Content</th>
                <th v-i18n="'Specialty'">Specialty</th>
                <th v-i18n="'Design Phase'">Design Phase</th>
                <th v-i18n="'Required Completion Time'">Required Completion Time</th>
                <th v-i18n="'Actual Completion Time'">Actual Completion Time</th>
                <th v-i18n="'Completion Status'">Completion Status</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="row in filteredDeliverables" :key="row.CRHK_IL_QDBH1">
                <td>{{ row.CRHK_IL_QDBH1 }}</td>
                <td>{{ row.CRHK_IL_QDNR1 }}</td>
                <td v-i18n="specialtyLabel(row.CRHK_IL_ZY)">{{ specialtyLabel(row.CRHK_IL_ZY) }}</td>
                <td>{{ phaseLabel(row.CRHK_DDL_SJJD_PD) }}</td>
                <td>{{ row.CRHK_LCI_YQWCSJ }}</td>
                <td>{{ row.CRHK_DTP_SJWCSJ || '-' }}</td>
                <td v-i18n="statusLabel(row.COMPLETION_STATUS)">
                  <span class="dot" :style="statusOption(row.COMPLETION_STATUS)"></span>
                  {{ statusLabel(row.COMPLETION_STATUS) }}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import * as echarts from 'echarts'
import { computed, nextTick, onBeforeUnmount, onMounted, onUnmounted, ref, watch } from 'vue'
import axios from "../assets/axios/qingdanPage.js"
import LanguageSwitcher from '../components/LanguageSwitcher.vue';

let specialties = []
let designPhases = []

const statusOptions = [
  { value: 'Delayed', label: 'Delayed', background: '#dc3545' },
  { value: 'Delivered', label: 'Delivered', background: '#28a745' },
  { value: 'In Progress', label: 'In Progress', background: '#007bff' },
  { value: 'Under Discussion', label: 'Under Discussion', background: '#e83e8c' },
]

const startDate = ref('')
const endDate = ref('')
const specialty = ref('all')
const designPhase = ref('all')
const completionStatus = ref('all')

const chartRef = ref(null)
let chart = null

const deliverablesData = ref([])

const filteredDeliverables = computed(() => {
  const start = startDate.value ? new Date(startDate.value) : null
  const end = endDate.value ? new Date(endDate.value) : null

  return deliverablesData.value.filter((item) => {
    if (specialty.value !== 'all' && item.CRHK_IL_ZY !== specialty.value) return false
    if (designPhase.value !== 'all' && item.CRHK_DDL_SJJD_PD !== designPhase.value) return false
    if (completionStatus.value !== 'all' && item.COMPLETION_STATUS !== completionStatus.value) return false

    const baseline = new Date(String(item.CRHK_LCI_YQWCSJ).replace(/\//g, '-'))
    if (start && baseline < start) return false
    if (end && baseline > end) return false
    return true
  })
})

const totalDeliverables = computed(() => filteredDeliverables.value.length)

const completedCount = computed(() => {
  return filteredDeliverables.value.filter((item) => item.COMPLETION_STATUS === 'Delivered').length
})

const completePercent = computed(() => {
  if (!totalDeliverables.value) return '0.00'
  return ((completedCount.value / totalDeliverables.value) * 100).toFixed(2)
})

const circumference = 204.1
const progressOffset = computed(() => {
  return circumference - (Number(completePercent.value) / 100) * circumference
})

function specialtyLabel(value) {
  const found = specialties.find((item) => item === value)
  return found ? found : value
}

function phaseLabel(value) {
  const found = designPhases.find((item) => item === value)
  return found ? found : value
}

const statusOption = (value) => {
  const found = statusOptions.find((item) => item.value === value)
  return found ? `background: ${found.background};` : ''
}

function statusLabel(value) {
  const found = statusOptions.find((item) => item.value === value)
  return found ? found.label : value
}

function getRemSize() {
  const html = document.documentElement;
  const clientWidth = html.clientWidth;
  return clientWidth / 2560;
}
const fontSize = getRemSize()

function renderChart() {
  if (!chart) return

  const labels = specialties
  const statusMap = {
    'Delayed': { key: 'Delayed', color: '#dc3545' },
    Delivered: { key: 'Delivered', color: '#28a745' },
    'In Progress': { key: 'In Progress', color: '#007bff' },
    'Under Discussion': { key: 'Under Discussion', color: '#e83e8c' },
  }

  const datasets = Object.keys(statusMap).map((label) => {
    const cfg = statusMap[label]
    return {
      name: label,
      type: 'bar',
      stack: 'total',
      itemStyle: { color: cfg.color },
      label: {
        show: true,
        position: 'inside',
        formatter: function (params) {
            var threshold = 1;
            if (params.value < threshold) {
                return ''; // 返回空字符串，相当于隐藏了 label
            } else {
                return params.value; // 显示数值
            }
        },
      },
      data: specialties.map((sp) => {
        return filteredDeliverables.value.filter((item) => item.CRHK_IL_ZY === sp && item.COMPLETION_STATUS === cfg.key).length
      }),
    }
  })

  
  chart.on('click', function(params) {
    specialty.value = window.i18nManager.getText(params.name)
    completionStatus.value = params.seriesName
  });
  
  chart.setOption({
    tooltip: { trigger: 'axis', axisPointer: { type: 'shadow' } },
    // legend: { top: 0, width: '100%' },
    grid: { left: '3%', right: '3%', bottom: '8%', containLabel: true },
    xAxis: { type: 'category', data: labels.map(item => item = window.i18nManager.getText(item)), axisLabel: { interval: 0, fontSize: 14 * fontSize, overflow: 'break', width: 130 * fontSize, } },
    yAxis: { type: 'value' },
    series: datasets,
  })
}

function onResize() {
  if (chart) chart.resize()
}

onMounted(async () => {
  window.addEventListener('languageChanged', updateLanguage);
  axios.getOptionsList()
  .then((res) => {
    designPhases = res.data.data.DesignPhase
    specialties = res.data.data.Specialty
  })
  axios.getTableData()
  .then((res) => {
    deliverablesData.value = res.data.data
  })
  await nextTick()
  chart = echarts.init(chartRef.value)
  renderChart()
  window.addEventListener('resize', onResize)
})

const updateLanguage = () => {
  renderChart()
}

onBeforeUnmount(() => {
  window.removeEventListener('resize', onResize)
  if (chart) chart.dispose()
})

onUnmounted(() => {
  window.removeEventListener('languageChanged', updateLanguage);
});

watch(filteredDeliverables, () => {
  renderChart()
})
</script>

<style lang="scss" scoped>
.qingdan-page {
  background: #f8f9fa;
  height: 100%;
  display: flex;
  justify-content: center;
  width: 100%;

  .container-wrap {
    padding: 12px;
    height: 100%;
    width: calc(100% - 24px);
    // max-width: 1400px;
    // max-width: 1400px;
  }

  .layout-row {
    display: flex;
    gap: 24px;
    height: 45%;
  }

  .left-col {
    // width: 280px;
    width: 25%;
  }

  .right-col {
    flex: 1;
    width: 75%;
    height: 100%;
    .chart-card {
      height: 100%;
    }
  }

  .filter-section {
    height: 100%;
  }

  .logo {
    position: relative;
    margin-bottom: 20px;
    font-size: 20px;
    font-weight: bold;
  }

  .logo-red {
    color: #d32f2f;
  }

  .filter-section,
  .chart-card,
  .table-card {
    background: #fff;
    border-radius: 8px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    padding: 12px;
  }

  .filter-block {
    margin-bottom: 10px;

    label {
      display: block;
      margin-bottom: 4px;
      font-size: 12px;
      color: #555;
    }

    .date-range {
      display: flex;
      align-items: center;
      justify-content: space-between;
      // gap: 6px;
      background: #f0f0f0;
      padding: 8px 10px;
      border-radius: 4px;

      input {
        border: none;
        background: transparent;
        font-size: 13px;
      }
    }
  }

  .ctl {
    width: 100%;
    height: 30px;
    border: 1px solid #dcdfe6;
    border-radius: 4px;
    padding: 0 8px;
    font-size: 12px;
  }

  .chart-header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;

    h5 {
      margin: 0;
      font-size: 16px;
    }

    .text-primary {
      color: #1976d2;
    }
  }

  .status-legend {
    margin-top: 8px;
    display: flex;
    gap: 12px;
    font-size: 12px;
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
      background: #e83e8c;
    }
  }

  .progress-ring {
    position: relative;
    // width: 150px;
    height: 120px;

    .progress-text {
      position: absolute;
      top: 52%;
      left: 50%;
      transform: translate(-50%, -50%);
      font-size: 20px;
      font-weight: 700;
    }
  }

  .deliverables-chart {
    margin-top: 10px;
    height: 360px;
    width: 100%;
  }

  .table-card {
    margin-top: 12px;
    height: 53%;

    h5 {
      margin: 0;
      font-size: 16px;
    }
  }

  .table-wrap {
    margin-top: 8px;
    max-height: calc(100% - 24px);
    // max-height: 420px;
    overflow: auto;
    .table-body {
      width: 100%;
      table-layout: auto;
      th,
      td {
        text-align: center;
      }
      tbody {
        >:nth-of-type(2n + 1) {
          background: rgba($color: #000000, $alpha: .05);
        }
      }
      td:first-child {
        min-width: 150px;
      }
      td:nth-child(4) {
        min-width: 120px;
      }
      td:nth-child(5) {
        min-width: 140px;
      }
      td:nth-child(6) {
        min-width: 140px;
      }
      td:nth-child(7) {
        min-width: 180px;
      }
    }
  }

  table {
    width: 100%;
    border-collapse: collapse;
    table-layout: fixed;
    font-size: 12px;

    th,
    td {
      border-bottom: 1px solid #ebeef5;
      padding: 8px;
      text-align: left;
      // white-space: nowrap;
      text-overflow: ellipsis;
      overflow: hidden;
      word-wrap: break-word;       /* 允许长单词换行 */
      // word-break: break-word;       /* 强制长单词换行 */
      white-space: normal;          /* 允许文本换行 */
    }

    th {
      position: sticky;
      top: 0;
      background: #fff;
      z-index: 1;
    }
  }
}
</style>
