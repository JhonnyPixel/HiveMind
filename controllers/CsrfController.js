import crypto from "crypto";

export class CsrfController{

    static csrfTokenMap = new Map();

    static isCsrfValid(req,token) {
        const userToken = this.csrfTokenMap.get(req.login);
        if (!userToken || userToken !== token) {
            return false;
        }
        return true;
    }

    static createCsrfToken(login){
        const token=crypto.randomBytes(32).toString('hex');
        this.csrfTokenMap.set(login,token);
        return token;
    }
}