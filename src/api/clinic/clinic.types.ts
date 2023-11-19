import { Static, Type } from '@sinclair/typebox';

const ClinicSchema = Type.Strict(
  Type.Object(
    {
      name: Type.String(),
      address: Type.String(),
    },
    { additionalProperties: false },
  ),
);

type TClinic = Static<typeof ClinicSchema>;

export { TClinic, ClinicSchema };
