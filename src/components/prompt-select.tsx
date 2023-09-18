import { useEffect, useState } from 'react'
import { Label } from './ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select'
import { api } from '@/lib/axios'
import { Prompt } from '@/entities/Prompt'
import { SetState } from '@/types/SetState'

interface PromptSelectProps {
  setTemplate: SetState<string>
}

export const PromptSelect = ({ setTemplate }: PromptSelectProps) => {
  const [prompts, setPrompts] = useState<Prompt[] | null>(null)

  const handlePromptSelected = (promptId: string) => {
    const promptSelected = prompts?.find((prompt) => prompt.id === promptId)

    if (!promptSelected) {
      return
    }

    setTemplate(promptSelected.template)
  }

  useEffect(() => {
    api.get('/prompts').then((response) => setPrompts(response.data))
  }, [])

  return (
    <div className="space-y-2">
      <Label>Prompt</Label>
      <Select onValueChange={handlePromptSelected}>
        <SelectTrigger>
          <SelectValue placeholder="Selecione um prompt..." />
        </SelectTrigger>
        <SelectContent>
          {prompts?.map((prompt) => (
            <SelectItem key={prompt.id} value={prompt.id}>
              {prompt.title}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
}
