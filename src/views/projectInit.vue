<template>
  <div>
    <!-- App Header -->
    <header class="app-header">
      <div class="app-title">
        <i class="fas fa-project-diagram"></i>
        <span data-i18n="header_title">项目初始化中心</span>
      </div>
      <!-- <LanguageSwitcher /> -->
      <button id="lang-toggle" class="lang-toggle" @click="toggleLanguage">
        <!-- <i class="fas fa-globe"></i> <span>{{ currentLang === 'zh' ? 'EN' : '中文' }}</span> -->
        <i class="fas fa-globe"></i> <span>CN / EN</span>
      </button>
    </header>

    <!-- Main Dashboard -->
    <div class="dashboard-container">
      
      <!-- Left Column -->
      <div class="left-column">
        
        <!-- Basic Information -->
        <div class="content-card">
          <div class="card-header">
            <i class="fas fa-info-circle"></i>
            <span data-i18n="basic_info">基本信息</span>
            <el-button type="text" style="position: absolute; right: 20px; top: 7px;" @click="showEditDetail">修改</el-button>
          </div>
          <!-- <el-button></el-button> -->
          <div class="card-body">
            <div class="info-grid">
              <div class="info-item">
                <div class="label" data-i18n="project_name">项目名称</div>
                <div class="value highlight">{{ projectData.basic.name }}</div>
              </div>
              <div class="info-item">
                <div class="label" data-i18n="project_code">项目编号</div>
                <div class="value highlight">{{ projectData.basic.code }}</div>
              </div>
              <div class="info-item">
                <div class="label" data-i18n="client">客户</div>
                <div class="value highlight">{{ projectData.basic.client }}</div>
              </div>
              <div class="info-item">
                <div class="label" data-i18n="country">国别</div>
                <div class="value highlight">{{ projectData.basic.country }}</div>
              </div>
              <div class="info-item">
                <div class="label" data-i18n="contract_date">签约日期</div>
                <div class="value highlight">{{ projectData.basic.date }}</div>
              </div>
              <div class="info-item">
                <div class="label" data-i18n="project_type">项目类型</div>
                <div class="value highlight" data-i18n="epc_contract">EPC 总承包</div>
              </div>
            </div>
          </div>
        </div>

        <!-- Constraints -->
        <div class="content-card" style="flex: 1;">
          <div class="card-header">
            <i class="fas fa-exclamation-circle"></i>
            <span data-i18n="constraints">前置条件</span>
          </div>
          <div class="card-body">
            <div class="constraints-grid">
              <div class="info-item">
                <div class="label" style="margin-bottom: 8px;" data-i18n="duration">项目工期</div>
                <div class="value" style="font-size: 16px; font-weight: 600;">
                  {{ projectData.constraints.start }} 至 {{ projectData.constraints.end }}
                </div>
              </div>

              <div class="info-item">
                <div class="label" style="margin-bottom: 8px;" data-i18n="scope">工作范围</div>
                <div class="scope-text">
                  {{ projectData.constraints.scope }}
                </div>
              </div>

              <div class="lists-container">
                <div class="list-section">
                  <div style="position: relative">
                    <h4 data-i18n="milestones">关键里程碑</h4>
                    <el-button type="text" style="position: absolute; right: 10px; top: -8px;" @click="showEditMilestones">修改</el-button>
                  </div>
                  <ul class="simple-list">
                    <li v-for="(milestone, index) in projectData.milestones" :key="index">
                      <span>{{ milestone.event }}</span>
                      <span class="date-badge">{{ milestone.date }}</span>
                    </li>
                  </ul>
                </div>

                <div class="list-section">
                  <div style="position: relative">
                    <h4 data-i18n="budget">年度预算</h4>
                    <el-button type="text" style="position: absolute; right: 10px; top: -8px;" @click="showEditBudget">修改</el-button>
                  </div>
                  <ul class="simple-list">
                    <li v-for="(budget, index) in projectData.budget" :key="index">
                      <span>{{ budget.year }}</span>
                      <span class="amount-badge">{{ budget.amount }}</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>

      <!-- Right Column -->
      <div class="right-column">
        
        <!-- Team Configuration -->
        <div class="content-card" style="height: 100%;">
          <div class="card-header">
            <i class="fas fa-users-cog"></i>
            <span data-i18n="team_config">权限设置及团队配置</span>
            <el-button type="text" style="position: absolute; right: 20px; top: 7px;" @click="showEditTeam">修改</el-button>
          </div>
          <!-- Filter Bar -->
          <div class="filter-bar">
            <div class="filter-wrapper">
              <i class="fas fa-layer-group filter-icon"></i>
              <select id="filter-level" class="filter-select" v-model="selectedLevel" @change="filterData">
                <option value="" data-i18n="all_levels">所有级别</option>
                <option v-for="level in uniqueLevels" :key="level" :value="level">{{ level }}</option>
              </select>
              <i class="fas fa-chevron-down filter-arrow"></i>
            </div>
            <div class="filter-wrapper">
              <i class="fas fa-briefcase filter-icon"></i>
              <select id="filter-role" class="filter-select" v-model="selectedRole" @change="filterData">
                <option value="" data-i18n="all_roles">所有岗位</option>
                <option v-for="role in uniqueRoles" :key="role" :value="role">{{ role }}</option>
              </select>
              <i class="fas fa-chevron-down filter-arrow"></i>
            </div>
          </div>
          <div class="card-body" style="padding: 0; overflow: hidden; display: flex; flex-direction: column;">
            <div class="table-wrapper">
              <div class="table-header-fixed">
                <table class="team-table">
                  <thead>
                    <tr>
                      <th style="padding-left: 24px; width: 20%;" data-i18n="level">级别</th>
                      <th style="width: 40%;" data-i18n="role">岗位</th>
                      <th style="width: 40%;" data-i18n="name">姓名</th>
                    </tr>
                  </thead>
                </table>
              </div>
              <div class="table-body-scroll">
                <table class="team-table">
                  <tbody>
                    <tr v-if="filteredTeamData.length === 0">
                      <td colspan="3" style="text-align:center; padding: 20px; color: var(--text-light);">
                        {{ currentLang === 'zh' ? '未找到匹配的成员' : 'No matching members found' }}
                      </td>
                    </tr>
                    <tr v-for="member in paginatedTeamData" :key="member.id">
                      <td style="padding-left: 24px; width: 20%;">
                        <span class="level-badge">{{ member.level }}</span>
                      </td>
                      <td style="width: 40%;"><span class="role-badge">{{ member.role }}</span></td>
                      <td style="font-weight:600; width: 40%;">{{ member.name }}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
            
            <!-- Pagination -->
            <div class="pagination-container" v-if="filteredTeamData.length > 0">
              <div class="pagination-info">
                {{ (currentLang === 'zh' ? '显示' : 'Showing') }} {{ startItem }}-{{ endItem }} {{ (currentLang === 'zh' ? '共' : 'of') }} {{ filteredTeamData.length }} {{ (currentLang === 'zh' ? '项' : 'items') }}
              </div>
              <div class="pagination-controls">
                <button class="page-btn" @click="prevPage" :disabled="currentPage === 1">
                  <i class="fas fa-chevron-left"></i>
                </button>
                <button v-for="page in visiblePages" :key="page" 
                        :class="['page-btn', { active: currentPage === page }]" 
                        @click="changePage(page)">
                  {{ page }}
                </button>
                <button class="page-btn" @click="nextPage" :disabled="currentPage === totalPages">
                  <i class="fas fa-chevron-right"></i>
                </button>
              </div>
            </div>
          </div>
        </div>

      </div>

    </div>
    <el-dialog
        v-model="dialogVisible"
        v-if="dialogVisible"
        :title="i18n[currentLang]['basic_info']"
        :close-on-click-modal="false"
        width="1000">
        <el-form
            ref="ruleFormRef"
            style="margin: 0px 20px"
            size="large"
            :model="itemData"
            :rules="rules"
            label-position="top">
            <div class="line_flex" style="margin-top: 20px">
                <el-form-item :label="i18n[currentLang]['project_name'] + ':'">
                    <el-input v-model="itemData.name" :placeholder="i18n[currentLang]['project_name']" clearable />
                </el-form-item>
                <el-form-item :label="i18n[currentLang]['project_code'] + ':'">
                    <el-input v-model="itemData.code" :placeholder="i18n[currentLang]['project_code']" clearable />
                </el-form-item>
            </div>
            <div class="line_flex">
                <el-form-item :label="i18n[currentLang]['client'] + ':'">
                    <el-input v-model="itemData.client" :placeholder="i18n[currentLang]['client']" clearable />
                </el-form-item>
                <el-form-item :label="i18n[currentLang]['country'] + ':'">
                    <el-input v-model="itemData.country" :placeholder="i18n[currentLang]['country']" clearable />
                </el-form-item>
            </div>
            <div class="line_flex">
                <el-form-item :label="i18n[currentLang]['contract_date'] + ':'">
                    <el-date-picker
                        v-model="itemData.date"
                        type="date"
                        :placeholder="i18n[currentLang]['contract_date']"
                        clearable
                        format="YYYY-MM-DD"
                        value-format="YYYY-MM-DD"
                        style="width: 100%"
                    />
                </el-form-item>
                <el-form-item :label="i18n[currentLang]['project_type'] + ':'">
                    <el-input v-model="itemData.type" :placeholder="i18n[currentLang]['project_type']" clearable />
                </el-form-item>
            </div>
            <div class="line_flex">
                <el-form-item :label="i18n[currentLang]['duration'] + ':'">
                    <el-date-picker
                        v-model="itemData.start"
                        type="date"
                        :placeholder="i18n[currentLang]['duration']"
                        clearable
                        format="YYYY-MM-DD"
                        value-format="YYYY-MM-DD"
                        style="width: 100%"
                    />
                </el-form-item>
                <el-form-item :label="i18n[currentLang]['duration'] + ':'">
                    <el-date-picker
                        v-model="itemData.end"
                        type="date"
                        :placeholder="i18n[currentLang]['duration']"
                        clearable
                        format="YYYY-MM-DD"
                        value-format="YYYY-MM-DD"
                        style="width: 100%"
                    />
                </el-form-item>
            </div>
            <el-form-item :label="i18n[currentLang]['scope'] + ':'">
                <el-input type="textarea" v-model="itemData.scope" :placeholder="i18n[currentLang]['scope']" clearable />
            </el-form-item>
        </el-form>
        <template #footer>
            <div class="dialog-footer">
                <el-button @click="dialogVisible = false">取消</el-button>
                <el-button type="primary" @click="saveItem">保存</el-button>
            </div>
        </template>
    </el-dialog>

    <el-dialog
        v-model="milestonesDialogVisible"
        :title="i18n[currentLang]['milestones']"
        :close-on-click-modal="false"
        width="1200">
        <div style="display: flex; justify-content: flex-end; margin: 10px 0px">
            <el-button type="primary" @click="addMilestone">添加</el-button>
        </div>
        <el-table
            :data="milestonesTable.tableData"
            border
            height="50vh"
            style="width: 100%">
            <el-table-column
                prop="event"
                label="里程碑名称">
                <template #default="scope">
                    <el-input v-model="scope.row.event" placeholder="里程碑名称"  />
                </template>
            </el-table-column>
            <el-table-column
                prop="date"
                label="日期"
                width="300">
                <template #default="scope">
                    <el-date-picker
                        v-model="scope.row.date"
                        type="date"
                        placeholder="日期"
                        clearable
                        format="YYYY-MM-DD"
                        value-format="YYYY-MM-DD"
                        style="width: 100%"
                    />
                </template>
            </el-table-column>
            <el-table-column
                label="操作"
                width="100">
                <template #default="scope">
                    <el-button type="text" @click="removeMilestone(scope.$index)">删除</el-button>
                </template>
            </el-table-column>
        </el-table>
        <template #footer>
            <div class="dialog-footer">
                <el-button @click="milestonesDialogVisible = false">关闭</el-button>
                <el-button type="primary" @click="milestonesDialogVisible = false">保存</el-button>
            </div>
        </template>
    </el-dialog>

    <el-dialog
        v-model="budgetDialogVisible"
        :title="i18n[currentLang]['milestones']"
        :close-on-click-modal="false"
        width="1200">
        <div style="display: flex; justify-content: flex-end; margin: 10px 0px">
            <el-button type="primary" @click="addBudget">添加</el-button>
        </div>
        <el-table
            :data="budgetTable.tableData"
            border
            height="50vh"
            style="width: 100%">
            <el-table-column
                prop="year"
                label="年度名称">
                <template #default="scope">
                    <el-input v-model="scope.row.year" placeholder="年度名称"  />
                </template>
            </el-table-column>
            <el-table-column
                prop="amount"
                label="金额"
                width="300">
                <template #default="scope">
                  <el-input-number controls-position="right" v-model="scope.row.amount" :precision="2" :step="1" />
                </template>
            </el-table-column>
            <el-table-column
                label="操作"
                width="100">
                <template #default="scope">
                    <el-button type="text" @click="removeBudget(scope.$index)">删除</el-button>
                </template>
            </el-table-column>
        </el-table>
        <template #footer>
            <div class="dialog-footer">
                <el-button @click="budgetDialogVisible = false">关闭</el-button>
                <el-button type="primary" @click="budgetDialogVisible = false">保存</el-button>
            </div>
        </template>
    </el-dialog>

    <el-dialog
        v-model="teamDialogVisible"
        :title="i18n[currentLang]['milestones']"
        :close-on-click-modal="false"
        width="1200">
        <div style="display: flex; justify-content: flex-end; margin: 10px 0px">
            <el-button type="primary" @click="addTeam">添加</el-button>
        </div>
        <el-table
            :data="teamTable.tableData"
            border
            height="50vh"
            style="width: 100%">
            <el-table-column
                prop="level"
                label="级别">
                <template #default="scope">
                    <el-input v-model="scope.row.level" placeholder="级别"  />
                </template>
            </el-table-column>
            <el-table-column
                prop="role"
                label="岗位">
                <template #default="scope">
                    <el-input v-model="scope.row.role" placeholder="岗位"  />
                </template>
            </el-table-column>
            <el-table-column
                prop="name"
                label="姓名">
                <template #default="scope">
                    <el-input v-model="scope.row.name" placeholder="姓名"  />
                </template>
            </el-table-column>
            <el-table-column
                label="操作"
                width="100">
                <template #default="scope">
                    <el-button type="text" @click="removeTeam(scope.$index)">删除</el-button>
                </template>
            </el-table-column>
        </el-table>
        <template #footer>
            <div class="dialog-footer">
                <el-button @click="teamDialogVisible = false">关闭</el-button>
                <el-button type="primary" @click="teamDialogVisible = false">保存</el-button>
            </div>
        </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
