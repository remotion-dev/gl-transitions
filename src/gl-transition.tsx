import createShader from 'gl-shader';

export type Params = {
	[key: string]: unknown;
};

export type ParamsTypes = {
	[key: string]: string;
};

export type TransitionObjectLike = {
	glsl: string;
	defaultParams: Params;
	paramsTypes: ParamsTypes;
};

type GLTextureLike = {
	bind: (unit: number) => number;
	shape: [number, number];
};

type Options = {
	resizeMode: 'cover' | 'contain' | 'stretch';
};

const VERT = `attribute vec2 _p;
varying vec2 _uv;
void main() {
gl_Position = vec4(_p,0.0,1.0);
_uv = vec2(0.5, 0.5) * (_p+vec2(1.0, 1.0));
}`;

// These functions make a GLSL code that map the texture2D uv to preserve ratio for a given ${r} image ratio.
// there are different modes:
const resizeModes: {[_: string]: (r: string) => string} = {
	cover: (r: string) =>
		`.5+(uv-.5)*vec2(min(ratio/${r},1.),min(${r}/ratio,1.))`,
	contain: (r: string) =>
		`.5+(uv-.5)*vec2(max(ratio/${r},1.),max(${r}/ratio,1.))`,
	stretch: () => 'uv',
};

const makeFrag = (transitionGlsl: string, resizeMode: string): string => {
	const r = resizeModes[resizeMode];
	if (!r) throw new Error('invalid resizeMode=' + resizeMode);
	return `\
precision highp float;varying vec2 _uv;uniform sampler2D from, to;uniform float progress, ratio, _fromR, _toR;vec4 getFromColor(vec2 uv){return texture2D(from,${r(
		'_fromR',
	)});}vec4 getToColor(vec2 uv){return texture2D(to,${r('_toR')});}
${transitionGlsl}
void main(){gl_FragColor=transition(_uv);}`;
};

export const createTransition = (
	gl: WebGLRenderingContext,
	transition: TransitionObjectLike,
	options: Options,
) => {
	const {resizeMode} = options;
	const shader = createShader(gl, VERT, makeFrag(transition.glsl, resizeMode));
	shader.bind();
	shader.attributes._p.pointer();

	return {
		draw({
			from,
			height = gl.drawingBufferHeight,
			params,
			progress,
			to,
			width = gl.drawingBufferWidth,
		}: {
			progress: number;
			from: GLTextureLike;
			to: GLTextureLike;
			width: number;
			height: number;
			params: Params;
		}) {
			shader.bind();
			shader.uniforms.ratio = width / height;
			shader.uniforms.progress = progress;
			shader.uniforms.from = from.bind(0);
			shader.uniforms.to = to.bind(1);
			shader.uniforms._fromR = from.shape[0] / from.shape[1];
			shader.uniforms._toR = to.shape[0] / to.shape[1];
			let unit = 2;
			for (const key of Object.keys(transition.paramsTypes)) {
				const value = params[key] ?? transition.defaultParams[key];
				if (transition.paramsTypes[key] === 'sampler2D') {
					if (!value) {
						console.warn(
							`uniform[${key}]: A texture MUST be defined for uniform sampler2D of a texture`,
						);
					} else if (typeof value === 'function') {
						shader.uniforms[key] = value.bind(unit++);
					} else {
						throw new Error(
							'uniform[' +
								key +
								']: A gl-texture2d API-like object was expected',
						);
					}
				} else {
					shader.uniforms[key] = value;
				}
			}
			gl.drawArrays(gl.TRIANGLES, 0, 3);
		},
		dispose() {
			shader.dispose();
		},
	};
};
