const http = require('http');
const app = require('./app');
const { testConnection } = require('./config/db');
const UserModel = require('./models/User.model');
require('dotenv').config();

const PORT = process.env.PORT || 5000;

const server = http.createServer(app);

const startServer = async () => {
  console.log('\n========================================================');
  console.log('🌟 LUMINARY STORE — ENTERPRISE BACKEND SERVER');
  console.log('========================================================\n');

  // Testar conexão com o banco e inicializar credenciais administrativas
  const connected = await testConnection();
  if (connected) {
    await UserModel.verifyAdminAccount();
  }

  server.listen(PORT, () => {
    console.log(`\n🚀 [Servidor Online]: API REST ouvindo na porta ${PORT}`);
    console.log(`📡 [Ambiente]: ${process.env.NODE_ENV || 'development'}`);
    console.log(`🔗 [URL Base]: http://localhost:${PORT}/api`);
    console.log(`🩺 [Healthcheck]: http://localhost:${PORT}/api/health`);
    console.log('========================================================\n');
  });
};

startServer();

// Tratamento de interrupções limpas e erros de processo não capturados
process.on('SIGINT', () => {
  console.log('\n⚠️ [Servidor]: Encerrando graciosamente o serviço Node.js...');
  server.close(() => {
    console.log('🛑 [Servidor]: Serviço parado com segurança.');
    process.exit(0);
  });
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('❌ [Unhandled Rejection no Server]:', reason);
});
