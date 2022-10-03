const puppeteer = require('puppeteer');
const path = require('path');
const fs = require('fs');

const randomUUI = (a,b) => {for(b=a='';a++<36;b+=a*51&52?(a^15?8^Math.random()*(a^20?16:4):4).toString(16):'');return b}

const base64Encode = (file) => {
  var body = fs.readFileSync(file);
  return body.toString('base64');
}

class photoCinematic {
  constructor(args = {}){
    this.downloadPath = args.downloadPath || path.join(__dirname, 'downloads');
    this.url = 'https://storage.googleapis.com/tfjs-models/demos/3dphoto/index.html';

    if (!fs.existsSync(this.downloadPath)) {
      fs.mkdirSync(this.downloadPath);
    }
  }

  async animate(args) {
    return await new Promise(async (resolve, reject) => {
      if (args.image === '') return reject('Image must not be empty');
      if (!fs.existsSync(args.image)) return reject('Image does not exist');

      try {
        let browser = await puppeteer.launch({
          headless: true,
          devtools: false,
          ignoreHTTPSErrors: true,
          dumpio: false,
          defaultViewport: null,
          args:['--start-maximized' ]
        });

        const page = (await browser.pages())[0];
        await page.goto(this.url, {waitUntil: 'load'});
        
        const client = await page.target().createCDPSession(); 
        await client.send('Page.setDownloadBehavior', {
          behavior: 'allow',
          downloadPath: this.downloadPath 
        });

        await page.waitForSelector('input[type=file]');
        const uploadButton = await page.$('input[type=file]');
        await uploadButton.uploadFile(args.image);
        await page.waitForSelector('#delete-upload');
        await page.waitForTimeout(2000);

        const fileName = randomUUI();
        await page.evaluate((fileName) => {
          if (capturer) {
            capturer.stop();
          }
          capturer = new CCapture({
            format: 'gif',
            name: fileName,
            verbose: false,
            workersPath: './js/',
          });

          capturer.start();
          capturerInitialTheta = Date.now() * config.cameraSpeed;
        }, fileName);

        const filePath = path.join(this.downloadPath, `${fileName}.gif`);
        await this.validateDownload(page, filePath);
        await browser.close();
        
        if (args.toBase64) {
          const fileBase64 = base64Encode(filePath);
          resolve({
            file: filePath,
            base64: fileBase64
          });
        } else {
          resolve({
            file: filePath
          });
        }
      } catch(err) {
        reject(err);
      }
    });
  }

  async validateDownload(page, file) {
    let sucess = false;
    while (!sucess) {
      if (fs.existsSync(file)) sucess = true;
      else await page.waitForTimeout(1000);
    }
  }

}

module.exports = photoCinematic;