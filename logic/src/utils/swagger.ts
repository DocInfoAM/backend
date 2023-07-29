import { Express, Request, Response } from "express";
import swaggerJSDoc from "swagger-jsdoc";
import { Router } from "express";
import swaggerUi from "swagger-ui-express";

const options: swaggerJSDoc.OAS3Options = {
    definition: {
        openapi: "3.0.0",
        info: {
            title: "DocInfo Express API",
            version: "0.1.0",
            description: "CRUD API fro DocInfo project",
        },
        components: {
            securitySchemes: {
                bearerAuth: {
                    type: "http",
                    scheme: "bearer",
                    bearerFormat: "JWT",
                },
            },
        },
        servers: [
            {
                url: "http://localhost:5000",
            },
        ],
    },
    apis: ["./src/api/**/*.routes.ts"],
};

const specs = swaggerJSDoc(options);

const router = Router();

router.use("/docs", swaggerUi.serve, swaggerUi.setup(specs));

export default router;
