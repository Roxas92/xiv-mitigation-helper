<template>
	<div>
		<div class="text-center text-2xl text-gray-50 py-8">
			Boss Ability Manager
		</div>
		<ul
			role="list"
			class="grid grid-cols-3 gap-4"
		>
			<li
				v-for="ability in abilities"
				:key="ability.id"
				class="bg-gray-800 shadow overflow-hidden rounded-md px-6 py-4"
			>
				<div class="grid grid-cols-1 sm:grid-cols-6">
					<div class="sm:col-span-3 flex items-center">
						<label
							for="name"
							class="block text-sm font-medium text-gray-200 mr-4"
						>
							Name
						</label>
						<div class="mt-1">
							<input
								id="name"
								:value="ability.name"
								type="text"
								name="name"
								autocomplete="address-level2"
								class="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-600 bg-gray-700 rounded-md text-white"
								@input="onUpdateAbilityName(ability, $event)"
							>
						</div>
					</div>

					<div class="sm:col-span-3 flex items-center">
						<label
							for="country"
							class="block text-sm font-medium text-gray-200 mr-4"
						>
							Type
						</label>
						<div class="mt-1 sm:col-span-2">
							<select
								id="country"
								:value="ability.type"
								name="country"
								autocomplete="country-name"
								class="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-600 bg-gray-700 rounded-md text-white"
								@input="onUpdateAbilityType(ability, $event)"
							>
								<option>tankbuster</option>
								<option>raidwide</option>
								<option>misc</option>
							</select>
						</div>
					</div>
				</div>
			</li>
		</ul>
	</div>
</template>

<script lang="ts" setup>
import { PropType } from 'vue';
import { updateAbilityName, updateAbilityType, EncounterAbility, EncounterAbilityType } from '../models/EncounterAbility';

const props = defineProps({
	abilities: {
		type: Array as PropType<EncounterAbility[]>,
		required: true,
	}
});

const emits = defineEmits<{
	(e: 'update:abilities', abilities: EncounterAbility[]): void
}>();

const onUpdateAbilityName = (ability: EncounterAbility, inputEvent: Event) => {
	const newName = (inputEvent.target as HTMLInputElement).value;
	const newAbilities = updateAbilityName(props.abilities, ability.id, newName);
	emits('update:abilities', newAbilities);
};

const onUpdateAbilityType = (ability: EncounterAbility, inputEvent: Event) => {
	const newType = (inputEvent.target as HTMLInputElement).value as EncounterAbilityType;
	const newAbilities = updateAbilityType(props.abilities, ability.id, newType);
	emits('update:abilities', newAbilities);
};
</script>