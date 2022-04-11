<template>
	<div class="text-center text-2xl text-gray-50 py-8">
		{{ encounter.name }}
	</div>
	<div class="fixed bottom-0 w-full">
		<div class="bg-gray-800 p-4">
			<label class="text-gray-200 mr-4">Scaling</label>
			<input
				v-model="pixelSecondRatio"
				type="number"
				class="w-14 bg-gray-700 text-gray-200 px-2"
			>
		</div>
	</div>
	<div
		ref="scrollContainer"
		class="px-4 relative space-y-2 overflow-auto scroll"
		@wheel="onWheel"
	>
		<div class="flex pl-48">
			<div
				v-for="label in timeLabels"
				:key="label"
				class="relative h-12"
				:style="{
					'marginRight': `${timeToPixel(SECOND_UNIT)}px`
				}"
			>
				<div class="absolute w-[1px] h-4 bg-gray-600 bottom-0" />
				<div class="absolute text-gray-600 transform -translate-x-1/2">
					{{ label }}
				</div>
			</div>
		</div>
		<div
			v-for="(skills, character) in groupsMitigation"
			:key="character"
			class="space-y-1"
		>
			<TimelineRow
				v-for="skill in skills"
				:key="skill.id"
				:skill="skill"
				:uses="getAllSkillExecutions(skill.id, character).map(entry => entry.timestamp)"
				:duration="getDuration(encounter)"
				@update:uses="onUpdateUses(skill.id, character, $event)"
				@add="addNewExecution(skill, character, $event)"
				@remove="removeExecution(skill, character, $event)"
			/>
		</div>
		<EncounterAbilityRow v-model:encounter="encounter" />
	</div>
</template>

<script lang="ts" setup>
import { computed, reactive, ref } from 'vue';
import { JobClass } from '../models/JobClass';
import { createRaidGroup } from '../models/RaidGroup';
import TimelineRow from '../components/TimelineRow.vue';
import { MitigationStrategy, getSkillExectionsForMember } from '../models/MitigationStrategy';
import { MitigationSkill, MitigationSkillDescription } from '../models/MitigationSkill';
import { useTimePixelConverter } from '../composables/useTimePixelConverter';
import { sampleBossTimeline } from '../data/sampleData';
import { secondsToMMSS } from '../utilities/helpers';
import { createEncounter, getDuration } from '../models/Encounter';
import EncounterAbilityRow from '../components/EncounterAbilityRow.vue';

const group = createRaidGroup('pepebringers', [
	{ id: 'Roxas', 'jobClass': JobClass.ASTROLOGIAN },
	{ id: 'Azena', 'jobClass': JobClass.SAGE }
]);

const mitigationStrategy = reactive(new MitigationStrategy({
	raidGroupId: group.id,
	bossFightId: 'DSR',
	mitigationTimeline: []
}));

const encounter = reactive(createEncounter({
	timeline: sampleBossTimeline,
}));

const SECOND_UNIT = 15;

const timeLabels = computed(() => {
	const labels = [];

	const units = Math.floor(getDuration(encounter) / SECOND_UNIT);

	let remainingUnits = units;

	while(remainingUnits >= 0) {
		const seconds = remainingUnits * SECOND_UNIT;
		const label = secondsToMMSS(seconds);
		labels.push(label);
		remainingUnits = remainingUnits - 1;
	}

	labels.reverse();

	return labels;
});

const getAllSkillExecutions = (skillId: MitigationSkill, memberId: string) => {
	return getSkillExectionsForMember(mitigationStrategy.timeline, skillId, memberId);
};

const groupsMitigation = computed(() => {
	return group.getAvailableMitigation();
});

const onUpdateUses = (skillId: MitigationSkill, memberId: string, uses: number[]) => {
	const allExecutionsIds = getAllSkillExecutions(skillId, memberId).map(entry => entry.id);

	allExecutionsIds.forEach((id, index) => {
		mitigationStrategy.updateMitigationTimestamp(id, uses[index]);
	});
};

const addNewExecution = (skill: MitigationSkillDescription, memberId: string, timestamp: number) => {
	const member = group.members.value.find(m => m.id === memberId);

	if (!member) {
		return;
	}

	mitigationStrategy.addMitigation(skill, member, timestamp);
};

const removeExecution = (skill: MitigationSkillDescription, memberId: string, timestamp: number) => {
	const mitigation = mitigationStrategy.timeline.find(entry => entry.mitigationSkillId === skill.id && entry.raidGroupMemberId === memberId && entry.timestamp === timestamp);

	if (!mitigation) {
		return;
	}

	mitigationStrategy.removeMitigation(mitigation.id);
};

const { timeToPixel, pixelSecondRatio } = useTimePixelConverter();

const scrollContainer = ref<HTMLElement>();

const onWheel = (event: WheelEvent) => {
	event.preventDefault();

	if (!scrollContainer.value) {
		return;
	}

	scrollContainer.value.scrollLeft += event.deltaY;
};
</script>

<style scoped>
/* width */
::-webkit-scrollbar {
  height: 6px !important;
  scrollbar-width: 6px !important;
}

/* Track */
::-webkit-scrollbar-track {
  background: transparent !important;
}

/* Handle */
::-webkit-scrollbar-thumb {
    @apply bg-gray-700;
    @apply rounded-full;
  scrollbar-color: #D4CBE4 !important;
}

/* Handle on hover */
::-webkit-scrollbar-thumb:hover {
    @apply bg-gray-500;
  scrollbar-color: #D4CBE4 !important;
}
</style>