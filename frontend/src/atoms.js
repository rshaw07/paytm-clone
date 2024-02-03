import { atom } from "recoil";

export const tokenAtom = atom({
    key: "tokenAtom",
    default: ""
})

export const userAtom = atom({
    key: "userAtom",
    default: {}
})

export const balanceAtom = atom({
    key: "balanceAtom",
    default: 0
})
