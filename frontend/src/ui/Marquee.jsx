"use client"

import { useEffect, useRef, useState } from "react"
import { motion } from "framer-motion"

export function Marquee({ children, direction = "left", pauseOnHover = false, speed = 20 }) {
  const [start, setStart] = useState(false)
  const scroller = useRef(null)
  const [scrollerWidth, setScrollerWidth] = useState(0)

  useEffect(() => {
    if (!scroller.current) return
    setScrollerWidth(scroller.current.offsetWidth)
    setStart(true)
  }, [])

  return (
    <div
      className="flex overflow-hidden"
      style={{ maskImage: "linear-gradient(to right, transparent, black 20%, black 80%, transparent)" }}
    >
      <motion.div
        ref={scroller}
        className="flex min-w-full shrink-0 gap-4 py-4"
        animate={
          start
            ? {
                x: direction === "left" ? [-scrollerWidth, 0] : [0, -scrollerWidth],
              }
            : undefined
        }
        transition={{
          duration: scrollerWidth / speed,
          ease: "linear",
          repeat: Number.POSITIVE_INFINITY,
        }}
        {...(pauseOnHover && { hover: { animationPlayState: "paused" } })}
      >
        {children}
      </motion.div>
      <motion.div
        className="flex min-w-full shrink-0 gap-4 py-4"
        animate={
          start
            ? {
                x: direction === "left" ? [0, -scrollerWidth] : [-scrollerWidth, 0],
              }
            : undefined
        }
        transition={{
          duration: scrollerWidth / speed,
          ease: "linear",
          repeat: Number.POSITIVE_INFINITY,
        }}
        {...(pauseOnHover && { hover: { animationPlayState: "paused" } })}
      >
        {children}
      </motion.div>
    </div>
  )
}

