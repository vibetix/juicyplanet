import bcrypt from 'bcrypt';

const plainPassword = 'juicy.88@admin'; // 👈 Replace with your actual password
const saltRounds = 10;

bcrypt.hash(plainPassword, saltRounds).then((hash) => {
  console.log('Hashed Password:', hash);
});
