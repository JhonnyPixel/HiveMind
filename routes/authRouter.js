import express from "express"
import { AuthController } from "../controllers/AuthController.js";
import { UserController } from "../controllers/UserController.js";
import { CsrfController } from "../controllers/CsrfController.js";

export const AuthRouter= express.Router();


/**
 * @swagger
 * /auth:
 *   post:
 *     summary: Authenticate a user
 *     tags: 
 *       - Auth
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               login:
 *                 type: string
 *                 example: user@example.com
 *               password:
 *                 type: string
 *                 example: password123
 *     responses:
 *       200:
 *         description: Authentication successful
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token:
 *                   type: string
 *                   example: your_jwt_token
 *       401:
 *         description: Invalid credentials
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Invalid credentials. Try again.
 */

AuthRouter.post("/auth", async (req, res) => {
    let isAuthenticated = await AuthController.checkCredentials(req, res);
    if(isAuthenticated){
      const jwtToken=AuthController.issueToken(req.body.login)
      const csrf= CsrfController.createCsrfToken(req.body.login);
      res.cookie('culo','ahabhkbashi');
      res.cookie('XSRF-TOKEN',csrf,{
        httpOnly: false,
        path: '/',
        secure: false, // True in produzione
        sameSite: 'Lax', // o 'Strict' durante lo sviluppo
        maxAge: 3600000,
      });
      res.json(jwtToken);
    } else {
      res.status(401);
      res.json( {error: "Invalid credentials. Try again."});
    }
  });

  /**
 * @swagger
 * /signup:
 *   post:
 *     summary: Register a new user
 *     tags: 
 *       - Auth
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               login:
 *                 type: string
 *                 example: user@example.com
 *               password:
 *                 type: string
 *                 example: password123
 *               name:
 *                 type: string
 *                 example: John Doe
 *     responses:
 *       200:
 *         description: User successfully registered
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                   example: 1
 *                 login:
 *                   type: string
 *                   example: user@example.com
 *                 name:
 *                   type: string
 *                   example: John Doe
 *       401:
 *         description: Problems in saving user
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Problems in saving user...
 */
  
  AuthRouter.post("/signup", (req, res) => {
    UserController.saveUser(req, res).then((user) => {

      res.json(user);
    }).catch((err) => {
      res.status(401);
      res.json( {error: "Problems in saving user..."+err});
      
    })
  });