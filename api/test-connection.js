// Quick test script to verify Supabase connection
import dotenv from 'dotenv'
import pkg from 'pg'

dotenv.config()

const { Pool } = pkg

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
})

async function testConnection() {
  try {
    console.log('🔍 Testing Supabase connection...\n')
    
    // Test 1: Basic connection
    console.log('1. Testing basic connection...')
    await pool.query('SELECT 1')
    console.log('   ✅ Database connection successful!\n')
    
    // Test 2: Check tables exist
    console.log('2. Checking tables...')
    const tables = await pool.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      ORDER BY table_name
    `)
    console.log(`   ✅ Found ${tables.rows.length} tables:`)
    tables.rows.forEach(t => console.log(`      - ${t.table_name}`))
    console.log()
    
    // Test 3: Query sample data
    console.log('3. Testing data queries...')
    
    const skills = await pool.query('SELECT COUNT(*) as count FROM skills')
    console.log(`   ✅ Skills: ${skills.rows[0].count} records`)
    
    const projects = await pool.query('SELECT COUNT(*) as count FROM projects WHERE is_published = true')
    console.log(`   ✅ Published Projects: ${projects.rows[0].count} records`)
    
    const experience = await pool.query('SELECT COUNT(*) as count FROM experience')
    console.log(`   ✅ Experience: ${experience.rows[0].count} records`)
    
    console.log('\n🎉 All tests passed! API is ready to use.')
    process.exit(0)
  } catch (err) {
    console.error('\n❌ Connection test failed:')
    console.error(err.message)
    if (err.message.includes('password')) {
      console.error('\n💡 Tip: Check your DATABASE_URL in api/.env - make sure password is correct.')
    }
    process.exit(1)
  } finally {
    await pool.end()
  }
}

testConnection()

