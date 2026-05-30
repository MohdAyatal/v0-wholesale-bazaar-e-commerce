'use client'

import { useState, useEffect } from 'react'
import { Flame, Clock } from 'lucide-react'

interface FlashSaleProps {
  title?: string
  discount?: number
  endTime?: Date
}

export default function FlashSaleSection({ title = 'Flash Sale', discount = 30, endTime = new Date(Date.now() + 4 * 60 * 60 * 1000) }: FlashSaleProps) {
  const [timeLeft, setTimeLeft] = useState({
    hours: 0,
    minutes: 0,
    seconds: 0
  })

  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date()
      const diff = endTime.getTime() - now.getTime()

      if (diff <= 0) {
        setTimeLeft({ hours: 0, minutes: 0, seconds: 0 })
        clearInterval(interval)
      } else {
        setTimeLeft({
          hours: Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
          minutes: Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((diff % (1000 * 60)) / 1000)
        })
      }
    }, 1000)

    return () => clearInterval(interval)
  }, [endTime])

  return (
    <section className="py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-lg p-8 text-white" style={{ backgroundColor: 'var(--secondary)' }}>
          <div className="flex items-center justify-between gap-4 flex-wrap">
            <div className="flex items-center gap-3">
              <Flame size={32} />
              <div>
                <h2 className="text-3xl font-bold">{title}</h2>
                <p className="opacity-90">Save up to {discount}%</p>
              </div>
            </div>

            {/* Countdown Timer */}
            <div className="flex items-center gap-4">
              <div className="flex gap-2">
                <div className="text-center">
                  <div className="bg-white bg-opacity-20 rounded-lg px-3 py-2 min-w-[60px]">
                    <div className="text-2xl font-bold">{String(timeLeft.hours).padStart(2, '0')}</div>
                    <div className="text-xs uppercase opacity-75">Hours</div>
                  </div>
                </div>
                <div className="text-center">
                  <div className="bg-white bg-opacity-20 rounded-lg px-3 py-2 min-w-[60px]">
                    <div className="text-2xl font-bold">{String(timeLeft.minutes).padStart(2, '0')}</div>
                    <div className="text-xs uppercase opacity-75">Mins</div>
                  </div>
                </div>
                <div className="text-center">
                  <div className="bg-white bg-opacity-20 rounded-lg px-3 py-2 min-w-[60px]">
                    <div className="text-2xl font-bold">{String(timeLeft.seconds).padStart(2, '0')}</div>
                    <div className="text-xs uppercase opacity-75">Secs</div>
                  </div>
                </div>
              </div>

              <button className="px-6 py-3 bg-white rounded-lg font-bold transition hover:bg-opacity-90" style={{ color: 'var(--secondary)' }}>
                Shop Now
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
