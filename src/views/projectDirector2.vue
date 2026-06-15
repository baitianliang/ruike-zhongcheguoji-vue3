<template>
  <div class="project-director-page" v-loading="loading" element-loading-background="rgba(122, 122, 122, 0.8)">
    <!-- 动态背景画布 -->
    <!-- <canvas id="bgCanvasDirector" ref="bgCanvasRef"></canvas>
    <div class="grid-bg"></div>
    <div class="glow-orb orb1"></div>
    <div class="glow-orb orb2"></div>
    <div class="glow-orb orb3"></div>
    <div class="data-flow-line line1"></div>
    <div class="data-flow-line line2"></div> -->

    <div class="page">
      <header class="header">
        <div class="header-time" id="headerTime">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="12" cy="12" r="10"/>
            <path d="M12 6v6l4 2" stroke-linecap="round"/>
          </svg>
          <span>{{ currentTime }}</span>
        </div>
        <div class="header-title">
          <h1>项目总监功能看板</h1>
        </div>
        <div class="nav-right">
          <button class="nav-btn" @click="router.push('/projectDirector')">{{ t('浅色') }}</button>
          <button class="nav-btn" @click="toggleLanguage">中/EN</button>
        </div>
      </header>

      <!-- 统计卡片 -->
      <div class="stats-bar">
        <div class="stat-card">
          <div class="stat-left">
            <div class="stat-label">{{ t('task_messages') }}</div>
            <div class="stat-value red" data-count="0">{{ dashboardData.ZSL || 0 }}</div>
            <div class="stat-sub">{{ t('vs_yesterday') }} +{{ dashboardData.RWZL || 0 }}</div>
          </div>
          <div class="stat-icon-wrap">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M21 15a4 4 0 0 1-4 4H8l-5 3V7a4 4 0 0 1 4-4h10a4 4 0 0 1 4 4z" stroke-linejoin="round"/>
            </svg>
          </div>
        </div>
        <div class="stat-card">
          <div class="stat-left">
            <div class="stat-label">{{ t('requirements') }}</div>
            <div class="stat-value green">{{ dashboardData.XQZSL || 0 }}</div>
            <div class="stat-sub">{{ t('requirement_compliance') }} {{ dashboardData.XQFHD || '100%' }}</div>
          </div>
          <div class="stat-icon-wrap">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" stroke-linejoin="round"/>
              <path d="M14 2v6h6M8 13h8M8 17h6" stroke-linecap="round"/>
            </svg>
          </div>
        </div>
        <div class="stat-card">
          <div class="stat-left">
            <div class="stat-label">{{ t('project_health') }}</div>
            <div class="stat-value">&nbsp;</div>
            <div class="stat-sub">{{ t('status_excellent') }}</div>
          </div>
          <div class="stat-icon-wrap">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M22 12h-4l-3 8-6-16-3 8H2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </div>
        </div>
      </div>

      <div class="main">
        <!-- 左侧列 -->
        <div class="column">
          <!-- 团队成员表现 -->
          <div class="panel" style="flex: 1; height: 100%">
            <div class="panel-header">
              <div class="panel-title">{{ t('team_performance') }}<span class="breathing-dot cyan"></span></div>
              <!-- <div class="search-wrapper">
                <input 
                  type="text" 
                  class="search-input" 
                  v-model="searchQuery"
                  :placeholder="t('search_placeholder')"
                />
                <button class="search-btn-tech" @click="searchMembers">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <circle cx="11" cy="11" r="7"/>
                    <path d="M20 20l-3.6-3.6" stroke-linecap="round"/>
                  </svg>
                  {{ t('search') }}
                </button>
              </div> -->
            </div>
            <div class="panel-body">
              <table class="data-table">
                <thead>
                  <tr>
                    <th class="blue">{{ t('name') }}</th>
                    <th class="blue">{{ t('position') }}</th>
                    <th class="blue">{{ t('weekly_task_count') }}</th>
                    <th class="blue">{{ t('completed_count') }}</th>
                    <th class="blue">{{ t('overdue_count') }}</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="member in paginatedMembers" :key="member.id" @click="showDetail(member)">
                    <td style="color: white">{{ member.FZRXM }}</td>
                    <td><span class="tag">{{ member.RYGW }}</span></td>
                    <td class="num">{{ member.BZRWSL }}</td>
                    <td class="ok">{{ member.BZRWWCSL }}</td>
                    <td :class="{ delay: member.YWSL > 0 }">{{ member.YWSL }}</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <nav class="pagination" v-if="totalPages > 1">
              <button class="page-btn" :class="{ disabled: currentPage === 1 }" @click="prevPage" :disabled="currentPage === 1">{{ t('prev_page') }}</button>
              <button 
                v-for="page in totalPages" 
                :key="page"
                class="page-btn" 
                :class="{ active: currentPage === page }"
                @click="goToPage(page)"
              >{{ page }}</button>
              <button class="page-btn" :class="{ disabled: currentPage === totalPages }" @click="nextPage" :disabled="currentPage === totalPages">{{ t('next_page') }}</button>
            </nav>
          </div>

          <!-- 临时任务情况 -->
          <div class="panel" style="flex: 1; height: 100%">
            <div class="panel-header">
              <div class="panel-header-left">
                <div class="panel-title">{{ t('temporary_task_status') }}<span class="breathing-dot blue"></span></div>
              </div>
              <div class="panel-header-right">
                <span class="delay-badge">{{ t('number_of_delays') }}: {{ delayCount }}</span>
              </div>
            </div>
            <div class="panel-body">
              <table class="data-table">
                <thead>
                  <tr>
                    <th class="orange">{{ t('task_name') }}</th>
                    <th class="orange">{{ t('person_in_charge') }}</th>
                    <th class="orange">{{ t('planned_completion_time') }}</th>
                    <th class="orange">{{ t('is_delayed') }}</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="task in paginatedTemporaryTasks" :key="task.id">
                    <td style="color: white">{{ task.CRHK_DTP_ZYMC }}</td>
                    <td>{{ task.CRHK_RWFZRXM }}</td>
                    <td>{{ task.CRHK_DTP_JHWCSJ }}</td>
                    <td :class="{ ok: task.SFYW === '否', delay: task.SFYW === '是' }">{{ task.SFYW }}</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <nav class="pagination" v-if="totalPages2 > 1">
              <button class="page-btn" :class="{ disabled: currentPage2 === 1 }" @click="prevPage2" :disabled="currentPage2 === 1">{{ t('prev_page') }}</button>
              <button 
                v-for="page in totalPages2" 
                :key="page"
                class="page-btn" 
                :class="{ active: currentPage2 === page }"
                @click="goToPage2(page)"
              >{{ page }}</button>
              <button class="page-btn" :class="{ disabled: currentPage2 === totalPages2 }" @click="nextPage2" :disabled="currentPage2 === totalPages2">{{ t('next_page') }}</button>
            </nav>
          </div>
        </div>

        <!-- 右侧列 -->
        <div class="column">
          <!-- 上游表现 -->
          <div class="panel">
            <div class="panel-header">
              <div class="panel-title">{{ t('upstream_performance') }}<span class="breathing-dot blue"></span></div>
            </div>
            <div class="panel-body">
              <div class="ring-container">
                <button class="ring-nav-btn" @click="prevUpstream">&#8249;</button>
                <div class="ring-row">
                  <div class="ring-item" v-for="(item, idx) in currentUpstreamItems" :key="idx">
                    <div class="ring-info">
                      <div class="ring-name">{{ item.CRHK_DDLI_SYFDW }}</div>
                      <div class="ring-nums">
                        <div class="ring-num-item">
                          <div class="ring-num-label" style="color: white">{{ t('task_count') }}</div>
                          <div class="ring-num-value task">{{ item.BZRWSL }}</div>
                        </div>
                        <div class="ring-num-item">
                          <div class="ring-num-label" style="color: white">{{ t('completed_count') }}</div>
                          <div class="ring-num-value done">{{ item.BZRWWCSL }}</div>
                        </div>
                      </div>
                    </div>
                    <div class="ring-chart-wrapper">
                      <!-- <div class="ring-chart" :style="getConicGradient(item.WCBL)">
                        <div class="ring-pct">{{ item.WCBL }}</div>
                      </div> -->
                      <div class="ring-chart" :id="'upstreamRing' + idx"></div>
                      <div class="ring-pct">{{ item.WCBL }}</div>
                    </div>
                  </div>
                </div>
                <button class="ring-nav-btn" @click="nextUpstream">&#8250;</button>
              </div>
            </div>
          </div>

          <!-- 下游表现 -->
          <div class="panel">
            <div class="panel-header">
              <div class="panel-title">{{ t('downstream_performance') }}<span class="breathing-dot purple"></span></div>
            </div>
            <div class="panel-body">
              <div class="ring-container">
                <button class="ring-nav-btn purple" @click="prevDownstream">&#8249;</button>
                <div class="ring-row">
                  <div class="ring-item" v-for="(item, idx) in currentDownstreamItems" :key="idx">
                    <div class="ring-info">
                      <div class="ring-name">{{ item.DWM }}</div>
                      <div class="ring-nums">
                        <div class="ring-num-item">
                          <div class="ring-num-label" style="color: white">{{ t('task_count') }}</div>
                          <div class="ring-num-value task purple">{{ item.BZRWSL }}</div>
                        </div>
                        <div class="ring-num-item">
                          <div class="ring-num-label" style="color: white">{{ t('completed_count') }}</div>
                          <div class="ring-num-value done">{{ item.BZRWWCSL }}</div>
                        </div>
                      </div>
                    </div>
                    <div class="ring-chart-wrapper">
                      <!-- <div class="ring-chart purple" :style="getConicGradient(item.WCBL, true)">
                        <div class="ring-pct purple">{{ item.WCBL }}</div>
                      </div> -->
                      <div class="ring-chart" :id="'downstreamRing' + idx"></div>
                      <div class="ring-pct">{{ item.WCBL }}</div>
                    </div>
                  </div>
                </div>
                <button class="ring-nav-btn purple" @click="nextDownstream">&#8250;</button>
              </div>
            </div>
          </div>

          <!-- 项目变更情况 -->
          <div class="panel" style="flex: 1">
            <div class="panel-header">
              <div class="panel-title">{{ t('project_change_status') }}<span class="breathing-dot orange"></span></div>
            </div>
            <div class="panel-body">
              <table class="data-table">
                <thead>
                  <tr>
                    <th class="green">{{ t('change_topic') }}</th>
                    <th class="green">{{ t('change_type') }}</th>
                    <th class="green">{{ t('change_impact') }}</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="change in projectChangeList" :key="change.id">
                    <td style="color: white">{{ change.CRHK_DCA_BGZT }}</td>
                    <td><span class="tag" style="color: white">{{ change.CRHK_DCA_BGLB }}</span></td>
                    <td style="color: white">{{ change.CRHK_DCA_BGYX }}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 详情弹窗 -->
    <el-dialog
      v-model="dialogVisible"
      :title="t('overdue_tasks')"
      width="80%"
    >
      <section style="margin: 20px">
        <table class="data-table" style="width: 100%">
          <thead>
            <tr>
              <th width="50">#</th>
              <th>{{ t('task_name') }}</th>
              <th>{{ t('source') }}</th>
              <th>{{ t('deadline') }}</th>
              <th>{{ t('upstream') }}</th>
              <th>{{ t('downstream') }}</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(item, index) in overdueTasks" :key="index">
              <td style="color: #94a3b8">{{ index + 1 }}</td>
              <td>
                <div style="font-weight: 500; color: #dc3545">{{ item.RWMC1 }}</div>
                <div style="font-size: 11px; color: #cbd5e1">{{ item.RWMC2 }}</div>
              </td>
              <td><span class="status-badge badge-design">{{ item.source }}</span></td>
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
import { ref, computed, onMounted, onUnmounted, watch, nextTick } from 'vue'
import { ElDialog } from 'element-plus'
import axios from "../assets/axios/base.js"
import router from '@/router'

