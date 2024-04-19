import {
	DefaultParams,
	ParamsTypes,
	TransitionObjectLike,
} from './gl-transition';

export const getCubeTransition = async ({
	file,
	paramsTypes,
	defaultParams,
}: {
	file: string;
	paramsTypes: ParamsTypes;
	defaultParams: DefaultParams;
}): Promise<TransitionObjectLike> => {
	const shader = await fetch(file).then((res) => res.text());

	return {
		glsl: shader,
		paramsTypes,
		defaultParams,
	};
};
