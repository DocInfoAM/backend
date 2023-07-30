import { OpenAPIV3 } from "express-openapi-validator/dist/framework/types";
import { User, UserSchema } from "./user.types";
import { SuccessResponseSchema } from "../../shared/swagger/types";

const userExample: User = {
    email: "user@mail.ru",
    passwordHash: "qwerty",
};

export const userPaths: OpenAPIV3.PathsObject = {
    "/api/v1/users": {
        post: {
            summary: "Создание нового пользователя",
            requestBody: {
                required: true,
                content: {
                    "application/json": {
                        schema: UserSchema as OpenAPIV3.SchemaObject,
                        example: userExample,
                    },
                },
            },
            responses: {
                200: {
                    description: "Успешный ответ",
                    content: {
                        "application/json": {
                            schema: SuccessResponseSchema as OpenAPIV3.SchemaObject,
                        },
                    },
                },
            },
        },
    },
};
