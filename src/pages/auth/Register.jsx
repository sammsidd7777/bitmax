
import { Link } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { useRegistationMutation } from '../../services/RTK/authApi';

export default function Register() {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm()

  const Password = watch('Password');

   

 const [registation] = useRegistationMutation();

const onSubmit = async (data) => {
  try {
    const res = await registation(data).unwrap();

    console.log("Register successful:", res);
    alert(res.message || "Registration successful!");
  } catch (error) {
    console.log("Register error:", error);

    alert(error?.data?.message || "Registration failed");
  }
};

  const inputClass =
    'w-full rounded-xl border border-gray-200 p-3 outline-none focus:border-violet-500'

  return (
    <div className="flex min-h-screen items-center justify-center bg-violet-50 p-4">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="w-full max-w-md space-y-4 rounded-3xl bg-white p-8 shadow-xl"
      >
        <h1 className="text-3xl font-bold">Create Account</h1>
        <p className="text-sm text-gray-500">Register your new account</p>

        <div>
          <input
            placeholder="Full Name"
            className={inputClass}
            {...register('Name', { required: 'Name is required' })}
          />
          {errors.name && <p className="text-sm text-red-500">{errors.name.message}</p>}
        </div>

        <div>
          <input
            type="email"
            placeholder="Email Address"
            className={inputClass}
            {...register('Email', {
              required: 'Email is required',
              pattern: {
                value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                message: 'Enter a valid email',
              },
            })}
          />
          {errors.email && <p className="text-sm text-red-500">{errors.email.message}</p>}
        </div>

        <div>
          <input
            type="tel"
            placeholder="Phone Number"
            className={inputClass}
            {...register('Phone', {
              required: 'Phone number is required',
              pattern: {
                value: /^[6-9]\d{9}$/,
                message: 'Enter a valid 10-digit Indian mobile number',
              },
            })}
          />
          {errors.phone && <p className="text-sm text-red-500">{errors.phone.message}</p>}
        </div>

        <div>
          <input
            type="Password"
            placeholder="Password (minimum 8 characters)"
            className={inputClass}
            {...register('Password', {
              required: 'Password is required',
              minLength: {
                value: 8,
                message: 'Minimum 8 characters required',
              },
            })}
          />
          {errors.Password && <p className="text-sm text-red-500">{errors.Password.message}</p>}
        </div>

        <div>
          <input
            type="password"
            placeholder="Confirm Password"
            className={inputClass}
            {...register('confirmPassword', {
              required: 'Confirm your password',
              validate: (value) => value === Password || 'Passwords do not match',
            })}
          />
          {errors.confirmPassword && (
            <p className="text-sm text-red-500">{errors.confirmPassword.message}</p>
          )}
        </div>

        <button className="w-full rounded-xl bg-violet-600 py-3 font-semibold text-white hover:bg-violet-700" type='submit'>
          Create Account
        </button>

        <p className="text-center text-sm text-gray-500">
          Already registered?{' '}
          <Link to="/login" className="font-semibold text-violet-600">
            Login
          </Link>
        </p>
      </form>
    </div>
  )
}
