import { Droplet } from "lucide-react"

interface HumidityStatusProps {
  humidity: number
}

export default function HumidityStatus({ humidity }: HumidityStatusProps) {
  return (
    <div className="bg-gray-50 p-4 rounded-lg">
      <h3 className="text-lg font-medium mb-2">Humidity</h3>
      <div className="flex items-center mb-2">
        <Droplet className="text-blue-500 mr-2" size={24} />
        <span className="text-2xl font-bold">{humidity}%</span>
      </div>

      {/* Progress bar */}
      <div className="w-full bg-gray-200 rounded-full h-2.5">
        <div className="bg-blue-500 h-2.5 rounded-full" style={{ width: `${humidity}%` }}></div>
      </div>
    </div>
  )
}