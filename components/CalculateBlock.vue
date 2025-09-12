<script setup>
import { ref, reactive } from "vue";
// import html2pdf from "html2pdf.js";
import ReportFile from "./ReportFile.vue";
const step = ref(1);
const totalSteps = 4;
const resultVisible = ref(false);
const openModal = ref(false);
const errors = reactive({});
const summ = ref(0);

const downloadPDF = async () => {
  if (process.client) {
    const html2pdf = (await import("html2pdf.js")).default;
    const element = document.getElementById("report-file");

    html2pdf()
      .set({
        margin: 0, // убираем лишние отступы
        filename: "report.pdf",
        image: { type: "jpeg", quality: 0.98 },
        html2canvas: {
          scale: 2,
          useCORS: true,
          logging: false,
        },
        jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
        pagebreak: { mode: ["avoid-all", "css"] }, // избегаем разрыва страниц
      })
      .from(element)
      .save();
  }
};

const form = reactive({
  leasePayments: null,
  advancePayment: null,
  buyoutPrice: null,
  dkpPrice: null,
  transferDate: "",
  paidWithoutAdvance: null,
  lastPaymentDate: "",
  penalties: null,
  insuranceExpenses: null,
  resaleDate: "",
  seizureDate: "",
  storageExpenses: null,
  buyoutOffer: null,
  avitoPrice: null,
});

const result = ref([]);

const requiredFields = {
  1: [
    "leasePayments",
    "advancePayment",
    "buyoutPrice",
    "dkpPrice",
    "transferDate",
  ],
  2: [
    "paidWithoutAdvance",
    "lastPaymentDate",
    "penalties",
    "insuranceExpenses",
  ],
  3: ["resaleDate", "seizureDate"],
  4: ["buyoutOffer", "avitoPrice"],
};

function parseDate(str) {
  if (!str) return null;
  const parts = String(str).trim().split(".");
  if (parts.length !== 3) return null;
  let [d, m, y] = parts.map((p) => Number(p));
  if (!d || !m || !y) return null;
  if (y < 100) y = 2000 + y;
  return new Date(y, m - 1, d);
}

function diffDays(date1, date2) {
  if (!(date1 instanceof Date) || !(date2 instanceof Date)) return null;
  const msPerDay = 24 * 60 * 60 * 1000;
  const utc1 = Date.UTC(date1.getFullYear(), date1.getMonth(), date1.getDate());
  const utc2 = Date.UTC(date2.getFullYear(), date2.getMonth(), date2.getDate());
  return Math.floor((utc1 - utc2) / msPerDay);
}

