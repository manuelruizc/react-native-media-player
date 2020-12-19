export const songExists = (songs, uri, sourceIsAudio) => {
    const source = sourceIsAudio ? "isAudio" : "isVideo";
    if(typeof songs === 'string')
        songs = JSON.parse(songs);
    let response = "Not existing";
    if(songs.filter((song) => song["uri"] === uri && song["isDownloaded"] && song[source]).length > 0) response = "Already downloaded";
    if(songs.filter((song) => song["uri"] === uri && (song["isDownloaded"] || !song["isDownloaded"]) && !song[source]).length > 0) response = "Already in playlist";
    return response;
};