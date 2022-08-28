const puppeteer = require('puppeteer');
const fs = require('fs');

const Constants = {
  DOWNLOAD_LINK_REGEX: /(https:\/\/clips\.twitch\.tv\/embed\?clip=)(.*?)(')/gm,
  TITLE_REGEX: /(alt=")(.*?)(")/gm,
  TWITCH_DOMAIN: 'https://clips.twitch.tv/embed?clip=',
  TWITCH_BASE: 'https://clips.twitch.tv/',
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

function matchClip(htmlBlock){
  let starting = 0;
  let ending = 0;

  if (htmlBlock.indexOf(Constants.TWITCH_DOMAIN) > 0){
    starting = htmlBlock.indexOf(Constants.TWITCH_DOMAIN) + Constants.TWITCH_DOMAIN.length;
  }
  else {
    console.log('failed to find twitch clip');
  }
  let newHtmlBlock = htmlBlock.substring(starting, htmlBlock.length);
  if (newHtmlBlock.indexOf('\'') > 0){
    ending = newHtmlBlock.indexOf('\'');
  }
  else {
    console.log('failed to find twitch clip');
  }
  return substring = newHtmlBlock.substring(0 ,ending);
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
  content += Constants.TWITCH_BASE + matchClip(htmlClips[i]) + '\r\n';
};

try {
  fs.writeFileSync('/Users/Nick/Development/Projects/Twitch-Clips-Web-Scraper/output/clipHTML.txt', content);
}
catch(err){
  console.log("An error occurred writing the html clip data")
}

console.log("- - Finishing TwitchClips.ts - -");
})();