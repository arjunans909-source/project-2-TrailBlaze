import { BrowserRouter, Routes, Route } from 'react-router-dom'

import { useTheme } from './context/useTheme'
import Home from './pages/Home'
import CreateTrip from './pages/CreateTrip'
import MyTrips from './pages/MyTrips'
import { TripDetailsRoute } from './pages/TripDetails'

function App() {
  const { theme, setTheme } = useTheme()
  const darkMode = theme === 'dark'

  const setDarkMode = (isDark) => {
    setTheme(isDark ? 'dark' : 'light')
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={
            <Home
              darkMode={darkMode}
              setDarkMode={setDarkMode}
            />
          }
        />

        <Route path="/create-trip" element={<CreateTrip />} />
        <Route path="/my-trips" element={<MyTrips />} />
        <Route path="/trip/:id" element={<TripDetailsRoute />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App