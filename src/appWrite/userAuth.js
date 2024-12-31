import conf from '../conf/conf.js';
import { Client, Account, ID } from "appwrite";
import { getAuth, signOut, signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { auth, provider } from '../fireBase/firebase.js';
import Cookies from 'js-cookie';

class UserAuthService {
    client;
    account;

    constructor() {
        // Initialize Appwrite client
        this.client = new Client();
        this.account = new Account(this.client);

        this.client
            .setEndpoint(conf.appwriteUrl) // Appwrite URL
            .setProject(conf.appwriteUsersProjectId); // Appwrite Project ID
    }

    /**
     * Handles user login via Appwrite email and password authentication.
     * @param {Object} credentials - User login credentials.
     * @param {string} credentials.email - The user's email.
     * @param {string} credentials.password - The user's password.
     * @returns {Promise<Object|null>} The login response or null if error.
     */
    async userLogin({ email, password }) {
        try {
            return await this.account.createEmailPasswordSession(email, password);
        } catch (error) {
            console.error("Error during Appwrite login:", error);
            return null;
        }
    }

    /**
     * Handles Google Login via Firebase.
     * @returns {Promise<Object|null>} The Firebase user object or null if error.
     */
    async handleGoogleLogin() {
        try {
            const result = await signInWithPopup(auth, provider);
            return result.user;
        } catch (error) {
            console.error("Error during Google login:", error);
            return null;
        }
    }

    /**
     * Creates a new Appwrite account using Google login credentials.
     * @returns {Promise<Object|null>} The login response or null if error.
     */
    async createAccount() {
        try {
            const userData = await this.handleGoogleLogin();
            if (!userData) {
                return null;
            }

            const { email, uid: password } = userData;

            const userAccount = await this.account.create(ID.unique(), email, password);
            if (userAccount) {
                return await this._postSignupLogin(userData, email, password);
            } else {
                await this._handleSignupFailure(userData);
                return null;
            }
        } catch (error) {
            console.error("Error during account creation:", error);
            return null;
        }
    }

    /**
     * Attempts to log in a user. If user does not exist, it will proceed to create an account.
     * @returns {Promise<Object|null>} The login response or null if error.
     */
    async loginUser() {
        const userData = await this.handleGoogleLogin();
        if (!userData) return null;

        const { email, uid: password } = userData;

        try {
            const loginResponse = await this.userLogin({ email, password });
            if (loginResponse) {
                return this._storeUserSession(loginResponse);
            }
        } catch {
            console.log("User does not exist, proceeding with account creation...");
            return await this.createAccount();
        }
    }

    /**
     * Logs out the user by clearing Firebase and Appwrite sessions and removing cookies.
     * @returns {Promise<void>}
     */
    async userLogout() {
        try {
            await signOut(auth);
            console.log("User logged out from Firebase");

            await this.account.deleteSession('current');
            console.log("Current Appwrite session deleted");

            this._clearSessionData();

            window.location.href = '/login';
        } catch (error) {
            console.error("Error during logout:", error);
        }
    }

    /**
     * Clears all Appwrite sessions and logs out of Firebase.
     * @returns {Promise<void>}
     */
    async clearAllSessions() {
        try {
            await signOut(auth);
            console.log("User logged out from Firebase");

            await this.account.deleteSessions();
            console.log("All Appwrite sessions deleted");

            this._clearSessionData();

            window.location.href = '/login';
        } catch (error) {
            console.error("Error during clearing all sessions:", error);
        }
    }

    /**
     * Logs in the user after signing up successfully.
     * @private
     * @param {Object} userData - The Firebase user object.
     * @param {string} email - The user's email.
     * @param {string} password - The user's unique ID as password.
     * @returns {Promise<Object|null>} The login response or null if error.
     */
    async _postSignupLogin(userData, email, password) {
        try {
            const loginResponse = await this.userLogin({ email, password });
            if (loginResponse) {
                this._storeUserSession({
                    displayName: userData.displayName,
                    email: userData.email,
                    uid: userData.uid,
                });
                window.location.href = '/dashboard';
                return loginResponse;
            }
        } catch (error) {
            console.error("Error during post-signup login:", error);
            return null;
        }
    }

    /**
     * Handles the failure case during account creation.
     * @private
     * @param {Object} userData - The Firebase user object.
     * @returns {Promise<void>}
     */
    async _handleSignupFailure(userData) {
        console.error("Appwrite account creation failed");
        try {
            await userData.delete();
            console.log("Firebase user deleted after Appwrite failure");
        } catch (deleteError) {
            console.error("Error deleting Firebase user:", deleteError);
        }
    }

    /**
     * Stores user session data in cookies.
     * @private
     * @param {Object} sessionData - The data to be stored.
     */
    _storeUserSession(sessionData) {
        Cookies.set('BharatLinkerUser', JSON.stringify(sessionData), { expires: 7 });
        console.log("User session stored in cookies");
    }

    /**
     * Clears user session cookies.
     * @private
     */
    _clearSessionData() {
        Cookies.remove('BharatLinkerUser');
        console.log("User session cookie cleared");
    }
}

// Export the instance of the service to be used in the app
const userAuthService = new UserAuthService();
export default userAuthService;
