import * as React from 'react'

export function useReduceMotion() {
  const [matches, setMatch] = React.useState(null)
  React.useEffect(() => {
    if (typeof window === 'undefined') {
      return
    }
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    const handleChange = () => {
      setMatch(mq.matches)
    }
    handleChange()
    mq.addEventListener('change', handleChange)
    return () => {
      mq.removeEventListener('change', handleChange)
    }
  }, [])

  if (typeof window === 'undefined') {
    return null
  }

  return matches
}
