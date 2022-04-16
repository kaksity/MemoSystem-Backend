import { sign, verify } from "jsonwebtoken";

export function signJwtToken(user,secretKey)
{
    return sign(user, secretKey ,{ expiresIn: 60 * 60 });
}
export function decodeJwtToken(token, secretKey )
{
    return verify(token,secretKey);
}