import jwt from "jsonwebtoken";
export const generateTokenAndSetCookie = (res,userId) => {
    const token = jwt.sign({userId}, process.env.JWT_SECRET, {
        expiresIn: "7d",
    })

    res.cookie("token", token, {
        httpOnly: true, //only http not js and prvents xss attacks
        secure: process.env.NODE_ENV === "production", //secure https: s:secure
        sameSite: "none", //protects from csrf
        maxAge : 7*24*60*60*1000,// 7 days in milliseconds
    });
    return token;
}