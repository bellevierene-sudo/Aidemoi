import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { serveStatic } from 'hono/cloudflare-workers'

type Bindings = {
  DB: D1Database;
}

const app = new Hono<{ Bindings: Bindings }>()

// Enable CORS for API routes
app.use('/api/*', cors())

// Serve static files
app.use('/static/*', serveStatic({ root: './public' }))

// ============================================
// API Routes - Categories
// ============================================
app.get('/api/categories', async (c) => {
  const { env } = c
  const lang = c.req.query('lang') || 'en'
  
  const result = await env.DB.prepare(`
    SELECT id, 
           ${lang === 'fr' ? 'name_fr' : 'name_en'} as name, 
           icon 
    FROM categories 
    ORDER BY name
  `).all()
  
  return c.json({ success: true, categories: result.results })
})

// ============================================
// API Routes - Search Providers/Services
// ============================================
app.get('/api/search', async (c) => {
  const { env } = c
  const lang = c.req.query('lang') || 'en'
  const city = c.req.query('city')
  const country = c.req.query('country')
  const category = c.req.query('category')
  const profile_type = c.req.query('type') // 'amateur' or 'professional'
  
  let query = `
    SELECT 
      p.id as provider_id,
      p.name as provider_name,
      p.email,
      p.phone,
      p.bio,
      p.profile_type,
      p.city,
      p.country,
      p.address,
      p.rating,
      p.total_reviews,
      p.verified,
      s.id as service_id,
      ${lang === 'fr' ? 's.title_fr' : 's.title_en'} as service_title,
      ${lang === 'fr' ? 's.description_fr' : 's.description_en'} as service_description,
      s.pricing_type,
      s.hourly_rate,
      s.fixed_price,
      s.currency,
      ${lang === 'fr' ? 'c.name_fr' : 'c.name_en'} as category_name
    FROM services s
    JOIN providers p ON s.provider_id = p.id
    JOIN categories c ON s.category_id = c.id
    WHERE s.available = 1
  `
  
  const params = []
  
  if (city) {
    query += ` AND LOWER(p.city) LIKE LOWER(?)`
    params.push(`%${city}%`)
  }
  
  if (country) {
    query += ` AND LOWER(p.country) LIKE LOWER(?)`
    params.push(`%${country}%`)
  }
  
  if (category) {
    query += ` AND s.category_id = ?`
    params.push(category)
  }
  
  if (profile_type) {
    query += ` AND p.profile_type = ?`
    params.push(profile_type)
  }
  
  query += ` ORDER BY p.rating DESC, p.total_reviews DESC`
  
  const stmt = env.DB.prepare(query)
  const result = await stmt.bind(...params).all()
  
  return c.json({ success: true, results: result.results, count: result.results.length })
})

// ============================================
// API Routes - Provider Details
// ============================================
app.get('/api/providers/:id', async (c) => {
  const { env } = c
  const id = c.req.param('id')
  const lang = c.req.query('lang') || 'en'
  
  // Get provider info
  const provider = await env.DB.prepare(`
    SELECT * FROM providers WHERE id = ?
  `).bind(id).first()
  
  if (!provider) {
    return c.json({ success: false, error: 'Provider not found' }, 404)
  }
  
  // Get provider services
  const services = await env.DB.prepare(`
    SELECT 
      s.id,
      ${lang === 'fr' ? 's.title_fr' : 's.title_en'} as title,
      ${lang === 'fr' ? 's.description_fr' : 's.description_en'} as description,
      s.pricing_type,
      s.hourly_rate,
      s.fixed_price,
      s.currency,
      s.available,
      ${lang === 'fr' ? 'c.name_fr' : 'c.name_en'} as category
    FROM services s
    JOIN categories c ON s.category_id = c.id
    WHERE s.provider_id = ?
  `).bind(id).all()
  
  // Get reviews
  const reviews = await env.DB.prepare(`
    SELECT 
      r.rating,
      r.comment,
      r.created_at,
      u.name as user_name
    FROM reviews r
    LEFT JOIN users u ON r.user_id = u.id
    WHERE r.service_id IN (SELECT id FROM services WHERE provider_id = ?)
    ORDER BY r.created_at DESC
    LIMIT 10
  `).bind(id).all()
  
  return c.json({
    success: true,
    provider,
    services: services.results,
    reviews: reviews.results
  })
})

// ============================================
// API Routes - User Authentication (Basic)
// ============================================
app.post('/api/auth/check-subscription', async (c) => {
  const { env } = c
  const { email } = await c.req.json()
  
  const user = await env.DB.prepare(`
    SELECT subscription_status, subscription_expires_at 
    FROM users 
    WHERE email = ?
  `).bind(email).first()
  
  if (!user) {
    return c.json({ success: false, subscribed: false })
  }
  
  const isActive = user.subscription_status === 'active' && 
                   new Date(user.subscription_expires_at) > new Date()
  
  return c.json({ 
    success: true, 
    subscribed: isActive,
    expires_at: user.subscription_expires_at
  })
})

// ============================================
// API Routes - Stats
// ============================================
app.get('/api/stats', async (c) => {
  const { env } = c
  
  const providers = await env.DB.prepare(`SELECT COUNT(*) as count FROM providers`).first()
  const services = await env.DB.prepare(`SELECT COUNT(*) as count FROM services WHERE available = 1`).first()
  const users = await env.DB.prepare(`SELECT COUNT(*) as count FROM users WHERE subscription_status = 'active'`).first()
  
  return c.json({
    success: true,
    stats: {
      providers: providers.count,
      services: services.count,
      active_users: users.count
    }
  })
})

