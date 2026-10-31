// @ts-nocheck
import React, { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from 'react/jsx-runtime';
import { Banknote, Wallet, Landmark, Building2, CreditCard, Smartphone, PiggyBank, Coins, ArrowLeftRight, Briefcase, Utensils, ShoppingCart, Car, Zap, Coffee, HeartPulse, ShoppingBag, Gamepad2, Home, House, GraduationCap, Dumbbell, Plane, Gift, Laptop, Tag, Icon, Check } from 'lucide-react';

import { PRESET_CATEGORY_ICONS, PRESET_ACCOUNT_ICONS } from '../../utils/iconPresets';
import { triggerHaptic } from '../../utils/haptics';
import { CategoryIcon } from './CategoryIcon';
import { AccountIcon } from './AccountIcon';


function renderItemIcon(iconName, size = 18) {
	switch (iconName) {
		case "Banknote": return /* @__PURE__ */ _jsx(Banknote, { size });
		case "Wallet": return /* @__PURE__ */ _jsx(Wallet, { size });
		case "Landmark": return /* @__PURE__ */ _jsx(Landmark, { size });
		case "Building2": return /* @__PURE__ */ _jsx(Building2, { size });
		case "CreditCard": return /* @__PURE__ */ _jsx(CreditCard, { size });
		case "Smartphone": return /* @__PURE__ */ _jsx(Smartphone, { size });
		case "PiggyBank": return /* @__PURE__ */ _jsx(PiggyBank, { size });
		case "Coins": return /* @__PURE__ */ _jsx(Coins, { size });
		case "ArrowLeftRight": return /* @__PURE__ */ _jsx(ArrowLeftRight, { size });
		case "Briefcase": return /* @__PURE__ */ _jsx(Briefcase, { size });
		case "Utensils": return /* @__PURE__ */ _jsx(Utensils, { size });
		case "ShoppingCart": return /* @__PURE__ */ _jsx(ShoppingCart, { size });
		case "Car": return /* @__PURE__ */ _jsx(Car, { size });
		case "Zap": return /* @__PURE__ */ _jsx(Zap, { size });
		case "Coffee": return /* @__PURE__ */ _jsx(Coffee, { size });
		case "HeartPulse": return /* @__PURE__ */ _jsx(HeartPulse, { size });
		case "ShoppingBag": return /* @__PURE__ */ _jsx(ShoppingBag, { size });
		case "Gamepad2": return /* @__PURE__ */ _jsx(Gamepad2, { size });
		case "Home": return /* @__PURE__ */ _jsx(House, { size });
		case "GraduationCap": return /* @__PURE__ */ _jsx(GraduationCap, { size });
		case "Dumbbell": return /* @__PURE__ */ _jsx(Dumbbell, { size });
		case "Plane": return /* @__PURE__ */ _jsx(Plane, { size });
		case "Gift": return /* @__PURE__ */ _jsx(Gift, { size });
		case "Laptop": return /* @__PURE__ */ _jsx(Laptop, { size });
		default: return /* @__PURE__ */ _jsx(Tag, { size });
	}
}
export const StyledIconSelector = ({ selectedIcon, onSelect, language = "ar", targetType = "category" }) => {
	return /* @__PURE__ */ _jsxs("div", {
		className: "space-y-1.5",
		children: [/* @__PURE__ */ _jsx("label", {
			className: "text-xs font-bold text-slate-700 dark:text-slate-300 block",
			children: targetType === "account" ? language === "ar" ? "أيقونة المحفظة:" : "Wallet Icon:" : language === "ar" ? "أيقونة التصنيف:" : "Category Icon:"
		}), /* @__PURE__ */ _jsx("div", {
			className: "flex flex-wrap items-center gap-2.5 p-2.5 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800/80",
			children: (targetType === "account" ? PRESET_ACCOUNT_ICONS : PRESET_CATEGORY_ICONS).map((item) => {
				const isSelected = selectedIcon === item.icon || selectedIcon === item.id;
				return /* @__PURE__ */ _jsxs("button", {
					type: "button",
					onClick: () => onSelect(item.icon, item.color || "#64748B"),
					title: language === "ar" ? item.nameAr : item.nameEn,
					"aria-label": language === "ar" ? item.nameAr : item.nameEn,
					className: `w-10 h-10 rounded-full border flex items-center justify-center bg-transparent transition-all cursor-pointer relative shrink-0 ${isSelected ? "border-slate-900 dark:border-white ring-2 ring-slate-900/15 dark:ring-white/20 text-slate-900 dark:text-white font-bold scale-105 z-10" : "border-slate-300 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:border-slate-400 hover:text-slate-800 dark:hover:text-white"}`,
					children: [renderItemIcon(item.icon, 18), isSelected && /* @__PURE__ */ _jsx("div", {
						className: "absolute -top-1 -right-1 w-4 h-4 rounded-full bg-slate-900 dark:bg-white text-white dark:text-slate-900 flex items-center justify-center shadow-xs",
						children: /* @__PURE__ */ _jsx(Check, {
							size: 10,
							strokeWidth: 3
						})
					})]
				}, item.id);
			})
		})]
	});
};
