const Constants = {
    DOWNLOAD_LINK_REGEX: /(https:\/\/clips\.twitch\.tv\/embed\?clip=)(.*?)(')/gm,
    TITLE_REGEX: /(alt=")(.*?)(")/gm,
    STREAMS_CHARTS_URL: 'https://streamscharts.com/clips',
    DOWNLOAD_CLIP_URL: 'https://streamscharts.com/clips/downloader',
  }
  
  export {Constants};