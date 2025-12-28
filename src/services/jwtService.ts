import jwt from "jsonwebtoken";

class JwtServices {
  private ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET!;
  private REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET!;

  public generateAccessToken(payload: object) {
    return jwt.sign(payload, this.ACCESS_TOKEN_SECRET, { expiresIn: "3h" });
  }

  public generateRefreshToken(payload: object) {
    return jwt.sign(payload, this.REFRESH_TOKEN_SECRET, { expiresIn: "7d" });
  }

  public verifyAccessToken(token: string) {
    return jwt.verify(token, this.ACCESS_TOKEN_SECRET);
  }

  public verifyRefreshToken(token: string) {
    return jwt.verify(token, this.REFRESH_TOKEN_SECRET);
  }
}

export default JwtServices;
