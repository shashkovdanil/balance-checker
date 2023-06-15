import { useState } from 'react'
import { useForm } from 'react-hook-form'
import debounce from 'lodash.debounce'
import { Input } from './components/Input'
import { ErrorMessage } from './components/ErrorMessage'
import { Spinner } from './components/Spinner'
import { addressConverter, getBalance } from './utils'
import {
  checkIsEmpty,
  checkIsValidEth,
  checkIsValidEthAndEns,
} from './validation'
import { FormData } from './types'

import './index.css'

function App() {
  const [formError, setFormError] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [balance, setBalance] = useState('')
  const [userAddressHint, setUserAddressHint] = useState('')

  const {
    register,
    handleSubmit,
    formState: { errors },
    trigger,
  } = useForm<FormData>({ mode: 'all' })

  const onSubmit = handleSubmit(async data => {
    try {
      setSubmitting(true)
      if (formError) setFormError('')
      const balance = await getBalance(data.tokenAddress, data.userAddress)
      setBalance(balance)
    } catch (e) {
      const error = e as Error
      console.error(error)
      setFormError(error?.message || 'Something went wrong')
    } finally {
      setSubmitting(false)
    }
  })

  return (
    <div className="min-h-full flex flex-col items-center">
      <h1 className="text-2xl mt-[20vh] mb-6">Balance Checker</h1>
      <form
        onSubmit={onSubmit}
        className="flex flex-col w-full min-h-[412px] justify-between px-4 sm:w-3/4 sm:px-0 max-w-xl"
      >
        <div>
          <Input
            type="text"
            id="tokenAddress"
            label={
              <>
                Token address <span className="text-gray-500">(optional)</span>
              </>
            }
            error={errors.tokenAddress && errors.tokenAddress.message}
            placeholder="0x..."
            className="mb-8"
            {...register('tokenAddress', {
              validate: value => checkIsValidEth(value, 'tokenAddress'),
            })}
          />
          <Input
            type="text"
            id="userAddress"
            label={
              <>
                Your address{' '}
                <span className="text-gray-500">(ENS supported)</span>
              </>
            }
            error={errors.userAddress && errors.userAddress.message}
            placeholder="0x... or *.eth"
            className="mb-16"
            hint={userAddressHint}
            {...register('userAddress', {
              onChange: debounce(async e => {
                setUserAddressHint('')

                const validated = await trigger('userAddress')

                if (validated) {
                  const result = await addressConverter(e.target.value)

                  setUserAddressHint(result)
                }
              }, 300),
              validate: async value => {
                const isEmpty = checkIsEmpty(value)
                if (isEmpty) return isEmpty

                const isValid = await checkIsValidEthAndEns(value)
                return isValid
              },
            })}
          />
        </div>
        <div>
          <div className="w-full mb-4">
            <button
              type="submit"
              className="relative w-full flex items-center justify-center gap-2 bg-black text-white px-4 py-2"
              disabled={submitting}
            >
              {submitting && (
                <div className="absolute left-8">
                  <Spinner />
                </div>
              )}
              <span>Check Balance</span>
            </button>
            {formError && <ErrorMessage>{formError}</ErrorMessage>}
          </div>
          <p>Your balance: {balance}</p>
        </div>
      </form>
    </div>
  )
}

export default App
