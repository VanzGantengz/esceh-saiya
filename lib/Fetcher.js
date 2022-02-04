const Fetch = require('node-fetch')
const {EventEmitter} = require('node:events')
let FormData = require('form-data')
const fs = require('fs')
let s = (n) => Symbol(n)

class Fetcher extends EventEmitter {
  constructor(uh){
    super()
    this.url = '';
    this.options = new Object;
    this.options.headers = new Object;
    this.data = new Array;
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
    if (this.options.method == 'GET') throw new Error('Request with GET method cannot have body')
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
    if (type in encoding) throw new Error('Salah encoding su')
    this.encoding = type;
    return this;
  }
  _clear(){
    this.data = [];
    this.options = {};
    this.asu = {};
    this.url = '';
    this.options.headers = {}
  }
  async toBuffer(cb){
    if (typeof cb == 'function') {
      let res = await Fetch(this.url, this.options)
      if(res.status == 200) cb(null, await res.buffer())
      else cb(await res.text(), null)
    }
    else throw new Error('cb must be function')
  }
  async end(cb){
    if (typeof cb == 'function') {
      let res = await Fetch(this.url, this.options)
      if(res.status != 200) cb(await res.text(), null)
      if (this.encoding.toLowerCase() == 'utf8' || this.encoding == 'utf-8'){
        cb(null, await res.text())
      } else if(this.encoding.toLowerCase() == 'buffer', this.encoding.toLowerCase() == 'arraybuffer'){
        cb(null, await res.buffer())
      } else if(this.encoding.toLowerCase() == 'base64'){
        cb(null, 'data:' + res.headers.get('content-type') + ';base64,' + await res.buffer().toString('base64'))
      } else if (this.encoding == 'json'){
        cb(null, await res.json())
      }
    }
    else throw new Error('cb must be function')
    this._clear()
  }
}

module.exports = new Fetcher
