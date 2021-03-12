import createTexture from 'gl-texture2d';
import createTransition from 'gl-transition';
import transitions from 'gl-transitions';
import React, {useCallback, useEffect, useState} from 'react';
import {
	continueRender,
	delayRender,
	useCurrentFrame,
	useVideoConfig,
} from 'remotion';
import one from './1.jpg';
import two from './2.jpg';

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
}> = ({name}) => {
	const [handle] = useState(() => delayRender());
	const frame = useCurrentFrame();
	const {fps, width, height} = useVideoConfig();

	const [drawFn, setDrawFn] = useState<((frame: number) => void) | null>(null);

	const initialize = useCallback(async () => {
		const imageFrom = await loadImage(one);
		const imageTo = await loadImage(two);
		const gl =
			(canvas.current as HTMLCanvasElement).getContext('webgl') ||
			((canvas.current as HTMLCanvasElement).getContext(
				'experimental-webgl'
			) as WebGLRenderingContext);
		gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
		const buffer = gl.createBuffer();
		gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
		gl.bufferData(
			gl.ARRAY_BUFFER,
			new Float32Array([-1, -1, -1, 4, 4, -1]), // see a-big-triangle
			gl.STATIC_DRAW
		);
		gl.viewport(0, 0, width, height);

		const from = createTexture(gl, imageFrom);
		from.minFilter = gl.LINEAR;
		from.magFilter = gl.LINEAR;

		const to = createTexture(gl, imageTo);
		to.minFilter = gl.LINEAR;
		to.magFilter = gl.LINEAR;

		const transition = createTransition(
			gl,
			transitions.find((t) => t.name === name)
		); // https://github.com/gl-transitions/gl-transitions/blob/master/transitions/cube.glsl

		setDrawFn(() => (frame: number) => {
			transition.draw((frame / fps) % 1, from, to, width, height, {
				persp: 1.5,
				unzoom: 0.6,
			});
		});
		continueRender(handle);
	}, [fps, handle, height, name, width]);

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
