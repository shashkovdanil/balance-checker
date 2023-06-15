import {
  type DetailedHTMLProps,
  type InputHTMLAttributes,
  type ReactNode,
  useMemo,
  forwardRef,
} from 'react'
import { clsx } from 'clsx'
import { ErrorMessage } from './ErrorMessage'

type Props = {
  id: string
  label: ReactNode
  hint?: ReactNode
  error?: string
  className?: string
} & DetailedHTMLProps<InputHTMLAttributes<HTMLInputElement>, HTMLInputElement>

export const Input = forwardRef<HTMLInputElement, Props>(
  ({ id, label, hint, error, className = '', ...rest }, ref) => {
    const ariaInvalid = useMemo(() => (error ? true : undefined), [error])
    const errorId = useMemo(
      () => (error ? `error-${id}` : undefined),
      [id, error],
    )

    return (
      <div className={clsx('relative flex flex-col', className)}>
        <label htmlFor={id} className="font-extralight text-sm mb-2">
          {label}
        </label>
        <input
          ref={ref}
          id={id}
          aria-invalid={ariaInvalid}
          aria-errormessage={errorId}
          className="border border-gray-500 px-4 py-2 transition-all"
          {...rest}
        />
        {hint && <p className="text-xs text-gray-500 mt-2 break-all">{hint}</p>}
        {error && (
          <ErrorMessage id={error}>
            {error}
          </ErrorMessage>
        )}
      </div>
    )
  },
)

Input.displayName = 'Input'
