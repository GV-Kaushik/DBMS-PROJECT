import pg from "pg";
const {Pool} =pg;

const pool= new Pool({
    user:"postgres",
    host:"localhost",
    database:"Car",
    password:"1616",
    port:5432
});

export default pool;
