import { ethers } from 'ethers'
import { etherscanProvider } from './provider'
import { FormData } from './types'

const errors = {
  tokenAddress: {
    notValid:
      'The correct address format is 0x..., e.g. 0xdac17f958d2ee523a2206206994597c13d831ec7',
  },
  userAddress: {
    empty: 'Address is required',
    notValid:
      'The correct address format is 0x... or *.eth, e.g. 0xdac17f958d2ee523a2206206994597c13d831ec7 or save.eth',
  },
}

export function checkIsEmpty(value: string) {
  if (value) return

  return errors.userAddress.empty
}

export function checkIsValidEth(value: string, field: keyof FormData) {
  if (value === '' || ethers.isAddress(value)) return

  return errors[field].notValid
}

export async function checkIsValidEthAndEns(value: string) {
  const ens =
    ethers.isValidName(value) && (await etherscanProvider.resolveName(value))

  if (!checkIsValidEth(value, 'userAddress') || ens !== null) return

  return errors.userAddress.notValid
}
