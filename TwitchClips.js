const puppeteer = require('puppeteer');

const Constants = {
  DOWNLOAD_LINK_REGEX: /(https:\/\/clips\.twitch\.tv\/embed\?clip=)(.*?)(')/gm,
  TITLE_REGEX: /(alt=")(.*?)(")/gm,
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
    console.log(clip.URL);
  })
}

// This method is sure to change in the future.
// Parameters: siteURL: String for the website URL. Implicitly expects a streamcharts clips.
// Output: Returns an array of 20 clip objects
async function retrieveClipsFromPage(siteUrl) {
  let clips = new Array(20);
  try{
    const browser = await puppeteer.launch( {headless : false });
    const page = await browser.newPage();
    await page.goto(siteUrl);

    // BEHOLD 
    // $x("//button[contains(x-show, *)]")
    // $x("//button[contains(@class, 'clip-container')]")

    // TODO: 
    // DEBUG WHY THIS REGEX IS ONLY WORKING FOR THE FIRST MATCH
    // IS IT REALLY JUST A REGEX MATCHING FAILURE
    // OR DOES IT HAVE TO DO WITH SOME TRICKY AWAIT/ASYNC BUT THAT I DON'T UNDERSTAND?
      
    let buttons = await page.$x("//button[contains(@class, 'clip-container')]");
    console.log(buttons.length);
    // for (let button of buttons) {
    for (let i = 0; i < buttons.length; i++) {
      // Retrieve the information for each video from the top clips page
      const element_property = await buttons[i].getProperty('outerHTML');
      const outerHTML = await element_property.jsonValue();

      let clipURL = ''
      let clipTitle = ''

      // Extract clip url
      console.log(`--- If this is ever not a bunch of text, freak out: ${outerHTML} ---`);
      let matchedClipURL = Constants.DOWNLOAD_LINK_REGEX.exec(outerHTML);
      console.log(`matchedClipURL : ${matchedClipURL}`)
      if (!matchedClipURL) {
        console.log(`Failed clipURL OuterHTML : ${outerHTML}`)
        throw new Error("Error - The clip url regex failed to extract");
      }
      else {
        clipURL = matchedClipURL[2];
        console.log(`Successfully stored ${clipURL}`)
      }

      // Extract clip title
      let matchedClipTitle = Constants.TITLE_REGEX.exec(outerHTML);
      console.log(`matchedClipTitle : ${matchedClipTitle}`)
      if (!matchedClipTitle) {
        console.log(`Failed clipTitle OuterHTML : ${outerHTML}`)
        throw new Error("Error - The title url regex failed to extract");
      }
      else {
        clipTitle = matchedClipTitle[2];
        console.log(`Successfully stored ${clipTitle}`)
      }

      // Store the results 
      const currClip = new Clip(clipURL, clipTitle);
      clips.push(currClip);
    }
    await browser.close();
  }
  catch (exception) {
    console.log("Encountered an error");
    console.log(exception)
  }
  printClipArray(clips);
  return clips;
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

// Code execution starts here
(async() => {
console.log("- - Starting TwitchClips.ts - -");

// TODO : Look into promises and how to store the result of await into variable 
const clips = await retrieveClipsFromPage(Constants.STREAMS_CHARTS_URL);
// downloadClips(clips);
console.log("- - Finishing TwitchClips.ts - -");
})();