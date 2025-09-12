<template>
  <div class="a4 bg-white shadow-md p-8 text-black">
    <div class="flex items-start justify-between mb-6">
      <IconLogoFile class="h-[50px] w-fit" />

      <div class="text-right text-sm text-black">
        <div>Телефон: 8 (800) 600-04-62</div>
        <div>Email: oo@slf.expert</div>
      </div>
    </div>

    <span class="text-2xl text-center font-bold mb-10 text-black w-full block">
      Расчет долга лизинговой
    </span>

    <section>
      <h2 class="text-lg font-semibold mb-3 text-black">Расчет:</h2>

      <div class="overflow-x-auto">
        <table class="w-full border-collapse">
          <tbody>

            <tr class="border-t" v-for="(item, i) in data" :key="i">
              <td class="py-3 px-3 text-sm">{{ item.title }}</td>
              <td class="py-3 px-3 text-sm text-left">{{ item.subtitle }}</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div class="mt-6 text-lg font-semibold flex justify-between">
        <span v-if="summ < 0">Итого по расчету вы должны:</span>
        <span v-else>Итого по расчету лизинг должен вам:</span>
        
        <span class="text-2xl">{{ Math.abs(summ).toLocaleString("ru-RU") }} ₽</span>
      </div>
    </section>

    <div class="mt-4 border-t pt-4 text-sm text-gray-600">
      <p>
        Расчёт выполнен автоматически и носит справочный характер. Итоговые
        условия уточняются индивидуально. Документ не является публичной
        офертой.
      </p>
    </div>
  </div>
</template>

<style scoped>
.a4 {
  width: 210mm;
  max-width: 100%;
  box-sizing: border-box;
}
table td {
  border: 1px solid #d1d5db;
}

@media print {
  body {
    background: white;
  }
  .a4 {
    box-shadow: none;
  }
  .a4 {
    page-break-inside: avoid;
  }
}
</style>

<script setup>
const props = defineProps({
  data: {
    type: Array,
    required: true,
  },
  summ: {
    type: String,
    required: true,
  },
});
</script>
