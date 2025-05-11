"use client"

import { useState } from 'react'
import { FiTrash2, FiEdit2, FiCheck, FiPlus } from 'react-icons/fi'

export default function CategoriesPage() {
  // siteContent.projects.categories를 대체할 임시 데이터
  const defaultCategories = ["카테고리1", "카테고리2", "카테고리3"];
  const [categories, setCategories] = useState(defaultCategories)
  const [isSaving, setIsSaving] = useState(false)
  const [saveMessage, setSaveMessage] = useState('')
  const [newCategory, setNewCategory] = useState('')
  const [editingIdx, setEditingIdx] = useState<number | null>(null)
  const [editingValue, setEditingValue] = useState('')

  // 카테고리 추가
  const handleAdd = () => {
    if (!newCategory.trim() || categories.includes(newCategory.trim())) return
    setCategories([...categories, newCategory.trim()])
    setNewCategory('')
  }

  // 카테고리 삭제
  const handleDelete = (idx: number) => {
    if (!window.confirm('정말로 삭제하시겠습니까?')) return
    setCategories(categories.filter((_, i) => i !== idx))
  }

  // 카테고리 이름 수정 시작
  const handleEditStart = (idx: number) => {
    setEditingIdx(idx)
    setEditingValue(categories[idx])
  }

  // 카테고리 이름 저장
  const handleEditSave = (idx: number) => {
    if (!editingValue.trim() || categories.includes(editingValue.trim())) return
    setCategories(categories.map((cat, i) => (i === idx ? editingValue.trim() : cat)))
    setEditingIdx(null)
    setEditingValue('')
  }

  // 저장
  const handleSave = async () => {
    setIsSaving(true)
    setSaveMessage('저장 중...')
    // siteContent를 대체하는 임시 newContent
    const newContent = {
      projects: {
        categories
      }
    }
    try {
      const response = await fetch('/api/save-content', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newContent),
      })
      if (response.ok) {
        setSaveMessage('저장되었습니다!')
      } else {
        setSaveMessage('저장에 실패했습니다.')
      }
    } catch {
      setSaveMessage('오류가 발생했습니다.')
    }
    setIsSaving(false)
    setTimeout(() => setSaveMessage(''), 3000)
  }

  return (
    <div className="max-w-xl mx-auto py-12">
      <h1 className="text-2xl font-bold mb-8">카테고리 관리</h1>
      <div className="mb-6 flex gap-2">
        <input
          type="text"
          value={newCategory}
          onChange={e => setNewCategory(e.target.value)}
          className="flex-1 px-4 py-2 border rounded-lg"
          placeholder="새 카테고리 입력"
        />
        <button onClick={handleAdd} className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center gap-1"><FiPlus />추가</button>
      </div>
      <ul className="space-y-2 mb-8">
        {categories.map((cat, idx) => (
          <li key={cat} className="flex items-center gap-2 bg-gray-50 rounded-lg px-4 py-2">
            {editingIdx === idx ? (
              <>
                <input
                  type="text"
                  value={editingValue}
                  onChange={e => setEditingValue(e.target.value)}
                  className="flex-1 px-2 py-1 border rounded"
                />
                <button onClick={() => handleEditSave(idx)} className="text-green-600"><FiCheck /></button>
              </>
            ) : (
              <>
                <span className="flex-1">{cat}</span>
                <button onClick={() => handleEditStart(idx)} className="text-blue-600"><FiEdit2 /></button>
              </>
            )}
            <button onClick={() => handleDelete(idx)} className="text-red-500"><FiTrash2 /></button>
          </li>
        ))}
      </ul>
      <button onClick={handleSave} disabled={isSaving} className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 font-semibold">{isSaving ? '저장 중...' : '저장하기'}</button>
      {saveMessage && <div className="mt-4 p-3 bg-green-100 text-green-700 rounded-lg">{saveMessage}</div>}
    </div>
  )
} 