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

function printClipArray(clips) {
  let i = 1;
  clips.forEach(clip => {
    console.log(i++);
    console.log(clip.URL);
    console.log(clip.Title);
  })
}

// NOTES : 

    // BEHOLD 
    // $x("//button[contains(x-show, *)]")
    // $x("//button[contains(@class, 'clip-container')]")
      
function matchClipURL(htmlBlock){
  let starting = 0;
  let ending = 0;

  try {
    fs.writeFileSync('/Users/Nick/Development/Projects/Twitch-Clips-Web-Scraper/output/debug.txt', htmlBlock.search(Constants.TWITCH_DOMAIN));
  }
  catch(err){
    console.log("reeeeeeee")
  }
  if (htmlBlock.search(Constants.TWITCH_DOMAIN) > 0){
    starting = htmlBlock.search(Constants.TWITCH_DOMAIN) + Constants.TWITCH_DOMAIN.length;
  }
  else {
    console.log('reee');
  }
  if (htmlBlock.search('\'') > 0){
    ending = htmlBlock.search('\'') + 1;
  }
  else {
    console.log('reee 2 ');
  }
  return substring = htmlBlock.substring(starting ,ending);
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
// Output: Returns an array of 20 clip objects
async function retrieveClipsFromPage(siteUrl) {
  let html = [];
  try{
    const browser = await puppeteer.launch( {headless : false });
    const page = await browser.newPage();
    await page.goto(siteUrl);

    // Retrieved the html (in string form) of the clips
    html = await simpleRetrieveClipsFromPage(page);
    await browser.close();
  }
  catch (exception) {
    console.log("Encountered an error");
    console.log(exception)
  }
  return html;
};


// This method is sure to change in the future.
// Parameters: siteURL: String for the website URL. Implicitly expects a streamcharts clips.
// Output: Returns an array of 20 clip objects
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

// This method is sure to change in the future.
// Parameters: siteURL: String for the website URL. Implicitly expects a streamcharts clips.
// Output: Returns an array of 20 clip objects
async function downloadClips(clips) {
  throw new Error("Method not implemented yet.");
  // (async () => {
  //   const browser = await puppeteer.launch();
  //   const page = await browser.newPage();
  //   const clips = Clip[20];
  //   await page.goto(Constants.DOWNLOAD_CLIP_URL);
  //   console.log("Method not implemented yet");
  //   await browser.close();
  // })();
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


// for (let i = 0; i < htmlClips.length; i++){
//   let url = matchClipURL(htmlClips[i]);
//   console.log(url);
//   console.log(`${i} : ${url}`);
//   // let title = matchClipTitle(htmlClips[i]);  
//   // console.log(`${i} : ${url} - ${title}`);
// };


// code reserve

    // // for (let button of buttons) {
    //   for (let i = 0; i < html.length; i++) {
    //     let clipURL = ''
    //     let clipTitle = ''
  
    //     // Extract clip url
    //     let matchedClipURL = Constants.DOWNLOAD_LINK_REGEX.exec(html[i]);
    //     console.log(`matchedClipURL : ${matchedClipURL}`)
    //     if (matchedClipURL == null) {
    //       console.log(`Failed clipURL OuterHTML : ${html[i]}`)
    //       throw new Error("Error - The clip url regex failed to extract");
    //     }
    //     else {
    //       clipURL = matchedClipURL[2];
    //       console.log(`Successfully stored ${clipURL}`)
    //     }
  
    //     // Extract clip title
    //     let matchedClipTitle = Constants.TITLE_REGEX.exec(html[i]);
    //     console.log(`matchedClipTitle : ${matchedClipTitle}`)
    //     if (matchedClipTitle == null) {
    //       console.log(`Failed clipTitle OuterHTML : ${html[i]}`)
    //       throw new Error("Error - The title url regex failed to extract");
    //     }
    //     else {
    //       clipTitle = matchedClipTitle[2];
    //       console.log(`Successfully stored ${clipTitle}`)
    //     }
  
    //     // Store the results 
    //     const currClip = new Clip(clipURL, clipTitle);
    //     clips.push(currClip);
    //   }