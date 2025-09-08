<template>
  <div class="flex flex-col">
    <input
      :value="modelValue"
      :type="type"
      :placeholder="inputPlaceholder"
      v-maska="maska"
      class="py-4 text-sm text-white transition-colors duration-500 bg-transparent border-b border-blue-400 2xl:text-base hover:border-white placeholder:text-white focus-visible:outline-none focus:border-white"
      @input="$emit('update:modelValue', $event.target.value)"
      @focus="clearPlaceholder"
      @blur="resetPlaceholder"
    />

    <span v-if="errors.length" class="text-[#A3B8D0] leading-none mt-4">
      Некорректно введена переменная, пожалуйста попробуйте снова.
    </span>
  </div>
</template>

<script setup>
const props = defineProps({
  modelValue: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    required: true,
  },
  placeholder: {
    type: String,
    default: "Введите текст",
  },
  errors: {
    type: Array,
    required: false,
    default: [],
  },
  maska: {
    type: String,
    required: false,
  },
  required: {
    type: Boolean,
    required: false,
    default: false,
  },
});

const inputPlaceholder = ref(props.placeholder);

const clearPlaceholder = () => {
  inputPlaceholder.value = "";
};

const resetPlaceholder = () => {
  inputPlaceholder.value = props.placeholder;
};

defineEmits(["update:modelValue"]);
</script>
