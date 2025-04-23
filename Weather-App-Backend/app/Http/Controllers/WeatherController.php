<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Cache;

class WeatherController extends Controller
{
    /**
     * Get current weather data for a city
     *
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function getCurrentWeather(Request $request)
    {
        $request->validate([
            'city' => 'required|string',
            'units' => 'nullable|in:metric,imperial',
        ]);

        $city = $request->query('city');
        $units = $request->query('units', 'metric');
        
        // Cache key based on city and units
        $cacheKey = "weather_{$city}_{$units}";
        
        // Check if we have cached data (cache for 30 minutes)
        return Cache::remember($cacheKey, 1800, function () use ($city, $units) {
            $response = Http::get('https://api.openweathermap.org/data/2.5/weather', [
                'q' => $city,
                'units' => $units,
                'appid' => env('OPENWEATHERMAP_API_KEY'),
            ]);
            
            if ($response->failed()) {
                return response()->json([
                    'error' => 'City not found or API error',
                ], $response->status());
            }
            
            return $response->json();
        });
    }
    
    /**
     * Get forecast data for a city
     *
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function getForecast(Request $request)
    {
        $request->validate([
            'city' => 'required|string',
            'units' => 'nullable|in:metric,imperial',
        ]);

        $city = $request->query('city');
        $units = $request->query('units', 'metric');
        
        // Cache key based on city and units
        $cacheKey = "forecast_{$city}_{$units}";
        
        // Check if we have cached data (cache for 30 minutes)
        return Cache::remember($cacheKey, 1800, function () use ($city, $units) {
            // First get coordinates from geocoding API
            $geoResponse = Http::get('https://api.openweathermap.org/geo/1.0/direct', [
                'q' => $city,
                'limit' => 1,
                'appid' => env('OPENWEATHERMAP_API_KEY'),
            ]);
            
            if ($geoResponse->failed() || empty($geoResponse->json())) {
                return response()->json([
                    'error' => 'City not found',
                ], 404);
            }
            
            $location = $geoResponse->json()[0];
            $lat = $location['lat'];
            $lon = $location['lon'];
            
            // Now get the forecast data
            $forecastResponse = Http::get('https://api.openweathermap.org/data/2.5/forecast', [
                'lat' => $lat,
                'lon' => $lon,
                'units' => $units,
                'appid' => env('OPENWEATHERMAP_API_KEY'),
            ]);
            
            if ($forecastResponse->failed()) {
                return response()->json([
                    'error' => 'Forecast data not available',
                ], $forecastResponse->status());
            }
            
            $forecastData = $forecastResponse->json();
            
            // Process the forecast data to get one forecast per day
            $dailyForecasts = [];
            $processedDates = [];
            
            foreach ($forecastData['list'] as $forecast) {
                $date = date('Y-m-d', $forecast['dt']);
                
                // Skip if we already have a forecast for this date
                if (in_array($date, $processedDates)) {
                    continue;
                }
                
                // Skip today's date, we only want future forecasts
                if ($date === date('Y-m-d')) {
                    continue;
                }
                
                $processedDates[] = $date;
                
                $dailyForecasts[] = [
                    'date' => $date,
                    'main' => $forecast['main'],
                    'weather' => $forecast['weather'],
                    'wind' => $forecast['wind'],
                ];
                
                // We only need 3 days of forecast
                if (count($dailyForecasts) >= 3) {
                    break;
                }
            }
            
            return $dailyForecasts;
        });
    }
}