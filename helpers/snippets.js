export const convertMinsSecs = (time, duration) => {
    if(duration >= 3600) {
        let ms = time % 1000;
        time = (time - ms) / 1000;
        let secs = time % 60;
        time = (time - secs) / 60;
        let mins = time % 60;
        let hrs = (time - mins) / 60;

        return `${hrs < 10 ? `0${hrs}` : hrs}:${mins < 10 ? `0${mins}` : mins}:${secs < 10 ? `0${secs}` : secs}`;
    }
    
    let ms = time % 1000;
    time = (time - ms) / 1000;
    let secs = time % 60;
    time = (time - secs) / 60;
    let mins = time % 60;
    
    mins = mins < 10 ? `0${mins}` : mins
    secs = secs < 10 ? `0${secs}` : secs

    return `${mins}:${secs}`;
}