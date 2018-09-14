const path = require('path');
const spawn = require('child_process').spawn;
// const app_events = require('../custom-events/app-events');

module.exports.scan = function(folder, search_art) {
  return new Promise(function(resolve, reject) {
    let scraper_proc = spawn('python',
      [ path.resolve(__dirname, 'python/scraper.py'),
        path.resolve(__dirname, '..', 'db/db.sqlite'),
        folder, search_art ? 'True': 'False'
      ], { stdio: ['ignore', 'pipe', 'pipe'] });

    scraper_proc.stdout.on('data', (data) => {
      console.log(data.toString());
    });

    scraper_proc.stderr.on('data', (data) => {
      console.log(data.toString());
    });

    scraper_proc.on('close', (code) => {
      resolve();
    });
  });
}
