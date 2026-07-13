<template>
  <main class="sheet-app">
    <header class="app-bar">
      <div class="brand">
        <!-- <span class="brand-mark">中车</span> -->
        <img src="https://dls.crrcgc.cc/unifier_js/bluedoor/images/favicon.ico" class="brand-mark">
        <div>
          <h1>{{ t.title }}</h1>
          <p>{{ t[status] }}<span v-if="lastSavedAt"> · {{ lastSavedAt }}</span></p>
        </div>
      </div>

      <nav class="actions" :aria-label="t.actionsLabel">
        <button type="button" @click="switchLanguage">{{ locale === 'en' ? t.chinese : t.english }}</button>
        <button type="button" @click="saveDraft">{{ t.syncNow }}</button>
        <button type="button" @click="loadDraft">{{ t.loadShared }}</button>
        <!-- <button type="button" @click="showStructure">权限管理</button> -->
        <button v-if="false" type="button" @click="exportJson">{{ t.exportJson }}</button>
      </nav>
    </header>

    <section class="sheet-shell" :aria-label="t.sheetLabel">
      <div ref="container" class="univer-container"></div>

      <aside v-if="showStructure" class="structure-panel" :aria-label="t.structureLabel">
        <div class="structure-header">
          <div>
            <h2>{{ t.structureLabel }}</h2>
            <p v-if="workbookStructure">
              {{ workbookStructure.sheetCount }} {{ t.sheetsCount }} · {{ t.revision }} {{ workbookStructure.revision }}
            </p>
          </div>
          <button type="button" @click="refreshWorkbookStructure">{{ t.refresh }}</button>
        </div>

        <dl v-if="workbookStructure" class="structure-meta">
          <div>
            <dt>{{ t.name }}</dt>
            <dd>{{ workbookStructure.name }}</dd>
          </div>
          <div>
            <dt>{{ t.id }}</dt>
            <dd>{{ workbookStructure.id }}</dd>
          </div>
          <div>
            <dt>{{ t.locale }}</dt>
            <dd>{{ workbookStructure.locale }}</dd>
          </div>
          <div>
            <dt>{{ t.visibleSheets }}</dt>
            <dd>{{ workbookStructure.visibleSheetCount }}</dd>
          </div>
        </dl>

        <div v-if="workbookStructure" class="sheet-list">
          <article
            v-for="sheet in workbookStructure.sheets"
            :key="sheet.id"
            class="sheet-item"
          >
            <div class="sheet-item-title">
              <strong>{{ sheet.index }}. {{ sheet.name }}</strong>
              <span v-if="sheet.hidden">{{ t.hidden }}</span>
            </div>
            <p>{{ sheet.rowCount }} {{ t.rows }} × {{ sheet.columnCount }} {{ t.columns }}</p>
            <p>{{ sheet.cellCount }} {{ t.cells }} · {{ sheet.mergeCount }} {{ t.merges }}</p>
            <code>{{ sheet.id }}</code>
          </article>
        </div>
      </aside>
    </section>
  </main>
</template>

