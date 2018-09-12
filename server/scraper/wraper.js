const path = require('path');
const spawn = require('child_process').spawn;
// const app_events = require('../custom-events/app-events');

module.exports.scan = function(folder) {
    try {
      let scraper_proc = spawn('python',
        [ path.resolve(__dirname, 'python/scraper.py'),
          path.resolve(__dirname, '..', 'db/db.sqlite'),
          folder.path, folder.search_art ? 'True': 'False'
        ], { stdio: ['ignore', 'pipe', 'pipe'] });

      scraper_proc.stdout.on('data', (data) => {
        try {
          console.log(data)
          // let message = JSON.parse(data.toString());
        //   app_events.db.emit(message.type, message.elem);
        } catch (e) {
          console.log(e);
        }
      });

      scraper_proc.stderr.on('data', (data) => {
        console.log(data.toString());
      });

      scraper_proc.on('close', (code) => {
        // app_events.db.emit('scan-finished', folder.path);
      });

    } catch (e) {
      console.error(e);
    //   app_events.db.emit('scan-error', folder.path);
    }
};
