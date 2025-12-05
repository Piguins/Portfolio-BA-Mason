'use client'

import { useState, useEffect, useCallback } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { motion } from 'framer-motion'
import toast from 'react-hot-toast'
import { Loader2 } from 'lucide-react'
import { fetchWithAuth } from '@/lib/fetchWithAuth'
import BackButton from '@/components/BackButton'
import LoadingButton from '@/components/LoadingButton'
import { FormField, Input, Textarea } from '@/components/FormField'
import { cn } from '@/lib/utils'

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5, ease: 'easeOut' },
}

interface Project {
  id: string
  title: string
  slug: string
  description?: string
  content?: string
  thumbnail_url?: string
  demo_url?: string
  github_url?: string
  is_published: boolean
  order_index: number
  tags?: Array<{ id: number; name: string; color: string }>
}

interface ProjectTag {
  id: number
  name: string
  color: string
}

export default function EditProjectPage() {
  const router = useRouter()
  const params = useParams()
  const id = params.id as string

  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [tags, setTags] = useState<ProjectTag[]>([])
  const [loadingTags, setLoadingTags] = useState(true)
  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    description: '',
    content: '',
    thumbnail_url: '',
    demo_url: '',
    github_url: '',
    is_published: false,
    order_index: 0,
    tag_ids: [] as number[],
  })

  // Fetch all project tags for selection
  useEffect(() => {
    const fetchTags = async () => {
      try {
        const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000'
        const response = await fetch(`${API_URL}/api/projects?published=true`)
        if (response.ok) {
          const projects = await response.json()
          const allTags = new Map<number, ProjectTag>()
          projects.forEach((project: any) => {
            if (project.tags && Array.isArray(project.tags)) {
              project.tags.forEach((tag: ProjectTag) => {
                if (!allTags.has(tag.id)) {
                  allTags.set(tag.id, tag)
                }
              })
            }
          })
          setTags(Array.from(allTags.values()))
        }
      } catch (err) {
        // Failed to fetch tags - error already handled by catch block
        setTags([])
      } finally {
        setLoadingTags(false)
      }
    }
    fetchTags()
  }, [])

  const fetchProject = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000'
      const response = await fetch(`${API_URL}/api/projects/id/${id}`, {
        cache: 'no-store',
      })

      if (!response.ok) {
        throw new Error('Failed to fetch project')
      }

      const data: Project = await response.json()
      setFormData({
        title: data.title,
        slug: data.slug,
        description: data.description || '',
        content: data.content || '',
        thumbnail_url: data.thumbnail_url || '',
        demo_url: data.demo_url || '',
        github_url: data.github_url || '',
        is_published: data.is_published || false,
        order_index: data.order_index || 0,
        tag_ids: data.tags?.map((t) => t.id) || [],
      })
    } catch (err: any) {
      setError(err.message || 'Failed to load project')
    } finally {
      setLoading(false)
    }
  }, [id])

  useEffect(() => {
    if (id) {
      fetchProject()
    }
  }, [id, fetchProject])

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault()
      setSaving(true)
      setError(null)

      if (!formData.title || !formData.slug) {
        setError('Vui lòng điền đầy đủ Title và Slug.')
        setSaving(false)
        return
      }

      const payload = {
        ...formData,
        order_index: Number(formData.order_index),
      }

      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), 15000)

      try {
        const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000'
        const response = await fetchWithAuth(`${API_URL}/api/projects/${id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
          signal: controller.signal,
        })
        clearTimeout(timeoutId)

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}))
          throw new Error(errorData.error || errorData.message || 'Failed to update project')
        }

        toast.success('Project đã được cập nhật thành công!')
        router.replace('/dashboard/projects')
      } catch (err: any) {
        let errorMsg = 'Failed to update project'
        if (err.name === 'AbortError') {
          errorMsg = 'Yêu cầu cập nhật project đã hết thời gian. Vui lòng thử lại.'
        } else if (err.message) {
          errorMsg = err.message
        }
        setError(errorMsg)
        toast.error(errorMsg)
      } finally {
        setSaving(false)
      }
    },
    [formData, id, router]
  )

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 p-6 md:p-8 lg:p-12">
        <div className="max-w-4xl mx-auto flex flex-col items-center justify-center min-h-[60vh] gap-4 text-slate-500">
          <Loader2 className="w-10 h-10 animate-spin text-blue-600" />
          <p className="text-base">Đang tải dữ liệu Project...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-50 p-6 md:p-8 lg:p-12">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="mb-8 pb-6 border-b border-slate-200"
        >
          <div className="flex flex-col gap-4">
            <BackButton href="/dashboard/projects" />
            <div>
              <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-slate-900 mb-2">
                Sửa Project
              </h1>
              <p className="text-base text-slate-600 leading-relaxed">Cập nhật thông tin project</p>
            </div>
          </div>
        </motion.div>

        {/* Error Alert */}
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm"
          >
            {error}
          </motion.div>
        )}

        {/* Form */}
        <motion.form
          variants={fadeInUp}
          initial="initial"
          animate="animate"
          onSubmit={handleSubmit}
          className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 md:p-8"
        >
          {/* Basic Info */}
          <div className="mb-8 pb-8 border-b border-slate-100">
            <h3 className="text-xl font-semibold text-slate-900 mb-6 pb-2 border-b-2 border-blue-50 inline-block">
              Thông tin cơ bản
            </h3>
            <div className="space-y-4">
              <FormField label="Title" required>
                <Input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="Tên project"
                />
              </FormField>

              <FormField label="Slug" required>
                <Input
                  type="text"
                  required
                  value={formData.slug}
                  onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                  placeholder="project-slug"
                />
              </FormField>

              <FormField label="Order Index">
                <Input
                  type="number"
                  value={formData.order_index}
                  onChange={(e) =>
                    setFormData({ ...formData, order_index: parseInt(e.target.value) || 0 })
                  }
                />
              </FormField>
            </div>
          </div>

          {/* Content */}
          <div className="mb-8 pb-8 border-b border-slate-100">
            <h3 className="text-xl font-semibold text-slate-900 mb-6 pb-2 border-b-2 border-blue-50 inline-block">
              Nội dung
            </h3>
            <div className="space-y-4">
              <FormField label="Description">
                <Textarea
                  rows={3}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Mô tả ngắn về project..."
                />
              </FormField>

              <FormField label="Content">
                <Textarea
                  rows={8}
                  value={formData.content}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                  placeholder="Nội dung chi tiết về project (Markdown supported)..."
                />
              </FormField>
            </div>
          </div>

          {/* Links & Media */}
          <div className="mb-8 pb-8 border-b border-slate-100">
            <h3 className="text-xl font-semibold text-slate-900 mb-6 pb-2 border-b-2 border-blue-50 inline-block">
              Links & Media
            </h3>
            <div className="space-y-4">
              <FormField label="Thumbnail URL">
                <Input
                  type="url"
                  value={formData.thumbnail_url}
                  onChange={(e) => setFormData({ ...formData, thumbnail_url: e.target.value })}
                  placeholder="https://example.com/thumbnail.jpg"
                />
              </FormField>

              <FormField label="Demo URL">
                <Input
                  type="url"
                  value={formData.demo_url}
                  onChange={(e) => setFormData({ ...formData, demo_url: e.target.value })}
                  placeholder="https://example.com/demo"
                />
              </FormField>

              <FormField label="GitHub URL">
                <Input
                  type="url"
                  value={formData.github_url}
                  onChange={(e) => setFormData({ ...formData, github_url: e.target.value })}
                  placeholder="https://github.com/username/repo"
                />
              </FormField>
            </div>
          </div>

          {/* Tags */}
          <div className="mb-8 pb-8 border-b border-slate-100">
            <h3 className="text-xl font-semibold text-slate-900 mb-6 pb-2 border-b-2 border-blue-50 inline-block">
              Tags (Project Tags)
            </h3>
            <FormField label="Chọn các tags cho project này">
              {loadingTags ? (
                <p className="text-sm text-slate-500">Đang tải danh sách tags...</p>
              ) : tags.length === 0 ? (
                <p className="text-sm text-slate-500">
                  Chưa có tag nào. Tags sẽ được tạo tự động khi bạn tạo project với tags mới.
                </p>
              ) : (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    {tags.map((tag) => (
                      <label
                        key={tag.id}
                        className={cn(
                          'flex items-center gap-3 p-3 rounded-lg border-2 cursor-pointer transition-all',
                          formData.tag_ids.includes(tag.id)
                            ? 'border-blue-500 bg-blue-50'
                            : 'border-slate-200 hover:border-slate-300'
                        )}
                        style={{ borderLeftColor: tag.color || '#6366f1', borderLeftWidth: '4px' }}
                      >
                        <input
                          type="checkbox"
                          checked={formData.tag_ids.includes(tag.id)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setFormData({
                                ...formData,
                                tag_ids: [...formData.tag_ids, tag.id],
                              })
                            } else {
                              setFormData({
                                ...formData,
                                tag_ids: formData.tag_ids.filter((id) => id !== tag.id),
                              })
                            }
                          }}
                          className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                        />
                        <span className="flex-1 text-sm font-medium text-slate-900">
                          {tag.name}
                        </span>
                        <span
                          className="w-4 h-4 rounded-full"
                          style={{ backgroundColor: tag.color || '#6366f1' }}
                        ></span>
                      </label>
                    ))}
                  </div>
                  {formData.tag_ids.length > 0 && (
                    <div className="p-4 bg-slate-50 rounded-lg border border-slate-200">
                      <p className="text-sm font-medium text-slate-700 mb-2">
                        Đã chọn ({formData.tag_ids.length}):
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {formData.tag_ids.map((tagId) => {
                          const tag = tags.find((t) => t.id === tagId)
                          return tag ? (
                            <span
                              key={tagId}
                              className="px-2 py-1 rounded text-xs font-medium text-white"
                              style={{ backgroundColor: tag.color || '#6366f1' }}
                            >
                              {tag.name}
                            </span>
                          ) : null
                        })}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </FormField>
          </div>

          {/* Publish Settings */}
          <div className="mb-8 pb-8 border-b border-slate-100">
            <h3 className="text-xl font-semibold text-slate-900 mb-6 pb-2 border-b-2 border-blue-50 inline-block">
              Publish Settings
            </h3>
            <div className="flex items-center gap-3">
              <input
                id="is_published"
                type="checkbox"
                checked={formData.is_published}
                onChange={(e) => setFormData({ ...formData, is_published: e.target.checked })}
                className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
              />
              <label htmlFor="is_published" className="text-sm font-medium text-slate-700">
                Publish project (hiển thị trên portfolio)
              </label>
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex gap-4 justify-end mt-8 pt-6 border-t border-slate-200">
            <LoadingButton
              type="button"
              onClick={() => router.push('/dashboard/projects')}
              variant="secondary"
            >
              Hủy
            </LoadingButton>
            <LoadingButton type="submit" loading={saving} variant="primary">
              {saving ? 'Đang lưu...' : 'Lưu thay đổi'}
            </LoadingButton>
          </div>
        </motion.form>
      </div>
    </div>
  )
}
