import { BossAbility, EncounterTimelineEntry } from "../models/Encounter";

export const sampleBossAbilities: BossAbility[] = [
	{
		id: 'decollation',
		name: 'Decollation',
		type: 'tankbuster',
	},
	{
		id: 'bloodrake',
		name: 'Bloodrake',
		type: 'raidwide',
	}
];

export const sampleBossTimeline: EncounterTimelineEntry[] = [
	{
		id: '2a',
		abilityId: 'decollation',
		timestamp: 14,
	},
	{
		id: '2b',
		abilityId: 'bloodrake',
		timestamp: 32,
	},
	{
		id: '2c',
		abilityId: 'decollation',
		timestamp: 72,
	},
	{
		id: '5b',
		abilityId: 'bloodrake',
		timestamp: 133,
	},
	{
		id: '6b',
		abilityId: 'bloodrake',
		timestamp: 250,
	},
];