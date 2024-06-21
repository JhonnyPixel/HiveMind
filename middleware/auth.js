import { AuthController } from "../controllers/AuthController.js";


export function enforceAuthentication(req, res, next){
    const authHeader = req.headers['authorization']
    const token = authHeader?.split(' ')[1];
    if(!token){
      console.log("non c'è header")
      next({status: 401, message: "Unauthorized"});
      return;
    }
    AuthController.isTokenValid(token, (err, decodedToken) => {
      if(err){
        console.log("non è valido il token")
        next({status: 401, message: "Unauthorized"});
      } else {
        req.login = decodedToken.login;
        next();
      }
    });
  }
  

  export async function ensureUsersVoteOrCommentOnlyOtherIdeas(req, res, next){
    const login = req.login;
    const ideaId = req.params.id;
    const userHasPermission = await AuthController.canUserVoteOrComment(login, ideaId);
    if(userHasPermission){
      next();
    } else {
      next({
        status: 403, 
        message: "Forbidden! You do not have permissions to view or modify this resource"
      });
    }
  }