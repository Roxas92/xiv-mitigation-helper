import { MitigationSkill } from "../models/MitigationSkill";

export const mitigationSkills: Record<number, MitigationSkill> = {
	1: {
		id: 1,
		cooldownInMS: 30000,
		name: 'Sacred Soil'
	},
	2: {
		id: 2,
		cooldownInMS: 30000,
		name: 'Shake it off'
	},
	3: {
		id: 3,
		cooldownInMS: 120000,
		name: 'Bard skill'
	},
	4: {
		id: 4,
		cooldownInMS: 90000,
		name: 'Fey Illumination'
	},
};