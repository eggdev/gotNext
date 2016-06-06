var express = require('express');
var checkinRouter = express.Router();
var Checkin = require('../../models/checkin.js');
var schedule = require('node-schedule');


checkinRouter.get('/', function(req, res, next){
  Checkin.find({}, function(err, checkins){
    res.json( checkins );
  })
})

checkinRouter.post('/', function(req, res){
  Checkin.create( req.body, function(err, checkin){
    res.json( {checkin: checkin} );
  })
})


checkinRouter.delete('/:id', function(req, res){
  console.log( req.params )
  Checkin.remove( { _id: req.params.id }, function(err){
    if(err){ console.log( err ) }
    console.log('deleted');
  });
});



var rule = new schedule.RecurrenceRule();

var x = schedule.scheduleJob( rule, function(){
  var arr;
  Checkin.find({}, function(err, checkins){
    arr = checkins;
    for(var i=0; i< arr.length; i++){
      var now = new Date().getHours();
      var then = new Date(arr[i].createdAt).getHours();

      if( now - then >= 3  || then - now >= 3){
        Checkin.remove( arr[i].id, function(err){
          if(err){ console.log( err )}
          console.log(' deleted ');
        })
      }else{
        console.log(" all good ");
      }
    }
  });
})


module.exports = checkinRouter;
