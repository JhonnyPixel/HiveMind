import { DataTypes} from "sequelize";
import { Idea } from "./db.js";



export function createModel(database){

    const Vote=database.define('Vote', {
        
        vote: {
            type:DataTypes.INTEGER,
            allowNull:false ,
            validate: {
              isValidVote(value) {
                  if (value !== -1 && value !== 1) {
                      throw new Error('Il voto deve essere -1 o 1');
                  }
              }
          }
        }
       
        
      });

      

      Vote.addHook('afterCreate', async (vote) => {
        const idea = await Idea.findOne({ where: { id: vote.IdeaId } });
        idea.votation = idea.votation + 1;
        await idea.save();
      });

}


