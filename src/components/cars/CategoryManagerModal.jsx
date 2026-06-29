import { useState, useEffect } from 'react'
import { Plus, Pencil, Trash2, Check, X, Tag } from 'lucide-react'
import toast from 'react-hot-toast'
import Modal from '@/components/ui/Modal'
import Button from '@/components/ui/Button'
import {
  getCategories,
  addCategory,
  updateCategory,
  deleteCategory,
} from '@/services/categoryService'

export default function CategoryManagerModal({ isOpen, onClose, onChange }) {
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(false)
  const [newName, setNewName] = useState('')
  const [busy, setBusy] = useState(false)
  // Per-row UI state: editingId/draft for inline edit; confirmDeleteId for delete
  const [editingId, setEditingId] = useState(null)
  const [editDraft, setEditDraft] = useState('')
  const [confirmDeleteId, setConfirmDeleteId] = useState(null)

  const load = async () => {
    setLoading(true)
    try {
      const data = await getCategories()
      setCategories(data)
    } catch (err) {
      toast.error(err.message || 'Failed to load categories')
    } finally {
      setLoading(false)
    }
  }

  // Load whenever the modal is opened.
  useEffect(() => {
    if (isOpen) load()
    else {
      // Reset transient UI state when closing
      setNewName('')
      setEditingId(null)
      setEditDraft('')
      setConfirmDeleteId(null)
    }
  }, [isOpen])

  const notifyParent = () => {
    if (typeof onChange === 'function') onChange()
  }

  const handleAdd = async (e) => {
    e.preventDefault()
    const name = newName.trim()
    if (!name) return
    setBusy(true)
    try {
      const created = await addCategory(name)
      setCategories((prev) =>
        [...prev, created].sort((a, b) => a.name.localeCompare(b.name)),
      )
      setNewName('')
      toast.success(`Added "${created.name}"`)
      notifyParent()
    } catch (err) {
      toast.error(err.message || 'Failed to add category')
    } finally {
      setBusy(false)
    }
  }

  const startEdit = (cat) => {
    setConfirmDeleteId(null)
    setEditingId(cat.id)
    setEditDraft(cat.name)
  }

  const cancelEdit = () => {
    setEditingId(null)
    setEditDraft('')
  }

  const saveEdit = async (id) => {
    const name = editDraft.trim()
    if (!name) return
    setBusy(true)
    try {
      const updated = await updateCategory(id, name)
      setCategories((prev) =>
        prev
          .map((c) => (c.id === id ? updated : c))
          .sort((a, b) => a.name.localeCompare(b.name)),
      )
      toast.success('Category renamed')
      cancelEdit()
      notifyParent()
    } catch (err) {
      toast.error(err.message || 'Failed to update category')
    } finally {
      setBusy(false)
    }
  }

  const askDelete = (id) => {
    cancelEdit()
    setConfirmDeleteId(id)
  }

  const cancelDelete = () => setConfirmDeleteId(null)

  const confirmDelete = async (id) => {
    setBusy(true)
    try {
      await deleteCategory(id)
      setCategories((prev) => prev.filter((c) => c.id !== id))
      toast.success('Category removed')
      setConfirmDeleteId(null)
      notifyParent()
    } catch (err) {
      toast.error(err.message || 'Failed to delete category')
    } finally {
      setBusy(false)
    }
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Manage Categories">
      <div className="space-y-5">
        {/* Add new category */}
        <form onSubmit={handleAdd} className="flex gap-2">
          <input
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            placeholder="New category name…"
            className="flex-1 bg-bg-input/90 border border-border-light/80 rounded-2xl px-4 py-2.5 text-sm text-white placeholder:text-gray-500 outline-none focus:border-accent/55 input-glow transition-all"
            disabled={busy}
          />
          <Button type="submit" size="sm" disabled={!newName.trim() || busy}>
            <Plus size={14} />
            Add
          </Button>
        </form>

        {/* List */}
        <div className="max-h-[50vh] overflow-y-auto -mx-1 px-1">
          {loading ? (
            <p className="text-center text-gray-600 text-sm py-6">Loading…</p>
          ) : categories.length === 0 ? (
            <div className="py-8 flex flex-col items-center text-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-white/[0.04] border border-white/[0.06] flex items-center justify-center">
                <Tag size={18} className="text-gray-600" />
              </div>
              <p className="text-gray-400 text-sm font-medium">No categories yet</p>
              <p className="text-gray-600 text-xs">
                Add one above to get started.
              </p>
            </div>
          ) : (
            <ul className="space-y-2">
              {categories.map((cat) => {
                const isEditing = editingId === cat.id
                const isConfirming = confirmDeleteId === cat.id
                return (
                  <li
                    key={cat.id}
                    className="bg-white/[0.02] border border-white/[0.05] rounded-2xl px-3 py-2 flex items-center gap-2"
                  >
                    {isEditing ? (
                      <>
                        <input
                          value={editDraft}
                          onChange={(e) => setEditDraft(e.target.value)}
                          autoFocus
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') { e.preventDefault(); saveEdit(cat.id) }
                            if (e.key === 'Escape') cancelEdit()
                          }}
                          className="flex-1 bg-bg-input/90 border border-accent/40 rounded-xl px-3 py-1.5 text-sm text-white outline-none"
                        />
                        <button
                          onClick={() => saveEdit(cat.id)}
                          disabled={!editDraft.trim() || busy}
                          aria-label="Save"
                          className="w-8 h-8 rounded-lg flex items-center justify-center text-success hover:bg-success/10 transition-colors bg-transparent border-none cursor-pointer disabled:opacity-40 disabled:cursor-default"
                        >
                          <Check size={14} />
                        </button>
                        <button
                          onClick={cancelEdit}
                          aria-label="Cancel"
                          className="w-8 h-8 rounded-lg flex items-center justify-center text-gray-500 hover:text-white hover:bg-white/[0.08] transition-colors bg-transparent border-none cursor-pointer"
                        >
                          <X size={14} />
                        </button>
                      </>
                    ) : isConfirming ? (
                      <>
                        <p className="flex-1 text-sm text-danger/90 truncate">
                          Delete &ldquo;{cat.name}&rdquo;?
                        </p>
                        <button
                          onClick={() => confirmDelete(cat.id)}
                          disabled={busy}
                          className="text-[11px] font-semibold px-2.5 py-1 rounded-lg bg-danger/[0.12] border border-danger/30 text-danger hover:bg-danger/[0.2] transition-colors cursor-pointer disabled:opacity-50"
                        >
                          Confirm
                        </button>
                        <button
                          onClick={cancelDelete}
                          className="text-[11px] font-semibold px-2.5 py-1 rounded-lg bg-white/[0.04] border border-white/[0.08] text-gray-400 hover:text-white transition-colors cursor-pointer"
                        >
                          Cancel
                        </button>
                      </>
                    ) : (
                      <>
                        <Tag size={13} className="text-accent/60 shrink-0 ml-1" />
                        <p className="flex-1 text-sm text-gray-200 truncate">{cat.name}</p>
                        <button
                          onClick={() => startEdit(cat)}
                          aria-label={`Edit ${cat.name}`}
                          className="w-8 h-8 rounded-lg flex items-center justify-center text-gray-500 hover:text-accent hover:bg-accent/[0.08] transition-colors bg-transparent border-none cursor-pointer"
                        >
                          <Pencil size={13} />
                        </button>
                        <button
                          onClick={() => askDelete(cat.id)}
                          aria-label={`Delete ${cat.name}`}
                          className="w-8 h-8 rounded-lg flex items-center justify-center text-gray-500 hover:text-danger hover:bg-danger/[0.08] transition-colors bg-transparent border-none cursor-pointer"
                        >
                          <Trash2 size={13} />
                        </button>
                      </>
                    )}
                  </li>
                )
              })}
            </ul>
          )}
        </div>

        <div className="pt-1">
          <Button variant="ghost" onClick={onClose} fullWidth>
            Done
          </Button>
        </div>
      </div>
    </Modal>
  )
}
