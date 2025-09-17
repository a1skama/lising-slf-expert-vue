<script setup>
import { ref, reactive, computed } from "vue";
import ReportFile from "./ReportFile.vue";

const config = useRuntimeConfig(); // URL бэкенда

const step = ref(1);
const totalSteps = 4;
const resultVisible = ref(false);
const openModal = ref(false);
const errors = reactive({});
const summ = ref(0);

const form = reactive({
  leasePayments: null, // lease_payments_total
  advancePayment: null, // advance_payment
  buyoutPrice: null, // contract_buyout_price
  dkpPrice: null, // sale_price
  transferDate: "", // acceptance_date
  paidWithoutAdvance: null, // paid_lease_payments_without_advance
  lastPaymentDate: "", // last_payment_date
  penalties: null, // penalty_debt
  insuranceExpenses: null, // insurance_unreimbursed (необязательное)
  resaleDate: "", // resale_date
  seizureDate: "", // extraction_date
  storageExpenses: null, // storage_expenses
  buyoutOffer: null, // proposed_buyout
  avitoPrice: null, // avito_min_estimate
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
  2: ["paidWithoutAdvance", "lastPaymentDate", "penalties"],  
  3: ["storageExpenses"], 
  4: ["buyoutOffer", "avitoPrice"],
};

function parseDate(str) {
  if (!str) return null;
  const [d, m, y] = str.split(".").map(Number);
  if (!d || !m || !y) return null;
  return new Date(y < 100 ? 2000 + y : y, m - 1, d).toISOString().split("T")[0];
}

const titles = {
  cost_dfl: "Стоимость ДФЛ, ₽",
  cost_dkp: "Стоимость ДКП, ₽",
  advance_payment: "Размер аванса, ₽",
  lease_term: "Срок лизинга, дней",
  financing_amount: "Размер финансирования, ₽",
  contract_financing_fee_total: "Плата за финансирование по договору, ₽",
  annual_financing_rate_percent: "Процентная ставка, %",
  actual_usage_days: "Фактическое пользование лизингом, дней",
  actual_financing_fee: "Плата за финансирование фактическая, ₽",
  penalty_debt: "Пени, ₽",
  insurance_unreimbursed: "Страхование, ₽",
  storage_expenses: "Хранение, ₽",
  paid_lease_payments_without_advance: "Оплачено без аванса, ₽",
  returned_item_cost: "Стоимость возвращённого предмета, ₽",
};

const summNum = computed(() => Math.round(Number(summ.value)) || 0);

const nextStep = async () => {
  Object.keys(errors).forEach((key) => (errors[key] = []));
  const fields = requiredFields[step.value] || [];
  let valid = true;

  // стандартная проверка обязательных полей
  fields.forEach((field) => {
    if (!form[field]) {
      errors[field] = "Поле обязательно";
      valid = false;
    }
  });

  // спец-проверка resaleDate / seizureDate (шаг 3)
  if (step.value === 3) {
    if (!form.resaleDate && !form.seizureDate) {
      errors.resaleDate = "Заполните хотя бы одно поле";
      errors.seizureDate = "Заполните хотя бы одно поле";
      valid = false;
    }
  }

  if (!valid) return;

  if (step.value < totalSteps) {
    step.value++;
    return;
  }

  const variables = {
    lease_payments_total: Number(form.leasePayments || 0),
    advance_payment: Number(form.advancePayment || 0),
    contract_buyout_price: Number(form.buyoutPrice || 0),
    sale_price: Number(form.dkpPrice || 0),
    acceptance_date: parseDate(form.transferDate),
    last_payment_date: parseDate(form.lastPaymentDate),
    extraction_date: parseDate(form.seizureDate),
    resale_date: parseDate(form.resaleDate),
    paid_lease_payments_without_advance: Number(form.paidWithoutAdvance || 0),
    penalty_debt: Number(form.penalties || 0),
    insurance_unreimbursed: Number(form.insuranceExpenses || 0), // может быть 0
    storage_expenses: Number(form.storageExpenses || 0),
    proposed_buyout: Number(form.buyoutOffer || 0),
    avito_min_estimate: Number(form.avitoPrice || 0),
  };

  try {
    const res = await fetch(
      `${config.public.strapi.url}/api/formulas/computeBatch`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ variables }),
      }
    );

    const json = await res.json();

    result.value = Object.entries(json.results)
      .filter(([slug]) => slug !== "unjust_enrichment_balance") // исключаем итоговую сумму
      .map(([slug, val]) => ({
        title: titles[slug] || slug,
        subtitle:
          typeof val === "number"
            ? Math.round(
                slug === "annual_financing_rate_percent" ? val * 100 : val
              ).toLocaleString("ru-RU") +
              (slug.includes("days")
                ? " д"
                : slug.includes("rate")
                ? " %"
                : " ₽")
            : String(val),
      }));

    summ.value = json.results.unjust_enrichment_balance || 0;
    resultVisible.value = true;
  } catch (err) {
    console.error("Ошибка запроса:", err);
  }
};

