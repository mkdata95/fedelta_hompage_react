'use client'

import { useState } from 'react'
// import { siteContent } from '../../data/siteContent'
import { FiPlus, FiTrash2, FiEdit2, FiCode, FiSmartphone, FiCloud, FiBox } from 'react-icons/fi'
import { IconType } from 'react-icons'

const iconMap: { [key: string]: IconType } = {
  FiCode,
  FiSmartphone,
  FiCloud,
  FiBox
}

// 임시 데이터
const defaultContent = {
  services: {
    title: '서비스 섹션',
    items: [
      { id: 'service-1', title: '서비스1', description: '설명1', icon: 'FiBox' },
      { id: 'service-2', title: '서비스2', description: '설명2', icon: 'FiCode' }
    ]
  }
};

export default function ServicesPage() {
  // const [content, setContent] = useState(siteContent)
  const [content, setContent] = useState(defaultContent)
  const [isSaving, setIsSaving] = useState(false)
  const [saveMessage, setSaveMessage] = useState('')
  const [editingIndex, setEditingIndex] = useState<number | null>(null)

  const handleSave = async () => {
    setIsSaving(true)
    setSaveMessage('저장 중...')
    
    try {
      const response = await fetch('/api/save-content', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(content),
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

  const addService = () => {
    setContent(prev => ({
      ...prev,
      services: {
        ...prev.services,
        items: [
          ...prev.services.items,
          {
            id: `service-${Date.now()}`,
            title: '',
            description: '',
            icon: 'FiBox'
          }
        ]
      }
    }))
    setEditingIndex(content.services.items.length)
  }

  const removeService = (index: number) => {
    if (window.confirm('정말로 이 서비스를 삭제하시겠습니까?')) {
      setContent(prev => ({
        ...prev,
        services: {
          ...prev.services,
          items: prev.services.items.filter((_, i) => i !== index)
        }
      }))
    }
  }

  const updateService = (index: number, field: string, value: string) => {
    setContent(prev => ({
      ...prev,
      services: {
        ...prev.services,
        items: prev.services.items.map((item, i) => 
          i === index ? { ...item, [field]: value } : item
        )
      }
    }))
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">서비스 관리</h1>
        <button
          onClick={handleSave}
          disabled={isSaving}
          className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50"
        >
          {isSaving ? '저장 중...' : '저장하기'}
        </button>
      </div>

      {saveMessage && (
        <div className="mb-6 p-4 bg-green-100 text-green-700 rounded-lg">
          {saveMessage}
        </div>
      )}

      <div className="bg-white rounded-xl shadow-lg p-6 space-y-8">
        {/* 섹션 제목 */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">섹션 제목</label>
          <input
            type="text"
            value={content.services.title}
            onChange={(e) => {
              setContent(prev => ({
                ...prev,
                services: { ...prev.services, title: e.target.value }
              }))
            }}
            className="w-full px-4 py-2 border rounded-lg"
          />
        </div>

        {/* 서비스 목록 */}
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold text-gray-900">서비스 목록</h2>
            <button
              onClick={addService}
              className="flex items-center gap-2 text-blue-600 hover:text-blue-700"
            >
              <FiPlus /> 새 서비스 추가
            </button>
          </div>

          <div className="space-y-4">
            {content.services.items.map((service, index) => (
              <div key={service.id} className="border rounded-lg p-4">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-lg font-medium text-gray-900">
                    서비스 {index + 1}
                  </h3>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setEditingIndex(editingIndex === index ? null : index)}
                      className="text-blue-600 hover:text-blue-700"
                    >
                      <FiEdit2 />
                    </button>
                    <button
                      onClick={() => removeService(index)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <FiTrash2 />
                    </button>
                  </div>
                </div>

                {editingIndex === index ? (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        서비스 제목
                      </label>
                      <input
                        type="text"
                        value={service.title}
                        onChange={(e) => updateService(index, 'title', e.target.value)}
                        className="w-full px-4 py-2 border rounded-lg"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        서비스 설명
                      </label>
                      <textarea
                        value={service.description}
                        onChange={(e) => updateService(index, 'description', e.target.value)}
                        className="w-full px-4 py-2 border rounded-lg"
                        rows={3}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        아이콘 (react-icons 이름)
                      </label>
                      <input
                        type="text"
                        value={service.icon}
                        onChange={(e) => updateService(index, 'icon', e.target.value)}
                        className="w-full px-4 py-2 border rounded-lg"
                        placeholder="예: FiBox, FiCode, FiServer"
                      />
                    </div>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <h4 className="font-medium text-gray-900">{service.title}</h4>
                    <p className="text-gray-600">{service.description}</p>
                    <p className="text-sm text-gray-500">아이콘: {service.icon}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* 미리보기 */}
        <div className="mt-8">
          <h3 className="text-lg font-medium text-gray-900 mb-4">전체 미리보기</h3>
          <div className="bg-gray-50 rounded-xl p-8">
            <h2 className="text-3xl font-bold text-center mb-12">{content.services.title}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {content.services.items.map((service) => {
                const Icon = iconMap[service.icon] || FiBox
                return (
                  <div key={service.id} className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow">
                    <div className="text-blue-600 text-3xl mb-4">
                      <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                        <Icon size={24} />
                      </div>
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">
                      {service.title}
                    </h3>
                    <p className="text-gray-600">
                      {service.description}
                    </p>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 