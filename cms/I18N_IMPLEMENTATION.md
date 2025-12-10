# i18n Implementation Status

## ✅ Completed

1. **Migration SQL** (`cms/prisma/migrations/add_i18n_support.sql`)
   - Added JSONB columns for all text fields
   - Migrated existing data to JSONB format with 'en' as default
   - Tables updated: `hero_content`, `experience`, `experience_bullets`, `projects`, `specializations`

2. **i18n Helper Functions** (`cms/src/lib/i18n/`)
   - `helpers.ts`: Core i18n utilities (getI18nText, mergeI18n, etc.)
   - `api-helpers.ts`: API-specific helpers (getLanguageFromRequest, transformI18nResponse)

3. **API Routes Updated**
   - ✅ Hero API (`/api/hero`): GET and PUT support i18n
   - ✅ Experience API (`/api/experience`): GET supports i18n
   - ⏳ Experience API: POST and PUT need i18n support
   - ⏳ Projects API: Needs i18n support
   - ⏳ Specializations API: Needs i18n support

## 🚧 In Progress / TODO

### 1. Complete API Routes
- [ ] Experience API POST: Accept i18n format for company, role, location, description, bullets
- [ ] Experience API PUT: Accept i18n format
- [ ] Experience API [id] GET/PUT: Support i18n
- [ ] Projects API GET/POST/PUT: Support i18n
- [ ] Specializations API GET/POST/PUT: Support i18n

### 2. CMS Forms
- [ ] HeroForm: Add language tabs/inputs (en/vi)
- [ ] ExperienceForm: Add language tabs/inputs
- [ ] ProjectForm: Add language tabs/inputs
- [ ] SpecializationForm: Add language tabs/inputs

### 3. Portfolio Frontend
- [ ] Update services to pass language parameter
- [ ] Update services to parse i18n data based on user's selected language
- [ ] Test with both languages

## 📝 How It Works

### Database Structure
Text fields are stored as JSONB:
```sql
company_i18n JSONB  -- {"en": "Hitek Software JSC", "vi": "Công ty Hitek"}
```

### API Request/Response
- **GET**: API detects language from query param `?lang=vi` or `Accept-Language` header
- **Response**: Returns plain text based on requested language
- **POST/PUT**: Accepts both formats:
  - i18n format: `{"company": {"en": "...", "vi": "..."}}`
  - Plain text (backward compatible): `{"company": "..."}`

### CMS Forms
Forms will have tabs or sections for each language, allowing users to input content in multiple languages.

### Portfolio Frontend
Services will pass the user's selected language to API, and API will return text in that language.

## 🔄 Migration Steps

1. **Run Migration SQL** on Supabase:
   ```sql
   -- Copy content from cms/prisma/migrations/add_i18n_support.sql
   -- Run in Supabase SQL Editor
   ```

2. **Deploy CMS** - API routes are backward compatible

3. **Update CMS Forms** - Add language inputs

4. **Update Portfolio** - Pass language parameter

## 📚 API Usage Examples

### GET with language
```javascript
// English (default)
fetch('/api/hero')

// Vietnamese
fetch('/api/hero?lang=vi')
// or
fetch('/api/hero', {
  headers: { 'Accept-Language': 'vi' }
})
```

### POST with i18n
```javascript
fetch('/api/experience', {
  method: 'POST',
  body: JSON.stringify({
    company: {
      en: "Hitek Software JSC",
      vi: "Công ty Hitek"
    },
    role: {
      en: "Junior Business Analyst",
      vi: "Phân tích nghiệp vụ cơ bản"
    },
    // ...
  })
})
```

