export interface TryUntilProp {
	onlyIf: Function;
	thenRun: Function;
	max?: number;
	interval?: number;
	onError?(props: TryUntilProp): Function | void;
	onTrying?(attempts: number): Function | void;
}

/**
 *
 * This function will try to run a method several times until it returns true
 * and it reached its max attempts and still wasn't able to achieve 'true' then
 * throw error
 *
 * @param props
 * @returns
 */
export const tryUntil = async (props: TryUntilProp): Promise<any> => {
	return new Promise((resolve, reject) => {
		let counter = 0;
		let max = props?.max ?? 10;
		let milliseconds = props?.interval ?? 2000;

		const intervalId = setInterval(async () => {
			const isReady = await props?.onlyIf();

			// -- (success case)
			if (isReady) {
				clearInterval(intervalId);
				let result = await props?.thenRun();
				resolve(result);
			}

			// -- (attempt case)
			counter = counter + 1;

			// -- (callback) when trying again
			if (props?.onTrying) {
				props.onTrying(counter);
			} else {
				console.log(`${counter} trying...`);
			}

			// -- (reject case) When tried more than x times
			if (counter >= max) {
				clearInterval(intervalId);
				if (props?.onError) {
					props.onError(props);
				}

				reject(counter);
				return;
			}
		}, milliseconds);
	});
};
