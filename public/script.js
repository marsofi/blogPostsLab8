function displayPosts() {

    let url = './blog-posts';
    let settings = {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    };

    fetch(url, settings)
        .then(response => {
            if (response.ok) {
                return response.json();
            }
            throw new Error(response.statusText);
        })
        .then(data => {
            $('.post-list').html("");
            for (let item of data.posts) {
                $('.post-list').append(`<li style="list-style-type: none;">
                                    <p class="idText"> ID: ${item._id}</p>
									<h2 class="titleText">${item.title} </h2>
									<p class="authorText"> Author: ${item.author} </p>
									<p class="contentText"> ${item.content}</p>
									<p class="dateText"> Date Published: ${item.publishDate}</p>
								  </li>`);
            }
        })
        .catch(err => {
            console.log(err);
        });
}

$("#postForm").submit(function (event) {
    event.preventDefault();
    $('#postError').html("");

    let title = $('.postTitle').val();
    let author = $('.postAuthor').val();
    let content = $('.postContent').val();

    let data = {
        title: title,
        author: author,
        content: content,
        publishDate: new Date()
    };

    let url = './blog-posts';
    let settings = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    };

    fetch(url, settings)
        .then(response => {
            if (response.ok) {
                $('.postTitle').val("");
                $('.postAuthor').val("");
                $('.postContent').val("");
                return response.json();
            } else {
                return new Promise(function (resolve, reject) {
                        resolve(response.json());
                    })
                    .then(data => {
                        $('#postError').append(`<p class="errorText">Alls fields are requiered.</p>`);
                        throw new Error(data.message);
                    })
            }
        })
        .then(res => {
            $(displayPosts)
        })
        .catch(err => {
            console.log(err);
        });
});

$("#deleteForm").submit(function (event) {
    event.preventDefault();
    $('#deleteError').html("");

    let deleteId = $('.deleteId').val();

    let url = './blog-posts/' + deleteId;
    let settings = {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            id: deleteId
        })
    };

    fetch(url, settings)
        .then(response => {
            if (response.ok) {
                $('.deleteId').val("");
                return response.json();
            } else {
                return new Promise(function (resolve, reject) {
                        resolve(response.json());
                    })
                    .then(data => {
                        $('#deleteError').append(`<p class="errorText"> ${data.message}</p>`);
                        throw new Error(data.message);
                    })
            }
        })
        .then(res => {
            $(displayPosts)
        })
        .catch(err => {
            console.log(err);
        });
});

$("#editForm").submit(function (event) {
    event.preventDefault();

    $('#editError').html("");

    let id = $('.editId').val();
    let title = $('.editTitle').val();
    let author = $('.editAuthor').val();
    let content = $('.editContent').val();

    let url = './blog-posts/' + id;
    let settings = {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            id: id,
            title: title,
            content: content,
            author: author,
            date: null
        })
    };

    fetch(url, settings)
        .then(response => {
            if (response.ok) {
                $('.editId').val("");
                $('.editTitle').val("");
                $('.editAuthor').val("");
                $('.editContent').val("");
                return response.json();
            } else {
                return new Promise(function (resolve, reject) {
                        resolve(response.json());
                    })
                    .then(data => {
                        $('#editError').append(`<p class="errorText"> ${data.message}</p>`);
                        throw new Error(data.message);
                    })
            }
        })
        .then(res => {
            $(displayPosts)
        })
        .catch(err => {
            console.log(err);
        });
});

$(displayPosts);