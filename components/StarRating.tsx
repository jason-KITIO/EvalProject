"use client"

import type React from "react"
import { useState } from "react"
import { Star } from "lucide-react"

interface StarRatingProps {
  value: number
  onChange: (value: number) => void
  label: string
}

const StarRating: React.FC<StarRatingProps> = ({ value, onChange, label }) => {
  const [hoverValue, setHoverValue] = useState<number | null>(null)

  const handleStarClick = (index: number) => {
    onChange(index)
  }

  const handleStarHover = (index: number) => {
    setHoverValue(index)
  }

  const handleStarLeave = () => {
    setHoverValue(null)
  }

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
        {label}
      </label>
      <div className="flex items-center">
        {[1, 2, 3, 4, 5].map((index) => (
          <Star
            key={index}
            className={`w-6 h-6 cursor-pointer ${
              index <= (hoverValue || value) ? "text-yellow-400 fill-current" : "text-gray-300"
            }`}
            onClick={() => handleStarClick(index)}
            onMouseEnter={() => handleStarHover(index)}
            onMouseLeave={handleStarLeave}
          />
        ))}
      </div>
    </div>
  )
}

export default StarRating
