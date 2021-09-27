<template>
	<div class="w-[800px] mx-auto py-8">
		<div class="text-2xl text-white mb-8">
			FFXIV Mitigation Helper
		</div>
		<div class="space-y-4">
			<div class="bg-gray-600 rounded p-8">
				<div class="text-xl font-bold text-gray-100 mb-4">
					Job Classes
				</div>
				<div class="grid grid-cols-3 gap-4">
					<button
						v-for="(jobClass, key) in availableJobsClasses"
						:key="key"
						class="bg-gray-500 rounded p-4 hover:bg-gray-400"
						@click="addJobClassToRaidGroup(key)"
					>
						{{ jobClass.name }}
					</button>
				</div>
			</div>
			<div class="bg-gray-600 rounded p-8">
				<div class="text-xl font-bold text-gray-100 mb-4">
					Your Raid Group
				</div>
				<div class="space-y-2 mb-4">
					<button
						v-for="(member, key) in group.members.value"
						:key="key"
						class=" p-3 rounded w-full"
						:class="{
							'bg-blue-400 text-blue-800 hover:bg-blue-500': jobClasses[member.jobClass].type === JobClassType.TANK,
							'bg-green-400 text-green-800 hover:bg-green-500': jobClasses[member.jobClass].type === JobClassType.HEALER,
							'bg-red-400 text-red-900 hover:bg-red-500': jobClasses[member.jobClass].type === JobClassType.DPS,
						}"
						@click="group.removeGroupMemberByID(member.id)"
					>
						{{ member }}
					</button>
				</div>
				<div
					v-if="group.errors.value.length > 0"
					class="space-y-2"
				>
					<div
						v-for="(error, key) in group.errors.value"
						:key="key"
						class="bg-yellow-300 p-3 rounded text-yellow-800"
					>
						{{ error }}
					</div>
				</div>
				<div
					v-if="Object.keys(group.getAvailableMitigation()).length > 0"
					class="border-t border-solid border-gray-200 mt-6 pt-6"
				>
					<div class="text-lg font-bold text-gray-100 mb-4">
						Available Mitigation
					</div>
					<div
						v-for="(skill, key) in group.getAvailableMitigation()"
						:key="key"
					>
						{{ skill }}
					</div>
				</div>
			</div>
			<div class="bg-gray-600 rounded p-8">
				<div class="flex space-x-4 mb-4">
					<div class="text-xl font-bold text-gray-100">
						Boss Fight:
					</div>
					<input
						v-model="bossFight.name"
						class="bg-transparent flex-1 text-gray-100"
					>
				</div>
				<div class="space-y-2 mb-4">
					<button
						v-for="(entry, key) in bossFight.timeline"
						:key="key"
						class=" p-3 rounded w-full bg-gray-500"
						@click="bossFight.removeAbilityFromTimelineByID(entry.id)"
					>
						{{ entry.ability.name }} @ {{ entry.timestamp }} seconds
					</button>
				</div>
				<div class="flex space-x-4">
					<input
						v-model="newBossAbilityName"
						placeholder="Name of the ability"
					>
					<div class="flex space-x-2">
						<TimeInput v-model="newBossAbilityTime" />
					</div>
					<button @click="addAbilityToBossFight">
						Add ability
					</button>
				</div>
			</div>
			<div
				ref="timelineWrapperRef"
				class="relative w-full grid"
				@mousemove="onTimelineMouseMove"
				@mouseleave="onTimelineMouseOut"
			>
				<div class="w-1 mx-auto bg-gray-800 rounded h-full row-start-1 col-start-1" />
				<div
					class="w-full h-px border-t border-dashed border-gray-800 rounded absolute transform-gpu translate-y-0"
					:class="{ 'opacity-0': !isTimelineMouseActive }"
					:style="{ '--tw-translate-y': `${timelineMousePosition.y}px` }"
				/>
				<div
					class="absolute transform-gpu translate-y-0 z-10 right-0"
					:style="{ '--tw-translate-y': `${timelineMousePosition.y}px` }"
				>
					<div
						ref="mitigationPopoverRef"
						class="w-96 bg-gray-400 rounded transform-gpu -translate-y-1/2 p-4"
						:class="{ 'opacity-0': !isTimelineMouseActive }"
						@mouseenter="onMitigationPopoverEnter"
						@mouseleave="onMitigationPopoverLeave"
					>
						{{ timelinePositionInSeconds }}
						<div
							v-for="(mitigationSkills, memberId) in availableMitigationForTimelinePosition"
							:key="memberId"
							class="space-y-2"
						>
							<button
								v-for="skill in mitigationSkills"
								:key="skill.id"
								class="bg-gray-50 p-4 block w-full"
								@click="addMitigationSkillOnCurrentPosition(skill, memberId)"
							>
								{{ skill.name }}
							</button>
						</div>
					</div>
				</div>
				<div
					class="row-start-1 col-start-1 relative"
					:style="{ height: `${timelineInPixel}px` }"
				>
					<div
						v-for="(entry, key) in bossFight.timeline"
						:key="key"
						class="absolute transform-gpu translate-y-0 -top-1.5 grid grid-flow-col grid-cols-[1fr,12px,1fr] w-full h-3"
						:style="{ '--tw-translate-y': `${timeToPixelFixed(entry.timestamp)}px` }"
					>
						<div class="w-3 h-3 rounded-full bg-red-500 col-start-2" />
						<div class="col-start-1 flex items-center h-2 justify-end">
							<div class="bg-gray-400 rounded p-4 mr-4 ">
								{{ entry.ability.name }} @ {{ entry.timestamp }}
							</div>
						</div>
					</div>
					<div
						v-for="(entry, key) in mitigationStrategy.timeline"
						:key="key"
						class="absolute transform-gpu translate-y-0 -top-1.5 grid grid-flow-col grid-cols-[1fr,12px,1fr] w-full h-3"
						:style="{ '--tw-translate-y': `${timeToPixelFixed(entry.timestamp)}px` }"
					>
						<div class="w-3 h-3 rounded-full bg-green-500 col-start-2" />
						<div class="col-start-1 flex items-center h-2 justify-end">
							<div class="bg-gray-400 rounded p-4 mr-4 ">
								{{ getSkillById(entry.mitigationSkillId).name }} @ {{ entry.timestamp }}
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script lang="ts">
import { computed, defineComponent, reactive, ref } from "@vue/runtime-core";
import { BossFight, TimelineEntry } from "./models/BossFight";
import { JobClass, jobClasses, JobClassType } from "./models/JobClass";
import { createRaidGroup, RaidGroupMember } from "./models/RaidGroup";
import TimeInput from "./components/TimeInput.vue";
import { isSkillAvailable, MitigationStrategy } from "./models/MitigationStrategy";
import { MitigationSkill } from "./models/MitigationSkill";
import { lerp, pixelToTime, timeToPixel } from "./utilities/helpers";
import { mitigationSkills } from './data/mitigationSkills';

