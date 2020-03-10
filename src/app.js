/**
 * Copyright 2020 isobar. All Rights Reserved.
 *
 * */
'use strict';

const dotenv = require('dotenv').config();
const path = require('path');
const uuid = require('uuid');

const URL = process.env.URL;
const PORT = (process.env.PORT || 8000);
const EXT_IP = process.env.EXT_IP;
const ENABLE_SSL = process.env.ENABLE_SSL=='true' ? true : false;
const API_HOST = (ENABLE_SSL=='true' ? 'https://' : 'http://')+EXT_IP+':'+PORT+'/'
const MONGO_URI = process.env.MONGO_URI;
const ENABLE_MONGO = MONGO_URI!="";

const fastify = require('fastify')({
  logger: true
});

fastify.register(require('fastify-static'), {
  root: path.join(__dirname, '../public')
});

fastify.register(require('../modules/fastify-gm'), {
  font: path.join(__dirname, '../fonts/NotoSansTC-Regular.otf'),
  from_folder: path.join(__dirname, '../public/images/'),
  to_folder: path.join(__dirname, '../public/upload/'),
});

fastify.register(require('fastify-no-icon'));

fastify.get('/', async (req, res) => {
  return { hello: 'isobar' }
})

fastify.get('/user/:username', async (req, res) => {
  return { hello: req.params.username }
})

fastify.get('/jpg/:color/:text', async (req, res) => {
  const text = req.params.text;
  const color = req.params.color;
  const uid = uuid();
  if (text) {
    await fastify.textOverImage({text:text, pos:{x:50,y:150}, color:color, fileId:uid});
    return { success: true, jpg: API_HOST+'/upload/'+uid+'.jpg' }
  }
})

const start = async () => {
  try {
    await fastify.listen(3000);
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
}

start();
