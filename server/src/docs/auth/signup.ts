import { OpenAPIV3 } from "openapi-types";

export default {
    "/auth/signup": {
        post: {
            summary: "Signin",
            tags: [
                "auth"
            ]
        }
    } as OpenAPIV3.PathsObject
} 