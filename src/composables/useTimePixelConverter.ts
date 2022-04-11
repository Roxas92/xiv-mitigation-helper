import { ref } from "vue";

const pixelSecondRatio = ref(10);

export const useTimePixelConverter = () => {
	const timeToPixel = (time: number): number => {
		return time * pixelSecondRatio.value;
	};
    
	const pixelToTime = (pixel: number): number => {
		return pixel / pixelSecondRatio.value;
	};

	return {
		pixelSecondRatio,
		timeToPixel,
		pixelToTime,
	};
};
