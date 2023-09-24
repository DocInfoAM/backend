import {userRepository} from "../repositories";
import {NextFunction, Response, Request} from "express";
import {error2msg} from "../../../utils";

export async function getUsers(req: Request, res: Response, next: NextFunction) {
  try {
    const users = await userRepository.find()

    res.json({users})
    res.status(200)

  } catch (error) {
    next(new Error(`Error during get users | => ${error2msg(error)}`))
  }

}