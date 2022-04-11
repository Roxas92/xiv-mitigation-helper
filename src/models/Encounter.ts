import { v4 as uuidv4 } from 'uuid';

export type BossAbility = {
	name: string;
};

export interface BossFightOptions {
	id?: string;
	name?: string;
	timeline?: TimelineEntry[];
}

export type TimelineEntry = { timestamp: number, id: string, ability: BossAbility };

export interface Encounter {
	id: string;
	name: string;
	timeline: TimelineEntry[];
}

export const sortTimelineByTimestamp = (timeline: TimelineEntry[]): TimelineEntry[] => {
	return [...timeline].sort((a, b) => {
		if (a.timestamp < b.timestamp) {
			return -1;
		}

		if (a.timestamp > b.timestamp) {
			return 1;
		}

		return 0;
	});
};

export const createEncounter = (options: Partial<Encounter>): Encounter => {
	const newEncounter: Encounter = {
		id: options?.id || uuidv4(),
		name: options?.name || 'New unnamed boss fight',
		timeline: sortTimelineByTimestamp(options?.timeline || []),
	};

	return newEncounter;
};

export const getDuration = (encounter: Encounter): number => {
	const lastTimelineEntry = encounter.timeline[encounter.timeline.length - 1];
	return lastTimelineEntry.timestamp;
};

export const addAbilityToTimeline = (encounter: Encounter, ability: BossAbility, timestamp: number): void => {
	const id = uuidv4();
	const timelinedBossAbility: TimelineEntry = { timestamp, id, ability };

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