// 数据
const projectId = window.top?.getCurrentProjectId && window.top.getCurrentProjectId() || 1012
const userId = window.top._P?.data?.navbean?.user?.userid || 1000

const dashboardData = ref({ ZSL: 0, RWZL: 0, XQZSL: 0, XQFHD: '0%' })
const teamMembers = ref([])
const upstreamData = ref([])
const downstreamData = ref([])
const projectChangeList = ref([])
const temporaryTaskList = ref([])
const allItems = ref([])

// 分页与搜索
const searchQuery = ref('')
const currentPage = ref(1)
const currentPage2 = ref(1)
const ITEMS_PER_PAGE = 5
const ITEMS_PER_PAGE2 = 6

const filteredMembers = computed(() => {
  if (!searchQuery.value) return teamMembers.value
  const query = searchQuery.value.toLowerCase()
  return teamMembers.value.filter(member => member.FZRXM.toLowerCase().includes(query))
})

const totalPages = computed(() => Math.ceil(filteredMembers.value.length / ITEMS_PER_PAGE))
const totalPages2 = computed(() => Math.ceil(temporaryTaskList.value.length / ITEMS_PER_PAGE2))

const paginatedMembers = computed(() => {
  const start = (currentPage.value - 1) * ITEMS_PER_PAGE
  return filteredMembers.value.slice(start, start + ITEMS_PER_PAGE)
})
const paginatedTemporaryTasks = computed(() => {
  const start = (currentPage2.value - 1) * ITEMS_PER_PAGE2
  return temporaryTaskList.value.slice(start, start + ITEMS_PER_PAGE2)
})

