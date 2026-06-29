import { supabase } from '@/services/supabaseClient'

// Schema assumption: public.categories(id, name, created_at)
// — id: primary key
// — name: unique text, not null

function mapCategory(row) {
  return { id: row.id, name: row.name }
}

export async function getCategories() {
  const { data, error } = await supabase
    .from('categories')
    .select('id, name')
    .order('name', { ascending: true })
  if (error) throw error
  return data.map(mapCategory)
}

export async function addCategory(name) {
  const trimmed = String(name ?? '').trim()
  if (!trimmed) throw new Error('Category name is required')
  const { data, error } = await supabase
    .from('categories')
    .insert({ name: trimmed })
    .select('id, name')
    .single()
  if (error) throw error
  return mapCategory(data)
}

export async function updateCategory(id, name) {
  const trimmed = String(name ?? '').trim()
  if (!trimmed) throw new Error('Category name is required')
  const { data, error } = await supabase
    .from('categories')
    .update({ name: trimmed })
    .eq('id', id)
    .select('id, name')
    .single()
  if (error) throw error
  return mapCategory(data)
}

export async function deleteCategory(id) {
  const { error } = await supabase
    .from('categories')
    .delete()
    .eq('id', id)
  if (error) throw error
}
