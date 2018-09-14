import config from '@/config';

export function getTrackUrl(id) {
    return `${config.files}/tracks/${id}`;
}

export function download(url) {
    let a = document.createElement('a');
    a.href = url;
    a.target = '_blank';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
}