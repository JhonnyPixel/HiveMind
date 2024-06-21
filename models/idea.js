import { DataTypes} from "sequelize";


export function createModel(database) {
    database.define('Idea', {
      // Model attributes are defined here
      id: {
        type:DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey:true
    },
      titolo: {
        type:DataTypes.STRING,
        allowNull:false ,
        validate: {
          len: {
            args: [0, 50],
            msg: 'Il titolo deve avere al massimo 50 caratteri',
          }
        }
    },
    descrizione: {
        type:DataTypes.STRING(400),
        allowNull:false,
        validate: {
          len: {
            args: [0, 400],
            msg: 'La descrizione deve avere al massimo 400 caratteri',
          }
        }
    },
    votation: {
        type:DataTypes.INTEGER,
        allowNull:false 
    }

    });
  }


