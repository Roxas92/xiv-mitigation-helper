import { v4 as uuidv4 } from 'uuid';

export type BossAbility = {
	name: string;
};

export interface BossFightOptions {
	id?: string;
	name?: string;
	timeline?: TimelineEntry[];
}

export type TimelineEntry = { timestamp: number, id: string, ability: BossAbility };

export class BossFight {
	id: string;
	name: string;
	timeline: TimelineEntry[];

	constructor(options?: BossFightOptions) {
		this.id = options?.id || uuidv4();
		this.name = options?.name || 'New unnamed boss fight';
		this.timeline = options?.timeline || [];
		this.sortTimelineByTimestamp();
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

	addAbilityToTimeline(ability: BossAbility, timestamp: number): BossFight {
		const id = uuidv4();
		const timelinedBossAbility: TimelineEntry = { timestamp, id, ability };
		this.timeline.push(timelinedBossAbility);
		this.sortTimelineByTimestamp();

		return this;
	}

	removeAbilityFromTimelineByID(id: string): BossFight {
		const index = this.timeline.findIndex(item => item.id === id);

		if (index > -1) {
			this.timeline.splice(index, 1);
		}

		return this;
	}
}