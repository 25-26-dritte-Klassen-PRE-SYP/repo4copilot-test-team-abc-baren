import React from 'react'
import { Link } from 'react-router-dom'

const Navigation: React.FC = () => {
  return (
    <nav className="bg-indigo-600 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center gap-8">
            <Link to="/" className="text-2xl font-bold">
              🎰 Gaming Platform
            </Link>
            <div className="flex gap-6">
              <Link to="/" className="hover:text-indigo-200 transition">
                Home
              </Link>
              <Link to="/games" className="hover:text-indigo-200 transition">
                Games
              </Link>
              <Link to="/bookings" className="hover:text-indigo-200 transition">
                My Bookings
              </Link>
            </div>
          </div>
        </div>
      </div>
    </nav>
  )
}

export default Navigation
