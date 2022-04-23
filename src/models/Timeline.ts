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

export const getDuration = (timeline: Timeline): number => {
	const lastTimelineEntry = timeline[timeline.length - 1];
	return lastTimelineEntry.timestamp;
};

export const updateTimelineEntry = <T extends TimelineEntry>(timeline: T[], id: string, timestamp: number): T[] => {
	const timelineCopy = [...timeline];
	const index = timelineCopy.findIndex(entry => entry.id === id);
    
	timelineCopy[index] = { ...timelineCopy[index], timestamp };

	return sortTimelineByTimestamp(timelineCopy);
};

export const removeTimelineEntryById = <T extends TimelineEntry>(timeline: T[], id: string): T[] => {
	const timelineCopy = [...timeline];
	const index = timelineCopy.findIndex(item => item.id === id);

	if (index > -1) {
		timelineCopy.splice(index, 1);
	}

	return timelineCopy;
};