const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

let postSchema = mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    content: {
        type: String,
        required: true
    },
    author: {
        type: String,
        required: true
    },
    publishDate: {
        type: Date,
        required: true
    }
})

let Posts = mongoose.model('posts', postSchema);


const ListPosts = {

    get: function () {
        return Posts.find()
            .then(posts => {
                return posts
            })
            .catch(err => {
                throw new Error(err)
            });
    },
    getByAuthor: function (author) {
        return Posts.find({
                author: author
            })
            .then(posts => {
                if (posts) {
                    return posts;
                }
            })
            .catch(err => {
                throw new Error(err);
            });
    },
    getByID: function (id) {
        return Posts.find({
                _id: id
            })
            .then(post => {
                if (post) {
                    return post;
                }
            })
            .catch(err => {
                throw new Error(err);
            });
    },
    post: function (title, content, author, date) {
        let item = {
            title: title,
            content: content,
            author: author,
            publishDate: new Date(date)
        };

        return Posts.create(item)
            .then(post => {
                return post;
            })
            .catch(err => {
                throw new Error(err);
            });

    },
    put: function (postId, title, content, author, date) {
        let item = {};

        if (title) {
            item.title = title;
        }
        if (content) {
            item.content = content;
        }
        if (author) {
            item.author = author;
        }
        if (date) {
            item.publishDate = new Date(date);
        }

        return Posts.findOneAndUpdate({
                _id: postId
            }, {
                $set: item
            }, {
                new: false
            })
            .then(post => {
                if (post) {
                    return post;
                }
            })
            .catch(err => {
                throw new Error(err);
            });

    },
    delete: function (postId) {
        return Posts.findOneAndRemove({
                _id: postId
            })
            .then(post => {
                return post
            })
            .catch(err => {
                throw new Error(err);
            })
    },
}

module.exports = {
    ListPosts
}