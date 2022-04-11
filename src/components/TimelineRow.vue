<template>
	<div
		class="h-12 flex"
	>
		<div class="bg-gray-700 w-48 px-4 h-full flex items-center sticky left-0 z-30 flex-shrink-0 text-gray-200">
			{{ skill.name }}
		</div>
		<div
			ref="timelineRow"
			class="h-full relative bg-gray-800 w-full overflow-hidden"
			:style="{
				'minWidth': `${timeToPixel(duration + 10)}px`
			}"
			@mousemove="onTimelineMouseMove"
			@mouseleave="onTimelineMouseOut"
			@click="addNewUse"
		>
			<TimelineItem
				v-for="(use, $index) in uses"
				:key="$index"
				class="timeline-item"
				:skill="skill"
				:use="use"
				:last-end="getLastEndBoundary($index)"
				:next-start="getNextStartBoundary($index)"
				@dragstart="isDragging = true"
				@dragend="isDragging = false"
				@update:use="onUpdateUse($index, $event)"
				@dblclick="emits('remove', use)"
			/> 
			<TimelineItem
				v-show="isNewUseVisible"
				class="opacity-50 pointer-events-none"
				:skill="skill"
				:use="potentialUseTiming"
			/>
		</div>
	</div>
</template>

<script lang="ts" setup>
import { computed, PropType, ref } from 'vue';
import { useTimePixelConverter } from '../composables/useTimePixelConverter';
import { MitigationSkillDescription } from '../models/MitigationSkill';
import { isSkillAvailable, MitigationTimelineEntry } from '../models/MitigationStrategy';
import TimelineItem from './TimelineItem.vue';

const props = defineProps({
	skill: {
		type: Object as PropType<MitigationSkillDescription>,
		required: true,
	},
	uses: {
		type: Array as PropType<number[]>,
		default: () => [],
	},
	duration: {
		type: Number,
		default: 0,
	}
});

const { timeToPixel, pixelToTime } = useTimePixelConverter();

const emits = defineEmits(['update:uses', 'add', 'remove']);

const getLastEndBoundary = (index: number): number => {
	if (index === 0) {
		return 0;
	}

	const previousUse = props.uses[index - 1];

	return previousUse + (props.skill.cooldown);
};

const getNextStartBoundary = (index: number): number | null => {
	if (index === props.uses.length - 1) {
		return null;
	}

	const nextUse = props.uses[index + 1];

	return nextUse;
};

const onUpdateUse = (index: number, newUse: number) => {
	const usesCopy = [...props.uses];
	usesCopy[index] = newUse;
	emits('update:uses', usesCopy);
};

const potentialUseTiming = ref(0);
const isTimelineMouseActive = ref(false);
const isDragging = ref(false);

const fakeTimeline = computed<MitigationTimelineEntry[]>(() => {
	return props.uses.map(timestamp => ({ id: '', mitigationSkillId: props.skill.id, raidGroupMemberId: '', timestamp }));
});

const canAddNewUse = computed(() => {
	return isSkillAvailable(props.skill, potentialUseTiming.value, fakeTimeline.value);
});

const isNewUseVisible = computed(() => {
	return isTimelineMouseActive.value && canAddNewUse.value && !isDragging.value;
});

const timelineRow = ref<HTMLElement>();

const onTimelineMouseMove = (event: MouseEvent) => {
	isTimelineMouseActive.value = true;

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

const addNewUse = () => {
	if (!canAddNewUse.value) {
		return;
	}

	emits('add', potentialUseTiming.value);
};
</script>