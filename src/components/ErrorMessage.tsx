import { PropsWithChildren } from 'react'
import { clsx } from 'clsx'

interface Props {
  id?: string
  className?: string
}

export function ErrorMessage({
  id,
  children,
  className = '',
}: PropsWithChildren<Props>) {
  return (
    <p id={id} className={clsx('text-xs mt-2 text-red-600 break-all', className)}>
      {children}
    </p>
  )
}
