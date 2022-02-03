import { useEffect, useRef } from 'react'

type IntervalId = number | undefined

export const useInterval = (
  callback: (_stop: () => void) => void,
  delay: number
) => {
  const intervalId = useRef<IntervalId>(undefined)
  const savedCallback = useRef(callback)

  useEffect(() => {
    savedCallback.current = callback
  })

  const stop = () => {
    window.clearInterval(intervalId.current)
  }

  useEffect(() => {
    const tick = () => savedCallback.current(stop)
    if (typeof delay === 'number') {
      intervalId.current = window.setInterval(tick, delay)
      return () => window.clearInterval(intervalId.current)
    }
  }, [delay])

  return intervalId.current
}