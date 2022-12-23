const express = require('express')
const path = require('path')
const multer = require('multer')
const crypto = require('crypto');
const fs = require('fs')

const app = express()
const port = 3000

function createRandomString() {
  const S = '0123456789abcdef';
  const L = 32;
  let buf = crypto.randomBytes(L);
  let rnd = '';
  for (var i = 0; i < L; i++) {
    rnd += S.charAt(Math.floor((buf[i] / 256) * S.length));
  }
  return rnd;
}

const storage = multer.diskStorage({
  destination: function(req, file, cb) {
    const id = createRandomString();
    const file_path = `public/uploads/${id}/`
    fs.mkdir(file_path, (err) => {
      if (err) {
        console.log(err.toString());
        return;
      }
    })
    cb(null, file_path);
  },
  filename: function(req, file, cb) {
    cb(null, file.originalname)
  }
})
const upload = multer({ storage: storage })

app.get('/', (req, res) => res.redirect("/upload"))
app.use(express.static(path.join(__dirname, 'public')))

app.get('/upload', (req, res) => res.sendFile(path.join(__dirname, 'public/upload.html')))

app.post('/upload', upload.single('file'), function(req, res) {
  res.set({ 'Access-Control-Allow-Origin': '*' }); // ここでヘッダーにアクセス許可の情報を追加
  console.log(req.file)
  let pathhh = req.file.path.replace("public/", "https://file-up.skota11.repl.co/");
  res.send(pathhh)
})

app.listen(port, function() {
  console.log(`Example app listening on port ${port}!`)
})