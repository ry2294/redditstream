var redditstream = require('reddit-stream');
var unirest = require('unirest');
var count  = 0;
var comment_stream = new redditstream('comments');

comment_stream.start();

comment_stream.on('new', function (comments) {
    for(var i = 0; i < comments.length; i++) {
        count++;
        var comment = comments[i];
        if(comment.data != null && comment.data.link_id != null && comment.data.link_title != null
        && (count % 50) == 0) {

            var sequential = {};
            sequential.table = "sequential";
            sequential.tweetid = comment.data.link_id;
            sequential.text = comment.data.link_title;
            console.log('sequential = ' + JSON.stringify(sequential));
            
            unirest.post('http://sequential.us-west-2.elasticbeanstalk.com/webapi/sequential')
                .headers({'Content-Type': 'application/json'})
                .send(sequential)
                .end(function (response) {
                    console.log('sequential = ' + JSON.stringify(response.body));
            });
            
            var parallel = {};
            parallel.table = "parallel";
            parallel.tweetid = comment.data.link_id;
            parallel.text = comment.data.link_title;
            console.log('parallel = ' + JSON.stringify(parallel));
            unirest.post('http://parallel.us-west-2.elasticbeanstalk.com/webapi/parallel')
            .headers({'Content-Type': 'application/json'})
            .send(parallel)
            .end(function (response) {
                console.log('parallel = ' + JSON.stringify(response.body));
            });
            
            var aggregator = {};
            aggregator.table = "aggregator";
            aggregator.tweetid = comment.data.link_id;
            aggregator.text = comment.data.link_title;
            console.log('aggregator = ' + JSON.stringify(aggregator));
            unirest.post('http://aggregator.us-west-2.elasticbeanstalk.com/webapi/aggregator')
            .headers({'Content-Type': 'application/json'})
            .send(aggregator)
            .end(function (response) {
                console.log('aggregator = ' + JSON.stringify(response.body));
            });
        }
    };
});