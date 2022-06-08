const puppeteer = require('puppeteer');

// D:\Nicholas\Projects\WebScraper>
// node TwitchClips.jsx

const linkRegex = /(https:\/\/clips\.twitch\.tv\/embed\?clip=)(.*?)(')/gm;
// The title regex can be used for getting title of clip and game 
const titleRegex = /(alt=")(.*?)(")/gm;


function searchRegex(regex, string) {
  let m;
  while ((m = linkRegex.exec(string)) !== null) {
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

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto('https://streamscharts.com/clips');

  // BEHOLD 
  // $x("//button[contains(x-show, *)]")
  // $x("//button[contains(@class, 'clip-container')]")
    
  const buttons = await page.$x("//button[contains(@class, 'clip-container')]");
  for (let button of buttons) {
    // console.log(button.outerHTML);
    // await button.evaluate(b => console.log(b.outerHTML));
    // await button.evaluate(b => b.click());
    const element_property = await button.getProperty('outerHTML');
    const outerHTML = await element_property.jsonValue();

    // Extract clip url
    let clipURL = searchRegex(linkRegex, outerHTML);
    if (!clipURL) {
      throw new Error("Error - The clip url regex failed to extract");
    }
    else {
      clipURL = clipURL[2];
    }

    // Extract clip title
    let clipTitle = searchRegex(linkRegex, outerHTML);
    if (!clipTitle) {
      throw new Error("Error - The clip url regex failed to extract");
    }
    else {
      clipTitle = clipTitle[2];
    }


  }
  // throw new Error("Intentional Error");
  await browser.close();
})();

console.log("hello there");