// 上下游轮播
const upstreamIndex = ref(0)
const downstreamIndex = ref(0)
const upstreamStep = 2
const downstreamStep = 2

const currentUpstreamItems = computed(() => {
  const arrList = upstreamData.value.slice(upstreamIndex.value, upstreamIndex.value + upstreamStep)
  nextTick(() => {
    arrList.forEach((item, idx) => {
      create3DRingChart('upstreamRing' + idx, item.WCBL.replace('%', ''), 'cyan');
    })
  })
  return arrList
})

const currentDownstreamItems = computed(() => {
  const arrList = downstreamData.value.slice(downstreamIndex.value, downstreamIndex.value + downstreamStep)
  nextTick(() => {
    arrList.forEach((item, idx) => {
      create3DRingChart('downstreamRing' + idx, item.WCBL.replace('%', ''), 'purple');
    })
  })
  return arrList
})

const prevUpstream = () => {
  if (upstreamIndex.value - upstreamStep >= 0) upstreamIndex.value -= upstreamStep
}
const nextUpstream = () => {
  if (upstreamIndex.value + upstreamStep < upstreamData.value.length) upstreamIndex.value += upstreamStep
}
const prevDownstream = () => {
  if (downstreamIndex.value - downstreamStep >= 0) downstreamIndex.value -= downstreamStep
}
const nextDownstream = () => {
  if (downstreamIndex.value + downstreamStep < downstreamData.value.length) downstreamIndex.value += downstreamStep
}

// ===== 3D立体多段环形图生成（带厚度实体效果） =====
function create3DRingChart(containerId, percent, colorTheme) {
  const container = document.getElementById(containerId);
  if (!container) return;

  const size = 220;
  const cx = size / 2;
  const cy = size / 2;
  const outerR = 96;
  const innerR = 56;
  const thickness = 18;

  // 统一单色配置
  const topColor = colorTheme === 'purple' ? '#8b5cf6' : '#0ea5e9';
  const sideColor = colorTheme === 'purple' ? '#5b21b6' : '#075985';

  const bgColor = colorTheme === 'purple' ? 'rgba(139,92,246,0.12)' : 'rgba(0,180,255,0.12)';

  // 计算角度
  const totalAngle = Math.min(percent * 3.6, 360);
  const segmentCount = percent <= 0 ? 0 : 5;
  const segmentGap = 3;
  let usableAngle = totalAngle - (segmentCount - 1) * segmentGap;
  if (usableAngle < 0) usableAngle = totalAngle;
  const segmentAngle = segmentCount > 0 ? usableAngle / segmentCount : 0;

  let svgHTML = '<svg viewBox="0 0 ' + size + ' ' + size + '" style="filter: drop-shadow(0 12px 24px rgba(0,0,0,0.6));">';

  // 背景圆环（底部）
  svgHTML += createRingTop(cx, cy, outerR, innerR, 0, 360, bgColor, 0.4);

  if (segmentCount > 0 && segmentAngle > 0) {
    // 按顺序绘制：侧面厚度 -> 顶面（实现实体遮挡效果）
    for (let i = 0; i < segmentCount; i++) {
      const startAngle = i * (segmentAngle + segmentGap);
      const endAngle = startAngle + segmentAngle;

      // 1. 绘制侧面厚度（外壁 + 内壁）
      svgHTML += createRingSide(cx, cy, outerR, innerR, startAngle, endAngle, sideColor, thickness);
    }

    for (let i = 0; i < segmentCount; i++) {
      const startAngle = i * (segmentAngle + segmentGap);
      const endAngle = startAngle + segmentAngle;

      // 2. 绘制顶面（纯色）
      svgHTML += createRingTop(cx, cy, outerR, innerR, startAngle, endAngle, topColor, 1);
    }

    // 3. 顶面高光
    for (let i = 0; i < segmentCount; i++) {
      const startAngle = i * (segmentAngle + segmentGap);
      const endAngle = startAngle + segmentAngle;
      const highlightColor = colorTheme === 'purple' ? 'rgba(196,181,253,0.35)' : 'rgba(103,232,249,0.3)';
      svgHTML += createRingHighlight(cx, cy, outerR, innerR, startAngle, endAngle, highlightColor);
    }
  }

  svgHTML += '</svg>';
  container.innerHTML = svgHTML;
}

function polarToCartesian(cx, cy, r, angleDeg) {
  const angleRad = (angleDeg - 90) * Math.PI / 180;
  return {
    x: cx + r * Math.cos(angleRad),
    y: cy + r * Math.sin(angleRad)
  };
}

