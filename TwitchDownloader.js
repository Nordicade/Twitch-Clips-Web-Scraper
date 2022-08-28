const fs = require("fs");
const { exit } = require("process");
const puppeteer = require('puppeteer');
const { PassThrough } = require("stream");

const Constants = {
  DOWNLOAD_LINK_REGEX: /(https:\/\/clips\.twitch\.tv\/embed\?clip=)(.*?)(')/gm,
  TITLE_REGEX: /(alt=")(.*?)(")/gm,
  TWITCH_DOMAIN: 'https://clips.twitch.tv/embed?clip=',
  TWITCH_BASE: 'https://clips.twitch.tv/',
  STREAMS_CHARTS_URL: 'https://streamscharts.com/clips',
  DOWNLOAD_CLIP_URL: 'https://streamscharts.com/clips/downloader',
  EXPECTED_URL: 'https://clips-media-assets2.twitch.tv/ '
}

async function killPuppeteer(browser){
  await browser.close();
}


(async () => {
  console.log(" - - starting Twitch Downloader - -");
  const buffer = fs.readFileSync("./output/clipHTML.txt").toString();
  const clipHTML = buffer.split('\r\n');
  const browser = await puppeteer.launch( {headless : false });
  const page = await browser.newPage();
  await page.goto(Constants.DOWNLOAD_CLIP_URL);
  let outputList = [];
  for(let i = 0; i < clipHTML.length - 1; i++){
    const page = await browser.newPage();
    await page.setViewport({width: 1366, height: 768})
    await page.goto(Constants.DOWNLOAD_CLIP_URL, { waitUntil: 'networkidle2' });
    console.log(clipHTML[i]);
    console.log(`This is where ${clipHTML[i]} starts`);
    await page.waitForSelector('input[name=clip-downloader]', {visible: true});
    await page.$eval('input[name=clip-downloader]', (el, clipHTML) => el.value = clipHTML, clipHTML[i]);
    let button1 = await page.$x("//button[contains(@aria-label, 'Download')]");
    await page.waitForSelector("button[aria-label=Download]", {visible: true});
    await page.click('button[aria-label="Download"]')


    // NEED TO FIND A BETTER SELCECTOR FOR THE DOWNLOAD BUTTON
    // THAT WAY WE CAN WATIFORSELECTOR TO ENSURE IT EXISTS BEFORE PRESSING
    // const href = await page.$x("//a[contains(., 'Download .MP4, 1080p')]");
    try {
      await page.waitForXPath('/html/body/main/div[3]/div/div[1]/div/div[2]/div[5]/div/a', {visible:true});
    }
    catch {
      try {
        fs.writeFileSync('/Users/Nick/Development/Projects/Twitch-Clips-Web-Scraper/output/clipURL.txt', outputList);
      }
      catch(err){
        exit(1);
      }
    }
    // const link = await page.$eval('/html/body/main/div[3]/div/div[1]/div/div[2]/div[5]/div/a')[0];

    // await page.waitForSelector("a[contains(.=Download .MP4, 1080p)]", {visible: true});
    const href = await page.$x("//a[contains(., 'Download .MP4')]");
    if (href.length == 0){
      continue;
    }
    const output = await page.evaluate(el => { return el.href}, href[0]);
    console.log(output);
    await new Promise(r => setTimeout(r, 1000));
    outputList.push(output);
  }
  await killPuppeteer(browser);
  try {
    let outputText = ''
    for (let i = 0; i < outputList.length; i++) {
      outputText = outputText + outputList[i].toString() + '\r\n';
    }
    fs.writeFileSync('/Users/Nick/Development/Projects/Twitch-Clips-Web-Scraper/output/clipURL.txt', outputText);
  }
  catch(err){
    console.log(err)
    console.log("An error occurred writing the html clip data")
  }
  
  console.log(" - - exiting Twitch Downloader - -");
})();