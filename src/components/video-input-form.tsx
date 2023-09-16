import { ChangeEvent, FormEvent, useMemo, useRef, useState } from 'react'
import { FileVideo, Upload } from 'lucide-react'
import { fetchFile } from '@ffmpeg/util'
import { Separator } from './ui/separator'
import { Label } from './ui/label'
import { Textarea } from './ui/textarea'
import { Button } from './ui/button'
import { getFFmpeg } from '@/lib/ffmpeg'
import { api } from '@/lib/axios'

type Status = 'waiting' | 'converting' | 'uploading' | 'generating' | 'success'

const statusMessages = {
  converting: 'Convertendo...',
  uploading: 'Carregando...',
  generating: 'Transcrevendo...',
  success: 'Sucesso!',
}

export const VideoInputForm = () => {
  const [videoFile, setVideoFile] = useState<File | null>(null)
  const [status, setStatus] = useState<Status>('waiting')
  const promptInputRef = useRef<HTMLTextAreaElement>(null)

  const handleFileSelected = (event: ChangeEvent<HTMLInputElement>) => {
    const { files } = event.currentTarget

    if (!files) {
      return
    }

    setVideoFile(files[0])
  }
  const convertVideoToAudio = async (video: File) => {
    const ffmpeg = await getFFmpeg()

    await ffmpeg.writeFile('video.mp4', await fetchFile(video))
    await ffmpeg.exec([
      '-i',
      'video.mp4',
      '-map',
      '0:a',
      '-b:a',
      '20k',
      '-acodec',
      'libmp3lame',
      'audio.mp3',
    ])

    const data = await ffmpeg.readFile('audio.mp3')
    const audioFileBlob = new Blob([data], { type: 'audio/mpeg' })
    const audioFile = new File([audioFileBlob], 'audio.mp3', {
      type: 'audio/mpeg',
    })

    return audioFile
  }
  const handleUploadVideo = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    if (!videoFile) {
      return
    }

    setStatus('converting')

    const prompt = promptInputRef.current?.value
    const audioFile = await convertVideoToAudio(videoFile)
    const formData = new FormData()

    formData.append('file', audioFile)

    setStatus('uploading')

    const response = await api.post('/video', formData)

    setStatus('generating')

    await api.post(`/video/${response.data.id}/transcription`, { prompt })

    setStatus('success')
  }

  const previewURL = useMemo(() => {
    if (!videoFile) {
      return null
    }

    return URL.createObjectURL(videoFile)
  }, [videoFile])

  return (
    <form className="space-y-6" onSubmit={handleUploadVideo}>
      <label
        htmlFor="video"
        className="relative cursor-pointer flex flex-col items-center justify-center border border-dashed rounded-md aspect-video text-sm text-muted-foreground gap-2 hover:bg-white/5"
      >
        {previewURL ? (
          <video
            src={previewURL}
            controls={false}
            className="pointer-events-none absolute inset-0"
          />
        ) : (
          <>
            <FileVideo className="w-4 h-4" />
            Selecione um vídeo
          </>
        )}
      </label>
      <input
        id="video"
        type="file"
        accept="video/mp4"
        className="sr-only"
        onChange={handleFileSelected}
      />
      <Separator />
      <div className="space-y-2">
        <Label htmlFor="transcription_prompt">Prompt de transcrição</Label>
        <Textarea
          id="transcription_prompt"
          ref={promptInputRef}
          disabled={status !== 'waiting'}
          placeholder="Inclua palavras-chave mencionadas no vídeo separadas por vírgula"
          className="h-20 leading-relaxed resize-none"
        />
      </div>
      <Button
        data-success={status === 'success'}
        disabled={status !== 'waiting'}
        type="submit"
        className="w-full data-[success=true]:bg-emerald-400 data-[success=true]:text-black"
      >
        {status === 'waiting' ? (
          <>
            Carregar vídeo
            <Upload className="w-4 h-4 ml-2" />
          </>
        ) : (
          statusMessages[status]
        )}
      </Button>
    </form>
  )
}
