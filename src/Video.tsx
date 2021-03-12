import {Composition} from 'remotion';
import {GLTransitions} from './GLTransitions';

export const RemotionVideo: React.FC = () => {
	return (
		<>
			<Composition
				id="Directional"
				component={GLTransitions}
				durationInFrames={30}
				fps={30}
				width={1920}
				height={1080}
				defaultProps={{
					name: 'Directional',
				}}
			/>
			<Composition
				id="Cube"
				component={GLTransitions}
				durationInFrames={30}
				fps={30}
				width={1920}
				height={1080}
				defaultProps={{
					name: 'cube',
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
					name: 'PolkaDotsCurtain',
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
					name: 'cannabisleaf',
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
					name: 'ButterflyWaveScrawler',
				}}
			/>
		</>
	);
};
