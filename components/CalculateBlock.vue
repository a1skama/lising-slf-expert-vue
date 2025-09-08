<script setup>
import { ref } from "vue";

const step = ref(1);
const totalSteps = 4;
const resultVisible = ref(false);
const openModal = ref(false);

const result = [
    {
        title: "Стоимость ДФЛ (лизинг+аванс+выкуп), ₽",
        subtitle: "1 000 ₽",
    },
    {
        title: "Стоимость по ДКП, ₽",
        subtitle: "1 000 ₽"
    },
    {
        title: "Аванс, ₽",
        subtitle: "1 000 ₽"
    },
    {
        title: "Срок лизинга, дней",
        subtitle: "31 день"
    },
    {
        title: "Размер финансирования, ₽",
        subtitle: "1 000 ₽"
    },
    {
        title: "Плата за финансирование (по договору), ₽",
        subtitle: "1 000 ₽"
    },
    {
        title: "Процентная ставка (годовых), %",
        subtitle: "10 %"
    },
    {
        title: "Фактический срок пользования, дней",
        subtitle: "31 день"
    },
    {
        title: "Неустойка (пени, штрафы), ₽",
        subtitle: "1 000 ₽"
    },
    {
        title: "Страхование (невозмещённое), ₽",
        subtitle: "1 000 ₽"
    },
    {
        title: "Хранение и эвакуация, ₽",
        subtitle: "1 000 ₽"
    },
    {
        title: "Оплачено (без аванса), ₽",
        subtitle: "1 000 ₽"
    },
    {
        title: "Стоимость возвращённого предмета, ₽",
        subtitle: "1 000 ₽"
    }

];

const nextStep = () => {
    if (step.value < totalSteps) {
        step.value++;
    } else {
        resultVisible.value = true;
    }
};

const prevStep = () => {
    if (step.value > 1) {
        step.value--;
    }
};

const restart = () => {
    step.value = 1;
    resultVisible.value = false;
};
</script>

