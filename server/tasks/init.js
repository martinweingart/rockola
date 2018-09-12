const db = require('../db');

db.init()
.then(r => {
    let user = db.User.build({
        email: 'admin@admin.com',
        password: 'admin123',
        password_confirmation: 'admin123',
        admin: true
    });

    return user.validate().then(() => user.save());
})
.then(() => { 
    console.log('Usuario creado exitosamente!')
    process.exit();
})
.catch(e => {
    console.error(e);
    process.exit();
});
