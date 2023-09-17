import {dataSource} from "../../../db/data-source";
import {User} from "../entities";

export const userRepository = dataSource.getRepository(User)