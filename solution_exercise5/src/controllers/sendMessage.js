const http = require("http");
const saveMessage = require("../clients/saveMessage");
const getCredit = require("../clients/getCredit");

const random = n => Math.floor(Math.random() * Math.floor(n));

module.exports = function (message, done) {
  const body = JSON.stringify(message);
  let query = getCredit();
  const queryId = message.qId
  saveMessage(
    {
      ...message,
    },
    () => {
      console.log("Internal server error: SERVICE ERROR");
    }
  );

  query.exec(function (err, credit) {
    if (err) return console.log(err);

    current_credit = credit[0].amount;
    // check if the amount of credit is enough
    // define postOptions for the request
    if (current_credit > 0) {
      const postOptions = {
        //host: "messageapp",
        host: "localhost",
        port: 3000,
        path: "/message",
        method: "post",
        json: true,
        headers: {
          "Content-Type": "application/json",
          "Content-Length": Buffer.byteLength(body)
        }
      };

      let postReq = http.request(postOptions);
      // here changes to ok or error 
      postReq.on("response", postRes => {
        if (postRes.statusCode === 200) {
          saveMessage(
            {
              ...message,
              qId: message.qId,
              status: "OK"
            },
            () => {
              console.log("Error in server response");
            }, idQuery
          );
        } else {
          console.error("Error while sending message");

          saveMessage(
            {
              ...message,
              qId: message.qId,
              status: "ERROR"
            },
            () => {
              console.log("Internal server error: SERVICE ERROR");
            }, idQuery
          );
        }
      });

      postReq.setTimeout(random(6000));
      // here sets to timeout
      postReq.on("timeout", () => {
        console.error("Timeout Exceeded!");
        postReq.abort();
        status = "TIMEOUT"
        saveMessage(
          {
            ...req.body,
            status: "TIMEOUT"
          },
          () => {
            res.statusCode = 500;
            res.end("Internal server error: TIMEOUT");
          }
        );
      });

      postReq.on("error", () => { });
      postReq.write(body);
      postReq.end();
    } else {
      res.statusCode = 500;
      res.end("No credit error");
    }
  });
};

// necesitaria actualizar el estado en cada mensaje
