// Profile.jsx
import { useState } from 'react';
import { useSelector } from 'react-redux';
import PersonalInformation from './personalInformation/PersonalInformation';
import Invoices from './invoices/Invoices';
import styles from './profile.module.css';

const Profile = () => {
  const [activeSection] = useState('profile');
  const { user, isAuthenticated, loading } = useSelector(state => state.auth);

  if (loading || !user) {
    return (
      <div className={styles.container}>
        <div className={styles.loadingWrapper}>
          <div className={styles.spinner} />
          <p>Loading profile...</p>
        </div>
      </div>
    );
  }

  // Use displayName from Firebase; fallback to email or "User"
  const displayName = user.displayName || user.email?.split('@')[0] || 'User';

  return (
    <div className={styles.container}>
      <div className={styles.mainContent}>
        <div className={styles.header}>
          <div className={styles.headerLeft}>
            <h2 className={styles.headerTitle}>
              {isAuthenticated ? `${displayName}'s Profile` : 'User Profile'}
            </h2>
            <p className={styles.headerSubtitle}>Manage your personal information and preferences</p>
          </div>
        </div>

        <div className={styles.contentArea}>
          {activeSection === 'profile' && <PersonalInformation />}
          {activeSection === 'invoices' && <Invoices />}
        </div>
      </div>
    </div>
  );
};

export default Profile;
