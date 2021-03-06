# !/usr/bin/python
# encoding=utf8

import os
import eyed3
import sqlite3
import datetime
import requests
import shutil
from bs4 import BeautifulSoup
import warnings
import sys

reload(sys)
sys.setdefaultencoding('utf8')
warnings.filterwarnings('ignore')
eyed3.log.setLevel("ERROR")


def isMP3(file_path):
    fileName, fileExt = os.path.splitext(file_path)
    return fileExt == '.mp3'or fileExt == '.MP3'


def download(url, dest):
    r = requests.get(url, stream=True)
    if r.status_code == 200:
        try:
            with open(dest, 'w+b') as f:
                r.raw.decode_content = True
                shutil.copyfileobj(r.raw, f)
        except Exception as e:
            print e


def downloadArtLastFM(artist, album):
    try:
        url = 'https://www.last.fm/music/%s/%s' % (artist, album)
        r = requests.get(url)
        if r.status_code == 200:
            soup = BeautifulSoup(r.text, "html.parser")
            li_imagen = soup.find('li', {'class': 'secondary-nav-item--images'})
            a_imagen = li_imagen.find('a')
            link_imagen = 'https://www.last.fm%s' % (a_imagen.get('href'))

            r = requests.get(link_imagen)
            if r.status_code == 200:
                soup = BeautifulSoup(r.text, "html.parser")
                a_imagen = soup.find('a', {'class': 'gallery-image'})
                img_imagen = a_imagen.find('img')
                url_imagen = img_imagen.get('src')
                file_dir = os.path.dirname(os.path.realpath('__file__'))
                file_name = album + '.jpg'
                file_path = os.path.join(file_dir, 'server/files/album-art/' + file_name)
                download(url_imagen, file_path)
                return True
    except Exception:
        return False

def downloadPhotoLastFM(artist):
    try:
        url = 'https://www.last.fm/music/%s' % (artist)
        r = requests.get(url)
        if r.status_code == 200:
            soup = BeautifulSoup(r.text, "html.parser")
            img = soup.find('img', {'class': 'avatar'})
            url_imagen = img.get('src')
            file_dir = os.path.dirname(os.path.realpath('__file__'))
            file_name = artist + '.jpg'
            file_path = os.path.join(file_dir, 'server/files/artist-photo/' + file_name)
            download(url_imagen, file_path)
            return True
    except Exception:
        return False


def scan(db_path, folder_path, search_art):
    conn = sqlite3.connect(db_path)
    cursor = conn.cursor()

    # INICIO SUBRUTINAS
    def saveTrack(artist, album, track):
        cursor.execute('SELECT id FROM track WHERE artistId=(?) AND albumId=(?) AND name=(?)', (artist['id'], album, track['name'],))
        check = cursor.fetchone()
        if check is None:
            query = """
                INSERT INTO
                    {table} (name, track, uri, size, duration, albumId, artistId, createdAt, updatedAt)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
            """.format(table='track')
            cursor.execute(query, (track['name'], track['track'], track['uri'], track['size'], track['duration'], album, artist['id'], datetime.datetime.now(), datetime.datetime.now()))
            return cursor.lastrowid
        else:
            return check[0]

    def saveAlbum(artist, album):
        cursor.execute('SELECT id, art FROM album WHERE artistId=(?) AND name=(?)', (artist['id'], album['name'],))
        check = cursor.fetchone()
        if not search_art:
            art = 0
        if check is None:
            if search_art:
                art = downloadArtLastFM(artist['name'], album['name'])
            query = """
                INSERT INTO
                    {table} (name, year, art, artistId, createdAt, updatedAt)
                VALUES (?, ?, ?, ?, ?, ?)
            """.format(table='album')

            name = album['name']
            year = album['year']
            id_artist = artist['id']
            cursor.execute(query, (name, year, art, id_artist, datetime.datetime.now(), datetime.datetime.now()))
            id_inserted = cursor.lastrowid
            # print '{{ "type": "new-album", "elem": {{ "id": {}, "name": "{}", "year": {}, "art": {}, "artistId":{} }}  }}'.format(id_inserted, name, year, 'true' if art else 'false', id_artist)
            sys.stdout.flush()
            return id_inserted
        else:
            return check[0]

    def saveArtist(artist):
        if artist is None:
            artist = 'Artista Desconocido'
        cursor.execute('SELECT id, name FROM artist WHERE name=(?)', (artist,))
        check = cursor.fetchone()
        if check is not None:
            return { 'id': check[0], 'name': check[1] }
        else :
            photo = downloadPhotoLastFM(artist)

            query = """
                INSERT INTO
                    {table} (name, photo, createdAt, updatedAt)
                VALUES (?, ?, ?, ?)
            """.format(table='artist')
            cursor.execute(query, (artist, photo, datetime.datetime.now(), datetime.datetime.now()))
            id_inserted = cursor.lastrowid
            # print '{{ "type": "new-artist", "elem": {{ "id": {}, "name": "{}" }}  }}'.format(id_inserted, artist)
            sys.stdout.flush()
            return { 'id': id_inserted, 'name': artist }

    def process(file, commit):
        tag_data = eyed3.core.load(file)
        if tag_data is not None:
            saved_artist = saveArtist(tag_data.tag.artist)
            album_name = tag_data.tag.album if (tag_data.tag.album is not None) else 'Album Desconocido'
            album = {'name': album_name, 'year': int(tag_data.tag.best_release_date.year) if tag_data.tag.best_release_date is not None else 0}
            id_album = saveAlbum(saved_artist, album)
            track = {
                'name': unicode(tag_data.tag.title),
                'track': tag_data.tag.track_num[0],
                'uri': unicode(str(file)),
                'size': tag_data.info.size_bytes,
                'duration': tag_data.info.time_secs,
                'license': ''
            }

            saveTrack(saved_artist, id_album, track)

            if commit:
                conn.commit()

    #RECORRO EL DIRECTORIO Y PROCESO CADA ARCHIVO DE AUDIO MP3
    for root, dirs, files in os.walk(folder_path, topdown=False):
        count_processed = 0
        for name in files:
            if isMP3(name):
                process(os.path.join(root, name), (count_processed % 50 == 0))
                count_processed = count_processed + 1

    conn.commit()
    conn.close()

if __name__ == "__main__":
    scan(sys.argv[1], sys.argv[2], sys.argv[3]=='True')