<script setup>
import { onBeforeUnmount, onMounted, ref, computed } from 'vue'
import { createUniver, LocaleType, mergeLocales } from '@univerjs/presets'
import { UniverSheetsCorePreset } from '@univerjs/preset-sheets-core'
import { UniverSheetsFilterPreset } from '@univerjs/preset-sheets-filter'
import { UniverSheetsTablePreset } from '@univerjs/preset-sheets-table'
import { UniverSheetsFindReplacePreset } from '@univerjs/preset-sheets-find-replace'
import { UniverSheetsSortPreset } from '@univerjs/preset-sheets-sort'
import UniverPresetSheetsCoreZhCN from '@univerjs/preset-sheets-core/locales/zh-CN'
import UniverPresetSheetsFilterZhCN from '@univerjs/preset-sheets-filter/locales/zh-CN'
import UniverPresetSheetsTableZhCN from '@univerjs/preset-sheets-table/locales/zh-CN'
import UniverPresetSheetsFindReplaceZhCN from '@univerjs/preset-sheets-find-replace/locales/zh-CN'
import UniverPresetSheetsSortZhCN from '@univerjs/preset-sheets-sort/lib/locales/zh-CN'
import UniverPresetSheetsCoreEnUS from '@univerjs/preset-sheets-core/locales/en-US'
import UniverPresetSheetsFilterEnUS from '@univerjs/preset-sheets-filter/locales/en-US'
import UniverPresetSheetsTableEnUS from '@univerjs/preset-sheets-table/locales/en-US'
import UniverPresetSheetsFindReplaceEnUS from '@univerjs/preset-sheets-find-replace/locales/en-US'
import UniverPresetSheetsSortEnUS from '@univerjs/preset-sheets-sort/lib/locales/en-US'
import '@univerjs/preset-sheets-core/lib/index.css'
import '@univerjs/preset-sheets-filter/lib/index.css'
import '@univerjs/preset-sheets-table/lib/index.css'
import '@univerjs/sheets-sort-ui/lib/index.css'
import { createDemoWorkbookData } from '../utils/univer-demo-data'
import {
  getClientId,
  loadSharedWorkbook,
  saveSharedCommand,
  saveSharedWorkbook,
  subscribeSharedWorkbook,
} from '../utils/sync-client'

const messages = {
  zh: {
    brandMark: '中',
    title: '在线表格',
    ready: '准备初始化',
    tablePluginMissing: '表格插件未就绪',
    tableExists: '当前区域已经是表格',
    tableCreated: '已创建表格，可按列筛选',
    tableCreateFailed: '创建表格失败',
    activeSheetNeedsData: '当前工作表至少需要表头和一行数据',
    noReadableWorkbook: '未找到可读取的工作簿',
    noSavableWorkbook: '未找到可保存的工作簿',
    baselineSaved: '已保存共享基线',
    saveSharedFailed: '保存共享基线失败',
    commandSynced: '已同步操作',
    commandSyncFailed: '操作同步失败',
    restoredFromServer: '已从服务端恢复共享表格',
    readSharedFailed: '读取共享表格失败，使用示例数据',
    noSharedDraft: '服务端还没有共享存档',
    restoredShared: '已恢复服务端共享表格',
    resetDone: '已重置示例表格并同步',
    sharedBaselineSynced: '已同步共享基线',
    applyBaselineFailed: '应用共享基线失败',
    remoteCommandMerged: '已合并远端操作',
    mergeRemoteCommandFailed: '合并远端操作失败',
    noExportableWorkbook: '未找到可导出的工作簿',
    exportedJson: '已导出 JSON 快照',
    findUnavailable: '查找功能暂不可用',
    openFindFailed: '打开查找对话框失败',
    replaceUnavailable: '替换功能暂不可用',
    openReplaceFailed: '打开替换对话框失败',
    sortUnavailable: '排序功能暂不可用',
    openSortFailed: '打开排序对话框失败',
    readyDone: '共享表格已就绪',
    languageSwitched: '已切换为中文',
    syncConnected: '同步通道已连接',
    syncReconnecting: '同步通道重连中',
    syncError: '同步通道异常',
    actionsLabel: '表格操作',
    syncNow: '立即同步',
    loadShared: '恢复共享版本',
    exportJson: '导出 JSON',
    languageLabel: '语言',
    chinese: '中文',
    english: 'English',
    sheetLabel: 'Univer 在线表格',
    structureLabel: '工作簿结构',
    structureTitle: '工作簿结构',
    refresh: '刷新',
    sheetsCount: '个工作表',
    revision: 'revision',
    name: '名称',
    id: 'ID',
    locale: '语言',
    visibleSheets: '可见工作表',
    hidden: '隐藏',
    rows: '行',
    columns: '列',
    cells: '个非空单元格',
    merges: '个合并区域',
  },
  en: {
    brandMark: 'EN',
    title: 'Online Sheet',
    ready: 'Preparing workspace',
    tablePluginMissing: 'Table plugin is not ready',
    tableExists: 'This range is already a table',
    tableCreated: 'Table created. You can filter by column.',
    tableCreateFailed: 'Failed to create table',
    activeSheetNeedsData: 'The active sheet needs a header and at least one data row',
    noReadableWorkbook: 'No readable workbook found',
    noSavableWorkbook: 'No savable workbook found',
    baselineSaved: 'Shared baseline saved',
    saveSharedFailed: 'Failed to save shared baseline',
    commandSynced: 'Operation synced',
    commandSyncFailed: 'Failed to sync operation',
    restoredFromServer: 'Shared sheet restored from server',
    readSharedFailed: 'Failed to read shared sheet. Using demo data',
    noSharedDraft: 'No shared draft exists on the server',
    restoredShared: 'Server shared sheet restored',
    resetDone: 'Demo sheet reset and synced',
    sharedBaselineSynced: 'Shared baseline synced',
    applyBaselineFailed: 'Failed to apply shared baseline',
    remoteCommandMerged: 'Remote operation merged',
    mergeRemoteCommandFailed: 'Failed to merge remote operation',
    noExportableWorkbook: 'No exportable workbook found',
    exportedJson: 'Exported JSON snapshot',
    findUnavailable: 'Find is not available yet',
    openFindFailed: 'Failed to open find dialog',
    replaceUnavailable: 'Replace is not available yet',
    openReplaceFailed: 'Failed to open replace dialog',
    sortUnavailable: 'Sort is not available yet',
    openSortFailed: 'Failed to open sort dialog',
    readyDone: 'Shared sheet is ready',
    languageSwitched: 'Switched to English',
    syncConnected: 'Sync channel connected',
    syncReconnecting: 'Sync channel reconnecting',
    syncError: 'Sync channel error',
    actionsLabel: 'Sheet actions',
    syncNow: 'Sync now',
    loadShared: 'Restore shared version',
    exportJson: 'Export JSON',
    languageLabel: 'Language',
    chinese: '中文',
    english: 'English',
    sheetLabel: 'Univer online sheet',
    structureLabel: 'Workbook structure',
    structureTitle: 'Workbook structure',
    refresh: 'Refresh',
    sheetsCount: 'sheets',
    revision: 'revision',
    name: 'Name',
    id: 'ID',
    locale: 'Language',
    visibleSheets: 'Visible sheets',
    hidden: 'Hidden',
    rows: 'rows',
    columns: 'columns',
    cells: 'non-empty cells',
    merges: 'merged ranges',
  },
}
let locale = ref(window.localStorage.getItem('app_language') || 'zh')
const t = computed(() => messages[locale.value])

