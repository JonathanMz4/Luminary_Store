const mysql = require('mysql2/promise');
require('dotenv').config();

const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASS || '',
  database: process.env.DB_NAME || 'luminary_db',
  port: parseInt(process.env.DB_PORT || '3306', 10),
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
};

let pool;

try {
  pool = mysql.createPool(dbConfig);
  console.log('⚡ [MySQL]: Pool de conexões inicializado para o banco:', dbConfig.database);
} catch (error) {
  console.error('❌ [MySQL]: Erro ao criar pool de conexões:', error.message);
}

// Função auxiliar para testar a conexão no boot
async function testConnection() {
  try {
    const connection = await pool.getConnection();
    console.log('✅ [MySQL]: Conexão estabelecida com sucesso ao banco corporativo!');
    connection.release();
    return true;
  } catch (error) {
    console.warn('⚠️ [MySQL Aviso]: Não foi possível conectar ao banco local no boot:', error.message);
    console.warn('💡 Certifique-se de que o serviço MySQL está rodando e que o script schema.sql foi importado.');
    return false;
  }
}

// Função auxiliar wrapper para execuções de SQL mais limpas nos repositories
async function query(sql, params) {
  try {
    const [results] = await pool.execute(sql, params);
    return results;
  } catch (error) {
    console.error(`❌ [Erro SQL]: ${error.message}\nQuery: ${sql}`);
    throw error;
  }
}

module.exports = {
  pool,
  query,
  testConnection
};
