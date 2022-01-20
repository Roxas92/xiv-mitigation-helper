import { ref, computed, watch } from "@vue/runtime-core";

export type TimeType = number | { minutes: number; seconds: number }; 

export const useTimeInput = <T extends TimeType>(initialTime = 0 as T) => {
	const isTimeInSeconds = (input: TimeType): input is number => {
		return typeof input === 'number';
	};

	const getTimeInSeconds = (t: { minutes: number; seconds: number }): number => {      
		let seconds = t.seconds;
		seconds += t.minutes * 60;

		return seconds;
	};

	const getSecondsFromTime = (t: TimeType): number => {
		if (isTimeInSeconds(t)) {
			return t % 60;
		}
        
		return t.seconds;
	};

	const getMinutesFromTime = (t: TimeType): number => {
		if (isTimeInSeconds(t)) {
			return t / 60;
		}
        
		return t.minutes;
	};

	const seconds = ref<number>(getSecondsFromTime(initialTime));
	const minutes = ref<number>(getMinutesFromTime(initialTime));

	const timeInSeconds = computed<number>({
		set(value) {
			seconds.value = getSecondsFromTime(value);
			minutes.value = getMinutesFromTime(value);
		},
		get() {
			return getTimeInSeconds({ seconds: seconds.value, minutes: minutes.value });
		}
	});

	const time = computed<T>({
		set(value) {
			if (isTimeInSeconds(value)) {
				seconds.value = getSecondsFromTime(value);
			    minutes.value = getMinutesFromTime(value);
			} else {
				seconds.value = value.seconds;
			    minutes.value = value.minutes;
			}
		},
		get() {
			if (isTimeInSeconds(initialTime)) {
				return timeInSeconds.value as T;
			}
    
			return {
				seconds: seconds.value,
				minutes: minutes.value,
			} as T;
		}
	});

	watch(seconds, (value) => {
		if (value > 59) {
			seconds.value = 59;
		}
	});

	return {
		time,
		timeInSeconds,
		seconds,
		minutes,
	};
};