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
            <tr class="border-t">
              <td class="py-3 px-3 align-top w-1/2 text-sm">
                Стоимость ДФЛ (лизинг+аванс+выкуп), ₽
              </td>
              <td class="py-3 px-3 align-top w-1/2 text-sm text-left">
                1&nbsp;000 ₽
              </td>
            </tr>

            <tr class="border-t">
              <td class="py-3 px-3 text-sm">Стоимость по ДКП, ₽</td>
              <td class="py-3 px-3 text-sm text-left">1&nbsp;000 ₽</td>
            </tr>

            <tr class="border-t">
              <td class="py-3 px-3 text-sm">Аванс, ₽</td>
              <td class="py-3 px-3 text-sm text-left">1&nbsp;000 ₽</td>
            </tr>

            <tr class="border-t">
              <td class="py-3 px-3 text-sm">Срок лизинга, дней</td>
              <td class="py-3 px-3 text-sm text-left">31 день</td>
            </tr>

            <tr class="border-t">
              <td class="py-3 px-3 text-sm">Размер финансирования, ₽</td>
              <td class="py-3 px-3 text-sm text-left">1&nbsp;000 ₽</td>
            </tr>

            <tr class="border-t">
              <td class="py-3 px-3 text-sm">
                Плата за финансирование (по договору), ₽
              </td>
              <td class="py-3 px-3 text-sm text-left">1&nbsp;000 ₽</td>
            </tr>

            <tr class="border-t">
              <td class="py-3 px-3 text-sm">Процентная ставка (годовых), %</td>
              <td class="py-3 px-3 text-sm text-left">10 %</td>
            </tr>

            <tr class="border-t">
              <td class="py-3 px-3 text-sm">
                Фактический срок пользования, дней
              </td>
              <td class="py-3 px-3 text-sm text-left">31 день</td>
            </tr>

            <tr class="border-t">
              <td class="py-3 px-3 text-sm">Неустойка (пени, штрафы), ₽</td>
              <td class="py-3 px-3 text-sm text-left">1&nbsp;000 ₽</td>
            </tr>

            <tr class="border-t">
              <td class="py-3 px-3 text-sm">Страхование (невозмещённое), ₽</td>
              <td class="py-3 px-3 text-sm text-left">1&nbsp;000 ₽</td>
            </tr>

            <tr class="border-t">
              <td class="py-3 px-3 text-sm">Хранение и эвакуация, ₽</td>
              <td class="py-3 px-3 text-sm text-left">1&nbsp;000 ₽</td>
            </tr>

            <tr class="border-t">
              <td class="py-3 px-3 text-sm">Оплачено (без аванса), ₽</td>
              <td class="py-3 px-3 text-sm text-left">1&nbsp;000 ₽</td>
            </tr>

            <tr class="border-t">
              <td class="py-3 px-3 text-sm">
                Стоимость возвращённого предмета, ₽
              </td>
              <td class="py-3 px-3 text-sm text-left">1&nbsp;000 ₽</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div class="mt-6 text-lg font-semibold">
        Итого по расчету вам должны:
        <span class="text-2xl">18&nbsp;428 ₽</span>
      </div>
    </section>

    <div class="mt-20 border-t pt-4 text-sm text-gray-600">
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
  min-height: 297mm;
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
