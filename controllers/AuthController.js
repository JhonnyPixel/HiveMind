import bcrypt from "bcrypt";
import { User, Idea } from "../models/db.js";
import Jwt from "jsonwebtoken";


export class AuthController {
  
  static async checkCredentials(req, res){

    let user = await User.findOne({
      where: {
        login: req.body.login
      }
    });

    if (!user) {
      return false;
    }
    

    const validPassword = await bcrypt.compare(req.body.password, user.password);

    return validPassword;
  }

  


  static issueToken(userLogin){
    return Jwt.sign({login: userLogin}, process.env.TOKEN_SECRET, {expiresIn: `${24*60*60}s`});
  }

  static isTokenValid(token, callback){
    Jwt.verify(token, process.env.TOKEN_SECRET, callback);
  }


  static async canUserVoteOrComment(userLogin,ideaId){
    const idea=await Idea.findByPk(ideaId);

    

    return idea && idea.UserLogin !== userLogin; 
    
  }
}