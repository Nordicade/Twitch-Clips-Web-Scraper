const fs = require("fs");

const Constants = {
  DOWNLOAD_LINK_REGEX: /(https:\/\/clips\.twitch\.tv\/embed\?clip=)(.*?)(')/gm,
  TITLE_REGEX: /(alt=")(.*?)(")/gm,
  TWITCH_DOMAIN: 'https://clips.twitch.tv/embed?clip=',
  STREAMS_CHARTS_URL: 'https://streamscharts.com/clips',
  DOWNLOAD_CLIP_URL: 'https://streamscharts.com/clips/downloader',
}

function matchTwitchDomain(htmlBlock){
  return htmlBlock.indexOf(Constants.TWITCH_DOMAIN) > 0;
}

function matchClipURL(htmlBlock){
  let matchedClipURL = Constants.DOWNLOAD_LINK_REGEX.exec(htmlBlock);
  if (matchedClipURL == null) {
    console.log(`Failed clipping the URL for: ${htmlBlock}`)
    throw new Error("Error - The clip url regex failed to extract");
  }
  else {
    return matchedClipURL[2];
  }
}

function matchClipTitle(htmlBlock){
  let matchedClipTitle = Constants.TITLE_REGEX.exec(htmlBlock);
  if (matchedClipTitle == null) {
    console.log(`Failed clipping the Title for : ${htmlBlock}`)
    throw new Error("Error - The title url regex failed to extract");
  }
  else {
    return matchedClipTitle[2];
  }
}

console.log(" - - starting Twitch Downloader - -");
const buffer = fs.readFileSync("./output/clipHTML.txt").toString();
const clipHTML = buffer.split('BREAK');
for(let i = 0; i < clipHTML.length - 1; i++){
  // const url = matchClipURL(clipHTML[i]);
  // const title = matchClipTitle(clipHTML[i]);
  // console.log(`${i} : ${url} - ${title}`);
  const result = matchTwitchDomain(clipHTML[i])
}
console.log(" - - exiting Twitch Downloader - -");
