<template>
	<div class="z-20 h-16">
		<div class="absolute ml-48 h-full top-0">
			<div
				ref="timelineRow"
				class="absolute w-full h-16 bottom-0"
				:style="{
					'minWidth': `${timeToPixel(getDuration(encounter) + 10)}px`
				}"
				@click="openNewAbilityOverlay"
				@mousemove="onTimelineMouseMove"
				@mouseleave="onTimelineMouseOut"
			/>
			<EncounterAbilityItem
				v-show="isNewAbilityVisible"
				class="opacity-50 pointer-events-none z-20"
				:entry="newEncounterAbility"
				:encounter="encounter"
			>
				+
			</EncounterAbilityItem>
			<EncounterAbilityItem
				v-for="entry in encounter.timeline"
				:key="entry.timestamp"
				:entry="entry"
				:encounter="encounter"
				@dragstart="isDragging = true"
				@dragend="isDragging = false"
				@update:timestamp="updateTimelineEntryForEncounter(entry, $event)"
				@dblclick="removeTimelineEntryForEncounter(entry)"
			/>
			<div
				v-show="isNewAbilityOverlayVisible"
				ref="newAbilityOverlay"
				class="flex lg:block flex-1 backdrop-blur-xl items-center z-20 absolute bg-gray-800/75 border bottom-20 border-gray-700 rounded-lg py-2 shadow-2xl transform -translate-x-1/2 min-w-[214px]"
				:style="{
					'left': `${timeToPixel(newEncounterAbility.timestamp)}px`
				}"
			>
				<button
					v-for="ability in encounter.abilities"
					:key="ability.id"
					class="text-gray-50 text-center w-full hover:bg-gray-600 px-4 py-2"
					@click="addAbility(ability, newEncounterAbility.timestamp)"
				>
					{{ ability.name }}
				</button>
				<form
					class="px-2 border-t border-t-gray-600 pt-2 mt-2 flex"
					@submit.prevent="addAbilityWithCustomName"
				>
					<input
						v-model="newAbilityName"
						type="text"
						class="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full text-white sm:text-sm border border-gray-600 rounded px-2.5 mr-2 bg-gray-700"
						placeholder="New ability"
					>
					<button
						type="button"
						class="inline-flex items-center px-2.5 py-1.5 border border-transparent text-xs font-medium rounded shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
						@click="addAbilityWithCustomName"
					>
						Save
					</button>
				</form>
			</div>
		</div>
	</div>
</template>

<script lang="ts" setup>
import { PropType, computed, ref } from 'vue';
import { useTimePixelConverter } from '../composables/useTimePixelConverter';
import { Encounter, EncounterTimelineEntry, updateTimelineEntry, removeAbilityFromTimelineById, getDuration, BossAbility, addAbilityToTimeline, createBossAbility } from '../models/Encounter';
import EncounterAbilityItem from './EncounterAbilityItem.vue';
import { onClickOutside } from '@vueuse/core';

const props = defineProps({
	encounter: {
		type: Object as PropType<Encounter>,
		required: true,
	}
});

const emits = defineEmits<{
	(e: 'update:encounter', encounter: Encounter): void
}>();

const updateTimelineEntryForEncounter = (entry: EncounterTimelineEntry, timestamp: number) => {
	const newEncounter = { ...props.encounter };
	updateTimelineEntry(newEncounter, entry.id,  timestamp);
	emits('update:encounter', newEncounter);
};

const removeTimelineEntryForEncounter = (entry: EncounterTimelineEntry) => {
	const newEncounter = { ...props.encounter };
	removeAbilityFromTimelineById(newEncounter, entry.id);
	emits('update:encounter', newEncounter);
};

const { timeToPixel, pixelToTime } = useTimePixelConverter();

const isTimelineMouseActive = ref(false);
const potentialUseTiming = ref(0);
const isDragging = ref(false);
const isNewAbilityOverlayVisible = ref(false);

const timelineRow = ref<HTMLElement>();

const isNewAbilityVisible = computed(() => {
	if (isNewAbilityOverlayVisible.value) {
		return true;
	}

	return isTimelineMouseActive.value && !isDragging.value;
});

const onTimelineMouseMove = (event: MouseEvent) => {
	isTimelineMouseActive.value = true;

	if (isNewAbilityOverlayVisible.value) {
		return;
	}

	if (!timelineRow.value) {
		return;
	}

	const rect = timelineRow.value.getBoundingClientRect();
	const { left, width } = rect;
	let x = event.clientX - left;

	if (x < 0) {
		x = 0;
	}

	if (x > width) {
		x = width;
	}

	potentialUseTiming.value = pixelToTime(x);
};

const onTimelineMouseOut = () => {
	isTimelineMouseActive.value = false;
};

const openNewAbilityOverlay = (event: MouseEvent) => {
	if (!isNewAbilityVisible.value) {
		return;
	}

	event.preventDefault();
	event.stopPropagation();

	if (isNewAbilityOverlayVisible.value) {
		isNewAbilityOverlayVisible.value = false;
		return;
	}

	isNewAbilityOverlayVisible.value = true;
};

const newEncounterAbility = computed<EncounterTimelineEntry>(() => ({
	id: 'newEncounterAbility',
	abilityId: '',
	timestamp: potentialUseTiming.value,
}));

const newAbilityOverlay = ref<HTMLElement>();

const newAbilityName = ref();

onClickOutside(newAbilityOverlay, () => {
	if (!isNewAbilityOverlayVisible.value) {
		return;
	}

	isNewAbilityOverlayVisible.value = false;
}, { capture: false });

const addAbility = (ability: BossAbility, timestamp: number) => {
	const newEncounter = { ...props.encounter };
	addAbilityToTimeline(newEncounter, ability, timestamp);
	emits('update:encounter', newEncounter);
	isNewAbilityOverlayVisible.value = false;
};

const addAbilityWithCustomName = () => {
	if (!newAbilityName.value) {
		return;
	}

	const newEncounter = { ...props.encounter };
	const ability = createBossAbility(newAbilityName.value);
	addAbilityToTimeline(newEncounter, ability, potentialUseTiming.value);
	emits('update:encounter', newEncounter);
	isNewAbilityOverlayVisible.value = false;
	newAbilityName.value = '';
};
</script>