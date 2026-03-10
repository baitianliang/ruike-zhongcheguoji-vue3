import { nextTick } from "vue";

const i18nData = {
    "en": {
        "director_title": "Director Dashboard",
        "manager_title": "Manager Dashboard",
        "subcontractor_title": "Subcontractor Dashboard",
        "personal_title": "Personal Dashboard",
        "welcome_message": "Welcome back, view your daily overview",
        "task_messages": "Task Messages",
        "pending_emails": "Pending Emails",
        "project_health": "Project Health",
        "work_report_rate": "Report Rate",
        "overdue_tasks": "Overdue Tasks",
        "current_tasks": "Current Tasks",
        "my_tasks": "My Tasks",
        "weekly_tasks": "Weekly Tasks",
        "monthly_tasks": "Monthly Tasks",
        "quarterly_tasks": "Quarterly Tasks",
        "search": "Search",
        "module_metrics": "Module Metrics",
        "overall_progress": "Overall Progress",
        "business_docking": "Business Docking",
        "design_completion": "Design Completion",
        "procurement_process": "Procurement",
        "site_installation": "Site Installation",
        "system_debugging": "System Debugging",
        "prev_page": "Previous",
        "next_page": "Next",
        "view_details": "Details",
        "status_pending": "Pending",
        "status_processing": "Processing",
        "status_completed": "Completed",
        "status_delayed": "Delayed",
        "priority_high": "High",
        "priority_medium": "Medium",
        "priority_low": "Low",
        "task_name": "Task Name",
        "project_name": "Project Name",
        "deadline": "Deadline",
        "priority": "Priority",
        "status": "Status",
        "action": "Action",
        "owner": "Owner",
        "upstream_performance": "Upstream Performance",
        "downstream_performance": "Downstream Performance",
        "unit_name": "Unit Name",
        "completed_count": "Completed",
        "completion_rate": "Completion Rate",
        "status_excellent": "Excellent",
        "team_performance": "Team Performance",
        "name": "Name",
        "level": "Level",
        "weekly_task_count": "Weekly Tasks",
        "completed": "Completed",
        "delayed": "Delayed",
        "switch_theme": "Switch Theme",
        "mark_read_stop_blink": "Click to mark as read/stop blinking",
        "stat_trend_increase": "Compared to yesterday +2",
        "stat_trend_stable": "Stable",
        "personal_title": "Personal Dashboard",
        "switch_lang": "Language",
        "status_normal": "Normal",
        "status_warning": "Warning",
        "status_error": "Error",
        "search_button": "Search",
        "metric_progress_normal": "On Track",
        "metric_follow_up": "Pending",
        "metric_not_started": "Not Started",
        "source_design": "Product Dept",
        "source_dev": "Tech Dept",
        "source_ops": "Ops Dept",
        "current_tasks": "Current Tasks",
        "trend_increase_daily": "vs Yesterday +2",
        "table_task": "Task",
        "source": "Source",
        "upstream": "Upstream",
        "downstream": "Downstream",
        "table_source": "Source",
        "table_deadline": "Deadline",
        "table_upstream": "Upstream",
        "table_downstream": "Downstream",
        "table_owner": "Owner",
        "dept_product": "Product Dept",
        "role_architect": "Architect",
        "role_dba": "DBA",
        "group_dev": "Dev Group",
        "group_ui": "UI Group",
        "group_frontend": "Frontend Group",
        "group_backend": "Backend Group",
        "group_ops": "Ops Group",
        "role_client": "Client",
        "group_qa": "QA Group",
        "task_ui_design": "Complete UI Design",
        "task_api_dev": "Backend API Dev",
        "task_db_opt": "Database Optimization",
        "task_uat": "UAT Testing",
        "task_mobile_adapt": "Mobile Adaptation",
        "task_log_upgrade": "Log System Upgrade",
        "task_payment_int": "Payment Integration",
        "role_senior_designer": "Senior Designer",
        "role_backend_expert": "Backend Expert",
        "role_dba": "DBA",
        "role_qa": "QA Engineer",
        "role_frontend": "Frontend Engineer",
        "role_devops": "DevOps",
        "role_payment": "Payment Expert",
        "role_security": "Security Consultant",
        "role_tech_writer": "Tech Writer",
        "role_architect": "System Architect",
        "unit_product": "Product Dept",
        "unit_design": "Design Group",
        "unit_arch": "Arch Group",
        "unit_test": "Test Group",
        "unit_ops": "Ops Group",
        "unit_client": "Client",
        "downstream_monitor": "Downstream Status Monitoring",
        "system_name": "System Name",
        "response_time": "Response Time",
        "availability": "Availability",
        "last_check": "Last Check"
    },
    "zh": {
        "director_title": "登录首页（项目总监）",
        "manager_title": "登录首页（项目经理）",
        "subcontractor_title": "分包商登录首页",
        "personal_title": "个人工作台",
        "welcome_message": "欢迎回来，查看您的今日概览",
        "task_messages": "任务消息",
        "pending_emails": "待处理邮件",
        "project_health": "项目健康度",
        "work_report_rate": "报工率",
        "overdue_tasks": "逾期任务",
        "current_tasks": "当前任务",
        "my_tasks": "我的任务",
        "weekly_tasks": "本周任务",
        "monthly_tasks": "本月任务",
        "quarterly_tasks": "季度任务",
        "search": "搜索",
        "module_metrics": "模块指标",
        "overall_progress": "总体进度",
        "business_docking": "商务对接",
        "design_completion": "设计完成度",
        "procurement_process": "采购流程",
        "site_installation": "现场安装",
        "system_debugging": "系统调试",
        "prev_page": "上一页",
        "next_page": "下一页",
        "view_details": "查看详情",
        "status_pending": "待处理",
        "status_processing": "进行中",
        "status_completed": "已完成",
        "status_delayed": "已延期",
        "priority_high": "高",
        "priority_medium": "中",
        "priority_low": "低",
        "task_name": "任务名称",
        "project_name": "所属项目",
        "deadline": "截止时间",
        "priority": "优先级",
        "status": "状态",
        "action": "操作",
        "search_placeholder": "搜索任务名称、描述或状态...",
        "source": "来源",
        "upstream": "上游方",
        "downstream": "下游方",
        "owner": "负责人",
        "status_error": "异常",
        "manager_title": "部门经理登录首页",
        "project_health": "项目健康度",
        "status_excellent": "状态极佳",
        "team_performance": "团队成员表现",
        "search_placeholder_manager": "搜索姓名、级别...",
        "name": "姓名",
        "level": "级别",
        "weekly_task_count": "本周任务数",
        "completed": "完成",
        "delayed": "延误",
        "upstream_performance": "上游表现",
        "downstream_performance": "下游表现",
        "unit_name": "单位名",
        "completed_count": "完成数",
        "completion_rate": "完成级",
        "switch_theme": "切换主题",
        "mark_read_stop_blink": "点击标记为已读/停止闪烁",
        "stat_trend_increase": "较昨日 +2",
        "stat_trend_stable": "保持平稳",
        "switch_lang": "语言",
        "system_name": "系统名称",
        "response_time": "响应时间",
        "availability": "可用性",
        "last_check": "最近检查",
        "status_normal": "正常",
        "status_warning": "警告",
        "search_button": "搜索",
        "metric_progress_normal": "正常推进",
        "metric_follow_up": "待跟进",
        "metric_not_started": "未开始",
        "source_design": "产品部",
        "source_dev": "技术部",
        "source_ops": "运维部",
        "current_tasks": "当前任务",
        "trend_increase_daily": "较昨日 +2",
        "table_task": "任务名称",
        "table_source": "来源",
        "table_deadline": "截止时间",
        "table_upstream": "上游方",
        "table_downstream": "下游方",
        "table_owner": "负责人",
        "dept_product": "产品部",
        "role_architect": "架构师",
        "role_dba": "DBA",
        "group_dev": "开发组",
        "group_ui": "UI组",
        "group_frontend": "前端组",
        "group_backend": "后端组",
        "group_ops": "运维组",
        "role_client": "客户",
        "group_qa": "测试组",
        "task_ui_design": "完成界面设计初稿",
        "task_api_dev": "后端API接口开发",
        "task_db_opt": "数据库优化",
        "task_uat": "用户验收测试",
        "task_mobile_adapt": "移动端适配",
        "task_log_upgrade": "日志系统升级",
        "task_payment_int": "第三方支付集成",
        "role_senior_designer": "高级设计师",
        "role_backend_expert": "后端专家",
        "role_dba": "数据库管理员",
        "role_qa": "QA工程师",
        "role_frontend": "前端工程师",
        "role_devops": "DevOps",
        "role_payment": "支付专家",
        "role_security": "安全顾问",
        "role_tech_writer": "技术文档",
        "role_architect": "系统架构",
        "unit_product": "产品部",
        "unit_design": "设计组",
        "unit_arch": "架构组",
        "unit_test": "测试组",
        "unit_ops": "运维组",
        "unit_client": "客户方",
        "downstream_monitor": "下游状态监控"
    }
};

