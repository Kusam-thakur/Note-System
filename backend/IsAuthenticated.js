import jwt from "jsonwebtoken";

const isAuthenticated = async (req, res, next) => {
  try {
    
    const token = req.headers.authorization.split(' ')[1]
    console.log(" i am from authentication", token)

    if (token == null) {
      return res.status(401).json({
        message: " token null User not authenticated",
        success: false,
      })
    }
    if (!token) {
      return res.status(401).json({
        message: " token nahi hai User not authenticated",
        success: false,
      })
    }

      const decode = jwt.verify(token, 'secret');
      console.log("decode", decode)
      if (!decode) {
        return res.status(401).json({
          message: "Invalid token",
          success: false
        })
      };
      
      // req.id = decode.userId;
      req.user = { id: decode.id };
      next();

  } catch (error) {
    console.log("error tokens in isAuthenticated", error);
  }
}
export default isAuthenticated;