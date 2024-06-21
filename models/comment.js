import { DataTypes} from "sequelize";

export function createModel(database) {
    database.define('Comment', {
        
        id: {
            type:DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey:true
        }
        ,
        content: {
            type:DataTypes.STRING,
            allowNull:false 
        }

    });
  }