// 顶面（水平圆环面）
function createRingTop(cx, cy, outerR, innerR, startAngle, endAngle, color, opacity) {
  const startOuter = polarToCartesian(cx, cy, outerR, endAngle);
  const endOuter = polarToCartesian(cx, cy, outerR, startAngle);
  const startInner = polarToCartesian(cx, cy, innerR, endAngle);
  const endInner = polarToCartesian(cx, cy, innerR, startAngle);

  const largeArc = endAngle - startAngle > 180 ? 1 : 0;

  const path = [
    'M', startOuter.x, startOuter.y,
    'A', outerR, outerR, 0, largeArc, 0, endOuter.x, endOuter.y,
    'L', endInner.x, endInner.y,
    'A', innerR, innerR, 0, largeArc, 1, startInner.x, startInner.y,
    'Z'
  ].join(' ');

  return '<path d="' + path + '" fill="' + color + '" opacity="' + opacity + '" class="segment-top"/>';
}

// 侧面厚度（垂直面，模拟3D高度）
function createRingSide(cx, cy, outerR, innerR, startAngle, endAngle, color, thickness) {
  const startOuter = polarToCartesian(cx, cy, outerR, startAngle);
  const endOuter = polarToCartesian(cx, cy, outerR, endAngle);
  const startOuterBottom = { x: startOuter.x, y: startOuter.y + thickness };
  const endOuterBottom = { x: endOuter.x, y: endOuter.y + thickness };

  const startInner = polarToCartesian(cx, cy, innerR, startAngle);
  const endInner = polarToCartesian(cx, cy, innerR, endAngle);
  const startInnerBottom = { x: startInner.x, y: startInner.y + thickness };
  const endInnerBottom = { x: endInner.x, y: endInner.y + thickness };

  const largeArc = endAngle - startAngle > 180 ? 1 : 0;
  let svg = '';

  // 外壁侧面
  const outerSidePath = [
    'M', startOuter.x, startOuter.y,
    'A', outerR, outerR, 0, largeArc, 1, endOuter.x, endOuter.y,
    'L', endOuterBottom.x, endOuterBottom.y,
    'A', outerR, outerR, 0, largeArc, 0, startOuterBottom.x, startOuterBottom.y,
    'Z'
  ].join(' ');
  svg += '<path d="' + outerSidePath + '" fill="' + color + '" opacity="0.85"/>';

  // 内壁侧面
  const innerSidePath = [
    'M', startInner.x, startInner.y,
    'A', innerR, innerR, 0, largeArc, 1, endInner.x, endInner.y,
    'L', endInnerBottom.x, endInnerBottom.y,
    'A', innerR, innerR, 0, largeArc, 0, startInnerBottom.x, startInnerBottom.y,
    'Z'
  ].join(' ');
  svg += '<path d="' + innerSidePath + '" fill="' + color + '" opacity="0.6"/>';

  // 起始端面
  const startFacePath = [
    'M', startOuter.x, startOuter.y,
    'L', startInner.x, startInner.y,
    'L', startInnerBottom.x, startInnerBottom.y,
    'L', startOuterBottom.x, startOuterBottom.y,
    'Z'
  ].join(' ');
  svg += '<path d="' + startFacePath + '" fill="' + color + '" opacity="0.9"/>';

  // 结束端面
  const endFacePath = [
    'M', endOuter.x, endOuter.y,
    'L', endInner.x, endInner.y,
    'L', endInnerBottom.x, endInnerBottom.y,
    'L', endOuterBottom.x, endOuterBottom.y,
    'Z'
  ].join(' ');
  svg += '<path d="' + endFacePath + '" fill="' + color + '" opacity="0.9"/>';

  return svg;
}

function createRingHighlight(cx, cy, outerR, innerR, startAngle, endAngle, color) {
  const highlightOuterR = outerR - 3;
  const highlightInnerR = innerR + 3;
  const highlightStart = startAngle + 2;
  const highlightEnd = startAngle + (endAngle - startAngle) * 0.25;

  const startOuter = polarToCartesian(cx, cy, highlightOuterR, highlightEnd);
  const endOuter = polarToCartesian(cx, cy, highlightOuterR, highlightStart);
  const startInner = polarToCartesian(cx, cy, highlightInnerR, highlightEnd);
  const endInner = polarToCartesian(cx, cy, highlightInnerR, highlightStart);

  const largeArc = highlightEnd - highlightStart > 180 ? 1 : 0;

  const path = [
    'M', startOuter.x, startOuter.y,
    'A', highlightOuterR, highlightOuterR, 0, largeArc, 0, endOuter.x, endOuter.y,
    'L', endInner.x, endInner.y,
    'A', highlightInnerR, highlightInnerR, 0, largeArc, 1, startInner.x, startInner.y,
    'Z'
  ].join(' ');

  return '<path d="' + path + '" fill="' + color + '"/>';
}

// 工具函数
const getConicGradient = (percentStr, isPurple = false) => {
  const percent = parseFloat(percentStr)
  const color = isPurple ? '#8b5cf6' : '#00d4ff'
  return { background: `conic-gradient(${color} ${percent}%, rgba(0,180,255,0.08) 0)` }
}

const delayCount = computed(() => temporaryTaskList.value.filter(el => el.SFYW === '是').length)

// 弹窗
const dialogVisible = ref(false)
const overdueTasks = ref([])

const showDetail = (member) => {
  // overdueTasks.value = allItems.value.filter(el => 
  //   el.LY && el.LY.includes(String(member.USERID)) && 
  //   el.PROJECT_ID === member.PROJECT_ID && 
  //   el.SFBZ === 1 && 
  //   el.SFYQ === 1
  // )
  // overdueTasks.value.forEach(el => { el.source = member.FZRXM })
  // dialogVisible.value = true
  overdueTasks.value = allItems.value.filter(el => el.LY && el.LY.includes(String(member.USERID)) && el.PROJECT_ID === member.PROJECT_ID && el.SFBZ === 1 && el.SFYQ === 1)
  overdueTasks.value.forEach(el => {
    el.source = member.FZRXM
  })
  dialogVisible.value = true
}

// 搜索
const searchMembers = () => { currentPage.value = 1 }

