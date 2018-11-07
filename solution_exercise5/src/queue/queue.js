const kue = require('kue');
let jobs = kue.createQueue();
let util = require('util');
const sendMessage = require("../controllers/sendMessage");

module.exports = function (req, res) {
    let job = jobs.create("msg", {
        destination: util.inspect(req.body),
        body: util.inspect(req.body)
    })
        .save(function (err) {
            if (!err) res.sendStatus(200).send(job.id);
        });
};

jobs.on("job enqueue", function (id, type) {
    console.log("Job %s got queued of type %s", id, type);
});
jobs.save();

jobs.process('new job', function (job, done) {
    sendMessage(job.data.body, done)
});
