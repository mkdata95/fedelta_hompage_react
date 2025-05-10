'use client'

import { useState } from 'react'
import { siteContent } from '../../data/siteContent'

interface FormField {
  label: string;
  placeholder: string;
}

interface ContactForm {
  name: FormField;
  email: FormField;
  message: FormField;
  submit: string;
}

interface ContactContent {
  title: string;
  form: ContactForm;
}

interface SiteContent {
  contact: ContactContent;
  [key: string]: ContactContent | unknown;
}

export default function ContactPage() {
  const [content, setContent] = useState<SiteContent>(siteContent)
  const [isSaving, setIsSaving] = useState(false)
  const [saveMessage, setSaveMessage] = useState('')

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

  const updateFormField = (field: keyof ContactForm, key: keyof FormField | 'submit', value: string) => {
    if (field === 'submit') {
      setContent(prev => ({
        ...prev,
        contact: {
          ...prev.contact,
          form: {
            ...prev.contact.form,
            submit: value
          }
        }
      }))
      return
    }

    setContent(prev => ({
      ...prev,
      contact: {
        ...prev.contact,
        form: {
          ...prev.contact.form,
          [field]: {
            ...prev.contact.form[field] as FormField,
            [key]: value
          }
        }
      }
    }))
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">문의 관리</h1>
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
            value={content.contact.title}
            onChange={(e) => {
              setContent(prev => ({
                ...prev,
                contact: { ...prev.contact, title: e.target.value }
              }))
            }}
            className="w-full px-4 py-2 border rounded-lg"
          />
        </div>

        {/* 폼 필드 관리 */}
        <div className="space-y-6">
          <h2 className="text-xl font-semibold text-gray-900">폼 필드 관리</h2>
          
          {/* 이름 필드 */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-900">이름 필드</h3>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">라벨</label>
              <input
                type="text"
                value={content.contact.form.name.label}
                onChange={(e) => updateFormField('name', 'label', e.target.value)}
                className="w-full px-4 py-2 border rounded-lg"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">플레이스홀더</label>
              <input
                type="text"
                value={content.contact.form.name.placeholder}
                onChange={(e) => updateFormField('name', 'placeholder', e.target.value)}
                className="w-full px-4 py-2 border rounded-lg"
              />
            </div>
          </div>

          {/* 이메일 필드 */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-900">이메일 필드</h3>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">라벨</label>
              <input
                type="text"
                value={content.contact.form.email.label}
                onChange={(e) => updateFormField('email', 'label', e.target.value)}
                className="w-full px-4 py-2 border rounded-lg"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">플레이스홀더</label>
              <input
                type="text"
                value={content.contact.form.email.placeholder}
                onChange={(e) => updateFormField('email', 'placeholder', e.target.value)}
                className="w-full px-4 py-2 border rounded-lg"
              />
            </div>
          </div>

          {/* 메시지 필드 */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-900">메시지 필드</h3>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">라벨</label>
              <input
                type="text"
                value={content.contact.form.message.label}
                onChange={(e) => updateFormField('message', 'label', e.target.value)}
                className="w-full px-4 py-2 border rounded-lg"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">플레이스홀더</label>
              <input
                type="text"
                value={content.contact.form.message.placeholder}
                onChange={(e) => updateFormField('message', 'placeholder', e.target.value)}
                className="w-full px-4 py-2 border rounded-lg"
              />
            </div>
          </div>

          {/* 제출 버튼 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">제출 버튼 텍스트</label>
            <input
              type="text"
              value={content.contact.form.submit}
              onChange={(e) => updateFormField('submit', 'submit', e.target.value)}
              className="w-full px-4 py-2 border rounded-lg"
            />
          </div>
        </div>

        {/* 미리보기 */}
        <div className="mt-8">
          <h3 className="text-lg font-medium text-gray-900 mb-4">전체 미리보기</h3>
          <div className="bg-gray-50 rounded-xl p-8">
            <h2 className="text-3xl font-bold text-center mb-12">{content.contact.title}</h2>
            <form className="max-w-lg mx-auto space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {content.contact.form.name.label}
                </label>
                <input
                  type="text"
                  placeholder={content.contact.form.name.placeholder}
                  className="w-full px-4 py-2 border rounded-lg"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {content.contact.form.email.label}
                </label>
                <input
                  type="email"
                  placeholder={content.contact.form.email.placeholder}
                  className="w-full px-4 py-2 border rounded-lg"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {content.contact.form.message.label}
                </label>
                <textarea
                  placeholder={content.contact.form.message.placeholder}
                  className="w-full px-4 py-2 border rounded-lg"
                  rows={4}
                />
              </div>
              <button
                type="submit"
                className="w-full bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700"
              >
                {content.contact.form.submit}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
} 