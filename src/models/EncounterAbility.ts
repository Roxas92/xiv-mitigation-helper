import { v4 as uuidv4 } from 'uuid';

export type EncounterAbilityType = 'tankbuster' | 'raidwide' | 'misc';

export type EncounterAbility = {
	id: string;
	name: string;
	type?: EncounterAbilityType;
};

export const createEncounterAbility = (name: string, type: EncounterAbilityType = 'misc'): EncounterAbility => {
	return {
		id: uuidv4(),
		name,
		type
	};
};

export const maybeAddAbility = (abilities: EncounterAbility[], ability: EncounterAbility): EncounterAbility[] => {
	if (!abilities.find(a => a.id === ability.id)) {
		return [...abilities, ability];
	}

	return abilities;
};

export const getAbilityById = (abilities: EncounterAbility[], id: string): EncounterAbility | null => {
	return abilities.find(a => a.id === id) ?? null;
};

export const updateAbilityName = (abilities: EncounterAbility[], id: string, name: string): EncounterAbility[] => {
	const abilitiesCopy = [...abilities];
	const index = abilitiesCopy.findIndex(entry => entry.id === id);
    
	abilitiesCopy[index] = { ...abilitiesCopy[index], name };

	return abilitiesCopy;
};

export const updateAbilityType = (abilities: EncounterAbility[], id: string, type: EncounterAbilityType): EncounterAbility[] => {
	const abilitiesCopy = [...abilities];
	const index = abilitiesCopy.findIndex(entry => entry.id === id);
    
	abilitiesCopy[index] = { ...abilitiesCopy[index], type };

	return abilitiesCopy;
};