const MUTATION_COMMAND_TYPE = 2
const IGNORED_SYNC_COMMAND_IDS = new Set([
  'doc.mutation.rich-text-editing',
  'formula.mutation.set-trigger-formula-calculation-start',
  'formula.mutation.set-formula-calculation-start',
  'formula.mutation.set-formula-calculation-notification',
  'sheet.mutation.mark-dirty-filter-change',
])
const SYNC_COMMAND_IDS = new Set([
  'sheet.command.add-table',
  'sheet.command.delete-table',
  'sheet.command.set-table-filter',
  'sheet.command.set-sheet-table',
  'sheet.command.sheet-table-insert-row',
  'sheet.command.sheet-table-insert-col',
  'sheet.command.sheet-table-remove-row',
  'sheet.command.sheet-table-remove-col',
])

const container = ref(null)
const status = ref('ready')
const lastSavedAt = ref('')
const showStructure = ref(false)
const workbookStructure = ref(null)

let univerInstance = null
let univerAPIInstance = null
let commandDisposable = null
let unsubscribeSharedWorkbook = null
let isLoadingWorkbook = false
let isApplyingRemoteCommand = false
let latestRevision = 0
let hasServerSnapshot = false
let pendingInitialCommands = []

function getActiveWorkbook() {
  return univerAPIInstance?.getActiveWorkbook?.()
}

function createWorkbook(data = createDemoWorkbookData()) {
  univerAPIInstance?.createWorkbook(data)
}

