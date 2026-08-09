import bcrypt from "bcrypt";

const SALT_ROUNDS = 12;

const credentials = [
  { email: "gustavo@faxinaja.com.br", password: "admin123" },
  { email: "mariana.duarte@faxinaja.com.br", password: "operador123" },
  { email: "rafael.nunes@faxinaja.com.br", password: "operador123" },
];

for (const { email, password } of credentials) {
  const hash = await bcrypt.hash(password, SALT_ROUNDS);
  console.log(`${email} | ${password} | ${hash}`);
}
