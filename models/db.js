import { Sequelize } from "sequelize";
import { createModel as createUserModel } from "./user.js";
import { createModel as createIdeaModel } from "./idea.js";
import { createModel as createCommentModel } from "./comment.js";
import { createModel as createVoteModel } from "./vote.js";


import 'dotenv/config.js'; //read .env file and make it available in process.env

export const database = new Sequelize(process.env.DB_CONNECTION_URI, {
  dialect: process.env.DIALECT
});

createUserModel(database);
createIdeaModel(database);
createCommentModel(database);
createVoteModel(database);



export const {User, Idea, Comment, Vote} = database.models;

//associations configuration

User.hasMany(Comment, {
  foreignKey: {
    allowNull: false
  }
});
Comment.belongsTo(User);

// Idea-Comment association
Idea.hasMany(Comment, {
  foreignKey: {
    allowNull: false
  }
});
Comment.belongsTo(Idea);

User.hasMany(Vote, {
  foreignKey: {
    allowNull: false
  }
});
Vote.belongsTo(User);

// Idea-Vote association
Idea.hasMany(Vote, {
  foreignKey: {
    allowNull: false
  }
});
Vote.belongsTo(Idea);

// User-Idea through Vote
User.belongsToMany(Idea, { through: Vote });
Idea.belongsToMany(User, { through: Vote });


User.hasMany(Idea);
Idea.belongsTo(User, {
  foreignKey: {
    allowNull: false
  }
});






database.sync().then( async () => {
  console.log("Database synced correctly");
  
}).catch( err => {
  console.error("Error with database synchronization: " + err.message);
});

