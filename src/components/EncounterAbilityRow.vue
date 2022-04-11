<template>
	<div class="z-20 h-16">
		<div class="absolute ml-48 h-full top-0">
			<EncounterAbilityItem
				v-for="entry in encounter.timeline"
				:key="entry.timestamp"
				:entry="entry"
				@update:timestamp="updateTimelineEntryForEncounter(entry, $event)"
				@dblclick="removeTimelineEntryForEncounter(entry)"
			/>
		</div>
	</div>
</template>

<script lang="ts" setup>
import { PropType } from 'vue';
import { Encounter, TimelineEntry, updateTimelineEntry, removeAbilityFromTimelineById } from '../models/Encounter';
import EncounterAbilityItem from './EncounterAbilityItem.vue';

const props = defineProps({
	encounter: {
		type: Object as PropType<Encounter>,
		required: true,
	}
});

const emits = defineEmits<{
	(e: 'update:encounter', encounter: Encounter): void
}>();

const updateTimelineEntryForEncounter = (entry: TimelineEntry, timestamp: number) => {
	const newEncounter = { ...props.encounter };
	updateTimelineEntry(newEncounter, entry.id,  timestamp);
	emits('update:encounter', newEncounter);
};

const removeTimelineEntryForEncounter = (entry: TimelineEntry) => {
	const newEncounter = { ...props.encounter };
	removeAbilityFromTimelineById(newEncounter, entry.id);
	emits('update:encounter', newEncounter);
};
</script>