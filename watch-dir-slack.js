// Module to watch files for changes and push it to slack:::

var chokidar = require('chokidar'); // Chokidar module
var Slack = require('slack-node'); // Slack module
const exec = require('child_process').exec; //For shell commands

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
var watcher = chokidar.watch('/Users/anupamdebnath/nodeScripts/node-watcher-slack/error.log', {
  ignored: /[\/\\]\./,
  persistent: true
});

//Something to use when events are received. 
var log = console.log.bind(console);

// The following watches for events and if error.log chnages it shoots a message to slack

watcher

  /*
    1. When there are changes:
      a. tails the log for last 5 lines
      b. Initiates a slack message on the web hook channel
  */

  .on('change', path => exec("tail -n 5 error.log", function (error, stdout, stderr) {
      slack.webhook({
        channel: "code-check",
        username: "webhookbot",
        text:"Log has changes: " + stdout
      }, function(err, response) {
        console.log(response);
      })
    })
  )
  .on('unlink', path => log(date,`File ${path} has been removed`));


