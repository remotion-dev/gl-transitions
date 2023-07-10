import {Config} from '@remotion/cli/config';

Config.setCodec('h264');
Config.setImageSequence(false);
Config.setVideoImageFormat('jpeg');
Config.setOverwriteOutput(true);
Config.setChromiumOpenGlRenderer('angle');
