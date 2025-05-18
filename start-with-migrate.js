const { execSync } = require('child_process');

try {
  console.log('🔄 Ejecutando migraciones...');
  execSync('npx sequelize-cli db:migrate', { stdio: 'inherit' });

  console.log('🌱 Ejecutando seeds...');
  execSync('npx sequelize-cli db:seed:all', { stdio: 'inherit' });

  console.log('🚀 Iniciando servidor...');
  execSync('node ./bin/www', { stdio: 'inherit' });
} catch (err) {
  console.error('❌ Error durante el despliegue:', err);
  process.exit(1);
}