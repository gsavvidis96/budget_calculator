import auth from "./auth";
import { OpenAPIV3 } from "openapi-types";

export default {
    openapi: "3.0.0",
    info: {
        version: "1.0.0",
        title: "Budget Calculator",
        description: "Api docs for Budget Calculator REST api",
        contact: {
            name: "Giannis Savvidis",
            email: "gsavvidis96@gmail.com",
            url: "https://cv.gsavvidis.com",
        },
    },
    servers: [
        {
            url: "http://localhost:3000",
            description: "Local server"
        },
        {
            url: "https://budget-calculator.gsavvidis.com",
            description: "Production server"
        },
    ],
    components: {
        securitySchemes: {
            bearerAuth: {
                type: "http",
                scheme: "bearer",
                bearerFormat: "BEARER"
            }
        },
    },
    paths: {
        ...auth
    }
} as OpenAPIV3.Document