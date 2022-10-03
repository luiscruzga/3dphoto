const photoCinematic = require('../src/index');
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