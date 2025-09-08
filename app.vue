<script setup lang="ts">
import ReportFile from "./components/ReportFile.vue";
</script>

<template>
  <div class="flex flex-col bg-gray-400">
    <div class="overflow-hidden content">
      <HeaderComponent />

      <CalculateBlock />

      <FooterComponent />

      <CookiesComponent />

      <!-- <ReportFile /> -->
    </div>
  </div>
</template>