function getSnapshot({ commitActiveEditor = false } = {}) {
  if (commitActiveEditor) {
    document.activeElement?.blur?.()
  }

  const workbook = getActiveWorkbook()
  return workbook?.save?.()
}

function formatSavedTime(isoTime) {
  return new Date(isoTime).toLocaleTimeString('zh-CN', { hour12: false })
}

function countCells(cellData = {}) {
  return Object.values(cellData).reduce(
    (total, row) => total + Object.keys(row ?? {}).length,
    0
  )
}

function getSheetUsedRange(sheet) {
  const rows = Object.entries(sheet?.cellData ?? {})
    .map(([rowIndex, row]) => {
      const columns = Object.keys(row ?? {}).map(Number)
      return {
        row: Number(rowIndex),
        columns,
      }
    })
    .filter((row) => row.columns.length > 0)

  if (rows.length < 2) {
    return null
  }

  return {
    startRow: Math.min(...rows.map((row) => row.row)),
    endRow: Math.max(...rows.map((row) => row.row)),
    startColumn: Math.min(...rows.flatMap((row) => row.columns)),
    endColumn: Math.max(...rows.flatMap((row) => row.columns)),
  }
}

async function createTableForRange({
  sheetId,
  tableName,
  tableId,
  range,
  silent = false,
}) {
  const workbook = getActiveWorkbook()
  if (!workbook?.addTable) {
    status.value = 'tablePluginMissing'
    return false
  }

  const tables = workbook.getTableList?.() ?? []
  if (tables.some((table) => table.id === tableId || table.name === tableName)) {
    if (!silent) {
      status.value = 'tableExists'
    }
    return false
  }

  try {
    const id = await workbook.addTable(sheetId, tableName, range, tableId, {
      tableStyleId: 'table-default-4',
    })
    if (id) {
      await persistSnapshot()
      if (!silent) {
        status.value = 'tableCreated'
      }
    }
    return Boolean(id)
  } catch (error) {
    console.error(error)
    if (!silent) {
      status.value = 'tableCreateFailed'
    }
    return false
  }
}

async function createTableFromActiveSheet() {
  const workbook = getActiveWorkbook()
  const worksheet = workbook?.getActiveSheet?.()
  const sheetId = worksheet?.getSheetId?.()
  const snapshot = getSnapshot({ commitActiveEditor: true })
  const sheet = snapshot?.sheets?.[sheetId]
  const range = getSheetUsedRange(sheet)

  if (!sheetId || !range) {
    status.value = 'activeSheetNeedsData'
    return
  }

  await createTableForRange({
    sheetId,
    tableName: `Table_${sheetId.replace(/[^a-zA-Z0-9_]/g, '_')}`,
    tableId: `table-${sheetId}`,
    range,
  })
}

function buildWorkbookStructure(snapshot) {
  const sheetOrder = snapshot.sheetOrder ?? Object.keys(snapshot.sheets ?? {})
  const sheets = sheetOrder
    .map((sheetId, index) => {
      const sheet = snapshot.sheets?.[sheetId]
      if (!sheet) {
        return null
      }

      return {
        id: sheet.id,
        index: index + 1,
        name: sheet.name,
        hidden: Boolean(sheet.hidden),
        rowCount: sheet.rowCount ?? 0,
        columnCount: sheet.columnCount ?? 0,
        cellCount: countCells(sheet.cellData),
        mergeCount: sheet.mergeData?.length ?? 0,
      }
    })
    .filter(Boolean)

  return {
    id: snapshot.id,
    name: snapshot.name,
    locale: snapshot.locale,
    revision: latestRevision,
    sheetCount: sheets.length,
    visibleSheetCount: sheets.filter((sheet) => !sheet.hidden).length,
    sheets,
  }
}

function refreshWorkbookStructure() {
  const snapshot = getSnapshot({ commitActiveEditor: true })
  if (!snapshot) {
    status.value = 'noReadableWorkbook'
    return
  }

  workbookStructure.value = buildWorkbookStructure(snapshot)
}

