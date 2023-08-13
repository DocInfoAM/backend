import { OpenAPIV3 } from "express-openapi-validator/dist/framework/types";
import { TClinic, ClinicSchema } from "./clinic.types";

const clinicExample: TClinic = {
    name: "Лучшие доктора точка ком",
    address: "Улица Герцена, 22",
};

const clinicExampleResponse = {
    ...clinicExample,
    id: 13,
};

export const clinicPaths: OpenAPIV3.PathsObject = {
    "/api/v1/clinics": {
        post: {
            tags: ["Clinics"],
            summary: "Создание (регистрация) новой клиники",
            requestBody: {
                required: true,
                content: {
                    "application/json": {
                        schema: ClinicSchema as OpenAPIV3.SchemaObject,
                        example: clinicExample,
                    },
                },
            },
            responses: {
                200: {
                    description: "Успешный ответ",
                    content: {
                        "application/json": {
                            example: clinicExampleResponse,
                        },
                    },
                },
            },
        },
    },
};
