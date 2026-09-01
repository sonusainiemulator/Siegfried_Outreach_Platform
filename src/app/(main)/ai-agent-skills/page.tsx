'use client'

import React, { useState } from 'react'
import {
  useGetHermesSkillsQuery,
  useCreateHermesSkillMutation,
  useUpdateHermesSkillMutation,
  useDeleteHermesSkillMutation,
} from '@/redux/api/hermesSkillApi'
import { Plus, Edit, Trash2 } from 'lucide-react'

export default function HermesSkillsAdminPage() {
  const { data: response, isLoading } = useGetHermesSkillsQuery({})
  const [createSkill] = useCreateHermesSkillMutation()
  const [updateSkill] = useUpdateHermesSkillMutation()
  const [deleteSkill] = useDeleteHermesSkillMutation()

  const [isModalOpen, setIsModalOpen] = useState(false)
  const [formData, setFormData] = useState({
    id: '',
    name: '',
    description: '',
    systemPrompt: '',
    parameters: '',
    category: 'Content Generation',
  })

  const handleOpen = (skill: any = null) => {
    if (skill) {
      setFormData({
        id: skill.id,
        name: skill.name,
        description: skill.description,
        systemPrompt: skill.systemPrompt,
        parameters: skill.parameters?.join(', ') || '',
        category: skill.category,
      })
    } else {
      setFormData({
        id: '',
        name: '',
        description: '',
        systemPrompt: '',
        parameters: '',
        category: 'Content Generation',
      })
    }
    setIsModalOpen(true)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const payload = {
      ...formData,
      parameters: formData.parameters.split(',').map((p) => p.trim()).filter(Boolean),
    }

    if (formData.id) {
      await updateSkill(payload)
    } else {
      await createSkill(payload)
    }
    setIsModalOpen(false)
  }

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this skill?')) {
      await deleteSkill(id)
    }
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Hermes Agent Skills Library</h1>
        <button
          onClick={() => handleOpen()}
          className="bg-blue-600 text-white px-4 py-2 rounded flex items-center gap-2"
        >
          <Plus size={16} /> Add Skill
        </button>
      </div>

      {isLoading ? (
        <p>Loading skills...</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {response?.data?.map((skill: any) => (
            <div key={skill.id} className="border p-4 rounded bg-white shadow">
              <div className="flex justify-between items-start">
                <h3 className="font-bold text-lg">{skill.name}</h3>
                <div className="flex gap-2 text-gray-500">
                  <button onClick={() => handleOpen(skill)}><Edit size={16} /></button>
                  <button onClick={() => handleDelete(skill.id)}><Trash2 size={16} className="text-red-500" /></button>
                </div>
              </div>
              <span className="inline-block px-2 py-1 bg-gray-100 text-xs rounded mt-2">{skill.category}</span>
              <p className="mt-2 text-sm text-gray-600">{skill.description}</p>
            </div>
          ))}
        </div>
      )}

      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg p-6 w-full max-w-lg">
            <h2 className="text-xl font-bold mb-4">{formData.id ? 'Edit' : 'Add'} Hermes Skill</h2>
            <form onSubmit={handleSubmit} className="space-y-4 text-black">
              <div>
                <label className="block text-sm font-medium">Name</label>
                <input required value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} className="w-full border p-2 rounded" />
              </div>
              <div>
                <label className="block text-sm font-medium">Category</label>
                <select value={formData.category} onChange={(e) => setFormData({ ...formData, category: e.target.value })} className="w-full border p-2 rounded">
                  <option>Content Generation</option>
                  <option>Competitor Research</option>
                  <option>Customer Support</option>
                  <option>Sales</option>
                  <option>Other</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium">Description</label>
                <textarea required value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} className="w-full border p-2 rounded" />
              </div>
              <div>
                <label className="block text-sm font-medium">System Prompt</label>
                <textarea required rows={4} value={formData.systemPrompt} onChange={(e) => setFormData({ ...formData, systemPrompt: e.target.value })} className="w-full border p-2 rounded" />
              </div>
              <div>
                <label className="block text-sm font-medium">Parameters (comma separated)</label>
                <input placeholder="e.g. niche, target_audience" value={formData.parameters} onChange={(e) => setFormData({ ...formData, parameters: e.target.value })} className="w-full border p-2 rounded" />
              </div>
              <div className="flex justify-end gap-2 mt-6">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 border rounded">Cancel</button>
                <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded">Save Skill</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
