<template>
  <div class="interfaces-dashboard">
    <header class="animate-in">
      <div class="header-title">
        <h1 v-i18n="'TIC Interface Management'" style="color: #d32f2f">TIC Interface Management</h1>
      </div>
      <div class="header-actions">
        <LanguageSwitcher />
        <div class="clock-display">{{ currentTime }}</div>
      </div>
    </header>

    <div class="interfaces-top-grid animate-in delay-1">
      <section class="card interfaces-card">
        <div class="interfaces-card-title" v-i18n="'Interfaces by Status'">Interfaces by Status</div>
        <div class="interfaces-chart-container">
          <div class="pie-chart-wrapper">
            <div ref="statusPieEl" class="echart-box"></div>
          </div>
          <div class="legend">
            <div
              v-for="item in statusLegend"
              :key="item.label"
              class="legend-item"
              :class="{ total: item.isTotal }"
            >
              <div class="legend-color" :style="{ backgroundColor: item.color }"></div>
              <span class="legend-text" v-i18n="item.label">{{ item.label }}</span>
              <span class="legend-value">{{ item.value }}</span>
              <span class="legend-percent">{{ item.percent }}</span>
            </div>
          </div>
        </div>
      </section>

      <section class="card interfaces-card">
        <div class="interfaces-card-title" v-i18n="'Interfaces by Status per Week'">Interfaces by Status per Week</div>
        <div class="line-chart-wrapper">
          <div ref="statusLineEl" class="echart-box"></div>
        </div>
      </section>
    </div>

    <div class="interfaces-bottom-grid animate-in delay-2">
      <section class="card interfaces-card">
        <div class="interfaces-card-title" v-i18n="'Interfaces by CCO'">Interfaces by CCO</div>
        <div class="interfaces-chart-container compact">
          <div class="bottom-chart-wrapper">
            <div ref="typePieEl" class="echart-box"></div>
          </div>
          <div class="legend compact">
            <div
              v-for="item in typeLegend"
              :key="'type-' + item.label"
              class="legend-item"
              :class="{ total: item.isTotal }"
            >
              <div class="legend-color" :style="{ backgroundColor: item.color }"></div>
              <span class="legend-text" v-i18n="item.label">{{ item.label }}</span>
              <span class="legend-value">{{ item.value }}</span>
              <span class="legend-percent">{{ item.percent }}</span>
            </div>
          </div>
        </div>
      </section>

      <section class="card interfaces-card">
        <div class="interfaces-card-title" v-i18n="'Interfaces by INFRA'">Interfaces by INFRA</div>
        <div class="interfaces-chart-container compact">
          <div class="bottom-chart-wrapper">
            <div ref="leadPieEl" class="echart-box"></div>
          </div>
          <div class="legend compact">
            <div
              v-for="item in leadLegend"
              :key="'lead-' + item.label"
              class="legend-item"
              :class="{ total: item.isTotal }"
            >
              <div class="legend-color" :style="{ backgroundColor: item.color }"></div>
              <span class="legend-text" v-i18n="item.label">{{ item.label }}</span>
              <span class="legend-value">{{ item.value }}</span>
              <span class="legend-percent">{{ item.percent }}</span>
            </div>
          </div>
        </div>
      </section>

      <section class="card interfaces-card">
        <div class="interfaces-card-title" v-i18n="'Interfaces by ESTAÇÃO'">Interfaces by ESTAÇÃO</div>
        <div class="interfaces-chart-container compact">
          <div class="bottom-chart-wrapper">
            <div ref="participatingPieEl" class="echart-box"></div>
          </div>
          <div class="legend compact">
            <div
              v-for="item in participatingLegend"
              :key="'part-' + item.label"
              class="legend-item"
              :class="{ total: item.isTotal }"
            >
              <div class="legend-color" :style="{ backgroundColor: item.color }"></div>
              <span class="legend-text" v-i18n="item.label">{{ item.label }}</span>
              <span class="legend-value">{{ item.value }}</span>
              <span class="legend-percent">{{ item.percent }}</span>
            </div>
          </div>
        </div>
      </section>

      <section class="card interfaces-card">
        <div class="interfaces-card-title" v-i18n="'Interfaces by PÁTIOS DE MANUTENÇÃO'">Interfaces by PÁTIOS DE MANUTENÇÃO</div>
        <div class="interfaces-chart-container compact">
          <div class="bottom-chart-wrapper">
            <div ref="extraPie1El" class="echart-box"></div>
          </div>
          <div class="legend compact">
            <div
              v-for="item in extra1Legend"
              :key="'extra1-' + item.label"
              class="legend-item"
              :class="{ total: item.isTotal }"
            >
              <div class="legend-color" :style="{ backgroundColor: item.color }"></div>
              <span class="legend-text" v-i18n="item.label">{{ item.label }}</span>
              <span class="legend-value">{{ item.value }}</span>
              <span class="legend-percent">{{ item.percent }}</span>
            </div>
          </div>
        </div>
      </section>

      <section class="card interfaces-card">
        <div class="interfaces-card-title" v-i18n="'Interfaces by SUBESTAÇÃO'">Interfaces by SUBESTAÇÃO</div>
        <div class="interfaces-chart-container compact">
          <div class="bottom-chart-wrapper">
            <div ref="extraPie2El" class="echart-box"></div>
          </div>
          <div class="legend compact">
            <div
              v-for="item in extra2Legend"
              :key="'extra2-' + item.label"
              class="legend-item"
              :class="{ total: item.isTotal }"
            >
              <div class="legend-color" :style="{ backgroundColor: item.color }"></div>
              <span class="legend-text" v-i18n="item.label">{{ item.label }}</span>
              <span class="legend-value">{{ item.value }}</span>
              <span class="legend-percent">{{ item.percent }}</span>
            </div>
          </div>
        </div>
      </section>

      <!-- <section class="card interfaces-card">
        <div class="interfaces-card-title" v-i18n="'Interfaces by Design Phase'">Interfaces by Design Phase</div>
        <div class="bar-chart-wrapper">
          <div ref="designPhaseBarEl" class="echart-box"></div>
        </div>
      </section> -->
    </div>
  </div>
