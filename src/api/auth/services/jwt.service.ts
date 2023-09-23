import {UserJwtDataInterface} from "../interfaces";
import { sign } from "jsonwebtoken"
import {tokenRepository} from "../repositories";
import {JWT_ACCESS_EXPIRE_TIME, JWT_REFRESH_EXPIRE_TIME} from "../constants";
import {error2msg} from "../../../utils";


export async function generateAccessToken(data: UserJwtDataInterface) {
  return sign(data, process.env.JWT_ACCESS_SECRET ?? 'access_secret', {
    expiresIn: JWT_ACCESS_EXPIRE_TIME
  })
}

export async function generateRefreshToken(data: UserJwtDataInterface) {
  return sign(data, process.env.JWT_REFRESH_SECRET ?? 'refresh_secret', {
    expiresIn: JWT_REFRESH_EXPIRE_TIME
  })
}

export async function generateAndSaveTokenPair(data: UserJwtDataInterface) {
  try {
    const refresh = await generateRefreshToken(data)
    const access = await generateAccessToken(data)

    // looking for existing tokens for the user
    const isRefreshExist = await tokenRepository.exist({where: {tokenType: 'refresh', user: {id: data.userId}}})
    if (isRefreshExist) {
      await tokenRepository.delete({tokenType: 'refresh', user: {id: data.userId}})
    }
    const isAccessExist = await tokenRepository.exist({where: {tokenType: 'access', user: {id: data.userId}}})
    if (isAccessExist) {
      await tokenRepository.delete({tokenType: 'access', user: {id: data.userId}})
    }

    await tokenRepository.insert({token: refresh, tokenType: 'refresh', user: {id: data.userId}})
    await tokenRepository.insert({token: access, tokenType: 'access', user: {id: data.userId}})

    return {
      access: access,
      refresh: refresh,
    }
  } catch (error) {
    throw Error(`Error during generating/saving tokens | => ${error2msg(error)}`)
  }

}