import { SetState } from '@/types/SetState'
import { Label } from './ui/label'
import { Slider } from './ui/slider'

interface TemperatureSliderProps {
  temperature: number
  setTemperature: SetState<TemperatureSliderProps['temperature']>
}

export const TemperatureSlider = ({
  temperature,
  setTemperature,
}: TemperatureSliderProps) => (
  <div className="space-y-4">
    <Label>Temperatura</Label>
    <Slider
      min={0}
      max={1}
      step={0.1}
      value={[temperature]}
      onValueChange={(value) => setTemperature(value[0])}
    />
    <span className="block text-xs text-muted-foreground italic leading-relaxed">
      Valores mais altos tendem a deixar o resultado mais criativo e com
      possíveis erros
    </span>
  </div>
)
