<template>
	<div class="flex space-x-2">
		<input
			v-model="minutes"
			type="number"
			class="w-12"
		>
		<span>:</span>
		<input
			v-model="seconds"
			type="number"
			max="60"
			class="w-12"
		>
	</div>
</template>

<script lang="ts">
import { defineComponent, PropType, watch } from "@vue/runtime-core";
import { useTimeInput, TimeType } from "../composables/useTimeInput";

export default defineComponent({
	name: 'TimeInput',

	props: {
		modelValue: {
			type: [Number, Object] as PropType<TimeType>,
			default: 0,
		}
	},

	emits: ['update:modelValue'],

	setup(props, context) {
		const { time, seconds, minutes } = useTimeInput(props.modelValue);

		watch(() => props.modelValue, (value) => {
			if (value === time.value) {
				return;
			}

			time.value = value;
		});

		watch(time, (value) => {
			context.emit('update:modelValue', value);
		});

		return {
			seconds,
			minutes
		};
	}
});
</script>

<style>

</style>