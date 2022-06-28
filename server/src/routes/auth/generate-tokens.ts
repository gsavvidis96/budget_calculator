import { sign } from "jsonwebtoken"
import { Roles, tokenPayload } from "../../types"

export const generateTokens = async (userId: string, role: Roles, emailVerified: boolean) => {
    // generate access token 
    const accessToken = sign(
        ({
            userId,
            role,
            emailVerified
        }) as tokenPayload,
        process.env.JWT_SECRET!,
        {
            expiresIn: process.env.JWT_EXPIRATION_STR
        }
    )

    let refreshToken;

    if (emailVerified) {
        // genearete refresh token 
        refreshToken = sign(
            ({
                userId,
                role,
                emailVerified
            }) as tokenPayload,
            process.env.REFRESH_JWT_SECRET!,
            {
                expiresIn: process.env.REFRESH_JWT_EXPIRATION_STR
            }
        )
    }

    return {
        accessToken,
        refreshToken
    }
}