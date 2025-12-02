// Quick test script to verify Supabase connection using pg library
import client from './src/db.js'

async function testConnection() {
  try {
    console.log('🔍 Testing Supabase connection...\n')
    
    // Test 1: Basic connection
    console.log('1. Testing basic connection...')
    await client.query('SELECT 1')
    console.log('   ✅ Database connection successful!\n')
    
    // Test 2: Check tables exist
    console.log('2. Checking tables...')
    const tablesResult = await client.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      ORDER BY table_name
    `)
    console.log(`   ✅ Found ${tablesResult.rows.length} tables:`)
    tablesResult.rows.forEach(t => console.log(`      - ${t.table_name}`))
    console.log()
    
    // Test 3: Query sample data
    console.log('3. Testing data queries...')
    
    const skillsResult = await client.query('SELECT COUNT(*) as count FROM skills')
    console.log(`   ✅ Skills: ${skillsResult.rows[0].count} records`)
    
    const projectsResult = await client.query('SELECT COUNT(*) as count FROM projects WHERE is_published = true')
    console.log(`   ✅ Published Projects: ${projectsResult.rows[0].count} records`)
    
    const experienceResult = await client.query('SELECT COUNT(*) as count FROM experience')
    console.log(`   ✅ Experience: ${experienceResult.rows[0].count} records`)
    
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
    await client.end()
  }
}

testConnection()