class I18nManager {
    constructor() {
        this.currentLang = this.detectLanguage();
        this.init();
    }

    detectLanguage() {
        const savedLang = localStorage.getItem('app_language');
        if (savedLang) {
            return savedLang;
        }
        const browserLang = navigator.language || navigator.userLanguage;
        return browserLang.startsWith('zh') ? 'zh' : 'en';
    }

    init() {
        this.applyLanguage(this.currentLang);
        this.injectLanguageSwitcher();
    }

    setLanguage(lang) {
        this.currentLang = lang;
        localStorage.setItem('app_language', lang);
        this.applyLanguage(lang);
        window.dispatchEvent(new CustomEvent('languageChanged', { detail: { lang } }));
    }

    getText(key) {
        if(!this.currentLang) 
        this.currentLang = this.detectLanguage();
        return i18nData[this.currentLang][key] || key;
    }

    applyLanguage(lang) {
        const elements = document.querySelectorAll('[data-i18n]');
        elements.forEach(el => {
            const key = el.getAttribute('data-i18n');
            if (i18nData[lang][key]) {
                if (el.tagName === 'INPUT' && el.getAttribute('placeholder')) {
                    el.setAttribute('placeholder', i18nData[lang][key]);
                } else if (el.getAttribute('title')) {
                    el.setAttribute('title', i18nData[lang][key]);
                } else {
                    // Check if element has child nodes that are not text (e.g. icons)
                    // If it has children, we only want to update the text node
                    let hasElementChildren = Array.from(el.childNodes).some(node => node.nodeType === 1);
                    
                    if (hasElementChildren) {
                         // Find the first text node and update it, or append if none
                        let textNode = Array.from(el.childNodes).find(node => node.nodeType === 3 && node.nodeValue.trim() !== '');
                        if (textNode) {
                            textNode.nodeValue = i18nData[lang][key];
                        } else {
                            // If no text node found but element has children (like icon), append text? 
                            // Or maybe the structure is Icon + Text. 
                            // Let's assume the text is the last child or specific part.
                            // Safer approach: if it's a button with icon, maybe wrap text in span or just update text content carefully.
                            // For this specific project, buttons like "Search" have an SVG then text.
                            // We can remove non-element nodes (text) and append new text, or replace specific text node.
                            
                            // Simple approach for now:
                            // 1. Save children elements
                            const children = Array.from(el.children);
                            // 2. Clear content
                            el.innerHTML = '';
                            // 3. Restore children
                            children.forEach(child => el.appendChild(child));
                            // 4. Append text
                            el.appendChild(document.createTextNode((children.length > 0 ? ' ' : '') + i18nData[lang][key]));
                        }
                    } else {
                        el.textContent = i18nData[lang][key];
                    }
                }
            }
        });

        // Update document title if applicable
        // document.title = ... 
    }

