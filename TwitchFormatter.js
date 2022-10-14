const fs = require('fs');

const downloadedTwitchClipsDirectory = './DownloadedTwitchClips';
const dateTwitchClipsDirectory = './DownloadedTwitchClips/' + getDate();
const defaultDownloadURLDirectory = './output/clipURL.txt';

function getDate() {
    var today = new Date();
    var dd = String(today.getDate()).padStart(2, '0');
    var mm = String(today.getMonth() + 1).padStart(2, '0');
    var yyyy = today.getFullYear();

    return mm + '.' + dd + '.' + yyyy;
}

function getDownloadDirectory() {
// We are only expecting one input at this point in time.
// Which is the path to the list of URL's to download
// For example : './output/clipURL.txt'
    var args = process.argv.slice(2);
    if (args.length == 0) {
        return defaultDownloadURLDirectory;
    }
    return args.toString();
}


// Code execution starts here
(async() => {
    console.log("- - Starting TwitchFormatter.js - -");
    
    // Create a generic clips folder (if it doesn't already exist)
    if (!fs.existsSync(downloadedTwitchClipsDirectory)){
        fs.mkdirSync(downloadedTwitchClipsDirectory)
    }
    // Create a new folder with the current date as folder

    if (!fs.existsSync(dateTwitchClipsDirectory)){
        fs.mkdirSync(dateTwitchClipsDirectory)
    }
    // TODO : set the search keyword/topic as part of folder name
    // TODO : pipe each TwitchX.js file into the next
    
    // launch every URL given an input text file
    // this can efficiently be done via curl/ajax
    const buffer = fs.readFileSync(getDownloadDirectory()).toString();
    const clipDownloadLinks = buffer.split('\r\n');

    for(var i = 0; i < clipDownloadLinks.length; i++){
        console.log('actively downloading:', clipDownloadLinks[i])

        $.ajax({
            url: clipDownloadLinks[i],
            dataType: mp4,
            type: 'get',
            success: function(data) console.log("Success")
        })
    }
    
    console.log("- - Finishing TwitchFormatter.js - -");
})();