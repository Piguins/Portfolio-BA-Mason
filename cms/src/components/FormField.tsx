import React from 'react'

interface FormFieldProps {
  label: string
  id: string
  required?: boolean
  error?: string
  children: React.ReactNode
}

export default function FormField({ label, id, required, error, children }: FormFieldProps) {
  return (
    <div className="form-group">
      <label htmlFor={id}>
        {label} {required && '*'}
      </label>
      {children}
      {error && <span className="field-error">{error}</span>}
    </div>
  )
}

