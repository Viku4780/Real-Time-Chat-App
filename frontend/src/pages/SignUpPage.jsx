import RegisterForm from '../features/auth/components/RegisterForm';
import useRegister from '../features/auth/hooks/useRegister';

const SignUpPage = () => {
  const {formData, loading, handleInputChange, handleSubmit} = useRegister()

  return (
    <RegisterForm
      formData={formData}
      loading={loading}
      onSubmit={handleSubmit}
      onChange={handleInputChange}
    />
  )
}

export default SignUpPage
