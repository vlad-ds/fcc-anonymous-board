/*
 *
 *
 *       Complete the API routing below
 *
 *
 */

const mongoose = require("mongoose");
mongoose.connect(process.env.DB, {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

mongoose.connection.on("error", err => {
  console.log(err);
});

const Thread = require("./message-schema");

("use strict");

var expect = require("chai").expect;

module.exports = function(app) {
  app
    .route("/api/threads/:board")

    .put(function(req, res) {
      const id = req.body.thread_id;
      Thread.updateOne({ _id: id }, { reported: true }, function(err) {
        if (err) {
          res.send("did not find thread");
          return;
        } else {
          res.send("success");
          return;
        }
      });
    })

    .get(function(req, res) {
      if (req.query.thread_id !== undefined) {
        const thread = Thread.findById(req.query.thread_id, function(
          err,
          thread
        ) {
          if (err) res.send({ error: "could not find thread" });
          let newReplies = [];
          thread.replies.forEach(reply => {
            let newReply = {
              _id: reply._id,
              text: reply.text,
              created_on: reply.created_on
            };
            newReplies.push(newReply);
          });
          let returnThread = {
            _id: thread._id,
            text: thread.text,
            created_on: thread.created_on,
            bumped_on: thread.bumped_on,
            replies: newReplies
          };
          res.send(returnThread);
          return;
        });
      }

      const board = req.params.board;
      Thread.find({ board: board }, function(err, threads) {
        //sort by bumped_on
        threads.sort(function(a, b) {
          return new Date(b.bumped_on) - new Date(a.bumped_on);
        });
        threads = threads.slice(0, 10);
        const returnThreads = [];
        threads.forEach(thread => {
          //sort replies and keep 3 most recent
          let replies = thread.replies;
          replies.sort(function(a, b) {
            return new Date(b.created_on) - new Date(a.created_on);
          });
          replies = replies.slice(0, 3);
          const newReplies = [];
          replies.forEach(reply => {
            let newReply = {
              _id: reply._id,
              text: reply.text,
              created_on: reply.created_on
            };
            newReplies.push(newReply);
          });
          const newThread = {
            _id: thread._id,
            text: thread.text,
            created_on: thread.created_on,
            bumped_on: thread.bumped_on,
            replies: newReplies
          };
          returnThreads.push(newThread);
        });
        res.send(returnThreads);
        return;
      });
    })

    .post(function(req, res) {
      let now = new Date();
      const thread = new Thread({
        board: req.body.board,
        text: req.body.text,
        created_on: now,
        bumped_on: now,
        reported: false,
        delete_password: req.body.delete_password,
        replies: []
      });
      thread.save(function(err) {
        if (err) {
          console.log(err);
        } else {
          console.log("Thread saved.");
        }
      });
      res.redirect("/b/" + req.body.board);
    })

    .delete(function(req, res) {
      const id = req.body.thread_id;
      const password = req.body.delete_password;
      Thread.findById(id, function(err, thread) {
        if (err) {
          res.send("no thread with this id");
          return;
        }
        if (thread.delete_password === password) {
          Thread.findByIdAndDelete(id, function(err) {
            if (err) {
              res.send("deletion failed");
              return;
            } else {
              res.send("success");
              return;
            }
          });
        } else {
          res.send("incorrect password");
          return;
        }
      });
    });

  app
    .route("/api/replies/:board")

    .get(function(req, res) {
      Thread.findById(req.query.thread_id, function(err, thread) {
        if (err) res.send({ error: "could not find thread" });
        let newReplies = [];
        thread.replies.forEach(reply => {
          let newReply = {
            _id: reply._id,
            text: reply.text,
            created_on: reply.created_on
          };
          newReplies.push(newReply);
        });
        const returnThread = {
          _id: thread._id,
            text: thread.text,
            created_on: thread.created_on,
            bumped_on: thread.bumped_on,
            replies: newReplies
        };
        res.send(returnThread); 
        return;
      });
    })

    .post(function(req, res) {
      console.log(req.body);
      Thread.findById(req.body.thread_id, function(err, thread) {
        if (err) {
          console.log(err);
          res.send({ error: "Thread not found." });
        } else {
          let now = new Date();
          const reply = {
            _id: mongoose.Types.ObjectId(),
            text: req.body.text,
            created_on: now,
            delete_password: req.body.delete_password,
            reported: false
          };
          thread.replies.push(reply);
          thread.bumped_on = now;
          thread.save();
          console.log("Reply saved.");
          res.redirect(`/b/${req.body.board}/${thread._id}`);
        }
      });
    })

    .delete(function(req, res) {
    console.log(req.body)
      const thread_id = req.body.thread_id;
      const reply_id = req.body.reply_id;
      const delete_password = req.body.delete_password;
      Thread.findById(thread_id, function(err, thread) {
        if (err) {
          res.send("thread not found");
          return;
        }
        thread.replies.forEach((reply, i) => {
          if (String(reply._id) === reply_id) {
            if (reply.delete_password === delete_password) {
              reply.text = "[deleted]";
              const newReplies = thread.replies;
              newReplies[i] = reply;
              Thread.updateOne(
                { _id: thread_id },
                { replies: newReplies },
                function(err) {
                  if (err) {
                    console.log(err);
                    return;
                  }
                  res.send("success");
                  return;
                }
              );
            } else {
              res.send("incorrect password");
              return;
            }
          }
        });
        //res.send('reply not found');
        return;
      });
    })

    .put(function(req, res) {
      console.log(req.body);
      const thread_id = req.body.thread_id;
      const reply_id = req.body.reply_id;
      Thread.findById(thread_id, function(err, thread) {
        if (err) {
          res.send("thread not found");
          return;
        }
        let newReplies = [];
        let found = false;
        thread.replies.forEach(reply => {
          if (String(reply._id) === reply_id) {
            found = true;
            reply.reported = true;
            newReplies.push(reply);
          }
        });
        if (found) {
          Thread.updateOne(
            { _id: thread_id },
            { replies: newReplies },
            function(err) {
              if (err) {
                console.log(err);
                return;
              }
              res.send("success");
              return;
            }
          );
        } else {
          res.send("reply not found");
          return;
        }
      });
    });
};
