// @ts-nocheck
import { Capacitor } from '@capacitor/core';
import { BiometricAuth, BiometryType } from '@aparajita/capacitor-biometric-auth';

const proxy = BiometricAuth;


/**
* Biometrics (Fingerprint / Face ID / Touch ID) utility.
* Supports native Android & iOS biometrics via Capacitor BiometricAuth,
* with WebAuthn fallback for modern secure web browsers.
*/
var CREDENTIAL_STORAGE_KEY = "masrofy_biometric_cred_id";
/**
* Checks if the user's device/browser supports platform biometrics (Face ID, Touch ID, Fingerprint, Windows Hello).
*/
export async function isBiometricsSupported() {
	try {
		if (typeof window !== "undefined" && Capacitor.isNativePlatform()) {
			const info = await proxy.checkBiometry();
			return Boolean(info.isAvailable && info.biometryType !== BiometryType.none);
		}
	} catch (err) {
		console.warn("Native biometrics check error:", err);
	}
	try {
		if (typeof window === "undefined") return false;
		if (!window.isSecureContext) return false;
		if (!window.PublicKeyCredential) return false;
		if (typeof PublicKeyCredential.isUserVerifyingPlatformAuthenticatorAvailable !== "function") return false;
		const available = await PublicKeyCredential.isUserVerifyingPlatformAuthenticatorAvailable();
		return Boolean(available);
	} catch (err) {
		console.warn("Web biometrics check error:", err);
		return false;
	}
}
/**
* Registers biometric authentication on this device.
*/
export async function registerBiometrics(username = "masrofy_user") {
	try {
		if (Capacitor.isNativePlatform()) {
			if (!(await proxy.checkBiometry()).isAvailable) return {
				success: false,
				error: "unsupported"
			};
			await proxy.authenticate({
				reason: "تأكيد بصمة الإصبع أو الوجه لتفعيل الحماية في مصروفي",
				cancelTitle: "إلغاء"
			});
			localStorage.setItem(CREDENTIAL_STORAGE_KEY, "native_biometric_active");
			return { success: true };
		}
	} catch (err) {
		console.warn("Native biometric registration error:", err);
		const code = err?.code || "";
		if (code === "userCancel" || code === "appCancel" || err?.message?.toLowerCase().includes("cancel")) return {
			success: false,
			error: "cancelled_or_denied"
		};
		return {
			success: false,
			error: err?.message || "unknown"
		};
	}
	try {
		if (!await isBiometricsSupported()) return {
			success: false,
			error: "unsupported"
		};
		const challenge = /* @__PURE__ */ new Uint8Array(32);
		window.crypto.getRandomValues(challenge);
		const userId = /* @__PURE__ */ new Uint8Array(16);
		window.crypto.getRandomValues(userId);
		const publicKeyCredentialCreationOptions = {
			challenge,
			rp: {
				name: "مصروفي (Masrofy)",
				id: window.location.hostname
			},
			user: {
				id: userId,
				name: username,
				displayName: "مستخدم مصروفي"
			},
			pubKeyCredParams: [{
				alg: -7,
				type: "public-key"
			}, {
				alg: -257,
				type: "public-key"
			}],
			authenticatorSelection: {
				authenticatorAttachment: "platform",
				userVerification: "required",
				residentKey: "preferred"
			},
			timeout: 6e4,
			attestation: "none"
		};
		const credential = await navigator.credentials.create({ publicKey: publicKeyCredentialCreationOptions });
		if (!credential) return {
			success: false,
			error: "cancelled"
		};
		const rawId = new Uint8Array(credential.rawId);
		let binary = "";
		for (let i = 0; i < rawId.byteLength; i++) binary += String.fromCharCode(rawId[i]);
		const b64Id = btoa(binary);
		localStorage.setItem(CREDENTIAL_STORAGE_KEY, b64Id);
		return { success: true };
	} catch (err) {
		console.warn("Biometric registration error:", err);
		if (err?.name === "NotAllowedError") return {
			success: false,
			error: "cancelled_or_denied"
		};
		return {
			success: false,
			error: err?.message || "unknown"
		};
	}
}
/**
* Authenticates using device biometrics (Fingerprint / Face ID).
*/
export async function authenticateWithBiometrics() {
	try {
		if (Capacitor.isNativePlatform()) {
			await proxy.authenticate({
				reason: "تأكيد هويتك بالبصمة لفتح مصروفي",
				cancelTitle: "إلغاء"
			});
			return { success: true };
		}
	} catch (err) {
		console.warn("Native biometric authentication error:", err);
		const code = err?.code || "";
		if (code === "userCancel" || code === "appCancel" || err?.message?.toLowerCase().includes("cancel")) return {
			success: false,
			error: "cancelled_or_denied"
		};
		return {
			success: false,
			error: err?.message || "failed"
		};
	}
	try {
		if (!await isBiometricsSupported()) return {
			success: false,
			error: "unsupported"
		};
		const challenge = /* @__PURE__ */ new Uint8Array(32);
		window.crypto.getRandomValues(challenge);
		const storedB64Id = localStorage.getItem(CREDENTIAL_STORAGE_KEY);
		let allowCredentials = void 0;
		if (storedB64Id && storedB64Id !== "native_biometric_active") try {
			const binary = atob(storedB64Id);
			const bytes = new Uint8Array(binary.length);
			for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
			allowCredentials = [{
				id: bytes,
				type: "public-key",
				transports: ["internal"]
			}];
		} catch (e) {
			console.warn("Could not parse stored credential ID:", e);
		}
		const publicKeyCredentialRequestOptions = {
			challenge,
			rpId: window.location.hostname,
			allowCredentials,
			userVerification: "required",
			timeout: 6e4
		};
		if (!await navigator.credentials.get({ publicKey: publicKeyCredentialRequestOptions })) return {
			success: false,
			error: "failed"
		};
		return { success: true };
	} catch (err) {
		console.warn("Biometric authentication error:", err);
		if (err?.name === "NotAllowedError") return {
			success: false,
			error: "cancelled_or_denied"
		};
		return {
			success: false,
			error: err?.message || "failed"
		};
	}
}
/**
* Deletes any biometric registration credentials.
*/
export function removeBiometricCredential() {
	try {
		localStorage.removeItem(CREDENTIAL_STORAGE_KEY);
	} catch {}
}
