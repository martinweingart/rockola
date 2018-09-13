import config from '@/config';

export function getTrackUrl(id) {
    return `${config.files}/tracks/${id}`;
}