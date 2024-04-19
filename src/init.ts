import createTexture from 'gl-texture2d';
import {staticFile} from 'remotion';
import {getCubeTransition} from './cube-transition';
import {createTransition, Params, ParamsTypes} from './gl-transition';

export type DrawFn = (frame: number) => void;

const loadImage = (src: string) => {
	return new Promise<HTMLImageElement>((resolve, reject) => {
		const img = new Image();
		img.onload = () => resolve(img);
		img.onerror = reject;
		img.onabort = reject;
		img.src = src;
	});
};

export const initialize = async ({
	name,
	defaultParams,
	paramsTypes,
	canvas,
	width,
	height,
	fps,
}: {
	name: string;
	defaultParams: Params;
	paramsTypes: ParamsTypes;
	canvas: HTMLCanvasElement;
	width: number;
	height: number;
	fps: number;
}) => {
	const imageFrom = await loadImage(staticFile('1.jpg'));
	const imageTo = await loadImage(staticFile('2.jpg'));

	const cubeTransition = await getCubeTransition({
		file: name,
		defaultParams,
		paramsTypes,
	});
	const gl = canvas.getContext('webgl') as WebGLRenderingContext;

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

	const transition = createTransition(gl, cubeTransition, {
		resizeMode: 'cover',
	});

	return () => (frame: number) => {
		transition.draw({
			progress: frame / fps,
			from,
			to,
			width,
			height,
			params: {
				persp: 1.5,
				unzoom: 0.6,
			},
		});
	};
};
