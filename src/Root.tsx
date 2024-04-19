import {Composition, staticFile} from 'remotion';
import {GLTransitions} from './GLTransitions';

export const RemotionVideo: React.FC = () => {
	return (
		<>
			<Composition
				id="Cube"
				component={GLTransitions}
				durationInFrames={30}
				fps={30}
				width={1920}
				height={1080}
				defaultProps={{
					name: staticFile('cube.glsl'),
					paramsTypes: {
						persp: 'float',
						unzoom: 'float',
						reflection: 'float',
						floating: 'float',
					},
					defaultParams: {
						persp: 0.7,
						unzoom: 0.3,
						reflection: 0.4,
						floating: 3,
					},
				}}
			/>
			<Composition
				id="PolkaDotsCurtain"
				component={GLTransitions}
				durationInFrames={30}
				fps={30}
				width={1920}
				height={1080}
				defaultProps={{
					name: staticFile('polkadot.glsl'),
					paramsTypes: {dots: 'float', center: 'vec2'},
					defaultParams: {dots: 20, center: [0, 0]},
				}}
			/>
			<Composition
				id="cannabisleaf"
				component={GLTransitions}
				durationInFrames={30}
				fps={30}
				width={1920}
				height={1080}
				defaultProps={{
					name: staticFile('cannabisleaf.glsl'),
					paramsTypes: {},
					defaultParams: {},
				}}
			/>
			<Composition
				id="ButterflyWaveScrawler"
				component={GLTransitions}
				durationInFrames={30}
				fps={30}
				width={1920}
				height={1080}
				defaultProps={{
					name: staticFile('butterflywavecrawler.glsl'),
					paramsTypes: {
						amplitude: 'float',
						waves: 'float',
						colorSeparation: 'float',
					},
					defaultParams: {amplitude: 1, waves: 30, colorSeparation: 0.3},
				}}
			/>
			<Composition
				id="ZoomBlur"
				component={GLTransitions}
				durationInFrames={120}
				fps={30}
				width={1920}
				height={1080}
				defaultProps={{
					name: staticFile('zoomblur.glsl'),
					paramsTypes: {
						strength: 'float',
					},
					defaultParams: {
						strength: 0.3,
					},
				}}
			/>
		</>
	);
};
