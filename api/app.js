const express = require('express');
const app = express();

const {mongoose} = require('./db/mongoose');

const bodyParser = require('body-parser');

//Load in the mongoose models
const { List, Task, User } = require('./db/models');


//Load middleware
app.use(bodyParser.json());

//CORS HEADERS MIDDLEWARE
app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "GET, POST, HEAD, OPTIONS, PUT, PATCH, DELETE");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

/* Route Handlers */


/* List Routes */

/**
 * GET /lists
 * Purpose: Get all lists
 */
app.get('/lists', (req, res) => {
   //we want to return an array of all the lists in the database
   List.find().then((lists) => {
        res.send(lists);
   }).catch((e) => {
       res.send(e);
   });
});


/**
 * POST /lists
 * Purpose: create a list
 */
app.post('/lists', (req, res) => {
    //We want to create a new list and return the list document back to the user (which includes ID)
    //The list information (fields) will be passed in by the JSON request body
    let title = req.body.title;

    newList = new List({
        title
    });
    newList.save().then((listDoc) => {
        // the full list document is returned (including id)
        res.send(listDoc);
    })
});


/**
 * PATCH /lists/:id
 * Purpose: Update a specified list
 */
app.patch('/lists/:id', (req, res) => {
    //We want to update the list (list document with ID in url) with the new values specified in the JSON body of the request
    List.findOneAndUpdate({ _id: req.params.id }, {
        $set: req.body 
    }).then(() => {
        res.sendStatus(200);
    })
});


/**
 * DELETE /lists/:id
 * Purpose: Delete a specified list
 */
app.delete('/lists/:id', (req, res) => {
    //We want do delete the specified list (list document with ID in url)
    List.findByIdAndRemove({
        _id: req.params.id
    }).then((removedListDoc) => {
        res.send(removedListDoc);
    })
});


/**
 * GET /lists/:listId/tasks
 * Purpose: Return all tasks that belong to a specific list
 */
app.get('/lists/:listId/tasks', (req, res) => {
    //We want to return all tasks that belong to a specific list (specified by listId)
    Task.find({
        _listId: req.params.listId
    }).then((tasks) => {
        res.send(tasks);
    })
});

/**
 * POST /lists/:listId/tasks
 * Purpose: Create a new task in a specified list
 */
app.post('/lists/:listId/tasks', (req, res) => {
    //We want to create a new task in a list specified by listId
    let newTask = new Task({
        title: req.body.title,
        _listId: req.params.listId
    });
    newTask.save().then((newTaskDoc) => {
        res.send(newTaskDoc);
    })
});

/**
 * PATCH /lists/:listId/tasks/:taskId
 * Purpose: Update an existing task
 */
app.patch('/lists/:listId/tasks/:taskId', (req, res) => {
    //We want to update an existing task (specified by taskId)
    Task.findOneAndUpdate({
        _id: req.params.taskId,
        _listId: req.params.listId
    }, {
        $set: req.body
    }).then(() => {
        res.send({message: 'Updated Successfully'});
    })
});

/**
 * DELETE /lists/:listId/tasks/:taskId
 * Purpose: Delete a task
 */
app.delete('/lists/:listId/tasks/:taskId', (req, res) => {
    Task.findByIdAndRemove({
        _id: req.params.taskId,
        _listId: req.params.listId
    }).then ((removedTaskDoc) => {
        res.send(removedTaskDoc);
    })
})

app.listen(3000, () => {
    console.log("Server is listening on port 3000");
});