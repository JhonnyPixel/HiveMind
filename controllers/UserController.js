
import { User } from "../models/db.js";

export class UserController{
    static async saveUser(req, res){

    
        let user = new User({
          login: req.body.login, 
          password: req.body.password
        });
    
    
        
        return user.save(); 
      }
}