// import LanguageSwitcher from '../components/LanguageSwitcher.vue';

// 国际化数据
const i18n = {
  'zh': {
    'title': '项目初始化 Dashboard',
    'header_title': '项目初始化中心',
    'basic_info': '基本信息',
    'project_name': '项目名称',
    'project_code': '项目编号',
    'client': '客户',
    'country': '国别',
    'contract_date': '签约日期',
    'project_type': '项目类型',
    'epc_contract': 'EPC 总承包',
    'constraints': '前置条件',
    'duration': '项目工期',
    'scope': '工作范围',
    'milestones': '关键里程碑',
    'budget': '年度预算',
    'team_config': '权限设置及团队配置',
    'all_levels': '所有级别',
    'all_roles': '所有岗位',
    'level': '级别',
    'role': '岗位',
    'name': '姓名',
    'no_match': '未找到匹配的成员',
    'showing': '显示',
    'total': '共',
    'items': '项'
  },
  'en': {
    'title': 'Project Init Dashboard',
    'header_title': 'Project Initialization Center',
    'basic_info': 'Basic Information',
    'project_name': 'Project Name',
    'project_code': 'Project Code',
    'client': 'Client',
    'country': 'Country',
    'contract_date': 'Contract Date',
    'project_type': 'Project Type',
    'epc_contract': 'EPC General Contract',
    'constraints': 'Prerequisites',
    'duration': 'Duration',
    'scope': 'Scope of Work',
    'milestones': 'Key Milestones',
    'budget': 'Annual Budget',
    'team_config': 'Permissions & Team Config',
    'all_levels': 'All Levels',
    'all_roles': 'All Roles',
    'level': 'Level',
    'role': 'Role',
    'name': 'Name',
    'no_match': 'No matching members found',
    'showing': 'Showing',
    'total': 'of',
    'items': 'items'
  }
}

