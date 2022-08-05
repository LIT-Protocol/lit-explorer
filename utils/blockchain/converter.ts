import { ethers } from "ethers";

export interface MultiTimeFormat{
    milliseconds: number,
    seconds: number,
    minutes: number,
}

export interface MultiETHFormat{
    wei: number
    eth: number | string
}

// -- (helper) milliseconds converter
export const milliC = (milliseconds: number) : MultiTimeFormat => {

    console.log("[milliC]:", milliseconds);

    return {
        milliseconds,
        seconds: milliseconds / 1000,
        minutes: milliseconds / 1000 / 60,
    }
}

// -- (helper) wei to eth converter
export const wei2eth = (v: number) : MultiETHFormat => {

    let cost : MultiETHFormat = {
        wei: v,
        eth: ethers.utils.formatEther(v),
    }

    return cost;
}