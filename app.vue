<template>
  <div class="flex flex-col bg-gray-400">
    <div class="overflow-hidden content">
      <HeaderComponent />

      <CalculateBlock />

      <FooterComponent />

      <CookiesComponent />
      {{ data }}
    </div>
  </div>
</template>

<script setup>
const config = useRuntimeConfig();

const { data, error } = await useFetch(
  `${config.public.strapi.url}/api/formulas/computeBatch`
);
</script>
