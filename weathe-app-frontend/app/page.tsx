"use client"

import type React from "react"

import { useState } from "react"
import { Search } from "lucide-react"
import WeatherIcon from "@/components/weather-icon"
import WeatherCard from "@/components/weather-card"
import WindStatus from "@/components/wind-status"
import HumidityStatus from "@/components/humidity-status"
import { formatDate } from "@/lib/utils"
import type { WeatherData, ForecastData } from "@/lib/types"

export default function Home() {
  const [city, setCity] = useState<string>("")
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null)
  const [forecastData, setForecastData] = useState<ForecastData[]>([])
  const [loading, setLoading] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)
  const [unit, setUnit] = useState<"metric" | "imperial">("metric")

  const fetchWeatherData = async () => {
    if (!city.trim()) return

    setLoading(true)
    setError(null)

    try {
      // Fetch current weather
      const weatherResponse = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/weather?city=${encodeURIComponent(city)}&units=${unit}`,
      )

      if (!weatherResponse.ok) {
        throw new Error("City not found or API error")
      }

      const weatherResult = await weatherResponse.json()
      setWeatherData(weatherResult)

      // Fetch forecast
      const forecastResponse = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/forecast?city=${encodeURIComponent(city)}&units=${unit}`,
      )

      if (!forecastResponse.ok) {
        throw new Error("Forecast data not available")
      }

      const forecastResult = await forecastResponse.json()
      setForecastData(forecastResult.slice(0, 3)) // Get next 3 days
    } catch (err) {
      setError(err instanceof Error ? err.message : "An unknown error occurred")
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    fetchWeatherData()
  }

  const toggleUnit = () => {
    setUnit(unit === "metric" ? "imperial" : "metric")
    if (weatherData) {
      fetchWeatherData()
    }
  }

  return (
    <main className="min-h-screen bg-gray-100 p-4 md:p-8">
      <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-md overflow-hidden">
        <div className="p-6">
          {/* Search and Unit Toggle */}
          <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
            <form onSubmit={handleSubmit} className="relative w-full md:w-2/3">
              <input
                type="text"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                placeholder="Search for a city..."
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button type="submit" className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500">
                <Search size={20} />
              </button>
            </form>

            <div className="flex items-center">
              <button
                onClick={toggleUnit}
                className={`px-3 py-1 rounded-l-md ${unit === "metric" ? "bg-blue-500 text-white" : "bg-gray-200"}`}
              >
                °C
              </button>
              <button
                onClick={toggleUnit}
                className={`px-3 py-1 rounded-r-md ${unit === "imperial" ? "bg-blue-500 text-white" : "bg-gray-200"}`}
              >
                °F
              </button>
            </div>
          </div>

          {loading && (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
          )}

          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4">{error}</div>
          )}

          {weatherData && !loading && (
            <>
              {/* Current Weather */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                <div className="bg-gray-50 p-4 rounded-lg flex flex-col items-center justify-center">
                  <WeatherIcon iconCode={weatherData.weather[0].icon} size={64} />
                  <div className="text-3xl font-bold mt-2">
                    {Math.round(weatherData.main.temp)}°{unit === "metric" ? "C" : "F"}
                  </div>
                  <div className="text-gray-600">{weatherData.weather[0].description}</div>
                </div>

                {forecastData.map((day, index) => (
                  <WeatherCard
                    key={index}
                    date={day.date}
                    iconCode={day.weather[0].icon}
                    temperature={Math.round(day.main.temp)}
                    description={day.weather[0].description}
                    unit={unit}
                  />
                ))}
              </div>

              {/* Date and Location */}
              <div className="mb-6">
                <div className="text-gray-600">{formatDate(new Date())}</div>
                <div className="text-xl font-semibold">
                  {weatherData.name}, {weatherData.sys.country}
                </div>
              </div>

              {/* Wind and Humidity */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <WindStatus speed={weatherData.wind.speed} unit={unit === "metric" ? "m/s" : "mph"} />
                <HumidityStatus humidity={weatherData.main.humidity} />
              </div>
            </>
          )}
        </div>
      </div>
    </main>
  )
}