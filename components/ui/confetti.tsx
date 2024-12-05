'use client'

import type React from 'react'
import { useEffect, useState } from 'react'
import ReactConfetti from 'react-confetti'

export const Confetti: React.FC = () => {
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 })

  useEffect(() => {
    const { innerWidth: width, innerHeight: height } = window
    setDimensions({ width, height })

    const handleResize = () => {
      setDimensions({
        width: window.innerWidth,
        height: window.innerHeight,
      })
    }

    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  return (
    <ReactConfetti
      width={dimensions.width}
      height={dimensions.height}
      recycle={false}
      numberOfPieces={200}
      tweenDuration={10000}
    />
  )
}
