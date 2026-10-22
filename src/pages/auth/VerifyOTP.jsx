
import { Link } from 'react-router-dom'
import { useForm } from 'react-hook-form'

export default function Verification() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm()

  const onSubmit = (data) => {
    console.log('OTP:', data.otp)
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-violet-50 p-4">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="w-full max-w-md space-y-5 rounded-3xl bg-white p-8 shadow-xl"
      >
        <div className="text-4xl">🔐</div>

        <h1 className="text-3xl font-bold">Verify OTP</h1>

        <p className="text-sm text-gray-500">
          Enter the 6-digit verification code.
        </p>

        <div>
          <input
            type="text"
            inputMode="numeric"
            autoComplete="one-time-code"
            maxLength={6}
            placeholder="Enter 6-digit OTP"
            className="w-full rounded-xl border p-3 text-center text-xl tracking-[0.5em] outline-none focus:border-violet-500"
            {...register('otp', {
              required: 'OTP is required',
              pattern: {
                value: /^\d{6}$/,
                message: 'Enter a valid 6-digit OTP',
              },
            })}
          />

          {errors.otp && (
            <p className="mt-1 text-sm text-red-500">{errors.otp.message}</p>
          )}
        </div>

        <button className="w-full rounded-xl bg-violet-600 py-3 font-semibold text-white">
          Verify OTP
        </button>

        <Link to="/login" className="block text-center text-sm font-semibold text-violet-600">
          Back to Login
        </Link>
      </form>
    </div>
  )
}
