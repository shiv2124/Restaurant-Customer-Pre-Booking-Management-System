import { useState } from 'react';
import { Navigate } from 'react-router-dom';
import { ChefHat, Users } from 'lucide-react';
import Button from '../../components/Button/Button';
import Card from '../../components/Card/Card';
import FormField from '../../components/FormField/FormField';
import Notice from '../../components/Notice/Notice';
import PasswordChecklist from '../../components/PasswordChecklist/PasswordChecklist';
import PasswordField from '../../components/PasswordField/PasswordField';
import styles from './LoginPage.module.css';
import useForm from '../../hooks/useForm';
import { useAuth } from '../../hooks/useAuth';
import { USER_TYPES } from '../../constants/options';
import { dashboardPathFor } from '../../constants/routes';
import { cx } from '../../utils/classNames';
import { validateLoginForm, validateSignupForm } from '../../utils/validators';

const EMPTY_VALUES = { name: '', email: '', password: '', confirmPassword: '' };

export default function LoginPage() {
  const { user, login, signup } = useAuth();
  const [isLogin, setIsLogin] = useState(true);
  const [userType, setUserType] = useState(USER_TYPES.CUSTOMER);
  const [submitError, setSubmitError] = useState('');

  // Sign-in and sign-up check different fields, so pick the matching rules.
  const form = useForm({
    initialValues: EMPTY_VALUES,
    validate: isLogin ? validateLoginForm : validateSignupForm,
  });

  const submit = form.handleSubmit(async (values) => {
    setSubmitError('');
    const email = values.email.trim().toLowerCase();
    try {
      if (isLogin) {
        await login(email, values.password, userType);
      } else {
        await signup(email, values.password, values.name.trim(), userType);
      }
      // `user` is now set, so the <Navigate> below sends them to their dashboard.
    } catch (error) {
      console.error('Authentication error:', error);
      setSubmitError('Something went wrong while signing you in. Please try again.');
    }
  });

  const switchMode = () => {
    setIsLogin((current) => !current);
    setSubmitError('');
    // Keep name and email, but clear passwords and any shown errors.
    form.reset({ ...form.values, password: '', confirmPassword: '' });
  };

  // Already signed in? Skip the login page.
  if (user) return <Navigate to={dashboardPathFor(user.userType)} replace />;

  return (
    <main className={styles.page}>
      <div className={styles.wrapper}>
        <Card padding="lg">
          <div className={styles.heading}>
            <h1 className={styles.title}>Restaurant Booking System</h1>
            <p className={styles.subtitle}>
              {isLogin ? 'Welcome back!' : 'Create your account'}
            </p>
          </div>

          <fieldset className={styles.userType}>
            <legend className={styles.legend}>I am a:</legend>
            <div className={styles.typeButtons}>
              <button
                type="button"
                aria-pressed={userType === USER_TYPES.CUSTOMER}
                className={cx(styles.typeButton, userType === USER_TYPES.CUSTOMER && styles.active)}
                onClick={() => setUserType(USER_TYPES.CUSTOMER)}
              >
                <Users size={20} aria-hidden="true" />
                Customer
              </button>
              <button
                type="button"
                aria-pressed={userType === USER_TYPES.RESTAURANT}
                className={cx(
                  styles.typeButton,
                  userType === USER_TYPES.RESTAURANT && styles.active,
                )}
                onClick={() => setUserType(USER_TYPES.RESTAURANT)}
              >
                <ChefHat size={20} aria-hidden="true" />
                Restaurant
              </button>
            </div>
          </fieldset>

          <form onSubmit={submit} noValidate className={styles.form}>
            {submitError && <Notice tone="error">{submitError}</Notice>}

            {!isLogin && (
              <FormField
                label="Full Name"
                required
                autoComplete="name"
                placeholder="Enter your full name"
                {...form.getFieldProps('name')}
              />
            )}

            <FormField
              label="Email Address"
              type="email"
              required
              autoComplete="email"
              placeholder="Enter your email"
              {...form.getFieldProps('email')}
            />

            <PasswordField
              label="Password"
              required
              autoComplete={isLogin ? 'current-password' : 'new-password'}
              placeholder={isLogin ? 'Enter your password' : 'Create a password'}
              {...form.getFieldProps('password')}
            />

            {!isLogin && (
              <>
                <PasswordChecklist password={form.values.password} />
                <PasswordField
                  label="Confirm Password"
                  required
                  autoComplete="new-password"
                  placeholder="Re-enter your password"
                  {...form.getFieldProps('confirmPassword')}
                />
              </>
            )}

            <Button type="submit" fullWidth>
              {isLogin ? 'Sign In' : 'Sign Up'}
            </Button>
          </form>

          <div className={styles.switch}>
            <button type="button" className={styles.switchButton} onClick={switchMode}>
              {isLogin ? "Don't have an account? Sign up" : 'Already have an account? Sign in'}
            </button>
          </div>
        </Card>
      </div>
    </main>
  );
}
