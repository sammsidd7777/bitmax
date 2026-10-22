
import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import {
  User,
  Mail,
  Phone,
  Lock,
  Eye,
  EyeOff,
  ArrowLeft,
  ShieldCheck,
} from 'lucide-react'

const AuthForm = () => {
  const [mode, setMode] = useState('login')
  const [showPassword, setShowPassword] = useState(false)
  const [otpSent, setOtpSent] = useState(false)
  const [message, setMessage] = useState('')

  const {
    register,
    handleSubmit,
    watch,
    reset,
    getValues,
    formState: { errors, isSubmitting },
  } = useForm({
    mode: 'onTouched',
  })

  const password = watch('password')

  const changeMode = (newMode) => {
    setMode(newMode)
    setMessage('')
    setOtpSent(false)
    reset()
  }

  const onSubmit = async (data) => {
    setMessage('')

    switch (mode) {
      case 'login':
        console.log('Login:', data)
        setMessage('Login API connect karni hai.')
        break

      case 'register':
        console.log('Register:', data)
        setMessage('Registration API connect karni hai.')
        break

      case 'forgot':
        console.log('Forgot password:', data.email)
        setMessage('Password reset API connect karni hai.')
        break

      case 'otp':
        if (!otpSent) {
          console.log('Send OTP to:', data.identifier)
          setOtpSent(true)
          setMessage('Demo: OTP sending API connect nahi hai.')
        } else {
          console.log('Verify OTP:', data.otp)
          setMessage('OTP verification API connect karni hai.')
        }
        break

      default:
        break
    }
  }

  const inputClass =
    'w-full rounded-xl border border-gray-200 bg-gray-50 py-3.5 pl-11 pr-4 outline-none transition focus:border-violet-500 focus:bg-white focus:ring-4 focus:ring-violet-100'

  const field = (
    name,
    label,
    placeholder,
    Icon,
    rules,
    type = 'text',
    extra = {}
  ) => (
    <div>
      <label
        htmlFor={name}
        className="mb-2 block text-sm font-semibold text-gray-700"
      >
        {label}
      </label>

      <div className="relative">
        <Icon
          size={18}
          className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"
        />

        <input
          id={name}
          type={type}
          placeholder={placeholder}
          {...register(name, rules)}
          {...extra}
          className={`${inputClass} ${errors[name] ? 'border-red-400' : ''}`}
        />
      </div>

      {errors[name] && (
        <p className="mt-1 text-xs text-red-500">
          {errors[name].message}
        </p>
      )}
    </div>
  )

  const titles = {
    login: ['Welcome Back!', 'Sign in to continue to your account.'],
    register: ['Create Account', 'Fill in your details to get started.'],
    forgot: ['Forgot Password?', 'Enter your email to reset your password.'],
    otp: [
      otpSent ? 'Verify OTP' : 'Login with OTP',
      otpSent
        ? 'Enter the code sent to your email or phone.'
        : 'Get a one-time password to sign in securely.',
    ],
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-violet-100 via-white to-indigo-100 px-4 py-10">
      <div className="grid w-full max-w-5xl overflow-hidden rounded-3xl bg-white shadow-2xl md:grid-cols-2">

        {/* Left Panel */}
        <div className="relative hidden flex-col justify-between overflow-hidden bg-gradient-to-br from-violet-700 to-indigo-950 p-10 text-white md:flex">
          <div className="text-2xl font-bold">SecureSpace.</div>

          <div>
            <ShieldCheck size={45} className="mb-6 text-violet-200" />

            <h1 className="text-4xl font-bold leading-tight">
              Your world,
              <span className="mt-2 block text-violet-300">
                your space.
              </span>
            </h1>

            <p className="mt-5 leading-7 text-violet-100">
              A simple, secure and seamless way to manage your account.
            </p>
          </div>

          <p className="text-sm text-violet-200">
            © 2026 SecureSpace
          </p>
        </div>

        {/* Dynamic Form */}
        <div className="flex flex-col justify-center p-6 sm:p-10 lg:p-12">
          <div className="mb-8">
            <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-violet-100 text-violet-700">
              <Lock size={27} />
            </div>

            <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl">
              {titles[mode][0]}
            </h2>

            <p className="mt-3 text-sm leading-6 text-gray-500">
              {titles[mode][1]}
            </p>
          </div>

          <form
            onSubmit={handleSubmit(onSubmit)}
            noValidate
            className="space-y-5"
          >
            {/* Register Fields */}
            {mode === 'register' && (
              <>
                {field('name', 'Full Name', 'Enter your name', User, {
                  required: 'Name is required',
                  minLength: {
                    value: 3,
                    message: 'Name must have at least 3 characters',
                  },
                })}

                {field('phone', 'Phone Number', '10-digit mobile number', Phone, {
                  required: 'Phone is required',
                  pattern: {
                    value: /^[6-9]\d{9}$/,
                    message: 'Enter a valid Indian mobile number',
                  },
                }, 'tel')}
              </>
            )}

            {/* Email */}
            {(mode === 'login' ||
              mode === 'register' ||
              mode === 'forgot') &&
              field(
                'email',
                'Email Address',
                'you@example.com',
                Mail,
                {
                  required: 'Email is required',
                  pattern: {
                    value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                    message: 'Enter a valid email',
                  },
                },
                'email',
                { autoComplete: 'email' }
              )}

            {/* Password */}
            {(mode === 'login' || mode === 'register') && (
              <div>
                <label
                  htmlFor="password"
                  className="mb-2 block text-sm font-semibold text-gray-700"
                >
                  Password
                </label>

                <div className="relative">
                  <Lock
                    size={18}
                    className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"
                  />

                  <input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Enter password"
                    autoComplete={
                      mode === 'login'
                        ? 'current-password'
                        : 'new-password'
                    }
                    {...register('password', {
                      required: 'Password is required',
                      minLength: {
                        value: 8,
                        message: 'Minimum 8 characters required',
                      },
                    })}
                    className={`${inputClass} pr-12`}
                  />

                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>

                {errors.password && (
                  <p className="mt-1 text-xs text-red-500">
                    {errors.password.message}
                  </p>
                )}
              </div>
            )}

            {/* Confirm Password */}
            {mode === 'register' &&
              field(
                'confirmPassword',
                'Confirm Password',
                'Re-enter password',
                Lock,
                {
                  required: 'Confirm your password',
                  validate: (value) =>
                    value === password || 'Passwords do not match',
                },
                'password'
              )}

            {/* OTP Login */}
            {mode === 'otp' && (
              <>
                {!otpSent &&
                  field(
                    'identifier',
                    'Email or Mobile Number',
                    'Enter email or mobile number',
                    Mail,
                    {
                      required: 'Email or mobile number is required',
                      validate: (value) =>
                        /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value) ||
                        /^[6-9]\d{9}$/.test(value) ||
                        'Enter a valid email or 10-digit mobile number',
                    }
                  )}

                {otpSent &&
                  field('otp', '6-Digit OTP', 'Enter your OTP', ShieldCheck, {
                    required: 'OTP is required',
                    pattern: {
                      value: /^\d{6}$/,
                      message: 'Enter a valid 6-digit OTP',
                    },
                  }, 'text', {
                    inputMode: 'numeric',
                    maxLength: 6,
                    autoComplete: 'one-time-code',
                  })}
              </>
            )}

            {/* Forgot Password helper */}
            {mode === 'login' && (
              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={() => changeMode('forgot')}
                  className="text-sm font-semibold text-violet-700 hover:text-violet-900"
                >
                  Forgot password?
                </button>
              </div>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full rounded-xl bg-violet-600 py-3.5 font-semibold text-white shadow-lg shadow-violet-200 transition hover:bg-violet-700 disabled:opacity-60"
            >
              {isSubmitting
                ? 'Please wait...'
                : mode === 'login'
                  ? 'Sign In →'
                  : mode === 'register'
                    ? 'Create Account →'
                    : mode === 'forgot'
                      ? 'Send Reset Link →'
                      : otpSent
                        ? 'Verify OTP →'
                        : 'Get OTP →'}
            </button>
          </form>

          {/* Feedback */}
          {message && (
            <p role="status" className="mt-4 rounded-xl bg-violet-50 p-3 text-sm text-violet-700">
              {message}
            </p>
          )}

          {/* Dynamic Navigation */}
          <div className="mt-7 text-center text-sm text-gray-500">
            {mode === 'login' ? (
              <>
                Don't have an account?{' '}
                <button
                  onClick={() => changeMode('register')}
                  className="font-bold text-violet-700"
                >
                  Register
                </button>

                <div className="mt-4">
                  <button
                    onClick={() => changeMode('otp')}
                    className="font-semibold text-violet-700 hover:text-violet-900"
                  >
                    Login with OTP
                  </button>
                </div>
              </>
            ) : mode === 'register' ? (
              <>
                Already have an account?{' '}
                <button
                  onClick={() => changeMode('login')}
                  className="font-bold text-violet-700"
                >
                  Login
                </button>
              </>
            ) : (
              <button
                onClick={() => changeMode('login')}
                className="inline-flex items-center gap-2 font-semibold text-violet-700"
              >
                <ArrowLeft size={16} />
                Back to Login
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default AuthForm
