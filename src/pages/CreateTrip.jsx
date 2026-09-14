import { useState } from 'react'
import {
  Link,
  useNavigate,
  useSearchParams,
} from 'react-router-dom'
import ThemeToggle from '../components/ThemeToggle'

function CreateTrip() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()

  const destinationFromUrl =
    searchParams.get('destination') || ''

  const [tripName, setTripName] = useState('')
  const [destination, setDestination] = useState(
    destinationFromUrl
  )
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')
  const [travelers, setTravelers] = useState(1)
  const [budget, setBudget] = useState('')

  const [error, setError] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()

    setError('')

    if (!tripName.trim()) {
      setError('Please enter a trip name.')
      return
    }

    if (!destination.trim()) {
      setError('Please enter a destination.')
      return
    }

    if (!startDate || !endDate) {
      setError('Please select your travel dates.')
      return
    }

    if (endDate < startDate) {
      setError(
        'End date cannot be before the start date.'
      )
      return
    }

    if (Number(budget) <= 0) {
      setError(
        'Please enter a budget greater than ₹0.'
      )
      return
    }

    if (Number(travelers) < 1) {
      setError(
        'There must be at least one traveler.'
      )
      return
    }

    const newTrip = {
      id: Date.now(),
      tripName: tripName.trim(),
      destination: destination.trim(),
      startDate,
      endDate,
      travelers: Number(travelers),
      budget: Number(budget),
      activities: [],
      expenses: [],
    }

    const existingTrips =
      JSON.parse(localStorage.getItem('trips')) || []

    const updatedTrips = [
      ...existingTrips,
      newTrip,
    ]

    localStorage.setItem(
      'trips',
      JSON.stringify(updatedTrips)
    )

    navigate(`/trip/${newTrip.id}`)
  }

  return (
    <div className="min-h-screen px-5 py-8 sm:px-8">

      <div className="mx-auto max-w-5xl">

        {/* =========================
            NAVBAR
        ========================= */}

        <header className="mb-10 flex items-center justify-between">

          <Link
            to="/"
            className="flex items-center gap-3"
          >

            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-600 via-pink-500 to-orange-400 text-xl shadow-lg shadow-purple-500/20">
              ✈️
            </div>

            <div>

              <div className="text-xl font-extrabold text-white">
                Trail<span className="gradient-text">blaze</span>
              </div>

              <div className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/35">
                Travel Planner
              </div>

            </div>

          </Link>


          <div className="flex items-center gap-3">

            <ThemeToggle />

            <Link
              to="/my-trips"
              className="rounded-xl border border-white/10 bg-white/[0.05] px-4 py-2.5 text-sm font-bold text-white/70 backdrop-blur-xl transition hover:bg-white/10 hover:text-white sm:px-5"
            >
              My Trips
            </Link>

          </div>

        </header>


        {/* =========================
            HERO
        ========================= */}

        <div className="glass mb-7 p-7 sm:p-10">

          <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">

            <div>

              <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-purple-400/20 bg-purple-500/10 px-3 py-1.5">

                <span className="h-2 w-2 rounded-full bg-purple-400 shadow-[0_0_10px_rgba(168,85,247,0.8)]" />

                <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-purple-300">
                  Trip Planner
                </span>

              </div>

              <h1 className="text-4xl font-black tracking-tight text-white sm:text-5xl">
                Plan your{' '}
                <span className="gradient-text">
                  adventure
                </span>
              </h1>

              <p className="mt-4 max-w-2xl text-sm leading-7 text-white/45 sm:text-base">
                Create your trip, organize your itinerary,
                track your budget, and turn your travel idea
                into an unforgettable adventure.
              </p>

            </div>


            <div className="hidden h-24 w-24 items-center justify-center rounded-[28px] border border-white/10 bg-white/[0.05] text-5xl shadow-2xl sm:flex">
              🧳
            </div>

          </div>

        </div>


        {/* =========================
            FORM
        ========================= */}

        <form
          onSubmit={handleSubmit}
          className="glass overflow-visible"
        >

          {/* FORM TOP */}

          <div className="relative overflow-hidden border-b border-white/10 bg-gradient-to-br from-violet-600/30 via-pink-500/20 to-orange-400/10 px-7 py-7 sm:px-10">

            <div className="absolute -right-20 -top-32 h-72 w-72 rounded-full bg-pink-500/20 blur-3xl" />

            <div className="absolute -bottom-32 -left-20 h-72 w-72 rounded-full bg-violet-500/20 blur-3xl" />

            <div className="relative">

              <div className="flex items-center gap-3">

                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/10 text-lg backdrop-blur-md">
                  01
                </div>

                <div>

                  <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-pink-300">
                    New Adventure
                  </p>

                  <h2 className="mt-1 text-xl font-extrabold text-white">
                    Tell us about your trip
                  </h2>

                </div>

              </div>

              <p className="mt-4 text-sm text-white/45">
                Give us a few details and we'll create
                your personal travel workspace.
              </p>

            </div>

          </div>


          {/* FORM BODY */}

          <div className="p-7 sm:p-10">

            {/* ERROR */}

            {error && (

              <div className="mb-8 flex items-start gap-3 rounded-2xl border border-red-400/20 bg-red-500/10 p-4">

                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-red-500/10">
                  ⚠️
                </div>

                <div>

                  <p className="font-bold text-red-300">
                    Something needs attention
                  </p>

                  <p className="mt-1 text-sm text-red-200/60">
                    {error}
                  </p>

                </div>

              </div>

            )}


            {/* TRIP NAME */}

            <div className="mb-7">

              <label
                htmlFor="tripName"
                className="mb-2 block text-sm font-bold text-white"
              >
                Trip Name
              </label>

              <p className="mb-3 text-xs text-white/35">
                Give your adventure a memorable name.
              </p>

              <input
                id="tripName"
                type="text"
                value={tripName}
                onChange={(e) =>
                  setTripName(e.target.value)
                }
                placeholder="My Dream Vacation"
                required
                className="w-full px-4 py-3.5"
              />

            </div>


            {/* DESTINATION */}

            <div className="mb-7">

              <label
                htmlFor="destination"
                className="mb-2 block text-sm font-bold text-white"
              >
                Destination
              </label>

              <p className="mb-3 text-xs text-white/35">
                Where are you heading?
              </p>

              <div className="relative">

                <span className="pointer-events-none absolute left-4 top-1/2 z-10 -translate-y-1/2 text-lg">
                  📍
                </span>

                <input
                  id="destination"
                  type="text"
                  value={destination}
                  onChange={(e) =>
                    setDestination(e.target.value)
                  }
                  placeholder="Paris, France"
                  required
                  className="w-full py-3.5 pl-12 pr-4"
                />

              </div>

            </div>


            {/* DATES */}

            <div className="mb-7">

              <div className="mb-3">

                <label className="block text-sm font-bold text-white">
                  Travel Dates
                </label>

                <p className="mt-1 text-xs text-white/35">
                  When does your adventure begin and end?
                </p>

              </div>


              <div className="grid gap-5 md:grid-cols-2">

                <div>

                  <label
                    htmlFor="startDate"
                    className="mb-2 block text-xs font-bold uppercase tracking-wider text-white/40"
                  >
                    Start Date
                  </label>

                  <input
                    id="startDate"
                    type="date"
                    value={startDate}
                    onChange={(e) =>
                      setStartDate(e.target.value)
                    }
                    required
                    className="w-full px-4 py-3.5"
                  />

                </div>


                <div>

                  <label
                    htmlFor="endDate"
                    className="mb-2 block text-xs font-bold uppercase tracking-wider text-white/40"
                  >
                    End Date
                  </label>

                  <input
                    id="endDate"
                    type="date"
                    min={startDate}
                    value={endDate}
                    onChange={(e) =>
                      setEndDate(e.target.value)
                    }
                    required
                    className="w-full px-4 py-3.5"
                  />

                </div>

              </div>

            </div>


            {/* TRAVELERS + BUDGET */}

            <div className="mb-8 grid gap-5 md:grid-cols-2">

              {/* TRAVELERS */}

              <div>

                <label
                  htmlFor="travelers"
                  className="mb-2 block text-sm font-bold text-white"
                >
                  Travelers
                </label>

                <p className="mb-3 text-xs text-white/35">
                  How many people are going?
                </p>

                <div className="relative">

                  <span className="pointer-events-none absolute left-4 top-1/2 z-10 -translate-y-1/2 text-lg">
                    👥
                  </span>

                  <input
                    id="travelers"
                    type="number"
                    min="1"
                    value={travelers}
                    onChange={(e) =>
                      setTravelers(e.target.value)
                    }
                    required
                    className="w-full py-3.5 pl-12 pr-4"
                  />

                </div>

              </div>


              {/* BUDGET */}

              <div>

                <label
                  htmlFor="budget"
                  className="mb-2 block text-sm font-bold text-white"
                >
                  Budget
                </label>

                <p className="mb-3 text-xs text-white/35">
                  Your total estimated trip budget.
                </p>

                <div className="relative">

                  <span className="pointer-events-none absolute left-4 top-1/2 z-10 -translate-y-1/2 font-bold text-pink-300">
                    ₹
                  </span>

                  <input
                    id="budget"
                    type="number"
                    min="1"
                    value={budget}
                    onChange={(e) =>
                      setBudget(e.target.value)
                    }
                    placeholder="50000"
                    required
                    className="w-full py-3.5 pl-10 pr-4"
                  />

                </div>

              </div>

            </div>


            {/* INFO */}

            <div className="mb-8 rounded-2xl border border-cyan-400/10 bg-cyan-400/[0.05] p-5">

              <div className="flex gap-4">

                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-cyan-400/10">
                  💡
                </div>

                <div>

                  <p className="font-bold text-cyan-200">
                    What's next?
                  </p>

                  <p className="mt-1 text-sm leading-6 text-white/40">
                    After creating your trip, you can add
                    activities, track expenses, and see
                    live weather for your destination.
                  </p>

                </div>

              </div>

            </div>


            {/* ACTIONS */}

            <div className="flex flex-col-reverse gap-3 sm:flex-row">

              <Link
                to="/my-trips"
                className="flex-1 rounded-xl border border-white/10 bg-white/[0.05] py-4 text-center font-bold text-white/60 transition hover:bg-white/10 hover:text-white"
              >
                Cancel
              </Link>


              <button
                type="submit"
                className="btn-gradient flex-1 rounded-xl py-4 font-extrabold"
              >
                Create Trip
                <span className="ml-2">
                  ✈️
                </span>
              </button>

            </div>

          </div>

        </form>


        {/* FOOTER */}

        <div className="py-8 text-center">

          <p className="text-xs text-white/20">
            Your adventure starts with a single destination.
            🌎
          </p>

          <p className="mt-2 text-xs font-semibold text-white/15">
            Trailblaze ✈️
          </p>

        </div>

      </div>

    </div>
  )
}

export default CreateTrip