// 响应式数据
const currentLang = ref(localStorage.getItem('lang') || 'zh')
const selectedLevel = ref('')
const selectedRole = ref('')
const currentPage = ref(1)
const itemsPerPage = 12

// 项目数据
const projectData = ref({
  basic: {
    name: '巴西圣保罗城际铁路北轴线项目',
    code: 'Tic',
    client: 'Tic Trens',
    country: '巴西',
    date: '2025-02-07',
    type: 'EPC总承包'
  },
  constraints: {
    start: '2024-06-03',
    end: '2031-04-28',
    scope: '包含城市轨道交通线路的土建工程施工（区间隧道、车站主体及附属结构）、轨道工程铺设、机电系统安装（供电、通信、信号、综合监控）、车辆基地建设，以及全线系统联调、试运行与初期运营技术支持；同步完成相关设计深化、设备采购、施工管理、安全质量控制及竣工验收工作。',
  },
  milestones: [
    { date: '2026-09-21', event: '完成单线方案基本设计' },
    { date: '2027-08-02', event: '完成单线方案执行设计' },
    { date: '2028-09-15', event: '完成TIM段安装及单体调试' },
    { date: '2029-03-07', event: '完成TIM段综合联调' },
    { date: '2029-05-04', event: '完成TIM段试运行' }
  ],
  budget: [
    { year: '第一年', amount: '12.5 M$' },
    { year: '第二年', amount: '8.2 M$' },
    { year: '第三年', amount: '4.5 M$' }
  ],
  team: [
    { level: 'A1', role: '项目经理', name: '李少方' },
    { level: 'A2', role: '项目副经理', name: '曹宏丽' },
    { level: 'A3', role: '设计管理部部长/接触网设计经理', name: '邹文魁' },
    { level: 'A4', role: '接口与集成设计经理', name: 'Fernando Carlos' },
    { level: 'A4', role: '接口设计经理', name: 'Lucas' },
    { level: 'A4', role: '供电设计经理', name: '杜汉' },
    { level: 'A4', role: '供电设计经理', name: '李锦平' },
    { level: 'A4', role: '供电设计经理', name: 'Rodrigo Zanelli' },
    { level: 'A4', role: '接触网设计经理', name: 'Carlos Rocha' },
    { level: 'A4', role: '电信设计经理', name: '段明' },
    { level: 'A4', role: '电信设计经理', name: 'Claudio' },
    { level: 'A4', role: '电信设计经理', name: '曹春建' },
    { level: 'A4', role: '信号设计经理', name: '魏凡超' },
    { level: 'A4', role: '信号设计经理', name: 'Marcelo' },
    { level: 'A4', role: '信号设计经理', name: '岳文强' },
    { level: 'A4', role: '车辆及场段设备设计经理', name: 'Fernando Costa' },
    { level: 'A4', role: '场段设备设计经理', name: '马佰全' },
    { level: 'A4', role: 'BIM设计经理', name: '张晟' },
    { level: 'A4', role: '设计文控', name: 'Gabriel' },
    { level: 'A4', role: '计划经理', name: 'Rodrigo Mussato' },
    { level: 'A4', role: '设计咨询技术负责人', name: '尚全邦' },
    { level: 'A5', role: '电信系统集成商-华信', name: '聂超' },
    { level: 'A5', role: '信号系统集成商-华信', name: '薛辉' },
    { level: 'A5', role: '客票系统集成商-易程', name: '庄飞' },
    { level: 'A5', role: '供电系统集成商-永济', name: '牛一疆' },
    { level: 'A5', role: '变压器供货商-株洲电机', name: '曹为' },
    { level: 'A5', role: '车辆供应商-四方', name: '张卓枭' },
    { level: 'A5', role: '场段设备供应商-四方', name: '孙丰辉' }
  ]
})

