import { v4 as uuidv4 } from 'uuid';
import { EncounterAbility } from './EncounterAbility';
import { sortTimelineByTimestamp, TimelineEntry } from './Timeline';

export interface BossFightOptions {
	id?: string;
	name?: string;
	timeline?: EncounterTimelineEntry[];
}

export type EncounterTimelineEntry = TimelineEntry & { abilityId: string };

export interface Encounter {
	id: string;
	name: string;
	timeline: EncounterTimelineEntry[];
	abilities: EncounterAbility[];
}

export const createEncounter = (options?: Partial<Encounter>): Encounter => {
	const newEncounter: Encounter = {
		id: options?.id || uuidv4(),
		name: options?.name || 'New unnamed boss fight',
		timeline: sortTimelineByTimestamp(options?.timeline || []),
		abilities: options?.abilities || [],
	};

	return newEncounter;
};

export const addAbilityToTimeline = (timeline: EncounterTimelineEntry[], ability: EncounterAbility, timestamp: number): EncounterTimelineEntry[] => {
	const id = uuidv4();

	const timelinedBossAbility: EncounterTimelineEntry = { timestamp, id, abilityId: ability.id };

	const newTimeline = sortTimelineByTimestamp([...timeline, timelinedBossAbility]);

	return newTimeline;
};