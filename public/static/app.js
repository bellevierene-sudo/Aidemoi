// Translations
const translations = {
  en: {
    heroTitle: 'Find Local Services Near You',
    heroSubtitle: 'Connect with professionals and amateurs offering quality services in your area',
    subscriptionText: '$20/month subscription',
    subscribeBtn: 'Subscribe $20/mo',
    labelCategory: 'Category',
    labelCity: 'City',
    labelCountry: 'Country',
    labelType: 'Type',
    searchBtnText: 'Search Services',
    resultsTitle: 'Available Services',
    statsProvidersLabel: 'Service Providers',
    statsServicesLabel: 'Available Services',
    statsUsersLabel: 'Active Users',
    footerRights: 'All rights reserved.',
    footerTagline: 'Connecting communities through trusted services',
    professional: 'Professional',
    amateur: 'Amateur',
    hourly: 'Hourly',
    fixed: 'Fixed Price',
    both: 'Hourly or Fixed',
    verified: 'Verified',
    reviews: 'reviews',
    viewDetails: 'View Details',
    noResults: 'No services found. Try adjusting your search filters.'
  },
  fr: {
    heroTitle: 'Trouvez des Services Locaux Près de Chez Vous',
    heroSubtitle: 'Connectez-vous avec des professionnels et amateurs offrant des services de qualité dans votre région',
    subscriptionText: 'Abonnement 20$/mois',
    subscribeBtn: 'S\'abonner 20$/mois',
    labelCategory: 'Catégorie',
    labelCity: 'Ville',
    labelCountry: 'Pays',
    labelType: 'Type',
    searchBtnText: 'Rechercher des Services',
    resultsTitle: 'Services Disponibles',
    statsProvidersLabel: 'Prestataires de Services',
    statsServicesLabel: 'Services Disponibles',
    statsUsersLabel: 'Utilisateurs Actifs',
    footerRights: 'Tous droits réservés.',
    footerTagline: 'Connecter les communautés grâce à des services de confiance',
    professional: 'Professionnel',
    amateur: 'Amateur',
    hourly: 'À l\'heure',
    fixed: 'Prix Fixe',
    both: 'À l\'heure ou Fixe',
    verified: 'Vérifié',
    reviews: 'avis',
    viewDetails: 'Voir les Détails',
    noResults: 'Aucun service trouvé. Essayez d\'ajuster vos filtres de recherche.'
  }
}

let currentLang = 'en'

// Translate UI
function translateUI(lang) {
  currentLang = lang
  const t = translations[lang]
  
  document.getElementById('heroTitle').textContent = t.heroTitle
  document.getElementById('heroSubtitle').textContent = t.heroSubtitle
  document.getElementById('subscriptionText').textContent = t.subscriptionText
  document.getElementById('subscribeBtn').textContent = t.subscribeBtn
  document.getElementById('labelCategory').textContent = t.labelCategory
  document.getElementById('labelCity').textContent = t.labelCity
  document.getElementById('labelCountry').textContent = t.labelCountry
  document.getElementById('labelType').textContent = t.labelType
  document.getElementById('searchBtnText').textContent = t.searchBtnText
  document.getElementById('resultsTitle').textContent = t.resultsTitle
  document.getElementById('statsProvidersLabel').textContent = t.statsProvidersLabel
  document.getElementById('statsServicesLabel').textContent = t.statsServicesLabel
  document.getElementById('statsUsersLabel').textContent = t.statsUsersLabel
  document.getElementById('footerRights').textContent = t.footerRights
  document.getElementById('footerTagline').textContent = t.footerTagline
  
  // Update type filter options
  const typeFilter = document.getElementById('typeFilter')
  typeFilter.options[1].text = t.professional
  typeFilter.options[2].text = t.amateur
  
  // Reload categories and search results
  loadCategories()
  searchServices()
}

// Load categories
async function loadCategories() {
  try {
    const response = await axios.get(`/api/categories?lang=${currentLang}`)
    const categorySelect = document.getElementById('categoryFilter')
    
    // Keep "All Categories" option
    const allOption = categorySelect.options[0].text
    categorySelect.innerHTML = `<option value="">${allOption}</option>`
    
    response.data.categories.forEach(cat => {
      const option = document.createElement('option')
      option.value = cat.id
      option.textContent = `${cat.icon} ${cat.name}`
      categorySelect.appendChild(option)
    })
  } catch (error) {
    console.error('Error loading categories:', error)
  }
}

// Load stats
async function loadStats() {
  try {
    const response = await axios.get('/api/stats')
    const stats = response.data.stats
    
    document.getElementById('statsProviders').textContent = stats.providers
    document.getElementById('statsServices').textContent = stats.services
    document.getElementById('statsUsers').textContent = stats.active_users
  } catch (error) {
    console.error('Error loading stats:', error)
  }
}

