import {dataSource} from "../../../db/data-source";
import {EmailProviderEntity} from "../entities";

export const emailProviderRepository = dataSource.getRepository(EmailProviderEntity)