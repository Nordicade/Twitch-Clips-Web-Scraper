const puppeteer = require('puppeteer');
const fs = require('fs');

const Constants = {
  DOWNLOAD_LINK_REGEX: /(https:\/\/clips\.twitch\.tv\/embed\?clip=)(.*?)(')/gm,
  TITLE_REGEX: /(alt=")(.*?)(")/gm,
  TWITCH_DOMAIN: 'https://clips.twitch.tv/embed?clip=',
  STREAMS_CHARTS_URL: 'https://streamscharts.com/clips',
  DOWNLOAD_CLIP_URL: 'https://streamscharts.com/clips/downloader',
}

class Clip {
  constructor(_URL, _Title) {
      this.URL = _URL;
      this.Title = _Title;
    }
}

// NOTES : 

    // BEHOLD 
    // $x("//button[contains(x-show, *)]")
    // $x("//button[contains(@class, 'clip-container')]")

function matchClipURLV1(htmlBlock){
  let matchedClipURL = Constants.DOWNLOAD_LINK_REGEX.exec(htmlBlock);
  if (matchedClipURL == null) {
    console.log(`Failed clipping the URL for: ${htmlBlock}`)
    throw new Error("Error - The clip url regex failed to extract");
  }
  else {
    return matchedClipURL[2];
    // console.log(`Successfully stored ${clipURL}`)
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
    // console.log(`Successfully stored ${clipTitle}`)
  }
}

// This method is sure to change in the future.
// Parameters: siteURL: String for the website URL. Implicitly expects a streamcharts clips.
// Output: Returns an array of 20 html objects
async function simpleRetrieveClipsFromPage(siteUrl) {
  let html = [];
  try{
    const browser = await puppeteer.launch( {headless : false });
    const page = await browser.newPage();
    await page.goto(siteUrl);

    let buttons = await page.$x("//button[contains(@class, 'clip-container')]");
    for (let i = 0; i < buttons.length; i++){
      const element_property = await buttons[i].getProperty('outerHTML');
      const outerHTML = await element_property.jsonValue();
      html.push(outerHTML);
    }
    await browser.close();
  }
  catch (exception) {
    console.log("Encountered an error");
    console.log(exception)
  }
  return html;
};

let htmlClips = [];

// Code execution starts here
(async() => {
console.log("- - Starting TwitchClips.ts - -");

// TODO : Look into promises and how to store the result of await into variable 
htmlClips = await simpleRetrieveClipsFromPage(Constants.STREAMS_CHARTS_URL);

let content = '';
for (let i = 0; i < htmlClips.length; i++){
  content += `${i} : ${htmlClips[i]} BREAK`;
};

try {
  fs.writeFileSync('/Users/Nick/Development/Projects/Twitch-Clips-Web-Scraper/output/clipHTML.txt', content);
}
catch(err){
  console.log("An error occurred writing the html clip data")
}

// downloadClips(clips);
console.log("- - Finishing TwitchClips.ts - -");
})();