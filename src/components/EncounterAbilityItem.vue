<template>
	<div
		ref="slider"
		class="absolute h-full bottom-2"
		:style="{
			'left': `${timeToPixel(computedTimestamp)}px`
		}"
	>
		<div class="absolute w-[1px] bg-fuchsia-600 h-full bottom-8 pointer-events-none" />
		<div class="absolute bottom-0 transform -translate-x-1/2">
			<div class="bg-fuchsia-900 border border-fuchsia-600 rounded-md px-2 py-1 text-fuchsia-200">
				{{ entry.ability.name }}
			</div>
			<div class="text-center text-fuchsia-200 text-sm mt-2">
				{{ secondsToMMSS(computedTimestamp) }}
			</div>
		</div>
	</div>
</template>

<script lang="ts" setup>
import { InteractEvent } from '@interactjs/types';
import interact from 'interactjs';
import { onMounted, PropType, ref, watch } from 'vue';
import { useTimePixelConverter } from '../composables/useTimePixelConverter';
import { TimelineEntry } from '../models/Encounter';
import { secondsToMMSS } from '../utilities/helpers';

const props = defineProps({
	entry: {
		type: Object as PropType<TimelineEntry>,
		required: true,
	}
});

const computedTimestamp = ref(props.entry.timestamp);

watch(() => props.entry, (newEntry) => {
	computedTimestamp.value = newEntry.timestamp;
});

const emits = defineEmits(['dragstart', 'dragend', 'update:timestamp']);

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
				const currentPosition = timeToPixel(computedTimestamp.value);

				let newPosition = currentPosition + dx;
				const newPositionInTime = pixelToTime(newPosition);

				if (newPositionInTime < 0) {
					newPosition = timeToPixel(0);
				}

				computedTimestamp.value = pixelToTime(newPosition);
			},
			end() {
				emits('update:timestamp', computedTimestamp.value);
				emits('dragend');
			}
		}
	});
};

onMounted(() => {
	initSlider();
});
</script>