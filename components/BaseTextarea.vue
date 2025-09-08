<template>
  <textarea
    :value="modelValue"
    rows="4"
    :placeholder="inputPlaceholder"
    class="py-5 text-sm text-white bg-transparent border-b border-blue-400 2xl:text-base hover:border-white xl:col-span-2 placeholder:text-white focus-visible:outline-none focus:border-white"
    @input="$emit('update:modelValue', $event.target.value)"
    @focus="clearPlaceholder"
    @blur="resetPlaceholder"
  ></textarea>
</template>

<script setup>
const props = defineProps({
  modelValue: {
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
