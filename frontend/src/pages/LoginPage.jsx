import LoginForm from '../features/auth/components/LoginForm';
import useLogin from '../features/auth/hooks/useLogin';

const LoginPage = () => {
 const { formData, loading, handleInputChange, handleSubmit} = useLogin();

  return (
    <LoginForm
      formData={formData}
      loading={loading}
      onChange={handleInputChange}
      onSubmit={handleSubmit}
    />
  )
}

export default LoginPage
