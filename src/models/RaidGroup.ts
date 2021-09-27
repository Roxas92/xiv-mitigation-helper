import { v4 as uuidv4 } from 'uuid';
import { JobClass, jobClasses, JobClassType } from "./JobClass";
import { MitigationSkill } from './MitigationSkill';
import type { Ref } from 'vue';
import { ref } from 'vue';

export const REQUIRED_JOB_CLASS_TYPE: Record<JobClassType, number> = {
	TANK: 2,
	HEALER: 2,
	DPS: 4
} as const;

export type FullRaidGroup = [
	JobClassType.TANK,
	JobClassType.TANK,
	JobClassType.HEALER,
	JobClassType.HEALER,
	JobClassType.DPS,
	JobClassType.DPS,
	JobClassType.DPS,
	JobClassType.DPS,
];

export type RaidGroupMember = { id: string, jobClass: JobClass };

export interface RaidGroup {
	id: string;
	members: Ref<RaidGroupMember[]>;
	errors: Ref<string[]>;
	addNewGroupMember(jobClass: JobClass, id?: string): void;
	removeGroupMemberByID(groupMemberId: string): void;
	getAvailableMitigation(): Record<string, MitigationSkill[]>;
}

export const createRaidGroup = (id?: string, members?: RaidGroupMember[]): RaidGroup => {
	const groupId = ref(id || uuidv4());
	const groupMembers = ref(members || []);
	const errors = ref<string[]>([]);

	const validateGroupMembers = (): boolean => {
		errors.value = [];
        
		const validation = Object.values(JobClassType).map(type => {
			const requiredCount = REQUIRED_JOB_CLASS_TYPE[type];
			const actualCount = groupMembers.value.filter(member => {
				const description = jobClasses[member.jobClass];
				return description.type === type;
			}).length;

			if (actualCount < requiredCount) {
				errors.value.push(`This raid group needs '${requiredCount - actualCount}' more ${type}`);
				return false;
			}

			if (actualCount > requiredCount) {
				errors.value.push(`This raid group has '${Math.abs(requiredCount - actualCount)}' of type ${type} too much`);
				return false;
			}

			return true;
		});

		return validation.some(entry => !!entry);
	};

	const addNewGroupMember = (jobClass: JobClass, groupMemberId?: string) => {
		const newGroupMemberId = groupMemberId || uuidv4();
		const newGroupMember = { id: newGroupMemberId, jobClass };

		groupMembers.value.push(newGroupMember);
		validateGroupMembers();
	};

	const removeGroupMemberByID = (groupMemberId: string) => {
		const index = groupMembers.value.findIndex(member => member.id === groupMemberId);

		if (index > -1) {
			groupMembers.value.splice(index, 1);
		}

		validateGroupMembers();
	};

	const getAvailableMitigation = (): Record<string, MitigationSkill[]> => {
		const availableMitigation: Record<string, MitigationSkill[]> = {};

		groupMembers.value.forEach(member => {
			const jobClass = jobClasses[member.jobClass];
			const membersMitigation = jobClass.mitigation;

			availableMitigation[member.id] = membersMitigation;
		});

		return availableMitigation;
	};

	validateGroupMembers();

	return {
		id: groupId.value,
		members: groupMembers,
		errors,
		addNewGroupMember,
		removeGroupMemberByID,
		getAvailableMitigation,
	};
};
