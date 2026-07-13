<template>
  <div class="qingdan-page">
    <div class="container-wrap">
      <div class="layout-row">
        <aside class="left-col">
          <div class="filter-section">
            <div class="logo">
              <span class="logo-red" v-i18n="'Demand Matrix'">Demand Matrix</span>
              <LanguageSwitcher style="position: absolute; right: 0px" />
            </div>

            <div class="filter-block">
                <div class="date-range" style="justify-content: center">
                    {{ currentTime }}
                </div>
            </div>

            <!-- <div class="filter-block">
              <div class="date-range">
                <input v-model="startDate" type="date" />
                <span>-</span>
                <input v-model="endDate" type="date" />
              </div>
            </div> -->
            <div class="filter-block">
              <label v-i18n="'Design Phase'">Design Phase</label>
              <select v-model="designPhase" class="ctl">
                <option value="all">All</option>
                <option v-for="item in designPhases" :key="item" :value="item" v-i18n="item === '单线基本设计' ? '单线基本设计2' : item">{{ item }}</option>
              </select>
            </div>
            <div class="filter-block">
              <label v-i18n="'Specialty'">Specialty</label>
              <select v-model="specialty" class="ctl">
                <option value="all">All</option>
                <option v-for="item in specialties" :key="item" :value="item" v-i18n="item === '接触网' ? '接触网2' : item">{{ item }}</option>
              </select>
            </div>
            <div class="filter-block">
              <label v-i18n="'Is It Satisfied'">Is It Satisfied</label>
              <select v-model="satisfied" class="ctl">
                <option value="all">All</option>
                <option v-for="item in fulfillTheDemands" :key="item" :value="item" v-i18n="item">{{ item }}</option>
              </select>
            </div>
          </div>
        </aside>

        <main class="right-col">
          <div class="chart-card">
            <div class="chart-header">
              <div>
                <h5 v-i18n="'Total Demand: '">Total Demand: <span class="text-primary">{{ totalDeliverables }}</span></h5>
                <div class="status-legend">
                  <span v-i18n="'Satisfy'"><i class="dot completed"></i>Satisfy</span>
                  <span v-i18n="'Unsatisfied'"><i class="dot delay-unfinished"></i>Unsatisfied</span>
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
                <div class="progress-text" style="width: 200%; top: 85%; font-size: 16px; text-align: center" v-i18n="'Demand Satisfaction Rate'">Demand Satisfaction Rate</div>
              </div>
            </div>
            <div ref="chartRef" class="deliverables-chart"></div>
          </div>
        </main>
      </div>

      <div class="table-card" v-auto-scroll>
        <h5 v-i18n="'Demand List'">Demand List</h5>
        <div class="table-wrap">
          <table class="table-body">
            <thead>
              <tr>
                <th v-i18n="'SYSTRA Demand Number'">SYSTRA Demand Number</th>
                <th v-i18n="'TUV Demand Number'">TUV Demand Number</th>
                <th v-i18n="'Design Phase'">Design Phase</th>
                <th v-i18n="'Specialty'">Specialty</th>
                <th v-i18n="'Is It Satisfied'">Is It Satisfied</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="row in tableData" :key="row.CRHK_IL_QDBH1">
                <td>{{ row.CRHK_DM_SXQBH }}</td>
                <td>{{ row.CRHK_DM_TUVXQBH }}</td>
                <td v-i18n="row.CRHK_DDL_SJJD_PD === '单线基本设计' ? '单线基本设计2' : row.CRHK_DDL_SJJD_PD">{{ row.CRHK_DDL_SJJD_PD }}</td>
                <td v-i18n="row.CRHK_DM_ZY === '接触网' ? '接触网2' : row.CRHK_DM_ZY">{{ row.CRHK_DM_ZY }}</td>
                <td v-i18n="row.CRHK_DM_MZYQ">{{ row.CRHK_DM_MZYQ }}</td>
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
import axios from "../assets/axios/demandMatrix.js"
import LanguageSwitcher from '../components/LanguageSwitcher.vue';

let specialties = []
let designPhases = []
let fulfillTheDemands = []

const currentTime = ref('')
const startDate = ref('')
const endDate = ref('')
const specialty = ref('all')
const designPhase = ref('all')
const satisfied = ref('all')

const chartRef = ref(null)
let chart = null

const deliverablesData = ref([])

const filteredDeliverables = computed(() => {
  // const start = startDate.value ? new Date(startDate.value) : null
  // const end = endDate.value ? new Date(endDate.value) : null

  return deliverablesData.value.filter((item) => {
    if (designPhase.value !== 'all' && item.CRHK_DDL_SJJD_PD !== designPhase.value) return false
    if (specialty.value !== 'all' && item.CRHK_DM_ZY !== specialty.value) return false
    if (satisfied.value !== 'all' && item.CRHK_DM_MZYQ !== satisfied.value) return false
    return true
  })
})

const tableData = computed(() => {
  return filteredDeliverables.value.slice(0, 300)
})

function updateClock() {
  const now = new Date()
  currentTime.value = now.toLocaleString()
}

const totalDeliverables = computed(() => filteredDeliverables.value.length)

const completedCount = computed(() => {
  return filteredDeliverables.value.filter((item) => item.CRHK_DM_MZYQ === '是').length
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
    Satisfy: { key: '是', color: '#28a745' },
    Unsatisfied: { key: '否', color: '#dc3545' },
  }
  console.log(deliverablesData.value)
  const dataList = deliverablesData.value.filter((item) => {
    if (designPhase.value !== 'all' && item.CRHK_DDL_SJJD_PD !== designPhase.value) return false
    return true
  })

  const datasets = Object.keys(statusMap).map((label) => {
    const cfg = statusMap[label]
    return {
      name: window.i18nManager.getText(label),
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
        return dataList.filter((item) => item.CRHK_DM_ZY === sp && item.CRHK_DM_MZYQ === cfg.key).length
      }),
    }
  })

  statusMap["满足"] = { key: '是', color: '#28a745' }
  statusMap["不满足"] = { key: '否', color: '#dc3545' }
  chart.on('click', function(params) {
    specialties.forEach((item) => {
      if (window.i18nManager.getText(item) === params.name) {
        specialty.value = item
      }
    })
    satisfied.value = statusMap[params.seriesName].key
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
  updateClock()
  const clockInterval = setInterval(updateClock, 1000)
  axios.getOptionsList()
  .then((res) => {
    designPhases = res.data.data.xqjz.DesignPhase
    specialties = res.data.data.xqjz.Specialty
    fulfillTheDemands = res.data.data.xqjz.FulfillTheDemands
  })
  axios.getTableData()
  .then((res) => {
    deliverablesData.value = res.data.data
  })
  await nextTick()
  chart = echarts.init(chartRef.value)
  renderChart()
  window.addEventListener('resize', onResize)
  onUnmounted(() => clearInterval(clockInterval))
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
    margin-right: 30px;

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
        min-width: 200px;
      }
      td:nth-child(3) {
        min-width: 120px;
      }
      td:nth-child(4) {
        min-width: 120px;
      }
      td:nth-child(5) {
        min-width: 120px;
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
