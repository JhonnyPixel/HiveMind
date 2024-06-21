import { CsrfController } from "../controllers/CsrfController.js";



export function enforceCSRFToken(req, res, next){
    const token = req.headers['x-xsrf-token']
    if(!token){
      console.log("non c'è csrf token")
      next({status: 401, message: "Unauthorized"});
      return;
    }
   
    if(CsrfController.isCsrfValid(req,token)){
        next();
    }else{
        console.log("non è valido il csrf_token")
        next({status: 401, message: "Unauthorized"});
    }

  }