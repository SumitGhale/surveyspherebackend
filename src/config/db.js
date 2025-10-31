import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.Supabase_Project_URL
const supabaseKey = process.env.Supabase_Api_Key
const supabase = createClient(supabaseUrl, supabaseKey)

export default supabase