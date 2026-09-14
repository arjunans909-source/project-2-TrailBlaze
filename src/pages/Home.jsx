import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'

function Home({ darkMode, setDarkMode }) {
  const navigate = useNavigate()

  const [search, setSearch] = useState('')
  const [searchMessage, setSearchMessage] = useState('')

  const destinations = [
    {
      name: 'Paris',
      country: 'France 🇫🇷',
      image:
        'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=900&q=80',
      rating: '4.9',
      description:
        'Romantic streets, iconic landmarks and amazing cafés.',
      budget: '₹₹₹',
    },
    {
      name: 'Tokyo',
      country: 'Japan 🇯🇵',
      image:
        'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?auto=format&fit=crop&w=900&q=80',
      rating: '4.8',
      description:
        'Experience incredible food, culture and modern city life.',
      budget: '₹₹₹',
    },
    {
      name: 'Dubai',
      country: 'UAE 🇦🇪',
      image:
        'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=900&q=80',
      rating: '4.7',
      description:
        'Luxury shopping, skyscrapers, beaches and adventure.',
      budget: '₹₹₹₹',
    },
    {
      name: 'New York',
      country: 'USA 🇺🇸',
      image:
        'https://images.unsplash.com/photo-1485871981521-5b1fd3805eee?auto=format&fit=crop&w=900&q=80',
      rating: '4.8',
      description:
        'The city that never sleeps, full of iconic experiences.',
      budget: '₹₹₹₹',
    },
    {
      name: 'Goa',
      country: 'India 🇮🇳',
      image:
        'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=900&q=80',
      rating: '4.8',
      description:
        'Beautiful beaches, sunsets, nightlife and relaxing escapes.',
      budget: '₹₹',
    },
    {
      name: 'London',
      country: 'United Kingdom 🇬🇧',
      image:
        'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?auto=format&fit=crop&w=900&q=80',
      rating: '4.8',
      description:
        'Historic landmarks, royal attractions and vibrant city life.',
      budget: '₹₹₹₹',
    },
    {
      name: 'Singapore',
      country: 'Singapore 🇸🇬',
      image:
        'https://images.unsplash.com/photo-1525625293386-3f8f99389edd?auto=format&fit=crop&w=900&q=80',
      rating: '4.7',
      description:
        'Modern architecture, gardens, food and unforgettable attractions.',
      budget: '₹₹₹',
    },
    {
      name: 'Bali',
      country: 'Indonesia 🇮🇩',
      image:
        'https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=900&q=80',
      rating: '4.9',
      description:
        'Tropical beaches, temples, nature and peaceful getaways.',
      budget: '₹₹',
    },
  ]

  const handleExplore = () => {
    const value = search.trim()

    if (!value) {
      setSearchMessage('Please enter a destination first.')
      return
    }

    navigate(`/create-trip?destination=${encodeURIComponent(value)}`)
  }

  const handlePlanDestination = (destinationName) => {
    navigate(
      `/create-trip?destination=${encodeURIComponent(destinationName)}`
    )
  }

  return (
    <div className="min-h-screen text-slate-900 transition-colors duration-500 dark:text-slate-100">

      {/* Animated Background */}
      <div className="background-effects">
        <div className="gradient-orb gradient-orb-one" />
        <div className="gradient-orb gradient-orb-two" />
        <div className="gradient-orb gradient-orb-three" />
      </div>

      {/* Navbar */}
      <nav className="sticky top-0 z-50 border-b border-slate-200/70 bg-white/75 backdrop-blur-xl transition-colors duration-500 dark:border-slate-800/70 dark:bg-slate-950/75">

        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">

          {/* Trailblaze Logo */}
          <Link to="/" className="flex items-center gap-2">

            <div className="logo-box">
              ✈️
            </div>

            <span className="text-2xl font-bold tracking-tight">
              Trail<span className="text-blue-600">blaze</span>
            </span>

          </Link>

          {/* Navigation */}
          <div className="hidden items-center gap-8 md:flex">

            <a href="#home" className="nav-link">
              Home
            </a>

            <a href="#destinations" className="nav-link">
              Destinations
            </a>

            <a href="#features" className="nav-link">
              Features
            </a>

          </div>

          {/* Right Side */}
          <div className="flex items-center gap-3">

            {/* Theme Toggle */}
            <button
              type="button"
              onClick={() => setDarkMode(!darkMode)}
              className="theme-toggle"
              aria-label="Toggle dark mode"
              title={
                darkMode
                  ? 'Switch to light mode'
                  : 'Switch to dark mode'
              }
            >
              <span
                className={
                  darkMode
                    ? 'theme-icon rotate'
                    : 'theme-icon'
                }
              >
                {darkMode ? '☀️' : '🌙'}
              </span>
            </button>

            {/* My Trips */}
            <Link
              to="/my-trips"
              className="rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-blue-600/20 transition hover:-translate-y-0.5 hover:bg-blue-700 hover:shadow-blue-600/30"
            >
              My Trips
            </Link>

          </div>

        </div>

      </nav>

      {/* Hero */}
      <section
        id="home"
        className="relative overflow-hidden"
      >

        <div className="relative mx-auto grid max-w-7xl items-center gap-12 px-6 py-24 md:grid-cols-2 md:py-32">

          {/* Hero Content */}
          <div className="hero-content">

            <span className="inline-flex rounded-full border border-blue-200/70 bg-blue-100/70 px-4 py-2 text-sm font-semibold text-blue-700 backdrop-blur-sm dark:border-blue-800/50 dark:bg-blue-950/60 dark:text-blue-300">
              🌎 Your next adventure starts here
            </span>

            <h1 className="mt-6 text-5xl font-extrabold leading-tight tracking-tight md:text-6xl">
              Plan your trip.
              <br />
              <span className="gradient-text">
                Enjoy the journey.
              </span>
            </h1>

            <p className="mt-6 max-w-xl text-lg leading-8 text-slate-600 dark:text-slate-400">
              Create beautiful itineraries, discover destinations,
              check the weather, and manage your travel budget —
              all in one place.
            </p>

            {/* Search */}
            <div className="mt-12 max-w-xl">

              <div className="search-box">

                <div className="flex flex-1 items-center gap-3 px-4">

                  <span className="text-xl">
                    📍
                  </span>

                  <input
                    type="text"
                    value={search}
                    onChange={(e) => {
                      setSearch(e.target.value)
                      setSearchMessage('')
                    }}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        handleExplore()
                      }
                    }}
                    placeholder="Where do you want to go?"
                    className="w-full bg-transparent py-4 outline-none placeholder:text-slate-400 dark:text-white"
                  />

                </div>

                {/* Explore Button */}
                <button
                  type="button"
                  onClick={handleExplore}
                  className="m-4 rounded-xl bg-blue-600 px-6 py-3 font-semibold text-white shadow-lg shadow-blue-600/20 transition hover:-translate-y-0.5 hover:bg-blue-700"
                >
                  Explore 🔎
                </button>

              </div>

              {/* Search Error */}
              {searchMessage && (
                <p className="mt-3 text-sm font-medium text-red-500">
                  {searchMessage}
                </p>
              )}

              {/* Suggestions */}
              <div className="mt-6 flex flex-wrap items-center gap-2.5">

                <span className="mr-1 text-sm text-slate-400">
                  Try:
                </span>

                {destinations.slice(0, 5).map((destination) => (

                  <button
                    key={destination.name}
                    type="button"
                    onClick={() => {
                      setSearch(destination.name)
                      setSearchMessage('')
                    }}
                    className="suggestion-button"
                  >
                    {destination.name}
                  </button>

                ))}

              </div>

            </div>

            {/* Stats */}
            <div className="mt-12 flex gap-10">

              <div>
                <p className="text-2xl font-bold">
                  50+
                </p>

                <p className="text-sm text-slate-500 dark:text-slate-400">
                  Destinations
                </p>
              </div>

              <div>
                <p className="text-2xl font-bold">
                  100+
                </p>

                <p className="text-sm text-slate-500 dark:text-slate-400">
                  Activities
                </p>
              </div>

              <div>
                <p className="text-2xl font-bold">
                  24/7
                </p>

                <p className="text-sm text-slate-500 dark:text-slate-400">
                  Planning
                </p>
              </div>

            </div>

          </div>

          {/* Trip Preview */}
          <div className="relative hero-preview">

            <div className="trip-preview-border">

              <div className="trip-preview-card">

                <div className="flex items-center justify-between">

                  <div>

                    <p className="text-sm text-slate-500 dark:text-slate-400">
                      Your next trip
                    </p>

                    <h2 className="mt-1 text-2xl font-bold">
                      Paris 🇫🇷
                    </h2>

                  </div>

                  <div className="text-4xl">
                    🗼
                  </div>

                </div>

                {/* Weather */}
                <div className="mt-6 flex items-center justify-between rounded-2xl bg-blue-50 p-5 dark:bg-blue-950/50">

                  <div>

                    <p className="text-sm text-slate-500 dark:text-slate-400">
                      Today
                    </p>

                    <p className="mt-1 text-3xl font-bold">
                      24°C
                    </p>

                    <p className="text-sm text-slate-500 dark:text-slate-400">
                      Sunny
                    </p>

                  </div>

                  <div className="text-5xl">
                    ☀️
                  </div>

                </div>

                {/* Details */}
                <div className="mt-5 grid grid-cols-2 gap-4">

                  <div className="rounded-xl bg-slate-50 p-4 dark:bg-slate-800/80">

                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      Duration
                    </p>

                    <p className="mt-1 font-bold">
                      7 Days
                    </p>

                  </div>

                  <div className="rounded-xl bg-slate-50 p-4 dark:bg-slate-800/80">

                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      Budget
                    </p>

                    <p className="mt-1 font-bold">
                      ₹45,000
                    </p>

                  </div>

                </div>

                {/* Progress */}
                <div className="mt-5">

                  <div className="mb-2 flex justify-between text-sm">

                    <span className="text-slate-500 dark:text-slate-400">
                      Trip planning
                    </span>

                    <span className="font-semibold">
                      75%
                    </span>

                  </div>

                  <div className="h-2 overflow-hidden rounded-full bg-slate-200 dark:bg-slate-700">

                    <div className="progress-bar" />

                  </div>

                </div>

              </div>

            </div>

            {/* Floating Card */}
            <div className="floating-card">

              <p className="text-xs text-slate-500 dark:text-slate-400">
                ✨ Trip planned
              </p>

              <p className="mt-1 font-bold">
                8 activities added
              </p>

            </div>

          </div>

        </div>

      </section>

      {/* Features */}
      <section
        id="features"
        className="relative py-20"
      >

        <div className="mx-auto max-w-7xl px-6">

          <div className="mx-auto max-w-2xl text-center">

            <span className="text-sm font-bold uppercase tracking-wider text-blue-600">
              Everything you need
            </span>

            <h2 className="mt-3 text-3xl font-bold md:text-4xl">
              Your complete travel companion
            </h2>

            <p className="mt-4 text-slate-600 dark:text-slate-400">
              Plan every part of your journey without jumping
              between different apps.
            </p>

          </div>

          <div className="mt-12 grid gap-6 md:grid-cols-3">

            {/* Feature 1 */}
            <div className="feature-card">

              <div className="feature-icon bg-blue-100 dark:bg-blue-950/70">
                🗓️
              </div>

              <h3 className="mt-6 text-xl font-bold">
                Smart Itinerary
              </h3>

              <p className="mt-3 leading-7 text-slate-600 dark:text-slate-400">
                Organize your activities day by day and create
                the perfect travel schedule.
              </p>

            </div>

            {/* Feature 2 */}
            <div className="feature-card">

              <div className="feature-icon bg-cyan-100 dark:bg-cyan-950/70">
                🌤️
              </div>

              <h3 className="mt-6 text-xl font-bold">
                Live Weather
              </h3>

              <p className="mt-3 leading-7 text-slate-600 dark:text-slate-400">
                Check weather conditions for your destination
                before planning your activities.
              </p>

            </div>

            {/* Feature 3 */}
            <div className="feature-card">

              <div className="feature-icon bg-emerald-100 dark:bg-emerald-950/70">
                💰
              </div>

              <h3 className="mt-6 text-xl font-bold">
                Budget Tracker
              </h3>

              <p className="mt-3 leading-7 text-slate-600 dark:text-slate-400">
                Track your travel expenses and stay within your
                planned budget.
              </p>

            </div>

          </div>

        </div>

      </section>

      {/* Destinations */}
      <section
        id="destinations"
        className="relative py-20"
      >

        <div className="mx-auto max-w-7xl px-6">

          <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">

            <div>

              <span className="text-sm font-bold uppercase tracking-wider text-blue-600">
                Get inspired
              </span>

              <h2 className="mt-2 text-3xl font-bold md:text-4xl">
                Popular destinations
              </h2>

              <p className="mt-3 max-w-xl text-slate-600 dark:text-slate-400">
                Discover places travelers love and start planning
                your next unforgettable adventure.
              </p>

            </div>

            <Link
              to="/create-trip"
              className="font-semibold text-blue-600 transition hover:text-blue-700"
            >
              Plan a new trip →
            </Link>

          </div>

          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">

            {destinations.map((destination) => (

              <div
                key={destination.name}
                className="destination-card"
              >

                <div className="relative h-52 overflow-hidden">

                  <img
                    src={destination.image}
                    alt={`${destination.name}, ${destination.country}`}
                    className="h-full w-full object-cover"
                  />

                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

                  <div className="absolute right-4 top-4 rounded-full bg-white/95 px-3 py-1.5 text-sm font-bold text-slate-800 shadow-lg">
                    ⭐ {destination.rating}
                  </div>

                  <div className="absolute bottom-4 left-5 text-white">

                    <h3 className="text-2xl font-bold drop-shadow">
                      {destination.name}
                    </h3>

                    <p className="mt-1 text-sm font-medium">
                      {destination.country}
                    </p>

                  </div>

                </div>

                <div className="p-5">

                  <p className="min-h-[48px] text-sm leading-6 text-slate-600 dark:text-slate-400">
                    {destination.description}
                  </p>

                  <div className="mt-4 flex items-center justify-between">

                    <div>

                      <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                        Budget
                      </p>

                      <p className="mt-1 font-bold text-emerald-600">
                        {destination.budget}
                      </p>

                    </div>

                    <span className="text-sm text-slate-400">
                      Popular
                    </span>

                  </div>

                  <button
                    type="button"
                    onClick={() =>
                      handlePlanDestination(destination.name)
                    }
                    className="mt-5 block w-full rounded-xl bg-blue-600 py-3 text-center font-semibold text-white transition hover:-translate-y-0.5 hover:bg-blue-700 hover:shadow-lg hover:shadow-blue-600/20"
                  >
                    Plan Trip ✈️
                  </button>

                </div>

              </div>

            ))}

          </div>

        </div>

      </section>

      {/* CTA */}
      <section className="relative px-6 py-20">

        <div className="mx-auto max-w-7xl">

          <div className="cta-box flex flex-col items-center justify-center text-center">

            <h2 className="text-3xl font-bold md:text-5xl">
              Ready for your next adventure?
            </h2>

            <p className="mx-auto mt-5 max-w-2xl text-center text-blue-100">
              Start planning your dream trip today and keep
              everything organized in one beautiful place.
            </p>

            <Link
              to="/create-trip"
              className="mt-8 inline-block rounded-xl bg-white px-7 py-3.5 font-bold text-blue-600 transition hover:-translate-y-1 hover:bg-blue-50 hover:shadow-xl"
            >
              Create Your Trip ✈️
            </Link>

          </div>

        </div>

      </section>

      {/* Footer */}
      <footer className="border-t border-slate-200/70 bg-white/60 backdrop-blur-xl dark:border-slate-800/70 dark:bg-slate-950/60">

        <div className="mx-auto flex max-w-7xl flex-col gap-4 px-6 py-8 text-center md:flex-row md:items-center md:justify-between md:text-left">

          <div>

            <p className="text-lg font-bold">
              Trail<span className="text-blue-600">blaze</span> ✈️
            </p>

            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
              Discover. Plan. Go.
            </p>

          </div>

          <p className="text-sm text-slate-500 dark:text-slate-400">
            © 2026 Trailblaze. Built with React & Tailwind CSS.
          </p>

        </div>

      </footer>

    </div>
  )
}

export default Home
