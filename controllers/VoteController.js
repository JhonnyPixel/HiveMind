import { Vote } from "../models/db.js";



export class VoteController{
    static async postNewVote(req){
        
        try {
            const vote = await Vote.findOne({
                where: {
                    UserLogin: req.login,
                    IdeaId: req.params.id
                }
            });

            if (!vote) {
                console.log("vote created")
                return Vote.create({
                    UserLogin: req.login,
                    IdeaId: req.params.id,
                    vote: req.body.vote

                });

            } else {
                    console.log("vote updated")
                vote.vote = req.body.vote;
                return vote.save();
            }

        } catch (error) {
            console.error("Error finding vote:", error);
        }

        
    }
}