const prevPage = () => { if (currentPage.value > 1) currentPage.value-- }
const nextPage = () => { if (currentPage.value < totalPages.value) currentPage.value++ }
const prevPage2 = () => { if (currentPage2.value > 1) currentPage2.value-- }
const nextPage2 = () => { if (currentPage2.value < totalPages2.value) currentPage2.value++ }
const goToPage = (page) => { currentPage.value = page }
const goToPage2 = (page) => { currentPage2.value = page }

// 国际化
const currentLang = ref(window.i18nManager.currentLang || 'zh')
const translations = {
  zh: {
    task_messages: '任务消息',
    vs_yesterday: '较昨日',
    requirements: '需求信息',
    requirement_compliance: '需求符合度',
    project_health: '项目健康度',
    status_excellent: '状态极佳',
    team_performance: '团队成员表现',
    search_placeholder: '输入姓名搜索...',
    search: '搜索',
    name: '姓名',
    position: '岗位',
    weekly_task_count: '本周任务',
    completed_count: '完成',
    overdue_count: '延误',
    prev_page: '上一页',
    next_page: '下一页',
    temporary_task_status: '临时任务情况',
    number_of_delays: '延误数量',
    task_name: '作业名称',
    person_in_charge: '负责人',
    planned_completion_time: '计划完成',
    is_delayed: '是否延误',
    upstream_performance: '上游表现',
    downstream_performance: '下游表现',
    task_count: '任务数',
    project_change_status: '项目变更情况',
    change_topic: '变更主题',
    change_type: '变更类型',
    change_impact: '变更影响',
    overdue_tasks: '延误任务详情',
    source: '来源',
    deadline: '截止时间',
    upstream: '上游方',
    downstream: '下游方',
    '浅色': '浅色'
  },
  en: {
    task_messages: 'Task Messages',
    vs_yesterday: 'Vs Yesterday',
    requirements: 'Requirements',
    requirement_compliance: 'Compliance',
    project_health: 'Project Health',
    status_excellent: 'Excellent',
    team_performance: 'Team Performance',
    search_placeholder: 'Search by name...',
    search: 'Search',
    name: 'Name',
    position: 'Position',
    weekly_task_count: 'Weekly Tasks',
    completed_count: 'Completed',
    overdue_count: 'Overdue',
    prev_page: 'Prev',
    next_page: 'Next',
    temporary_task_status: 'Temporary Tasks',
    number_of_delays: 'Delays',
    task_name: 'Task Name',
    person_in_charge: 'Owner',
    planned_completion_time: 'Due Date',
    is_delayed: 'Delayed',
    upstream_performance: 'Upstream',
    downstream_performance: 'Downstream',
    task_count: 'Tasks',
    project_change_status: 'Changes',
    change_topic: 'Topic',
    change_type: 'Type',
    change_impact: 'Impact',
    overdue_tasks: 'Overdue Tasks Detail',
    source: 'Source',
    deadline: 'Deadline',
    upstream: 'Upstream',
    downstream: 'Downstream',
    '浅色': 'Light color'
  }
}

const t = (key) => translations[currentLang.value][key] || key

const toggleLanguage = () => {
  currentLang.value = currentLang.value === 'zh' ? 'en' : 'zh'
}

// 时钟
const currentTime = ref('')
const updateClock = () => {
  const now = new Date()
  currentTime.value = `${now.getFullYear()}-${String(now.getMonth()+1).padStart(2,'0')}-${String(now.getDate()).padStart(2,'0')} ${String(now.getHours()).padStart(2,'0')}:${String(now.getMinutes()).padStart(2,'0')}:${String(now.getSeconds()).padStart(2,'0')}`
}
let clockInterval

// 动态背景Canvas
const bgCanvasRef = ref(null)
let animationFrameId = null
let particles = []
let lines = []

const initCanvas = () => {
  const canvas = bgCanvasRef.value
  if (!canvas) return
  const ctx = canvas.getContext('2d')
  let w, h

  const resize = () => {
    w = canvas.width = window.innerWidth
    h = canvas.height = window.innerHeight
  }
  resize()
  window.addEventListener('resize', resize)

  const PARTICLE_COUNT = 50
  const LINE_COUNT = 6

  for (let i = 0; i < PARTICLE_COUNT; i++) {
    particles.push({
      x: Math.random() * w,
      y: Math.random() * h,
      vx: (Math.random() - 0.5) * 0.3,
      vy: (Math.random() - 0.5) * 0.3,
      r: Math.random() * 1.5 + 0.5,
      alpha: Math.random() * 0.3 + 0.1,
      pulse: Math.random() * Math.PI * 2,
      pulseSpeed: Math.random() * 0.01 + 0.005
    })
  }

  for (let i = 0; i < LINE_COUNT; i++) {
    lines.push({
      x: Math.random() * w,
      y: Math.random() * h,
      length: Math.random() * 200 + 100,
      speed: Math.random() * 0.5 + 0.2,
      alpha: Math.random() * 0.08 + 0.02,
      horizontal: Math.random() > 0.5,
      progress: Math.random()
    })
  }

  const draw = () => {
    ctx.clearRect(0, 0, w, h)

    particles.forEach(p => {
      p.x += p.vx
      p.y += p.vy
      p.pulse += p.pulseSpeed

      if (p.x < 0) p.x = w
      if (p.x > w) p.x = 0
      if (p.y < 0) p.y = h
      if (p.y > h) p.y = 0

      const currentAlpha = p.alpha * (0.5 + 0.5 * Math.sin(p.pulse))
      ctx.beginPath()
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2)
      ctx.fillStyle = `rgba(0, 200, 255, ${currentAlpha})`
      ctx.fill()

      ctx.beginPath()
      ctx.arc(p.x, p.y, p.r * 3, 0, Math.PI * 2)
      ctx.fillStyle = `rgba(0, 200, 255, ${currentAlpha * 0.15})`
      ctx.fill()
    })

    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x
        const dy = particles[i].y - particles[j].y
        const dist = Math.sqrt(dx * dx + dy * dy)
        if (dist < 150) {
          const lineAlpha = (1 - dist / 150) * 0.06
          ctx.beginPath()
          ctx.moveTo(particles[i].x, particles[i].y)
          ctx.lineTo(particles[j].x, particles[j].y)
          ctx.strokeStyle = `rgba(0, 180, 255, ${lineAlpha})`
          ctx.lineWidth = 0.5
          ctx.stroke()
        }
      }
    }

    lines.forEach(l => {
      l.progress += l.speed * 0.002
      if (l.progress > 1) l.progress = 0

      const alpha = l.alpha * Math.sin(l.progress * Math.PI)
      ctx.beginPath()

      if (l.horizontal) {
        const startX = l.x - l.length / 2
        const endX = l.x + l.length / 2
        const grad = ctx.createLinearGradient(startX, l.y, endX, l.y)
        grad.addColorStop(0, `rgba(0, 180, 255, 0)`)
        grad.addColorStop(0.5, `rgba(0, 180, 255, ${alpha})`)
        grad.addColorStop(1, `rgba(0, 180, 255, 0)`)
        ctx.strokeStyle = grad
        ctx.moveTo(startX, l.y)
        ctx.lineTo(endX, l.y)
      } else {
        const startY = l.y - l.length / 2
        const endY = l.y + l.length / 2
        const grad = ctx.createLinearGradient(l.x, startY, l.x, endY)
        grad.addColorStop(0, `rgba(0, 180, 255, 0)`)
        grad.addColorStop(0.5, `rgba(0, 180, 255, ${alpha})`)
        grad.addColorStop(1, `rgba(0, 180, 255, 0)`)
        ctx.strokeStyle = grad
        ctx.moveTo(l.x, startY)
        ctx.lineTo(l.x, endY)
      }
      ctx.lineWidth = 0.5
      ctx.stroke()
    })

    animationFrameId = requestAnimationFrame(draw)
  }

  draw()
}

