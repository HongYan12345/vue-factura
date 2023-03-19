const sqlite3 = require('sqlite3').verbose()
let db

// 连接数据库
function conn () {
  if (!db || !db.open) {
    db = new sqlite3.Database('base.db')
  }
  return db
}

// 初始化数据表
export const initTable = () => {
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
            console.log("Successful");
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

export const initTableM = () => {
  return new Promise((resolve, reject) => {
    let db = conn()
    db.serialize(() => {
      db.run('CREATE TABLE IF NOT EXISTS producto(name char(50) PRIMARY KEY)')
      resolve()
    })
  })
}

export const insertProducto = (name) => {
  return new Promise((resolve, reject) => {
    let db = conn()
    let prepare = db.prepare('replace into producto (name) values (?)')
    prepare.run(name)
    prepare.finalize(err => {
      if (!err) resolve()
    })
  })
}

export const deleteProducto = (name) => {
  return new Promise((resolve, reject) => {
    let db = conn()
    db.serialize(() => {
      db.run("DELETE FROM producto WHERE name=?",name, function(err) {
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

export const insertEmpresa = (data) => {
  return new Promise((resolve, reject) => {
    let db = conn()
    let prepare = db.prepare('replace into user (telephone, name, direccion, cp, nif, forma) values (?, ?, ?, ?, ?, ?)')
    prepare.run(client.telefono, client.name, client.direction, client.cp, client.nif, client.forma)
    prepare.finalize(err => {
      if (!err) resolve()
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