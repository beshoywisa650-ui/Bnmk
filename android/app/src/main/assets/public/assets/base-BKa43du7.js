import { a as isBiometryErrorType, n as BiometryError, o as App } from "./index-CC5T5v-6.js";
import { n as CapacitorException, r as WebPlugin } from "./dist-CQ4-fIe7.js";
// node_modules/@aparajita/capacitor-biometric-auth/dist/esm/base.js
var BiometricAuthBase = class extends WebPlugin {
	async authenticate(options) {
		try {
			await this.internalAuthenticate(options);
		} catch (error) {
			throw error instanceof CapacitorException && isBiometryErrorType(error.code) ? new BiometryError(error.message, error.code) : error;
		}
	}
	async addResumeListener(listener) {
		return App.addListener("appStateChange", ({ isActive }) => {
			if (isActive) (async () => {
				try {
					listener(await this.checkBiometry());
				} catch (error) {
					console.error(error);
				}
			})();
		});
	}
};
export { BiometricAuthBase as t };