const loading = ref(false)

// 初始化数据
const initData = async () => {
  loading.value = true
  try {
    const rwk = await axios.getTableData('CRHK_XMZJDLSY_RWK')
    const rwkData = rwk.data.data.filter(el => el.PROJECT_ID === projectId && el.USERID === userId)
    dashboardData.value = { ...dashboardData.value, ...(rwkData[0] || { ZSL: 0, RWZL: 0 }) }

    const xq = await axios.getTableData('CRHK_XMZJDLSY_XQXX')
    const xqData = xq.data.data.filter(el => el.PROJECT_ID === projectId)
    dashboardData.value = { ...dashboardData.value, ...(xqData[0] || { XQZSL: 0, XQFHD: '0%' }) }

    const members = await axios.getTableData('CRHK_XMZJDLSY_TDCYBX')
    teamMembers.value = members.data.data.filter(el => el.PROJECT_ID === projectId)

    const upstream = await axios.getTableData('CRHK_XMZJDLSY_SYBX')
    upstreamData.value = upstream.data.data.filter(el => el.PROJECT_ID === projectId)

    const downstream = await axios.getTableData('CRHK_XMZJDLSY_XYBX')
    downstreamData.value = downstream.data.data.filter(el => el.PROJECT_ID === projectId)

    const changes = await axios.getTableData('CRHK_XMZJDLSY_XMBGQK')
    projectChangeList.value = changes.data.data.filter(el => el.PROJECT_ID === projectId)

    const temps = await axios.getTableData('CRHK_XMZJDLSY_LSRWQK')
    temporaryTaskList.value = temps.data.data.filter(el => el.PROJECT_ID === projectId)

    const all = await axios.getTableData('V_CRHK_GRDLSY_RWQD')
    allItems.value = all.data.data

    loading.value = false
  } catch (error) {
    console.error('数据加载失败:', error)
    loading.value = false
  }
}

onMounted(() => {
  initData()
  updateClock()
  clockInterval = setInterval(updateClock, 1000)
  initCanvas()
})

onUnmounted(() => {
  if (clockInterval) clearInterval(clockInterval)
  if (animationFrameId) cancelAnimationFrame(animationFrameId)
  window.removeEventListener('resize', () => {})
})
</script>

<style lang="scss" scoped>
@import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@400;700;900&display=swap');

// * {
//   box-sizing: border-box;
//   margin: 0;
//   padding: 0;
// }

.project-director-page {
  position: relative;
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
  overflow-x: hidden;
}

#bgCanvasDirector {
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
  background-image: linear-gradient(rgba(0,180,255,0.03) 1px, transparent 1px),
                    linear-gradient(90deg, rgba(0,180,255,0.03) 1px, transparent 1px);
  background-size: 60px 60px;
  mask-image: radial-gradient(ellipse at center, rgba(0,0,0,0.5) 0%, transparent 75%);
  -webkit-mask-image: radial-gradient(ellipse at center, rgba(0,0,0,0.5) 0%, transparent 75%);
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

@keyframes orbBreathe {
  0%, 100% { opacity: 0.6; transform: scale(1); }
  50% { opacity: 1; transform: scale(1.15); }
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
  background: linear-gradient(90deg, transparent 0%, rgba(0,212,255,0.06) 20%, rgba(0,212,255,0.12) 50%, rgba(0,212,255,0.06) 80%, transparent 100%);
  animation: flowPulse 6s ease-in-out infinite;
}

.line2 {
  bottom: 25%;
  left: 0;
  width: 100%;
  height: 1px;
  background: linear-gradient(90deg, transparent 0%, rgba(139,92,246,0.05) 20%, rgba(139,92,246,0.1) 50%, rgba(139,92,246,0.05) 80%, transparent 100%);
  animation: flowPulse 8s ease-in-out infinite;
  animation-delay: 2s;
}

@keyframes flowPulse {
  0%, 100% { opacity: 0.3; }
  50% { opacity: 1; }
}

.page {
  position: relative;
  z-index: 1;
  width: 100%;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  padding: 0 24px 20px;
  animation: pageIn 1s ease-out both;
}

@keyframes pageIn {
  from { opacity: 0; transform: translateY(12px); }
  to { opacity: 1; transform: translateY(0); }
}

.header {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 68px;
  padding: 0 24px;
  position: relative;
  flex-shrink: 0;
  border-bottom: 0px;
}