function toggleStructure() {
  showStructure.value = !showStructure.value
  if (showStructure.value) {
    refreshWorkbookStructure()
  }
}

async function persistSnapshot({ manual = false } = {}) {
  const snapshot = getSnapshot({ commitActiveEditor: manual })
  if (!snapshot) {
    status.value = 'noSavableWorkbook'
    return
  }

  try {
    const { revision, updatedAt } = await saveSharedWorkbook(snapshot)
    latestRevision = revision ?? latestRevision
    lastSavedAt.value = formatSavedTime(updatedAt)
    status.value = manual ? 'baselineSaved' : 'baselineSaved'
    if (showStructure.value) {
      workbookStructure.value = buildWorkbookStructure(snapshot)
    }
  } catch (error) {
    console.error(error)
    status.value = 'saveSharedFailed'
  }
}

async function syncCommand(event) {
  const shouldSync =
    event.type === MUTATION_COMMAND_TYPE || SYNC_COMMAND_IDS.has(event.id)

  if (
    !shouldSync ||
    isLoadingWorkbook ||
    isApplyingRemoteCommand ||
    event.options?.fromCollab ||
    event.options?.onlyLocal ||
    IGNORED_SYNC_COMMAND_IDS.has(event.id)
  ) {
    return
  }

  try {
    const { revision, updatedAt } = await saveSharedCommand({
      id: event.id,
      type: event.type,
      params: event.params,
      options: event.options,
    })
    latestRevision = revision ?? latestRevision
    lastSavedAt.value = formatSavedTime(updatedAt)
    status.value = 'commandSynced'
    if (showStructure.value) {
      refreshWorkbookStructure()
    }
  } catch (error) {
    console.error(error)
    status.value = 'commandSyncFailed'
  }
}

const languageList = {
  zh: LocaleType.ZH_CN,
  en: LocaleType.EN_US,
}

const switchLanguage = () => {
  locale.value = locale.value === 'zh' ? 'en' : 'zh'
  window.localStorage.setItem('app_language', locale.value)
  univerAPIInstance.setLocale(languageList[locale.value])
}

function saveDraft() {
  persistSnapshot({ manual: true })
}

async function getInitialWorkbookData() {
  try {
    const sharedWorkbook = await loadSharedWorkbook()
    latestRevision = sharedWorkbook.snapshotRevision ?? 0
    pendingInitialCommands = Array.isArray(sharedWorkbook.commands)
      ? sharedWorkbook.commands.filter((entry) => entry.revision > latestRevision)
      : []

    if (sharedWorkbook?.snapshot) {
      hasServerSnapshot = true
      lastSavedAt.value = formatSavedTime(sharedWorkbook.updatedAt)
      status.value = 'restoredFromServer'
      return sharedWorkbook.snapshot
    }
  } catch (error) {
    console.error(error)
    status.value = 'readSharedFailed'
  }

  return createDemoWorkbookData()
}

async function replaceWorkbook(data) {
  isLoadingWorkbook = true

  try {
    const workbook = getActiveWorkbook()
    const unitId = workbook?.getId?.()
    if (unitId) {
      univerAPIInstance.disposeUnit(unitId)
    }
    createWorkbook(data)
  } finally {
    window.setTimeout(() => {
      isLoadingWorkbook = false
    }, 0)
  }
}

async function loadDraft() {
  try {
    const sharedWorkbook = await loadSharedWorkbook()
    if (!sharedWorkbook?.snapshot) {
      status.value = 'noSharedDraft'
      return
    }

    latestRevision = sharedWorkbook.snapshotRevision ?? latestRevision
    pendingInitialCommands = Array.isArray(sharedWorkbook.commands)
      ? sharedWorkbook.commands.filter((entry) => entry.revision > latestRevision)
      : []
    await replaceWorkbook(sharedWorkbook.snapshot)
    await applyInitialCommands()
    lastSavedAt.value = formatSavedTime(sharedWorkbook.updatedAt)
    status.value = 'restoredShared'
  } catch (error) {
    console.error(error)
    status.value = '读取共享表格失败'
  }
}

