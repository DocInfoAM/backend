import {dataSource} from "../../../db/data-source";
import {TokenEntity} from "../entities";

export const tokenRepository = dataSource.getRepository(TokenEntity)