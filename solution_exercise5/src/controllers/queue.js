const kue = require('kue');
let queue = kue.createQueue();
// uuidv4 generate universally unique identifier
const uuidv4 = require('uuid/v4');
const sendMessage = require("./sendMessage");

module.exports = function (req, res) {
    let qId = uuidv4();
    let mess = req.body
    mess.status = "PENDING";
    mess.qId = qId;
    // the first argument identifies the type of job, and any additional 
    // data is passed as a hash via the second argument.
    let job = queue.create("msg", mess)
        // ttl = time-to-live
        .ttl(5000)
        //if fails retry 3 times
        .attempts(3)
        .save(function (err) {
            res.send(`Processing message with id ${id}`);
        });
};
// The first argument should be the name of the job, and the second a function, 
// which provides as arguments the job itself and a callback.
queue.process('msg', function (job, done) {
    sendMessage(job.data, done);
    console.log("<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<")
});
