// @ts-nocheck
import { Capacitor } from '@capacitor/core';
import { App as CapacitorApp } from '@capacitor/app';


export class NavigationManager {
	constructor() {
		this.modalStack = [];
		this.currentTab = "home";
		this.isLocked = false;
		this.isInitialized = false;
	}
	init(initialTab, onSwitchTab, _onShowExitToast) {
		this.currentTab = initialTab;
		this.onSwitchTab = onSwitchTab;
		if (this.isInitialized) return;
		this.isInitialized = true;
		try {
			if (Capacitor.isNativePlatform()) CapacitorApp.addListener("backButton", () => {
				this.handleBackPress(true);
			});
		} catch {}
		if (typeof window !== "undefined") {
			window.addEventListener("popstate", () => {
				if (this.handleBackPress(false)) try {
					window.history.pushState({ app: "masrofy" }, "");
				} catch {}
			});
			try {
				if (!window.history.state) window.history.replaceState({ app: "masrofy" }, "");
			} catch {}
		}
	}
	setTab(tab) {
		this.currentTab = tab;
	}
	setLocked(locked) {
		this.isLocked = locked;
	}
	pushModal(id, onBack) {
		this.removeModal(id);
		this.modalStack.push({
			id,
			onBack
		});
		if (typeof window !== "undefined") try {
			window.history.pushState({ modal: id }, "");
		} catch {}
	}
	removeModal(id) {
		this.modalStack = this.modalStack.filter((m) => m.id !== id);
	}
	handleBackPress(_isNative = false) {
		if (this.isLocked) {
			try {
				if (Capacitor.isNativePlatform()) CapacitorApp.exitApp();
			} catch {}
			return false;
		}
		if (this.modalStack.length > 0) {
			const topModal = this.modalStack.pop();
			if (topModal) {
				topModal.onBack();
				return true;
			}
		}
		try {
			if (Capacitor.isNativePlatform()) {
				CapacitorApp.exitApp();
			} else if (typeof window !== "undefined") {
				window.close();
			}
		} catch {}
		return false;
	}
};
export const navigationManager = new NavigationManager();
