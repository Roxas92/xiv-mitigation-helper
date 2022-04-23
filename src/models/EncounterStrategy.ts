import { v4 as uuidv4 } from 'uuid';
import { mitigationSkills } from '../data/mitigationSkills';
import { getClosestEntriesByValue } from '../utilities/helpers';
import { MitigationSkill, MitigationSkillDescription } from "./MitigationSkill";
import { RaidGroupMember } from './RaidGroup';
import { sortTimelineByTimestamp, TimelineEntry } from './Timeline';

export type StrategyTimelineEntry = TimelineEntry & {
	mitigationSkillId: MitigationSkill;
	raidGroupMemberId: string;
};

export interface EncounterStrategy {
	id: string;
	raidGroupId: string;
	bossFightId: string;
	timeline: StrategyTimelineEntry[];
}

export interface EncounterStrategyError {
	id: string;
	message: string;
}

export type EncounterStrategyOptions = Partial<EncounterStrategy> & Omit<EncounterStrategy, 'id'>;

export const createEncounterStrategy = (options: EncounterStrategyOptions): EncounterStrategy => {
	return {
		id: options.id || uuidv4(),
		raidGroupId: options.raidGroupId,
		bossFightId: options.bossFightId,
		timeline: sortTimelineByTimestamp(options.timeline) || [],
	};
};

export const getTimelineGroupedByMembers = (strategy: EncounterStrategy): Record<string, StrategyTimelineEntry[]> => {
	return strategy.timeline.reduce((group, entry) => {
		const groupCopy = { ...group };

		if (!groupCopy.hasOwnProperty(entry.raidGroupMemberId)) {
			groupCopy[entry.raidGroupMemberId] = [entry];
		} else {
			groupCopy[entry.raidGroupMemberId].push(entry);
		}

		return groupCopy;
	}, {} as Record<string, StrategyTimelineEntry[]>);
};

export const getTimelineGroupedByMembersAndSkills = (strategy: EncounterStrategy) => {
	const timelineGroupedByMembers = getTimelineGroupedByMembers(strategy);

	const timelineGroupedByMembersAndSkills = Object.keys(timelineGroupedByMembers).reduce((group, memberId) => {
		const skills = [...new Set(timelineGroupedByMembers[memberId].map(entry => entry.mitigationSkillId))];
		const mappedSkills = skills.map(skill => timelineGroupedByMembers[memberId].filter(entry => entry.mitigationSkillId === skill));

		return {
			...group,
			[memberId]: mappedSkills,
		};
	}, {} as Record<string, StrategyTimelineEntry[][]>);

	return timelineGroupedByMembersAndSkills;
};

export const isSkillTimelineValid = (skillTimeline: StrategyTimelineEntry[]): boolean => {
	return skillTimeline.every((entry, index, array) => {
		if (index === 0) {
			return true;
		}
        
		const previousExecution = array[index - 1];
		const mitigationSkill = mitigationSkills[entry.mitigationSkillId];
		const cooldownInSeconds = mitigationSkill.cooldown;
		const skillReadyTime = previousExecution.timestamp + cooldownInSeconds;

		return entry.timestamp > skillReadyTime;
	});
};

export const isMembersTimelineValid = (skillExecutions: StrategyTimelineEntry[][]): boolean => {
	return Object.values(skillExecutions).some(isSkillTimelineValid);
};

export const toError = (errors: EncounterStrategyError[], [memberId, skillExecutions]: [string, StrategyTimelineEntry[][]]): EncounterStrategyError[] => {
	if (!isMembersTimelineValid(skillExecutions)) {
		return [
			...errors,
			{ id: memberId, message: 'Not valid' }
		];
	}

	return errors;
};

export const getTimelineErrors = (strategy: EncounterStrategy): EncounterStrategyError[]  => {
	const groupedTimeline = getTimelineGroupedByMembersAndSkills(strategy);

	return Object.entries(groupedTimeline).reduce(toError, []);
};

export const getAllSkillExecutions = (timeline: StrategyTimelineEntry[], skillId: MitigationSkill): StrategyTimelineEntry[] => {
	return timeline.filter(timelineEntry => timelineEntry.mitigationSkillId === skillId);
};

export const getAllSkillExecutionsForMember = (timeline: StrategyTimelineEntry[], memberId: string): StrategyTimelineEntry[] => {
	return timeline.filter(timelineEntry => timelineEntry.raidGroupMemberId === memberId);
};

export const getSkillExectionsForMember = (timeline: StrategyTimelineEntry[], skillId: MitigationSkill, memberId: string): StrategyTimelineEntry[] => {
	const filteredEntries = getAllSkillExecutionsForMember(timeline, memberId);
	return filteredEntries.filter(timelineEntry => timelineEntry.mitigationSkillId === skillId);
};

export const isSkillAvailable = (skill: MitigationSkillDescription, time: number, timeline: StrategyTimelineEntry[]): boolean => {
	const cooldownInSeconds = skill.cooldown;
	const allExections = getAllSkillExecutions(timeline, skill.id);

	if (allExections.length < 1) {
		return true;
	}

	if (allExections.some(execution => execution.timestamp === time)) {
		return false;
	}

	if (allExections.length === 1) {
		const execution = allExections[0];

		if (time < execution.timestamp) {
			return time < execution.timestamp - cooldownInSeconds;
		} else {
			return time > execution.timestamp + cooldownInSeconds;
		}
	}

	const [previousExection, nextExecution] = getClosestEntriesByValue(time, allExections, 'timestamp');

	if (previousExection && time < previousExection.timestamp + cooldownInSeconds) {
		return false;
	}

	if (nextExecution && time > nextExecution.timestamp - cooldownInSeconds) {
		return false;
	}

	return true;
};

export const addMitigation = (strategy: EncounterStrategy, skill: MitigationSkillDescription, member: RaidGroupMember, timestamp: number): void => {
	const id = uuidv4();

	const mitigation: StrategyTimelineEntry = { 
		id,
		timestamp,
		mitigationSkillId: skill.id,
		raidGroupMemberId: member.id,
	};

	const newTimeline = sortTimelineByTimestamp([...strategy.timeline, mitigation]);

	strategy.timeline = newTimeline;
};

export const removeMitigation = (strategy: EncounterStrategy, id: string): void => {
	const index = strategy.timeline.findIndex(item => item.id === id);

	if (index > -1) {
		strategy.timeline.splice(index, 1);
	}
};

export const updateMitigationTimestamp = (strategy: EncounterStrategy, id: string, timestamp: number): void => {
	const index = strategy.timeline.findIndex(item => item.id === id);

	strategy.timeline[index].timestamp = timestamp;
};