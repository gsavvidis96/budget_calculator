import { OpenAPIV3 } from "openapi-types";

export default {
    "/auth/login": {
        post: {
            summary: "Login",
            tags: [
                "auth"
            ]
        }
    } as OpenAPIV3.PathsObject
} 