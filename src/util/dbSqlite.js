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
      db.run('CREATE TABLE IF NOT EXISTS user(telefono char(15) PRIMARY KEY, name char(50) NOT NULL, direccion char(200) NOT NULL, cp char(10) NOT NULL, nif char(10) NOT NULL, forma char(20) NOT NULL, poblation char(20) NOT NULL)')
      resolve()
    })
  })
}

export const insertClient = (client) => {
  return new Promise((resolve, reject) => {
    let db = conn()
    let prepare = db.prepare('replace into user (telefono, name, direccion, cp, nif, forma, poblation) values (?, ?, ?, ?, ?, ?, ?)')
    prepare.run(client.telefono, client.name, client.direccion, client.cp, client.nif, client.forma, client.poblation)
    prepare.finalize(err => {
      if (!err) resolve()
    })
  })
}

export const deleteClient = (telefono) => {
  return new Promise((resolve, reject) => {
    let db = conn()
    db.serialize(() => {
      db.run("DELETE FROM user WHERE telefono=?",telefono, function(err) {
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
      db.all("SELECT * FROM user WHERE telefono=(?)", telefono, (err, rows) => {
        if (err) reject(err)
        resolve(rows || [])
      })
      
    })
    
  })
}

export const queryAllTree = () => {
  console.log("show user")
  return new Promise((resolve, reject) => {
    let db = conn()
    db.all('select * from user order by telefono', (err, rows) => {
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
  console.log("show articulo")
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
      db.run('CREATE TABLE IF NOT EXISTS empresa(telefono char(15) PRIMARY KEY, name char(50) NOT NULL, direccion char(200) NOT NULL, cp char(10) NOT NULL, poblation char(20) NOT NULL, nif char(15) NOT NULL)')
      resolve()
    })
  })
}

export const insertEmpresa = (data) => {
  return new Promise((resolve, reject) => {
    let db = conn()
    let prepare = db.prepare('replace into empresa (telefono, name, direccion, cp, poblation, nif) values (?, ?, ?, ?, ?, ?)')
    console.log("update empresa")
    prepare.run(data.telefono, data.name, data.direccion, data.cp, data.poblation, data.nif)
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
  console.log("show empresa")
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