import React, { useState } from 'react';
import { Oval } from 'react-loader-spinner';
import { updatePassword } from '../../../appWrite/shop/shopAuth.js';
import './password.css';

function Password({ shopId, showPassword, setShowPassword }) {
    const [formData, setFormData] = useState({
        password: '',
        confirmPassword: '',
    });
    const [formErrors, setFormErrors] = useState({
        password: '',
        confirmPassword: '',
    });
    const [isUpdating, setIsUpdating] = useState(false);
    const [updateStatus, setUpdateStatus] = useState(null);

    const MAX_LENGTH = 6;

    const handleInputChange = (e, field) => {
        const value = e.target.value;
        if (/^[1-9]\d{0,5}$|^$/.test(value)) {
            setFormData((prev) => ({
                ...prev,
                [field]: value,
            }));

            if (field === 'password') {
                setFormErrors((prev) => ({
                    ...prev,
                    password: value.length === MAX_LENGTH && value === formData.confirmPassword
                        ? ''
                        : value.length !== MAX_LENGTH
                            ? 'Password must be exactly 6 digits'
                            : '',
                }));
            } else if (field === 'confirmPassword') {
                setFormErrors((prev) => ({
                    ...prev,
                    confirmPassword: value === formData.password && value.length === MAX_LENGTH
                        ? ''
                        : 'Passwords must match',
                }));
            }
        }
    };

    const handleUpdate = () => {
        const errors = {
            password: formData.password.length !== MAX_LENGTH ? 'Password must be exactly 6 digits' : '',
            confirmPassword: formData.confirmPassword !== formData.password ? 'Passwords must match' : '',
        };

        if (errors.password || errors.confirmPassword) {
            setFormErrors(errors);
        } else {
            setFormErrors({ password: '', confirmPassword: '' });
            confirmUpdate();
        }
    };

    const confirmUpdate = async () => {
        setIsUpdating(true);
        try {
            const response = await updatePassword(shopId, formData.password);
            if (response.success) {
                setUpdateStatus('success');
                setFormData({ password: '', confirmPassword: '' });
                setFormErrors({ password: '', confirmPassword: '' });
            } else {
                setUpdateStatus('failed');
                console.log('Update failed:', response.error);
            }
        } catch (error) {
            setUpdateStatus('failed');
            console.error('Error during password update:', error.message);
        } finally {
            setIsUpdating(false);
        }
    };

    const handleCancel = () => {
        setFormData({ password: '', confirmPassword: '' });
        setFormErrors({ password: '', confirmPassword: '' });
        setUpdateStatus(null);
        setShowPassword(false);
    };

    const handleCloseSuccess = () => {
        setUpdateStatus(null);
        setShowPassword(false);
    };

    return (
        <>
            {showPassword && (
                <div className="shop-address-popup-overlay">
                    <div className="shop-address-popup-card">
                        <div className="shop-address-popup-pointer" />

                        {updateStatus === null && (
                            <>
                            <h2 className="shop-password-popup-title">
                                    WANT TO CHANGE PASSWORD!
                                </h2>
                                <fieldset className="shop-update-password-input">
                                    {/* <legend>New Password</legend> */}
                                    <div className="shop-update-password-container">
                                        <input
                                            type="number"
                                            value={formData.password}
                                            onChange={(e) => handleInputChange(e, 'password')}
                                            className={formErrors.password ? 'error' : ''}
                                            placeholder="ENTER 6 DIGIT PASSWORD"
                                            maxLength={MAX_LENGTH}
                                            inputMode="numeric"
                                            pattern="[1-9][0-9]{5}"
                                            disabled={isUpdating}
                                        />
                                        
                                    </div>
                                </fieldset>

                                <fieldset className="shop-update-password-input">
                                    {/* <legend>Confirm Password</legend> */}
                                    <div className="shop-update-password-container">
                                        <input
                                            type="number"
                                            value={formData.confirmPassword}
                                            onChange={(e) => handleInputChange(e, 'confirmPassword')}
                                            className={formErrors.confirmPassword ? 'error' : ''}
                                            placeholder="CONFIRM PASSWORD"
                                            maxLength={MAX_LENGTH}
                                            inputMode="numeric"
                                            pattern="[1-9][0-9]{5}"
                                            disabled={isUpdating}
                                        />
                                        
                                    </div>
                                </fieldset>

                                <div className="shop-address-popup-buttons">
                                    <button
                                        className="shop-address-popup-button-primary"
                                        onClick={handleUpdate}
                                        disabled={
                                            isUpdating ||
                                            formData.password.length !== MAX_LENGTH ||
                                            formData.password !== formData.confirmPassword
                                        }
                                    >
                                        {isUpdating ? (
                                            <Oval
                                                height={20}
                                                width={20}
                                                color="white"
                                                visible={true}
                                                ariaLabel="oval-loading"
                                                secondaryColor="gray"
                                                strokeWidth={5}
                                                strokeWidthSecondary={5}
                                            />
                                        ) : (
                                            'Yes, Update'
                                        )}
                                    </button>
                                    <button
                                        className="shop-address-popup-button-secondary"
                                        onClick={handleCancel}
                                        disabled={isUpdating}
                                    >
                                        Cancel
                                    </button>
                                </div>
                            </>
                        )}

                        {updateStatus === 'success' && (
                            <div>
                                <h2 className="shop-password-popup-title">
                                    UPDATION SUCCESSFULL
                                </h2>
                                <div style={{ fontSize: "13px" }} className="shop-password-popup-text">
                                    Your new password has been successfully updated. Please use it for your next login.
                                </div>
                                <div className="shop-address-popup-buttons">
                                    <button
                                        className="shop-address-popup-button-primary"
                                        onClick={handleCloseSuccess}
                                    >
                                        OK
                                    </button>
                                </div>
                            </div>
                        )}

                        {updateStatus === 'failed' && (
                            <div>
                                <h2 className="shop-password-popup-title">
                                    UPDATION FAILED!
                                </h2>
                                <div style={{ fontSize: "13px" }} className="shop-password-popup-text">
                                    We encountered an issue while updating your password. This could be due to a server error or connectivity issue. Please try again later.
                                </div>
                                <div className="shop-address-popup-buttons">
                                    <button
                                        className="shop-address-popup-button-primary"
                                        onClick={() => setUpdateStatus(null)}
                                    >
                                        Try Again
                                    </button>
                                    <button
                                        className="shop-address-popup-button-secondary"
                                        onClick={handleCancel}
                                    >
                                        Cancel
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </>
    );
}

export default Password;