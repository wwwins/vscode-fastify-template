'use strict';

const fp = require('fastify-plugin');
const fs = require('fs');
const gm = require('gm');

function plugin(fastify, opts, done) {
    const font = opts.font;
    const from_folder = opts.from_folder;
    const to_folder = opts.to_folder;
    const png_compress = opts.png_compress || 10;
    const jpg_qual = opts.jpg_qual || 90;

    fastify.decorate('textOverImage', ({
      fileId=0,
      text='',
      pos={x:0,y:0},
      color='FF0000',
      bgName='img_700x540.jpg',
      fontSize=24
    }={}) => {
      const imgExt = bgName.toLowerCase().substr(bgName.length-3);
      const img = from_folder+bgName;
      const out = to_folder+fileId+'.'+imgExt;
      const q = imgExt=='png' ? png_compress : jpg_qual;
      const hexColor = '#'+color;
      return new Promise((resolve, reject) => {
        gm(img)
          .font(font)
          .fontSize(fontSize)
          .fill(hexColor)
          .drawText(pos.x,pos.y,text)
          .font(font)
          // debug
          .fontSize(14)
          .fill("#112233")
          .drawText(10,530,fileId+'.'+imgExt)
          .quality(q)
          .write(out, (err)=>{
            resolve();
            //if(err) console.log(err);
          })
      })
    })
    done();
}

module.exports = fp(plugin, {
  fastify: '>2.0.0',
  name: 'fastify-gm'
})