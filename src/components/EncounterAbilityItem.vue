<template>
	<div
		ref="slider"
		class="absolute h-full bottom-2"
		:style="{
			'left': `${timeToPixel(computedTimestamp)}px`
		}"
	>
		<div
			class="absolute w-[1px] bg-fuchsia-600 h-full bottom-8 pointer-events-none"
			:class="{
				'bg-sky-600': ability && ability.type === 'tankbuster',
				'bg-amber-600': ability && ability.type === 'misc',
			}"
		/>
		<div class="absolute bottom-0 transform -translate-x-1/2">
			<div
				class="bg-fuchsia-900 border border-fuchsia-600 rounded-md px-2 py-1 text-fuchsia-200 whitespace-nowrap"
				:class="{
					'bg-sky-900 border-sky-600 text-sky-200': ability && ability.type === 'tankbuster',
					'bg-amber-900 border-amber-600 text-amber-200': ability && ability.type === 'misc',
				}"
			>
				<slot>
					<template v-if="ability">
						{{ ability.name }}
					</template>
					<template v-else>
						Unknown ability
					</template>
				</slot>
			</div>
			<div
				class="text-center text-fuchsia-200 text-sm mt-2"
				:class="{
					'text-sky-200': ability && ability.type === 'tankbuster',
					'text-amber-200': ability && ability.type === 'misc',
				}"
			>
				{{ secondsToMMSS(computedTimestamp) }}
			</div>
		</div>
	</div>
</template>

<script lang="ts" setup>
import { InteractEvent } from '@interactjs/types';
import interact from 'interactjs';
import { computed, onMounted, PropType, ref, watch } from 'vue';
import { useTimePixelConverter } from '../composables/useTimePixelConverter';
import { Encounter, EncounterTimelineEntry } from '../models/Encounter';
import { getAbilityById } from '../models/EncounterAbility';
import { secondsToMMSS } from '../utilities/helpers';

const props = defineProps({
	entry: {
		type: Object as PropType<EncounterTimelineEntry>,
		required: true,
	},
	encounter: {
		type: Object as PropType<Encounter>,
		required: true,
	}
});

const ability = computed(() => {
	return getAbilityById(props.encounter.abilities, props.entry.abilityId);
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