import * as React from "react"

const MOBILE_BREAKPOINT = 768

export function useIsMobile() {
  const [isMobile, setIsMobile] = React.useState<boolean | undefined>(undefined)

  React.useEffect(() => {
    const mql = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`)
    const onChange = () => {
      setIsMobile(window.innerWidth < MOBILE_BREAKPOINT)
    }
    mql.addEventListener("change", onChange)
    setIsMobile(window.innerWidth < MOBILE_BREAKPOINT)
    return () => mql.removeEventListener("change", onChange)
  }, [])

  return !!isMobile
}

/** Game detail sidebars: 13 tiles on desktop bento, 9 on mobile (3×3). */
export function useSidebarGameCount(): 9 | 13 {
  const [count, setCount] = React.useState<9 | 13>(() =>
    typeof window !== "undefined" && window.matchMedia("(min-width: 768px)").matches
      ? 13
      : 9,
  )

  React.useEffect(() => {
    const mq = window.matchMedia("(min-width: 768px)")
    const fn = () => setCount(mq.matches ? 13 : 9)
    mq.addEventListener("change", fn)
    fn()
    return () => mq.removeEventListener("change", fn)
  }, [])

  return count
}
