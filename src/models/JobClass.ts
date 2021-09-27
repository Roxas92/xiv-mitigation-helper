import { mitigationSkills } from "../data/mitigationSkills";
import { MitigationSkill } from "./MitigationSkill";

export enum JobClass {
	SCHOLAR = "SCHOLAR",
	WARRIOR = "WARRIOR",
	BARD = "BARD",
}

export enum JobClassType {
	TANK = "TANK",
	HEALER = "HEALER",
	DPS = "DPS",
}

export enum JobClassSubType {
	MELEE = "MELEE",
	PHYSICAL_RANGE = "PHYSICAL_RANGE",
	MAGICAL_RANGE = "MAGICAL_RANGE",
}

export type JobClassDescription = {
	name: string;
	type: JobClassType,
	subType?: JobClassSubType,
	mitigation: MitigationSkill[];
};

export const jobClasses: Record<JobClass, JobClassDescription> = {
	SCHOLAR: {
		name: 'Scholar',
		type: JobClassType.HEALER,
		mitigation: [
			mitigationSkills[1],
			mitigationSkills[4],
		],
	},
	WARRIOR: {
		name: 'Warrior',
		type: JobClassType.TANK,
		mitigation: [
			mitigationSkills[2],
		],
	},
	BARD: {
		name: 'Bard',
		type: JobClassType.DPS,
		subType: JobClassSubType.PHYSICAL_RANGE,
		mitigation: [
			mitigationSkills[3],
		],
	}
};