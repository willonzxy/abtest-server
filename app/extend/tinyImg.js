/*
 * @Author: willon 伟龙 
 * @Date: 2020-02-17 15:13:32 
 * @Last Modified by: 伟龙
 * @Last Modified time: 2020-02-17 22:11:29
 */
const https = require('https');
const fs = require('fs');
const { URL } = require('url');

module.exports = {
  tinypngApiMock(img,stream) {
    const options = {
      method: 'POST',
      hostname: 'tinypng.com',
      path: '/web/shrink',
      headers: {
        rejectUnauthorized: false,
        'Postman-Token': Date.now(),
        'Cache-Control': 'no-cache',
        'Content-Type': 'application/x-www-form-urlencoded',
        'User-Agent':
          'Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/56.0.2924.87 Safari/537.36'
      }
    };
    return new Promise((resolve)=>{
      let req = https.request(options, function(res) {
        res.on('data', buf => {
          let obj = JSON.parse(buf.toString());
          if (obj.error) {
            console.log(`[${img}]：压缩失败！报错：${obj.message}`);
            resolve({status:2,...obj})
          } else {
            resolve({status:1,...obj})
          }
        });
      });
      req.write(stream, 'binary');
      req.on('error', e => {
        console.error(e);
      });
      req.end();
    })
  },
  httpsUrl2file(target_path,url) {
    return new Promise((resolve)=>{
      let options = new URL(url);
      let req = https.request(options, res => {
        let body = '';
        res.setEncoding('binary');
        res.on('data', function(data) {
          body += data;
        });
        res.on('end', async () => {
          fs.writeFile(target_path, body, 'binary', err => {
            if (err) return resolve({status:2})
            resolve({status:1})
          });
        });
      });
      req.on('error', e => {
        resolve({status:2})
      });
      req.end();
    })
  }
}