const dialogVisible = ref(false)
const itemData = ref({
    name: '亚太区智慧物流枢纽建设',
    code: 'P-2026-X88',
    client: 'Global Trans Corp.',
    country: '中国 (China)',
    date: '2026-01-15',
    type: 'EPC',
    start: '2026-03-01',
    end: '2029-02-28',
    scope: '包含城市轨道交通线路的土建工程施工（区间隧道、车站主体及附属结构）、轨道工程铺设、机电系统安装（供电、通信、信号、综合监控）、车辆基地建设，以及全线系统联调、试运行与初期运营技术支持；同步完成相关设计深化、设备采购、施工管理、安全质量控制及竣工验收工作。',
})

const showEditDetail = (item) => {
  // itemData.value = item
  dialogVisible.value = true
}
const saveItem = () => {
  console.log('saveItem', itemData.value)
  dialogVisible.value = false
}

const milestonesDialogVisible = ref(false)
const milestonesTable = ref({
  tableData: [
    { date: '2026-09-21', event: '完成单线方案基本设计' },
    { date: '2027-08-02', event: '完成单线方案执行设计' },
    { date: '2028-09-15', event: '完成TIM段安装及单体调试' },
    { date: '2029-03-07', event: '完成TIM段综合联调' },
    { date: '2029-05-04', event: '完成TIM段试运行' }
  ]
})