<template>
    <div class="min-h-screen flex flex-col items-center justify-center gap-5 md:gap-6 lg:gap-[30px] pt-10 pb-20">
        <div class="flex flex-col gap-[10px]">
            <h2
                class="text-xl md:text-[1.625rem] lg:text-[2rem] 2xl:text-[2.875rem] font-medium text-center text-black">
                Расчет долга лизинговой
            </h2>
            <span class="text-center text-black text-sm 2xl:text-base">
                Сальдо встречных обязательств по договору выкупного лизинга
            </span>
        </div>

        <div class="w-full max-w-[1100px] bg-blue-100 rounded-[20px] p-[30px]  2xl:py-[42px] 2xl:px-10 ">
            <template v-if="!resultVisible">
                <div v-if="step === 1" class="flex flex-col gap-10">
                    <div class="flex items-center justify-between">
                        <span class="text-lg 2xl:text-[1.625rem] font-medium text-white">Шаг 1. Договор</span>
                        <span
                            class="text-white text-sm uppercase border border-white rounded-[10px] px-4 py-2 shrink-0">шаг
                            1/4</span>
                    </div>
                    <div class="grid grid-cols-1 lg:grid-cols-2 gap-10">
                        <div class="flex flex-col justify-between">
                            <span class="text-white text-sm 2xl:text-base">Сумма лизинговых платежей <br>по договору
                                (без аванса),
                                ₽</span>
                            <BaseInput v-model="test" :errors="test" type="number" required placeholder="0"
                                class="w-full" />
                        </div>
                        <div class="flex flex-col justify-between">
                            <span class="text-white text-sm 2xl:text-base">Авансовый платеж, ₽</span>
                            <BaseInput v-model="test" :errors="test" type="number" required placeholder="0"
                                class="w-full" />
                        </div>
                        <div class="flex flex-col justify-between">
                            <span class="text-white text-sm 2xl:text-base">Выкупная стоимость по договору, ₽</span>
                            <BaseInput v-model="test" :errors="test" type="number" required placeholder="0"
                                class="w-full" />
                        </div>

                        <div class="flex flex-col justify-between">
                            <span class="text-white text-sm 2xl:text-base">Стоимость по ДКП, ₽</span>
                            <BaseInput v-model="test" :errors="test" type="number" required placeholder="0"
                                class="w-full" />
                        </div>

                        <div class="flex flex-col justify-between lg:col-span-2">
                            <span class="text-white text-sm 2xl:text-base">Акт приёма-передачи в лизинг, дата</span>
                            <BaseInput v-model="test" :errors="test" type="date" required placeholder="0"
                                class="w-full" />
                        </div>

                    </div>
                </div>

                <div v-if="step === 2" class="flex flex-col gap-10">
                    <div class="flex items-center justify-between">
                        <span class="text-lg 2xl:text-[1.625rem] font-medium text-white">Шаг 2. Платежи и расходы</span>
                        <span
                            class="text-white text-sm uppercase border border-white rounded-[10px] px-4 py-2 shrink-0">шаг
                            2/4</span>
                    </div>
                    <div class="grid lg:grid-cols-2 gap-10">
                        <div class="flex flex-col justify-between">
                            <span class="text-white text-sm 2xl:text-base">Оплачено (без аванса), ₽</span>
                            <BaseInput v-model="test" :errors="test" type="number" required placeholder="0"
                                class="w-full" />
                        </div>
                        <div class="flex flex-col justify-between">
                            <span class="text-white text-sm 2xl:text-base">Последний платёж, дата</span>
                            <BaseInput v-model="test" :errors="test" type="date" required placeholder="0"
                                class="w-full" />
                        </div>
                        <div class="flex flex-col justify-between">
                            <span class="text-white text-sm 2xl:text-base">Задолженность по неустойки (пени, штрафы),
                                ₽</span>
                            <BaseInput v-model="test" :errors="test" type="number" required placeholder="0"
                                class="w-full" />
                        </div>

                        <div class="flex flex-col justify-between">
                            <span class="text-white text-sm 2xl:text-base">Невозмещенные расходы на страхование,
                                ₽</span>
                            <BaseInput v-model="test" :errors="test" type="number" required placeholder="0"
                                class="w-full" />
                        </div>
                    </div>
                </div>

                <div v-if="step === 3" class="flex flex-col gap-10">
                    <div class="flex items-center justify-between">
                        <span class="text-lg 2xl:text-[1.625rem] font-medium text-white">Шаг 3. Статус предмета</span>
                        <span
                            class="text-white text-sm uppercase border border-white rounded-[10px] px-4 py-2 shrink-0">шаг
                            3/4</span>
                    </div>
                    <div class="grid lg:grid-cols-2 gap-10">
                        <div class="flex flex-col justify-between">
                            <span class="text-white text-sm 2xl:text-base">Продажа изъятого новому владельцу,
                                дата</span>
                            <BaseInput v-model="test" :errors="test" type="date" required placeholder="0"
                                class="w-full" />
                        </div>
                        <div class="flex flex-col justify-between">
                            <span class="text-white text-sm 2xl:text-base">Изъятие, дата</span>
                            <BaseInput v-model="test" :errors="test" type="date" required placeholder="0"
                                class="w-full" />
                        </div>
                        <div class="flex flex-col justify-between lg:col-span-2">
                            <span class="text-white text-sm 2xl:text-base">Расходы на хранение и эвакуация, ₽</span>
                            <BaseInput v-model="test" :errors="test" type="number" required placeholder="0"
                                class="w-full" />
                        </div>

                    </div>
                </div>

                <div v-if="step === 4" class="flex flex-col gap-10">
                    <div class="flex items-center justify-between">
                        <span class="text-lg 2xl:text-[1.625rem] font-medium text-white">Шаг 4. Рыночные показатели на
                            момент
                            расторжения</span>
                        <span
                            class="text-white text-sm uppercase border border-white rounded-[10px] px-4 py-2 shrink-0">шаг
                            4/4</span>
                    </div>
                    <div class="grid lg:grid-cols-2 gap-10">
                        <div class="flex flex-col justify-between">
                            <span class="text-white text-sm 2xl:text-base">Предложение выкупа на день расторжения,
                                ₽</span>
                            <BaseInput v-model="test" :errors="test" type="number" required placeholder="0"
                                class="w-full" />
                        </div>
                        <div class="flex flex-col justify-between">
                            <span class="text-white text-sm 2xl:text-base">Нижняя оценка Авито, ₽</span>
                            <BaseInput v-model="test" :errors="test" type="number" required placeholder="0"
                                class="w-full" />
                        </div>

                    </div>
                </div>
            </template>
            <template v-else>
                <div class="flex flex-col gap-10">
                    <span class="text-lg 2xl:text-[1.625rem] font-medium text-white">
                        Расчет
                    </span>

                    <div class="hidden md:grid grid-cols-[1fr_auto_1fr] gap-10 py-10 border-y border-blue-400">
                        <div class="flex flex-col gap-5">
                            <span v-for="(item, i) in result" :key="i" class="text-gray-300 text-sm 2xl:text-base"> {{
                                item.title }}
                            </span>
                        </div>
                        <div class="border border-blue-400 h-full w-[1px]"></div>
                        <div class="flex flex-col gap-5 items-center ">
                            <span v-for="(item, i) in result" :key="i"
                                class="text-white text-sm 2xl:text-base font-medium"> {{
                                    item.subtitle }} </span>
                        </div>
                    </div>

                    <div class="flex flex-col md:hidden">
                        <div v-for="(item, i) in result" :key="i" class="flex flex-col py-5 first:border-t border-b border-blue-400">
                            <span class="text-gray-300 text-sm 2xl:text-base">{{ item.title }}</span>
                            <span class="text-white text-sm 2xl:text-base font-medium"> {{ item.subtitle }}</span>
                        </div>
                    </div>



                    <div class="p-[30px] bg-[#FFFFFF33] flex items-center justify-between rounded-[20px] flex-wrap">
                        <span class="text-white font-medium text-lg 2xl:text-[1.625rem]">Итого по расчету вы
                            должны:</span>
                        <span class="text-white font-medium text-lg 2xl:text-[1.625rem]">18 428 ₽</span>
                    </div>
                </div>

            </template>

        </div>

        <template v-if="!resultVisible">
            <div class="flex justify-between w-full max-w-[1100px]">
                <button @click="prevStep"
                    :class="step === 1 ? 'btn btn-blue bg-[#C1CDDD] cursor-not-allowed' : 'btn btn-blue'"
                    :disabled="step === 1">
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
                <button @click="openModal = true" class="btn btn-main">
                    <IconArrow />
                    Скачать PDF-отчет
                </button>
            </div>
        </template>
        <FormComponent v-if="resultVisible" />







        <div v-if="openModal" class="fixed top-0 left-0   w-full h-full bg-blue-100 flex items-center justify-center">
            <div class="flex flex-col justify-center gap-5 sm:gap-[30px] 2xl:gap-10 py-[42px] px-10 _container">
                <div @click="openModal = false"
                    class="absolute top-0 right-0 m-2 lg:m-10 cursor-pointer border border-blue-400 rounded-full h-[54px] w-[54px] flex items-center justify-center">
                    <IconClose />
                </div>
                <h2 class="text-center text-white">
                    Расчёт успешно выполнен!
                </h2>

                <span class="text-base text-center text-white 2xl:text-xl">
                    Мы подготовили PDF-отчёт и загрузили его на ваш компьютер.
                    Вы можете открыть его прямо сейчас или сохранить для последующего использования.
                </span>

                <span class="text-base text-center text-white 2xl:text-xl">
                    Если у вас срочный вопрос вы можете связаться с нами прямо сейчас по контактам ниже:
                </span>

                <div class="grid grid-cols-2 sm:grid-cols-4 w-full gap-[9px] sm:gap-4 xl:gap-6 2xl:gap-8">
                    <a href="#" target="_blank"
                        class="text-white text-sm 2xl:text-base w-full h-11 sm:h-[54px] 2xl:h-[64px] border-white border rounded-full flex items-center justify-center gap-2.5">
                        +8 (831) 414 04 02
                    </a>

                    <a href="#" target="_blank"
                        class="text-white text-sm 2xl:text-base w-full h-11 sm:h-[54px] 2xl:h-[64px] border-white border rounded-full flex items-center justify-center gap-2.5">
                        +7 (903) 601 04 02
                    </a>

                    <a href="#" target="_blank"
                        class="text-white text-sm 2xl:text-base w-full h-11 sm:h-[54px] 2xl:h-[64px] border-white border rounded-full flex items-center justify-center gap-2.5">
                        <IconWhatsapp class="w-[23px] h-[22px] flex-shrink-0" />

                        <span class="uppercase">slf.expert</span>
                    </a>

                    <a href="#" target="_blank"
                        class="text-white text-sm 2xl:text-base w-full h-11 sm:h-[54px] 2xl:h-[64px] border-white border rounded-full flex items-center justify-center gap-2.5">
                        <IconTelegram class="w-[23px] h-[22px] flex-shrink-0" />

                        <span class="uppercase">slf.expert</span>
                    </a>
                </div>
            </div>
        </div>

    </div>
</template>
