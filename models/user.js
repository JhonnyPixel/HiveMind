import { DataTypes} from "sequelize";
import bcrypt from "bcrypt";


export function createModel(database) {
  const User = database.define('User', {
    // Model attributes are defined here
    login: {
      type: DataTypes.STRING,
      allowNull: false,
      primaryKey: true
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false
      
    },
  });

  // Hook beforeCreate per hashare la password prima di creare il record
  User.addHook('beforeCreate', async (user) => {
    if (user.password) {
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(user.password, salt);
    }
  });

  // Hook beforeUpdate per hashare la password prima di aggiornare il record
  User.addHook('beforeUpdate', async (user) => {
    if (user.changed('password')) {
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(user.password, salt);
    }
  });

}



