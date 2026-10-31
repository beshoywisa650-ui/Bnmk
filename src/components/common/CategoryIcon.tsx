// @ts-nocheck
import React, { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from 'react/jsx-runtime';
import { Utensils, ShoppingCart, Car, Receipt, ShoppingBag, HeartPulse, Pill, Zap, Gamepad2, Film, GraduationCap, User, Coffee, Home, House, Tv, Briefcase, Plane, Gift, Smartphone, Dumbbell, CreditCard, Banknote, Landmark, PiggyBank, Laptop, TrendingUp, Award, PlusCircle, CirclePlus, Ellipsis } from 'lucide-react';


export const CategoryIcon = ({ name, color, size = 18, strokeWidth = 1.5, className = "", showBackground = true }) => {
	const getIcon = () => {
		switch (name) {
			case "Utensils": return /* @__PURE__ */ _jsx(Utensils, {
				size,
				strokeWidth
			});
			case "ShoppingCart": return /* @__PURE__ */ _jsx(ShoppingCart, {
				size,
				strokeWidth
			});
			case "Car": return /* @__PURE__ */ _jsx(Car, {
				size,
				strokeWidth
			});
			case "Receipt": return /* @__PURE__ */ _jsx(Receipt, {
				size,
				strokeWidth
			});
			case "ShoppingBag": return /* @__PURE__ */ _jsx(ShoppingBag, {
				size,
				strokeWidth
			});
			case "HeartPulse": return /* @__PURE__ */ _jsx(HeartPulse, {
				size,
				strokeWidth
			});
			case "Pill": return /* @__PURE__ */ _jsx(Pill, {
				size,
				strokeWidth
			});
			case "Zap": return /* @__PURE__ */ _jsx(Zap, {
				size,
				strokeWidth
			});
			case "Gamepad2": return /* @__PURE__ */ _jsx(Gamepad2, {
				size,
				strokeWidth
			});
			case "Film": return /* @__PURE__ */ _jsx(Film, {
				size,
				strokeWidth
			});
			case "GraduationCap": return /* @__PURE__ */ _jsx(GraduationCap, {
				size,
				strokeWidth
			});
			case "User": return /* @__PURE__ */ _jsx(User, {
				size,
				strokeWidth
			});
			case "Coffee": return /* @__PURE__ */ _jsx(Coffee, {
				size,
				strokeWidth
			});
			case "Home": return /* @__PURE__ */ _jsx(House, {
				size,
				strokeWidth
			});
			case "Tv": return /* @__PURE__ */ _jsx(Tv, {
				size,
				strokeWidth
			});
			case "Briefcase": return /* @__PURE__ */ _jsx(Briefcase, {
				size,
				strokeWidth
			});
			case "Plane": return /* @__PURE__ */ _jsx(Plane, {
				size,
				strokeWidth
			});
			case "Gift": return /* @__PURE__ */ _jsx(Gift, {
				size,
				strokeWidth
			});
			case "Smartphone": return /* @__PURE__ */ _jsx(Smartphone, {
				size,
				strokeWidth
			});
			case "Dumbbell": return /* @__PURE__ */ _jsx(Dumbbell, {
				size,
				strokeWidth
			});
			case "CreditCard": return /* @__PURE__ */ _jsx(CreditCard, {
				size,
				strokeWidth
			});
			case "Banknote": return /* @__PURE__ */ _jsx(Banknote, {
				size,
				strokeWidth
			});
			case "Landmark": return /* @__PURE__ */ _jsx(Landmark, {
				size,
				strokeWidth
			});
			case "PiggyBank": return /* @__PURE__ */ _jsx(PiggyBank, {
				size,
				strokeWidth
			});
			case "Laptop": return /* @__PURE__ */ _jsx(Laptop, {
				size,
				strokeWidth
			});
			case "TrendingUp": return /* @__PURE__ */ _jsx(TrendingUp, {
				size,
				strokeWidth
			});
			case "Award": return /* @__PURE__ */ _jsx(Award, {
				size,
				strokeWidth
			});
			case "PlusCircle": return /* @__PURE__ */ _jsx(CirclePlus, {
				size,
				strokeWidth
			});
			default: return /* @__PURE__ */ _jsx(Ellipsis, {
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
