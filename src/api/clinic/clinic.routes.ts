import express, { Request, Response } from 'express';
import { dataSource } from '../../db/data-source';
import { Clinic } from './clinic.entity';
import { TClinic } from './clinic.types';

export const clinicRouter = express.Router();

clinicRouter.post('/', async function (req: Request, res: Response) {
  const data = req.body as TClinic;
  const clinic = dataSource.getRepository(Clinic).create(data);
  const results = await dataSource.getRepository(Clinic).save(clinic);
  return res.send(results);
});