// Search services
async function searchServices() {
  const category = document.getElementById('categoryFilter').value
  const city = document.getElementById('cityFilter').value
  const country = document.getElementById('countryFilter').value
  const type = document.getElementById('typeFilter').value
  
  const params = new URLSearchParams()
  params.append('lang', currentLang)
  if (category) params.append('category', category)
  if (city) params.append('city', city)
  if (country) params.append('country', country)
  if (type) params.append('type', type)
  
  try {
    const response = await axios.get(`/api/search?${params.toString()}`)
    displayResults(response.data.results)
  } catch (error) {
    console.error('Error searching services:', error)
  }
}

// Display search results
function displayResults(results) {
  const container = document.getElementById('resultsContainer')
  const t = translations[currentLang]
  
  if (!results || results.length === 0) {
    container.innerHTML = `
      <div class="col-span-full text-center py-12">
        <i class="fas fa-search text-gray-300 text-6xl mb-4"></i>
        <p class="text-gray-500 text-lg">${t.noResults}</p>
      </div>
    `
    return
  }
  
  container.innerHTML = results.map(service => `
    <div class="bg-white rounded-lg shadow-lg p-6 card-hover">
      <div class="flex justify-between items-start mb-4">
        <div>
          <h4 class="text-xl font-bold text-gray-800">${service.service_title}</h4>
          <p class="text-sm text-gray-500">${service.category_name}</p>
        </div>
        ${service.verified ? `<span class="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full"><i class="fas fa-check-circle"></i> ${t.verified}</span>` : ''}
      </div>
      
      <div class="mb-4">
        <div class="flex items-center text-gray-700 mb-2">
          <i class="fas fa-user mr-2"></i>
          <span class="font-semibold">${service.provider_name}</span>
          <span class="ml-2 text-xs px-2 py-1 rounded-full ${service.profile_type === 'professional' ? 'bg-blue-100 text-blue-800' : 'bg-yellow-100 text-yellow-800'}">
            ${service.profile_type === 'professional' ? t.professional : t.amateur}
          </span>
        </div>
        <div class="flex items-center text-gray-600 text-sm mb-2">
          <i class="fas fa-map-marker-alt mr-2"></i>
          <span>${service.city}, ${service.country}</span>
        </div>
        <div class="flex items-center text-gray-600 text-sm">
          <i class="fas fa-star text-yellow-400 mr-2"></i>
          <span>${service.rating.toFixed(1)} (${service.total_reviews} ${t.reviews})</span>
        </div>
      </div>
      
      <p class="text-gray-600 text-sm mb-4 line-clamp-2">${service.service_description || ''}</p>
      
      <div class="border-t pt-4 mb-4">
        <div class="flex justify-between items-center">
          <span class="text-gray-600 text-sm">${t[service.pricing_type] || service.pricing_type}</span>
          <div class="text-right">
            ${service.hourly_rate ? `<div class="text-lg font-bold text-purple-600">${service.currency} ${service.hourly_rate}/hr</div>` : ''}
            ${service.fixed_price ? `<div class="text-lg font-bold text-purple-600">${service.currency} ${service.fixed_price}</div>` : ''}
          </div>
        </div>
      </div>
      
      <button onclick="viewProvider(${service.provider_id})" class="w-full bg-purple-600 text-white py-2 rounded-lg hover:bg-purple-700 transition">
        <i class="fas fa-eye mr-2"></i>${t.viewDetails}
      </button>
    </div>
  `).join('')
}

// View provider details (placeholder)
function viewProvider(id) {
  alert(`Provider details for ID: ${id}\n\nThis will show full profile, all services, reviews, and contact information.\n\nNote: Full implementation requires subscription check.`)
}

// Event listeners
document.getElementById('langSelect').addEventListener('change', (e) => {
  translateUI(e.target.value)
})

document.getElementById('searchBtn').addEventListener('click', searchServices)

// Search on Enter key in filter inputs
document.getElementById('cityFilter').addEventListener('keypress', (e) => {
  if (e.key === 'Enter') searchServices()
})

document.getElementById('countryFilter').addEventListener('keypress', (e) => {
  if (e.key === 'Enter') searchServices()
})

// Subscribe button (placeholder)
document.getElementById('subscribeBtn').addEventListener('click', () => {
  alert('Subscription flow:\n\n1. User creates account\n2. Stripe Checkout for $20 USD\n3. Webhook updates subscription status\n4. Access granted to search and contact providers\n\nThis requires Stripe API integration.')
})

// Initialize
document.addEventListener('DOMContentLoaded', () => {
  loadCategories()
  loadStats()
  searchServices()
})