async function resetDemo() {
  await replaceWorkbook(createDemoWorkbookData())
  await persistSnapshot({ manual: true })
  status.value = 'resetDone'
}

async function applyRemoteSnapshot(sharedWorkbook) {
  if (sharedWorkbook.sourceClientId === getClientId()) {
    return
  }

  if (sharedWorkbook.revision <= latestRevision) {
    return
  }

  try {
    const latestWorkbook = await loadSharedWorkbook()
    if (!latestWorkbook?.snapshot) {
      return
    }

    const snapshotRevision = latestWorkbook.snapshotRevision ?? sharedWorkbook.snapshotRevision ?? sharedWorkbook.revision
    latestRevision = snapshotRevision
    pendingInitialCommands = Array.isArray(latestWorkbook.commands)
      ? latestWorkbook.commands.filter((entry) => entry.revision > latestRevision)
      : []
    await replaceWorkbook(latestWorkbook.snapshot)
    await applyInitialCommands()
    latestRevision = Math.max(latestRevision, latestWorkbook.revision ?? sharedWorkbook.revision)
    lastSavedAt.value = formatSavedTime(latestWorkbook.updatedAt)
    status.value = 'sharedBaselineSynced'
    if (showStructure.value) {
      workbookStructure.value = buildWorkbookStructure(latestWorkbook.snapshot)
    }
  } catch (error) {
    console.error(error)
    status.value = 'applyBaselineFailed'
  }
}

async function applyRemoteCommand(entry) {
  if (entry.sourceClientId === getClientId() || entry.revision <= latestRevision) {
    return
  }

  isApplyingRemoteCommand = true

  try {
    await univerAPIInstance.executeCommand(
      entry.command.id,
      entry.command.params,
      {
        ...entry.command.options,
        fromCollab: true,
      }
    )
    latestRevision = entry.revision
    lastSavedAt.value = formatSavedTime(entry.createdAt)
    status.value = 'remoteCommandMerged'
    if (showStructure.value) {
      refreshWorkbookStructure()
    }
  } catch (error) {
    console.error(error)
    status.value = 'mergeRemoteCommandFailed'
  } finally {
    isApplyingRemoteCommand = false
  }
}

async function applyInitialCommands() {
  for (const entry of pendingInitialCommands.sort((a, b) => a.revision - b.revision)) {
    await applyRemoteCommand(entry)
  }
  pendingInitialCommands = []
}

function exportJson() {
  const snapshot = getSnapshot({ commitActiveEditor: true })
  if (!snapshot) {
    status.value = 'noExportableWorkbook'
    return
  }

  const blob = new Blob([JSON.stringify(snapshot, null, 2)], {
    type: 'application/json;charset=utf-8',
  })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = `univer-sheet-${Date.now()}.json`
  link.click()
  URL.revokeObjectURL(url)
  status.value = 'exportedJson'
}

function setupAutosave() {
  commandDisposable = univerAPIInstance.addEvent(
    univerAPIInstance.Event.CommandExecuted,
    (event) => {
      if (event.type === MUTATION_COMMAND_TYPE || SYNC_COMMAND_IDS.has(event.id)) {
        syncCommand(event)
      }
    }
  )
}

async function openFindDialog() {
  if (!univerAPIInstance) {
    status.value = 'findUnavailable'
    return
  }

  try {
    await univerAPIInstance.executeCommand('ui.operation.open-find-dialog')
  } catch (error) {
    console.error(error)
    status.value = 'openFindFailed'
  }
}

async function openReplaceDialog() {
  if (!univerAPIInstance) {
    status.value = 'replaceUnavailable'
    return
  }

  try {
    await univerAPIInstance.executeCommand('ui.operation.open-replace-dialog')
  } catch (error) {
    console.error(error)
    status.value = 'openReplaceFailed'
  }
}

