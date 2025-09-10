<template>
  <div class="bg-blue-100 w-full">
    <div class="py-[5.5rem] sm:py-[6.25rem] 2xl:py-[7.5rem] _container">
      <div v-show="!isSubmitSuccess && !isSubmitError">
        <h2 ref="formTitle" class="text-white">Получить предложение по представлению <br>в суде или выкупу долга</h2>

        <form ref="formElement" class="grid grid-cols-1 xl:grid-cols-2 gap-[30px] items-end mt-8" autocomplete="off"
          novalidate @submit.prevent="onSubmitForm">
          <BaseInput v-model="form.name" :errors="v$.name.$errors" type="text" required placeholder="Имя*"
            class="w-full" />

          <BaseInput v-model="form.phone" :errors="v$.phone.$errors" type="tel" required maska="+7 (###) ###-##-##"
            placeholder="Телефон*" class="w-full" />

          <BaseInput v-model="form.email" :errors="v$.email.$errors" type="email" label="Почта" placeholder="E-mail"
            class="w-full" />

          <Listbox v-model="activePractic">
            <div class="relative z-50">
              <ListboxButton
                class="bg-transparent border-b h-[54px] text-sm 2xl:text-base border-blue-400 hover:border-white text-white w-full duration-500 cursor-pointer transition-colors">
                <span class="block truncate text-start">{{
                  activePractic?.label
                  }}</span>
              </ListboxButton>

              <transition leave-active-class="transition duration-100 ease-in" leave-from-class="opacity-100"
                leave-to-class="opacity-0">
                <ListboxOptions
                  class="absolute mt-1 max-h-60 w-full overflow-auto rounded-md bg-[#00113A] py-1 text-base shadow-lg ring-1 ring-black/5 focus:outline-none sm:text-sm">
                  <ListboxOption v-slot="{ active, selected }" v-for="item in practics" :key="item.id" :value="item"
                    as="template" class="text-white transition-colors duration-500 hover:text-blue-300">
                    <li :class="[
                      active
                        ? 'bg-amber-100 text-amber-900'
                        : 'text-gray-900',
                      'relative cursor-default select-none py-2 pl-10 pr-4',
                    ]">
                      <span :class="[
                        selected ? 'font-medium' : 'font-normal',
                        'block truncate',
                      ]">
                        {{ item.label }}
                      </span>

                      <span v-if="selected" class="absolute inset-y-0 left-0 flex items-center pl-3 text-amber-600">
                      </span>
                    </li>
                  </ListboxOption>
                </ListboxOptions>
              </transition>
            </div>
          </Listbox>

          <BaseTextarea v-model="form.comment" placeholder="Комментарий" />

          <div class="flex flex-wrap items-center justify-center gap-5 col-span-full">
            <div v-if="form.files" class="flex flex-wrap items-center gap-5">
              <div v-for="(file, fileId) in form.files" class="flex items-center gap-2.5 cursor-pointer"
                @click="resetFile">
                <IconCrossCircle class="w-[54px] h-[54px] flex-shrink-0" />

                <div class="flex flex-col gap-1">
                  <span class="text-sm text-blue-300 2xl:text-base">
                    {{ file.name }}
                  </span>

                  <span class="text-sm text-blue-400 2xl:text-base">
                    [{{ Math.round((file.size / 1000000) * 100) / 100 }} MB]
                  </span>
                </div>
              </div>
            </div>

            <button type="button" class="flex items-center gap-2.5" @click="open">
              <div class="h-11 w-11 bg-blue-500 2xl:w-[54px] 2xl:h-[54px] rounded-full">
                <IconFileCircle class="flex-shrink-0 w-full h-auto" />
              </div>

              <div class="flex flex-col items-start">
                <span class="text-sm text-blue-300 2xl:text-base">
                  Подгрузить документ
                </span>

                <span class="text-sm text-blue-400 2xl:text-base">
                  Не более [20 MB]
                </span>
              </div>
            </button>
          </div>

          <label class="flex items-center justify-center gap-2 text-sm 2xl:text-base xl:col-span-2">
            <div class="relative w-5 h-5">
              <input type="checkbox"
                class="h-5 w-5 cursor-pointer appearance-none border border-[#68768F] hover:border-[#A3B8D0] transition-colors duration-500 checked:border-white peer"
                v-model="form.privacy" />

              <IconCheck
                class="absolute hidden -translate-x-1/2 -translate-y-1/2 left-1/2 top-1/2 peer-checked:block w-4 h-2.5" />
            </div>

            <span class="text-white"> Я согласен на обработку</span>

            <NuxtLink to="#" target="_blank" class="text-blue-300">
              Персональных данных.
            </NuxtLink>
          </label>

          <div class="flex justify-center w-full xl:col-span-2">
            <button type="submit" class="btn btn-white xl:max-w-[436px] w-full" :disabled="!form.privacy">
              Отправить
            </button>
          </div>
        </form>
      </div>



      <!-- Сообщение после отправки формы -->
      <div v-show="isSubmitSuccess"
        class="flex flex-col justify-center gap-5 sm:gap-[30px] 2xl:gap-10 w-full max-w-[360px,904px] mx-auto"
        :class="{ 'items-start': modal }">
        <h2 class="text-center text-white" :class="{ 'text-start': modal }">
          Спасибо, данные успешно <br />
          отправлены!
        </h2>

        <span class="text-base text-center text-white 2xl:text-xl" :class="{ 'text-start': modal }">
          Ваша заявка успешно отправлена, и мы уже приступаем к ее рассмотрению.
          В ближайшее время мы свяжемся с вами, чтобы обсудить ваш вопрос. Мы
          отвечаем на заявки не позднее двух дней — по возможности раньше.
        </span>

        <span class="text-base text-center text-white 2xl:text-xl" :class="{ 'text-start': modal }">
          Если у вас срочный вопрос вы можете связаться с нами прямо сейчас по
          контактам ниже:
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

      <div v-show="isSubmitError"
        class="flex flex-col justify-center gap-5 sm:gap-[30px] 2xl:gap-10 w-full max-w-[360px,904px] mx-auto"
        :class="{ 'items-start': modal }">
        <h2 class="text-center text-white">
          Что-то пошло не так. Попробуйте еще раз
        </h2>

        <span class="text-base text-center text-white 2xl:text-xl" :class="{ 'text-start': modal }">
          Если у вас срочный вопрос вы можете связаться с нами прямо сейчас по
          контактам ниже:
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

