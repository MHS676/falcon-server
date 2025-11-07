const bcrypt = require('bcrypt');

async function hashPassword() {
  const password = 'admin123';
  const hash = await bcrypt.hash(password, 10);
  console.log('Password: admin123');
  console.log('Hash:', hash);
}

hashPassword();