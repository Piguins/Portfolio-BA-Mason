// Helper script to URL encode password for DATABASE_URL
// Usage: node encode-password.js "your@password#here"

import { URLSearchParams } from 'url'

const password = process.argv[2]

if (!password) {
  console.error('❌ Usage: node encode-password.js "your@password#here"')
  process.exit(1)
}

// URL encode the password (encode special characters)
const encoded = encodeURIComponent(password)

console.log('\n📝 Password Encoding Helper\n')
console.log('Original password:', password)
console.log('URL encoded:     ', encoded)
console.log('\n✅ Use this in your DATABASE_URL:')
console.log(`DATABASE_URL=postgresql://postgres:${encoded}@db.qeqjowagaybaejjyqjkg.supabase.co:5432/postgres\n`)

