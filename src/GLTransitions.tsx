import React, {useCallback, useEffect, useState} from 'react';
import {
	continueRender,
	delayRender,
	useCurrentFrame,
	useVideoConfig,
} from 'remotion';
import {Params, ParamsTypes} from './gl-transition';
import {DrawFn, initialize} from './init';

const canvas = React.createRef<HTMLCanvasElement>();

export const GLTransitions: React.FC<{
	name: string;
	paramsTypes: ParamsTypes;
	defaultParams: Params;
}> = ({name, defaultParams, paramsTypes}) => {
	const [handle] = useState(() => delayRender());
	const frame = useCurrentFrame();
	const {fps, width, height} = useVideoConfig();

	const [drawFn, setDrawFn] = useState<DrawFn | null>(null);

	const init = useCallback(async () => {
		const fn = await initialize({
			name,
			defaultParams,
			paramsTypes,
			canvas: canvas.current as HTMLCanvasElement,
			width,
			height,
			fps,
		});
		setDrawFn(fn);
		continueRender(handle);
	}, [defaultParams, fps, handle, height, name, paramsTypes, width]);

	useEffect(() => {
		init();
	}, [init]);

	useEffect(() => {
		if (drawFn) {
			drawFn(frame);
		}
	}, [drawFn, fps, frame]);

	return <canvas ref={canvas} width={width} height={height} />;
};
