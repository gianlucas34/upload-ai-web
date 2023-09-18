import { useState } from 'react'
import { Github, Wand2 } from 'lucide-react'
import { useCompletion } from 'ai/react'
import { Button } from './components/ui/button'
import { Separator } from './components/ui/separator'
import { Textarea } from './components/ui/textarea'
import { VideoInputForm } from './components/video-input-form'
import { PromptSelect } from './components/prompt-select'
import { ModelSelect } from './components/model-select'
import { TemperatureSlider } from './components/temperature-slider'
import { Loader } from './components/loader'

export const App = () => {
  const [videoId, setVideoId] = useState<string | null>(null)
  const [temperature, setTemperature] = useState<number>(0.5)

  const {
    input: template,
    setInput: setTemplate,
    handleInputChange: handleTemplateChange,
    handleSubmit: handleAICompletion,
    completion,
    isLoading,
  } = useCompletion({
    api: 'http://localhost:3333/ai/completion',
    body: {
      videoId,
      temperature,
    },
    headers: {
      'Content-Type': 'application/json',
    },
  })

  return (
    <div className="min-h-screen flex flex-col">
      <header className="flex items-center justify-between px-6 py-3 border-b">
        <h1 className="text-xl font-bold">upload.ai</h1>
        <div className="flex items-center gap-3">
          <span className="text-sm text-muted-foreground">
            Desenvolvido por: Gian Lucas 🚀
          </span>
          <Separator orientation="vertical" className="h-6" />
          <Button variant="outline">
            <Github className="w-4 h-4 mr-2" />
            Github
          </Button>
        </div>
      </header>
      <main className="flex flex-1 p-6 pb-0 gap-6">
        <div className="flex-1 grid grid-rows-2 gap-4">
          <Textarea
            className="resize-none p-4 leading-relaxed"
            placeholder="Inclua o prompt para a IA..."
            value={template}
            onChange={handleTemplateChange}
          />
          <Textarea
            readOnly
            className="resize-none p-4 leading-relaxed"
            placeholder="Resultado gerado pela IA..."
            value={completion}
          />
        </div>
        <aside className="w-80 space-y-6">
          <VideoInputForm setVideoId={setVideoId} />
          <Separator />
          <form onSubmit={handleAICompletion} className="space-y-6">
            <PromptSelect setTemplate={setTemplate} />
            <ModelSelect />
            <TemperatureSlider
              temperature={temperature}
              setTemperature={setTemperature}
            />
            <Separator />
            <Button disabled={isLoading} type="submit" className="w-full">
              {isLoading ? (
                <Loader />
              ) : (
                <>
                  Executar
                  <Wand2 className="w-4 h-4 ml-2" />
                </>
              )}
            </Button>
          </form>
        </aside>
      </main>
      <footer className="px-6 py-2">
        <p className="text-sm text-muted-foreground">
          Lembre-se: Você pode utilizar a variável{' '}
          <code className="text-red-500">{'{transcription}'}</code> no seu
          prompt para adicionar o conteúdo da transcrição do vídeo selecionado.
        </p>
      </footer>
    </div>
  )
}
