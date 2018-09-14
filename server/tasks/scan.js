const config = require('../config');
const scraper = require('../scraper');

scraper.scan(config.folders[0])
.then(() => {
    console.log('Folder scaned!');
    process.exit();
})
.catch(e => {
    console.error(e);
    process.exit();
})