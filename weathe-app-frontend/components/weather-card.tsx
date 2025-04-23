import WeatherIcon from "./weather-icon"

interface WeatherCardProps {
  date: string
  iconCode: string
  temperature: number
  description: string
  unit: "metric" | "imperial"
}

export default function WeatherCard({ date, iconCode, temperature, description, unit }: WeatherCardProps) {
  // Format the date to show only day name
  const dayName = new Date(date).toLocaleDateString("en-US", { weekday: "short" })

  return (
    <div className="bg-gray-50 p-4 rounded-lg flex flex-col items-center justify-center">
      <div className="text-sm font-medium text-gray-500">{dayName}</div>
      <WeatherIcon iconCode={iconCode} size={40} />
      <div className="text-xl font-semibold mt-2">
        {temperature}°{unit === "metric" ? "C" : "F"}
      </div>
      <div className="text-sm text-gray-600">{description}</div>
    </div>
  )
}