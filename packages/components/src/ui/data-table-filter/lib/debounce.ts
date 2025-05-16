/**
 * Debounce function for handling user input
 * @param fn Function to debounce
 * @param delay Delay in milliseconds
 * @returns Debounced function
 */
export function debounce<T extends (...args: any[]) => any>(
  fn: T,
  delay: number
): (...args: Parameters<T>) => void {
  /**
   * Timeout ID for the debounced function
   * Using ReturnType<typeof setTimeout> instead of NodeJS.Timeout for better compatibility
   */
  let timeout: ReturnType<typeof setTimeout> | null = null

  /**
   * Debounced function
   * @param args Arguments to pass to the original function
   */
  return function (this: any, ...args: Parameters<T>): void {
    const context = this

    if (timeout) {
      clearTimeout(timeout)
    }

    timeout = setTimeout(() => {
      fn.apply(context, args)
      timeout = null
    }, delay)
  }
}

/**
 * Debounce function that returns a promise
 * @param fn Function to debounce
 * @param delay Delay in milliseconds
 * @returns Debounced function that returns a promise
 */
export function debouncePromise<T extends (...args: any[]) => Promise<any>>(
  fn: T,
  delay: number
): (...args: Parameters<T>) => Promise<ReturnType<T>> {
  /**
   * Timeout ID for the debounced function
   * Using ReturnType<typeof setTimeout> instead of NodeJS.Timeout for better compatibility
   */
  let timeout: ReturnType<typeof setTimeout> | null = null

  /**
   * Debounced function that returns a promise
   * @param args Arguments to pass to the original function
   * @returns Promise that resolves with the result of the original function
   */
  return function (
    this: any,
    ...args: Parameters<T>
  ): ReturnType<typeof setTimeout> {
    const context = this

    return new Promise((resolve) => {
      if (timeout) {
        clearTimeout(timeout)
      }

      timeout = setTimeout(() => {
        resolve(fn.apply(context, args))
        timeout = null
      }, delay)
    }) as unknown as ReturnType<typeof setTimeout>
  }
}

