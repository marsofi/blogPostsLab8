const express = require('express');
const bodyParser = require('body-parser');
const router = express.Router();
const {
    ListPosts
} = require('./blog-posts-model');

const jsonParser = bodyParser.json();

router.get('/blog-posts', (req, res, next) => {
    let postsArray = ListPosts.get();

    if (!postsArray) {
        res.status(500).json({
            message: "Internal server error",
            status: 500,
        });
        return next();
    }

    res.status(200).json({
        message: "Successfully sent the list of posts",
        status: 200,
        posts: postsArray
    }).send("Finish");
});

router.get('/blog-posts/:author', (req, res, next) => {

    let postAuthor = req.params.author;

    if (!postAuthor) {
        res.status(406).json({
            message: "Author not found in path",
            status: 406
        });
        return next();
    }

    let postsArray = ListPosts.getByAuthor(postAuthor);

    if (!postsArray) {
        res.status(500).json({
            message: "Internal server error",
            status: 500,
        });
        return next();
    }

    if (postsArray.length > 0) {
        res.status(200).json({
            message: "Successfully sent the post",
            status: 200,
            posts: postsArray
        }).send("Finish");
    } else {
        res.status(404).json({
            message: "Author not found",
            status: 404
        });
        return next();
    }


});

router.post('/blog-posts', jsonParser, (req, res, next) => {

    let requireFields = ["title", "content", "author", "publishDate"];
    for (let field of requireFields) {
        if (!(field in req.body)) {
            res.status(406).json({
                message: `Missing field ${field} in body`,
                status: 406
            });
            return next();
        }
    }

    let postTitle = req.body.title;
    let postContent = req.body.content;
    let postAuthor = req.body.author;
    let postPublishDate = req.body.publishDate;

    let postDone = ListPosts.post(postTitle, postContent, postAuthor, postPublishDate);

    if (!postDone) {
        res.status(500).json({
            message: "Internal server error",
            status: 500,
        });
        return next();
    }
    res.status(200).json({
        message: "Successfully added new post",
        status: 200,
        post: postDone
    }).send("Finish");

});

router.delete('/blog-posts/:id*?', jsonParser, (req, res, next) => {
    let postId = req.params.id;
    let postIdBody = req.body.id;

    if (postIdBody != postId) {
        res.status(406).json({
            message: "Post in body doesn't match param",
            status: 406
        });
        return next();
    }

    let verifyId = ListPosts.verifyId(postId);
    if (verifyId == null) {
        res.status(500).json({
            message: "Internal server error",
            status: 500,
        });
        return next();
    } else if (verifyId == false) {
        res.status(404).json({
            message: "Post not found",
            status: 404
        });
        return next();
    }

    ListPosts.delete(postId);
    res.status(204).send("Finish");

});

router.put('/blog-posts/:id*?', jsonParser, (req, res, next) => {
    let postId = req.params.id;
    if (!postId) {
        res.status(406).json({
            message: `Missing id in path`,
            status: 406
        });
        return next();
    }

    let verifyId = ListPosts.verifyId(postId);
    console.log(verifyId);
    if (verifyId == null) {
        res.status(500).json({
            message: "Internal server error",
            status: 500,
        });
        return next();
    } else if (!verifyId) {
        res.status(404).json({
            message: "Post not found",
            status: 404
        });
        return next();
    }

    let postTitle = req.body.title;
    let postContent = req.body.content;
    let postAuthor = req.body.author;
    let postPublishDate = req.body.publishDate;

    if (!postTitle && !postContent && !postAuthor && !postPublishDate) {
        res.status(404).json({
            message: `At least one field is require.`,
            status: 404
        });
        return next();
    }

    let postDone = ListPosts.put(postId, postTitle, postContent, postAuthor, postPublishDate);

    if (!postDone) {
        res.status(500).json({
            message: "Internal server error",
            status: 500,
        });
        return next();
    }
    res.status(200).json({
        message: "Successfully updated post",
        status: 200,
        post: postDone
    }).send("Finish");
});

module.exports = router;