import { Wind } from "lucide-react"

interface WindStatusProps {
  speed: number
  unit: string
}

export default function WindStatus({ speed, unit }: WindStatusProps) {
  return (
    <div className="bg-gray-50 p-4 rounded-lg">
      <h3 className="text-lg font-medium mb-2">Wind Status</h3>
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <Wind className="text-blue-500 mr-2" size={24} />
          <span className="text-2xl font-bold">{speed}</span>
          <span className="ml-1 text-gray-600">{unit}</span>
        </div>
        <div className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-sm">
          {speed < 5 ? "Light" : speed < 10 ? "Moderate" : "Strong"}
        </div>
      </div>
    </div>
  )
}