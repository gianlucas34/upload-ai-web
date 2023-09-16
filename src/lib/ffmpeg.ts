import { FFmpeg } from '@ffmpeg/ffmpeg'
import coreURL from '../ffmpeg/ffmpeg-core.js?url'
import wasmURL from '../ffmpeg/ffmpeg-core.wasm?url'

let ffmpeg: FFmpeg | null

export const getFFmpeg = async () => {
  if (ffmpeg) {
    return ffmpeg
  }

  ffmpeg = new FFmpeg()

  if (!ffmpeg.loaded) {
    await ffmpeg.load({
      coreURL,
      wasmURL,
    })
  }

  return ffmpeg
}
