import jwt from "jsonwebtoken";

export const generateToken = (userId, res) => {
  const token = jwt.sign({userId}, process.env.JWT_SECRET, {expiresIn: "7d"});
  
  // For cross-domain cookies when working locally, use sameSite: "lax" for development
  res.cookie("jwt", token, {
    maxAge: 7*24*60*60*1000,
    httpOnly: true,
    sameSite: process.env.NODE_ENV === "development" ? "lax" : "none",
    secure: true // Always use secure for SameSite: None, even in development
  });
  
  // Also set Authorization header for APIs that don't support cookies
  res.setHeader('Authorization', `Bearer ${token}`);
  
  return token;
};