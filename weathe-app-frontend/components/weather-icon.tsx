import Image from "next/image"

interface WeatherIconProps {
  iconCode: string
  size?: number
}

export default function WeatherIcon({ iconCode, size = 50 }: WeatherIconProps) {
  const iconUrl = `https://openweathermap.org/img/wn/${iconCode}@2x.png`

  return (
    <div className="relative" style={{ width: size, height: size }}>
      <Image
        src={iconUrl || "/placeholder.svg"}
        alt="Weather icon"
        fill
        sizes={`${size}px`}
        className="object-contain"
      />
    </div>
  )
}
// https://openweathermap.org/img/wn/10d@2x.png