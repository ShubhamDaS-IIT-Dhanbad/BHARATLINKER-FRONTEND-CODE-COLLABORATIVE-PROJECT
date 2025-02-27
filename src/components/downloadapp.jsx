import React, { useState, useEffect } from "react";

function DownloadApp() {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [showPopup, setShowPopup] = useState(false);

  useEffect(() => {
    const handleBeforeInstallPrompt = (event) => {
      event.preventDefault();
      setDeferredPrompt(event);
      setShowPopup(true);
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstall = () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      deferredPrompt.userChoice.then((choiceResult) => {
        if (choiceResult.outcome === "accepted") {
          console.log("User installed the app");
        } else {
          console.log("User dismissed the install prompt");
        }
        setDeferredPrompt(null);
        setShowPopup(false);
      });
    }
  };

  return (
    <>
      {showPopup && (
        <div style={styles.popup}>
          <p style={styles.text}>Download the Bharat Linker App for a better experience!</p>
          <div style={styles.buttonContainer}>
            <button style={styles.button} onClick={handleInstall}>
              Install App
            </button>
            <button style={styles.closeButton} onClick={() => setShowPopup(false)}>
              ✖
            </button>
          </div>
        </div>
      )}
    </>
  );
}

const styles = {
  popup: {
    position: "fixed",
    bottom: "20px",
    left: "50%",
    transform: "translateX(-50%)",
    backgroundColor: "#fff",
    padding: "15px",
    borderRadius: "8px",
    boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
    textAlign: "center",
    zIndex: 1000,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  text: {
    marginBottom: "10px",
    fontSize: "14px",
    fontWeight: "500",
  },
  buttonContainer: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
  },
  button: {
    backgroundColor: "black",
    color: "#fff",
    border: "none",
    padding: "10px 15px",
    borderRadius: "5px",
    cursor: "pointer",
  },
  closeButton: {
    backgroundColor: "transparent",
    border: "none",
    fontSize: "16px",
    cursor: "pointer",
    color: "black",
  },
};

export default DownloadApp;
