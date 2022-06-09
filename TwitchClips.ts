const puppeteer = require('puppeteer');

import Clip from './Clip';
import Constants from './Constants';

// D:\Nicholas\Projects\WebScraper>
// node TwitchClips.jsx

// This method handles running a regex and error handling.
// Parameters: regex : 
function searchRegex(regex : RegExp, searchString: string) {
  let m;
  while ((m = regex.exec(searchString)) !== null) {
    if (m.index === regex.lastIndex) {
        regex.lastIndex++;
    }
    // The result can be accessed through the `m`-variable.
    m.forEach((match, groupIndex) => {
        console.log(`Found match, group ${groupIndex}: ${match}`);
    });
    return m;
  }
}

// This method is sure to change in the future.
// Parameters: siteURL: String for the website URL. Implicitly expects a streamcharts clips.
// Output: Returns an array of 20 clip objects
function retrieveClipsFromPage(siteUrl : string) : Clip[] {
  (async () => {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    const clips = Clip[20];
    await page.goto(siteUrl);

    // BEHOLD 
    // $x("//button[contains(x-show, *)]")
    // $x("//button[contains(@class, 'clip-container')]")
      
    const buttons = await page.$x("//button[contains(@class, 'clip-container')]");
    for (let button of buttons) {
      // Retrieve the information for each video from the top clips page
      const element_property = await button.getProperty('outerHTML');
      const outerHTML = await element_property.jsonValue();

      let clipURL = ''
      let clipTitle = ''

      // Extract clip url
      let matchedClipURL = searchRegex(Constants.DOWNLOAD_LINK_REGEX, outerHTML);
      if (!matchedClipURL) {
        throw new Error("Error - The clip url regex failed to extract");
      }
      else {
        clipURL = matchedClipURL[2];
      }

      // Extract clip title
      let matchedClipTitle = searchRegex(Constants.TITLE_REGEX, outerHTML);
      if (!matchedClipTitle) {
        throw new Error("Error - The title url regex failed to extract");
      }
      else {
        clipTitle = matchedClipTitle[2];
      }

      // Store the results 
      const currClip = new Clip(clipURL, clipTitle);
      clips.push(currClip);
    }
    await browser.close();
  })();
  return clips;
};

// This method is sure to change in the future.
// Parameters: siteURL: String for the website URL. Implicitly expects a streamcharts clips.
// Output: Returns an array of 20 clip objects
async function downloadClips(clips : Clip[]) {
  throw new Error("Method not implemented yet.");
  (async () => {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    const clips = Clip[20];
    await page.goto(Constants.DOWNLOAD_CLIP_URL);
    console.log("Method not implemented yet");
    await browser.close();
  })();
};

// Code execution starts here
console.log("- - Starting TwitchClips.ts - -");

// TODO : Look into promises and how to store the result of await into variable 
const clips = retrieveClipsFromPage(Constants.STREAMS_CHARTS_URL);
downloadClips(clips);
console.log("- - Finishing TwitchClips.ts - -");