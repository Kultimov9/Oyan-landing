import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

// detectSessionInUrl (по умолчанию true) сам парсит recovery-токен из хэша
// ссылки, по которой пришёл пользователь со страницы сброса пароля.
export const supabase = createClient(supabaseUrl, supabaseAnonKey)
