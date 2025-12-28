import { Response } from "express";

const setTokenCookie = (res: Response, result: any) => {
  res.cookie("refreshToken", result.token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 6 * 60 * 60 * 1000,
  });
};
export default setTokenCookie;
