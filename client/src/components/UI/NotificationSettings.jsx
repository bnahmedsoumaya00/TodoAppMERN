import { useState, useEffect } from 'react';
import { Bell, BellOff } from 'lucide-react';
import { motion } from 'framer-motion';
import { 
  requestNotificationPermission, 
  canShowNotifications,
  showNotification 
} from '../../utils/notificationService';
import toast from 'react-hot-toast';

const NotificationSettings = () => {
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);

  useEffect(() => {
    setNotificationsEnabled(canShowNotifications());
  }, []);

  const handleToggleNotifications = async () => {
    if (!('Notification' in window)) {
      toast. error('Your browser does not support notifications');
      return;
    }

    if (notificationsEnabled) {
      toast('Notifications are enabled.  Disable them in browser settings');
      return;
    }

    const granted = await requestNotificationPermission();
    
    if (granted) {
      setNotificationsEnabled(true);
      toast.success('Notifications enabled');
      
      showNotification('Notifications Enabled', {
        body: 'You\'ll now receive reminders for your tasks'
      });
    } else {
      toast.error('Notification permission denied');
    }
  };

  return (
    <button
      onClick={handleToggleNotifications}
      style={{
        padding: '0.625rem 1rem',
        background: notificationsEnabled ? 'var(--bg-tertiary)' : 'var(--bg-secondary)',
        border: `1px solid ${notificationsEnabled ? 'var(--border-accent)' : 'var(--border-primary)'}`,
        borderRadius: 'var(--radius-md)',
        color: notificationsEnabled ? 'var(--color-accent)' : 'var(--text-secondary)',
        fontSize: '0.875rem',
        fontWeight: '500',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        gap: '0.5rem',
        transition: 'all var(--transition-base)'
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.background = 'var(--bg-tertiary)';
        e.currentTarget.style.borderColor = 'var(--border-secondary)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.background = notificationsEnabled ? 'var(--bg-tertiary)' : 'var(--bg-secondary)';
        e.currentTarget.style. borderColor = notificationsEnabled ?  'var(--border-accent)' : 'var(--border-primary)';
      }}
      title={notificationsEnabled ? 'Notifications enabled' : 'Enable notifications'}
    >
      {notificationsEnabled ? <Bell size={16} /> : <BellOff size={16} />}
      <span className="desktop-only">
        {notificationsEnabled ? 'Notifications' : 'Enable Notifications'}
      </span>
    </button>
  );
};

export default NotificationSettings;