// ============================================
// Homepage
// ============================================
app.get('/', (c) => {
  return c.html(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>AideMoi / HelpMe - Find Local Services</title>
        <script src="https://cdn.tailwindcss.com"></script>
        <link href="https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@6.4.0/css/all.min.css" rel="stylesheet">
        <style>
          .hero-gradient {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          }
          .card-hover {
            transition: transform 0.3s ease, box-shadow 0.3s ease;
          }
          .card-hover:hover {
            transform: translateY(-5px);
            box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
          }
        </style>
    </head>
    <body class="bg-gray-50">
        <!-- Navigation -->
        <nav class="bg-white shadow-lg">
            <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div class="flex justify-between h-16">
                    <div class="flex items-center">
                        <h1 class="text-2xl font-bold text-purple-600">
                            <i class="fas fa-hands-helping mr-2"></i>
                            AideMoi
                        </h1>
                    </div>
                    <div class="flex items-center space-x-4">
                        <select id="langSelect" class="bg-gray-100 px-3 py-2 rounded-lg">
                            <option value="en">🇬🇧 English</option>
                            <option value="fr">🇫🇷 Français</option>
                        </select>
                        <button class="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700">
                            <span id="subscribeBtn">Subscribe $20/mo</span>
                        </button>
                    </div>
                </div>
            </div>
        </nav>

        <!-- Hero Section -->
        <div class="hero-gradient text-white py-20">
            <div class="max-w-7xl mx-auto px-4 text-center">
                <h2 class="text-5xl font-bold mb-4" id="heroTitle">
                    Find Local Services Near You
                </h2>
                <p class="text-xl mb-8" id="heroSubtitle">
                    Connect with professionals and amateurs offering quality services in your area
                </p>
                <div class="bg-white text-gray-800 p-2 rounded-lg shadow-2xl inline-block">
                    <div class="flex items-center space-x-2">
                        <i class="fas fa-check-circle text-green-500 text-2xl"></i>
                        <span class="text-lg font-semibold" id="subscriptionText">$20/month subscription</span>
                    </div>
                </div>
            </div>
        </div>

        <!-- Search Section -->
        <div class="max-w-7xl mx-auto px-4 -mt-10">
            <div class="bg-white rounded-lg shadow-xl p-6">
                <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-2" id="labelCategory">Category</label>
                        <select id="categoryFilter" class="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500">
                            <option value="">All Categories</option>
                        </select>
                    </div>
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-2" id="labelCity">City</label>
                        <input type="text" id="cityFilter" placeholder="New York, Paris..." 
                               class="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500">
                    </div>
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-2" id="labelCountry">Country</label>
                        <input type="text" id="countryFilter" placeholder="USA, France..." 
                               class="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500">
                    </div>
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-2" id="labelType">Type</label>
                        <select id="typeFilter" class="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500">
                            <option value="">All</option>
                            <option value="professional">Professional</option>
                            <option value="amateur">Amateur</option>
                        </select>
                    </div>
                </div>
                <div class="mt-4">
                    <button id="searchBtn" class="w-full bg-purple-600 text-white py-3 rounded-lg font-semibold hover:bg-purple-700">
                        <i class="fas fa-search mr-2"></i>
                        <span id="searchBtnText">Search Services</span>
                    </button>
                </div>
            </div>
        </div>

        <!-- Stats Section -->
        <div class="max-w-7xl mx-auto px-4 py-12">
            <div class="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
                <div class="bg-white p-6 rounded-lg shadow-lg">
                    <div class="text-4xl font-bold text-purple-600" id="statsProviders">0</div>
                    <div class="text-gray-600 mt-2" id="statsProvidersLabel">Service Providers</div>
                </div>
                <div class="bg-white p-6 rounded-lg shadow-lg">
                    <div class="text-4xl font-bold text-purple-600" id="statsServices">0</div>
                    <div class="text-gray-600 mt-2" id="statsServicesLabel">Available Services</div>
                </div>
                <div class="bg-white p-6 rounded-lg shadow-lg">
                    <div class="text-4xl font-bold text-purple-600" id="statsUsers">0</div>
                    <div class="text-gray-600 mt-2" id="statsUsersLabel">Active Users</div>
                </div>
            </div>
        </div>

        <!-- Results Section -->
        <div class="max-w-7xl mx-auto px-4 py-12">
            <h3 class="text-3xl font-bold text-gray-800 mb-6" id="resultsTitle">Available Services</h3>
            <div id="resultsContainer" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <!-- Results will be loaded here -->
            </div>
        </div>

        <!-- Footer -->
        <footer class="bg-gray-800 text-white py-8 mt-12">
            <div class="max-w-7xl mx-auto px-4 text-center">
                <p>&copy; 2024 AideMoi / HelpMe. <span id="footerRights">All rights reserved.</span></p>
                <p class="mt-2 text-gray-400" id="footerTagline">Connecting communities through trusted services</p>
            </div>
        </footer>

        <script src="https://cdn.jsdelivr.net/npm/axios@1.6.0/dist/axios.min.js"></script>
        <script src="/static/app.js"></script>
    </body>
    </html>
  `)
})

export default app
