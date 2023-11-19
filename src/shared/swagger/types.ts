import { Type } from '@sinclair/typebox';

const SuccessResponseSchema = Type.Strict(
  Type.Object(
    {
      message: Type.String(),
    },
    { additionalProperties: false },
  ),
);

export { SuccessResponseSchema };
