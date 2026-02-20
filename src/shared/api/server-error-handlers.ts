import { mapError, type MapErrorResult } from './map-error'
import { NextResponse } from 'next/server'

export type ActionSuccess<T> = {
  success: true
  data?: T
}

type ActionError = MapErrorResult & {
  success: false
}

type ActionResult<T> = ActionSuccess<T> | ActionError

/**
 * Wrap any async server handler to catch errors.
 * Ignores the handler's normal return value — only ensures errors are handled consistently.
 */
export function withActionErrorHandler<Args extends unknown[], T>(
  handler: (...args: Args) => Promise<ActionResult<T>>
) {
  return async (...args: Args) => {
    try {
      return await handler(...args)
    } catch (error: unknown) {
      const { error: mappedError, status } = mapError(error)
      console.error('[Server Action Error]:', error)

      return {
        success: false,
        error: mappedError,
        status,
      }
    }
  }
}

/**
 * Wrap any async server handler to catch errors.
 * Ignores the handler's normal return value — only ensures errors are handled consistently.
 */
export function withRouteErrorHandler<T>(handler: () => Promise<T>) {
  return async () => {
    try {
      return await handler()
    } catch (error: unknown) {
      const { error: mappedError, status } = mapError(error)
      console.error('[Route Error]:', error)

      return NextResponse.json(
        { success: false, error: mappedError },
        { status }
      )
    }
  }
}

export function isSuccess<T>(res: ActionResult<T>): res is ActionSuccess<T> {
  return res.success === true
}
