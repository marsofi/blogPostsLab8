const uuid = require('uuid');

var postsDB = [{
        id: uuid.v4(),
        title: "Calidad",
        content: "Curso de 12 creditos que incluye labroatorio.",
        author: "Tec",
        publishDate: new Date()
    },
    {
        id: uuid.v4(),
        title: "Zumba",
        content: "Clases de zumba y Strong by Zumba por Ale.",
        author: "Tec",
        publishDate: new Date()
    },
    {
        id: uuid.v4(),
        title: "Viernes Especiales",
        content: "Celebracion de los logros de la empresa",
        author: "BluePeople",
        publishDate: new Date()
    }
];

const ListPosts = {
    verifyId(postId) {
        let found = false;
        postsDB.forEach(item => {
            if (item.id == postId) {
                console.log(true);
                found = true;
            }
        });
        return found;
    },
    get: function () {
        return postsDB;
    },
    getByAuthor: function (author) {
        let posts = new Array();
        postsDB.forEach(item => {
            if (item.author == author) {
                posts.push(item);
            }
        });
        return posts;
    },
    post: function (title, content, author, date) {
        let item = {
            id: uuid.v4(),
            title: title,
            content: content,
            author: author,
            publishDate: new Date(date)
        };

        postsDB.push(item);
        return item;
    },
    put: function (postId, title, content, author, date) {

        let it;
        postsDB.forEach(item => {
            if (item.id == postId) {

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
                it = item;
            }
        });
        return it;
    },
    delete: function (postId) {
        postsDB.forEach((item, index) => {
            if (item.id == postId) {
                delete postsDB[index];
            }
        });
    },
}

module.exports = {
    ListPosts
}