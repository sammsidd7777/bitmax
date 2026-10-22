
import { Link } from 'react-router-dom'
import { useForm } from 'react-hook-form'

export default function ForgotPassword() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm()

  const onSubmit = (data) => {
    console.log('Reset request:', data)
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-violet-50 p-4">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="w-full max-w-md space-y-5 rounded-3xl bg-white p-8 shadow-xl"
      >
        <h1 className="text-3xl font-bold">Forgot Password?</h1>
        <p className="text-sm text-gray-500">
          Enter your email address to request a password reset.
        </p>

        <div>
          <input
            type="email"
            placeholder="Enter your email"
            className="w-full rounded-xl border p-3 outline-none focus:border-violet-500"
            {...register('email', {
              required: 'Email is required',
              pattern: {
                value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                message: 'Enter a valid email',
              },
            })}
          />
          {errors.email && (
            <p className="mt-1 text-sm text-red-500">{errors.email.message}</p>
          )}
        </div>

        <button className="w-full rounded-xl bg-violet-600 py-3 font-semibold text-white">
          Send Reset Link
        </button>

        <Link to="/login" className="block text-center text-sm font-semibold text-violet-600">
          Back to Login
        </Link>
      </form>
    </div>
  )
}
