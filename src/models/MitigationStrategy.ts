import { v4 as uuidv4 } from 'uuid';
import { mitigationSkills } from '../data/mitigationSkills';
import { getClosestEntriesByValue } from '../utilities/helpers';
import { MitigationSkill } from './MitigationSkill';
import { RaidGroupMember } from './RaidGroup';

export interface MitigationStrategyOptions {
	id?: string;
	raidGroupId: string;
	bossFightId: string;
	mitigationTimeline?: MitigationTimelineEntry[];
}

export type MitigationTimelineEntry = { timestamp: number, id: string, mitigationSkillId: number, raidGroupMemberId: string };

export type MitigationTimelineSkillGroup = MitigationTimelineEntry[];

export type MitigationTimelineError = { id: string; message: string };

export class MitigationStrategy {
	id: string;
	raidGroupId: string;
	bossFightId: string;
	timeline: MitigationTimelineEntry[];
	errors: MitigationTimelineError[] = [];

	constructor(options: MitigationStrategyOptions) {
		this.id = options.id || uuidv4();
		this.raidGroupId = options.raidGroupId;
		this.bossFightId = options.bossFightId;
		this.timeline = options.mitigationTimeline || [];

		this.sortTimelineByTimestamp();
		this.validateTimeline();
	}

	getTimelineGroupedByMembersAndSkills() {
		const groupedByMembers = this.timeline.reduce((group, entry) => {
			const groupCopy = { ...group };

			if (!groupCopy.hasOwnProperty(entry.raidGroupMemberId)) {
				groupCopy[entry.raidGroupMemberId] = [entry];
			} else {
				groupCopy[entry.raidGroupMemberId].push(entry);
			}

			return groupCopy;
		}, {} as Record<string, MitigationTimelineEntry[]>);

		const groupedByMembersAndSkills = Object.keys(groupedByMembers).reduce((group, memberId) => {
			const groupCopy = { ...group };
			const skills = [...new Set(groupedByMembers[memberId].map(entry => entry.mitigationSkillId))];
			const mappedSkills = skills.map(skill => groupedByMembers[memberId].filter(entry => entry.mitigationSkillId === skill));

			groupCopy[memberId] = mappedSkills;

			return groupCopy;
		}, {} as Record<string, MitigationTimelineSkillGroup[]>);

		return groupedByMembersAndSkills;
	}

	private sortTimelineByTimestamp() {
		this.timeline.sort((a, b) => {
			if (a.timestamp < b.timestamp) {
				return -1;
			}

			if (a.timestamp > b.timestamp) {
				return 1;
			}

			return 0;
		});
	}

	private validateTimeline() {
		this.errors = [];
		const groupedTimeline = this.getTimelineGroupedByMembersAndSkills();

		Object.entries(groupedTimeline).forEach(([memberId, skillExecutions]) => {
			const isValid = Object.values(skillExecutions).some((skill) => skill.every((entry, index, array) => {
				if (index === 0) {
					return true;
				}
                
				const previousExecution = array[index - 1];
				const mitigationSkill = mitigationSkills[entry.mitigationSkillId];
				const cooldownInSeconds = mitigationSkill.cooldownInMS / 1000;
				const skillReadyTime = previousExecution.timestamp + cooldownInSeconds;

				return entry.timestamp > skillReadyTime;
			}));

			if (!isValid) {
				this.errors.push({ id: memberId, message: 'Not valid' });
			}
		});
	}

	addMitigation(skill: MitigationSkill, member: RaidGroupMember, timestamp: number): MitigationStrategy {
		const id = uuidv4();

		const mitigation: MitigationTimelineEntry = { 
			id,
			timestamp,
			mitigationSkillId: skill.id,
			raidGroupMemberId: member.id,
		};

		this.timeline.push(mitigation);
		this.sortTimelineByTimestamp();
		this.validateTimeline();

		return this;
	}

	removeMitigation(id: string): MitigationStrategy {
		const index = this.timeline.findIndex(item => item.id === id);

		if (index > -1) {
			this.timeline.splice(index, 1);
		}

		this.validateTimeline();

		return this;
	}
}

export const getAllSkillExecutions = (timeline: MitigationTimelineEntry[], skillId: number): MitigationTimelineEntry[] => {
	return timeline.filter(timelineEntry => timelineEntry.mitigationSkillId === skillId);
};

export const isSkillAvailable = (skill: MitigationSkill, time: number, timeline: MitigationTimelineEntry[]): boolean => {
	const cooldownInSeconds = skill.cooldownInMS / 1000;
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