async function openSortDialog() {
  if (!univerAPIInstance) {
    status.value = 'sortUnavailable'
    return
  }

  try {
    await univerAPIInstance.executeCommand('sheet.command.sort-range-custom')
  } catch (error) {
    console.error(error)
    status.value = 'openSortFailed'
  }
}

function setupSharedSync() {
  unsubscribeSharedWorkbook = subscribeSharedWorkbook({
    onCommand: applyRemoteCommand,
    onSnapshot: applyRemoteSnapshot,
    onStatus: (message) => {
      if (!lastSavedAt.value) {
        status.value = message
      }
    },
  })
}

onMounted(async () => {
  const { univer, univerAPI } = createUniver({
    locale: languageList[locale.value],
    locales: {
      [LocaleType.ZH_CN]: mergeLocales(
        UniverPresetSheetsCoreZhCN,
        UniverPresetSheetsFilterZhCN,
        UniverPresetSheetsTableZhCN,
        UniverPresetSheetsFindReplaceZhCN,
        UniverPresetSheetsSortZhCN
      ),
      [LocaleType.EN_US]: mergeLocales(
        UniverPresetSheetsCoreEnUS,
        UniverPresetSheetsFilterEnUS,
        UniverPresetSheetsTableEnUS,
        UniverPresetSheetsFindReplaceEnUS,
        UniverPresetSheetsSortEnUS
      ),
    },
    presets: [
      UniverSheetsCorePreset({
        container: container.value,
        header: true,
        toolbar: true,
        formulaBar: true,
        footer: {
          sheetBar: true,
          statisticBar: true,
        },
      }),
      UniverSheetsFilterPreset(),
      UniverSheetsTablePreset(),
      UniverSheetsFindReplacePreset(),
      UniverSheetsSortPreset(),
    ],
  })

  univerInstance = univer
  univerAPIInstance = univerAPI

  const workbook = univerAPI.getActiveWorkbook();
  const permission = workbook?.getWorkbookPermission();
  await permission?.addCollaborator(
    { userID: 'user123', name: '张三', avatar: '' },
    // univerAPI.Enum.UnitRole.Editor // 设置为编辑者
  );

  createWorkbook(await getInitialWorkbookData())
  await applyInitialCommands()
  setupAutosave()
  setupSharedSync()
  if (!hasServerSnapshot) {
    await persistSnapshot()
  }
  status.value = 'readyDone'
})

onBeforeUnmount(() => {
  commandDisposable?.dispose?.()
  unsubscribeSharedWorkbook?.()
  univerInstance?.dispose?.()
  univerAPIInstance?.dispose?.()
  commandDisposable = null
  unsubscribeSharedWorkbook = null
  univerInstance = null
  univerAPIInstance = null
})
</script>

<style scoped>
:root {
  font-family:
    Inter, "PingFang SC", "Microsoft YaHei", system-ui, -apple-system,
    BlinkMacSystemFont, "Segoe UI", sans-serif;
  color: #172426;
  background: #eef3f1;
  font-synthesis: none;
  text-rendering: optimizeLegibility;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

:deep(header) {
  display: block;
  padding-bottom: 0px
}
:deep(.univer-grid), :deep(.univer-pl-2) {
  border-top-width: 0px!important;
  border-bottom-width: 0px!important;
}

* {
  box-sizing: border-box;
}

/* body {
  overflow: hidden;
} */

.actions button {
  border: 0;
  border-radius: 6px;
  min-height: 34px;
  padding: 0 14px;
  color: #ffffff;
  background: #267070;
  font: inherit;
  font-size: 14px;
  cursor: pointer;
}

.actions button:hover {
  background: #1f5d5d;
}

.actions button:focus-visible {
  outline: 2px solid #f4d35e;
  outline-offset: 2px;
}

.actions button.ghost {
  color: #244042;
  background: #dbe6e3;
}

.actions button.ghost:hover {
  background: #cddbd7;
}

.sheet-app {
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  min-width: 320px;
}

.app-bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  flex: 0 0 auto;
  min-height: 72px;
  padding: 12px 18px;
  border-bottom: 1px solid #cfdbd8;
  background: #f8fbfa;
}

