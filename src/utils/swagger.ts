import { Router } from "express";
import swaggerUi from "swagger-ui-express";
import * as OpenApiValidator from "express-openapi-validator";
import { userPaths } from "../api/user/user.swagger";
import { OpenAPIV3 } from "express-openapi-validator/dist/framework/types";
import { clinicPaths } from "../api/clinic/clinic.swagger";

function loadPaths(pathObject: OpenAPIV3.PathsObject) {
    for (const [path, value] of Object.entries(pathObject)) {
        apiSpec.paths[path] = value;
    }
}

const apiSpec: OpenAPIV3.Document = {
    openapi: "3.0.0",
    info: {
        title: "DocInfo API Spec",
        version: "1.0.0",
    },
    servers: [
        {
            url: "http://localhost:5000",
        },
    ],
    paths: {},
};

loadPaths(userPaths);
loadPaths(clinicPaths);

const router = Router();

router.use("/docs", swaggerUi.serve, swaggerUi.setup(apiSpec));
router.use(
    OpenApiValidator.middleware({
        apiSpec,
        validateRequests: true,
    }),
);

export default router;
