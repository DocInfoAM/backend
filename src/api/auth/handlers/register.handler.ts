
import {NextFunction, Response} from 'express'
import {RegisterByEmailRequest} from "../interfaces";
import {userRepository} from "../../users";
import {emailProviderRepository} from "../repositories";
import assert from "assert";

export async function registerByEmail (req: RegisterByEmailRequest, res: Response, next: NextFunction) {
    try {
        const user = userRepository.create({identity: req.body.email, providerType: 'email'})
        const insertUserResult = await userRepository.insert(user)
        const resp = insertUserResult.identifiers.pop() as {id: number} | undefined
        assert.ok(resp, new Error('Create user error'))
        const provider = emailProviderRepository.create({...req.body, userId: resp.id})
        const insertResult = await emailProviderRepository.insert(provider)
        res.json({success: true})
        res.status(200)
    } catch (error) {
        next(new Error(`Error during register by email | => ${error instanceof Error ? error.message : ''}`))
    }
}