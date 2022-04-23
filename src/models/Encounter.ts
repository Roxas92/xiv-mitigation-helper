import { v4 as uuidv4 } from 'uuid';
import { sortTimelineByTimestamp, TimelineEntry } from './Timeline';

export type BossAbilityType = 'tankbuster' | 'raidwide' | 'misc';

export type BossAbility = {
	id: string;
	name: string;
	type?: BossAbilityType;
};

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
	abilities: BossAbility[];
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

export const getDuration = (encounter: Encounter): number => {
	const lastTimelineEntry = encounter.timeline[encounter.timeline.length - 1];
	return lastTimelineEntry.timestamp;
};

export const maybeAddAbility = (encounter: Encounter, ability: BossAbility) => {
	if (!encounter.abilities.find(a => a.id === ability.id)) {
		encounter.abilities = [...encounter.abilities, ability];
	}
};

export const createBossAbility = (name: string, type: BossAbilityType = 'misc'): BossAbility => {
	return {
		id: uuidv4(),
		name,
		type
	};
};

export const addAbilityToTimeline = (encounter: Encounter, ability: BossAbility, timestamp: number): void => {
	const id = uuidv4();

	maybeAddAbility(encounter, ability);

	const timelinedBossAbility: EncounterTimelineEntry = { timestamp, id, abilityId: ability.id };

	const newTimeline = sortTimelineByTimestamp([...encounter.timeline, timelinedBossAbility]);

	encounter.timeline = newTimeline;
};

export const removeAbilityFromTimelineById = (encounter: Encounter, id: string): void => {
	const index = encounter.timeline.findIndex(item => item.id === id);

	if (index > -1) {
		encounter.timeline.splice(index, 1);
	}
};

export const updateTimelineEntry = (encounter: Encounter, id: string, timestamp: number): void => {
	const index = encounter.timeline.findIndex(entry => entry.id === id);
	encounter.timeline[index].timestamp = timestamp;
	encounter.timeline = sortTimelineByTimestamp(encounter.timeline);
};

export const getAbilityById = (encounter: Encounter, id: string): BossAbility | null => {
	return encounter.abilities.find(a => a.id === id) ?? null;
};