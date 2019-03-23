const express = require('express');
const uuid = require('uuid');

const app = express();

const bodyParser = require('body-parser');
const jsonParser = bodyParser.json();

var postsArray = [{
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

app.get('/blog-posts', (req, res) => {
    res.status(200).json({
        message: "Successfully sent the list of posts",
        status: 200,
        posts: postsArray
    });
});

app.get('/blog-posts/:author', (req, res) => {
    
    let postAuthor = req.params.author;
    
    if (!postAuthor) {
    	res.status(406).json({
	        message: "Author not found in path",
	        status: 406
    	});
    }

    let postsListAuthor = [];

    postsArray.forEach(item => {
        if (item.author == postAuthor) {
            postsListAuthor.push(item);
        }
    });

    if (postsListAuthor.length > 0) {
		res.status(200).json({
            message: "Successfully sent the post",
            status: 200,
            posts: postsListAuthor
        }).send("Finish");
    } else {
    	res.status(404).json({
	        message: "Author not found",
	        status: 404
    	});
    }

    
});

app.post('/blog-posts', jsonParser, (req, res) => {

    let requireFields = ["title", "content", "author", "publishDate"];
    for (let field of requireFields) {
        if (!(field in req.body)) {
            res.status(406).json({
            message: `Missing field ${field} in body`,
            status: 406
            }).send("Finish");
        }
    }

    let postTitle = req.body.title;
    let postContent = req.body.content;
    let postAuthor = req.body.author;

    let postPublishDateString = req.body.publishDate;
    let postPublishDate = new Date(postPublishDateString.substring(0,4),
							    	postPublishDateString.substring(5,7),
							    	postPublishDateString.substring(8,10));

    let item = {
    	id: uuid.v4(),
        title: postTitle,
        content: postContent,
        author: postAuthor,
        publishDate: postPublishDate
    };

    postsArray.push(item);
    res.status(200).json({
        message: "Successfully added new post",
        status: 200,
        post: item
    }).send("Finish");


});

app.delete('/blog-posts/:id*?', jsonParser, (req, res) => {
    
    let postId = req.params.id;
    let postIdBody = req.body.id;

    if (postIdBody != postId) {
        res.status(406).json({
            message: "Post in body doesn't match param",
            status: 406
        }).send("Finish");
    }
    postsArray.forEach((item, index) => {
        if (item.id == postId) {
            delete postsArray[index];
            res.status(204).send("Finish");
        }
    });
  
	res.status(404).json({
    message: "Post not found",
    status: 404
	}).send("Finish");
    
    
});

app.put('/blog-posts/:id*?', jsonParser, (req,res) => {
    
	let postId = req.params.id;
	if (!postId) {
		res.status(406).json({
	        message: `Missing id in path`,
	        status: 406
        }).send("Finish");
	}

    let postTitle = req.body.title;
    let postContent = req.body.content;
    let postAuthor = req.body.author;

    let postPublishDateString = req.body.publishDate;
    let postPublishDate;
    if (postPublishDateString) {
    	postPublishDate = new Date(postPublishDateString.substring(0,4),
							    	postPublishDateString.substring(5,7)+1,
							    	postPublishDateString.substring(8,10));
    }
    if (!postTitle && !postContent && !postAuthor && !postPublishDate) {
    	res.status(404).json({
	        message: `At least one field is require.`,
	        status: 404
        }).send("Finish");
    }

    postsArray.forEach(item => {
        if (item.id == postId) {
            
        	if (postTitle) {
        		item.title = postTitle;
        	}
        	if (postContent) {
        		item.content = postContent;
        	}
        	if (postAuthor) {
        		item.author = postAuthor;
        	}
        	if (postPublishDate) {
        		item.publishDate = postPublishDate;
        	}

            res.status(200).json({
                message: "Successfully updated post",
                status: 200,
                post: item
            }).send("Finish");
        }
    });

    res.status(404).json({
        message: "Post not found",
        status: 404
    });
});


app.listen(8080, () => {
    console.log("Your app is running in port 8080");
});