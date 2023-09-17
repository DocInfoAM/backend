import {NextFunction, Response} from 'express'
import { CreateUserByEmailRequest } from "../interfaces";
import {userRepository} from "../repositories";

export async function createUserByEmail (req: CreateUserByEmailRequest, res: Response, next: NextFunction) {
    try {
        const user = userRepository.create({identity: req.body.email, providerType: 'email'})
        await userRepository.insert(user)
        res.json({success: true})
        res.status(200)
    } catch (error) {
        next(new Error(`Error during user creation | => ${error instanceof Error ? error.message : ''}`))
    }
}