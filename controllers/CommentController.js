import { Comment } from "../models/db.js";


export class CommentController {
    static postNewComment(req) {
        return Comment.create({
            UserLogin: req.login,
            IdeaId: req.params.id,
            content: req.body.content

        });
    }
}
