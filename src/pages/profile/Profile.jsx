import { useState } from 'react';
import { useSelector } from 'react-redux';
import PersonalInformation from './personalInformation/PersonalInformation';
import Invoices from './invoices/Invoices';
import styles from './profile.module.css';

const Profile = () => {
  const [activeSection] = useState('profile');
  const { user, isAuthenticated } = useSelector(state => state.auth);

  // إذا لم تكن البيانات قد وصلت بعد، اظهر رسالة تحميل بدل الشاشة البيضاء
  if (!user) {
    return <div className={styles.container}>Loading User Data...</div>;
  }

  return (
    <div className={styles.container}>
      <div className={styles.mainContent}>
        <div className={styles.header}>
          <div className={styles.headerLeft}>
            <h2 className={styles.headerTitle}>
              {isAuthenticated ? `${user.username}'s Profile` : 'User Profile'}
            </h2>
          </div>
        </div>

        <div className={styles.contentArea}>
          {(() => {
            switch (activeSection) {
              case 'profile':
                // نمرر اليوزر كـ prop للتأكد من وصوله
                return <PersonalInformation user={user} />;
              case 'invoices':
                return <Invoices user={user} />;
              default:
                return <PersonalInformation user={user} />;
            }
          })()}
        </div>
      </div>
    </div>
  );
};

export default Profile;