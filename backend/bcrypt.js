// bcrypt.js
import bcrypt from "bcrypt";

async function main() {
  const hash = await bcrypt.hash("Admin123*", 10);
  console.log("PASSWORD:", "Admin123*");
  console.log("HASH:", hash);
}

main().catch((e) => {
  console.error("Error:", e);
  process.exit(1);
});
