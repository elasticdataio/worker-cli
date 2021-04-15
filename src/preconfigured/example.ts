export const examplePipeline = {
  "version": "2.0",
  "settings": {
    "window": {
      "width": 1800,
      "height": 800,
      "language": "en"
    }
  },
  "commands": [
    {
      "cmd": "openurl",
      "link": "https://google.com"
    },
    {
      "cmd": "getscreenshot",
      "key": "my-screenshot"
    },
    {
      "cmd": "gettext",
      "selector": "body",
      "key": "content"
    }
  ]
}