    injectLanguageSwitcher() {
        if (document.getElementById('lang-switcher-container')) return;

        const switcherContainer = document.createElement('div');
        switcherContainer.id = 'lang-switcher-container';
        
        const select = document.createElement('select');
        select.className = 'btn btn-outline lang-switcher'; // Use unified classes
        
        select.addEventListener('mouseover', () => {
             // Let CSS handle hover state
        });
        select.addEventListener('mouseout', () => {
             // Let CSS handle hover state
        });
        
        const optionEn = document.createElement('option');
        optionEn.value = 'en';
        optionEn.textContent = 'English';
        
        const optionZh = document.createElement('option');
        optionZh.value = 'zh';
        optionZh.textContent = '中文';

        if (this.currentLang === 'en') optionEn.selected = true;
        else optionZh.selected = true;

        select.appendChild(optionZh);
        select.appendChild(optionEn);

        select.addEventListener('change', (e) => {
            this.setLanguage(e.target.value);
        });

        switcherContainer.appendChild(select);
        
        const headerActions = document.querySelector('.header-actions');
        const userProfile = document.querySelector('.user-profile');

        if (headerActions) {
            // switcherContainer.style.marginLeft = '12px'; // Use gap in CSS
            // Insert before theme toggle if exists
            const themeToggle = document.getElementById('theme-toggle');
            if (themeToggle) {
                headerActions.insertBefore(switcherContainer, themeToggle);
            } else {
                // If user-profile is inside header-actions (like in director dashboard)
                const profile = headerActions.querySelector('.user-profile');
                if (profile) {
                     headerActions.insertBefore(switcherContainer, profile);
                } else {
                     headerActions.appendChild(switcherContainer);
                }
            }
        } else if (userProfile) {
            switcherContainer.style.marginLeft = '15px';
            switcherContainer.style.display = 'inline-block';
            switcherContainer.style.verticalAlign = 'middle';
            userProfile.insertBefore(switcherContainer, userProfile.firstChild);
        } else {
            switcherContainer.style.position = 'fixed';
            switcherContainer.style.top = '20px';
            switcherContainer.style.right = '20px';
            switcherContainer.style.zIndex = '9999';
            document.body.appendChild(switcherContainer);
        }
    }

    formatDate(date) {
        if (!date) return '';
        const d = new Date(date);
        // Use Intl.DateTimeFormat for localization
        return new Intl.DateTimeFormat(this.currentLang === 'zh' ? 'zh-CN' : 'en-US', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
            hour12: false
        }).format(d);
    }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    window.i18nManager = new I18nManager();
});