const nextStep = () => {
  Object.keys(errors).forEach((key) => (errors[key] = null));
  const fields = requiredFields[step.value] || [];
  let valid = true;
  fields.forEach((field) => {
    if (!form[field]) {
      errors[field] = "Поле обязательно";
      valid = false;
    }
  });
  if (!valid) return;

  if (step.value < totalSteps) {
    step.value++;
    return;
  }

  // --- даты ---
  const transferDate = parseDate(form.transferDate);
  const lastPaymentDate = parseDate(form.lastPaymentDate);
  const seizureDate = parseDate(form.seizureDate);

  // --- сроки ---
  const leaseTermDays = Math.max(
    0,
    diffDays(lastPaymentDate, transferDate) || 0
  );
  let factUsageDays = 0;
  if (seizureDate) {
    const raw = diffDays(seizureDate, transferDate) || 0;
    factUsageDays = Math.max(0, raw + 180);
  }

  // --- входные числа ---
  const leasePayments = Number(form.leasePayments || 0);
  const advancePayment = Number(form.advancePayment || 0);
  const buyoutPrice = Number(form.buyoutPrice || 0);
  const dkpPrice = Number(form.dkpPrice || 0);
  const penalties = Number(form.penalties || 0);
  const insuranceExpenses = Number(form.insuranceExpenses || 0);
  const storageExpenses = Number(form.storageExpenses || 50000);
  const paidWithoutAdvance = Number(form.paidWithoutAdvance || 0);
  const buyoutOffer = Number(form.buyoutOffer || 0);
  const avitoPrice = Number(form.avitoPrice || 0);

  // --- ключевые расчёты ---
  const totalLease = leasePayments + advancePayment + buyoutPrice;
  const financingAmount = dkpPrice - advancePayment;
  const financingPayment = totalLease - advancePayment - dkpPrice;

  let annualRatePercent = 0;
  if (financingAmount > 0 && leaseTermDays > 0) {
    annualRatePercent =
      (financingPayment / financingAmount) * (365 / leaseTermDays) * 100;
  }
  annualRatePercent = Number(annualRatePercent.toFixed(2));

  let actualFinancingPayment = 0;
  if (financingAmount > 0 && factUsageDays > 0 && annualRatePercent > 0) {
    actualFinancingPayment =
      financingAmount * (annualRatePercent / 100) * (factUsageDays / 365);
  }
  actualFinancingPayment = Math.round(actualFinancingPayment);

  const returnedItemValue = Math.round(((buyoutOffer + avitoPrice) / 2) * 0.83);

  // --- итоговая сумма ---
  summ.value =
    paidWithoutAdvance +
    returnedItemValue -
    financingAmount -
    actualFinancingPayment -
    penalties -
    insuranceExpenses -
    storageExpenses;

  // --- форматирование ---
  const fmt = (n, unit = "") =>
    `${Math.round(n).toLocaleString("ru-RU")}${unit ? ` ${unit}` : ""}`;

  result.value = [
    { title: "Стоимость ДФЛ (лизинг+аванс+выкуп), ₽", subtitle: fmt(totalLease, "₽") },
    { title: "Стоимость по ДКП, ₽", subtitle: fmt(dkpPrice, "₽") },
    { title: "Аванс, ₽", subtitle: fmt(advancePayment, "₽") },
    { title: "Срок лизинга, дней", subtitle: fmt(leaseTermDays, "д") },
    { title: "Размер финансирования, ₽", subtitle: fmt(financingAmount, "₽") },
    { title: "Плата за финансирование (по договору), ₽", subtitle: fmt(financingPayment, "₽") },
    { title: "Процентная ставка (годовых), %", subtitle: `${annualRatePercent.toFixed(2)} %` },
    { title: "Фактический срок пользования, дней", subtitle: fmt(factUsageDays, "д") },
    { title: "Плата за финансирование фактическая, ₽", subtitle: fmt(actualFinancingPayment, "₽") },
    { title: "Неустойка (пени, штрафы), ₽", subtitle: fmt(penalties, "₽") },
    { title: "Страхование (невозмещённое), ₽", subtitle: fmt(insuranceExpenses, "₽") },
    { title: "Хранение и эвакуация, ₽", subtitle: fmt(storageExpenses, "₽") },
    { title: "Оплачено (без аванса), ₽", subtitle: fmt(paidWithoutAdvance, "₽") },
    { title: "Стоимость возвращённого предмета, ₽", subtitle: fmt(returnedItemValue, "₽") },
  ];

  resultVisible.value = true;
};

// const summ = computed(() => {
//   return (
//     paidWithoutAdvance +
//     returnedItemValue -
//     financingAmount -
//     actualFinancingPayment -
//     penalties -
//     insuranceExpenses -
//     storageExpenses 
//   );
// });
const summNum = computed(() => {
  return Math.round(Number(summ.value)) || 0;
});

const prevStep = () => {
  if (step.value > 1) step.value--;
};

const restart = () => {
  step.value = 1;
  resultVisible.value = false;
  Object.keys(form).forEach((key) => (form[key] = null));
};
</script>

