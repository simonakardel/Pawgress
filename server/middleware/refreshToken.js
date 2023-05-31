import jwt from "jsonwebtoken";
import User from "../database/models/User.js";


export const refreshTokenMiddleware = async (req, res, next) => {
    try {

      if (req.path === "/logout") {
        return next();
      }

      const decoded = jwt.verify(req.cookies.accessToken, process.env.ACCESS_TOKEN_SECRET);
      const user = await User.findById(decoded.id);
      if (!user) {
        return res.status(401).send('Unauthorized');
      }
      req.user = user;
      next();
    } catch (error) {

      if (error.name === 'TokenExpiredError') {
        try {
          const decoded = jwt.verify(req.cookies.refreshToken, process.env.REFRESH_TOKEN_SECRET);
          const user = await User.findById(decoded.id);
  
          if (!user) {
            return res.status(401).send('Unauthorized');
          }
  
          const newAccessToken = jwt.sign({ id: user.id }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '15m' });
          res.cookie('accessToken', newAccessToken, {
            httpOnly: true,
            secure: true,
          });

          req.user = user;
  
          next();
        } catch (refreshError) {
          return res.status(401).send('Unauthorized');
        }
      } else {
        return res.status(401).send('Unauthorized');
      }
    }
  };


  