const pool = require('./config/db');

async function testDatabase() {
    try{
        const result = await pool.query(
            'SELECT * FROM facilities ORDER BY id'
        );
        console.log(result.rows);
        
    }catch(error){
        console.error("Erreur PostgreSQL :", error);
    }finally{

    await pool.end();

    }
}

testDatabase();