export default defineComponent({
	name: 'App',

	components: {
		TimeInput
	},

	setup() {
		const availableJobsClasses = jobClasses;
		const selectedJobsClasses = ref<JobClass[]>([]);
		const group = createRaidGroup();
		const bossFight = reactive(new BossFight());
		const mitigationStrategy = reactive(new MitigationStrategy({ raidGroupId: group.id, bossFightId: bossFight.id }));
		const pixelSecondRatio = ref(5);
		const isTimelineMouseActive = ref(false);
		const timelineMousePosition = ref({ x: 0, y: 0 });
		const timelineWrapperRef = ref<HTMLElement>();
		const mitigationPopoverRef = ref<HTMLElement>();
		const freezeMovement = ref(false);
		const isSnappingDisabled = ref(false);

		document.addEventListener('keydown', (event: KeyboardEvent) => {
			if (event.key === 'Shift' && !isSnappingDisabled.value) {
				isSnappingDisabled.value = true;
			}
		});

		document.addEventListener('keyup', (event: KeyboardEvent) => {
			if (event.key === 'Shift' && isSnappingDisabled.value) {
				isSnappingDisabled.value = false;
			}
		});


		const timeToPixelFixed = (time: number) => timeToPixel(time, pixelSecondRatio.value);
		const pixelToTimeFixed = (pixel: number) => pixelToTime(pixel, pixelSecondRatio.value);

		const getAvailableMitigationForTime = (time: number) => {
			const groupsMitigation = group.getAvailableMitigation();

			const available: Record<string, MitigationSkill[]> = Object.entries(groupsMitigation).reduce((object, [memberId, memberMitigationSkills]) => {
				const filteredMitigationSkills = memberMitigationSkills.filter(skill => isSkillAvailable(skill, time, mitigationStrategy.timeline));

				return { ...object, [memberId]: filteredMitigationSkills };
			}, {});

			return available;
		};

		const actualBossFightDurationInSeconds = computed(() => {
			if (bossFight.timeline.length < 1) {
				return 0;
			}

			return bossFight.timeline[bossFight.timeline.length -1].timestamp;
		});

		const bossFightDurationInSeconds = computed(() => {
			if (actualBossFightDurationInSeconds.value < 60) {
				return 60;
			}

			return actualBossFightDurationInSeconds.value;
		}); 

		const bossFightDurationInPixel = computed(() => {
			return bossFightDurationInSeconds.value * pixelSecondRatio.value;
		});

		const timelineInPixel = computed(() => {
			if (isTimelineMouseActive.value) {
				if (timelineMousePosition.value.y > bossFightDurationInPixel.value - 10) {
					return timelineMousePosition.value.y + 10;
				}
			}

			return bossFightDurationInPixel.value;
		});

		const timelineInSeconds = computed(() => {
			if (isTimelineMouseActive.value) {
				const time = pixelToTime(timelineMousePosition.value.y, pixelSecondRatio.value);

				if (time > bossFightDurationInSeconds.value) {
					return time;
				}
			}

			return bossFightDurationInSeconds.value;
		});

		const timelinePositionInSeconds = computed(() => {
			const relativeValue = timelineMousePosition.value.y / bossFightDurationInPixel.value;

			const positionInSeconds = lerp(0, timelineInSeconds.value, relativeValue);

			return positionInSeconds;
		});

		const availableMitigationForTimelinePosition = computed(() => {
			return getAvailableMitigationForTime(timelinePositionInSeconds.value);
		});

		const newBossAbilityName = ref('');
		const newBossAbilityTime = ref(0);

		const raidGroup = computed(() => {
			return selectedJobsClasses.value.map(jobClass => jobClasses[jobClass]);
		});

		const addJobClassToRaidGroup = (jobClass: JobClass) => {
			group.addNewGroupMember(jobClass);
		};

		const addAbilityToBossFight = () => {
			bossFight.addAbilityToTimeline({ name: newBossAbilityName.value }, newBossAbilityTime.value);
			newBossAbilityName.value = '';
			newBossAbilityTime.value = 0;
		};

		const getClosestBossAbilityByTime = (time: number) => {
			return  bossFight.timeline.reduce((previousAbility, currentAbility) => {
				if (!previousAbility) {
					return currentAbility;
				}

				const previousDifference = Math.abs(time - previousAbility.timestamp);
				const currentDifference = Math.abs(time - currentAbility.timestamp);

				if (currentDifference < previousDifference) {
					return currentAbility;
				}

				return previousAbility;
			}, null as null | TimelineEntry);
		};

		const isCloseToBossAbility = (time: number, bossAbility: TimelineEntry): boolean => {
			const SNAP_THRESHOLD_IN_SECONDS = 2;
			return time < bossAbility.timestamp + SNAP_THRESHOLD_IN_SECONDS && time > bossAbility.timestamp - SNAP_THRESHOLD_IN_SECONDS;
		};

		const snapToClosestBossAbility = (y: number) => {
			if (isSnappingDisabled.value) {
				return y;
			}

			const yInSeconds = pixelToTimeFixed(y);
			const closestBossAbility = getClosestBossAbilityByTime(yInSeconds);

			if (closestBossAbility && isCloseToBossAbility(yInSeconds, closestBossAbility)) {
				const snapPosition = timeToPixelFixed(closestBossAbility.timestamp);
				return snapPosition;
			}

			return y;
		};

		const setTimelineMousePosition = (x: number, y: number) => {
			timelineMousePosition.value.y = snapToClosestBossAbility(y);
		};

		const onTimelineMouseMove = (event: MouseEvent) => {
			if (freezeMovement.value) {
				return;
			}

			if (!timelineWrapperRef.value) {
				return;
			}

			if (mitigationPopoverRef.value) {
				const elementFromPoint = document.elementFromPoint(event.pageX, event.pageY);

				if (elementFromPoint === mitigationPopoverRef.value) {
					return;
				}
			}


			const rect = timelineWrapperRef.value.getBoundingClientRect();
			const { top, height } = rect;
			let y = event.clientY - top;

			if (y < 0) {
				y = 0;
			}

			if (y > height) {
				y = height;
			}

			isTimelineMouseActive.value = true;
			setTimelineMousePosition(0, y);
		};

		const onTimelineMouseOut = () => {
			isTimelineMouseActive.value = false;
		};

		const onMitigationPopoverEnter = () => {
			freezeMovement.value = true;
		};

		const onMitigationPopoverLeave = () => {
			freezeMovement.value = false;
		};

		const addMitigationSkillOnCurrentPosition = (skill: MitigationSkill, memberId: string) => {
			const member = group.members.value.find(m => m.id === memberId) as RaidGroupMember;
			mitigationStrategy.addMitigation(skill, member, timelinePositionInSeconds.value);
		};

		const getSkillById = (skillId: number): MitigationSkill => {
			return mitigationSkills[skillId];
		};

		return {
			availableJobsClasses,
			selectedJobsClasses,
			addJobClassToRaidGroup,
			raidGroup,
			group,
			jobClasses,
			JobClassType,
			bossFight,
			mitigationStrategy,
			newBossAbilityName,
			newBossAbilityTime,
			addAbilityToBossFight,
			bossFightDurationInPixel,
			timelineInPixel,
			timeToPixelFixed,
			isTimelineMouseActive,
			onTimelineMouseMove,
			onTimelineMouseOut,
			timelineMousePosition,
			timelineWrapperRef,
			mitigationPopoverRef,
			onMitigationPopoverEnter,
			onMitigationPopoverLeave,
			getAvailableMitigationForTime,
			availableMitigationForTimelinePosition,
			timelinePositionInSeconds,
			addMitigationSkillOnCurrentPosition,
			getSkillById,
		};
	}
});
</script>

<style>
body {
    @apply bg-gray-700;
}
</style>