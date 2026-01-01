type AnyFn = (...args: any[]) => unknown

export interface Throttled<T extends AnyFn> {
  (...args: Parameters<T>): void
  cancel: () => void
}

export function throttle<T extends AnyFn>(fn: T, delay = 200): Throttled<T> {
  let lastCall = 0
  let timer: ReturnType<typeof setTimeout> | null = null

  const invoke = (context: unknown, args: Parameters<T>) => {
    lastCall = Date.now()
    fn.apply(context, args)
  }

  const throttled = function (this: unknown, ...args: Parameters<T>) {
    const now = Date.now()
    const remaining = delay - (now - lastCall)

    if (remaining <= 0) {
      if (timer) {
        clearTimeout(timer)
        timer = null
      }
      invoke(this, args)
      return
    }

    if (!timer) {
      timer = setTimeout(() => {
        timer = null
        invoke(this, args)
      }, remaining)
    }
  } as Throttled<T>

  throttled.cancel = () => {
    if (timer) {
      clearTimeout(timer)
      timer = null
    }
  }

  return throttled
}
