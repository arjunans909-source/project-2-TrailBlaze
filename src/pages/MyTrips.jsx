import { useState } from 'react'
import { Link } from 'react-router-dom'
import ThemeToggle from '../components/ThemeToggle'

function MyTrips() {
  const [trips, setTrips] = useState(() => {
    return JSON.parse(localStorage.getItem('trips')) || []
  })
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [tripToDelete, setTripToDelete] = useState(null)
  const [isDeleting, setIsDeleting] = useState(false)

  const handleDeleteTrip = (trip) => {
    setTripToDelete(trip)
    setShowDeleteModal(true)
  }

  const handleCancelDelete = () => {
    if (isDeleting) return

    setShowDeleteModal(false)
    setTripToDelete(null)
  }

  const confirmDeleteTrip = () => {
    if (!tripToDelete) return

    setIsDeleting(true)

    setTimeout(() => {
      const savedTrips =
        JSON.parse(localStorage.getItem('trips')) || []

      const updatedTrips = savedTrips.filter(
        (trip) =>
          trip.id.toString() !==
          tripToDelete.id.toString()
      )

      localStorage.setItem(
        'trips',
        JSON.stringify(updatedTrips)
      )

      setTrips(updatedTrips)
      setIsDeleting(false)
      setShowDeleteModal(false)
      setTripToDelete(null)
    }, 350)
  }

  const getTripStatus = (trip) => {
    const today = new Date()
    const start = new Date(trip.startDate)
    const end = new Date(trip.endDate)

    if (today < start) return 'Upcoming'
    if (today >= start && today <= end) return 'Ongoing'
    return 'Completed'
  }

  const getStatusStyle = (status) => {
    if (status === 'Ongoing') {
      return 'border-emerald-400/20 bg-emerald-400/10 text-emerald-300'
    }

    if (status === 'Completed') {
      return 'border-white/10 bg-white/[0.06] text-white/50'
    }

    return 'border-pink-400/20 bg-pink-500/10 text-pink-300'
  }

  return (
    <div className="min-h-screen px-5 py-7 text-white sm:px-8 lg:px-12">

      <div className="mx-auto max-w-7xl">

        {/* ================================
            NAVBAR
        ================================= */}

        <header className="mb-10 flex items-center justify-between">

          <Link
            to="/"
            className="flex items-center gap-3"
          >

            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-600 via-pink-500 to-orange-400 text-xl shadow-lg shadow-purple-500/20">
              ✈️
            </div>

            <div>

              <div className="text-xl font-extrabold tracking-tight">
                Trail<span className="gradient-text">blaze</span>
              </div>

              <div className="text-[10px] font-semibold uppercase tracking-[0.2em] text-white/35">
                Travel Planner
              </div>

            </div>

          </Link>

          <div className="flex items-center gap-3">

            <ThemeToggle />

            <Link
              to="/"
              className="hidden rounded-xl border border-white/10 bg-white/[0.04] px-4 py-2.5 text-sm font-semibold text-white/70 transition hover:bg-white/[0.08] hover:text-white sm:block"
            >
              ← Home
            </Link>

            <Link
              to="/create-trip"
              className="btn-gradient rounded-xl px-4 py-2.5 text-sm font-bold sm:px-5"
            >
              + New Trip
            </Link>

          </div>

        </header>


        {/* ================================
            PAGE HEADER
        ================================= */}

        <section className="relative mb-8 overflow-hidden rounded-[28px] border border-white/10 bg-white/[0.04] p-6 shadow-2xl backdrop-blur-2xl sm:p-8">

          <div className="pointer-events-none absolute -right-20 -top-24 h-72 w-72 rounded-full bg-purple-500/15 blur-[100px]" />

          <div className="pointer-events-none absolute -bottom-32 left-20 h-64 w-64 rounded-full bg-pink-500/10 blur-[90px]" />

          <div className="relative">

            <div className="mb-4 flex items-center gap-2">

              <span className="h-2 w-2 animate-pulse rounded-full bg-pink-400" />

              <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-pink-300">
                Your adventures
              </span>

            </div>

            <div className="flex flex-col justify-between gap-6 sm:flex-row sm:items-end">

              <div>

                <h1 className="text-3xl font-black tracking-tight sm:text-4xl">
                  My <span className="gradient-text">Trips</span>
                </h1>

                <p className="mt-2 max-w-xl text-sm leading-6 text-white/40 sm:text-base">
                  Manage all your adventures, destinations,
                  travel dates and budgets in one place.
                </p>

              </div>

              <div className="flex gap-3">

                <div className="rounded-2xl border border-white/10 bg-black/20 px-5 py-3 text-center">

                  <div className="text-2xl font-black text-white">
                    {trips.length}
                  </div>

                  <div className="text-[9px] font-bold uppercase tracking-widest text-white/30">
                    {trips.length === 1 ? 'Trip' : 'Trips'}
                  </div>

                </div>

              </div>

            </div>

          </div>

        </section>


        {/* ================================
            EMPTY STATE
        ================================= */}

        {trips.length === 0 && (

          <div className="rounded-[28px] border border-white/10 bg-white/[0.04] p-10 text-center shadow-2xl backdrop-blur-2xl sm:p-16">

            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-3xl bg-gradient-to-br from-violet-500/20 to-pink-500/20 text-4xl">
              🧳
            </div>

            <h2 className="mt-6 text-2xl font-black">
              No trips yet
            </h2>

            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-white/40">
              Your next adventure starts here. Create a trip
              and start planning your journey.
            </p>

            <Link
              to="/create-trip"
              className="btn-gradient mt-6 inline-flex items-center gap-2 rounded-xl px-6 py-3 font-bold"
            >
              Create Your First Trip
              <span>✈️</span>
            </Link>

          </div>

        )}


        {/* ================================
            TRIPS
        ================================= */}

        {trips.length > 0 && (

          <section>

            <div className="mb-5 flex items-center justify-between">

              <div>

                <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-pink-400">
                  Saved adventures
                </p>

                <h2 className="mt-1 text-xl font-bold">
                  Your trips
                </h2>

              </div>

              <span className="text-xs text-white/30">
                {trips.length} saved
              </span>

            </div>


            <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">

              {trips.map((trip) => {

                const status = getTripStatus(trip)

                return (

                  <article
                    key={trip.id}
                    className="group overflow-hidden rounded-[24px] border border-white/10 bg-white/[0.04] shadow-xl backdrop-blur-2xl transition-all duration-300 hover:-translate-y-1 hover:border-pink-400/20 hover:bg-white/[0.06]"
                  >

                    {/* CARD HEADER */}

                    <div className="relative h-32 overflow-hidden bg-gradient-to-br from-violet-600/90 via-purple-600/80 to-pink-500/80">

                      <div className="absolute -right-12 -top-16 h-44 w-44 rounded-full bg-white/10 blur-xl" />

                      <div className="absolute -bottom-20 -left-10 h-48 w-48 rounded-full bg-cyan-400/10" />

                      <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />

                      <div className="absolute left-5 top-5">

                        <span
                          className={`rounded-full border px-3 py-1.5 text-[9px] font-bold uppercase tracking-[0.16em] backdrop-blur-md ${getStatusStyle(status)}`}
                        >
                          {status}
                        </span>

                      </div>

                      <div className="absolute bottom-4 left-5">

                        <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-white/50">
                          Destination
                        </p>

                        <h3 className="mt-1 text-xl font-black text-white">
                          {trip.destination}
                        </h3>

                      </div>

                      <div className="absolute bottom-4 right-5 text-3xl transition-transform duration-300 group-hover:scale-110 group-hover:rotate-6">
                        ✈️
                      </div>

                    </div>


                    {/* CARD BODY */}

                    <div className="p-5">

                      <div className="flex items-start justify-between gap-3">

                        <div className="min-w-0">

                          <p className="text-[9px] font-bold uppercase tracking-[0.15em] text-white/30">
                            Trip name
                          </p>

                          <h3 className="mt-1 truncate text-lg font-extrabold">
                            {trip.tripName}
                          </h3>

                        </div>

                        <div className="shrink-0 rounded-xl bg-pink-500/10 px-3 py-2 text-center">

                          <div className="text-sm font-black text-pink-300">
                            📍
                          </div>

                        </div>

                      </div>


                      {/* DATE */}

                      <div className="mt-4 rounded-2xl border border-white/[0.07] bg-black/15 p-3.5">

                        <div className="flex items-center justify-between">

                          <span className="text-[9px] font-bold uppercase tracking-[0.15em] text-white/30">
                            Travel dates
                          </span>

                          <span className="text-xs">
                            🗓️
                          </span>

                        </div>

                        <div className="mt-1.5 flex items-center gap-2 text-xs font-bold text-white/75">

                          <span>
                            {trip.startDate}
                          </span>

                          <span className="text-pink-400">
                            →
                          </span>

                          <span>
                            {trip.endDate}
                          </span>

                        </div>

                      </div>


                      {/* INFO */}

                      <div className="mt-3 grid grid-cols-2 gap-3">

                        <div className="rounded-2xl border border-cyan-400/10 bg-cyan-400/[0.05] p-3">

                          <p className="text-[9px] font-bold uppercase tracking-wider text-white/30">
                            Travelers
                          </p>

                          <p className="mt-1 text-sm font-extrabold text-cyan-300">
                            👥 {trip.travelers}
                          </p>

                        </div>

                        <div className="rounded-2xl border border-emerald-400/10 bg-emerald-400/[0.05] p-3">

                          <p className="text-[9px] font-bold uppercase tracking-wider text-white/30">
                            Budget
                          </p>

                          <p className="mt-1 truncate text-sm font-extrabold text-emerald-300">
                            ₹{trip.budget}
                          </p>

                        </div>

                      </div>


                      {/* ACTIONS */}

                      <div className="mt-4 flex gap-2">

                        <Link
                          to={`/trip/${trip.id}`}
                          className="flex flex-1 items-center justify-center rounded-xl bg-white py-3 text-xs font-extrabold text-slate-950 shadow-lg transition hover:bg-pink-100"
                        >
                          View Trip
                          <span className="ml-1 text-pink-500">
                            →
                          </span>
                        </Link>

                        <button
                          type="button"
                          onClick={() => handleDeleteTrip(trip)}
                          className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-red-400/15 bg-red-500/10 text-red-300 transition hover:border-red-400/30 hover:bg-red-500/20"
                          aria-label={`Delete ${trip.tripName}`}
                        >
                          🗑️
                        </button>

                      </div>

                    </div>

                  </article>

                )
              })}

            </div>

          </section>

        )}

      </div>


      {/* ================================
          DELETE MODAL
      ================================= */}

      {showDeleteModal && tripToDelete && (

        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-5 backdrop-blur-xl"
          onClick={handleCancelDelete}
        >

          <div
            className="w-full max-w-md overflow-hidden rounded-[28px] border border-white/10 bg-[#120d24] shadow-[0_40px_120px_rgba(0,0,0,0.65)]"
            onClick={(e) => e.stopPropagation()}
          >

            <div className="relative overflow-hidden bg-gradient-to-br from-red-500/20 via-pink-500/10 to-transparent px-7 py-8 text-center">

              <div className="pointer-events-none absolute left-1/2 top-0 h-32 w-32 -translate-x-1/2 rounded-full bg-red-500/20 blur-3xl" />

              <div className="relative mx-auto flex h-16 w-16 items-center justify-center rounded-2xl border border-red-400/20 bg-red-500/10 text-3xl">
                🗑️
              </div>

              <h2 className="relative mt-4 text-2xl font-black text-white">
                Delete this trip?
              </h2>

              <p className="relative mt-2 text-sm text-white/40">
                This action cannot be undone.
              </p>

            </div>


            <div className="p-7">

              <div className="rounded-2xl border border-white/[0.08] bg-black/20 p-4">

                <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-white/30">
                  Trip
                </p>

                <p className="mt-1 truncate text-base font-bold text-white">
                  {tripToDelete.tripName}
                </p>

                <p className="mt-1 truncate text-sm text-white/40">
                  📍 {tripToDelete.destination}
                </p>

              </div>


              <div className="mt-6 grid grid-cols-2 gap-3">

                <button
                  type="button"
                  onClick={handleCancelDelete}
                  disabled={isDeleting}
                  className="rounded-xl border border-white/10 bg-white/[0.06] py-3 font-bold text-white/70 transition hover:bg-white/10 hover:text-white disabled:opacity-40"
                >
                  Cancel
                </button>

                <button
                  type="button"
                  onClick={confirmDeleteTrip}
                  disabled={isDeleting}
                  className="rounded-xl bg-gradient-to-r from-red-500 to-pink-500 py-3 font-bold text-white shadow-lg shadow-red-500/20 transition hover:brightness-110 disabled:opacity-60"
                >

                  {isDeleting ? (

                    <span className="flex items-center justify-center gap-2">

                      <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />

                      Deleting...

                    </span>

                  ) : (
                    'Delete Trip'
                  )}

                </button>

              </div>

            </div>

          </div>

        </div>

      )}

    </div>
  )
}

export default MyTrips
