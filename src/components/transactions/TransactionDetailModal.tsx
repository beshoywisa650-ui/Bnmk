// @ts-nocheck
import React, { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from 'react/jsx-runtime';
import { ArrowLeft, X, ArrowLeftRight, MoreHorizontal, ArrowDownLeft, ArrowUpRight, CreditCard, Store, Calendar, Clock, FileText, PenLine, Copy, Trash2 } from 'lucide-react';

import { useApp } from '../../context/AppContext';
import { Expense, Category, Account } from '../../types';
import { CategoryIcon } from '../common/CategoryIcon';
import { AccountIcon } from '../common/AccountIcon';
import { formatCurrency, toArabicNumerals } from '../../utils/calculations';
import { formatDateLabel, getCategoryDisplayName, getAccountDisplayName } from '../../utils/i18n';
import { triggerHaptic } from '../../utils/haptics';
import { useBodyScrollLock } from '../../hooks/useBodyScrollLock';
import { useBackHandler } from '../../hooks/useBackHandler';


export const TransactionDetailModal = ({ expense, onClose, onEdit }) => {
	const { categories, accounts, removeExpense, duplicateExpense, settings, isPrivacyMode, language, t } = useApp();
	const [isConfirmingDelete, setIsConfirmingDelete] = useState(false);
	useBodyScrollLock(Boolean(expense));
	useBackHandler(Boolean(expense), onClose, "transaction-detail");
	useBackHandler(isConfirmingDelete, () => setIsConfirmingDelete(false), "transaction-delete-confirm");
	if (!expense) return null;
	const isExpense = expense.type === "expense";
	const isIncome = expense.type === "income";
	const isTransfer = expense.type === "transfer";
	const category = categories.find((c) => c.id === expense.categoryId);
	const account = accounts.find((a) => a.id === expense.paymentMethodId || a.id === expense.accountId);
	const fromAccount = accounts.find((a) => a.id === (expense.fromAccountId || expense.accountId));
	const toAccount = accounts.find((a) => a.id === expense.toAccountId);
	const handleDelete = async () => {
		await removeExpense(expense.id);
		setIsConfirmingDelete(false);
		onClose();
	};
	const transferArrow = language === "ar" ? "←" : "→";
	return /* @__PURE__ */ _jsxs("div", {
		className: "fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-slate-900/60 backdrop-blur-xs transition-opacity animate-in fade-in duration-150",
		children: [/* @__PURE__ */ _jsx("div", {
			className: "absolute inset-0",
			onClick: onClose
		}), /* @__PURE__ */ _jsxs("div", {
			className: "relative w-full sm:max-w-md bg-white dark:bg-slate-900 rounded-t-3xl sm:rounded-2xl shadow-2xl overflow-hidden border border-slate-200/80 dark:border-slate-800 z-10",
			role: "dialog",
			"aria-modal": "true",
			children: [
				/* @__PURE__ */ _jsxs("div", {
					className: "flex items-center justify-between px-5 pt-4 pb-2 border-b border-slate-100 dark:border-slate-800",
					children: [/* @__PURE__ */ _jsxs("div", {
						className: "flex items-center gap-2",
						children: [/* @__PURE__ */ _jsx("button", {
							type: "button",
							onClick: onClose,
							className: "p-1.5 -ms-1 rounded-full text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer",
							title: language === "ar" ? "رجوع" : "Back",
							children: /* @__PURE__ */ _jsx(ArrowLeft, {
								size: 18,
								className: "rtl:rotate-180"
							})
						}), /* @__PURE__ */ _jsx("span", {
							className: "text-sm font-bold text-slate-700 dark:text-slate-300",
							children: isTransfer ? language === "ar" ? "تفاصيل التحويل" : "Transfer Details" : t.detail.title
						})]
					}), /* @__PURE__ */ _jsx("button", {
						type: "button",
						onClick: onClose,
						className: "p-1.5 rounded-full text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer",
						"aria-label": t.detail.close,
						children: /* @__PURE__ */ _jsx(X, { size: 18 })
					})]
				}),
				/* @__PURE__ */ _jsxs("div", {
					className: "p-6 text-center border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30",
					children: [
						/* @__PURE__ */ _jsx("div", {
							className: "inline-flex items-center justify-center mb-3",
							children: isTransfer ? /* @__PURE__ */ _jsx("div", {
								className: "w-14 h-14 rounded-full border border-slate-300 dark:border-slate-700 bg-transparent text-slate-700 dark:text-slate-200 flex items-center justify-center shrink-0",
								children: /* @__PURE__ */ _jsx(ArrowLeftRight, {
									size: 24,
									className: "rtl:rotate-180"
								})
							}) : /* @__PURE__ */ _jsx(CategoryIcon, {
								name: category?.icon || "MoreHorizontal",
								size: 24,
								className: "w-14 h-14"
							})
						}),
						/* @__PURE__ */ _jsxs("div", {
							className: "flex items-center justify-center gap-2",
							children: [
								isExpense && /* @__PURE__ */ _jsx(ArrowDownLeft, {
									size: 24,
									className: "text-rose-500 shrink-0"
								}),
								isIncome && /* @__PURE__ */ _jsx(ArrowUpRight, {
									size: 24,
									className: "text-emerald-500 shrink-0"
								}),
								isTransfer && /* @__PURE__ */ _jsx(ArrowLeftRight, {
									size: 22,
									className: "text-blue-500 shrink-0 rtl:rotate-180"
								}),
								/* @__PURE__ */ _jsxs("h1", {
									className: "text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight",
									children: [isExpense ? "− " : isIncome ? "+ " : "", formatCurrency(expense.amount, settings.currency, language, isPrivacyMode)]
								})
							]
						}),
						/* @__PURE__ */ _jsx("p", {
							className: "text-base font-semibold text-slate-800 dark:text-slate-200 mt-1",
							children: isTransfer ? `${getAccountDisplayName(fromAccount?.name || "Account", language)} ${transferArrow} ${getAccountDisplayName(toAccount?.name || "Account", language)}` : getCategoryDisplayName(category?.name || "Uncategorized", language)
						}),
						expense.note && /* @__PURE__ */ _jsxs("p", {
							className: "text-sm text-slate-500 dark:text-slate-400 mt-0.5 max-w-xs mx-auto",
							children: [
								"\"",
								expense.note,
								"\""
							]
						})
					]
				}),
				/* @__PURE__ */ _jsxs("div", {
					className: "p-5 space-y-3 text-sm text-slate-700 dark:text-slate-300",
					children: [
						isTransfer ? /* @__PURE__ */ _jsxs(_Fragment, { children: [/* @__PURE__ */ _jsxs("div", {
							className: "flex items-center justify-between py-1.5 border-b border-slate-100 dark:border-slate-800",
							children: [/* @__PURE__ */ _jsxs("span", {
								className: "text-slate-500 dark:text-slate-400 flex items-center gap-2",
								children: [
									/* @__PURE__ */ _jsx(CreditCard, { size: 16 }),
									" ",
									t.detail.fromAccount
								]
							}), /* @__PURE__ */ _jsx("span", {
								className: "font-semibold text-slate-900 dark:text-white",
								children: getAccountDisplayName(fromAccount?.name || "Account", language)
							})]
						}), /* @__PURE__ */ _jsxs("div", {
							className: "flex items-center justify-between py-1.5 border-b border-slate-100 dark:border-slate-800",
							children: [/* @__PURE__ */ _jsxs("span", {
								className: "text-slate-500 dark:text-slate-400 flex items-center gap-2",
								children: [
									/* @__PURE__ */ _jsx(CreditCard, { size: 16 }),
									" ",
									t.detail.toAccount
								]
							}), /* @__PURE__ */ _jsx("span", {
								className: "font-semibold text-slate-900 dark:text-white",
								children: getAccountDisplayName(toAccount?.name || "Account", language)
							})]
						})] }) : /* @__PURE__ */ _jsxs(_Fragment, { children: [expense.merchant && /* @__PURE__ */ _jsxs("div", {
							className: "flex items-center justify-between py-1.5 border-b border-slate-100 dark:border-slate-800",
							children: [/* @__PURE__ */ _jsxs("span", {
								className: "text-slate-500 dark:text-slate-400 flex items-center gap-2",
								children: [
									/* @__PURE__ */ _jsx(Store, { size: 16 }),
									" ",
									t.detail.merchant
								]
							}), /* @__PURE__ */ _jsx("span", {
								className: "font-semibold text-slate-900 dark:text-white",
								children: expense.merchant
							})]
						}), /* @__PURE__ */ _jsxs("div", {
							className: "flex items-center justify-between py-1.5 border-b border-slate-100 dark:border-slate-800",
							children: [/* @__PURE__ */ _jsxs("span", {
								className: "text-slate-500 dark:text-slate-400 flex items-center gap-2",
								children: [
									/* @__PURE__ */ _jsx(CreditCard, { size: 16 }),
									" ",
									t.detail.account
								]
							}), /* @__PURE__ */ _jsx("span", {
								className: "font-semibold text-slate-900 dark:text-white",
								children: getAccountDisplayName(account?.name || expense.paymentMethod || "Cash", language)
							})]
						})] }),
						/* @__PURE__ */ _jsxs("div", {
							className: "flex items-center justify-between py-1.5 border-b border-slate-100 dark:border-slate-800",
							children: [/* @__PURE__ */ _jsxs("span", {
								className: "text-slate-500 dark:text-slate-400 flex items-center gap-2",
								children: [
									/* @__PURE__ */ _jsx(Calendar, { size: 16 }),
									" ",
									t.detail.date
								]
							}), /* @__PURE__ */ _jsx("span", {
								className: "font-semibold text-slate-900 dark:text-white",
								children: formatDateLabel(expense.date, language)
							})]
						}),
						/* @__PURE__ */ _jsxs("div", {
							className: "flex items-center justify-between py-1.5 border-b border-slate-100 dark:border-slate-800",
							children: [/* @__PURE__ */ _jsxs("span", {
								className: "text-slate-500 dark:text-slate-400 flex items-center gap-2",
								children: [
									/* @__PURE__ */ _jsx(Clock, { size: 16 }),
									" ",
									t.detail.time
								]
							}), /* @__PURE__ */ _jsx("span", {
								className: "font-semibold text-slate-900 dark:text-white",
								children: expense.time || "12:00"
							})]
						}),
						expense.note && /* @__PURE__ */ _jsxs("div", {
							className: "flex items-start justify-between py-1.5",
							children: [/* @__PURE__ */ _jsxs("span", {
								className: "text-slate-500 dark:text-slate-400 flex items-center gap-2 shrink-0 mt-0.5",
								children: [
									/* @__PURE__ */ _jsx(FileText, { size: 16 }),
									" ",
									t.detail.notes
								]
							}), /* @__PURE__ */ _jsx("span", {
								className: "font-medium text-slate-800 dark:text-slate-200 text-right max-w-[200px] break-words",
								children: expense.note
							})]
						})
					]
				}),
				/* @__PURE__ */ _jsxs("div", {
					className: "p-4 bg-slate-50 dark:bg-slate-800/40 border-t border-slate-100 dark:border-slate-800 flex items-center gap-2",
					children: [
						/* @__PURE__ */ _jsxs("button", {
							type: "button",
							onClick: () => {
								onClose();
								onEdit(expense);
							},
							className: "flex-1 py-3 px-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm flex items-center justify-center gap-1.5 shadow-xs transition-colors cursor-pointer min-h-[46px]",
							children: [/* @__PURE__ */ _jsx(PenLine, { size: 16 }), /* @__PURE__ */ _jsx("span", { children: isTransfer ? t.detail.editTransfer : t.detail.edit })]
						}),
						/* @__PURE__ */ _jsxs("button", {
							type: "button",
							onClick: () => {
								duplicateExpense(expense);
								onClose();
							},
							className: "py-3 px-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-semibold text-sm flex items-center justify-center gap-1.5 transition-colors cursor-pointer min-h-[46px]",
							title: language === "ar" ? "تكرار المعاملة" : "Duplicate",
							children: [/* @__PURE__ */ _jsx(Copy, { size: 16 }), /* @__PURE__ */ _jsx("span", { children: language === "ar" ? "تكرار" : "Duplicate" })]
						}),
						/* @__PURE__ */ _jsxs("button", {
							type: "button",
							onClick: () => setIsConfirmingDelete(true),
							className: "py-3 px-3 rounded-xl border border-rose-200 dark:border-rose-900/60 bg-rose-50/50 hover:bg-rose-100/80 dark:bg-rose-950/20 text-rose-600 dark:text-rose-400 font-semibold text-sm flex items-center justify-center gap-1.5 transition-colors cursor-pointer min-h-[46px]",
							title: t.detail.delete,
							children: [/* @__PURE__ */ _jsx(Trash2, { size: 16 }), /* @__PURE__ */ _jsx("span", { children: t.detail.delete })]
						})
					]
				}),
				isConfirmingDelete && /* @__PURE__ */ _jsx("div", {
					className: "absolute inset-0 z-20 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150",
					children: /* @__PURE__ */ _jsxs("div", {
						className: "w-full max-w-xs bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200 dark:border-slate-800 shadow-xl space-y-3 text-xs",
						children: [
							/* @__PURE__ */ _jsx("h3", {
								className: "text-sm font-bold text-slate-900 dark:text-white",
								children: t.detail.confirmDelete
							}),
							/* @__PURE__ */ _jsx("p", {
								className: "text-slate-500 dark:text-slate-400",
								children: t.detail.confirmDeleteDesc
							}),
							/* @__PURE__ */ _jsxs("div", {
								className: "pt-2 flex justify-end gap-2",
								children: [/* @__PURE__ */ _jsx("button", {
									type: "button",
									onClick: () => setIsConfirmingDelete(false),
									className: "px-3 py-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-semibold rounded-xl cursor-pointer",
									children: t.settings.cancel
								}), /* @__PURE__ */ _jsx("button", {
									type: "button",
									onClick: handleDelete,
									className: "px-3.5 py-2 bg-rose-600 hover:bg-rose-700 text-white font-semibold rounded-xl cursor-pointer",
									children: t.detail.delete
								})]
							})
						]
					})
				})
			]
		})]
	});
};
