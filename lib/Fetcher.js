const Fetch = require('node-fetch')
const {EventEmitter} = require('node:events')
let FormData = require('form-data')
const fs = require('fs')
let s = (n) => Symbol(n)

class Fetcher extends EventEmitter {
  constructor(uh){
    super()
    this.url = '';
    this.options = {};
    this.options.headers = {};
    this.data = [];
    this.asu = {}
    this.encoding = 'utf8'
    this[s('Fetcher')] = false
  }
  post(url){
    this.url = url;
    this.options.method = 'POST';
    return this;
  }
  get(url){
    this.url = url;
    this.options.method = 'GET';
    return this
  }
  send(op){
    if (this.options.method === 'GET') throw new Error('Request with GET method cannot have body')
    this.options.body = op;
    return this;
  }
  set(name, content){
    this.options.headers[name] = content;
    return this
  }
  form(name, contents){
    let form = new FormData
    this.data.push({ name, contents })
    for (let F of this.data) form.append(F.name, F.contents)
    this.options.body = form
    return this;
  }
  setEncoding(type){
    let encoding = ['utf-8', 'utf8', 'string', 'buffer', 'ArrayBuffer', 'base64']
    for (encoding in type) throw new Error('encoding support ' + encoding.join(' '))
    this.encoding = type
  }
  async toBuffer(cb){
    if (typeof cb == 'function') {
      let res = await Fetch(this.url, this.options)
      if(res.status == 200) cb(null, await res.buffer())
      else cb(res.text(), null)
    }
    else throw new Error('cb must be function')
  }
  async end(cb){
    if (typeof cb == 'function') {
      let res = await Fetch(this.url, this.options)
      if(res.status != 200) cb(res.text(), null)
      if (encoding == 'utf8' || encoding == 'utf-8'){
        cb(null, await res.text())
      } else if(this.encoding == 'buffer', this.encoding == 'ArrayBuffer'){
        cb(null, await res.buffer())
      } else if(this.encoding == 'base64'){
        cb(null, await res.buffer().toString('base64'))
      }
    }
    else throw new Error('cb must be function')
  }
}

module.exports = new Fetcher
