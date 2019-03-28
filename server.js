const express = require('express');
const bodyParser = require('body-parser');
const postsRouter = require('./blog-posts-router')

const app = express();
const jsonParser = bodyParser.json();

app.use('/posts/api', jsonParser, postsRouter);

app.listen(8080, () => {
    console.log("Your app is running in port 8080");
});