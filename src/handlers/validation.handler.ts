import { validationResult } from 'express-validator'
import {Request, Response, NextFunction} from 'express'

export function validation(req: Request, res: Response, next: NextFunction) {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        return res.status(422).json({ errors: errors.mapped() })
    }
    next()
}