//rc95 11/08/2022 02:19
const sqlite3 = require('sqlite3').verbose()
const { open } = require('sqlite') //para usar async/await

// const db = new sqlite3.Database(':memory:') //esto dura solo mientras se ejecute..
// const db = new sqlite3.Database('my_sqlite.db') //esto crea/utiliza una bd (OJO, no se podrá usar async/await

const conectar_a_bd = async () => {
    return open({
        filename: 'my_sqlite.db',
        driver: sqlite3.Database
    })
}


const crear_y_poblar_tabla_usuarios = (db) => {
    return new Promise(async (resolve, reject) => {
        console.error(`step 1..`)
        try {
            await db.run(`CREATE TABLE IF NOT EXISTS usuarios (
                id INTEGER PRIMARY KEY AUTOINCREMENT, 
                nombre TEXT NOT NULL,
                email TEXT,
                fecha_creacion DATETIME DEFAULT CURRENT_TIMESTAMP )`)

            const mi_consulta = await db.get(`select count(id) as cantidad from usuarios`)
            if (mi_consulta.cantidad == 0) {
                await db.run(`INSERT INTO usuarios(
                    nombre,
                    email
                ) VALUES (
                    'Roberto',
                    'robert@hotmail.com'
                ), (
                    'Maria',
                    'ma_ria@gmail.com'
                )`)
            }

            resolve()
        } catch (error) {
            console.error(`ERROR in step 1: ${error}`)
            reject()
        }
    })
}

const imprimir_tabla_usuarios = (db) => {
    return new Promise(async (resolve, reject) => {
        console.error(`step 2.. usuarios..`)
        try {
            await db.each("SELECT * FROM usuarios", (err, row) => {
                if (err) {
                    reject()
                    throw err
                }
                console.log(row)
            })

            resolve()
        } catch (error) {
            console.error(`ERROR in step 2: ${error}`)
            reject()
        }
    })
}

const crear_y_poblar_tabla_notas = (db) => {
    return new Promise(async (resolve, reject) => {
        console.error(`step 3..`)
        try {
            await db.run(`CREATE TABLE IF NOT EXISTS notas (
                id INTEGER PRIMARY KEY AUTOINCREMENT, 
                id_usuario INTEGER, 
                titulo TEXT NOT NULL,
                cuerpo TEXT,
                fecha_creacion DATETIME DEFAULT CURRENT_TIMESTAMP )`)

            const mi_consulta = await db.get(`select count(id) as cantidad from notas`)
            if (mi_consulta.cantidad == 0) {
                await db.run(`INSERT INTO notas(
                id_usuario,
                titulo,
                cuerpo
                ) VALUES (
                    1,
                    'nota 1 roberto',
                    'lorem ipsum dolorem 111111 robertoooo'
                ),(
                    1,
                    'nota 2 roberto',
                    'lorem ipsum dolorem 222222 robertoooo'
                ),(
                    2,
                    'nota 1 maria',
                    'lorem ipsum dolorem 1 mariaaaa'
                )`)
            }

            resolve()
        } catch (error) {
            console.error(`ERROR in step 3: ${error}`)
            reject()
        }
    })
}

const imprimir_tabla_notas = (db) => {
    return new Promise(async (resolve, reject) => {
        console.error(`step 4.. notas..`)
        try {
            await db.each("SELECT * FROM notas", (err, row) => {
                if (err) {
                    reject()
                    throw err
                }
                console.log(row)
            })

            resolve()
        } catch (error) {
            console.error(`ERROR in step 4: ${error}`)
            reject()
        }
    })
}

const main = async () => {
    console.error(`INICIO..`)

    const db = await conectar_a_bd() 

    await crear_y_poblar_tabla_usuarios(db)
    await imprimir_tabla_usuarios(db)

    await crear_y_poblar_tabla_notas(db)
    await imprimir_tabla_notas(db)

    // await otras_operaciones(db) //update, delete, etc..

    console.error(`FIN..`)
}

// https://www.faqcode4u.com/faq/570586/when-to-close-database-with-node-sqlite3-and-express
process.on('SIGINT', () => {
    db.close();
});

main()