const showEditMilestones = () => {
  milestonesDialogVisible.value = true
}

const addMilestone = () => {
  milestonesTable.value.tableData.push({ date: '', event: '' })
}

const removeMilestone = (index) => {
  milestonesTable.value.tableData.splice(index, 1)
}

const budgetDialogVisible = ref(false)
const budgetTable = ref({
  tableData: [
    { year: '第一年', amount: 12.5 },
    { year: '第二年', amount: 8.2 },
    { year: '第三年', amount: 4.5 }
  ]
})

const showEditBudget = () => {
  budgetDialogVisible.value = true
}

const addBudget = () => {
  budgetTable.value.tableData.push({ year: '', amount: '' })
}

const removeBudget = (index) => {
  budgetTable.value.tableData.splice(index, 1)
}

const teamDialogVisible = ref(false)
const teamTable = ref({
  tableData: [
    { level: 'A1', role: '项目经理', name: '李少方' },
    { level: 'A2', role: '项目副经理', name: '曹宏丽' },
    { level: 'A3', role: '设计管理部部长/接触网设计经理', name: '邹文魁' },
    { level: 'A4', role: '接口与集成设计经理', name: 'Fernando Carlos' },
    { level: 'A4', role: '接口设计经理', name: 'Lucas' },
    { level: 'A4', role: '供电设计经理', name: '杜汉' },
    { level: 'A4', role: '供电设计经理', name: '李锦平' },
    { level: 'A4', role: '供电设计经理', name: 'Rodrigo Zanelli' },
    { level: 'A4', role: '接触网设计经理', name: 'Carlos Rocha' },
    { level: 'A4', role: '电信设计经理', name: '段明' },
    { level: 'A4', role: '电信设计经理', name: 'Claudio' },
    { level: 'A4', role: '电信设计经理', name: '曹春建' },
    { level: 'A4', role: '信号设计经理', name: '魏凡超' },
    { level: 'A4', role: '信号设计经理', name: 'Marcelo' },
    { level: 'A4', role: '信号设计经理', name: '岳文强' },
    { level: 'A4', role: '车辆及场段设备设计经理', name: 'Fernando Costa' },
    { level: 'A4', role: '场段设备设计经理', name: '马佰全' },
    { level: 'A4', role: 'BIM设计经理', name: '张晟' },
    { level: 'A4', role: '设计文控', name: 'Gabriel' },
    { level: 'A4', role: '计划经理', name: 'Rodrigo Mussato' },
    { level: 'A4', role: '设计咨询技术负责人', name: '尚全邦' },
    { level: 'A5', role: '电信系统集成商-华信', name: '聂超' },
    { level: 'A5', role: '信号系统集成商-华信', name: '薛辉' },
    { level: 'A5', role: '客票系统集成商-易程', name: '庄飞' },
    { level: 'A5', role: '供电系统集成商-永济', name: '牛一疆' },
    { level: 'A5', role: '变压器供货商-株洲电机', name: '曹为' },
    { level: 'A5', role: '车辆供应商-四方', name: '张卓枭' },
    { level: 'A5', role: '场段设备供应商-四方', name: '孙丰辉' }
  ]
})

const showEditTeam = () => {
  teamDialogVisible.value = true
}

const addTeam = () => {
  teamTable.value.tableData.push({ level: '', role: '', name: '' })
}

const removeTeam = (index) => {
  teamTable.value.tableData.splice(index, 1)
}


// 计算属性
const uniqueLevels = computed(() => {
  return [...new Set(projectData.value.team.map(t => t.level))].sort()
})

const uniqueRoles = computed(() => {
  return [...new Set(projectData.value.team.map(t => t.role))].sort()
})

const filteredTeamData = computed(() => {
  return projectData.value.team.filter(member => {
    const matchLevel = selectedLevel.value === '' || member.level === selectedLevel.value
    const matchRole = selectedRole.value === '' || member.role === selectedRole.value
    return matchLevel && matchRole
  })
})

const totalPages = computed(() => {
  return Math.ceil(filteredTeamData.value.length / itemsPerPage)
})

