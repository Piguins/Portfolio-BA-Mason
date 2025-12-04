// Authentication error messages mapping

export interface AuthError {
  message: string
  type: 'email' | 'password' | 'network' | 'unknown'
}

export function getAuthErrorMessage(error: any): AuthError {
  if (!error) {
    return {
      message: 'Đã xảy ra lỗi không xác định',
      type: 'unknown',
    }
  }

  const errorMessage = error.message || error.toString().toLowerCase()

  // Email errors
  if (
    errorMessage.includes('email') ||
    errorMessage.includes('user not found') ||
    errorMessage.includes('invalid login credentials') ||
    errorMessage.includes('invalid email')
  ) {
    return {
      message: 'Email không tồn tại hoặc không đúng định dạng',
      type: 'email',
    }
  }

  // Password errors
  if (
    errorMessage.includes('password') ||
    errorMessage.includes('invalid login credentials') ||
    errorMessage.includes('wrong password') ||
    errorMessage.includes('incorrect password')
  ) {
    return {
      message: 'Mật khẩu không đúng',
      type: 'password',
    }
  }

  // Network errors
  if (
    errorMessage.includes('network') ||
    errorMessage.includes('fetch') ||
    errorMessage.includes('connection') ||
    errorMessage.includes('timeout')
  ) {
    return {
      message: 'Lỗi kết nối. Vui lòng kiểm tra internet và thử lại',
      type: 'network',
    }
  }

  // Supabase specific errors
  if (errorMessage.includes('invalid login credentials')) {
    return {
      message: 'Email hoặc mật khẩu không đúng',
      type: 'email',
    }
  }

  if (errorMessage.includes('email not confirmed')) {
    return {
      message: 'Email chưa được xác nhận. Vui lòng kiểm tra hộp thư',
      type: 'email',
    }
  }

  if (errorMessage.includes('too many requests')) {
    return {
      message: 'Quá nhiều lần thử. Vui lòng đợi một lát và thử lại',
      type: 'unknown',
    }
  }

  // Default
  return {
    message: error.message || 'Đăng nhập thất bại. Vui lòng thử lại',
    type: 'unknown',
  }
}

