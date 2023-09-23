
import {NextFunction, Response} from 'express'
import {RegisterByEmailRequest} from "../interfaces";
import {emailProviderRepository} from "../repositories";
import {createUserByEmail} from "../../users";
import bcrypt from "bcrypt"
import {BCRYPT_SALT_ROUNDS, JWT_ACCESS_EXPIRE_TIME, JWT_REFRESH_EXPIRE_TIME} from "../constants";
import assert from "assert";
import {generateAndSaveTokenPair} from "../services";

export async function loginByEmail (req: RegisterByEmailRequest, res: Response, next: NextFunction) {
    try {
        const provider = await emailProviderRepository.findOne({where: {email: req.body.email}})

        assert.ok(provider, `No such provider with email ${req.body.email}. Probably you registered via phone`)

        const isPasswordCorrect = await bcrypt.compare(req.body.password, provider.passwordHash)

        assert.ok(isPasswordCorrect, 'Incorrect password')

        const tokens = await generateAndSaveTokenPair({ email: req.body.email, userId: provider.userId })
        console.log(`got tokens: ${JSON.stringify(tokens)}`)

        res.cookie('refresh', tokens.refresh, {maxAge: JWT_REFRESH_EXPIRE_TIME, httpOnly: true})
        res.cookie('access', tokens.access, {maxAge: JWT_ACCESS_EXPIRE_TIME, httpOnly: true})

        res.json({success: true})
        res.status(200)
    } catch (error) {
        next(new Error(`Error during register by email | => ${error instanceof Error ? error.message : ''}`))
    }
}