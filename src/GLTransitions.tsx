import createTexture from 'gl-texture2d';
import React, {useCallback, useEffect, useState} from 'react';
import {
	continueRender,
	delayRender,
	staticFile,
	useCurrentFrame,
	useVideoConfig,
} from 'remotion';
import {getCubeTransition} from './cube-transition';
import {createTransition, DefaultParams, ParamsTypes} from './gl-transition';

const loadImage = (src: string) =>
	new Promise<HTMLImageElement>((resolve, reject) => {
		const img = new Image();
		img.onload = () => resolve(img);
		img.onerror = reject;
		img.onabort = reject;
		img.src = src;
	});

// ^ NB: we just assumed you have these 2 imageFrom and imageTo Image objects that have the image loaded and ready

const canvas = React.createRef<HTMLCanvasElement>();

export const GLTransitions: React.FC<{
	name: string;
	paramsTypes: ParamsTypes;
	defaultParams: DefaultParams;
}> = ({name, defaultParams, paramsTypes}) => {
	const [handle] = useState(() => delayRender());
	const frame = useCurrentFrame();
	const {fps, width, height} = useVideoConfig();

	const [drawFn, setDrawFn] = useState<((frame: number) => void) | null>(null);

	const initialize = useCallback(async () => {
		const imageFrom = await loadImage(staticFile('1.jpg'));
		const imageTo = await loadImage(staticFile('2.jpg'));
		const cubeTransition = await getCubeTransition({
			file: name,
			defaultParams,
			paramsTypes,
		});
		const gl = (canvas.current as HTMLCanvasElement).getContext(
			'webgl',
		) as WebGLRenderingContext;

		gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
		const buffer = gl.createBuffer();
		gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
		gl.bufferData(
			gl.ARRAY_BUFFER,
			new Float32Array([-1, -1, -1, 4, 4, -1]), // See a-big-triangle
			gl.STATIC_DRAW,
		);
		gl.viewport(0, 0, width, height);

		const from = createTexture(gl, imageFrom);
		from.minFilter = gl.LINEAR;
		from.magFilter = gl.LINEAR;

		const to = createTexture(gl, imageTo);
		to.minFilter = gl.LINEAR;
		to.magFilter = gl.LINEAR;

		const transition = createTransition(gl, cubeTransition); // https://github.com/gl-transitions/gl-transitions/blob/master/transitions/cube.glsl

		setDrawFn(() => (frame: number) => {
			transition.draw(frame / fps, from, to, width, height, {
				persp: 1.5,
				unzoom: 0.6,
			});
		});
		continueRender(handle);
	}, [defaultParams, fps, handle, height, name, paramsTypes, width]);

	useEffect(() => {
		initialize();
	}, [initialize]);

	useEffect(() => {
		if (drawFn) {
			drawFn(frame);
		}
	}, [drawFn, fps, frame]);

	return <canvas ref={canvas} width={width} height={height} />;
};
