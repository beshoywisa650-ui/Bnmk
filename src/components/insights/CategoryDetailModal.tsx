// @ts-nocheck
import React, { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from 'react/jsx-runtime';
import { ArrowLeft, X } from 'lucide-react';

import { useApp } from '../../context/AppContext';
import { Category, Expense } from '../../types';
import { CategoryIcon } from '../common/CategoryIcon';
import { formatCurrency, toArabicNumerals } from '../../utils/calculations';
import { formatDateLabel, getCategoryDisplayName } from '../../utils/i18n';
import { triggerHaptic } from '../../utils/haptics';
import { useBodyScrollLock } from '../../hooks/useBodyScrollLock';
import { useBackHandler } from '../../hooks/useBackHandler';


export const CategoryDetailModal = ({ category, expenses, currency, totalPeriodSpend, monthLabel, onClose, onSelectTransaction }) => {
	const { language, t } = useApp();
	useBodyScrollLock(Boolean(category));
	useBackHandler(Boolean(category), onClose, "category-detail");
	if (!category) return null;
	const categoryExpenses = expenses.filter((e) => e.categoryId === category.id && !e.isDeleted && e.type === "expense").sort((a, b) => `${b.date} ${b.time}`.localeCompare(`${a.date} ${a.time}`));
	const total = categoryExpenses.reduce((sum, e) => sum + e.amount, 0);
	const count = categoryExpenses.length;
	const average = count > 0 ? Math.round(total / count) : 0;
	const percentage = totalPeriodSpend > 0 ? Number((total / totalPeriodSpend * 100).toFixed(1)) : 0;
	const largestTransaction = categoryExpenses.length > 0 ? [...categoryExpenses].sort((a, b) => b.amount - a.amount)[0] : null;
	return /* @__PURE__ */ _jsxs("div", {
		className: "fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-slate-900/60 backdrop-blur-xs transition-opacity animate-in fade-in duration-150",
		children: [/* @__PURE__ */ _jsx("div", {
			className: "absolute inset-0",
			onClick: onClose,
			onTouchMove: (e) => e.preventDefault()
		}), /* @__PURE__ */ _jsxs("div", {
			className: "relative w-full sm:max-w-md bg-white dark:bg-slate-900 rounded-t-3xl sm:rounded-2xl shadow-2xl flex flex-col max-h-[85vh] overflow-hidden border border-slate-200/80 dark:border-slate-800 z-10",
			role: "dialog",
			"aria-modal": "true",
			children: [
				/* @__PURE__ */ _jsxs("div", {
					className: "flex items-center justify-between px-5 pt-4 pb-3 border-b border-slate-100 dark:border-slate-800",
					children: [/* @__PURE__ */ _jsxs("div", {
						className: "flex items-center gap-2.5",
						children: [
							/* @__PURE__ */ _jsx("button", {
								type: "button",
								onClick: onClose,
								className: "p-1.5 -ms-1 rounded-full text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer",
								title: language === "ar" ? "رجوع" : "Back",
								children: /* @__PURE__ */ _jsx(ArrowLeft, {
									size: 18,
									className: "rtl:rotate-180"
								})
							}),
							/* @__PURE__ */ _jsx(CategoryIcon, {
								name: category.icon,
								color: category.color,
								size: 20
							}),
							/* @__PURE__ */ _jsxs("div", { children: [/* @__PURE__ */ _jsx("h2", {
								className: "text-base font-bold text-slate-900 dark:text-white leading-tight",
								children: getCategoryDisplayName(category.name, language)
							}), monthLabel && /* @__PURE__ */ _jsx("span", {
								className: "text-[11px] font-medium text-slate-400 block",
								children: monthLabel
							})] })
						]
					}), /* @__PURE__ */ _jsx("button", {
						type: "button",
						onClick: onClose,
						"data-modal-close": "true",
						className: "p-1.5 rounded-full text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors cursor-pointer",
						"aria-label": t.detail.close,
						children: /* @__PURE__ */ _jsx(X, { size: 18 })
					})]
				}),
				/* @__PURE__ */ _jsxs("div", {
					className: "p-4 bg-slate-50 dark:bg-slate-800/40 border-b border-slate-100 dark:border-slate-800 grid grid-cols-4 gap-2 text-center text-xs",
					children: [
						/* @__PURE__ */ _jsxs("div", {
							className: "p-2 bg-white dark:bg-slate-900 rounded-xl border border-slate-200/60 dark:border-slate-800 shadow-2xs",
							children: [/* @__PURE__ */ _jsx("span", {
								className: "text-[10px] text-slate-400 uppercase font-semibold block",
								children: t.insights.catModalTotal
							}), /* @__PURE__ */ _jsx("span", {
								className: "font-bold text-slate-900 dark:text-white text-xs mt-0.5 block truncate",
								children: formatCurrency(total, currency, language)
							})]
						}),
						/* @__PURE__ */ _jsxs("div", {
							className: "p-2 bg-white dark:bg-slate-900 rounded-xl border border-slate-200/60 dark:border-slate-800 shadow-2xs",
							children: [/* @__PURE__ */ _jsx("span", {
								className: "text-[10px] text-slate-400 uppercase font-semibold block",
								children: t.insights.catModalShare
							}), /* @__PURE__ */ _jsxs("span", {
								className: "font-bold text-blue-600 dark:text-blue-400 text-xs mt-0.5 block",
								children: [percentage, "%"]
							})]
						}),
						/* @__PURE__ */ _jsxs("div", {
							className: "p-2 bg-white dark:bg-slate-900 rounded-xl border border-slate-200/60 dark:border-slate-800 shadow-2xs",
							children: [/* @__PURE__ */ _jsx("span", {
								className: "text-[10px] text-slate-400 uppercase font-semibold block",
								children: t.insights.catModalAverage
							}), /* @__PURE__ */ _jsx("span", {
								className: "font-bold text-slate-900 dark:text-white text-xs mt-0.5 block truncate",
								children: formatCurrency(average, currency, language)
							})]
						}),
						/* @__PURE__ */ _jsxs("div", {
							className: "p-2 bg-white dark:bg-slate-900 rounded-xl border border-slate-200/60 dark:border-slate-800 shadow-2xs",
							children: [/* @__PURE__ */ _jsx("span", {
								className: "text-[10px] text-slate-400 uppercase font-semibold block",
								children: t.insights.catModalLargest
							}), /* @__PURE__ */ _jsx("span", {
								className: "font-bold text-slate-900 dark:text-white text-xs mt-0.5 block truncate",
								children: largestTransaction ? formatCurrency(largestTransaction.amount, currency, language) : "—"
							})]
						})
					]
				}),
				/* @__PURE__ */ _jsxs("div", {
					className: "flex-1 overflow-y-auto no-scrollbar p-4 space-y-2",
					children: [/* @__PURE__ */ _jsxs("div", {
						className: "flex items-center justify-between text-xs text-slate-500 mb-1 px-1",
						children: [/* @__PURE__ */ _jsxs("span", { children: [
							t.insights.catModalTxns,
							" (",
							count,
							")"
						] }), /* @__PURE__ */ _jsx("span", { children: t.insights.catModalDateTime })]
					}), categoryExpenses.length === 0 ? /* @__PURE__ */ _jsx("p", {
						className: "text-xs text-slate-400 text-center py-8",
						children: t.insights.catModalEmpty
					}) : /* @__PURE__ */ _jsx("div", {
						className: "divide-y divide-slate-100 dark:divide-slate-800 bg-white dark:bg-slate-900 rounded-xl border border-slate-200/80 dark:border-slate-800 overflow-hidden",
						children: categoryExpenses.map((exp) => /* @__PURE__ */ _jsxs("div", {
							onClick: () => {
								onSelectTransaction(exp);
								onClose();
							},
							className: "p-3 flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-800/50 cursor-pointer text-xs",
							children: [/* @__PURE__ */ _jsxs("div", {
								className: "min-w-0 flex-1 pe-2",
								children: [/* @__PURE__ */ _jsx("span", {
									className: "font-semibold text-slate-900 dark:text-white block truncate leading-normal",
									title: exp.note || exp.merchant || getCategoryDisplayName(category.name, language),
									children: exp.note || exp.merchant || getCategoryDisplayName(category.name, language)
								}), /* @__PURE__ */ _jsxs("span", {
									className: "text-[10px] text-slate-400 block mt-0.5 leading-normal",
									children: [
										exp.date,
										" · ",
										exp.time || "12:00"
									]
								})]
							}), /* @__PURE__ */ _jsxs("span", {
								className: "font-bold text-slate-900 dark:text-white shrink-0",
								children: ["− ", formatCurrency(exp.amount, currency, language)]
							})]
						}, exp.id))
					})]
				})
			]
		})]
	});
};
