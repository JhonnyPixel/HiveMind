import express from 'express';
import { IdeaController } from '../controllers/IdeaController.js';
import { CommentController } from '../controllers/CommentController.js';
import { ensureUsersVoteOrCommentOnlyOtherIdeas} from '../middleware/auth.js';
import { enforceCSRFToken } from '../middleware/csrf.js';
import { VoteController } from '../controllers/VoteController.js';


export const IdeaRouter = express.Router();


/**
 * @swagger
 * components:
 *   schemas:
 *     Idea:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           example: 1
 *         titolo:
 *           type: string
 *           example: "Nuova Idea"
 *         descrizione:
 *           type: string
 *           example: "Questa è una descrizione dell'idea."
 *         UserLogin:
 *           type: string
 *           example: "user123"
 *         totalVotes:
 *           type: integer
 *           description: the total number of votes
 *           example: 10
 *         voteBalance:
 *           type: integer
 *           description: the total balance for the votes
 *           example: 5
 *         userVote:
 *           type: integer
 *           description: 0 if the user that requested data did not vote for the idea, otherwise it is the vote given
 *           example: 1
 *     Vote:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           example: 1
 *         ideaId:
 *           type: integer
 *           example: 1
 *         UserLogin:
 *           type: string
 *           example: "user123"
 *         vote:
 *           type: integer
 *           example: 1
 *     Comment:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           example: 1
 *         ideaId:
 *           type: integer
 *           example: 1
 *         UserLogin:
 *           type: string
 *           example: "user123"
 *         comment:
 *           type: string
 */

/**
 * @swagger
 * /idea/controversial:
 *   get:
 *     summary: Get most controversial ideas
 *     tags: 
 *       - Ideas
 *     responses:
 *       200:
 *         description: List of most controversial ideas
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Idea'
 *       500:
 *         description: Unable to fetch most controversial ideas
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Unable to fetch mostControversialIdeas: <error_message>"
 */

IdeaRouter.get("/idea/controversial",async (req,res)=>{
    //prendi dati idee piu controverse
    try{
        const ideas=await IdeaController.getMostControversialIdeas(req);
        res.json({ data: ideas});
    }catch(err){
        res.status(500);
        res.json({error:"Unable to fetch mostControversialIdeas: "+err});
    }
    
})

/**
 * @swagger
 * /idea/unpopular:
 *   get:
 *     summary: Get most unpopular ideas
 *     tags: 
 *       - Ideas
 *     responses:
 *       200:
 *         description: List of most unpopular ideas
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Idea'
 *       500:
 *         description: Unable to fetch most unpopular ideas
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Unable to fetch mostUnpopularIdeas: <error_message>"
 */

IdeaRouter.get("/idea/unpopular",async (req,res)=>{
    //prendi dati idee piu impopolari
    try{
        const ideas=await IdeaController.getMostUnpopularIdeas(req);
        res.json({ data: ideas});
    }catch(err){
        res.status(500);
        res.json({error:"Unable to fetch mostUnpopularIdeas: "+err});
    }
})

/**
 * @swagger
 * /idea/mainstream:
 *   get:
 *     summary: Get most mainstream ideas
 *     tags: 
 *       - Ideas
 *     responses:
 *       200:
 *         description: List of most mainstream ideas
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Idea'
 *       500:
 *         description: Unable to fetch most mainstream ideas
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Unable to fetch mostMainstreamIdeas: <error_message>"
 */

IdeaRouter.get("/idea/mainstream",async (req,res)=>{
    //prendi dati idee piu mainstreaam
    try{
        const ideas=await IdeaController.getMostMainstreamIdeas(req);
        res.json({ data: ideas});
    }catch(err){
        res.status(500);
        res.json({error:"Unable to fetch mostMainstreamIdeas "+err});
    }
})

/**
 * @swagger
 * /idea/{id}:
 *   get:
 *     summary: Get a specific idea and its comments
 *     tags: 
 *       - Ideas
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the idea
 *     responses:
 *       200:
 *         description: Specific idea data
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   $ref: '#/components/schemas/Idea'
 *       404:
 *         description: Idea not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Idea with id {id} not found
 *       500:
 *         description: Unable to fetch specific idea
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Unable to fetch specific idea <error_message>"
 */

IdeaRouter.get("/idea/:id",async (req,res)=>{
    //prendi dati per la pagina di un idea specifica + commenti
    try{
        const idea=await IdeaController.getIdeaData(req.params.id);
        if(!idea){
            res.status(404);
            res.json({error:`Idea with id ${req.params.id} not found`});
        }else{
            res.json({ data: idea});
        }
    }catch(err){
        res.status(500);
        res.json({error:"Unable to fetch specific idea"+err});
    }
})

/**
 * @swagger
 * /idea:
 *   post:
 *     summary: Post a new idea
 *     tags: 
 *       - Ideas
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 example: New Idea
 *               description:
 *                 type: string
 *                 example: This is a description of the new idea.
 *     responses:
 *       200:
 *         description: Successfully posted idea
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 info:
 *                   type: string
 *                   example: successfully posted idea
 *                 data:
 *                   $ref: '#/components/schemas/Idea'
 *       500:
 *         description: Unable to post idea
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Unable to post idea <error_message>"
 */

IdeaRouter.post("/idea",enforceCSRFToken,async (req,res)=>{
    //posta nuova idea da parte dell utente x
    try{
        const idea=await IdeaController.postNewIdea(req);
        res.json({ info: "succesfully posted idea:" ,data:idea});
    }catch(err){
        res.status(500);
        res.json({error:"Unable to post idea "+err});
    }
   
})

/**
 * @swagger
 * /idea/{id}/vote:
 *   post:
 *     summary: Post a vote for an idea
 *     tags: 
 *       - Ideas
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the idea to vote for
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               vote:
 *                 type: integer
 *                 example: 1
 *     responses:
 *       200:
 *         description: Successfully posted vote
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 info:
 *                   type: string
 *                   example: successfully posted vote
 *                 data:
 *                   $ref: '#/components/schemas/Vote'
 *       500:
 *         description: Unable to post vote
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Unable to post vote <error_message>"
 */

IdeaRouter.post("/idea/:id/vote",enforceCSRFToken,ensureUsersVoteOrCommentOnlyOtherIdeas,async (req,res)=>{
    //posta nuovo voto per l idea (:id)
    try{
        const idea=await VoteController.postNewVote(req);
        res.json({ info: "succesfully posted vote:",data:idea});
    }catch(err){
        res.status(500);
        res.json({error:"Unable to post vote "+err});
    }
})

/**
 * @swagger
 * /idea/{id}/comment:
 *   post:
 *     summary: Post a comment for an idea
 *     tags: 
 *       - Ideas
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the idea to comment on
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               comment:
 *                 type: string
 *                 example: This is a comment.
 *     responses:
 *       200:
 *         description: Successfully posted comment
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 info:
 *                   type: string
 *                   example: successfully posted comment
 *                 data:
 *                   $ref: '#/components/schemas/Comment'
 *       500:
 *         description: Unable to post comment
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Unable to post comment <error_message>"
 */

IdeaRouter.post("/idea/:id/comment",enforceCSRFToken,ensureUsersVoteOrCommentOnlyOtherIdeas,async (req,res)=>{
    //posta nuovo commento per l idea (:id)
    try{
        const comment=await CommentController.postNewComment(req);
        res.json({ info: "succesfully posted comment",data:comment});
    }catch(err){
        res.status(500);
        res.json({error:"Unable to post comment "+err});
    }
})





