import { PinataSDK } from "pinata-web3"

export const pinata = new PinataSDK({
  pinataJwt: `${process.env.NEXT_PUBLIC_IPFS_JWT}`,
  pinataGateway: `${process.env.NEXT_PUBLIC_IPFS_GATEWAY}`
})
