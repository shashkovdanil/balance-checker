import { ethers } from 'ethers'
import { commify, formatEther, formatUnits } from '@ethersproject/units'
import { etherscanProvider } from './provider'

export async function addressConverter(source: string) {
  try {
    if (source.startsWith('0x')) {
      const ens = await etherscanProvider.lookupAddress(source)

      return ens ? `ENS ${ens}` : ''
    } else {
      const eth = await etherscanProvider.resolveName(source)

      return eth ? `Eth address ${eth}` : ''
    }
  } catch (e) {
    return ''
  }
}

export async function getBalance(tokenAddress: string, address: string) {
  if (!tokenAddress) {
    const ethBalance = await etherscanProvider.getBalance(address)

    return `${commify(formatEther(ethBalance))}ETH`
  }

  const tokenContract = new ethers.Contract(
    tokenAddress,
    ['function balanceOf(address) view returns (uint256)'],
    etherscanProvider,
  )
  const tokenBalance: ethers.BigNumberish = await tokenContract.balanceOf(
    address,
  )

  return formatUnits(tokenBalance, 6)
}
