import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import ThemeToggle from '../components/ThemeToggle'

function getTripById(id) {
  const savedTrips =
    JSON.parse(localStorage.getItem('trips')) || []

  return savedTrips.find(
    (item) => item.id.toString() === id.toString()
  )
}

function TripDetails() {
  const { id } = useParams()

  const [trip, setTrip] = useState(() =>
    getTripById(id)
  )

  // =========================================================
  // SUCCESS TOAST
  // =========================================================

  const [toast, setToast] = useState({
    show: false,
    message: '',
  })

  const showSuccessToast = (message) => {
    setToast({
      show: true,
      message,
    })
  }

  const closeSuccessToast = () => {
    setToast({
      show: false,
      message: '',
    })
  }

  useEffect(() => {
    if (!toast.show) return

    const timer = setTimeout(() => {
      closeSuccessToast()
    }, 3000)

    return () => clearTimeout(timer)
  }, [toast.show])

  // =========================================================
  // EDIT TRIP
  // =========================================================

  const [showEditTripForm, setShowEditTripForm] =
    useState(false)

  const [editTripName, setEditTripName] = useState('')
  const [editDestination, setEditDestination] = useState('')
  const [editStartDate, setEditStartDate] = useState('')
  const [editEndDate, setEditEndDate] = useState('')
  const [editTravelers, setEditTravelers] = useState('')
  const [editBudget, setEditBudget] = useState('')

  // =========================================================
  // ACTIVITY
  // =========================================================

  const [showActivityForm, setShowActivityForm] =
    useState(false)

  const [editingActivityId, setEditingActivityId] =
    useState(null)

  const [activityName, setActivityName] = useState('')
  const [activityDate, setActivityDate] = useState('')
  const [activityTime, setActivityTime] = useState('')
  const [activityLocation, setActivityLocation] =
    useState('')

  // =========================================================
  // EXPENSE
  // =========================================================

  const [showExpenseForm, setShowExpenseForm] =
    useState(false)

  const [expenseName, setExpenseName] = useState('')
  const [expenseAmount, setExpenseAmount] = useState('')

  // =========================================================
  // WEATHER
  // =========================================================

  const [weather, setWeather] = useState(null)
  const [weatherLoading, setWeatherLoading] =
    useState(false)

  const [weatherError, setWeatherError] = useState('')

  // =========================================================
  // DELETE MODAL
  // =========================================================

  const [showDeleteModal, setShowDeleteModal] =
    useState(false)

  const [deleteType, setDeleteType] = useState(null)
  const [deleteItem, setDeleteItem] = useState(null)
  const [deletingId, setDeletingId] = useState(null)

  // =========================================================
  // WEATHER
  // =========================================================

  useEffect(() => {
    if (!trip?.destination) return

    const getWeather = async () => {
      try {
        setWeatherLoading(true)
        setWeatherError('')
        setWeather(null)

        const destination =
          trip.destination.trim()

        const geoResponse = await fetch(
          `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(
            destination
          )}&count=10&language=en&format=json`
        )

        if (!geoResponse.ok) {
          throw new Error(
            'Unable to search destination'
          )
        }

        const geoData = await geoResponse.json()

        if (!geoData.results?.length) {
          throw new Error(
            `Destination "${destination}" could not be found`
          )
        }

        const indiaResult =
          geoData.results.find(
            (location) =>
              location.country_code?.toUpperCase() ===
              'IN'
          )

        const location =
          indiaResult || geoData.results[0]

        const weatherResponse = await fetch(
          `https://api.open-meteo.com/v1/forecast?latitude=${location.latitude}&longitude=${location.longitude}&current=temperature_2m,relative_humidity_2m,apparent_temperature,weather_code,wind_speed_10m&daily=weather_code,temperature_2m_max,temperature_2m_min,precipitation_probability_max&timezone=auto&forecast_days=7`
        )

        if (!weatherResponse.ok) {
          throw new Error(
            'Unable to get weather'
          )
        }

        const weatherData =
          await weatherResponse.json()

        if (!weatherData.current) {
          throw new Error(
            'Weather data unavailable'
          )
        }

        setWeather({
          city: location.name,
          country: location.country,

          temperature:
            weatherData.current.temperature_2m,

          feelsLike:
            weatherData.current.apparent_temperature,

          humidity:
            weatherData.current.relative_humidity_2m,

          windSpeed:
            weatherData.current.wind_speed_10m,

          weatherCode:
            weatherData.current.weather_code,

          forecast:
            weatherData.daily?.time?.map(
              (date, index) => ({
                date,

                weatherCode:
                  weatherData.daily
                    .weather_code?.[index],

                max:
                  weatherData.daily
                    .temperature_2m_max?.[index],

                min:
                  weatherData.daily
                    .temperature_2m_min?.[index],

                rain:
                  weatherData.daily
                    .precipitation_probability_max?.[
                    index
                  ],
              })
            ) || [],
        })
      } catch (error) {
        console.error(
          'Weather error:',
          error
        )

        setWeatherError(
          error.message ||
            'Could not load weather for this destination.'
        )
      } finally {
        setWeatherLoading(false)
      }
    }

    getWeather()
  }, [trip?.destination])

  // =========================================================
  // WEATHER INFO
  // =========================================================

  const getWeatherInfo = (code) => {
    if (code === 0)
      return {
        icon: '☀️',
        text: 'Clear sky',
      }

    if (code === 1)
      return {
        icon: '🌤️',
        text: 'Mainly clear',
      }

    if (code === 2)
      return {
        icon: '⛅',
        text: 'Partly cloudy',
      }

    if (code === 3)
      return {
        icon: '☁️',
        text: 'Overcast',
      }

    if (code === 45 || code === 48)
      return {
        icon: '🌫️',
        text: 'Foggy',
      }

    if (code >= 51 && code <= 57)
      return {
        icon: '🌦️',
        text: 'Drizzle',
      }

    if (code >= 61 && code <= 67)
      return {
        icon: '🌧️',
        text: 'Rain',
      }

    if (code >= 71 && code <= 77)
      return {
        icon: '❄️',
        text: 'Snow',
      }

    if (code >= 80 && code <= 82)
      return {
        icon: '🌦️',
        text: 'Rain showers',
      }

    if (code >= 85 && code <= 86)
      return {
        icon: '🌨️',
        text: 'Snow showers',
      }

    if (code >= 95 && code <= 99)
      return {
        icon: '⛈️',
        text: 'Thunderstorm',
      }

    return {
      icon: '🌤️',
      text: 'Unknown',
    }
  }

  // =========================================================
  // SAVE TRIP
  // =========================================================

  const saveTrip = (updatedTrip) => {
    const savedTrips =
      JSON.parse(localStorage.getItem('trips')) || []

    const updatedTrips = savedTrips.map((item) => {
      if (
        item.id.toString() === id.toString()
      ) {
        return updatedTrip
      }

      return item
    })

    localStorage.setItem(
      'trips',
      JSON.stringify(updatedTrips)
    )

    setTrip(updatedTrip)
  }

  // =========================================================
  // EDIT TRIP
  // =========================================================

  const handleOpenEditTrip = () => {
    setEditTripName(trip.tripName || '')
    setEditDestination(trip.destination || '')
    setEditStartDate(trip.startDate || '')
    setEditEndDate(trip.endDate || '')
    setEditTravelers(trip.travelers || '')
    setEditBudget(trip.budget || '')

    setShowEditTripForm(true)

    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    })
  }

  const handleSaveTrip = (e) => {
    e.preventDefault()

    if (!editTripName.trim()) {
      alert('Please enter a trip name.')
      return
    }

    if (!editDestination.trim()) {
      alert('Please enter a destination.')
      return
    }

    if (!editStartDate || !editEndDate) {
      alert(
        'Please select both travel dates.'
      )
      return
    }

    if (editEndDate < editStartDate) {
      alert(
        'End date cannot be before start date.'
      )
      return
    }

    if (
      !editTravelers ||
      Number(editTravelers) < 1
    ) {
      alert(
        'Travelers must be at least 1.'
      )
      return
    }

    if (
      editBudget === '' ||
      Number(editBudget) < 0
    ) {
      alert(
        'Budget cannot be negative.'
      )
      return
    }

    const updatedTrip = {
      ...trip,

      tripName:
        editTripName.trim(),

      destination:
        editDestination.trim(),

      startDate:
        editStartDate,

      endDate:
        editEndDate,

      travelers:
        Number(editTravelers),

      budget:
        Number(editBudget),
    }

    saveTrip(updatedTrip)

    setShowEditTripForm(false)

    // IMPORTANT:
    // No popup / alert here.
    // Only the success toast appears.
    showSuccessToast(
      'Trip details updated successfully!'
    )
  }

  // =========================================================
  // ACTIVITY
  // =========================================================

  const resetActivityForm = () => {
    setActivityName('')
    setActivityDate('')
    setActivityTime('')
    setActivityLocation('')
    setEditingActivityId(null)
    setShowActivityForm(false)
  }

  const handleActivitySubmit = (e) => {
    e.preventDefault()

    if (!activityName.trim()) {
      alert(
        'Please enter an activity name.'
      )
      return
    }

    if (!activityDate) {
      alert('Please select a date.')
      return
    }

    let updatedActivities = [
      ...(trip.activities || []),
    ]

    if (editingActivityId !== null) {
      updatedActivities =
        updatedActivities.map(
          (activity) => {
            if (
              activity.id.toString() ===
              editingActivityId.toString()
            ) {
              return {
                ...activity,

                name:
                  activityName.trim(),

                date:
                  activityDate,

                time:
                  activityTime,

                location:
                  activityLocation.trim(),
              }
            }

            return activity
          }
        )
    } else {
      updatedActivities.push({
        id: Date.now(),

        name:
          activityName.trim(),

        date:
          activityDate,

        time:
          activityTime,

        location:
          activityLocation.trim(),
      })
    }

    saveTrip({
      ...trip,
      activities:
        updatedActivities,
    })

    resetActivityForm()
  }

  const handleEditActivity = (activity) => {
    setEditingActivityId(
      activity.id.toString()
    )

    setActivityName(
      activity.name || ''
    )

    setActivityDate(
      activity.date || ''
    )

    setActivityTime(
      activity.time || ''
    )

    setActivityLocation(
      activity.location || ''
    )

    setShowActivityForm(true)

    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    })
  }

  // =========================================================
  // DELETE
  // =========================================================

  const openDeleteModal = (
    type,
    item
  ) => {
    setDeleteType(type)
    setDeleteItem(item)
    setShowDeleteModal(true)
  }

  const closeDeleteModal = () => {
    if (deletingId !== null) return

    setShowDeleteModal(false)
    setDeleteType(null)
    setDeleteItem(null)
  }

  const confirmDelete = () => {
    if (!deleteItem) return

    setDeletingId(deleteItem.id)

    setTimeout(() => {
      if (deleteType === 'activity') {
        const updatedActivities =
          (
            trip.activities || []
          ).filter(
            (activity) =>
              activity.id.toString() !==
              deleteItem.id.toString()
          )

        saveTrip({
          ...trip,
          activities:
            updatedActivities,
        })
      }

      if (deleteType === 'expense') {
        const updatedExpenses =
          (
            trip.expenses || []
          ).filter(
            (expense) =>
              expense.id.toString() !==
              deleteItem.id.toString()
          )

        saveTrip({
          ...trip,
          expenses:
            updatedExpenses,
        })
      }

      setDeletingId(null)
      setShowDeleteModal(false)
      setDeleteType(null)
      setDeleteItem(null)
    }, 450)
  }

  // =========================================================
  // EXPENSE
  // =========================================================

  const handleAddExpense = (e) => {
    e.preventDefault()

    if (!expenseName.trim()) {
      alert(
        'Please enter an expense name.'
      )
      return
    }

    if (
      !expenseAmount ||
      Number(expenseAmount) <= 0
    ) {
      alert(
        'Please enter a valid amount.'
      )
      return
    }

    const newExpense = {
      id: Date.now(),

      name:
        expenseName.trim(),

      amount:
        Number(expenseAmount),
    }

    saveTrip({
      ...trip,

      expenses: [
        ...(trip.expenses || []),
        newExpense,
      ],
    })

    setExpenseName('')
    setExpenseAmount('')
    setShowExpenseForm(false)
  }

  // =========================================================
  // TRIP NOT FOUND
  // =========================================================

  if (!trip) {
    return (
      <div className="flex min-h-screen items-center justify-center px-6">
        <div className="glass theme-glow w-full max-w-md p-10 text-center">

          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-purple-500/10 text-5xl">
            🧳
          </div>

          <h1 className="gradient-text mt-6 text-3xl font-extrabold">
            Trip not found
          </h1>

          <p className="mt-3 text-[#aaa7c4]">
            We couldn't find this trip in your saved trips.
          </p>

          <Link
            to="/my-trips"
            className="btn-gradient mt-7 inline-flex rounded-xl px-6 py-3 font-bold"
          >
            ← Back to My Trips
          </Link>

        </div>
      </div>
    )
  }

  // =========================================================
  // CALCULATIONS
  // =========================================================

  const activities =
    trip.activities || []

  const expenses =
    trip.expenses || []

  const totalSpent =
    expenses.reduce(
      (total, expense) =>
        total +
        Number(
          expense.amount || 0
        ),
      0
    )

  const totalBudget =
    Number(trip.budget) || 0

  const remainingBudget =
    totalBudget - totalSpent

  const budgetPercentage =
    totalBudget > 0
      ? Math.min(
          (totalSpent /
            totalBudget) *
            100,
          100
        )
      : 0

  // =========================================================
  // DATE STATUS
  // =========================================================

  const getDateOnly = (
    dateString
  ) => {
    const [
      year,
      month,
      day,
    ] =
      dateString
        .split('-')
        .map(Number)

    return new Date(
      year,
      month - 1,
      day
    )
  }

  const today = new Date()

  today.setHours(
    0,
    0,
    0,
    0
  )

  const startDate =
    trip.startDate
      ? getDateOnly(
          trip.startDate
        )
      : null

  const endDate =
    trip.endDate
      ? getDateOnly(
          trip.endDate
        )
      : null

  let totalDays = 0
  let daysRemaining = 0

  let tripStatus =
    'upcoming'

  let tripStatusText =
    'Upcoming'

  let tripStatusDescription =
    ''

  if (
    startDate &&
    endDate
  ) {
    const millisecondsPerDay =
      1000 *
      60 *
      60 *
      24

    totalDays =
      Math.round(
        (endDate -
          startDate) /
          millisecondsPerDay
      ) + 1

    if (
      today < startDate
    ) {
      tripStatus =
        'upcoming'

      tripStatusText =
        'Upcoming'

      daysRemaining =
        Math.ceil(
          (startDate -
            today) /
            millisecondsPerDay
        )

      tripStatusDescription =
        daysRemaining === 1
          ? 'Starts tomorrow'
          : `Starts in ${daysRemaining} days`
    } else if (
      today > endDate
    ) {
      tripStatus =
        'completed'

      tripStatusText =
        'Completed'

      tripStatusDescription =
        'Trip completed'
    } else {
      tripStatus =
        'ongoing'

      tripStatusText =
        'Ongoing'

      daysRemaining =
        Math.ceil(
          (endDate -
            today) /
            millisecondsPerDay
        )

      if (
        today.getTime() ===
        startDate.getTime()
      ) {
        tripStatusDescription =
          'Trip starts today'
      } else if (
        today.getTime() ===
        endDate.getTime()
      ) {
        tripStatusDescription =
          'Trip ends today'
      } else {
        tripStatusDescription =
          `${daysRemaining} days remaining`
      }
    }
  }

  // =========================================================
  // GROUP ACTIVITIES
  // =========================================================

  const groupedActivities =
    activities.reduce(
      (groups, activity) => {
        if (
          !groups[activity.date]
        ) {
          groups[activity.date] =
            []
        }

        groups[
          activity.date
        ].push(activity)

        return groups
      },
      {}
    )

  const sortedDates =
    Object.keys(
      groupedActivities
    ).sort()

  // =========================================================
  // WEATHER
  // =========================================================

  const weatherInfo =
    weather
      ? getWeatherInfo(
          weather.weatherCode
        )
      : null

  const formatForecastDate = (
    date
  ) => {
    return new Date(
      `${date}T00:00:00`
    ).toLocaleDateString(
      'en-US',
      {
        weekday: 'short',
        month: 'short',
        day: 'numeric',
      }
    )
  }

  // =========================================================
  // UI
  // =========================================================

  return (
    <div className="min-h-screen bg-transparent text-white">

      {/* =====================================================
          SUCCESS TOAST
      ===================================================== */}

      {toast.show && (
        <div className="fixed right-5 top-5 z-[100] animate-[slideIn_.4s_ease-out]">

          <div className="flex min-w-[300px] items-center gap-4 rounded-2xl border border-emerald-200 bg-white px-5 py-4 shadow-2xl">

            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-2xl animate-[pop_.4s_ease-out]">
              ✓
            </div>

            <div className="flex-1">

              <p className="font-bold text-slate-900">
                Success!
              </p>

              <p className="mt-1 text-sm text-slate-500">
                {toast.message}
              </p>

            </div>

            <button
              type="button"
              onClick={
                closeSuccessToast
              }
              className="text-slate-400 transition hover:text-slate-700"
            >
              ✕
            </button>

          </div>

        </div>
      )}

      {/* =====================================================
          HEADER
      ===================================================== */}

      <header className="sticky top-0 z-40 border-b border-white/10 bg-[#07051a]/70 backdrop-blur-2xl">

        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-5 py-4 md:px-8">

          <Link
            to="/"
            className="text-2xl font-extrabold tracking-tight"
          >
            <span className="gradient-text">
              Trailblaze
            </span>{' '}
            ✈️
          </Link>

          <div className="flex items-center gap-3">

            <ThemeToggle />

            <Link
              to="/my-trips"
              className="rounded-xl border border-white/10 bg-white/[0.06] px-5 py-3 font-semibold text-white backdrop-blur-xl hover:border-pink-400/40 hover:bg-white/[0.1]"
            >
              ← My Trips
            </Link>

          </div>

        </div>

      </header>

      {/* =====================================================
          MAIN
      ===================================================== */}

      <main className="mx-auto max-w-7xl px-5 py-10 md:px-8 md:py-14">

        {/* PAGE INTRO */}

        <div className="mb-8">

          <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-purple-400/20 bg-purple-500/10 px-4 py-2 text-sm font-semibold text-purple-300 backdrop-blur-xl">
            ✨ Your Adventure
          </div>

          <p className="text-sm font-semibold uppercase tracking-[0.25em] text-[#77738f]">
            Trip Details
          </p>

          <h1 className="gradient-text mt-2 text-4xl font-extrabold tracking-tight md:text-6xl">
            {trip.tripName}
          </h1>

          <p className="mt-3 text-lg text-[#aaa7c4]">
            📍 {trip.destination}
          </p>

        </div>

        {/* HERO */}

        <section className="glass theme-glow overflow-hidden p-7 md:p-10">

          <div className="relative z-10 flex flex-col gap-8 md:flex-row md:items-center md:justify-between">

            <div>

              <div className="flex flex-wrap items-center gap-3">

                <span className="text-sm font-semibold uppercase tracking-[0.2em] text-purple-300">
                  Trip Status
                </span>

                <span
                  className={`inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-bold ${
                    tripStatus ===
                    'ongoing'
                      ? 'border-emerald-400/30 bg-emerald-400/10 text-emerald-300'
                      : tripStatus ===
                          'completed'
                        ? 'border-white/10 bg-white/10 text-gray-300'
                        : 'border-amber-400/30 bg-amber-400/10 text-amber-300'
                  }`}
                >

                  <span
                    className={`h-2 w-2 rounded-full ${
                      tripStatus ===
                      'ongoing'
                        ? 'bg-emerald-400'
                        : tripStatus ===
                            'completed'
                          ? 'bg-gray-400'
                          : 'bg-amber-400'
                    }`}
                  />

                  {tripStatusText}

                </span>

              </div>

              <h2 className="gradient-text mt-4 text-4xl font-extrabold md:text-5xl">
                {trip.destination}
              </h2>

              <p className="mt-3 text-[#aaa7c4]">
                {tripStatusDescription}
              </p>

            </div>

            <button
              type="button"
              onClick={
                handleOpenEditTrip
              }
              className="btn-gradient rounded-xl px-6 py-3.5 font-bold"
            >
              ✏️ Edit Trip
            </button>

          </div>

        </section>

        {/* EDIT TRIP */}

        {showEditTripForm && (
          <section className="glass mt-8">

            <div className="border-b border-white/10 bg-gradient-to-r from-violet-600/20 via-pink-500/10 to-orange-400/10 px-6 py-7 md:px-8">

              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-purple-300">
                Edit Trip
              </p>

              <h2 className="mt-2 text-2xl font-bold text-white">
                Update your trip details
              </h2>

              <p className="mt-2 text-[#aaa7c4]">
                Make changes to your adventure whenever you need.
              </p>

            </div>

            <form
              onSubmit={
                handleSaveTrip
              }
              className="p-6 md:p-8"
            >

              <div>

                <label
                  htmlFor="edit-trip-name"
                  className="mb-2 block font-bold text-white"
                >
                  Trip Name
                </label>

                <input
                  id="edit-trip-name"
                  type="text"
                  value={
                    editTripName
                  }
                  onChange={(e) =>
                    setEditTripName(
                      e.target.value
                    )
                  }
                  className="w-full px-4 py-3.5"
                />

              </div>

              <div className="mt-6">

                <label
                  htmlFor="edit-destination"
                  className="mb-2 block font-bold text-white"
                >
                  Destination
                </label>

                <input
                  id="edit-destination"
                  type="text"
                  value={
                    editDestination
                  }
                  onChange={(e) =>
                    setEditDestination(
                      e.target.value
                    )
                  }
                  className="w-full px-4 py-3.5"
                />

              </div>

              <div className="mt-6 grid gap-5 md:grid-cols-2">

                <div>

                  <label
                    htmlFor="edit-start-date"
                    className="mb-2 block font-bold text-white"
                  >
                    Start Date
                  </label>

                  <input
                    id="edit-start-date"
                    type="date"
                    value={
                      editStartDate
                    }
                    onChange={(e) =>
                      setEditStartDate(
                        e.target.value
                      )
                    }
                    className="w-full px-4 py-3.5"
                  />

                </div>

                <div>

                  <label
                    htmlFor="edit-end-date"
                    className="mb-2 block font-bold text-white"
                  >
                    End Date
                  </label>

                  <input
                    id="edit-end-date"
                    type="date"
                    min={
                      editStartDate ||
                      undefined
                    }
                    value={
                      editEndDate
                    }
                    onChange={(e) =>
                      setEditEndDate(
                        e.target.value
                      )
                    }
                    className="w-full px-4 py-3.5"
                  />

                </div>

              </div>

              <div className="mt-6 grid gap-5 md:grid-cols-2">

                <div>

                  <label
                    htmlFor="edit-travelers"
                    className="mb-2 block font-bold text-white"
                  >
                    Travelers
                  </label>

                  <input
                    id="edit-travelers"
                    type="number"
                    min="1"
                    value={
                      editTravelers
                    }
                    onChange={(e) =>
                      setEditTravelers(
                        e.target.value
                      )
                    }
                    className="w-full px-4 py-3.5"
                  />

                </div>

                <div>

                  <label
                    htmlFor="edit-budget"
                    className="mb-2 block font-bold text-white"
                  >
                    Budget
                  </label>

                  <div className="relative">

                    <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 font-bold text-purple-300">
                      ₹
                    </span>

                    <input
                      id="edit-budget"
                      type="number"
                      min="0"
                      value={
                        editBudget
                      }
                      onChange={(e) =>
                        setEditBudget(
                          e.target.value
                        )
                      }
                      className="w-full py-3.5 pl-10 pr-4"
                    />

                  </div>

                </div>

              </div>

              <div className="mt-7 flex flex-col-reverse gap-3 sm:flex-row">

                <button
                  type="button"
                  onClick={() =>
                    setShowEditTripForm(
                      false
                    )
                  }
                  className="flex-1 rounded-xl border border-white/10 bg-white/[0.06] py-4 font-bold text-white hover:bg-white/[0.1]"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="btn-gradient flex-1 rounded-xl py-4 font-bold"
                >
                  💾 Save Changes
                </button>

              </div>

            </form>

          </section>
        )}

        {/* ===================================================
            OVERVIEW
        =================================================== */}

        <section className="mt-10">

          <div className="mb-5">

            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-pink-400">
              Trip Overview
            </p>

            <h2 className="mt-1 text-2xl font-bold text-white">
              Everything at a glance
            </h2>

          </div>

          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">

            <div className="glass group p-6">

              <div className="relative z-10">

                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-violet-500/15 text-2xl">
                  🗓️
                </div>

                <p className="mt-5 text-sm font-medium text-[#aaa7c4]">
                  Trip Duration
                </p>

                <p className="mt-1 text-2xl font-extrabold text-white">
                  {totalDays}{' '}
                  {totalDays === 1
                    ? 'Day'
                    : 'Days'}
                </p>

                <p className="mt-1 text-sm text-[#77738f]">
                  {trip.startDate} →{' '}
                  {trip.endDate}
                </p>

              </div>

            </div>

            <div className="glass group p-6">

              <div className="relative z-10">

                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-pink-500/15 text-2xl">
                  ⏳
                </div>

                <p className="mt-5 text-sm font-medium text-[#aaa7c4]">
                  {tripStatus ===
                  'completed'
                    ? 'Trip Status'
                    : 'Days Remaining'}
                </p>

                <p
                  className={`mt-1 text-2xl font-extrabold ${
                    tripStatus ===
                    'completed'
                      ? 'text-gray-300'
                      : tripStatus ===
                          'ongoing'
                        ? 'text-emerald-400'
                        : 'text-amber-400'
                  }`}
                >
                  {tripStatus ===
                  'completed'
                    ? 'Completed'
                    : daysRemaining ===
                        0
                      ? 'Today'
                      : `${daysRemaining} ${
                          daysRemaining ===
                          1
                            ? 'Day'
                            : 'Days'
                        }`}
                </p>

                <p className="mt-1 text-sm text-[#77738f]">
                  {
                    tripStatusDescription
                  }
                </p>

              </div>

            </div>

            <div className="glass group p-6">

              <div className="relative z-10">

                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-cyan-500/15 text-2xl">
                  👥
                </div>

                <p className="mt-5 text-sm font-medium text-[#aaa7c4]">
                  Travelers
                </p>

                <p className="mt-1 text-2xl font-extrabold text-white">
                  {trip.travelers}
                </p>

                <p className="mt-1 text-sm text-[#77738f]">
                  {Number(
                    trip.travelers
                  ) === 1
                    ? 'Traveler'
                    : 'Travelers'}
                </p>

              </div>

            </div>

            <div className="glass group p-6">

              <div className="relative z-10">

                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-amber-500/15 text-2xl">
                  💰
                </div>

                <p className="mt-5 text-sm font-medium text-[#aaa7c4]">
                  Trip Budget
                </p>

                <p className="mt-1 text-2xl font-extrabold text-amber-300">
                  ₹{totalBudget}
                </p>

                <p className="mt-1 text-sm text-[#77738f]">
                  {activities.length}{' '}
                  activities
                </p>

              </div>

            </div>

          </div>

        </section>

        {/* STATUS */}

        {tripStatus ===
          'ongoing' &&
          startDate &&
          today.getTime() ===
            startDate.getTime() && (
            <div className="glass pink-glow mt-6 border-emerald-400/20">

              <div className="flex items-center gap-4 p-5">

                <div className="text-3xl">
                  🎉
                </div>

                <div>

                  <p className="font-bold text-emerald-300">
                    Trip starts today!
                  </p>

                  <p className="mt-1 text-sm text-emerald-200/70">
                    Have an amazing adventure in{' '}
                    {
                      trip.destination
                    }.
                  </p>

                </div>

              </div>

            </div>
          )}

        {tripStatus ===
          'completed' && (
          <div className="glass mt-6">

            <div className="flex items-center gap-4 p-5">

              <div className="text-3xl">
                ✅
              </div>

              <div>

                <p className="font-bold text-white">
                  Trip completed
                </p>

                <p className="mt-1 text-sm text-[#aaa7c4]">
                  Your trip to{' '}
                  {
                    trip.destination
                  }{' '}
                  has been completed.
                </p>

              </div>

            </div>

          </div>
        )}

        {/* ===================================================
            WEATHER
        =================================================== */}

        <section className="glass mt-10">

          <div className="border-b border-white/10 px-6 py-7 md:px-8">

            <div className="flex items-center justify-between gap-4">

              <div>

                <div className="mb-2 inline-flex rounded-full border border-cyan-400/20 bg-cyan-400/10 px-3 py-1 text-xs font-bold text-cyan-300">
                  LIVE WEATHER
                </div>

                <h2 className="text-2xl font-extrabold text-white">
                  Weather forecast
                </h2>

                {weather && (
                  <p className="mt-1 text-sm text-[#77738f]">
                    {weather.city},{' '}
                    {weather.country}
                  </p>
                )}

              </div>

              <div className="text-5xl">
                {weatherInfo?.icon ||
                  '🌤️'}
              </div>

            </div>

          </div>

          <div className="p-6 md:p-8">

            {weatherLoading && (
              <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-10 text-center">

                <div className="animate-pulse text-5xl">
                  🌤️
                </div>

                <p className="mt-4 font-bold text-white">
                  Getting weather for{' '}
                  {
                    trip.destination
                  }
                  ...
                </p>

                <p className="mt-2 text-sm text-[#77738f]">
                  Searching worldwide locations...
                </p>

              </div>
            )}

            {weatherError && (
              <div className="rounded-3xl border border-red-400/20 bg-red-500/10 p-8 text-center">

                <div className="text-5xl">
                  😕
                </div>

                <p className="mt-4 font-bold text-red-300">
                  {weatherError}
                </p>

                <p className="mt-2 text-sm text-red-200/60">
                  Try entering a city or town name such as Coimbatore, Chennai, Mumbai, Delhi, or Paris.
                </p>

              </div>
            )}

            {weather &&
              !weatherLoading && (
                <div>

                  <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-violet-500/15 via-pink-500/10 to-cyan-500/10 p-6 md:p-8">

                    <div className="absolute -right-20 -top-20 h-56 w-56 rounded-full bg-pink-500/10 blur-3xl" />

                    <div className="relative z-10 flex flex-col gap-7 md:flex-row md:items-center md:justify-between">

                      <div>

                        <p className="text-sm font-semibold tracking-[0.2em] text-cyan-300">
                          CURRENT CONDITIONS
                        </p>

                        <h3 className="mt-2 text-2xl font-extrabold text-white">
                          {weather.city},{' '}
                          {weather.country}
                        </h3>

                        <p className="mt-2 text-[#aaa7c4]">
                          {
                            weatherInfo.text
                          }
                        </p>

                      </div>

                      <div className="flex items-center gap-5">

                        <span className="text-7xl">
                          {
                            weatherInfo.icon
                          }
                        </span>

                        <div>

                          <p className="text-5xl font-extrabold text-white">
                            {Math.round(
                              weather.temperature
                            )}
                            °C
                          </p>

                          <p className="mt-1 text-sm text-[#77738f]">
                            Feels like{' '}
                            {Math.round(
                              weather.feelsLike
                            )}
                            °C
                          </p>

                        </div>

                      </div>

                    </div>

                    <div className="relative z-10 mt-7 grid gap-4 sm:grid-cols-2">

                      <div className="rounded-2xl border border-white/10 bg-white/[0.05] p-5">

                        <p className="text-sm text-[#aaa7c4]">
                          💧 Humidity
                        </p>

                        <p className="mt-1 text-2xl font-extrabold text-white">
                          {
                            weather.humidity
                          }
                          %
                        </p>

                      </div>

                      <div className="rounded-2xl border border-white/10 bg-white/[0.05] p-5">

                        <p className="text-sm text-[#aaa7c4]">
                          💨 Wind Speed
                        </p>

                        <p className="mt-1 text-2xl font-extrabold text-white">
                          {
                            weather.windSpeed
                          }{' '}
                          km/h
                        </p>

                      </div>

                    </div>

                  </div>

                  {weather.forecast
                    .length >
                    0 && (
                    <div className="mt-8">

                      <div className="mb-5">

                        <p className="text-sm font-semibold text-pink-400">
                          7-DAY FORECAST
                        </p>

                        <h3 className="mt-1 text-xl font-extrabold text-white">
                          Plan your days
                        </h3>

                      </div>

                      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-7">

                        {weather.forecast.map(
                          (
                            day,
                            index
                          ) => {
                            const info =
                              getWeatherInfo(
                                day.weatherCode
                              )

                            return (
                              <div
                                key={
                                  day.date
                                }
                                className={`group rounded-2xl border p-4 text-center ${
                                  index ===
                                  0
                                    ? 'border-purple-400/30 bg-purple-500/10'
                                    : 'border-white/10 bg-white/[0.03]'
                                }`}
                              >

                                <p className="text-sm font-bold text-white">
                                  {index ===
                                  0
                                    ? 'Today'
                                    : formatForecastDate(
                                        day.date
                                      )}
                                </p>

                                <div className="mt-4 text-4xl">
                                  {
                                    info.icon
                                  }
                                </div>

                                <p className="mt-3 text-sm font-semibold text-[#aaa7c4]">
                                  {
                                    info.text
                                  }
                                </p>

                                <div className="mt-4 flex items-center justify-center gap-2">

                                  <span className="text-xl font-extrabold text-white">
                                    {Math.round(
                                      day.max
                                    )}
                                    °
                                  </span>

                                  <span className="text-sm text-[#77738f]">
                                    {Math.round(
                                      day.min
                                    )}
                                    °
                                  </span>

                                </div>

                                <div className="mt-3 rounded-xl border border-white/5 bg-white/[0.04] px-2 py-2">

                                  <p className="text-xs text-[#77738f]">
                                    🌧️ Rain
                                  </p>

                                  <p className="mt-1 text-sm font-bold text-cyan-300">
                                    {day.rain ??
                                      0}
                                    %
                                  </p>

                                </div>

                              </div>
                            )
                          }
                        )}

                      </div>

                    </div>
                  )}

                </div>
              )}

          </div>

        </section>

        {/* ===================================================
            ITINERARY
        =================================================== */}

        <section className="glass mt-8">

          <div className="border-b border-white/10 px-6 py-7 md:px-8">

            <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">

              <div>

                <div className="mb-2 inline-flex rounded-full border border-purple-400/20 bg-purple-500/10 px-3 py-1 text-xs font-bold text-purple-300">
                  ITINERARY
                </div>

                <h2 className="text-2xl font-extrabold text-white">
                  Day-by-day itinerary
                </h2>

                <p className="mt-1 text-sm text-[#77738f]">
                  Organize everything you want to do.
                </p>

              </div>

              <button
                type="button"
                onClick={() => {
                  if (
                    showActivityForm
                  ) {
                    resetActivityForm()
                  } else {
                    setShowActivityForm(
                      true
                    )
                  }
                }}
                className="btn-gradient rounded-xl px-5 py-3 font-bold"
              >
                {showActivityForm
                  ? '✕ Cancel'
                  : '+ Add Activity'}
              </button>

            </div>

          </div>

          <div className="p-6 md:p-8">

            {showActivityForm && (
              <form
                onSubmit={
                  handleActivitySubmit
                }
                className="mb-8 rounded-3xl border border-purple-400/10 bg-purple-500/[0.05] p-6"
              >

                <div className="mb-5">

                  <p className="text-sm font-semibold text-pink-400">
                    {editingActivityId !==
                    null
                      ? 'EDIT ACTIVITY'
                      : 'NEW ACTIVITY'}
                  </p>

                  <h3 className="mt-1 text-xl font-bold text-white">
                    {editingActivityId !==
                    null
                      ? 'Update activity'
                      : 'Add an activity'}
                  </h3>

                </div>

                <div>

                  <label
                    htmlFor="activity-name"
                    className="mb-2 block font-bold text-white"
                  >
                    Activity Name
                  </label>

                  <input
                    id="activity-name"
                    type="text"
                    value={
                      activityName
                    }
                    onChange={(e) =>
                      setActivityName(
                        e.target.value
                      )
                    }
                    placeholder="Visit Eiffel Tower"
                    className="w-full px-4 py-3.5"
                  />

                </div>

                <div className="mt-5 grid gap-5 md:grid-cols-2">

                  <div>

                    <label
                      htmlFor="activity-date"
                      className="mb-2 block font-bold text-white"
                    >
                      Date
                    </label>

                    <input
                      id="activity-date"
                      type="date"
                      value={
                        activityDate
                      }
                      onChange={(e) =>
                        setActivityDate(
                          e.target.value
                        )
                      }
                      className="w-full px-4 py-3.5"
                    />

                  </div>

                  <div>

                    <label
                      htmlFor="activity-time"
                      className="mb-2 block font-bold text-white"
                    >
                      Time
                    </label>

                    <input
                      id="activity-time"
                      type="time"
                      value={
                        activityTime
                      }
                      onChange={(e) =>
                        setActivityTime(
                          e.target.value
                        )
                      }
                      className="w-full px-4 py-3.5"
                    />

                  </div>

                </div>

                <div className="mt-5">

                  <label
                    htmlFor="activity-location"
                    className="mb-2 block font-bold text-white"
                  >
                    Location
                  </label>

                  <input
                    id="activity-location"
                    type="text"
                    value={
                      activityLocation
                    }
                    onChange={(e) =>
                      setActivityLocation(
                        e.target.value
                      )
                    }
                    placeholder="Champ de Mars"
                    className="w-full px-4 py-3.5"
                  />

                </div>

                <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row">

                  <button
                    type="button"
                    onClick={
                      resetActivityForm
                    }
                    className="flex-1 rounded-xl border border-white/10 bg-white/[0.06] py-3.5 font-bold text-white hover:bg-white/[0.1]"
                  >
                    Cancel
                  </button>

                  <button
                    type="submit"
                    className="btn-gradient flex-1 rounded-xl py-3.5 font-bold"
                  >
                    {editingActivityId !==
                    null
                      ? '💾 Update Activity'
                      : '➕ Save Activity'}
                  </button>

                </div>

              </form>
            )}

            {activities.length ===
              0 &&
              !showActivityForm && (
                <div className="rounded-3xl border-2 border-dashed border-white/10 p-10 text-center">

                  <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-purple-500/10 text-4xl">
                    🗓️
                  </div>

                  <h3 className="mt-5 text-xl font-bold text-white">
                    No activities yet
                  </h3>

                  <p className="mt-2 text-[#77738f]">
                    Add activities to start building your itinerary.
                  </p>

                  <button
                    type="button"
                    onClick={() =>
                      setShowActivityForm(
                        true
                      )
                    }
                    className="btn-gradient mt-5 rounded-xl px-5 py-3 font-bold"
                  >
                    + Add First Activity
                  </button>

                </div>
              )}

            {sortedDates.length >
              0 && (
              <div className="space-y-10">

                {sortedDates.map(
                  (
                    date,
                    index
                  ) => (
                    <div
                      key={date}
                    >

                      <div className="mb-5 flex items-center gap-4">

                        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-violet-600 to-pink-500 font-bold text-white shadow-lg shadow-purple-900/40">
                          {index + 1}
                        </div>

                        <div>

                          <p className="text-xs font-bold uppercase tracking-[0.2em] text-pink-400">
                            Day{' '}
                            {index +
                              1}
                          </p>

                          <h3 className="mt-1 text-xl font-extrabold text-white">
                            {new Date(
                              `${date}T00:00:00`
                            ).toLocaleDateString(
                              'en-US',
                              {
                                weekday:
                                  'long',
                                month:
                                  'long',
                                day: 'numeric',
                                year:
                                  'numeric',
                              }
                            )}
                          </h3>

                        </div>

                      </div>

                      <div className="ml-6 border-l-2 border-purple-500/20 pl-8">

                        <div className="space-y-4">

                          {groupedActivities[
                            date
                          ]
                            .slice()
                            .sort(
                              (
                                a,
                                b
                              ) =>
                                (
                                  a.time ||
                                  ''
                                ).localeCompare(
                                  b.time ||
                                    ''
                                )
                            )
                            .map(
                              (
                                activity
                              ) => (
                                <div
                                  key={
                                    activity.id
                                  }
                                  className={`glass group relative p-5 ${
                                    deletingId ===
                                    activity.id
                                      ? 'opacity-50'
                                      : ''
                                  }`}
                                >

                                  <div className="absolute -left-[41px] top-6 h-4 w-4 rounded-full border-4 border-[#07051a] bg-pink-500 shadow-lg shadow-pink-500/30" />

                                  <div className="relative z-10 flex flex-col gap-4">

                                    <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">

                                      <div>

                                        <h4 className="text-lg font-extrabold text-white">
                                          {
                                            activity.name
                                          }
                                        </h4>

                                        {activity.location && (
                                          <p className="mt-2 text-sm text-[#77738f]">
                                            📍{' '}
                                            {
                                              activity.location
                                            }
                                          </p>
                                        )}

                                      </div>

                                      {activity.time && (
                                        <div className="rounded-xl border border-cyan-400/20 bg-cyan-400/10 px-3 py-2 text-sm font-bold text-cyan-300">
                                          ⏰{' '}
                                          {
                                            activity.time
                                          }
                                        </div>
                                      )}

                                    </div>

                                    <div className="flex flex-wrap gap-2">

                                      <button
                                        type="button"
                                        onClick={() =>
                                          handleEditActivity(
                                            activity
                                          )
                                        }
                                        className="rounded-lg border border-purple-400/20 bg-purple-500/10 px-4 py-2 text-sm font-bold text-purple-300 hover:bg-purple-500/20"
                                      >
                                        ✏️ Edit
                                      </button>

                                      <button
                                        type="button"
                                        onClick={() =>
                                          openDeleteModal(
                                            'activity',
                                            activity
                                          )
                                        }
                                        className="rounded-lg border border-pink-400/20 bg-pink-500/10 px-4 py-2 text-sm font-bold text-pink-300 hover:bg-pink-500/20"
                                      >
                                        🗑️ Delete
                                      </button>

                                    </div>

                                  </div>

                                </div>
                              )
                            )}

                        </div>

                      </div>

                    </div>
                  )
                )}

              </div>
            )}

          </div>

        </section>

        {/* ===================================================
            BUDGET
        =================================================== */}

        <section className="glass mt-8">

          <div className="border-b border-white/10 px-6 py-7 md:px-8">

            <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">

              <div>

                <div className="mb-2 inline-flex rounded-full border border-emerald-400/20 bg-emerald-400/10 px-3 py-1 text-xs font-bold text-emerald-300">
                  BUDGET
                </div>

                <h2 className="text-2xl font-extrabold text-white">
                  Budget overview
                </h2>

                <p className="mt-1 text-sm text-[#77738f]">
                  Keep track of every rupee during your trip.
                </p>

              </div>

              <button
                type="button"
                onClick={() =>
                  setShowExpenseForm(
                    !showExpenseForm
                  )
                }
                className="rounded-xl bg-gradient-to-r from-emerald-500 to-cyan-500 px-5 py-3 font-bold text-white shadow-lg shadow-emerald-500/10 hover:brightness-110"
              >
                {showExpenseForm
                  ? '✕ Cancel'
                  : '+ Add Expense'}
              </button>

            </div>

          </div>

          <div className="p-6 md:p-8">

            {showExpenseForm && (
              <form
                onSubmit={
                  handleAddExpense
                }
                className="mb-8 rounded-3xl border border-emerald-400/10 bg-emerald-500/[0.04] p-6"
              >

                <p className="text-sm font-semibold text-emerald-300">
                  NEW EXPENSE
                </p>

                <h3 className="mt-1 text-xl font-bold text-white">
                  Add an expense
                </h3>

                <div className="mt-5">

                  <label
                    htmlFor="expense-name"
                    className="mb-2 block font-bold text-white"
                  >
                    Expense Name
                  </label>

                  <input
                    id="expense-name"
                    type="text"
                    value={
                      expenseName
                    }
                    onChange={(e) =>
                      setExpenseName(
                        e.target.value
                      )
                    }
                    placeholder="Hotel"
                    className="w-full px-4 py-3.5"
                  />

                </div>

                <div className="mt-5">

                  <label
                    htmlFor="expense-amount"
                    className="mb-2 block font-bold text-white"
                  >
                    Amount
                  </label>

                  <div className="relative">

                    <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 font-bold text-emerald-300">
                      ₹
                    </span>

                    <input
                      id="expense-amount"
                      type="number"
                      min="0"
                      step="0.01"
                      value={
                        expenseAmount
                      }
                      onChange={(e) =>
                        setExpenseAmount(
                          e.target.value
                        )
                      }
                      placeholder="3000"
                      className="w-full py-3.5 pl-10 pr-4"
                    />

                  </div>

                </div>

                <button
                  type="submit"
                  className="mt-6 rounded-xl bg-gradient-to-r from-emerald-500 to-cyan-500 px-6 py-3.5 font-bold text-white hover:brightness-110"
                >
                  💾 Save Expense
                </button>

              </form>
            )}

            <div className="grid gap-4 sm:grid-cols-3">

              <div className="rounded-2xl border border-blue-400/10 bg-blue-500/[0.07] p-5">

                <p className="text-sm font-medium text-[#aaa7c4]">
                  Total Budget
                </p>

                <p className="mt-1 text-2xl font-extrabold text-cyan-300">
                  ₹{totalBudget}
                </p>

              </div>

              <div className="rounded-2xl border border-pink-400/10 bg-pink-500/[0.07] p-5">

                <p className="text-sm font-medium text-[#aaa7c4]">
                  Spent
                </p>

                <p className="mt-1 text-2xl font-extrabold text-pink-300">
                  ₹{totalSpent}
                </p>

              </div>

              <div className="rounded-2xl border border-emerald-400/10 bg-emerald-500/[0.07] p-5">

                <p className="text-sm font-medium text-[#aaa7c4]">
                  Remaining
                </p>

                <p
                  className={`mt-1 text-2xl font-extrabold ${
                    remainingBudget <
                    0
                      ? 'text-red-400'
                      : 'text-emerald-300'
                  }`}
                >
                  ₹
                  {
                    remainingBudget
                  }
                </p>

              </div>

            </div>

            <div className="mt-7">

              <div className="flex items-center justify-between">

                <span className="text-sm font-semibold text-[#77738f]">
                  Budget used
                </span>

                <span className="text-sm font-extrabold text-white">
                  {Math.round(
                    budgetPercentage
                  )}
                  %
                </span>

              </div>

              <div className="mt-3 h-3 overflow-hidden rounded-full bg-white/10">

                <div
                  className={`h-full rounded-full transition-all ${
                    budgetPercentage >=
                    100
                      ? 'bg-gradient-to-r from-red-500 to-pink-500'
                      : 'bg-gradient-to-r from-violet-500 via-pink-500 to-orange-400'
                  }`}
                  style={{
                    width: `${budgetPercentage}%`,
                  }}
                />

              </div>

            </div>

            {expenses.length ===
              0 && (
              <div className="mt-7 rounded-3xl border-2 border-dashed border-white/10 p-10 text-center">

                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-pink-500/10 text-4xl">
                  💸
                </div>

                <h3 className="mt-5 text-xl font-bold text-white">
                  No expenses yet
                </h3>

                <p className="mt-2 text-[#77738f]">
                  Add your first expense to start tracking your budget.
                </p>

              </div>
            )}

            {expenses.length >
              0 && (
              <div className="mt-7">

                <div className="mb-4">

                  <p className="text-sm font-semibold uppercase tracking-[0.2em] text-emerald-300">
                    EXPENSES
                  </p>

                  <h3 className="mt-1 text-xl font-extrabold text-white">
                    Recent spending
                  </h3>

                </div>

                <div className="space-y-3">

                  {expenses.map(
                    (expense) => (
                      <div
                        key={
                          expense.id
                        }
                        className={`group rounded-2xl border border-white/10 bg-white/[0.03] p-5 transition hover:border-pink-400/20 hover:bg-pink-500/[0.04] ${
                          deletingId ===
                          expense.id
                            ? 'opacity-50'
                            : ''
                        }`}
                      >

                        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

                          <div className="flex items-center gap-4">

                            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-pink-500/10 text-xl">
                              💸
                            </div>

                            <div>

                              <p className="font-bold text-white">
                                {
                                  expense.name
                                }
                              </p>

                              <p className="text-sm text-[#77738f]">
                                Trip expense
                              </p>

                            </div>

                          </div>

                          <div className="flex items-center justify-between gap-4 sm:justify-end">

                            <p className="text-lg font-extrabold text-pink-300">
                              - ₹
                              {
                                expense.amount
                              }
                            </p>

                            <button
                              type="button"
                              onClick={() =>
                                openDeleteModal(
                                  'expense',
                                  expense
                                )
                              }
                              className="rounded-lg border border-pink-400/20 bg-pink-500/10 px-3 py-2 text-sm font-bold text-pink-300 hover:bg-pink-500/20"
                            >
                              🗑️
                            </button>

                          </div>

                        </div>

                      </div>
                    )
                  )}

                </div>

              </div>
            )}

          </div>

        </section>

      </main>

      {/* =====================================================
          DELETE MODAL
      ===================================================== */}

      {showDeleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-6 backdrop-blur-md">

          <div className="glass w-full max-w-md overflow-hidden shadow-2xl">

            <div className="bg-gradient-to-r from-pink-600/80 via-rose-500/70 to-orange-500/70 px-8 py-7 text-center text-white">

              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-white/10 text-3xl backdrop-blur-xl">
                🗑️
              </div>

              <h2 className="mt-4 text-2xl font-extrabold">
                Delete{' '}
                {deleteType ===
                'expense'
                  ? 'expense'
                  : 'activity'}
                ?
              </h2>

            </div>

            <div className="p-8 text-center">

              <p className="text-[#aaa7c4]">

                Are you sure you want to delete{' '}

                <span className="font-bold text-white">
                  {
                    deleteItem?.name
                  }
                </span>
                ?

              </p>

              {deleteType ===
                'expense' && (
                <p className="mt-3 text-xl font-extrabold text-pink-300">
                  ₹
                  {
                    deleteItem?.amount
                  }
                </p>
              )}

              <p className="mt-3 text-sm text-[#77738f]">
                This action cannot be undone.
              </p>

              <div className="mt-7 grid grid-cols-2 gap-3">

                <button
                  type="button"
                  onClick={
                    closeDeleteModal
                  }
                  disabled={
                    deletingId !==
                    null
                  }
                  className="rounded-xl border border-white/10 bg-white/[0.06] py-3.5 font-bold text-white hover:bg-white/[0.1] disabled:cursor-not-allowed disabled:opacity-50"
                >
                  Cancel
                </button>

                <button
                  type="button"
                  onClick={
                    confirmDelete
                  }
                  disabled={
                    deletingId !==
                    null
                  }
                  className="rounded-xl bg-gradient-to-r from-red-500 to-pink-500 py-3.5 font-bold text-white shadow-lg shadow-pink-500/20 hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-70"
                >
                  {deletingId !==
                  null
                    ? 'Deleting...'
                    : 'Delete'}
                </button>

              </div>

            </div>

          </div>

        </div>
      )}

    </div>
  )
}

export function TripDetailsRoute() {
  const { id } = useParams()

  return <TripDetails key={id} />
}

export default TripDetails
