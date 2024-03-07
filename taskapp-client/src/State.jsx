import { atom, selector } from "recoil";
import { recoilPersist } from 'recoil-persist'

const { persistAtom } = recoilPersist()

//id, email
export const otpAccountInforState = atom({
  key: "otpAccountInfor",
  default: {},
  effects_UNSTABLE: [persistAtom]
})

export const activeTabState = atom({
  key: "bottomNavbarTab",
  default: 'home',
  effects_UNSTABLE: [persistAtom]
})

export const accountState = atom({
  key: "account",
  default: {},
  effects_UNSTABLE: [persistAtom]
})

export const isNewUnverifiedPartner = atom({
  key: "isNewUnverifiedPartner",
  default: false,
  effects_UNSTABLE: [persistAtom]
})

export const isNewVerifiedPartner = atom({
  key: "isNewVerifiedPartner",
  default: false,
  effects_UNSTABLE: [persistAtom]
})

export const accountAccessTokenState = selector({
  key: "accessToken",
  get: ({get}) => {
    const user = get(accountState)
    return user?.accessToken
  }
})
 