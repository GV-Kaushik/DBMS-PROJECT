import pg from "pg";
const {Pool} =pg;

const pool= new Pool({
    user:"postgres",
    host:"localhost",
    database:"cms",
    password:"1234",
    port:5432
});

export default pool;
