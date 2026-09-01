'use client'

import React from 'react'
import {
  useGetHermesSkillsQuery,
  useAssignHermesSkillMutation,
} from '@/redux/api/hermesSkillApi'
import { useGetUserSettingsQuery } from '@/redux/api/userSettingApi'
import { Check, Plus } from 'lucide-react'

export default function UserSkillsList() {
  const { data: skillsResponse, isLoading: isLoadingSkills } = useGetHermesSkillsQuery({ isActive: true })
  const { data: userSettingsResponse } = useGetUserSettingsQuery({})
  const [assignSkill, { isLoading: isAssigning }] = useAssignHermesSkillMutation()

  const skills = skillsResponse?.data || []
  const activeSkills = userSettingsResponse?.data?.activeHermesSkills || []

  const handleToggle = async (skillId: string, isCurrentlyActive: boolean) => {
    await assignSkill({ skillId, enable: !isCurrentlyActive })
  }

  if (isLoadingSkills) {
    return <p className="text-gray-500">Loading available AI agent skills...</p>
  }

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-bold">Available Hermes AI Skills</h3>
      <p className="text-sm text-gray-500 mb-6">Select the readymade skills you want your 24/7 autonomous agent to use.</p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {skills.map((skill: any) => {
          const isCurrentlyActive = activeSkills.includes(skill.id)
          return (
            <div key={skill.id} className={`border rounded-lg p-5 transition-all ${isCurrentlyActive ? 'border-blue-500 bg-blue-50/10' : 'border-gray-200 bg-white'}`}>
              <div className="flex justify-between items-start">
                <div>
                  <h4 className="font-semibold text-lg text-gray-900">{skill.name}</h4>
                  <span className="inline-block px-2 py-1 bg-gray-100 text-xs text-gray-600 rounded mt-1">
                    {skill.category}
                  </span>
                </div>
                <button
                  disabled={isAssigning}
                  onClick={() => handleToggle(skill.id, isCurrentlyActive)}
                  className={`flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-semibold ${
                    isCurrentlyActive
                      ? 'bg-blue-100 text-blue-700 hover:bg-blue-200'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {isCurrentlyActive ? <><Check size={14} /> Active</> : <><Plus size={14} /> Assign</>}
                </button>
              </div>
              <p className="mt-3 text-sm text-gray-600 leading-relaxed">{skill.description}</p>
            </div>
          )
        })}
        {skills.length === 0 && (
          <p className="text-gray-500 italic">No readymade skills available yet. Check back later!</p>
        )}
      </div>
    </div>
  )
}
