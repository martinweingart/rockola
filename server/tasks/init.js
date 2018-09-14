const db = require('../db');

db.init()
.then(() => { 
    console.log('Database created!')
    process.exit();
})
.catch(e => {
    console.error(e);
    process.exit();
});