.brand {
  display: flex;
  align-items: center;
  gap: 12px;
  min-width: 0;
}

.brand-mark {
  display: grid;
  place-items: center;
  flex: 0 0 36px;
  width: 36px;
  height: 36px;
  border-radius: 8px;
  color: #183334;
  background: #f4d35e;
  font-weight: 800;
}

.brand h1 {
  margin: 0;
  font-size: 18px;
  line-height: 1.2;
}

.brand p {
  margin: 4px 0 0;
  color: #617174;
  font-size: 13px;
  line-height: 1.3;
}

.actions {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 8px;
  flex-wrap: wrap;
}

.sheet-shell {
  position: relative;
  flex: 1 1 auto;
  min-height: 0;
  padding: 12px;
}

.univer-container {
  width: 100%;
  height: 100%;
  min-height: 420px;
  overflow: hidden;
  border: 1px solid #cbd8d5;
  border-radius: 8px;
  background: #ffffff;
}

.structure-panel {
  position: absolute;
  top: 24px;
  right: 24px;
  bottom: 24px;
  z-index: 20;
  width: min(380px, calc(100% - 48px));
  overflow: auto;
  border: 1px solid #cbd8d5;
  border-radius: 8px;
  background: #ffffff;
  box-shadow: 0 16px 44px rgba(22, 40, 42, 0.18);
}

.structure-header {
  position: sticky;
  top: 0;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding: 14px 16px;
  border-bottom: 1px solid #dbe5e2;
  background: #ffffff;
}

.structure-header h2 {
  margin: 0;
  font-size: 16px;
  line-height: 1.25;
}

.structure-header p {
  margin: 4px 0 0;
  color: #667679;
  font-size: 12px;
}

.structure-header button {
  flex: 0 0 auto;
  min-height: 30px;
  border: 0;
  border-radius: 6px;
  padding: 0 12px;
  color: #244042;
  background: #dbe6e3;
  font: inherit;
  font-size: 13px;
  cursor: pointer;
}

.structure-meta {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 10px;
  margin: 0;
  padding: 14px 16px;
  border-bottom: 1px solid #edf2f1;
}

.structure-meta div {
  min-width: 0;
}

.structure-meta dt {
  margin-bottom: 4px;
  color: #667679;
  font-size: 12px;
}

.structure-meta dd {
  margin: 0;
  overflow: hidden;
  color: #172426;
  font-size: 13px;
  line-height: 1.35;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.sheet-list {
  display: grid;
  gap: 10px;
  padding: 14px 16px 16px;
}

.sheet-item {
  border: 1px solid #dbe5e2;
  border-radius: 8px;
  padding: 12px;
  background: #fbfdfc;
}

.sheet-item-title {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
}

.sheet-item-title strong {
  min-width: 0;
  overflow: hidden;
  font-size: 14px;
  line-height: 1.3;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.sheet-item-title span {
  flex: 0 0 auto;
  border-radius: 999px;
  padding: 2px 8px;
  color: #244042;
  background: #dbe6e3;
  font-size: 12px;
}

.sheet-item p {
  margin: 8px 0 0;
  color: #4f6265;
  font-size: 13px;
  line-height: 1.35;
}

.sheet-item code {
  display: block;
  margin-top: 10px;
  overflow: hidden;
  color: #647174;
  font-size: 12px;
  text-overflow: ellipsis;
  white-space: nowrap;
}

@media (max-width: 720px) {
  body {
    overflow: auto;
  }

  .app-bar {
    align-items: stretch;
    flex-direction: column;
    min-height: 0;
  }

  .actions {
    justify-content: stretch;
  }

  .actions button {
    flex: 1 1 132px;
  }

  .sheet-app {
    min-height: 100%;
  }

  .sheet-shell {
    min-height: 560px;
  }

  .structure-panel {
    top: 12px;
    right: 12px;
    bottom: 12px;
    width: calc(100% - 24px);
  }

  .structure-meta {
    grid-template-columns: 1fr;
  }
}

</style>