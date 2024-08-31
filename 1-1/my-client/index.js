const http = require('http')

// URL을 받아서 요청, 응답한 결과를 출력한다.
const url = process.argv[2]

if (!url) {
  console.error('Usage: node my-client/index.js <url>')
}

const options = new URL(url)

const req = http.request(options, res => {
  const data = []
  res.on('data', chunk => {
    data.push(chunk.toString())
  })
  res.on('end', ()=> {
    console.log(data.join(''))
  })
})

req.on('error', err => {
  console.error(err)
})

req.end()