// @ts-nocheck
import React, { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from 'react/jsx-runtime';
import { Banknote, Landmark, Building2, CreditCard, Smartphone, PiggyBank, Coins, Briefcase, ArrowLeftRight, Wallet } from 'lucide-react';


export const AccountIcon = ({ type = "other", name, color, size = 18, strokeWidth = 1.5, className = "", showBackground = true }) => {
	const getIcon = () => {
		switch (name || type) {
			case "cash":
			case "Banknote": return /* @__PURE__ */ _jsx(Banknote, {
				size,
				strokeWidth
			});
			case "bank":
			case "Landmark": return /* @__PURE__ */ _jsx(Landmark, {
				size,
				strokeWidth
			});
			case "building":
			case "Building2": return /* @__PURE__ */ _jsx(Building2, {
				size,
				strokeWidth
			});
			case "credit_card":
			case "debit_card":
			case "card":
			case "CreditCard": return /* @__PURE__ */ _jsx(CreditCard, {
				size,
				strokeWidth
			});
			case "mobile_wallet":
			case "Smartphone": return /* @__PURE__ */ _jsx(Smartphone, {
				size,
				strokeWidth
			});
			case "savings":
			case "PiggyBank": return /* @__PURE__ */ _jsx(PiggyBank, {
				size,
				strokeWidth
			});
			case "coins":
			case "Coins": return /* @__PURE__ */ _jsx(Coins, {
				size,
				strokeWidth
			});
			case "business":
			case "Briefcase": return /* @__PURE__ */ _jsx(Briefcase, {
				size,
				strokeWidth
			});
			case "transfer":
			case "instapay":
			case "ArrowLeftRight": return /* @__PURE__ */ _jsx(ArrowLeftRight, {
				size,
				strokeWidth
			});
			default: return /* @__PURE__ */ _jsx(Wallet, {
				size,
				strokeWidth
			});
		}
	};
	if (!showBackground) return /* @__PURE__ */ _jsx("span", {
		style: color ? { color } : void 0,
		className: `inline-flex items-center justify-center shrink-0 ${className}`,
		children: getIcon()
	});
	const customStyle = color ? {
		backgroundColor: `${color}18`,
		borderColor: `${color}30`,
		color
	} : {};
	return /* @__PURE__ */ _jsx("div", {
		style: customStyle,
		className: `w-10 h-10 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-100/70 dark:bg-slate-800/60 text-slate-700 dark:text-slate-200 flex items-center justify-center shrink-0 transition-all shadow-2xs ${className}`,
		children: getIcon()
	});
};
