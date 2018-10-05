const config = require('../config');
const scraper = require('../scraper');

const folder = process.argv[2];

async function scanAll(folders) { 
    try {
        for(let f of folders) await scraper.scan(f);
        return Promise.resolve();
    }
    catch(e) { 
        return Promise.reject(e);
    }
};

if (folder) {
    if (isNaN(parseInt(folder)) || config.folders[parseInt(folder)-1]) {
        scraper.scan(config.folders[parseInt(folder)-1])
        .then(() => {
            console.log('Folder scaned!');
            process.exit();
        })
        .catch(e => {
            console.error(e);
            process.exit();
        })
    }
    else console.log('Carpeta especificada incorrectamente. Puede que no haya ingresado bien el número o no haya una carpeta para dicho número');
}
else {
    scanAll(config.folders)
    .then(() => {
        console.log('Folders scaned!');
        process.exit();
    })
    .catch(e => {
        console.error(e);
        process.exit();
    })    
}