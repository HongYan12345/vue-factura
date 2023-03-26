const sqlite3 = require('sqlite3').verbose()
let db

// 连接数据库
function conn () {
  if (!db || !db.open) {
    db = new sqlite3.Database('base.db')
  }
  return db
}

export const initAllTable=()=>{
  initTable()
  initTableArticulo()
  initTableEmpresa()
}

// 初始化数据表
function initTable(){
  console.log("init table user")
  return new Promise((resolve, reject) => {
    let db = conn()
    db.serialize(() => {
      db.run('CREATE TABLE IF NOT EXISTS user(telephone INTEGER PRIMARY KEY, name char(50) NOT NULL, direccion char(200) NOT NULL, cp INTEGER NOT NULL, nif char(10) NOT NULL, forma char(20) NOT NULL)')
      resolve()
    })
  })
}

export const insertClient = (client) => {
  return new Promise((resolve, reject) => {
    let db = conn()
    let prepare = db.prepare('replace into user (telephone, name, direccion, cp, nif, forma) values (?, ?, ?, ?, ?, ?)')
    prepare.run(client.telefono, client.name, client.direction, client.cp, client.nif, client.forma)
    prepare.finalize(err => {
      if (!err) resolve()
    })
  })
}

export const deleteClient = (telefono) => {
  return new Promise((resolve, reject) => {
    let db = conn()
    db.serialize(() => {
      db.run("DELETE FROM user WHERE telephone=?",telefono, function(err) {
        if(err){
            console.log(err)
        }
        else{
            console.log("Successful");
        }
        db.close();})
      resolve()
    })
    
  })
}

export const selectClient = (telefono) => {
  return new Promise((resolve, reject) => {
    let db = conn()
    db.serialize(() => {
      db.run("SELECT FROM user WHERE telephone=(?)", telefono, function(err) {
        if(err){
            console.log(err)
        }
        else{
            console.log("detele cliente Successful");
        }
        db.close();})
      resolve()
    })
    
  })
}

export const queryAllTree = () => {
  return new Promise((resolve, reject) => {
    let db = conn()
    db.all('select * from user order by telephone', (err, rows) => {
      if (err) reject(err)
      resolve(rows || [])
    })
  })
}

function initTableArticulo(){
  console.log("init table articulo")
  return new Promise((resolve, reject) => {
    let db = conn()
    db.serialize(() => {
      db.run('CREATE TABLE IF NOT EXISTS articulo(name char(50) PRIMARY KEY)')
      resolve()
    })
  })
}

export const insertArticulo = (name) => {
  return new Promise((resolve, reject) => {
    let db = conn()
    let prepare = db.prepare('replace into articulo (name) values (?)')
    prepare.run(name)
    prepare.finalize(err => {
      if (!err) resolve()
    })
  })
}

export const deleteArticulo = (name) => {
  return new Promise((resolve, reject) => {
    let db = conn()
    db.serialize(() => {
      db.run("DELETE FROM articulo WHERE name=?",name, function(err) {
        if(err){
            console.log(err)
        }
        else{
            console.log("delete articulo Successful");
        }
        db.close();})
      resolve()
    })
    
  })
}

export const queryAllArticulo = () =>{
  return new Promise((resolve, reject) => {
    let db = conn()
    db.all('select * from articulo order by name', (err, rows) => {
      if (err) reject(err)
      resolve(rows || [])
    })
  })
}

function initTableEmpresa(){
  console.log("init table empresa")
  return new Promise((resolve, reject) => {
    let db = conn()
    db.serialize(() => {
      db.run('CREATE TABLE IF NOT EXISTS empresa(telephone INTEGER PRIMARY KEY, name char(50) NOT NULL, direccion char(200) NOT NULL, cp INTEGER NOT NULL)')
      resolve()
    })
  })
}

export const insertEmpresa = (data) => {
  return new Promise((resolve, reject) => {
    let db = conn()
    let prepare = db.prepare('replace into empresa (telephone, name, direccion, cp) values (?, ?, ?, ?)')
    prepare.run(data.telefono, data.name, data.direccion, data.cp)
    prepare.finalize(err => {
      if (!err) resolve()
    })
  })
}

export const deleteEmpresa = () => {
  return new Promise((resolve, reject) => {
    let db = conn()
    db.serialize(() => {
      db.run("DELETE * FROM empresa", function(err) {
        if(err){
            console.log(err)
        }
        else{
            console.log("delete empresa Successful");
        }
        db.close();})
      resolve()
    })
    
  })
}

export const queryEmpresa = () => {
  return new Promise((resolve, reject) => {
    let db = conn()
    db.all('select * from empresa', (err, rows) => {
      if (err) reject(err)
      resolve(rows || [])
    })
  })
}

export const queryAllProducto = () => {
  return new Promise((resolve, reject) => {
    let db = conn()
    db.all('select * from producto order by name', (err, rows) => {
      if (err) reject(err)
      resolve(rows || [])
    })
  })
}