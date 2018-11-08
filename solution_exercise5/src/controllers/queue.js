const kue = require('kue');
let queue = kue.createQueue();
let util = require('util');
const sendMessage = require("./sendMessage");

module.exports = function (req, res) {
    // the first argument identifies the type of job, and any additional 
    // data is passed as a hash via the second argument.
    let job = queue.create("msg", {
        destination: util.inspect(req.body),
    })
    //if fails retry 3 times
    .attempts(3)
    .save(function (err) {
        if (!err) res.sendStatus(200).send(job.id);
    });
};

queue.on("msg enqueue", function (id, type) {
    console.log("msg %s got queued of type %s", id, type);
});
queue.save();
// The first argument should be the name of the job, and the second a function, 
// which provides as arguments the job itself and a callback.
queue.process('msg', function (job, done) {
    sendMessage(job.data.body, done);
    console.log("cola")
});
