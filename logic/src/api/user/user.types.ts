import { Static, Type } from "@sinclair/typebox";

const UserSchema = Type.Strict(
    Type.Object(
        {
            email: Type.String(),
            passwordHash: Type.String(),
        },
        { additionalProperties: false },
    ),
);

type User = Static<typeof UserSchema>;

export { User, UserSchema };
