// @ts-nocheck
import React, { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from 'react/jsx-runtime';
import { Target, X, CircleAlert, Check, Save } from 'lucide-react';

import { parseMoneyInput, formatCurrency, toArabicNumerals } from '../../utils/calculations';
import { triggerHaptic } from '../../utils/haptics';
import { useBodyScrollLock } from '../../hooks/useBodyScrollLock';
import { useBackHandler } from '../../hooks/useBackHandler';


export const QuickBudgetModal = ({ isOpen, onClose, currentBudget, currencySymbol, onSave, language }) => {
	const [amount, setAmount] = useState("");
	const [error, setError] = useState(null);
	const [isSubmitting, setIsSubmitting] = useState(false);
	const inputRef = useRef(null);
	useBodyScrollLock(isOpen);
	useBackHandler(isOpen, onClose, "quick-budget");
	useEffect(() => {
		if (isOpen) {
			setAmount(currentBudget > 0 ? String(currentBudget) : "");
			setError(null);
		}
	}, [isOpen, currentBudget]);
	if (!isOpen) return null;
	const handleSubmit = async (e) => {
		e.preventDefault();
		setError(null);
		const parsed = parseMoneyInput(amount);
		if (!parsed.valid || parsed.amount <= 0) {
			setError(language === "ar" ? "يرجى إدخال مبلغ صحيح أكبر من الصفر للميزانية." : "Please enter a valid amount greater than 0.");
			return;
		}
		try {
			setIsSubmitting(true);
			triggerHaptic("medium");
			await onSave(parsed.amount);
			onClose();
		} catch (err) {
			setError(err?.message || (language === "ar" ? "فشل حفظ الميزانية." : "Failed to save budget."));
		} finally {
			setIsSubmitting(false);
		}
	};
	return /* @__PURE__ */ _jsxs("div", {
		className: "fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs transition-opacity animate-in fade-in duration-200",
		children: [/* @__PURE__ */ _jsx("div", {
			className: "absolute inset-0",
			onClick: onClose
		}), /* @__PURE__ */ _jsxs("div", {
			className: "relative w-full max-w-sm bg-white dark:bg-slate-900 rounded-3xl shadow-2xl p-5 border border-slate-200 dark:border-slate-800 z-10 animate-in zoom-in-95 duration-200 space-y-4",
			role: "dialog",
			"aria-modal": "true",
			children: [
				/* @__PURE__ */ _jsxs("div", {
					className: "flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800",
					children: [/* @__PURE__ */ _jsxs("div", {
						className: "flex items-center gap-2",
						children: [/* @__PURE__ */ _jsx("div", {
							className: "w-8 h-8 rounded-full border border-slate-300 dark:border-slate-700 flex items-center justify-center text-amber-500 shrink-0",
							children: /* @__PURE__ */ _jsx(Target, { size: 16 })
						}), /* @__PURE__ */ _jsx("h2", {
							className: "text-base font-bold text-slate-900 dark:text-white",
							children: language === "ar" ? "تحديد ميزانية الشهر" : "Monthly Budget"
						})]
					}), /* @__PURE__ */ _jsx("button", {
						type: "button",
						onClick: onClose,
						className: "p-1.5 rounded-full text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer",
						children: /* @__PURE__ */ _jsx(X, { size: 18 })
					})]
				}),
				error && /* @__PURE__ */ _jsxs("div", {
					className: "p-3 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 text-xs text-rose-700 dark:text-rose-300 flex items-center gap-2",
					children: [/* @__PURE__ */ _jsx(CircleAlert, {
						size: 15,
						className: "shrink-0 text-rose-500"
					}), /* @__PURE__ */ _jsx("span", { children: error })]
				}),
				/* @__PURE__ */ _jsxs("form", {
					onSubmit: handleSubmit,
					className: "space-y-4",
					children: [/* @__PURE__ */ _jsx("div", { children: /* @__PURE__ */ _jsxs("div", {
						className: "flex items-center justify-center gap-2 p-4 bg-slate-50 dark:bg-slate-800/40 rounded-2xl border border-slate-200/80 dark:border-slate-700/80",
						children: [/* @__PURE__ */ _jsx("input", {
							ref: inputRef,
							type: "text",
							inputMode: "decimal",
							value: amount,
							onChange: (e) => {
								setAmount(e.target.value);
								setError(null);
							},
							placeholder: "0",
							className: "w-40 text-center text-3xl sm:text-4xl font-black bg-transparent border-b-2 border-transparent focus:border-amber-500 focus:outline-hidden text-slate-900 dark:text-white"
						}), currencySymbol && /* @__PURE__ */ _jsx("span", {
							className: "text-base font-bold text-slate-400 dark:text-slate-500 select-none",
							children: currencySymbol
						})]
					}) }), /* @__PURE__ */ _jsxs("button", {
						type: "submit",
						disabled: isSubmitting,
						className: "w-full py-3 px-4 rounded-2xl bg-amber-500 hover:bg-amber-600 active:scale-[0.99] text-white font-bold text-sm shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50",
						children: [/* @__PURE__ */ _jsx(Check, {
							size: 18,
							strokeWidth: 2.5
						}), /* @__PURE__ */ _jsx("span", { children: isSubmitting ? language === "ar" ? "جاري الحفظ..." : "Saving..." : language === "ar" ? "حفظ وتفعيل الميزانية" : "Save Budget" })]
					})]
				})
			]
		})]
	});
};
