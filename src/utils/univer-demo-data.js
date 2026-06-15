import { LocaleType } from '@univerjs/presets'

const sheetId = 'sheet-main'

export function createDemoWorkbookData() {
  return {
    id: 'demo-workbook',
    name: '在线业务表',
    appVersion: '0.10.2',
    locale: LocaleType.ZH_CN,
    styles: {
      header: {
        bl: 1,
        bg: { rgb: '#DDEFEF' },
        cl: { rgb: '#153233' },
      },
      title: {
        bl: 1,
        fs: 14,
        bg: { rgb: '#F4D35E' },
        cl: { rgb: '#182025' },
      },
      money: {
        n: { pattern: '"¥"#,##0.00' },
      },
    },
    sheetOrder: [sheetId],
    sheets: {
      [sheetId]: {
        id: sheetId,
        name: '项目报价',
        tabColor: '#2B8C8C',
        hidden: 0,
        rowCount: 100,
        columnCount: 20,
        zoomRatio: 1,
        freeze: {
          startRow: 1,
          startColumn: -1,
          ySplit: 1,
          xSplit: 0,
        },
        scrollTop: 0,
        scrollLeft: 0,
        defaultColumnWidth: 112,
        defaultRowHeight: 28,
        mergeData: [],
        cellData: {
          0: {
            0: { v: '项目', s: 'header' },
            1: { v: '负责人', s: 'header' },
            2: { v: '阶段', s: 'header' },
            3: { v: '预算', s: 'header' },
            4: { v: '已用', s: 'header' },
            5: { v: '剩余', s: 'header' },
            6: { v: '备注', s: 'header' },
          },
          1: {
            0: { v: '官网改版' },
            1: { v: '张敏' },
            2: { v: '设计评审' },
            3: { v: 48000, s: 'money' },
            4: { v: 21500, s: 'money' },
            5: { f: '=D2-E2', s: 'money' },
            6: { v: '本周确认视觉稿' },
          },
          2: {
            0: { v: 'CRM 接入' },
            1: { v: '李晨' },
            2: { v: '联调' },
            3: { v: 76000, s: 'money' },
            4: { v: 53300, s: 'money' },
            5: { f: '=D3-E3', s: 'money' },
            6: { v: '接口字段待冻结' },
          },
          3: {
            0: { v: '移动端表单' },
            1: { v: '王悦' },
            2: { v: '开发中' },
            3: { v: 32000, s: 'money' },
            4: { v: 12800, s: 'money' },
            5: { f: '=D4-E4', s: 'money' },
            6: { v: '优先完成草稿保存' },
          },
          5: {
            2: { v: '合计', s: 'title' },
            3: { f: '=SUM(D2:D4)', s: 'money' },
            4: { f: '=SUM(E2:E4)', s: 'money' },
            5: { f: '=SUM(F2:F4)', s: 'money' },
          },
        },
        rowData: {},
        columnData: {
          0: { w: 150, hd: 0 },
          1: { w: 110, hd: 0 },
          2: { w: 120, hd: 0 },
          3: { w: 130, hd: 0 },
          4: { w: 130, hd: 0 },
          5: { w: 130, hd: 0 },
          6: { w: 220, hd: 0 },
        },
        showGridlines: 1,
        rowHeader: {
          width: 46,
          hidden: 0,
        },
        columnHeader: {
          height: 24,
          hidden: 0,
        },
        rightToLeft: 0,
      },
    },
  }
}
