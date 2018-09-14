#!/bin/bash

echo "Bienvendio a la configuracioń de su Rockola!"

echo "Ingrese el host (ej: localhost'):"
read HOST
echo "\n"

echo "Ingrese el puerto (ej: 3000):"
read PORT
echo "\n"

echo "Ingrese el path de la carpeta con .mp3 (ej: /home/mweingart/Music):"
read DIR
echo "\n"

npm install --production
npm run init

#Creo el archivo de configuración del servicio
cat > server/config.js <<- EOM
module.exports = {
    protocol: 'http',
    host: '$HOST',
    port: $PORT,
    folders: ['$DIR']
}
EOM

#Creo el archivo de configuración para la APP Web
cat > src/config.js <<- EOM
export default {
  api: 'http://$HOST:$PORT/rest',
  files: 'http://$HOST:$PORT/files'
}
EOM

npm run build

echo "Iniciando scaneo de carpeta. Este proceso puede demorar unos minutos..."
npm run scan

echo "Para iniciar el servidor de música ejectuar 'npm run server'"