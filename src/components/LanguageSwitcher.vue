<!-- LanguageSwitcher.vue -->
<template>
    <select 
        v-model="currentLang" 
        @change="changeLanguage"
        class="btn btn-outline lang-switcher">
        <option value="zh">中文</option>
        <option value="en">English</option>
    </select>
    <!-- <span class="lang-icon">🌐</span> -->
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue';
import { useI18n } from '../utils/i18n.js'; // 或你的 i18n 文件路径

const { setLanguage, currentLang: getCurrentLang } = useI18n();
const currentLang = ref(getCurrentLang());

// 监听全局语言变化事件
const updateLanguage = (event) => {
  currentLang.value = event.detail.lang;
};

onMounted(() => {
  window.addEventListener('languageChanged', updateLanguage);
});

onUnmounted(() => {
  window.removeEventListener('languageChanged', updateLanguage);
});

const changeLanguage = () => {
  setLanguage(currentLang.value);
};
</script>