const startItem = computed(() => {
  return (currentPage.value - 1) * itemsPerPage + 1
})

const endItem = computed(() => {
  return Math.min(currentPage.value * itemsPerPage, filteredTeamData.value.length)
})

const paginatedTeamData = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage
  const end = start + itemsPerPage
  return filteredTeamData.value.slice(start, end)
})

const visiblePages = computed(() => {
  const pages = []
  const total = totalPages.value
  const current = currentPage.value
  
  // Always show first page
  pages.push(1)
  
  // Show pages around current page
  for (let i = Math.max(2, current - 1); i <= Math.min(total - 1, current + 1); i++) {
    if (i > 1 && i < total) {
      pages.push(i)
    }
  }
  
  // Always show last page if not already included
  if (total > 1 && !pages.includes(total)) {
    pages.push(total)
  }
  
  return [...new Set(pages)].sort((a, b) => a - b)
})

// 方法
function toggleLanguage() {
  currentLang.value = currentLang.value === 'zh' ? 'en' : 'zh'
  localStorage.setItem('lang', currentLang.value)
  updateContent()
}

function updateContent() {
  // Update all elements with data-i18n attribute
  document.querySelectorAll('[data-i18n]').forEach(element => {
    const key = element.getAttribute('data-i18n')
    if (i18n[currentLang.value][key]) {
      element.textContent = i18n[currentLang.value][key]
    }
  })
  
  // Update title
  document.title = i18n[currentLang.value]['title']
}

function filterData() {
  currentPage.value = 1 // Reset to first page on filter
}