</template>

<script setup>
import * as echarts from 'echarts'
import { computed, nextTick, onBeforeUnmount, onMounted, ref } from 'vue'
import LanguageSwitcher from '../components/LanguageSwitcher.vue'
import axios from "../assets/axios/base.js"

const currentTime = ref('')

const statusPieEl = ref(null)
const statusLineEl = ref(null)
const typePieEl = ref(null)
const leadPieEl = ref(null)
const participatingPieEl = ref(null)
const extraPie1El = ref(null)
const extraPie2El = ref(null)
const designPhaseBarEl = ref(null)

const statusLabels = ['Creating', 'System release', 'System update', 'Civil handover', 'Processing', 'Closed', 'Cancel']
const statusColors = ['#6c757d', '#1e88e5', '#00acc1', '#fb8c00', '#8e24aa', '#43a047', '#e53935']
let statusData = ref([])

const weeks = ref([])

const statusLineSeries = ref([
  { name: 'Creating', color: '#6c757d', data: [] },
  { name: 'System release', color: '#1e88e5', data: [] },
  { name: 'System update', color: '#00acc1', data: [] },
  { name: 'Civil handover', color: '#fb8c00', data: [] },
  { name: 'Processing', color: '#8e24aa', data: [] },
  { name: 'Closed', color: '#43a047', data: [] },
  { name: 'Cancel', color: '#e53935', data: [] },
])

let typeData = ref([])
let leadData = ref([])
let participatingData = ref([])
let extra1Data = ref([])
let extra2Data = ref([])

const baseColors = ['#fdd835', '#1e88e5', '#00acc1', '#fb8c00', '#8e24aa', '#43a047', '#333333', '#e53935']
const typeColors = ['#d32f2f', '#1976d2', '#388e3c', '#f57c00', '#7b1fa2', '#00838f', '#5d4037']
const leadColors = ['#ffb300', '#3949ab', '#00897b', '#f4511e', '#8e24aa', '#7cb342', '#546e7a']
const participatingColors = ['#ec407a', '#ab47bc', '#ffca28', '#42a5f5', '#ef5350', '#26a69a', '#7cb342']
const extra1Colors = ['#f4511e', '#1e88e5', '#00acc1', '#8e24aa', '#e53935', '#fdd835', '#43a047']
const extra2Colors = ['#ff7043', '#5c6bc0', '#9ccc65', '#ffb74d', '#4db6ac', '#a1887f', '#ba68c8']

