'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'

export default function HomeCarousel() {
  const [slides, setSlides] = useState<any[]>([])
  const [currentSlide, setCurrentSlide] = useState(0)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchSlides()
    const interval = setInterval(() => {
      setCurrentSlide(prev => (prev + 1) % Math.max(slides.length, 1))
    }, 5000)
    return () => clearInterval(interval)
  }, [slides.length])

  const fetchSlides = async () => {
    try {
      const supabase = createClient()
      const { data } = await supabase.from('slideshow').select('*').order('order', { ascending: true })
      setSlides(data || [])
      setLoading(false)
    } catch (error) {
      console.error('Error fetching slides:', error)
      setLoading(false)
    }
  }

  const nextSlide = () => {
    if (slides.length > 0) {
      setCurrentSlide((prev) => (prev + 1) % slides.length)
    }
  }

  const prevSlide = () => {
    if (slides.length > 0) {
      setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length)
    }
  }

  if (loading) {
    return (
      <div className="h-96 bg-gray-200 animate-pulse rounded-lg" />
    )
  }

  if (slides.length === 0) {
    return (
      <div className="h-96 bg-gray-100 rounded-lg flex items-center justify-center" style={{ backgroundColor: 'var(--surface)' }}>
        <p style={{ color: 'var(--text-secondary)' }}>No slides available</p>
      </div>
    )
  }

  const slide = slides[currentSlide]

  return (
    <div className="relative h-96 rounded-lg overflow-hidden group">
      {/* Main Image */}
      <div className="relative w-full h-full">
        {slide.type === 'image' && (
          <Image
            src={slide.media_url}
            alt={slide.title}
            fill
            className="object-cover"
            priority
          />
        )}
        {slide.type === 'video' && (
          <video
            src={slide.media_url}
            className="w-full h-full object-cover"
            autoPlay
            muted
            loop
          />
        )}
      </div>

      {/* Overlay Text */}
      {(slide.title || slide.description) && (
        <div className="absolute inset-0 bg-black bg-opacity-40 flex flex-col items-center justify-center text-white p-4">
          {slide.title && (
            <h2 className="text-4xl font-bold mb-2 text-center">{slide.title}</h2>
          )}
          {slide.description && (
            <p className="text-lg text-center max-w-2xl">{slide.description}</p>
          )}
        </div>
      )}

      {/* Navigation Arrows */}
      <button
        onClick={prevSlide}
        className="absolute left-4 top-1/2 -translate-y-1/2 bg-white bg-opacity-50 hover:bg-opacity-75 p-2 rounded-full transition opacity-0 group-hover:opacity-100 z-10"
      >
        <ChevronLeft size={24} style={{ color: 'var(--text-primary)' }} />
      </button>

      <button
        onClick={nextSlide}
        className="absolute right-4 top-1/2 -translate-y-1/2 bg-white bg-opacity-50 hover:bg-opacity-75 p-2 rounded-full transition opacity-0 group-hover:opacity-100 z-10"
      >
        <ChevronRight size={24} style={{ color: 'var(--text-primary)' }} />
      </button>

      {/* Dots */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-10">
        {slides.map((_, idx) => (
          <button
            key={idx}
            onClick={() => setCurrentSlide(idx)}
            className={`w-2 h-2 rounded-full transition ${
              idx === currentSlide ? 'w-6' : ''
            }`}
            style={{ backgroundColor: idx === currentSlide ? 'white' : 'rgba(255,255,255,0.5)' }}
          />
        ))}
      </div>
    </div>
  )
}
