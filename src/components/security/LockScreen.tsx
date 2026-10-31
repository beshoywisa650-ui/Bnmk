// @ts-nocheck
import React, { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import { jsx as _jsx, jsxs as _jsxs } from 'react/jsx-runtime';
import { CircleCheck, Clock, Lock, Fingerprint, Delete } from 'lucide-react';
import { Capacitor } from '@capacitor/core';
import { App as CapacitorApp } from '@capacitor/app';

import { triggerHaptic } from '../../utils/haptics';
import { isBiometricsSupported, authenticateWithBiometrics } from '../../utils/biometrics';
import { normalizeArabicNumerals } from '../../utils/calculations';

export const LockScreen = ({ 
  onUnlock, 
  savedPasscode = "123456", 
  biometricEnabled = true, 
  pinEnabled = true, 
  language = "ar" 
}) => {
  const [pin, setPin] = useState("");
  const [errorShake, setErrorShake] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isBiometricChecking, setIsBiometricChecking] = useState(false);
  const [failedAttempts, setFailedAttempts] = useState(0);
  const [lockoutSecondsLeft, setLockoutSecondsLeft] = useState(0);
  const [statusMessage, setStatusMessage] = useState(() => {
    if (!pinEnabled && biometricEnabled) {
      return language === "ar" ? "المس مستشعر البصمة لفتح التطبيق" : "Touch fingerprint sensor to unlock";
    }
    if (biometricEnabled) {
      return language === "ar" ? "أدخل رمز المرور أو استخدم البصمة" : "Enter passcode or use biometrics";
    }
    return language === "ar" ? "أدخل رمز المرور لفتح التطبيق" : "Enter passcode to unlock";
  });
  
  const hasAutoPromptedRef = useRef(false);
  const targetPasscode = savedPasscode || "123456";

  const handleExitApp = useCallback(() => {
    try {
      if (Capacitor.isNativePlatform()) {
        CapacitorApp.exitApp();
      } else if (typeof window !== "undefined") {
        window.close();
      }
    } catch {}
  }, []);

  const handleUnlockSuccess = useCallback(() => {
    setIsSuccess(true);
    triggerHaptic("success");
    // Unlock instantly without any intermediate transition screen
    onUnlock();
  }, [onUnlock]);

  const handleBiometricAuth = useCallback(async () => {
    if (isSuccess) return;
    setIsBiometricChecking(true);
    try {
      const res = await authenticateWithBiometrics();
      setIsBiometricChecking(false);
      if (res && res.success) {
        handleUnlockSuccess();
      } else {
        triggerHaptic("warning");
      }
    } catch {
      setIsBiometricChecking(false);
    }
  }, [handleUnlockSuccess, isSuccess]);

  useEffect(() => {
    if (!biometricEnabled || hasAutoPromptedRef.current) return;
    hasAutoPromptedRef.current = true;
    isBiometricsSupported().then((supported) => {
      if (supported) {
        handleBiometricAuth();
      }
    });
  }, [biometricEnabled, handleBiometricAuth]);

  useEffect(() => {
    if (lockoutSecondsLeft <= 0) return;
    const interval = setInterval(() => {
      setLockoutSecondsLeft((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          setStatusMessage(
            biometricEnabled 
              ? (language === "ar" ? "يمكنك الآن إدخال رمز المرور أو استخدام البصمة" : "You can now enter passcode or use biometrics")
              : (language === "ar" ? "يمكنك الآن إدخال رمز المرور" : "You can now enter passcode")
          );
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [lockoutSecondsLeft, biometricEnabled, language]);

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
      if (newPin === targetPasscode) {
        handleUnlockSuccess();
      } else {
        triggerHaptic("error");
        setErrorShake(true);
        const newFailed = failedAttempts + 1;
        setFailedAttempts(newFailed);
        if (newFailed >= 5) {
          const lockoutTime = 30;
          setLockoutSecondsLeft(lockoutTime);
          setStatusMessage(language === "ar" ? `يرجى الانتظار ${lockoutTime} ثانية` : `Please wait ${lockoutTime}s`);
        } else {
          setStatusMessage(language === "ar" ? "رمز المرور غير صحيح" : "Incorrect passcode");
        }
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
      if (/^[0-9]$/.test(normalizedKey)) {
        handleKeyPress(normalizedKey);
      } else if (e.key === "Backspace") {
        handleDelete();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [pin, isSuccess, targetPasscode, lockoutSecondsLeft]);

  const handleDelete = () => {
    if (lockoutSecondsLeft > 0) return;
    if (pin.length === 0 || isSuccess) return;
    triggerHaptic("light");
    setPin((prev) => prev.slice(0, -1));
  };

  const isKeypadDisabled = lockoutSecondsLeft > 0 || isSuccess;

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-between p-6 bg-slate-950 text-white select-none animate-in fade-in duration-150">
      <div className="w-full pt-8 sm:pt-10 flex flex-col items-center text-center space-y-3">
        <div className={`w-16 h-16 rounded-2xl flex items-center justify-center transition-all duration-200 shadow-xl ${
          isSuccess 
            ? "bg-emerald-500/20 border border-emerald-500/40 text-emerald-400" 
            : lockoutSecondsLeft > 0 
            ? "bg-amber-500/20 border border-amber-500/40 text-amber-400 animate-pulse" 
            : "bg-zinc-900 border border-zinc-800 text-blue-400"
        }`}>
          {isSuccess ? (
            <CircleCheck size={32} className="text-emerald-400" />
          ) : lockoutSecondsLeft > 0 ? (
            <Clock size={30} className="text-amber-400" />
          ) : (
            <Lock size={30} />
          )}
        </div>

        <div>
          <p className="text-xs text-zinc-400 mt-1 min-h-[1.25rem] px-2 font-medium">
            {statusMessage}
          </p>
        </div>

        {pinEnabled && (
          lockoutSecondsLeft > 0 ? (
            <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-300 text-xs font-bold animate-in fade-in">
              <Clock size={14} />
              <span>{language === "ar" ? `متبقي ${lockoutSecondsLeft} ثانية` : `${lockoutSecondsLeft}s remaining`}</span>
            </div>
          ) : (
            <div className={`flex items-center gap-3 pt-2 ${errorShake ? "animate-shake" : ""}`}>
              {[0, 1, 2, 3, 4, 5].map((idx) => (
                <div
                  key={idx}
                  className={`w-3.5 h-3.5 rounded-full border transition-all duration-200 ${
                    pin.length > idx
                      ? isSuccess
                        ? "bg-emerald-400 border-emerald-400 scale-110 shadow-sm shadow-emerald-400/50"
                        : errorShake
                        ? "bg-rose-500 border-rose-500"
                        : "bg-blue-500 border-blue-500 scale-110 shadow-sm shadow-blue-500/50"
                      : "border-zinc-800 bg-zinc-900/60"
                  }`}
                />
              ))}
            </div>
          )
        )}
      </div>

      {pinEnabled ? (
        <div className="w-full max-w-xs pb-6 space-y-2.5" dir="ltr">
          <div className="grid grid-cols-3 gap-2.5">
            {["1", "2", "3", "4", "5", "6", "7", "8", "9"].map((digit) => (
              <button
                key={digit}
                type="button"
                disabled={isKeypadDisabled}
                onClick={() => handleKeyPress(digit)}
                className={`h-13 rounded-2xl text-xl font-mono font-bold flex items-center justify-center transition-all select-none border shadow-2xs ${
                  isKeypadDisabled
                    ? "bg-zinc-900/40 text-zinc-600 border-zinc-900 cursor-not-allowed opacity-50"
                    : "bg-zinc-900 hover:bg-zinc-850 active:bg-blue-600/30 text-white cursor-pointer border-zinc-800 active:scale-95"
                }`}
              >
                {digit}
              </button>
            ))}

            {biometricEnabled ? (
              <button
                type="button"
                onClick={() => handleBiometricAuth()}
                disabled={isSuccess || isBiometricChecking}
                className="h-13 rounded-2xl flex items-center justify-center transition-all cursor-pointer border select-none active:scale-95 bg-zinc-900 hover:bg-zinc-850 text-blue-400 border-zinc-800"
                title="Biometrics"
              >
                <Fingerprint size={22} className={isBiometricChecking ? "animate-pulse" : ""} />
              </button>
            ) : (
              <div className="h-13" />
            )}

            <button
              type="button"
              disabled={isKeypadDisabled}
              onClick={() => handleKeyPress("0")}
              className={`h-13 rounded-2xl text-xl font-mono font-bold flex items-center justify-center transition-all select-none border shadow-2xs ${
                isKeypadDisabled
                  ? "bg-zinc-900/40 text-zinc-600 border-zinc-900 cursor-not-allowed opacity-50"
                  : "bg-zinc-900 hover:bg-zinc-850 active:bg-blue-600/30 text-white cursor-pointer border-zinc-800 active:scale-95"
              }`}
            >
              0
            </button>

            <button
              type="button"
              disabled={isKeypadDisabled}
              onClick={handleDelete}
              className={`h-13 rounded-2xl flex items-center justify-center transition-all select-none border ${
                isKeypadDisabled
                  ? "bg-zinc-900/40 text-zinc-600 border-zinc-900 cursor-not-allowed opacity-50"
                  : "bg-zinc-900 hover:bg-zinc-850 active:scale-95 text-zinc-300 cursor-pointer border-zinc-800"
              }`}
              title="Delete"
            >
              <Delete size={20} />
            </button>
          </div>
        </div>
      ) : (
        biometricEnabled && (
          <div className="w-full max-w-xs pb-12 flex flex-col items-center gap-4">
            <button
              type="button"
              onClick={() => handleBiometricAuth()}
              disabled={isSuccess || isBiometricChecking}
              className="w-20 h-20 rounded-3xl bg-blue-600 hover:bg-blue-500 active:scale-95 flex items-center justify-center text-white shadow-xl shadow-blue-600/30 transition-all cursor-pointer"
            >
              <Fingerprint size={36} className={isBiometricChecking ? "animate-pulse" : ""} />
            </button>
            <span className="text-xs text-zinc-400 font-medium">
              {language === "ar" ? "اضغط لإعادة المحاولة بالبصمة" : "Tap to retry biometrics"}
            </span>
          </div>
        )
      )}
    </div>
  );
};