.header::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 3%;
  right: 3%;
  height: 1px;
  background: linear-gradient(90deg, transparent 0%, rgba(0,212,255,0.08) 15%, rgba(0, 212, 255, 0.55) 50%, rgba(0,212,255,0.08) 85%, transparent 100%);
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
  transition: all 0.35s;
}

.nav-btn:hover {
  background: rgba(0, 100, 200, 0.3);
  border-color: #00d4ff;
  color: #00d4ff;
  box-shadow: 0 0 20px rgba(0, 212, 255, 0.2);
  transform: translateY(-1px);
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

.stats-bar {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 18px;
  padding: 0 0 16px;
  flex-shrink: 0;
}

.stat-card {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 10px;
  padding: 20px 22px;
  // background: rgba(6, 18, 48, 0.65);
  background: #0F254A;
  backdrop-filter: blur(20px);
  border: 1px solid rgba(0, 180, 255, 0.15);
  border-radius: 14px;
  transition: all 0.4s;
}

.stat-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 2px;
  background: linear-gradient(90deg, transparent 0%, #00d4ff 40%, #8b5cf6 70%, transparent 100%);
  opacity: 0.7;
  z-index: 2000;
}

.stat-card:hover {
  border-color: rgba(0, 212, 255, 0.45);
  // background: rgba(10, 28, 68, 0.75);
  transform: translateY(-3px);
}

.stat-left {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.stat-label {
  font-size: 17px;
  color: rgba(255, 255, 255, 0.85);
  font-weight: 500;
}

.stat-value {
  font-size: 36px;
  font-weight: 900;
  color: #ffffff;
  text-shadow: 0 0 20px rgba(0, 212, 255, 0.25);
  // font-family: 'Orbitron', monospace;
}

.stat-value.red {
  color: #ff4757;
  text-shadow: 0 0 20px rgba(255, 71, 87, 0.35);
}

.stat-value.green {
  color: #00f0c8;
  text-shadow: 0 0 20px rgba(0, 240, 200, 0.3);
}

.stat-sub {
  font-size: 16px;
  color: #00f0c8;
  opacity: 0.85;
}

.stat-icon-wrap {
  width: 48px;
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(0, 212, 255, 0.12);
  border: 1px solid rgba(0, 212, 255, 0.15);
  border-radius: 12px;
  color: #00d4ff;
}

.main {
  flex: 1;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 18px;
  margin-top: 18px;
}

.column {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.panel {
  position: relative;
  border: 1px solid rgba(0, 180, 255, 0.15);
  // background: rgba(6, 18, 48, 0.65);
  background: #0F254A;
  backdrop-filter: blur(20px);
  border-radius: 14px;
  overflow: hidden;
  transition: all 0.4s;
  display: flex;
  flex-direction: column;
}

.panel::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 1px;
  background: linear-gradient(90deg, transparent 0%, rgba(0, 212, 255, 0.5) 30%, rgba(139, 92, 246, 0.4) 70%, transparent 100%);
  z-index: 2;
}

.panel:hover {
  border-color: rgba(0, 212, 255, 0.45);
  // background: rgba(10, 28, 68, 0.75);
  transform: translateY(-2px);
}

.panel-header {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 14px 20px 10px;
  position: relative;
  z-index: 2;
}

.panel-header-left {
  display: flex;
  align-items: center;
  gap: 10px;
}

.panel-header-right {
  margin-left: auto;
}

.panel-header::before {
  content: '';
  width: 3px;
  height: 18px;
  background: linear-gradient(180deg, #00d4ff, #8b5cf6);
  border-radius: 2px;
  box-shadow: 0 0 10px rgba(0, 212, 255, 0.4);
  margin-right: 10px;
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
}

.breathing-dot.cyan {
  background: #00d4ff;
  box-shadow: 0 0 8px #00d4ff;
  animation: breatheCyan 2s ease-in-out infinite;
}
.breathing-dot.blue {
  background: #2a7fff;
  box-shadow: 0 0 8px #2a7fff;
  animation: breatheBlue 2s ease-in-out infinite;
}
.breathing-dot.purple {
  background: #8b5cf6;
  box-shadow: 0 0 8px #8b5cf6;
  animation: breathePurple 2s ease-in-out infinite;
}
.breathing-dot.orange {
  background: #ff9f43;
  box-shadow: 0 0 8px #ff9f43;
  animation: breatheOrange 2s ease-in-out infinite;
}

@keyframes breatheCyan {
  0%, 100% { box-shadow: 0 0 6px #00d4ff; opacity: 0.7; }
  50% { box-shadow: 0 0 14px #00d4ff; opacity: 1; }
}
@keyframes breatheBlue {
  0%, 100% { box-shadow: 0 0 6px #2a7fff; opacity: 0.7; }
  50% { box-shadow: 0 0 14px #2a7fff; opacity: 1; }
}
@keyframes breathePurple {
  0%, 100% { box-shadow: 0 0 6px #8b5cf6; opacity: 0.7; }
  50% { box-shadow: 0 0 14px #8b5cf6; opacity: 1; }
}
@keyframes breatheOrange {
  0%, 100% { box-shadow: 0 0 6px #ff9f43; opacity: 0.7; }
  50% { box-shadow: 0 0 14px #ff9f43; opacity: 1; }
}

.panel-body {
  padding: 0 20px 16px;
  overflow: auto;
}

.data-table {
  width: 100%;
  border-collapse: separate;
  border-spacing: 0;
  font-size: 17px;
}

.data-table th {
  padding: 11px 10px;
  text-align: left;
  color: #6b9ec4;
  font-weight: 600;
  border-bottom: 1px solid rgba(0, 180, 255, 0.12);
  background: rgba(0, 40, 100, 0.15);
}
.data-table th.blue { color: #00d4ff; }
.data-table th.orange { color: #ff9f43; }
.data-table th.green { color: #00f0c8; }

.data-table td {
  padding: 11px 10px;
  color: #a3ccec;
  border-bottom: 1px solid rgba(0, 180, 255, 0.06);
}
.data-table tr:hover td {
  background: rgba(0, 150, 255, 0.06);
}

.tag {
  display: inline-flex;
  align-items: center;
  padding: 5px 16px;
  background: rgba(0, 212, 255, 0.12);
  border: 1px solid rgba(0, 212, 255, 0.15);
  border-radius: 6px;
  color: #a3ccec;
  font-size: 16px;
}

.num {
  font-weight: 700;
  color: #ffffff;
  // font-family: 'Orbitron', monospace;
}
.ok { color: #00f0c8 !important; font-weight: 600; }
.delay { color: #ff4757 !important; font-weight: 600; }

.pagination {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  margin-top: auto;
  margin-bottom: 20px;
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

.delay-badge {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-size: 16px;
  color: #ff4757;
  padding: 5px 14px;
  background: rgba(255, 71, 87, 0.12);
  border: 1px solid rgba(255, 71, 87, 0.15);
  border-radius: 6px;
}
.delay-badge::before {
  content: '';
  width: 6px;
  height: 6px;
  background: #ff4757;
  border-radius: 50%;
  animation: dotPulse 2s ease-in-out infinite;
}
@keyframes dotPulse {
  0%, 100% { box-shadow: 0 0 4px #ff4757; }
  50% { box-shadow: 0 0 12px #ff4757; }
}

.ring-container {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 16px;
}
.ring-row {
  display: flex;
  justify-content: space-around;
  padding: 16px 0 12px;
  flex: 1;
  gap: 20px;
}
.ring-nav-btn {
  width: 36px;
  height: 36px;
  border: 1px solid rgba(0, 180, 255, 0.2);
  background: rgba(0, 40, 100, 0.25);
  backdrop-filter: blur(8px);
  color: #a3ccec;
  font-size: 18px;
  cursor: pointer;
  border-radius: 50%;
}
.ring-nav-btn.purple {
  border-color: rgba(139, 92, 246, 0.2);
}
.ring-nav-btn:hover {
  border-color: #00d4ff;
  color: #00d4ff;
}
.ring-nav-btn.purple:hover {
  border-color: #8b5cf6;
  color: #8b5cf6;
}
.ring-item {
  display: flex;
  align-items: center;
  gap: 20px;
  padding: 16px 20px;
  background: rgba(0, 40, 100, 0.15);
  border: 1px solid rgba(0, 180, 255, 0.1);
  border-radius: 14px;
  flex: 1;
}
.ring-info {
  display: flex;
  flex-direction: column;
  gap: 8px;
  flex: 1;
}
.ring-name {
  font-size: 18px;
  color: #ffffff;
  font-weight: 700;
}
.ring-nums {
  display: flex;
  gap: 20px;
}
.ring-num-value {
  font-size: 22px;
  font-weight: 800;
  // font-family: 'Orbitron', monospace;
}
.ring-num-value.task { color: #00d4ff; }
.ring-num-value.task.purple { color: #8b5cf6; }
.ring-num-value.done { color: #00f0c8; }
.ring-num-label {
  font-size: 13px;
  color: #6b9ec4;
}
.ring-chart-wrapper {
  position: relative;
  width: 220px;
  height: 220px;
  flex-shrink: 0;
}
.ring-chart {
  // width: 160px;
  // height: 160px;
  // border-radius: 50%;
  // display: flex;
  // align-items: center;
  // justify-content: center;
  // position: absolute;
  // top: 0;
  // left: 0;
  // box-shadow: 0 0 35px rgba(0, 212, 255, 0.18);
  width: 220px;
  height: 220px;
  position: relative;
  transform-style: preserve-3d;
  transform: perspective(900px) rotateX(25deg) rotateZ(-15deg);
  transition: transform 0.5s ease;
}
.ring-item:hover .ring-chart {
  transform: perspective(900px) rotateX(20deg) rotateZ(-10deg) scale(1.05);
}
.ring-chart :deep(svg) {
  width: 100%;
  height: 100%;
  overflow: visible;
}
.ring-chart .segment-top {
  transition: all 0.3s ease;
  cursor: pointer;
}
.ring-chart .segment-top:hover {
  filter: brightness(1.3);
}
// .ring-chart.purple {
//   box-shadow: 0 0 35px rgba(139, 92, 246, 0.2);
// }
// .ring-chart::before {
//   content: '';
//   width: 124px;
//   height: 124px;
//   border-radius: 50%;
//   background: rgba(6, 18, 48, 0.92);
//   backdrop-filter: blur(8px);
// }
.ring-pct {
  // position: absolute;
  // font-size: 24px;
  // font-weight: 800;
  // color: #00d4ff;
  // text-shadow: 0 0 16px rgba(0, 212, 255, 0.55);
  // // font-family: 'Orbitron', monospace;
  // z-index: 1;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  font-size: 20px;
  font-weight: 800;
  color: var(--cyan);
  text-shadow: 0 0 16px rgba(0, 212, 255, 0.55), 0 2px 4px rgba(0,0,0,0.5);
  font-family: 'Inter', sans-serif;
  letter-spacing: 0.5px;
  z-index: 10;
  pointer-events: none;
}
.ring-pct.purple {
  color: #8b5cf6;
  text-shadow: 0 0 16px rgba(139, 92, 246, 0.65);
}

.search-wrapper {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-left: auto;
}
.search-input {
  padding: 6px 12px;
  background: rgba(0, 40, 100, 0.25);
  border: 1px solid rgba(0, 180, 255, 0.2);
  border-radius: 6px;
  color: var(--text);
  font-size: 14px;
  outline: none;
}
.search-btn-tech {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 10px 20px;
  border: 1px solid rgba(0, 180, 255, 0.2);
  background: rgba(0, 40, 100, 0.25);
  backdrop-filter: blur(8px);
  color: #a3ccec;
  font-size: 16px;
  cursor: pointer;
  border-radius: 6px;
}
.search-btn-tech:hover {
  border-color: #00d4ff;
  color: #00d4ff;
}

.status-badge {
  padding: 2px 8px;
  border-radius: 99px;
  font-size: 11px;
  font-weight: 500;
  display: inline-block;
}
.badge-design { background: #e0e7ff; color: #4338ca; }
</style>