<template>
  <div
    class="min-h-screen flex flex-col items-center justify-center gap-5 md:gap-6 lg:gap-[30px] pt-10 pb-20"
  >
    <div
      class="px-5 flex flex-col items-center justify-center gap-5 md:gap-6 lg:gap-[30px] w-full"
    >
      <div class="flex flex-col gap-[10px]">
        <h2
          class="text-xl md:text-[1.625rem] lg:text-[2rem] 2xl:text-[2.875rem] font-medium text-center text-black"
        >
          Расчет долга лизинговой
        </h2>
        <span class="text-center text-black text-sm 2xl:text-base">
          Сальдо встречных обязательств <br class="sm:hidden" />
          по договору выкупного лизинга
        </span>
      </div>

      <div
        class="w-full max-w-[1100px] bg-blue-100 rounded-[20px] p-[30px] 2xl:py-[42px] 2xl:px-10"
      >
        <template v-if="!resultVisible">
          <div v-if="step === 1" class="flex flex-col gap-10">
            <div class="flex items-center justify-between">
              <span class="text-lg 2xl:text-[1.625rem] font-medium text-white"
                >Шаг 1. Договор</span
              >
              <span
                class="text-white text-sm uppercase border border-white rounded-[10px] px-4 py-2 shrink-0"
                >шаг 1/4</span
              >
            </div>
            <div class="grid grid-cols-1 lg:grid-cols-2 gap-10">
              <div class="flex flex-col justify-between">
                <span class="text-white text-sm 2xl:text-base"
                  >Сумма лизинговых платежей <br />по договору (без аванса),
                  ₽</span
                >
                <BaseInput
                  v-model="form.leasePayments"
                  type="number"
                  required
                  placeholder="0"
                  class="w-full"
                  :errors="errors.leasePayments"
                />
              </div>
              <div class="flex flex-col justify-between">
                <span class="text-white text-sm 2xl:text-base"
                  >Авансовый платеж, ₽</span
                >
                <BaseInput
                  v-model="form.advancePayment"
                  type="number"
                  required
                  placeholder="0"
                  class="w-full"
                  :errors="errors.advancePayment"
                />
              </div>
              <div class="flex flex-col justify-between">
                <span class="text-white text-sm 2xl:text-base"
                  >Выкупная стоимость по договору, ₽</span
                >
                <BaseInput
                  v-model="form.buyoutPrice"
                  type="number"
                  required
                  placeholder="0"
                  class="w-full"
                  :errors="errors.buyoutPrice"
                />
              </div>
              <div class="flex flex-col justify-between">
                <span class="text-white text-sm 2xl:text-base"
                  >Стоимость по ДКП, ₽</span
                >
                <BaseInput
                  v-model="form.dkpPrice"
                  type="number"
                  required
                  placeholder="0"
                  class="w-full"
                  :errors="errors.dkpPrice"
                />
              </div>
              <div class="flex flex-col justify-between lg:col-span-2">
                <span class="text-white text-sm 2xl:text-base"
                  >Акт приёма-передачи в лизинг, дата</span
                >
                <BaseInput
                  v-model="form.transferDate"
                  type="text"
                  required
                  placeholder="дд.мм.гггг"
                  maska="##.##.####"
                  class="w-full"
                  :errors="errors.transferDate"
                />
              </div>
            </div>
          </div>

          <div v-if="step === 2" class="flex flex-col gap-10">
            <div class="flex items-center justify-between">
              <span class="text-lg 2xl:text-[1.625rem] font-medium text-white"
                >Шаг 2. Платежи и расходы</span
              >
              <span
                class="text-white text-sm uppercase border border-white rounded-[10px] px-4 py-2 shrink-0"
                >шаг 2/4</span
              >
            </div>
            <div class="grid lg:grid-cols-2 gap-10">
              <div class="flex flex-col justify-between">
                <span class="text-white text-sm 2xl:text-base"
                  >Оплачено (без аванса), ₽</span
                >
                <BaseInput
                  v-model="form.paidWithoutAdvance"
                  type="number"
                  required
                  placeholder="0"
                  class="w-full"
                  :errors="errors.paidWithoutAdvance"
                />
              </div>
              <div class="flex flex-col justify-between">
                <span class="text-white text-sm 2xl:text-base"
                  >Последний платёж, дата</span
                >
                <BaseInput
                  v-model="form.lastPaymentDate"
                  type="text"
                  required
                  placeholder="дд.мм.гггг"
                  maska="##.##.####"
                  class="w-full"
                  :errors="errors.lastPaymentDate"
                />
              </div>
              <div class="flex flex-col justify-between">
                <span class="text-white text-sm 2xl:text-base"
                  >Задолженность по неустойки (пени, штрафы), ₽</span
                >
                <BaseInput
                  v-model="form.penalties"
                  type="number"
                  required
                  placeholder="0"
                  class="w-full"
                  :errors="errors.penalties"
                />
              </div>
              <div class="flex flex-col justify-between">
                <span class="text-white text-sm 2xl:text-base"
                  >Невозмещенные расходы на страхование, ₽</span
                >
                <BaseInput
                  v-model="form.insuranceExpenses"
                  type="number"
                  required
                  placeholder="0"
                  class="w-full"
                  :errors="errors.insuranceExpenses"
                />
              </div>
            </div>
          </div>

          <div v-if="step === 3" class="flex flex-col gap-10">
            <div class="flex items-center justify-between">
              <span class="text-lg 2xl:text-[1.625rem] font-medium text-white"
                >Шаг 3. Статус предмета</span
              >
              <span
                class="text-white text-sm uppercase border border-white rounded-[10px] px-4 py-2 shrink-0"
                >шаг 3/4</span
              >
            </div>
            <div class="grid lg:grid-cols-2 gap-10">
              <div class="flex flex-col justify-between">
                <span class="text-white text-sm 2xl:text-base"
                  >Продажа изъятого новому владельцу, дата</span
                >
                <BaseInput
                  v-model="form.resaleDate"
                  type="text"
                  required
                  placeholder="дд.мм.гггг"
                  maska="##.##.####"
                  class="w-full"
                  :errors="errors.resaleDate"
                />
              </div>
              <div class="flex flex-col justify-between">
                <span class="text-white text-sm 2xl:text-base"
                  >Изъятие, дата</span
                >
                <BaseInput
                  v-model="form.seizureDate"
                  type="text"
                  required
                  placeholder="дд.мм.гггг"
                  maska="##.##.####"
                  class="w-full"
                  :errors="errors.seizureDate"
                />
              </div>
              <div class="flex flex-col justify-between lg:col-span-2">
                <span class="text-white text-sm 2xl:text-base"
                  >Расходы на хранение и эвакуация, ₽</span
                >
                <BaseInput
                  v-model="form.storageExpenses"
                  type="number"
                  placeholder="0"
                  class="w-full"
                  :errors="errors.storageExpenses"
                />
              </div>
            </div>
          </div>

          <div v-if="step === 4" class="flex flex-col gap-10">
            <div class="flex items-center justify-between">
              <span class="text-lg 2xl:text-[1.625rem] font-medium text-white"
                >Шаг 4. Рыночные показатели на момент расторжения</span
              >
              <span
                class="text-white text-sm uppercase border border-white rounded-[10px] px-4 py-2 shrink-0"
                >шаг 4/4</span
              >
            </div>
            <div class="grid lg:grid-cols-2 gap-10">
              <div class="flex flex-col justify-between">
                <span class="text-white text-sm 2xl:text-base"
                  >Предложение выкупа на день расторжения, ₽</span
                >
                <BaseInput
                  v-model="form.buyoutOffer"
                  type="number"
                  required
                  placeholder="0"
                  class="w-full"
                  :errors="errors.buyoutOffer"
                />
              </div>
              <div class="flex flex-col justify-between">
                <span class="text-white text-sm 2xl:text-base"
                  >Нижняя оценка Авито, ₽</span
                >
                <BaseInput
                  v-model="form.avitoPrice"
                  type="number"
                  required
                  placeholder="0"
                  class="w-full"
                  :errors="errors.avitoPrice"
                />
              </div>
            </div>
          </div>
        </template>

        <template v-else>
          <div class="flex flex-col gap-10">
            <span class="text-lg 2xl:text-[1.625rem] font-medium text-white"
              >Расчет</span
            >

            <div
              class="hidden md:grid grid-cols-[1fr_auto_1fr] gap-10 py-10 border-y border-blue-400"
            >
              <div class="flex flex-col gap-5">
                <span
                  v-for="(item, i) in result"
                  :key="i"
                  class="text-gray-300 text-sm 2xl:text-base"
                  >{{ item.title }}</span
                >
              </div>
              <div class="border border-blue-400 h-full w-[1px]"></div>
              <div class="flex flex-col gap-5 items-center">
                <span
                  v-for="(item, i) in result"
                  :key="i"
                  class="text-white text-sm 2xl:text-base font-medium"
                  >{{ item.subtitle }}</span
                >
              </div>
            </div>

            <div class="flex flex-col md:hidden">
              <div
                v-for="(item, i) in result"
                :key="i"
                class="flex flex-col py-5 first:border-t border-b border-blue-400"
              >
                <span class="text-gray-300 text-sm 2xl:text-base">{{
                  item.title
                }}</span>
                <span class="text-white text-sm 2xl:text-base font-medium">{{
                  item.subtitle
                }}</span>
              </div>
            </div>

            <div
              class="p-[30px] bg-[#FFFFFF33] flex items-center justify-between rounded-[20px] flex-wrap"
            >
              <span
                v-if="summ < 0"
                class="text-white font-medium text-lg 2xl:text-[1.625rem]"
                >Итого по расчету вы должны:</span
              >
              <span
                v-else
                class="text-white font-medium text-lg 2xl:text-[1.625rem]"
                >Итого по расчету лизинг должен вам:</span
              >
              <span class="text-white font-medium text-lg 2xl:text-[1.625rem]"
                >{{ Math.abs(summNum).toLocaleString("ru-RU") }} ₽</span
              >
            </div>
          </div>
        </template>
      </div>

      <template v-if="!resultVisible">
        <div class="flex justify-between w-full max-w-[1100px]">
          <button
            @click="prevStep"
            :class="
              step === 1
                ? 'btn btn-blue bg-[#C1CDDD] cursor-not-allowed'
                : 'btn btn-blue'
            "
            :disabled="step === 1"
          >
            Назад
          </button>
          <button @click="nextStep" class="btn btn-main">
            <IconArrow />
            {{ step === totalSteps ? "Рассчитать" : "Далее" }}
          </button>
        </div>
      </template>
      <template v-else>
        <div class="flex justify-center gap-4 mt-6">
          <button @click="restart" class="btn btn-blue bg-[#C1CDDD]">
            Заполнить заново
          </button>
          <button
            @click="
              downloadPDF();
              openModal = true;
            "
            class="btn btn-main"
          >
            <IconArrow />
            Скачать PDF-отчет
          </button>
        </div>
      </template>
    </div>

    <FormComponent v-if="resultVisible" />

    <div
      v-if="openModal"
      class="fixed top-0 left-0 w-full h-full bg-blue-100 flex items-center justify-center"
    >
      <div
        class="flex flex-col justify-center gap-5 sm:gap-[30px] 2xl:gap-10 py-[42px] px-10 _container"
      >
        <div
          @click="openModal = false"
          class="absolute top-0 right-0 m-2 lg:m-10 cursor-pointer border border-blue-400 rounded-full h-[54px] w-[54px] flex items-center justify-center"
        >
          <IconClose />
        </div>
        <h2 class="text-center text-white">Расчёт успешно выполнен!</h2>

        <span class="text-base text-center text-white 2xl:text-xl">
          Мы подготовили PDF-отчёт и загрузили его на ваш компьютер. Вы можете
          открыть его прямо сейчас или сохранить для последующего использования.
        </span>

        <span class="text-base text-center text-white 2xl:text-xl">
          Если у вас срочный вопрос вы можете связаться с нами прямо сейчас по
          контактам ниже:
        </span>

        <div
          class="grid grid-cols-2 sm:grid-cols-4 w-full gap-[9px] sm:gap-4 xl:gap-6 2xl:gap-8"
        >
          <a
            href="#"
            target="_blank"
            class="text-white text-sm 2xl:text-base w-full h-11 sm:h-[54px] 2xl:h-[64px] border-white border rounded-full flex items-center justify-center gap-2.5"
          >
            +8 (831) 414 04 02
          </a>

          <a
            href="#"
            target="_blank"
            class="text-white text-sm 2xl:text-base w-full h-11 sm:h-[54px] 2xl:h-[64px] border-white border rounded-full flex items-center justify-center gap-2.5"
          >
            +7 (903) 601 04 02
          </a>

          <a
            href="#"
            target="_blank"
            class="text-white text-sm 2xl:text-base w-full h-11 sm:h-[54px] 2xl:h-[64px] border-white border rounded-full flex items-center justify-center gap-2.5"
          >
            <IconWhatsapp class="w-[23px] h-[22px] flex-shrink-0" />

            <span class="uppercase">slf.expert</span>
          </a>

          <a
            href="#"
            target="_blank"
            class="text-white text-sm 2xl:text-base w-full h-11 sm:h-[54px] 2xl:h-[64px] border-white border rounded-full flex items-center justify-center gap-2.5"
          >
            <IconTelegram class="w-[23px] h-[22px] flex-shrink-0" />

            <span class="uppercase">slf.expert</span>
          </a>
        </div>
      </div>
    </div>

    <div class="hidden">
      <ReportFile
        :data="result"
        :summ="summNum"
        id="report-file"
      />
    </div>
  </div>
</template>
