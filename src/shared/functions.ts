import { sign } from "jsonwebtoken";

export function signJwtToken(user,secretKey)
{
    return sign(user, secretKey ,{ expiresIn: 60 * 60 });
}