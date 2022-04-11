import { mitigationSkills } from "../data/mitigationSkills";
import { MitigationSkillDescription } from "./MitigationSkill";

export enum JobClass {
	SCHOLAR = "SCHOLAR",
	SAGE = "SAGE",
	ASTROLOGIAN = "ASTROLOGIAN",
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
	mitigation: MitigationSkillDescription[];
};

export const jobClasses: Record<JobClass, JobClassDescription> = {
	SCHOLAR: {
		name: 'Scholar',
		type: JobClassType.HEALER,
		mitigation: [
			mitigationSkills.WHISPERING_DAWN,
			mitigationSkills.EXPEDIENT,
			mitigationSkills.FEY_ILLUMINATION,
			mitigationSkills.SACRED_SOIL,
			mitigationSkills.SUMMON_SERAPH,
		],
	},
	SAGE: {
		name: 'Sage',
		type: JobClassType.HEALER,
		mitigation: [
			mitigationSkills.HAIMA,
			mitigationSkills.HOLOS,
			mitigationSkills.IXOCHOLE,
			mitigationSkills.KERACHOLE,
			mitigationSkills.KRASIS,
			mitigationSkills.PANHAIMA,
			mitigationSkills.PHYSIS,
			mitigationSkills.PNEUMA,
			mitigationSkills.SOTERIA,
			mitigationSkills.TAUROCHOLE,
		],
	},
	ASTROLOGIAN: {
		name: 'Astrologian',
		type: JobClassType.HEALER,
		mitigation: [
			mitigationSkills.CELESTIAL_INTERSECTION,
			mitigationSkills.CELESTIAL_OPPOSITION,
			mitigationSkills.COLLECTIVE_UNCONSCIOUS,
			mitigationSkills.EARTHLY_STAR,
			mitigationSkills.ESSENTIAL_DIGNITY,
			mitigationSkills.EXALTATION,
			mitigationSkills.HOROSCOPE,
			mitigationSkills.MACROCOSMOS,
			mitigationSkills.NEUTRAL_SECT,
		],
	},
	WARRIOR: {
		name: 'Warrior',
		type: JobClassType.TANK,
		mitigation: [
		],
	},
	BARD: {
		name: 'Bard',
		type: JobClassType.DPS,
		subType: JobClassSubType.PHYSICAL_RANGE,
		mitigation: [
		],
	}
};