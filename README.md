# 3dphoto
Allows you to generate cinematic photos

## Installation

Install 3dphoto with npm

```bash
  npm install 3dphoto
```

## Usage/Examples

Make a cinematic photo

```javascript
const photoCinematic = require('3dphoto');
const path = require('path');
const photo3d = new photoCinematic({
  downloadPath: path.join(__dirname, '../downloads')
});

photo3d.animate({
  image: path.join(__dirname, './uploads', 'brad.jpg'),
  toBase64: true
})
.then((data) => {
  console.log('DATA:', data);
})
.catch(err => {
  console.error(err);
});

```


Response

```javascript
{
  "file": "DOWNLOAD_PATH/32e9ee6512eb42a4b230f166341d9729.gif",
  "base64": "R0lGODlhwAAAAfcAAAMDAwoKCgwNDQ0PDg4RDxIREBYQEB0RDiUSDCoVDjEYEDQ......YUTgh56"
}
```