<script setup>
import {
  Listbox,
  ListboxLabel,
  ListboxButton,
  ListboxOptions,
  ListboxOption,
} from "@headlessui/vue";
import { useVuelidate } from "@vuelidate/core";
import { required, minLength, email, sameAs } from "@vuelidate/validators";
import { useFileDialog } from "@vueuse/core";

const form = reactive({
  name: "",
  phone: "",
  email: "",
  comment: "",
  privacy: false,
  files: [],
});

const rules = {
  name: { required },
  phone: { required, minLength: minLength(18) },
  email: { email },
};

const v$ = useVuelidate(rules, form);

const isSubmit = ref(false);
const isSubmitSuccess = ref(false);
const isSubmitError = ref(false);

// const { activePracticeId } = usePractices();

const practics = ref([
  { id: 0, value: "Практика не выбрана", label: "Выберите практику" },
  { id: 1, value: "Практика не выбрана", label: "Таможня" },
]);

// const activePractic = ref(practics.value[activePracticeId.value]);

const { files, open, reset, onChange } = useFileDialog({});

const filesArray = ref([]);

const previewFiles = (event) => {
  form.files = files;
};

onChange((files) => {
  filesArray.value = Array.from(files);

  for (let i = 0; i < filesArray.value.length; i++) {
    const file = filesArray.value[i];
    const reader = new FileReader();

    reader.onload = (e) => {
      form.files.push({
        name: file.name,
        size: file.size,
        content: e.target.result.split(",")[1],
      });
    };

    reader.readAsDataURL(file);
  }
});

const resetFile = (fileId) => {
  filesArray.value.splice(fileId, 1);
  form.files.splice(fileId, 1);
};

const onSubmitForm = async () => {
  const isFormCorrect = await v$.value.$validate();

  if (!isFormCorrect) return;

  isSubmit.value = true;

  const { data } = await useFetch("/api/send-email", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: {
      name: form.name,
      phone: form.phone,
      email: form.email,
      comment: form.comment,
      practic: activePractic.value.value,
      files: form.files,
    },
  });

  if (data.value.status === "success") {
    isSubmitSuccess.value = true;
  } else if (data.value.status === "error") {
    isSubmitError.value = true;
  }

  form.name = "";
  form.phone = "";
  form.email = "";
  form.comment = "";
  activePractic.value = practics.value[0];
  form.privacy = false;
  form.files = [];

  v$.value.$reset();

  isSubmit.value = false;
};
</script>
