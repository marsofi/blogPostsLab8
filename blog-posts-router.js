const express = require('express');
const bodyParser = require('body-parser');
const router = express.Router();
const {
    ListPosts
} = require('./blog-posts-model');

const jsonParser = bodyParser.json();

router.get('/blog-posts', (req, res, next) => {
    ListPosts.get()
        .then(posts => {
            res.status(200).json({
                message: "Successfully sent all blog posts.",
                status: 200,
                posts: posts
            }).send("Finish");
        }).catch(err => {
            res.status(500).json({
                message: `Internal server error.`,
                status: 500
            });
            return next();
        });

});

router.get('/blog-posts/:author', (req, res, next) => {

    let postAuthor = req.params.author
    if (!(postAuthor)) {
        res.status(406).json({
            message: `Missing field author in params.`,
            status: 406
        });
        next();
    }

    ListPosts.getByAuthor(postAuthor)
        .then(posts => {
            if (posts === undefined || posts.length == 0) {
                res.status(404).json({
                    message: `Author not found`,
                    status: 404
                })
                next();
            }
            res.status(200).json({
                message: `Successfully found blog posts for author`,
                status: 200,
                posts: posts
            }).send("Finish");
        }).catch(err => {
            console.log(err);
            res.status(500).json({
                message: `Internal server error.`,
                status: 500
            });
            return next();
        })


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

    ListPosts.post(postTitle, postContent, postAuthor, postPublishDate)
        .then(newPost => {
            res.status(201).json({
                message: `Successfully added the post.`,
                status: 201,
                postAdded: newPost
            }).send("Finish");
        })
        .catch(err => {
            res.status(500).json({
                message: `Internal server error.`,
                status: 500,
            })
            return next();
        });

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

    ListPosts.delete(postId)
        .then(post => {
            res.status(200).json({
                message: `Successfully deleted post.`,
                status: 200,
                deleted: post
            }).send("Finish")
        })
        .catch(err => {
            res.status(404).json({
                message: `Post not found in the list`,
                status: 404
            });
            next();
        })


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

    ListPosts.put(postId, postTitle, postContent, postAuthor, postPublishDate)
        .then(post => {
            res.status(201).json({
                message: `Successfully updated the post.`,
                status: 201,
                postAdded: post
            }).send("Finish");
        })
        .catch(err => {
            console.log(err);
            res.status(404).json({
                message: `Post not found in the list`,
                status: 404
            });
            next();
        });
});

module.exports = router;