export type MitigationSkill = {
	id: number;
	name: string;
	cooldownInMS: number;
};

export type MitigationSkillOnCooldown = MitigationSkill & { remainingCooldownInMS: number };