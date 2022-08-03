import { OpenAPIV3 } from "openapi-types";

export default {
    "/auth/signup": {
        post: {
            summary: "Signin",
            tags: [
                "auth"
            ],
            requestBody: {
                content: {
                    "application/json": {
                        schema: {
                            type: "object",
                            required: [
                                "email",
                                "password"
                            ],
                            properties: {
                                email: {
                                    type: "string",
                                    example: "example@gsavvidis.com"
                                },
                                password: {
                                    type: "string",
                                    example: "123123"
                                }
                            }
                        }
                    }
                }
            } as OpenAPIV3.RequestBodyObject,
            responses: {
                201: {
                    description: "Successful signup",
                    content: {
                        'application/json': {
                            schema: {
                                type: "object",
                                properties: {

                                }
                            }
                        }
                    }
                }
            } as OpenAPIV3.ResponsesObject
        },
    } as OpenAPIV3.PathsObject
} 