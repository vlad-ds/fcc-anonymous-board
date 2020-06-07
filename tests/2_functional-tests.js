/*
 *
 *
 *       FILL IN EACH FUNCTIONAL TEST BELOW COMPLETELY
 *       -----[Keep the tests in the same order!]-----
 *       (if additional are added, keep them at the very end!)
 */

var chaiHttp = require("chai-http");
var chai = require("chai");
var assert = chai.assert;
var server = require("../server");

chai.use(chaiHttp);

suite("Functional Tests", function() {
  suite("API ROUTING FOR /api/threads/:board", function() {
    suite("POST", function() {
      test("posting a thread", function(done) {
        chai
          .request(server)
          .post("/api/threads/brd")
          .send({ board: "brd", text: "test1", delete_password: "psw" })
          .end(function(err, res) {
            assert.equal(res.status, 200);
            done();
          });
      });
    });

    suite("GET", function() {
      test('listing recent threads', function(done){
        chai
        .request(server)
        .get('/api/threads/brd')
        .end(function(err, res){
          assert.equal(res.status, 200);
          done();
        })
      })
    });

    suite("DELETE", function() {
      
      test('deleting a thread', function(done){
        chai
        .request(server)
        .delete('/api/threads/brd')
        .send({board: 'brd', thread_id: 'abc', delete_password: 'psw'})
        .end(function(err, res){
          assert.equal(res.status, 200);
          done();
        })
      })
      
    });

    suite("PUT", function() {
      test('reporting a thread', function(done){
        chai
        .request(server)
        .put('/api/threads/brd')
        .send({board: 'brd', thread_id: 'abc'})
        .end(function(err, res){
          assert.equal(res.status, 200);
          done();
        })
      })
    });
  });

  suite("API ROUTING FOR /api/replies/:board", function() {
    suite("POST", function() {
      test('posting a reply', function(done){
        chai
        .request(server)
        .post('/api/replies/brd')
        .send({board: 'brd', thread_id: '5edcd8e9886c05054a60fafa', text: 'test', delete_password: 'psw'})
        .end(function(err, res){
          assert.equal(res.status, 200);
          done();
        })
      })
    });

    suite("GET", function() {
      test('show all replies of a thread', function(done){
        chai
        .request(server)
        .get('/api/replies/brd?thread_id=5edcd8e9886c05054a60fafa')
        .end(function(err, res){
          assert.equal(res.status, 200);
          done();
        })
      })
    });

    suite("PUT", function() {
      test('report reply', function(done){
        chai
        .request(server)
        .put('/api/replies/brd')
        .send({board: 'brd', thread_id: '5edcd8e9886c05054a60fafa', reply_id: '5edce65025c628528f9bdaa7'})
        .end(function(err, res){
          assert.equal(res.status, 200);
          done();
        })
      })
    });

    suite("DELETE", function() {
      test('delete reply', function(done){
        chai
        .request(server)
        .delete('/api/replies/brd')
        .send({board: 'brd', thread_id: '5edcd8e9886c05054a60fafa', reply_id: '5edce65025c628528f9bdaa7', delete_password: "psw "})
        .end(function(err, res){
          assert.equal(res.status, 200);
          done();
        })
      })
    });
  });
});
