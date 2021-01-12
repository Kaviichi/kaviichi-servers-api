export interface JWTData {
    // The Discord User ID
    uid: `${bigint}`;
    // The Discord Access Token
    token: string;
    // Token expiration date in milliseconds (epoch)
    exp: number;
}
