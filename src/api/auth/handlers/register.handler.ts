
import {NextFunction, Response} from 'express'
import {RegisterByEmailRequest} from "../interfaces";
import {emailProviderRepository} from "../repositories";
import {createUserByEmail} from "../../users";
import bcrypt from "bcrypt"
import {BCRYPT_SALT_ROUNDS} from "../constants";

export async function registerByEmail (req: RegisterByEmailRequest, res: Response, next: NextFunction) {
    try {
        const { userId } = await createUserByEmail(req.body.email)

        const passwordHash = await bcrypt.hash(req.body.password, BCRYPT_SALT_ROUNDS)

        const provider = emailProviderRepository.create({ email: req.body.email, userId, passwordHash })
        const insertResult = await emailProviderRepository.insert(provider)
        res.json({success: true})
        res.status(200)
    } catch (error) {
        next(new Error(`Error during register by email | => ${error instanceof Error ? error.message : ''}`))
    }
}