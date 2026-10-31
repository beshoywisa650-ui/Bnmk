// @ts-nocheck
import React, { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from 'react/jsx-runtime';
import { CircleCheck, Clock, Lock, Fingerprint, Delete } from 'lucide-react';

import { triggerHaptic } from '../../utils/haptics';
import { isBiometricsSupported, authenticateWithBiometrics } from '../../utils/biometrics';


export const LockScreen = ({ onUnlock, savedPasscode = "123456", biometricEnabled = true, pinEnabled = true, language = "ar" }) => {
	const [pin, setPin] = useState("");
	const [errorShake, setErrorShake] = useState(false);
	const [isSuccess, setIsSuccess] = useState(false);
	const [isBiometricChecking, setIsBiometricChecking] = useState(false);
	const [failedAttempts, setFailedAttempts] = useState(0);
	const [lockoutSecondsLeft, setLockoutSecondsLeft] = useState(0);
	const [statusMessage, setStatusMessage] = useState(() => {
		if (!pinEnabled && biometricEnabled) return language === "ar" ? "المس مستشعر البصمة لفتح التطبيق" : "Touch fingerprint sensor to unlock";
		if (biometricEnabled) return language === "ar" ? "أدخل رمز المرور (6 أرقام) أو استخدم البصمة" : "Enter 6-digit passcode or use biometrics";
		return language === "ar" ? "أدخل رمز المرور (6 أرقام) لفتح التطبيق" : "Enter 6-digit passcode to unlock";
	});
	const hasAutoPromptedRef = useRef(false);
	const targetPasscode = savedPasscode || "123456";
	const handleExitApp = useCallback(() => {
		try {
			if (Capacitor.isNativePlatform()) App$1.exitApp();
			else window.close();
		} catch {}
	}, []);
	useEffect(() => {
		if (lockoutSecondsLeft <= 0) return;
		const interval = setInterval(() => {
			setLockoutSecondsLeft((prev) => {
				if (prev <= 1) {
					clearInterval(interval);
					setStatusMessage(biometricEnabled ? language === "ar" ? "يمكنك الآن إدخال رمز المرور أو استخدام البصمة" : "You can now enter passcode or use biometrics" : language === "ar" ? "يمكنك الآن إدخال رمز المرور" : "You can now enter passcode");
					return 0;
				}
				return prev - 1;
			});
		}, 1e3);
		return () => clearInterval(interval);
	}, [
		lockoutSecondsLeft,
		biometricEnabled,
		language
	]);
	const handleUnlockSuccess = useCallback(() => {
		setIsSuccess(true);
		triggerHaptic("success");
		setFailedAttempts(0);
		setLockoutSecondsLeft(0);
		setStatusMessage(language === "ar" ? "تم تأكيد الهوية بنجاح" : "Authenticated successfully");
		setTimeout(() => {
			onUnlock();
		}, 300);
	}, [language, onUnlock]);
	const handleBiometricAuth = useCallback(async () => {
		if (isSuccess) return;
		setIsBiometricChecking(true);
		try {
			const res = await authenticateWithBiometrics();
			setIsBiometricChecking(false);
			if (res.success) handleUnlockSuccess();
			else {
				triggerHaptic("error");
				handleExitApp();
			}
		} catch {
			setIsBiometricChecking(false);
			handleExitApp();
		}
	}, [
		handleExitApp,
		handleUnlockSuccess,
		isSuccess
	]);
	useEffect(() => {
		if (!biometricEnabled || hasAutoPromptedRef.current) return;
		hasAutoPromptedRef.current = true;
		isBiometricsSupported().then((supported) => {
			if (supported) handleBiometricAuth();
			else if (!pinEnabled) handleExitApp();
		});
	}, [
		biometricEnabled,
		handleBiometricAuth,
		pinEnabled,
		handleExitApp
	]);
	const handleKeyPress = (digit) => {
		if (lockoutSecondsLeft > 0) {
			triggerHaptic("error");
			return;
		}
		if (pin.length >= 6 || isSuccess) return;
		triggerHaptic("light");
		const newPin = pin + digit;
		setPin(newPin);
		if (newPin.length === 6) {
			if (newPin === targetPasscode) handleUnlockSuccess();
			else {
				triggerHaptic("error");
				setErrorShake(true);
				const nextFails = failedAttempts + 1;
				setFailedAttempts(nextFails);
				if (nextFails >= 5) {
					const lockoutTime = nextFails >= 10 ? 300 : 60;
					setLockoutSecondsLeft(lockoutTime);
					setStatusMessage(language === "ar" ? `يرجى الانتظار ${lockoutTime} ثانية` : `Please wait ${lockoutTime}s`);
				} else setStatusMessage(language === "ar" ? "رمز المرور غير صحيح" : "Incorrect passcode");
				setTimeout(() => {
					setPin("");
					setErrorShake(false);
				}, 500);
			}
		}
	};
	useEffect(() => {
		const handleKeyDown = (e) => {
			if (isSuccess || lockoutSecondsLeft > 0) return;
			const normalizedKey = normalizeArabicNumerals(e.key);
			if (/^[0-9]$/.test(normalizedKey)) handleKeyPress(normalizedKey);
			else if (e.key === "Backspace") handleDelete();
		};
		window.addEventListener("keydown", handleKeyDown);
		return () => window.removeEventListener("keydown", handleKeyDown);
	}, [
		pin,
		isSuccess,
		targetPasscode,
		lockoutSecondsLeft
	]);
	const handleDelete = () => {
		if (lockoutSecondsLeft > 0) return;
		if (pin.length === 0 || isSuccess) return;
		triggerHaptic("light");
		setPin((prev) => prev.slice(0, -1));
	};
	const isKeypadDisabled = lockoutSecondsLeft > 0 || isSuccess;
	if (biometricEnabled) return /* @__PURE__ */ _jsx("div", {
		className: "fixed inset-0 z-50 flex flex-col items-center justify-center p-6 bg-black text-white select-none animate-in fade-in duration-150",
		children: /* @__PURE__ */ _jsx("div", {
			className: "flex flex-col items-center justify-center -mt-8",
			children: /* @__PURE__ */ _jsxs("div", {
				className: "relative",
				children: [/* @__PURE__ */ _jsx("div", { className: "absolute -inset-4 bg-blue-500/20 rounded-3xl blur-2xl opacity-60 pointer-events-none" }), /* @__PURE__ */ _jsx("img", {
					src: "/app-icon.png",
					alt: "Masrofy",
					className: `relative w-28 h-28 sm:w-32 sm:h-32 rounded-3xl shadow-2xl transition-all duration-300 ${isSuccess ? "scale-105 ring-4 ring-emerald-500/60 shadow-emerald-500/40" : isBiometricChecking ? "scale-100 ring-2 ring-blue-500/40 animate-pulse" : "scale-100"}`
				})]
			})
		})
	});
	return /* @__PURE__ */ _jsxs("div", {
		className: "fixed inset-0 z-50 flex flex-col items-center justify-between p-6 bg-black text-white select-none animate-in fade-in duration-200",
		children: [/* @__PURE__ */ _jsxs("div", {
			className: "w-full pt-6 sm:pt-8 flex flex-col items-center text-center space-y-3",
			children: [
				/* @__PURE__ */ _jsx("div", {
					className: `w-16 h-16 rounded-2xl flex items-center justify-center transition-all duration-300 shadow-xl ${isSuccess ? "bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 scale-105" : lockoutSecondsLeft > 0 ? "bg-amber-500/20 border border-amber-500/40 text-amber-400 animate-pulse" : "bg-zinc-900 border border-zinc-800 text-blue-400"}`,
					children: isSuccess ? /* @__PURE__ */ _jsx(CircleCheck, {
						size: 32,
						className: "text-emerald-400"
					}) : lockoutSecondsLeft > 0 ? /* @__PURE__ */ _jsx(Clock, {
						size: 30,
						className: "text-amber-400"
					}) : /* @__PURE__ */ _jsx(Lock, { size: 30 })
				}),
				/* @__PURE__ */ _jsx("div", { children: /* @__PURE__ */ _jsx("p", {
					className: "text-xs text-zinc-400 mt-1 min-h-[1.25rem] px-2 font-medium",
					children: statusMessage
				}) }),
				pinEnabled && (lockoutSecondsLeft > 0 ? /* @__PURE__ */ _jsxs("div", {
					className: "inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-300 text-xs font-bold animate-in fade-in",
					children: [/* @__PURE__ */ _jsx(Clock, { size: 14 }), /* @__PURE__ */ _jsx("span", { children: language === "ar" ? `متبقي ${lockoutSecondsLeft} ثانية` : `${lockoutSecondsLeft}s remaining` })]
				}) : /* @__PURE__ */ _jsx("div", {
					className: `flex items-center gap-3 pt-2 ${errorShake ? "animate-shake" : ""}`,
					children: [
						0,
						1,
						2,
						3,
						4,
						5
					].map((idx) => /* @__PURE__ */ _jsx("div", { className: `w-3.5 h-3.5 rounded-full border transition-all duration-200 ${pin.length > idx ? isSuccess ? "bg-emerald-400 border-emerald-400 scale-110 shadow-sm shadow-emerald-400/50" : errorShake ? "bg-rose-500 border-rose-500" : "bg-blue-500 border-blue-500 scale-110 shadow-sm shadow-blue-500/50" : "border-zinc-800 bg-zinc-900/60"}` }, idx))
				}))
			]
		}), pinEnabled && /* @__PURE__ */ _jsx("div", {
			className: "w-full max-w-xs pb-4 space-y-2.5",
			dir: "ltr",
			children: /* @__PURE__ */ _jsxs("div", {
				className: "grid grid-cols-3 gap-2.5",
				children: [
					[
						"1",
						"2",
						"3",
						"4",
						"5",
						"6",
						"7",
						"8",
						"9"
					].map((digit) => /* @__PURE__ */ _jsx("button", {
						type: "button",
						disabled: isKeypadDisabled,
						onClick: () => handleKeyPress(digit),
						className: `h-13 rounded-2xl text-xl font-mono font-bold flex items-center justify-center transition-all select-none border shadow-2xs ${isKeypadDisabled ? "bg-zinc-900/40 text-zinc-600 border-zinc-900 cursor-not-allowed opacity-50" : "bg-zinc-900 hover:bg-zinc-850 active:bg-blue-600/30 text-white cursor-pointer border-zinc-800 active:scale-95"}`,
						children: digit
					}, digit)),
					biometricEnabled ? /* @__PURE__ */ _jsx("button", {
						type: "button",
						onClick: () => handleBiometricAuth(),
						disabled: isSuccess,
						className: "h-13 rounded-2xl flex items-center justify-center transition-all cursor-pointer border select-none active:scale-95 bg-zinc-900 hover:bg-zinc-850 text-blue-400 border-zinc-800",
						title: "Biometrics",
						children: /* @__PURE__ */ _jsx(Fingerprint, { size: 22 })
					}) : /* @__PURE__ */ _jsx("div", { className: "h-13" }),
					/* @__PURE__ */ _jsx("button", {
						type: "button",
						disabled: isKeypadDisabled,
						onClick: () => handleKeyPress("0"),
						className: `h-13 rounded-2xl text-xl font-mono font-bold flex items-center justify-center transition-all select-none border shadow-2xs ${isKeypadDisabled ? "bg-zinc-900/40 text-zinc-600 border-zinc-900 cursor-not-allowed opacity-50" : "bg-zinc-900 hover:bg-zinc-850 active:bg-blue-600/30 text-white cursor-pointer border-zinc-800 active:scale-95"}`,
						children: "0"
					}),
					/* @__PURE__ */ _jsx("button", {
						type: "button",
						disabled: isKeypadDisabled,
						onClick: handleDelete,
						className: `h-13 rounded-2xl flex items-center justify-center transition-all select-none border ${isKeypadDisabled ? "bg-zinc-900/40 text-zinc-600 border-zinc-900 cursor-not-allowed opacity-50" : "bg-zinc-900 hover:bg-zinc-850 active:scale-95 text-zinc-300 cursor-pointer border-zinc-800"}`,
						title: "Delete",
						children: /* @__PURE__ */ _jsx(Delete, { size: 20 })
					})
				]
			})
		})]
	});
};
