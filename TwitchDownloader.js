const fs = require("fs");

const Constants = {
  DOWNLOAD_LINK_REGEX: /(https:\/\/clips\.twitch\.tv\/embed\?clip=)(.*?)(')/gm,
  TITLE_REGEX: /(alt=")(.*?)(")/gm,
  TWITCH_DOMAIN: 'https://clips.twitch.tv/embed?clip=',
  TWITCH_BASE: 'https://clips.twitch.tv/',
  STREAMS_CHARTS_URL: 'https://streamscharts.com/clips',
  DOWNLOAD_CLIP_URL: 'https://streamscharts.com/clips/downloader',
}

function matchTwitchDomain(htmlBlock){
  return htmlBlock.indexOf(Constants.TWITCH_DOMAIN) > 0;
}

function matchClip(htmlBlock){
  let starting = 0;
  let ending = 0;

  if (htmlBlock.indexOf(Constants.TWITCH_DOMAIN) > 0){
    starting = htmlBlock.indexOf(Constants.TWITCH_DOMAIN) + Constants.TWITCH_DOMAIN.length;
  }
  else {
    console.log('reee');
  }
  let newHtmlBlock = htmlBlock.substring(starting, htmlBlock.length);
  if (newHtmlBlock.indexOf('\'') > 0){
    ending = newHtmlBlock.indexOf('\'');
  }
  else {
    console.log('reee 2 ');
  }
  return substring = newHtmlBlock.substring(0 ,ending);
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
  const result = Constants.TWITCH_BASE + matchClip(clipHTML[i])
  console.log(result);
}
console.log(" - - exiting Twitch Downloader - -");
