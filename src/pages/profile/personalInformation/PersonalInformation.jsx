// PersonalInformation.jsx
import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import styles from "./personalInformation.module.css";
import { updateUserDataApi } from "../../../redux/auth/authApis";
import image from "../../../assets/user.png";

const PersonalInformation = () => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);

  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    displayName: "",
    age: "",
    phoneNumber: "",
    address: "",
    email: "",
  });
  const [tempFormData, setTempFormData] = useState(formData);
  const [updateLoading, setUpdateLoading] = useState(false);

  // Load user data when available
  useEffect(() => {
    if (user) {
      const newFormData = {
        displayName: user.displayName || "",
        email: user.email || "",
        age: user.age || "",
        phoneNumber: user.phoneNumber || "",
        address: user.address || "",
      };
      setFormData(newFormData);
      setTempFormData(newFormData);
    }
  }, [user]);

  const handleEditClick = () => {
    setIsEditing(true);
    setTempFormData(formData);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setTempFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSave = async () => {
    setUpdateLoading(true);
    try {
      await dispatch(updateUserDataApi(tempFormData)).unwrap();
      setFormData(tempFormData);
      setIsEditing(false);
    } catch (error) {
      console.error("Update failed:", error);
    } finally {
      setUpdateLoading(false);
    }
  };

  const handleCancel = () => {
    setTempFormData(formData);
    setIsEditing(false);
  };

  if (!user) {
    return <div className={styles.loading}>Loading user data...</div>;
  }

  const firstName = formData.displayName?.split(" ")[0] || "User";
  return (
    <div className={styles.container}>
      <div className={styles.mainSection}>
        <div className={styles.profileCard}>
          <div className={styles.profileHeader}>
            <div className={styles.avatarContainer}>
              <img src={image} alt="Profile" className={styles.avatar} />
            </div>
            <div className={styles.profileInfo}>
              <h3 className={styles.profileName}>{firstName}</h3>
              <p className={styles.profileEmail}>{formData.email || "-"}</p>
              <p className={styles.profilePhone}>
                {formData.phoneNumber || "-"}
              </p>
              <div className={styles.badges}>
                <span className={styles.badge}>Premium Member</span>
                {user.emailVerified && (
                  <span className={`${styles.badge} ${styles.badgeActive}`}>
                    ✓ Verified
                  </span>
                )}
              </div>

              {isEditing ? (
                <div className={styles.editButtons}>
                  <button
                    className={styles.saveBtn}
                    onClick={handleSave}
                    disabled={updateLoading}
                  >
                    <i className="fas fa-save"></i>{" "}
                    {updateLoading ? "Saving..." : "Save"}
                  </button>
                  <button className={styles.cancelBtn} onClick={handleCancel}>
                    <i className="fas fa-times"></i> Cancel
                  </button>
                </div>
              ) : (
                <button className={styles.editBtn} onClick={handleEditClick}>
                  <i className="fas fa-pen"></i> Edit Profile
                </button>
              )}
            </div>
          </div>
        </div>

        <div className={styles.infoCard}>
          <h3 className={styles.cardTitle}>Personal Information</h3>
          <div className={styles.infoGrid}>
            <div className={styles.infoField}>
              <label className={styles.fieldLabel}>Full Name</label>
              {isEditing ? (
                <input
                  type="text"
                  name="displayName"
                  value={tempFormData.displayName}
                  onChange={handleInputChange}
                  className={styles.input}
                />
              ) : (
                <div className={styles.fieldValue}>
                  {formData.displayName || "-"}
                </div>
              )}
            </div>

            <div className={styles.infoField}>
              <label className={styles.fieldLabel}>Email</label>
              <div className={styles.fieldValue}>{formData.email}</div>
            </div>

            <div className={styles.infoField}>
              <label className={styles.fieldLabel}>Age</label>
              {isEditing ? (
                <input
                  type="number"
                  name="age"
                  value={tempFormData.age}
                  onChange={handleInputChange}
                  className={styles.input}
                  min="13"
                  max="120"
                />
              ) : (
                <div className={styles.fieldValue}>
                  {formData.age ? `${formData.age} years` : "-"}
                </div>
              )}
            </div>

            <div className={styles.infoField}>
              <label className={styles.fieldLabel}>Phone</label>
              {isEditing ? (
                <input
                  type="tel"
                  name="phoneNumber"
                  value={tempFormData.phoneNumber}
                  onChange={handleInputChange}
                  className={styles.input}
                />
              ) : (
                <div className={styles.fieldValue}>
                  {formData.phoneNumber || "-"}
                </div>
              )}
            </div>

            <div className={`${styles.infoField} ${styles.fullWidth}`}>
              <label className={styles.fieldLabel}>Address</label>
              {isEditing ? (
                <input
                  type="text"
                  name="address"
                  value={tempFormData.address}
                  onChange={handleInputChange}
                  className={styles.input}
                />
              ) : (
                <div className={styles.fieldValue}>
                  {formData.address || "-"}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PersonalInformation;
