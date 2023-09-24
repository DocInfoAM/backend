import express from "express";
import {error2msg} from "../../../utils";
import assert from "assert";
import {generateAndSaveAccess, verifyAccess, verifyRefresh} from "../services";
import {JWT_ACCESS_EXPIRE_TIME} from "../constants";

export async function authGuard(req: express.Request, res: express.Response, next: express.NextFunction) {
  try {
    const { access, refresh } = req.cookies as {access: string, refresh: string}

    assert.ok(access || refresh, 'No access or refresh token found')

    if (access) {
      try {
        verifyAccess(access)
        next()
        return
      } catch (error) {}
    }

    if (refresh) {
      verifyRefresh(refresh)
      const newToken = await generateAndSaveAccess(refresh)
      res.cookie('access', newToken.access, {maxAge: JWT_ACCESS_EXPIRE_TIME, httpOnly: true})
    }

    next()
  } catch (error) {
    next(new Error(`Auth error | => ${error2msg(error)}`))
  }

}