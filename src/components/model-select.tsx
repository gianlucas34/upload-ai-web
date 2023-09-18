import { Label } from './ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select'

export const ModelSelect = () => (
  <div className="space-y-2">
    <Label>Modelo</Label>
    <Select disabled defaultValue="gpt3.5">
      <SelectTrigger>
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="gpt3.5">GPT 3.5-turbo 16k</SelectItem>
      </SelectContent>
    </Select>
    <span className="block text-xs text-muted-foreground italic">
      Você poderá customizar essa opção em breve
    </span>
  </div>
)
