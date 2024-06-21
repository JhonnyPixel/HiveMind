import { Op, literal } from "sequelize"

import { Idea,Comment} from "../models/db.js";

export class IdeaController{


    static getMostControversialIdeas(req){
        const oneWeekAgo = new Date();
        oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

        
         console.log("hello ",req.login);
            return Idea.findAll({
                attributes: [
                    'id',
                    'titolo',
                    'descrizione',
                    'UserLogin',
                    [
                        literal('(SELECT COUNT(*) FROM Votes WHERE Votes.ideaId = Idea.id)'), 
                        'totalVotes'
                    ],
                    [
                        literal('(SELECT SUM(vote) FROM Votes WHERE Votes.ideaId = Idea.id)'), 
                        'voteBalance'
                    ],
                    [
                        literal(`COALESCE((SELECT vote FROM Votes WHERE Votes.ideaId = Idea.id AND Votes.UserLogin = :userLogin), 0)`),
                        'userVote'
                    ]
                ],
        
                where: {
                    createdAt: {
                        [Op.gte]: oneWeekAgo
                    }
                },
                replacements: {
                    userLogin: req.login
                },
                group: ['Idea.id', 'Idea.titolo', 'Idea.descrizione','Idea.UserLogin'], 
                order: [
                    [literal('totalVotes'), 'DESC'],
                    [literal('ABS(voteBalance)'), 'ASC']
                ],
                raw: true
            });
    }

   

    static getMostUnpopularIdeas(req){
        const oneWeekAgo = new Date();
        oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

            return Idea.findAll({
                attributes: [
                    'id',
                    'titolo',
                    'descrizione',
                    'UserLogin',
                    [
                        literal('(SELECT COUNT(*) FROM Votes WHERE Votes.ideaId = Idea.id)'), 
                        'totalVotes'
                    ],
                    [
                        literal('(SELECT SUM(vote) FROM Votes WHERE Votes.ideaId = Idea.id)'), 
                        'voteBalance'
                    ],
                    [
                        literal(`COALESCE((SELECT vote FROM Votes WHERE Votes.ideaId = Idea.id AND Votes.UserLogin = :userLogin), 0)`),
                        'userVote'
                    ]
                ],
                where: {
                    createdAt: {
                        [Op.gte]: oneWeekAgo
                    }
                },
                replacements: {
                    userLogin: req.login
                },
                group: ['Idea.id', 'Idea.titolo', 'Idea.descrizione','Idea.UserLogin'],
                order: [
                    [literal('CASE WHEN voteBalance IS NULL THEN 1 ELSE 0 END'), 'ASC'],// Ordina per voteBalance null prima
                    [literal('voteBalance'), 'ASC'],  // Ordina per saldo dei voti in ordine crescente
                    ['totalVotes', 'DESC']   // Ordina per numero totale di voti in caso di parità di saldo
                ],
                raw: true
            });


    }


    

    static getMostMainstreamIdeas(req){
        const oneWeekAgo = new Date();
        oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);


            return Idea.findAll({
                attributes: [
                    'id',
                    'titolo',
                    'descrizione',
                    'UserLogin',
                    [
                        literal('(SELECT COUNT(*) FROM Votes WHERE Votes.ideaId = Idea.id)'), 
                        'totalVotes'
                    ],
                    [
                        literal('(SELECT SUM(vote) FROM Votes WHERE Votes.ideaId = Idea.id)'), 
                        'voteBalance'
                    ],
                    [
                        literal(`COALESCE((SELECT vote FROM Votes WHERE Votes.ideaId = Idea.id AND Votes.UserLogin = :userLogin), 0)`),
                        'userVote'
                    ]
                ],
                replacements: {
                    userLogin: req.login
                },
                
                where: {
                    createdAt: {
                        [Op.gte]: oneWeekAgo
                    }
                },
                group: ['Idea.id', 'Idea.titolo', 'Idea.descrizione','Idea.UserLogin'], 
                order: [
                    [literal('voteBalance'), 'DESC'],  // Ordina per saldo dei voti in ordine decrescente
                    ['totalVotes', 'DESC']    // Ordina per numero totale di voti in caso di parità di saldo
                ],
                raw: true
            });
    }

    static getIdeaData(ideaId){

        return Idea.findOne({
            where: { id: ideaId },
            include: [
              {
                model: Comment,
                attributes: ['id', 'UserLogin', 'IdeaId', 'content', 'createdAt'],
                required: false
              }
            ]
          })
    }

    static postNewIdea(req){
        return Idea.create({
            titolo: req.body.titolo,
            descrizione: req.body.descrizione,
            UserLogin: req.login,
            votation: 0
        });
    }



}