const prevStep = () => {
  if (step.value > 1) step.value--;
};

const restart = () => {
  step.value = 1;
  resultVisible.value = false;
  Object.keys(form).forEach((key) => (form[key] = null));
};

const downloadPDF = async () => {
  if (process.client) {
    const html2pdf = (await import("html2pdf.js")).default;
    const element = document.getElementById("report-file");

    html2pdf()
      .set({
        margin: 0,
        filename: "report.pdf",
        image: { type: "jpeg", quality: 0.98 },
        html2canvas: { scale: 2, useCORS: true, logging: false },
        jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
        pagebreak: { mode: ["avoid-all", "css"] },
      })
      .from(element)
      .save();
  }
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
                <div class="flex justify-between gap-2">
                  <span class="text-white text-sm 2xl:text-base"
                    >Изъятие, дата</span
                  >
                  <div class="relative group">
                    <div class="cursor-pointer">
                      <svg
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z"
                          fill="#6483A9"
                        />
                        <path
                          d="M12 16V12"
                          stroke="#1F1F1F"
                          stroke-width="2"
                          stroke-linecap="round"
                          stroke-linejoin="round"
                        />
                        <path
                          d="M12 8H12.01"
                          stroke="#1F1F1F"
                          stroke-width="2"
                          stroke-linecap="round"
                          stroke-linejoin="round"
                        />
                      </svg>
                    </div>
                    <div
                      class="absolute top-7 right-0 p-4 bg-[#FFFFFF33] rounded-[10px] backdrop-blur-xl w-max max-w-[300px] hidden group-hover:block"
                    >
                      <span class="text-white"
                        >Если не известна дата продажи <br />
                        изъятого предмета новому владельцу
                      </span>
                    </div>
                  </div>
                </div>

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
                <div class="flex justify-between gap-2">
                  <span class="text-white text-sm 2xl:text-base"
                    >Расходы на хранение и эвакуация, ₽</span
                  >
                  <div class="relative group">
                    <div class="cursor-pointer">
                      <svg
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z"
                          fill="#6483A9"
                        />
                        <path
                          d="M12 16V12"
                          stroke="#1F1F1F"
                          stroke-width="2"
                          stroke-linecap="round"
                          stroke-linejoin="round"
                        />
                        <path
                          d="M12 8H12.01"
                          stroke="#1F1F1F"
                          stroke-width="2"
                          stroke-linecap="round"
                          stroke-linejoin="round"
                        />
                      </svg>
                    </div>
                    <div
                      class="absolute top-7 right-0 p-4 bg-[#FFFFFF33] rounded-[10px] backdrop-blur-xl w-max max-w-[330px] hidden group-hover:block"
                    >
                      <span class="text-white"
                        >Если неизвестно — укажите 50 000 ₽
                      </span>
                    </div>
                  </div>
                </div>

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
      <ReportFile :data="result" :summ="summNum" id="report-file" />
    </div>
  </div>
</template>
