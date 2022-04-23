export type TimelineEntry = { timestamp: number, id: string };

export type Timeline = TimelineEntry[];

export const sortTimelineByTimestamp = <T extends TimelineEntry>(timeline: T[]): T[] => {
	return [...timeline].sort((a, b) => {
		if (a.timestamp < b.timestamp) {
			return -1;
		}

		if (a.timestamp > b.timestamp) {
			return 1;
		}

		return 0;
	});
};