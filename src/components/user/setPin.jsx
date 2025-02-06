import { useState, useCallback } from "react";
import { TailSpin } from 'react-loader-spinner';
import { updateUserMetaData } from '../../supaBase/userAuth.js';
import './style/setPin.css';
import Cookies from 'js-cookie'
const SetPinPage = ({onPinSet}) => {
    const [pin, setPin] = useState(Array(6).fill(""));
    const [confirmPin, setConfirmPin] = useState(Array(6).fill(""));
    const [updating, setUpdating] = useState(false);
    const [error, setError] = useState("");

    const handleDigitChange = useCallback((e, index, type) => {
        const value = e.target.value.slice(-1);
        const updatedPin = type === "pin" ? [...pin] : [...confirmPin];
        if (!value) {
            updatedPin[index] = "";
            if (index > 0) {
                document.getElementById(`${type}-input-${index - 1}`).focus();
            }
        } else {
            updatedPin[index] = value;
            if (index < 5) {
                document.getElementById(`${type}-input-${index + 1}`).focus();
            }
        }
        if (type === "pin") {
            setPin(updatedPin);
        } else {
            setConfirmPin(updatedPin);
        }
    }, [pin, confirmPin]);

    const handleSubmit = async () => {
        if (pin.join("").length !== 6 || confirmPin.join("").length !== 6) {
            setError("PIN must be 6 digits. Please complete both PINs.");
            return;
        }
        if (pin.join("") !== confirmPin.join("")) {
            setError("Pins do not match. Try again.");
            return;
        }
        setError("");
        setUpdating(true);

        try {
            const userData = { password: pin.join("") };
            const {user,error} = await updateUserMetaData(userData);
            const currentExpiration = Cookies.get('BharatLinkerUserSession')
                ? JSON.parse(Cookies.get('BharatLinkerUserSession')).expires
                : 7;
            Cookies.set(
                "BharatLinkerUserData",
                JSON.stringify({
                    ...user.user_metadata,
                    phone: user.phone
                }),
                { expires: currentExpiration, secure: true }
            );
            onPinSet();
        } catch (error) {
            console.error("Error updating user data:", error);
        } finally {
            setUpdating(false);
        }
    };

    return (
        <div className="set-pin-container">
            {error && <p className="pin-error-message">{error}</p>}
            <div className="set-pin-container-div">
                <div className="user-pin-text">ENTER 6-DIGIT PIN</div>
                <div className="pin-inputs">
                    {pin.map((_, index) => (
                        <input
                            key={index}
                            id={`pin-input-${index}`}
                            type="number"
                            className="pin-input"
                            maxLength="1"
                            value={pin[index]}
                            onChange={(e) => handleDigitChange(e, index, "pin")}
                        />
                    ))}
                </div>

                <div className="user-pin-text">CONFIRM PIN</div>
                <div className="pin-inputs" style={{ paddingBottom: "10px" }}>
                    {confirmPin.map((_, index) => (
                        <input
                            key={index}
                            id={`confirm-input-${index}`}
                            type="number"
                            className="pin-input"
                            maxLength="1"
                            value={confirmPin[index]}
                            onChange={(e) => handleDigitChange(e, index, "confirm")}
                        />
                    ))}
                </div>

                <button
                    className="pin-button primary"
                    onClick={handleSubmit}
                    disabled={updating}
                >
                    {updating ? <TailSpin height={24} width={24} color="#ffffff" /> : 'SET PIN'}
                </button>
                <p className="user-pin-terms">
                    This will help you login faster. You can change this pin later.
                </p>
            </div>
        </div>
    );
};

export default SetPinPage;
