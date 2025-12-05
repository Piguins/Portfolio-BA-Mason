import pkg from 'pg';
const { Pool } = pkg;
import dotenv from 'dotenv';
dotenv.config();

const password = "fSBAmkz4vf5qv3nJ";

// Test multiple connection string formats
const formats = [
  {
    name: "Session mode - postgres.projectref",
    url: `postgres://postgres.qeqjowagaybaejjyqjkg:${password}@aws-0-ap-southeast-1.pooler.supabase.com:5432/postgres`
  },
  {
    name: "Session mode - postgres only",
    url: `postgres://postgres:${password}@aws-0-ap-southeast-1.pooler.supabase.com:5432/postgres`
  },
  {
    name: "Transaction mode - postgres.projectref",
    url: `postgres://postgres.qeqjowagaybaejjyqjkg:${password}@aws-0-ap-southeast-1.pooler.supabase.com:6543/postgres?pgbouncer=true`
  },
  {
    name: "Transaction mode - postgres only",
    url: `postgres://postgres:${password}@aws-0-ap-southeast-1.pooler.supabase.com:6543/postgres?pgbouncer=true`
  },
  {
    name: "Direct connection",
    url: `postgresql://postgres:${password}@db.qeqjowagaybaejjyqjkg.supabase.co:5432/postgres`
  }
];

async function testConnection(name, url) {
  const pool = new Pool({
    connectionString: url,
    ssl: { rejectUnauthorized: false },
    connectionTimeoutMillis: 5000,
  });

  try {
    const result = await pool.query('SELECT 1 as test, current_database(), current_user');
    console.log(`✅ ${name}: SUCCESS!`, result.rows[0]);
    await pool.end();
    return true;
  } catch (err) {
    console.log(`❌ ${name}: ${err.message}`);
    await pool.end();
    return false;
  }
}

async function testAll() {
  console.log('🔍 Testing all connection string formats...\n');
  for (const format of formats) {
    const success = await testConnection(format.name, format.url);
    if (success) {
      console.log(`\n✅ WORKING FORMAT: ${format.name}`);
      console.log(`URL: ${format.url.replace(/:[^:@]+@/, ':****@')}\n`);
      return format.url;
    }
    await new Promise(resolve => setTimeout(resolve, 1000)); // Wait 1s between tests
  }
  console.log('\n❌ All formats failed. Please check password or connection settings.');
  return null;
}

testAll().then(workingUrl => {
  if (workingUrl) {
    console.log('💡 Update your .env file with the working format above.');
  }
  process.exit(workingUrl ? 0 : 1);
});
