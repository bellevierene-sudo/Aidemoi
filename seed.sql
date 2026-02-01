-- Insert default categories
INSERT OR IGNORE INTO categories (id, name_en, name_fr, icon) VALUES 
  (1, 'Home Cleaning', 'Ménage', '🧹'),
  (2, 'Plumbing', 'Plomberie', '🔧'),
  (3, 'Electrical Work', 'Électricité', '⚡'),
  (4, 'Gardening', 'Jardinage', '🌱'),
  (5, 'Painting', 'Peinture', '🎨'),
  (6, 'Carpentry', 'Menuiserie', '🪚'),
  (7, 'Moving Services', 'Déménagement', '📦'),
  (8, 'Computer Repair', 'Réparation informatique', '💻'),
  (9, 'Pet Care', 'Garde d''animaux', '🐕'),
  (10, 'Tutoring', 'Tutorat', '📚'),
  (11, 'Home Renovation', 'Rénovation', '🏗️'),
  (12, 'Car Repair', 'Réparation automobile', '🚗');

-- Insert test users
INSERT OR IGNORE INTO users (id, email, password_hash, name, subscription_status, subscription_expires_at, preferred_language) VALUES 
  (1, 'john.doe@example.com', '$2a$10$test_hash_here', 'John Doe', 'active', datetime('now', '+30 days'), 'en'),
  (2, 'marie.dupont@example.com', '$2a$10$test_hash_here', 'Marie Dupont', 'active', datetime('now', '+30 days'), 'fr'),
  (3, 'test@example.com', '$2a$10$test_hash_here', 'Test User', 'inactive', NULL, 'en');

-- Insert test providers
INSERT OR IGNORE INTO providers (id, user_id, name, email, phone, bio, profile_type, address, city, country, latitude, longitude, rating, total_reviews, verified) VALUES 
  (1, 1, 'John''s Cleaning Services', 'john.doe@example.com', '+1-555-0101', 'Professional cleaning services with 10 years experience', 'professional', '123 Main St', 'New York', 'USA', 40.7128, -74.0060, 4.8, 24, TRUE),
  (2, 2, 'Marie Plomberie', 'marie.dupont@example.com', '+33-1-55-0102', 'Plombière professionnelle certifiée', 'professional', '45 Rue de la Paix', 'Paris', 'France', 48.8566, 2.3522, 4.9, 18, TRUE),
  (3, NULL, 'Bob''s Gardening', 'bob@example.com', '+1-555-0103', 'Amateur gardener, love plants!', 'amateur', '789 Oak Avenue', 'Los Angeles', 'USA', 34.0522, -118.2437, 4.5, 12, FALSE);

-- Insert test services
INSERT OR IGNORE INTO services (provider_id, category_id, title_en, title_fr, description_en, description_fr, pricing_type, hourly_rate, fixed_price, available) VALUES 
  (1, 1, 'Home Deep Cleaning', 'Ménage complet', 'Complete home cleaning service', 'Service de ménage complet', 'both', 35.00, 150.00, TRUE),
  (1, 1, 'Office Cleaning', 'Ménage de bureau', 'Professional office cleaning', 'Ménage professionnel de bureau', 'hourly', 40.00, NULL, TRUE),
  (2, 2, 'Emergency Plumbing', 'Plomberie d''urgence', 'Quick response plumbing services', 'Service de plomberie rapide', 'hourly', 65.00, NULL, TRUE),
  (2, 2, 'Bathroom Renovation', 'Rénovation salle de bain', 'Complete bathroom renovation', 'Rénovation complète de salle de bain', 'fixed', NULL, 2500.00, TRUE),
  (3, 4, 'Garden Maintenance', 'Entretien jardin', 'Weekly garden maintenance', 'Entretien hebdomadaire de jardin', 'hourly', 25.00, NULL, TRUE);

-- Insert test reviews
INSERT OR IGNORE INTO reviews (service_id, user_id, rating, comment) VALUES 
  (1, 2, 5, 'Excellent service! Very thorough and professional.'),
  (1, 3, 5, 'Best cleaning service I''ve used!'),
  (3, 1, 5, 'Quick response and fixed the problem immediately.'),
  (5, 1, 4, 'Good work, but could be more detail-oriented.');
