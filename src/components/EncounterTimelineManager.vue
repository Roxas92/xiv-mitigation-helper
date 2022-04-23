<template>
	<div>
		<div class="text-center text-2xl text-gray-50 py-8">
			Encounter Timeline Manager
		</div>
		<ul
			role="list"
			class="grid gap-4 w-96"
		>
			<li
				v-for="entry in timeline"
				:key="entry.id"
				class="bg-gray-800 shadow overflow-hidden rounded-md px-6 py-4"
			>
				<div class="grid grid-cols-1 sm:grid-cols-6">
					<div class="sm:col-span-3 flex items-center">
						<div class="text-white">
							{{ getAbilityName(entry) }}
						</div>
					</div>

					<div class="sm:col-span-3 flex items-center">
						<label
							for="timestamp"
							class="block text-sm font-medium text-gray-200 mr-4"
						>
							@
						</label>
						<div class="sm:col-span-2 ">
							<input
								id="timestamp"
								:value="entry.timestamp"
								type="number"
								name="timestamp"
								class="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-20 sm:text-sm border-gray-600 bg-gray-700 rounded-md text-white"
								@input="updateEntryTimestamp(entry, $event)"
							>
						</div>
						<span class="block text-sm font-medium text-gray-200 ml-4">
							seconds
						</span>
					</div>
				</div>
			</li>
		</ul>
	</div>
</template>

<script lang="ts" setup>
import { PropType } from 'vue';
import { EncounterTimelineEntry } from '../models/Encounter';
import { EncounterAbility, getAbilityById } from '../models/EncounterAbility';
import { updateTimelineEntry } from '../models/Timeline';

const props = defineProps({
	timeline: {
		type: Array as PropType<EncounterTimelineEntry[]>,
		required: true,
	},
	abilities: {
		type: Array as PropType<EncounterAbility[]>,
		required: true,
	}
});

const emits = defineEmits<{
	(e: 'update:timeline', timeline: EncounterTimelineEntry[]): void
}>();

const updateEntryTimestamp = (entry: EncounterTimelineEntry, inputEvent: Event) => {
	const newTimestamp = parseInt((inputEvent.target as HTMLInputElement).value);
	const newTimeline = updateTimelineEntry(props.timeline, entry.id, newTimestamp);
	emits('update:timeline', newTimeline);
};

const getAbilityName = (entry: EncounterTimelineEntry): string => {
	return getAbilityById(props.abilities, entry.abilityId)?.name ?? entry.abilityId;
};
</script>