function formatLegend(labels, colors, data) {
  // const total = data.reduce((sum, value) => sum + value, 0)
  const total = data[7]
  const rows = labels.map((label, index) => ({
    label: window.i18nManager.getText(label),
    color: colors[index],
    value: data[index],
    percent: total ? `${((data[index] / total) * 100).toFixed(1)}%` : '0.0%',
    isTotal: false,
  }))
  rows.push({
    label: 'TOTAL',
    color: colors[7] || '#333',
    value: total,
    percent: '100.0%',
    isTotal: true,
  })
  return rows
}

const statusLegend = computed(() => formatLegend(statusLabels, baseColors, statusData.value))
const typeLegend = computed(() => formatLegend(statusLabels, baseColors, typeData.value))
const leadLegend = computed(() => formatLegend(statusLabels, baseColors, leadData.value))
const participatingLegend = computed(() => formatLegend(statusLabels, baseColors, participatingData.value))
const extra1Legend = computed(() => formatLegend(statusLabels, baseColors, extra1Data.value))
const extra2Legend = computed(() => formatLegend(statusLabels, baseColors, extra2Data.value))

function updateClock() {
  const now = new Date()
  const year = now.getFullYear()
  const month = String(now.getMonth() + 1).padStart(2, '0')
  const day = String(now.getDate()).padStart(2, '0')
  const hours = String(now.getHours()).padStart(2, '0')
  const minutes = String(now.getMinutes()).padStart(2, '0')
  const seconds = String(now.getSeconds()).padStart(2, '0')
  currentTime.value = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`
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

function initPieChart(chart, labels, data, colors) {
  chart.setOption({
    backgroundColor: 'transparent',
    tooltip: { trigger: 'item' },
    series: [
      {
        type: 'pie',
        radius: '72%',
        center: ['50%', '50%'],
        data: labels.map((label, index) => ({
          name: window.i18nManager.getText(label),
          value: data[index],
          itemStyle: { color: colors[index], borderColor: '#ffffff', borderWidth: 2 },
        })),
        label: { show: false },
        emphasis: { scale: true, scaleSize: 8 },
      },
    ],
  })
}

function initLineChart(chart) {
  chart.setOption({
    backgroundColor: 'transparent',
    tooltip: { trigger: 'axis' },
    legend: {
      top: 8,
      type: 'scroll',
      textStyle: { color: '#64748b', fontSize: 11 },
    },
    grid: { left: 48, right: 24, top: 40, bottom: 38 },
    xAxis: {
      type: 'category',
      data: weeks.value,
      axisLabel: { fontSize: 10, color: '#64748b' },
      axisLine: { lineStyle: { color: 'rgba(100, 116, 139, 0.3)' } },
    },
    yAxis: {
      type: 'value',
      axisLabel: { fontSize: 10, color: '#64748b' },
      splitLine: { lineStyle: { color: 'rgba(148, 163, 184, 0.25)' } },
    },
    series: statusLineSeries.value.map((s, i) => ({
      name: window.i18nManager.getText(s.name),
      type: 'line',
      data: s.data,
      smooth: true,
      showSymbol: true,
      symbolSize: 4,
      lineStyle: { color: baseColors[i], width: 2 },
      itemStyle: { color: baseColors[i] },
    })),
  })
}

const designPhaseLabels = ref([])
const designPhaseData = ref([])
function initDesignPhaseBar(chart) {
  // const designPhaseLabels = ['Preliminary Design', 'Basic Design', 'Execution Design']
  // const designPhaseData = [typeData.value, leadData.value, participatingData.value]
  const statusColorMap = {
    Creating: '#6c757d',
    'System release': '#1e88e5',
    'System update': '#00acc1',
    'Civil handover': '#fb8c00',
    Processing: '#8e24aa',
    Closed: '#43a047',
    Cancel: '#e53935',
  }

  chart.setOption({
    backgroundColor: 'transparent',
    tooltip: { trigger: 'axis', axisPointer: { type: 'shadow' } },
    legend: {
      orient: 'vertical',
      right: 8,
      textStyle: { color: '#64748b', fontSize: 11 },
      itemWidth: 14
    },
    grid: { left: 80, right: 130, top: 10, bottom: 40 },
    xAxis: {
      type: 'category',
      data: window.i18nManager.getText(designPhaseLabels.value),
      axisLabel: { color: '#64748b', fontSize: 11 },
      axisLine: { lineStyle: { color: 'rgba(100, 116, 139, 0.3)' } },
      nameLocation: 'middle',
      nameGap: 28,
      nameTextStyle: { color: '#64748b' },
    },
    yAxis: {
      type: 'value',
      axisLabel: { color: '#64748b', fontSize: 11 },
      splitLine: { lineStyle: { color: 'rgba(148, 163, 184, 0.25)' } },
      nameLocation: 'middle',
      nameGap: 42,
      nameTextStyle: { color: '#64748b' },
    },
    series: statusLabels.map((status, statusIndex) => ({
      name: window.i18nManager.getText(status),
      type: 'bar',
      stack: 'total',
      itemStyle: { color: statusColorMap[status] },
      label: {
        show: true,
        position: 'inside',
        color: '#ffffff',
        fontSize: 11,
        formatter: (p) => (p.value ? String(p.value) : ''),
      },
      data: designPhaseData.value.map((phase) => phase[statusIndex]),
    })),
  })
}

let clockTimer = null
let resizeHandler = null
const chartInstances = []


onMounted(async () => {
  initFun()
  const res = await axios.getTableData('V_CRHK_JKKZB')
  statusData.value = [
    res.data.data.find(el => el.CRHK_IVC_JKZT === 'Creating')?.TOTAL_STATUS_COUNT || 0,
    res.data.data.find(el => el.CRHK_IVC_JKZT === 'System release')?.TOTAL_STATUS_COUNT || 0,
    res.data.data.find(el => el.CRHK_IVC_JKZT === 'System update')?.TOTAL_STATUS_COUNT || 0,
    res.data.data.find(el => el.CRHK_IVC_JKZT === 'Civil handover')?.TOTAL_STATUS_COUNT || 0,
    res.data.data.find(el => el.CRHK_IVC_JKZT === 'Processing')?.TOTAL_STATUS_COUNT || 0,
    res.data.data.find(el => el.CRHK_IVC_JKZT === 'Closed')?.TOTAL_STATUS_COUNT || 0,
    res.data.data.find(el => el.CRHK_IVC_JKZT === 'Cancel')?.TOTAL_STATUS_COUNT || 0,
    res.data.data.length,
  ]

  weeks.value = [...new Set(res.data.data.map(item => item.UUU_RECORD_LAST_UPDATE_DATE))]
  weeks.value.forEach((el, index) => {
    statusLineSeries.value.forEach(_el => _el.data[index] = res.data.data.filter(item => {
      return new Date(item.UUU_RECORD_LAST_UPDATE_DATE).getTime() <= new Date(el).getTime() && item.CRHK_IVC_JKZT === _el.name
      // item.UUU_RECORD_LAST_UPDATE_DATE === el && item.CRHK_IVC_JKZT === _el.name
    }).length)
  })

  typeData.value = [
    res.data.data.find(el => el.CRHK_IVC_JKZT === 'Creating' && el.CRHK_IVC_GCQYFL === 'CCO')?.GCQYFL_STATUS_COUNT || 0,
    res.data.data.find(el => el.CRHK_IVC_JKZT === 'System release' && el.CRHK_IVC_GCQYFL === 'CCO')?.GCQYFL_STATUS_COUNT || 0,
    res.data.data.find(el => el.CRHK_IVC_JKZT === 'System update' && el.CRHK_IVC_GCQYFL === 'CCO')?.GCQYFL_STATUS_COUNT || 0,
    res.data.data.find(el => el.CRHK_IVC_JKZT === 'Civil handover' && el.CRHK_IVC_GCQYFL === 'CCO')?.GCQYFL_STATUS_COUNT || 0,
    res.data.data.find(el => el.CRHK_IVC_JKZT === 'Processing' && el.CRHK_IVC_GCQYFL === 'CCO')?.GCQYFL_STATUS_COUNT || 0,
    res.data.data.find(el => el.CRHK_IVC_JKZT === 'Closed' && el.CRHK_IVC_GCQYFL === 'CCO')?.GCQYFL_STATUS_COUNT || 0,
    res.data.data.find(el => el.CRHK_IVC_JKZT === 'Cancel' && el.CRHK_IVC_GCQYFL === 'CCO')?.GCQYFL_STATUS_COUNT || 0,
    res.data.data.filter(el => el.CRHK_IVC_GCQYFL === 'CCO').length,
  ]
  leadData.value = [
    res.data.data.find(el => el.CRHK_IVC_JKZT === 'Creating' && el.CRHK_IVC_GCQYFL === 'INFRA')?.GCQYFL_STATUS_COUNT || 0,
    res.data.data.find(el => el.CRHK_IVC_JKZT === 'System release' && el.CRHK_IVC_GCQYFL === 'INFRA')?.GCQYFL_STATUS_COUNT || 0,
    res.data.data.find(el => el.CRHK_IVC_JKZT === 'System update' && el.CRHK_IVC_GCQYFL === 'INFRA')?.GCQYFL_STATUS_COUNT || 0,
    res.data.data.find(el => el.CRHK_IVC_JKZT === 'Civil handover' && el.CRHK_IVC_GCQYFL === 'INFRA')?.GCQYFL_STATUS_COUNT || 0,
    res.data.data.find(el => el.CRHK_IVC_JKZT === 'Processing' && el.CRHK_IVC_GCQYFL === 'INFRA')?.GCQYFL_STATUS_COUNT || 0,
    res.data.data.find(el => el.CRHK_IVC_JKZT === 'Closed' && el.CRHK_IVC_GCQYFL === 'INFRA')?.GCQYFL_STATUS_COUNT || 0,
    res.data.data.find(el => el.CRHK_IVC_JKZT === 'Cancel' && el.CRHK_IVC_GCQYFL === 'INFRA')?.GCQYFL_STATUS_COUNT || 0,
    res.data.data.filter(el => el.CRHK_IVC_GCQYFL === 'INFRA').length,
  ]
  participatingData.value = [
    res.data.data.find(el => el.CRHK_IVC_JKZT === 'Creating' && el.CRHK_IVC_GCQYFL === 'ESTAÇÃO')?.GCQYFL_STATUS_COUNT || 0,
    res.data.data.find(el => el.CRHK_IVC_JKZT === 'System release' && el.CRHK_IVC_GCQYFL === 'ESTAÇÃO')?.GCQYFL_STATUS_COUNT || 0,
    res.data.data.find(el => el.CRHK_IVC_JKZT === 'System update' && el.CRHK_IVC_GCQYFL === 'ESTAÇÃO')?.GCQYFL_STATUS_COUNT || 0,
    res.data.data.find(el => el.CRHK_IVC_JKZT === 'Civil handover' && el.CRHK_IVC_GCQYFL === 'ESTAÇÃO')?.GCQYFL_STATUS_COUNT || 0,
    res.data.data.find(el => el.CRHK_IVC_JKZT === 'Processing' && el.CRHK_IVC_GCQYFL === 'ESTAÇÃO')?.GCQYFL_STATUS_COUNT || 0,
    res.data.data.find(el => el.CRHK_IVC_JKZT === 'Closed' && el.CRHK_IVC_GCQYFL === 'ESTAÇÃO')?.GCQYFL_STATUS_COUNT || 0,
    res.data.data.find(el => el.CRHK_IVC_JKZT === 'Cancel' && el.CRHK_IVC_GCQYFL === 'ESTAÇÃO')?.GCQYFL_STATUS_COUNT || 0,
    res.data.data.filter(el => el.CRHK_IVC_GCQYFL === 'ESTAÇÃO').length,
  ]
  extra1Data.value = [
    res.data.data.find(el => el.CRHK_IVC_JKZT === 'Creating' && el.CRHK_IVC_GCQYFL === 'PÁTIOS DE MANUTENÇÃO')?.GCQYFL_STATUS_COUNT || 0,
    res.data.data.find(el => el.CRHK_IVC_JKZT === 'System release' && el.CRHK_IVC_GCQYFL === 'PÁTIOS DE MANUTENÇÃO')?.GCQYFL_STATUS_COUNT || 0,
    res.data.data.find(el => el.CRHK_IVC_JKZT === 'System update' && el.CRHK_IVC_GCQYFL === 'PÁTIOS DE MANUTENÇÃO')?.GCQYFL_STATUS_COUNT || 0,
    res.data.data.find(el => el.CRHK_IVC_JKZT === 'Civil handover' && el.CRHK_IVC_GCQYFL === 'PÁTIOS DE MANUTENÇÃO')?.GCQYFL_STATUS_COUNT || 0,
    res.data.data.find(el => el.CRHK_IVC_JKZT === 'Processing' && el.CRHK_IVC_GCQYFL === 'PÁTIOS DE MANUTENÇÃO')?.GCQYFL_STATUS_COUNT || 0,
    res.data.data.find(el => el.CRHK_IVC_JKZT === 'Closed' && el.CRHK_IVC_GCQYFL === 'PÁTIOS DE MANUTENÇÃO')?.GCQYFL_STATUS_COUNT || 0,
    res.data.data.find(el => el.CRHK_IVC_JKZT === 'Cancel' && el.CRHK_IVC_GCQYFL === 'PÁTIOS DE MANUTENÇÃO')?.GCQYFL_STATUS_COUNT || 0,
    res.data.data.filter(el => el.CRHK_IVC_GCQYFL === 'PÁTIOS DE MANUTENÇÃO').length,
  ]
  extra2Data.value = [
    res.data.data.find(el => el.CRHK_IVC_JKZT === 'Creating' && el.CRHK_IVC_GCQYFL === 'SUBESTAÇÃO')?.GCQYFL_STATUS_COUNT || 0,
    res.data.data.find(el => el.CRHK_IVC_JKZT === 'System release' && el.CRHK_IVC_GCQYFL === 'SUBESTAÇÃO')?.GCQYFL_STATUS_COUNT || 0,
    res.data.data.find(el => el.CRHK_IVC_JKZT === 'System update' && el.CRHK_IVC_GCQYFL === 'SUBESTAÇÃO')?.GCQYFL_STATUS_COUNT || 0,
    res.data.data.find(el => el.CRHK_IVC_JKZT === 'Civil handover' && el.CRHK_IVC_GCQYFL === 'SUBESTAÇÃO')?.GCQYFL_STATUS_COUNT || 0,
    res.data.data.find(el => el.CRHK_IVC_JKZT === 'Processing' && el.CRHK_IVC_GCQYFL === 'SUBESTAÇÃO')?.GCQYFL_STATUS_COUNT || 0,
    res.data.data.find(el => el.CRHK_IVC_JKZT === 'Closed' && el.CRHK_IVC_GCQYFL === 'SUBESTAÇÃO')?.GCQYFL_STATUS_COUNT || 0,
    res.data.data.find(el => el.CRHK_IVC_JKZT === 'Cancel' && el.CRHK_IVC_GCQYFL === 'SUBESTAÇÃO')?.GCQYFL_STATUS_COUNT || 0,
    res.data.data.filter(el => el.CRHK_IVC_GCQYFL === 'SUBESTAÇÃO').length,
  ]

  designPhaseLabels.value = [...new Set(res.data.data.map(item => item.CRHK_IVC_XMJD).filter(el => !!el))]
  designPhaseLabels.value.forEach((item, index) => {
    designPhaseData.value[index] = [
      res.data.data.find(el => el.CRHK_IVC_JKZT === 'Creating' && el.CRHK_IVC_XMJD === item)?.XMJD_STATUS_COUNT || 0,
      res.data.data.find(el => el.CRHK_IVC_JKZT === 'System release' && el.CRHK_IVC_XMJD === item)?.XMJD_STATUS_COUNT || 0,
      res.data.data.find(el => el.CRHK_IVC_JKZT === 'System update' && el.CRHK_IVC_XMJD === item)?.XMJD_STATUS_COUNT || 0,
      res.data.data.find(el => el.CRHK_IVC_JKZT === 'Civil handover' && el.CRHK_IVC_XMJD === item)?.XMJD_STATUS_COUNT || 0,
      res.data.data.find(el => el.CRHK_IVC_JKZT === 'Processing' && el.CRHK_IVC_XMJD === item)?.XMJD_STATUS_COUNT || 0,
      res.data.data.find(el => el.CRHK_IVC_JKZT === 'Closed' && el.CRHK_IVC_XMJD === item)?.XMJD_STATUS_COUNT || 0,
      res.data.data.find(el => el.CRHK_IVC_JKZT === 'Cancel' && el.CRHK_IVC_XMJD === item)?.XMJD_STATUS_COUNT || 0,
    ]
  })
  renderChart()
})

async function initFun() {
  window.addEventListener('languageChanged', updateLanguage);
  const savedTheme = localStorage.getItem('theme')
  const systemDark = window.matchMedia('(prefers-color-scheme: dark)').matches
  if (savedTheme === 'dark' || (!savedTheme && systemDark)) {
    document.documentElement.setAttribute('data-theme', 'dark')
  }

  updateClock()
  clockTimer = setInterval(updateClock, 1000)

}

const updateLanguage = () => {
  renderChart()
}

function renderChart() {
  const chartsToInit = [
    { el: statusPieEl.value, init: (c) => initPieChart(c, statusLabels, statusData.value, baseColors) },
    { el: statusLineEl.value, init: initLineChart },
    { el: typePieEl.value, init: (c) => initPieChart(c, statusLabels, typeData.value, baseColors) },
    { el: leadPieEl.value, init: (c) => initPieChart(c, statusLabels, leadData.value, baseColors) },
    { el: participatingPieEl.value, init: (c) => initPieChart(c, statusLabels, participatingData.value, baseColors) },
    { el: extraPie1El.value, init: (c) => initPieChart(c, statusLabels, extra1Data.value, baseColors) },
    { el: extraPie2El.value, init: (c) => initPieChart(c, statusLabels, extra2Data.value, baseColors) },
    // { el: designPhaseBarEl.value, init: initDesignPhaseBar },
  ]

  chartsToInit.forEach(({ el, init }) => {
    if (!el) return
    const instance = echarts.init(el)
    init(instance)
    chartInstances.push(instance)
  })

  resizeHandler = () => chartInstances.forEach((c) => c.resize())
  window.addEventListener('resize', resizeHandler)
}

onBeforeUnmount(() => {
  if (clockTimer) clearInterval(clockTimer)
  if (resizeHandler) window.removeEventListener('resize', resizeHandler)
  chartInstances.forEach((c) => c.dispose())
  window.removeEventListener('languageChanged', updateLanguage);
})
</script>

<style scoped>
.interfaces-dashboard{
  padding: 20px;
}

.animate-in {
  margin: 15px 0;
}
.interfaces-top-grid {
  display: grid;
  grid-template-columns: 1fr 2fr;
  gap: 16px;
}

.interfaces-bottom-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 16px;
}

.interfaces-card-title {
  text-align: center;
  font-size: 16px;
  font-weight: 700;
  color: var(--text-primary);
  margin-bottom: 10px;
}

.interfaces-chart-container {
  display: flex;
  align-items: stretch;
  justify-content: space-between;
  gap: 14px;
  width: 100%;
}

.interfaces-chart-container.compact {
  gap: 10px;
}

.pie-chart-wrapper {
  flex: 1 1 0;
  min-width: 280px;
  height: 320px;
}

.bottom-chart-wrapper {
  flex: 1 1 0;
  min-width: 0;
  height: 245px;
}

.line-chart-wrapper {
  width: 100%;
  height: 340px;
}

.bar-chart-wrapper {
  width: 100%;
  height: 245px;
}

.echart-box {
  width: 100%;
  height: 100%;
}

.legend {
  flex: 0 0 260px;
  font-size: 13px;
  color: var(--text-secondary);
}

.legend.compact {
  flex-basis: 228px;
  font-size: 12px;
}

.legend-item {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 8px;
  white-space: nowrap;
}

.legend-item.total {
  border-top: 1px solid var(--border-color);
  padding-top: 6px;
  margin-top: 6px;
}

.legend-color {
  width: 14px;
  height: 14px;
  border: 1px solid rgba(148, 163, 184, 0.8);
  border-radius: 3px;
}

.legend-text {
  width: 130px;
  overflow: hidden;
  text-overflow: ellipsis;
}

.legend-value {
  width: 48px;
  text-align: right;
  color: var(--text-primary);
  font-weight: 600;
}

.legend-percent {
  width: 56px;
  text-align: right;
}

@media (max-width: 1440px) {
  .interfaces-top-grid {
    grid-template-columns: 1fr;
  }

  .interfaces-bottom-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  .pie-chart-wrapper {
    height: 280px;
  }
}

@media (max-width: 1200px) {
  .interfaces-chart-container {
    flex-direction: column;
    align-items: center;
  }

  .legend {
    width: 100%;
    flex-basis: auto;
  }

  .pie-chart-wrapper,
  .bottom-chart-wrapper {
    width: 100%;
    max-width: 360px;
    height: 240px;
    min-width: 0;
  }

  .line-chart-wrapper {
    height: 280px;
  }

  .interfaces-bottom-grid {
    grid-template-columns: 1fr;
  }
}
</style>

