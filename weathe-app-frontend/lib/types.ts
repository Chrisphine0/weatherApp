export interface WeatherData {
    name: string
    main: {
      temp: number
      humidity: number
    }
    weather: {
      id: number
      main: string
      description: string
      icon: string
    }[]
    wind: {
      speed: number
      deg: number
    }
    sys: {
      country: string
    }
  }
  
  export interface ForecastData {
    date: string
    main: {
      temp: number
      humidity: number
    }
    weather: {
      id: number
      main: string
      description: string
      icon: string
    }[]
    wind: {
      speed: number
      deg: number
    }
  }  