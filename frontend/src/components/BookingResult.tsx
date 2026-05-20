import React, { useState } from 'react'
import { Booking } from '../api/client'

interface BookingResultProps {
  booking: Booking
}

const BookingResult: React.FC<BookingResultProps> = ({ booking }) => {
  const won = booking.resultAmount > booking.betAmount
  const profit = booking.resultAmount - booking.betAmount

  return (
    <div
      className={`p-4 rounded-lg mb-4 ${won ? 'bg-green-50 border-l-4 border-green-500' : 'bg-red-50 border-l-4 border-red-500'}`}
    >
      <div className="flex justify-between items-center">
        <div>
          <p className="text-sm text-gray-600">Bet Amount</p>
          <p className="font-semibold">${booking.betAmount}</p>
        </div>
        <div className="text-3xl">{won ? '✅' : '❌'}</div>
        <div>
          <p className="text-sm text-gray-600">Result</p>
          <p className={`font-semibold ${won ? 'text-green-600' : 'text-red-600'}`}>
            ${booking.resultAmount}
          </p>
        </div>
        <div>
          <p className="text-sm text-gray-600">Profit</p>
          <p className={`font-semibold ${profit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
            {profit >= 0 ? '+' : ''}${profit}
          </p>
        </div>
      </div>
      <p className="text-xs text-gray-500 mt-2">{new Date(booking.createdAt).toLocaleString()}</p>
    </div>
  )
}

export default BookingResult
