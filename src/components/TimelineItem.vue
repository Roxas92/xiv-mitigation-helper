<template>
	<div
		ref="slider"
		class="absolute h-12 overflow-hidden rounded-xl"
		:style="{
			'left': `${timeToPixel(computedUse)}px`,
			'width': `${timeToPixel(skill.cooldown)}px`
		}"
	> 
		<div
			class="absolute w-12 h-12 top-0 z-10 rounded-xl overflow-hidden"
			:style="{
			}"
		>
			<img
				v-if="skill.icon"
				:src="skill.icon"
			>
		</div>
		<div
			class="absolute h-12 transform cooldown"
			:style="{
				'width': `${timeToPixel(skill.cooldown)}px`
			}"
		/>
		<div
			class="absolute h-12 transform bg-green-400"
			:style="{
				'width': `${timeToPixel(skill.duration)}px`
			}"
		/>
	</div>
</template>

<script lang="ts" setup>
import { InteractEvent } from '@interactjs/types';
import interact from 'interactjs';
import { onMounted, PropType, ref, watch } from 'vue';
import { useTimePixelConverter } from '../composables/useTimePixelConverter';
import { MitigationSkillDescription } from '../models/MitigationSkill';

const props = defineProps({
	skill: {
		type: Object as PropType<MitigationSkillDescription>,
		required: true,
	},
	use: {
		type: Number,
		required: true,
	},
	lastEnd: {
		type: Number,
		default: 0,
	},
	nextStart: {
		type: Number as PropType<number | null>,
		default: null,
	}
});

const emits = defineEmits(['update:use', 'dragstart', 'dragend']);

const computedUse = ref(props.use);

watch(() => props.use, (newUse) => {
	computedUse.value = newUse;
});

const { timeToPixel, pixelToTime } = useTimePixelConverter();

const slider = ref<HTMLElement>();

const initSlider = () => {
	if (!slider.value) {
		return;
	}

	const interactiveSlider = interact(slider.value);

	interactiveSlider.draggable({
		listeners: {
			start() {
				emits('dragstart');
			},
			move(event: InteractEvent) {
				const { dx } = event;
				const currentPosition = timeToPixel(computedUse.value);

				let newPosition = currentPosition + dx;
				const newPositionInTime = pixelToTime(newPosition);

				if (newPositionInTime < props.lastEnd) {
					newPosition = timeToPixel(props.lastEnd);
				}

				if (props.nextStart && (newPositionInTime + (props.skill.cooldown)) > props.nextStart) {
					newPosition = timeToPixel(props.nextStart - (props.skill.cooldown));
				}

				computedUse.value = pixelToTime(newPosition);
			},
			end() {
				emits('update:use', computedUse.value);
				emits('dragend');
			}
		}
	});
};

onMounted(() => {
	initSlider();
});
</script>

<style>
.cooldown {
    background: repeating-linear-gradient(
    45deg,
    rgb(31, 41, 55),
    rgb(31, 41, 55) 5px,
    rgb(55 65 81) 5px,
    rgb(55 65 81) 10px
  );
}
</style>