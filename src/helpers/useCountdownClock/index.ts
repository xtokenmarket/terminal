import { ONE_HOUR_IN_MS, ONE_MINUTE_IN_MS } from 'config/constants'
import { useEffect, useState } from 'react'

const useCountdown = (targetDate: number) => {
  const countDownDate =
    targetDate > 0 ? new Date(targetDate).getTime() : new Date().getTime()

  const [countDown, setCountDown] = useState(
    countDownDate - new Date().getTime()
  )

  useEffect(() => {
    const interval = setInterval(() => {
      setCountDown(countDownDate - new Date().getTime())
    }, 1000)

    return () => clearInterval(interval)
  }, [countDownDate])

  return getReturnValues(countDown)
}

const getReturnValues = (countDown: number) => {
  const days = Math.floor(countDown / (ONE_HOUR_IN_MS * 24))
  const hours = Math.floor((countDown % (ONE_HOUR_IN_MS * 24)) / ONE_HOUR_IN_MS)
  const minutes = Math.floor((countDown % ONE_HOUR_IN_MS) / ONE_MINUTE_IN_MS)
  const seconds = Math.floor((countDown % ONE_MINUTE_IN_MS) / 1000)

  return { days, hours, minutes, seconds }
}

export { useCountdown }
