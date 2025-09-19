<template>
  <footer class="py-8 bg-gray-400 border-t border-gray-100">
    <div
      class="flex flex-col items-center justify-between gap-5 _container md:flex-row"
    >
      <!-- 
        <div
          class="flex flex-col w-full gap-5 sm:flex-row sm:items-center sm:justify-between"
        >
      </div> -->
      <span class="text-sm text-gray-600 xl:text-base"
        >© {{ new Date().getFullYear() }} ИП Семин А. С.</span
      >
      <div class="flex items-center gap-6">
        <NuxtLink
          to="https://t.me/slf_expert"
          target="_blank"
          class="bg-white h-[50px] w-[50px] rounded-full flex items-center justify-center"
        >
          <IconTelegram class="w-5 h-5 text-black" />
        </NuxtLink>

        <NuxtLink
          to="https://wa.me/79036010402"
          target="_blank"
          class="bg-white h-[50px] w-[50px] rounded-full flex items-center justify-center"
        >
          <IconWhatsapp class="w-5 h-5 text-black" />
        </NuxtLink>

        <NuxtLink
          to="tel:88006000462"
          target="_blank"
          class="bg-white h-[50px] w-[50px] rounded-full flex items-center justify-center"
        >
          <IconPhone class="w-5 h-5 text-black" />
        </NuxtLink>

        <NuxtLink
          to="mailto:oo@slf.expert"
          target="_blank"
          class="bg-white h-[50px] w-[50px] rounded-full flex items-center justify-center"
        >
          <IconMail class="w-5 h-5 text-black" />
        </NuxtLink>
      </div>
    </div>
  </footer>
</template>
