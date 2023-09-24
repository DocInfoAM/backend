import {UserJwtDataInterface} from "../interfaces";
import {sign, verify} from "jsonwebtoken"
import {tokenRepository} from "../repositories";
import {JWT_ACCESS_EXPIRE_TIME, JWT_REFRESH_EXPIRE_TIME} from "../constants";
import {error2msg} from "../../../utils";
import express from "express";


export async function generateAndSaveToken(data: UserJwtDataInterface, tokenType: 'access' | 'refresh') {

  await findAndDelete(data, tokenType)

  const token = sign(data, process.env[`JWT_${tokenType.toUpperCase()}_SECRET`] ?? `${tokenType}_secret`, {
    expiresIn: tokenType === 'access' ? JWT_ACCESS_EXPIRE_TIME : JWT_REFRESH_EXPIRE_TIME
  })

  await tokenRepository.insert({token, tokenType, user: {id: data.userId}})
  return token
}

export async function generateAndSaveAccess(refresh: string) {

  const {userId, email, session} = verifyRefresh(refresh) as UserJwtDataInterface

  const token = sign({userId, email, session}, process.env[`JWT_ACCESS_SECRET`] ?? `access_secret`, {
    expiresIn: JWT_ACCESS_EXPIRE_TIME
  })

  await findAndDelete({userId, session, email}, 'access')

  await tokenRepository.insert({token, tokenType: 'access', user: {id: userId}})
  return {access: token}
}

async function findAndDelete(data: UserJwtDataInterface, tokenType: 'refresh' | 'access') {
  const existing = await tokenRepository.findOneBy({
    tokenType: tokenType,
    session: data.session,
    user: {id: data.userId}
  })

  console.log(`find and delete: find token: ${JSON.stringify(existing)}`)

  if (existing) await tokenRepository.delete({token: existing.token})
}

export async function generateAndSaveTokenPair(data: UserJwtDataInterface) {
  try {
    const refresh = await generateAndSaveToken(data, 'refresh')
    const access = await generateAndSaveToken(data, 'access')

    return {
      access: access,
      refresh: refresh,
    }
  } catch (error) {
    throw Error(`Error during generating/saving tokens | => ${error2msg(error)}`)
  }

}

export function verifyAccess(token: string) {
  try {
    return verify(token, process.env.JWT_ACCESS_SECRET ?? 'access_secret')
  } catch (error) {
    throw Error(`Error verify access token: | => ${error2msg(error)}`)
  }

}

export function verifyRefresh(token: string) {
  try {
    return verify(token, process.env.JWT_REFRESH_SECRET ?? 'refresh_secret')
  } catch (error) {
    throw Error(`Error verify refresh token: | => ${error2msg(error)}`)
  }
}