function changePage(page) {
  if (page >= 1 && page <= totalPages.value) {
    currentPage.value = page
  }
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

// 生命周期
onMounted(() => {
  updateContent()
})
</script>

<style lang="scss">

.line_flex {
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: space-between;
    .el-form-item {
        width: 45%;
        .el-input-number {
            width: 100%;
        }
    }
}

:root {
    /* 
        * Design Tokens System
        * Based on Inter UI & Tailwind-inspired Palette 
        */
    
    /* Core Colors - Indigo & Slate */
    --primary-50: #eef2ff;
    --primary-100: #e0e7ff;
    --primary-500: #6366f1;
    --primary-600: #4f46e5;
    --primary-700: #4338ca;
    
    --secondary-400: #38bdf8;
    --secondary-500: #0ea5e9;
    
    --slate-50: #f8fafc;
    --slate-100: #f1f5f9;
    --slate-200: #e2e8f0;
    --slate-300: #cbd5e1;
    --slate-400: #94a3b8;
    --slate-500: #64748b;
    --slate-600: #475569;
    --slate-700: #334155;
    --slate-800: #1e293b;
    --slate-900: #0f172a;

    /* Semantic Mapping */
    --color-primary: var(--primary-600);
    --color-primary-hover: var(--primary-700);
    --color-bg-app: #f0f4f8; /* Soft blue-grey */
    --color-bg-surface: #ffffff;
    --color-text-main: var(--slate-800);
    --color-text-secondary: var(--slate-500);
    --color-text-muted: var(--slate-400);
    --color-border: var(--slate-200);
    
    /* Elevation & Depth */
    --shadow-xs: 0 1px 2px 0 rgba(15, 23, 42, 0.05);
    --shadow-sm: 0 1px 3px 0 rgba(15, 23, 42, 0.08), 0 1px 2px -1px rgba(15, 23, 42, 0.04);
    --shadow-md: 0 4px 6px -1px rgba(15, 23, 42, 0.08), 0 2px 4px -2px rgba(15, 23, 42, 0.04);
    --shadow-lg: 0 10px 15px -3px rgba(15, 23, 42, 0.08), 0 4px 6px -4px rgba(15, 23, 42, 0.04);
    --shadow-inner: inset 0 2px 4px 0 rgba(0, 0, 0, 0.06);
    --glass-border: 1px solid rgba(255, 255, 255, 0.5);
    
    /* Animation */
    --ease-spring: cubic-bezier(0.4, 0, 0.2, 1);
    --duration: 0.3s;
    
    /* Layout */
    --radius-sm: 8px;
    --radius-md: 12px;
    --radius-lg: 20px;
}

* {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
}

body {
    font-family: 'Inter', -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
    background-color: var(--color-bg-app);
    background-image: 
        radial-gradient(at 0% 0%, rgba(99, 102, 241, 0.03) 0px, transparent 50%),
        radial-gradient(at 100% 0%, rgba(14, 165, 233, 0.03) 0px, transparent 50%);
    background-attachment: fixed;
    color: var(--color-text-main);
    height: 100vh;
    display: flex;
    flex-direction: column;
    overflow: hidden;
    /* zoom: 0.85; Removed for better compatibility */
}

/* 
    * Components: Header 
    */
.app-header {
    height: 48px;
    background: rgba(255, 255, 255, 0.85);
    backdrop-filter: blur(12px);
    -webkit-backdrop-filter: blur(12px);
    border-bottom: 1px solid rgba(226, 232, 240, 0.6);
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 20px;
    flex-shrink: 0;
    z-index: 50;
    box-shadow: var(--shadow-sm);
}

.app-title {
    font-size: 15px;
    font-weight: 700;
    color: var(--primary-700);
    display: flex;
    align-items: center;
    gap: 8px;
    letter-spacing: -0.02em;
}

.app-title i {
    font-size: 16px;
    background: linear-gradient(135deg, var(--primary-500), var(--secondary-500));
    -webkit-background-clip: text;
    background-clip: text;
    -webkit-text-fill-color: transparent;
}

/* 
    * Components: Dashboard Layout 
    */
.dashboard-container {
    flex: 1;
    padding: 12px;
    display: grid;
    grid-template-columns: 2fr 1fr;
    gap: 12px;
    overflow: hidden;
    max-width: 1800px;
    margin: 0 auto;
    width: 100%;
    opacity: 0;
    animation: fadeIn 0.6s var(--ease-spring) forwards;
}

.left-column, .right-column {
    display: flex;
    flex-direction: column;
    gap: 12px;
    height: 100%;
    overflow: hidden;
}

/* 
    * Components: Cards 
    */
.content-card {
    background: var(--color-bg-surface);
    border-radius: var(--radius-md);
    border: 1px solid var(--slate-200);
    box-shadow: var(--shadow-sm);
    display: flex;
    flex-direction: column;
    transition: transform 0.3s ease, box-shadow 0.3s ease, border-color 0.3s ease;
    overflow: hidden;
    position: relative;
}

.content-card:hover {
    box-shadow: var(--shadow-md);
    border-color: var(--primary-100);
}

.card-header {
    position: relative;
    padding: 12px 20px;
    background: linear-gradient(to right, #ffffff, #fcfcfc);
    border-bottom: 1px solid var(--slate-100);
    font-size: 14px;
    font-weight: 600;
    color: var(--slate-700);
    display: flex;
    align-items: center;
    gap: 8px;
    flex-shrink: 0;
}

.card-header i {
    color: var(--primary-500);
    background: var(--primary-50);
    width: 24px;
    height: 24px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 6px;
    font-size: 12px;
}

.card-body {
    padding: 16px;
    flex: 1;
    overflow-y: auto;
}

/* 
    * Components: Info Grid 
    */
.info-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 12px;
}

.info-item {
    display: flex;
    flex-direction: column;
    gap: 4px;
    position: relative;
    background: var(--slate-50);
    padding: 12px;
    border-radius: var(--radius-sm);
    border: 1px solid var(--slate-200);
    transition: all 0.2s ease;
}

.info-item:hover {
    background: #fff;
    border-color: var(--primary-300);
    box-shadow: var(--shadow-sm);
    transform: translateY(-2px);
}

.info-item::after {
    content: none; /* Removed the previous underline effect */
}

.label {
    font-size: 12px;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    color: var(--color-text-secondary);
    font-weight: 600;
}

.value {
    font-size: 15px;
    color: var(--color-text-main);
    font-weight: 500;
    line-height: 1.5;
}

.value.highlight {
    color: var(--primary-600);
    font-weight: 700;
    background: var(--primary-50);
    padding: 2px 8px;
    border-radius: 4px;
    display: inline-block;
}

/* 
    * Components: Constraints 
    */
.constraints-grid {
    display: flex;
    flex-direction: column;
    gap: 20px;
}

.scope-text {
    font-size: 13px;
    line-height: 1.6;
    color: var(--slate-600);
    background: var(--slate-50);
    padding: 12px 16px;
    border-radius: var(--radius-sm);
    border-left: 3px solid var(--primary-500);
    position: relative;
}

.lists-container {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 24px;
    margin-top: 4px;
}

.list-section h4 {
    font-size: 12px;
    font-weight: 700;
    color: var(--slate-500);
    text-transform: uppercase;
    letter-spacing: 0.05em;
    margin-bottom: 10px;
    display: flex;
    align-items: center;
    gap: 6px;
}

.simple-list {
    list-style: none;
}

.simple-list li {
    font-size: 13px;
    margin-bottom: 8px;
    color: var(--slate-600);
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 8px 12px;
    background: #fff;
    border: 1px solid var(--slate-200);
    border-radius: var(--radius-sm);
    transition: all 0.2s ease;
    cursor: default;
}

.simple-list li:hover {
    border-color: var(--primary-500);
    background: var(--primary-50);
    transform: translateX(4px);
    box-shadow: var(--shadow-sm);
}

.date-badge, .amount-badge {
    font-weight: 600;
    font-size: 12px;
    padding: 4px 10px;
    border-radius: 20px;
    letter-spacing: 0.02em;
}

.date-badge {
    color: var(--primary-700);
    background: #eef2ff;
}

.amount-badge {
    color: #059669;
    background: #ecfdf5;
}

/* 
    * Components: Team Table 
    */
.table-container {
    height: 100%;
    overflow: auto;
}

.table-wrapper {
    display: flex;
    flex-direction: column;
    flex: 1;
    overflow: hidden;
    position: relative;
}

.table-header-fixed {
    flex-shrink: 0;
    background: #fff;
    border-bottom: 1px solid var(--slate-200);
    z-index: 10;
}

.table-body-scroll {
    flex: 1;
    overflow-y: auto;
}

.team-table {
    width: 100%;
    border-collapse: collapse;
}

.team-table th {
    text-align: left;
    font-size: 12px;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    color: var(--slate-500);
    padding: 10px 16px;
}

.team-table td {
    padding: 10px 16px;
    font-size: 13px;
    color: var(--slate-700);
    border-bottom: 1px solid var(--slate-100);
    transition: background 0.2s;
}

.team-table tr:hover td {
    background-color: var(--primary-50);
}

.role-badge {
    display: inline-flex;
    align-items: center;
    padding: 4px 12px;
    background: var(--slate-100);
    border: 1px solid var(--slate-200);
    border-radius: 20px;
    font-size: 12px;
    color: var(--slate-600);
    font-weight: 500;
}

.level-badge {
    display: inline-flex;
    width: 32px;
    height: 32px;
    align-items: center;
    justify-content: center;
    background: linear-gradient(135deg, var(--primary-500), var(--primary-600));
    color: #fff;
    font-weight: 700;
    font-size: 12px;
    border-radius: 50%;
    box-shadow: 0 2px 4px rgba(99, 102, 241, 0.3);
}

/* 
    * Components: Filter Bar 
    */
.filter-bar {
    padding: 10px 16px;
    background: rgba(255, 255, 255, 0.6);
    backdrop-filter: blur(8px);
    border-bottom: 1px solid var(--slate-200);
    display: flex;
    gap: 12px;
    align-items: center;
    flex-shrink: 0;
}

.filter-wrapper {
    position: relative;
    flex: 1;
}

.filter-icon {
    position: absolute;
    left: 14px;
    top: 50%;
    transform: translateY(-50%);
    color: var(--slate-400);
    font-size: 14px;
    pointer-events: none;
    z-index: 1;
    transition: color 0.3s;
}

.filter-arrow {
    position: absolute;
    right: 14px;
    top: 50%;
    transform: translateY(-50%);
    color: var(--slate-400);
    font-size: 12px;
    pointer-events: none;
    transition: transform 0.3s ease, color 0.3s;
}

.filter-wrapper:hover .filter-arrow {
    color: var(--primary-500);
    transform: translateY(-50%) rotate(180deg);
}

.filter-wrapper:hover .filter-icon {
    color: var(--primary-500);
}

.filter-select {
    width: 100%;
    padding: 10px 40px;
    border: 1px solid var(--slate-200);
    border-radius: var(--radius-sm);
    background-color: #fff;
    color: var(--slate-700);
    font-size: 13px;
    font-family: inherit;
    font-weight: 500;
    outline: none;
    cursor: pointer;
    transition: all 0.2s ease;
    appearance: none;
    box-shadow: var(--shadow-xs);
}

.filter-select:hover {
    border-color: var(--primary-300);
    box-shadow: 0 0 0 3px var(--primary-50);
}

.filter-select:focus {
    border-color: var(--primary-500);
    box-shadow: 0 0 0 3px var(--primary-100);
}

/* 
    * Components: Pagination 
    */
.pagination-container {
    padding: 8px 16px;
    border-top: 1px solid var(--slate-200);
    display: flex;
    align-items: center;
    justify-content: space-between;
    background: #fff;
    flex-shrink: 0;
}

.pagination-info {
    font-size: 12px;
    color: var(--slate-500);
}

.pagination-controls {
    display: flex;
    gap: 8px;
}

.page-btn {
    width: 28px;
    height: 28px;
    display: flex;
    align-items: center;
    justify-content: center;
    border: 1px solid var(--slate-200);
    background: #fff;
    border-radius: 6px;
    color: var(--slate-600);
    cursor: pointer;
    transition: all 0.2s;
    font-size: 12px;
}

.page-btn:hover:not(:disabled) {
    border-color: var(--primary-500);
    color: var(--primary-500);
    background: var(--primary-50);
}

.page-btn.active {
    background: var(--primary-600);
    color: #fff;
    border-color: var(--primary-600);
}

.page-btn:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    background: var(--slate-50);
}

/* 
    * Animations 
    */
@keyframes fadeIn {
    from { opacity: 0; transform: translateY(10px); }
    to { opacity: 1; transform: translateY(0); }
}

/* 
    * Responsive Design 
    */
@media (max-width: 1200px) {
    .dashboard-container {
        grid-template-columns: 1fr;
        max-width: 900px;
    }
    .lists-container {
        grid-template-columns: 1fr;
    }
}

@media (max-width: 600px) {
    .app-header {
        padding: 0 16px;
        justify-content: space-between; /* Ensure space-between works */
    }
    .dashboard-container {
        padding: 16px;
        gap: 16px;
    }
    .info-grid {
        grid-template-columns: 1fr 1fr;
    }
}

.lang-toggle {
    padding: 6px 16px;
    background: white;
    border: 1px solid var(--slate-200);
    border-radius: 20px;
    cursor: pointer;
    font-size: 13px;
    font-weight: 600;
    color: var(--slate-600);
    transition: all 0.2s;
    display: flex;
    align-items: center;
    gap: 6px;
    box-shadow: var(--shadow-xs);
}
.lang-toggle:hover {
    background: var(--primary-50);
    color: var(--primary-600);
    border-color: var(--primary-200);
}
</style>