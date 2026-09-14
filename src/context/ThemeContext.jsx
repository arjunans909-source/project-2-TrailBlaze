import { useEffect, useState } from 'react'
import { ThemeContext } from './theme-context'

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState(() => {
    const savedTheme = localStorage.getItem('theme')

    return savedTheme === 'light' || savedTheme === 'dark'
      ? savedTheme
      : 'dark'
  })

  useEffect(() => {
    const html = document.documentElement

    // Remove both themes first
    html.classList.remove('dark', 'light')

    // Add current theme
    html.classList.add(theme)

    // Save theme
    localStorage.setItem('theme', theme)

    // Update browser color scheme
    html.style.colorScheme = theme
  }, [theme])

  const toggleTheme = () => {
    setTheme((currentTheme) => {
      return currentTheme === 'dark' ? 'light' : 'dark'
    })
  }

  return (
    <ThemeContext.Provider
      value={{
        theme,
        setTheme,
        toggleTheme,
      }}
    >
      {children}
    </ThemeContext.Provider>
  )
}
