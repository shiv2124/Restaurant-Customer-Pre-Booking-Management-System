import { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import FormField from '../FormField/FormField';
import styles from './PasswordField.module.css';

/** FormField for passwords, with a show/hide toggle. */
export default function PasswordField(props) {
  const [visible, setVisible] = useState(false);
  const Icon = visible ? EyeOff : Eye;

  return (
    <FormField
      {...props}
      type={visible ? 'text' : 'password'}
      endAdornment={
        <button
          type="button"
          className={styles.toggle}
          onClick={() => setVisible((current) => !current)}
          aria-label={visible ? 'Hide password' : 'Show password'}
          aria-pressed={visible}
        >
          <Icon size={18} aria-hidden="true" />
        </button>
      }
    />
  );
}
