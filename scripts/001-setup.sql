-- Settings table for admin-configurable values
CREATE TABLE IF NOT EXISTS settings (
  key TEXT PRIMARY KEY,
  value TEXT NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Applications table for storing submitted forms
CREATE TABLE IF NOT EXISTS applications (
  id SERIAL PRIMARY KEY,
  full_name TEXT NOT NULL,
  passport TEXT NOT NULL,
  address TEXT NOT NULL,
  phone TEXT NOT NULL,
  total_amount NUMERIC NOT NULL,
  installment_term INTEGER NOT NULL,
  down_payment NUMERIC NOT NULL,
  markup NUMERIC NOT NULL,
  monthly_payment NUMERIC NOT NULL,
  total_with_markup NUMERIC NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Admin password (default: admin123 - change in admin panel)
INSERT INTO settings (key, value) VALUES
  ('admin_password', 'admin123'),
  ('min_amount', '100000'),
  ('max_amount', '10000000'),
  ('min_term', '3'),
  ('max_term', '24'),
  ('default_markup', '10'),
  ('min_down_payment', '0'),
  ('max_down_payment', '50'),
  ('phone', '+998 90 123 45 67'),
  ('address', 'г. Ташкент, ул. Навои, д. 10'),
  ('work_hours', 'Пн-Пт: 9:00 - 18:00, Сб: 10:00 - 15:00'),
  ('company_name', 'РассрочкаПро')
ON CONFLICT (key) DO NOTHING;
