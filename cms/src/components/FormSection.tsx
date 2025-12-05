import React from 'react'

interface FormSectionProps {
  title: string
  children: React.ReactNode
  className?: string
}

export default function FormSection({ title, children, className = '' }: FormSectionProps) {
  return (
    <div className={`form-section ${className}`}>
      <h3 className="section-title">{title}</h3>
      {children}
    </div>
  )
}

