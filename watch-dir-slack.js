// Module to watch files for changes and push it to slack:::

var chokidar = require('chokidar'); // Chokidar module
var Slack = require('slack-node'); // Slack module

// Date with formatted string --- 2016-07-31 17:49:42
var date = new Date().toISOString().
  replace(/T/, ' ').      // replace T with a space
  replace(/\..+/, '')     // delete the dot and everything after
 

// Web hook Uri for slack
webhookUri = "__uri__";

// Slack params
slack = new Slack();
slack.setWebhook(webhookUri);


// Initialize watcher. 
var watcher = chokidar.watch('/<path>/error.log', {
  ignored: /[\/\\]\./,
  persistent: true
});

//Something to use when events are received. 
var log = console.log.bind(console);

// The following watches for events and if error.log chnages it shoots a message to slack

watcher

  // When file changes slack message is initiated
  .on('change', path => slack.webhook({
	  channel: "#general",
	  username: "webhookbot",
	  text: "There are changes in error.log"
	}, function(err, response) {
	  console.log(response);
	})
  )
  .on('unlink', path => log(date,`File ${path} has been removed`));


