import { OpenAPIV3 } from "openapi-types";

export default {
    "/auth/provider-login": {
        post: {
            summary: "Provider Login",
            tags: [
                "auth"
            ]
        }
    } as OpenAPIV3.PathsObject
} 