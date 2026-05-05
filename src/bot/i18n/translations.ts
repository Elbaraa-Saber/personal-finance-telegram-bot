import { defaultLanguage, SupportedLanguage } from "./language";

export type MenuMessages = {
  addIncome: string;
  addExpense: string;
  reportAll: string;
  reportDay: string;
  reportWeek: string;
  reportMonth: string;
  reportYear: string;
  history: string;
  help: string;
  deleteLast: string;
  language: string;
};

type ReportMessages = {
  titles: {
    all: string;
    day: string;
    week: string;
    month: string;
    year: string;
  };
  totalIncome: string;
  totalExpense: string;
  balance: string;
  transactionCount: string;
};

type TransactionMessages = {
  income: string;
  expense: string;
  note: string;
};

type HistoryMessages = {
  titles: {
    recent: (count: number) => string;
    date: (date: string) => string;
    day: string;
    week: string;
    month: string;
    year: string;
  };
  empty: string;
  invalidUsage: string;
};

type Messages = {
  start: {
    chooseLanguage: string;
    welcome: string;
  };
  language: {
    selected: string;
    ready: string;
    unsupported: string;
  };
  help: {
    text: (currency: string) => string;
  };
  menu: MenuMessages;
  report: ReportMessages;
  transaction: TransactionMessages;
  history: HistoryMessages;
};

export const translations: Record<SupportedLanguage, Messages> = {
  ar: {
    start: {
      chooseLanguage: "اختر اللغة / Выберите язык / Choose language:",
      welcome:
        "أهلًا بك 👋\n" +
        "تم تسجيلك في بوت المصاريف.\n\n" +
        "استخدم الأزرار بالأسفل أو اكتب /help لعرض الأوامر.",
    },
    language: {
      selected: "تم اختيار اللغة العربية ✅",
      ready: "يمكنك الآن استخدام البوت من القائمة.",
      unsupported: "هذه اللغة غير مدعومة.",
    },
    report: {
        titles: {
            all: "📊 التقرير الكامل",
            day: "📊 تقرير اليوم",
            week: "📊 تقرير هذا الأسبوع",
            month: "📊 تقرير هذا الشهر",
            year: "📊 تقرير هذه السنة",
        },
        totalIncome: "إجمالي الدخل",
        totalExpense: "إجمالي المصروف",
        balance: "الرصيد",
        transactionCount: "عدد العمليات",
    },

    transaction: {
        income: "دخل",
        expense: "مصروف",
        note: "ملاحظة",
        },

        history: {
        titles: {
            recent: (count: number) => `🧾 آخر ${count} عملية`,
            date: (date: string) => `🧾 عمليات يوم ${date}`,
            day: "🧾 عمليات اليوم",
            week: "🧾 عمليات هذا الأسبوع",
            month: "🧾 عمليات هذا الشهر",
            year: "🧾 عمليات هذه السنة",
        },
        empty: "لا توجد عمليات في هذه الفترة.",
        invalidUsage:
            "استخدم الأمر بهذا الشكل:\n" +
            "/history\n" +
            "/history 10\n" +
            "/history 2026-05-04",
    },

    help: {
      text: (currency: string) =>
        `
👋 أهلاً بك في بوت إدارة المصاريف

الأوامر المتاحة:

/start
تسجيل المستخدم وتشغيل البوت

/help
عرض هذه المساعدة

/language
تغيير لغة البوت

/income 1000 salary
إضافة دخل
مثال:
/income 5000 salary
/income 5000 salary 2026-05-05

/expense 250 food
إضافة مصروف
مثال:
/expense 250 food
/expense 250 food 2026-05-05 lunch

/report
عرض التقرير الكامل

/report_day
عرض تقرير اليوم

/report_week
عرض تقرير الأسبوع الحالي

/report_month
عرض تقرير الشهر الحالي

/report_year
عرض تقرير السنة الحالية

/history
عرض آخر 5 عمليات

/history 10
عرض آخر 10 عمليات

/history 2026-05-04
عرض عمليات يوم محدد

/delete_last
حذف آخر عملية بعد التأكيد

ملاحظات:
- المبلغ يجب أن يكون رقمًا أكبر من صفر.
- التاريخ اختياري، وإذا لم تكتبه سيتم استخدام تاريخ اليوم.
- صيغة التاريخ: YYYY-MM-DD
- العملة الحالية: ${currency}
`.trim(),
    },
    menu: {
      addIncome: "➕ إضافة دخل",
      addExpense: "➖ إضافة مصروف",
      reportAll: "📊 التقرير الكامل",
      reportDay: "📅 تقرير اليوم",
      reportWeek: "📆 تقرير الأسبوع",
      reportMonth: "🗓 تقرير الشهر",
      reportYear: "📈 تقرير السنة",
      history: "🧾 آخر العمليات",
      help: "ℹ️ المساعدة",
      deleteLast: "🗑 حذف آخر عملية",
      language: "🌐 اللغة / Language",
    },
  },

  ru: {
    start: {
      chooseLanguage: "Выберите язык:",
      welcome:
        "Добро пожаловать 👋\n" +
        "Вы зарегистрированы в боте учёта расходов.\n\n" +
        "Используйте кнопки ниже или введите /help, чтобы посмотреть команды.",
    },
    language: {
      selected: "Русский язык выбран ✅",
      ready: "Теперь вы можете пользоваться ботом из меню.",
      unsupported: "Этот язык не поддерживается.",
    },
    report: {
        titles: {
            all: "📊 Общий отчёт",
            day: "📊 Отчёт за сегодня",
            week: "📊 Отчёт за эту неделю",
            month: "📊 Отчёт за этот месяц",
            year: "📊 Отчёт за этот год",
        },
        totalIncome: "Общий доход",
        totalExpense: "Общие расходы",
        balance: "Баланс",
        transactionCount: "Количество операций",
    },

    transaction: {
        income: "Доход",
        expense: "Расход",
        note: "Примечание",
        },

        history: {
        titles: {
            recent: (count: number) => `🧾 Последние операции: ${count}`,
            date: (date: string) => `🧾 Операции за ${date}`,
            day: "🧾 Операции за сегодня",
            week: "🧾 Операции за эту неделю",
            month: "🧾 Операции за этот месяц",
            year: "🧾 Операции за этот год",
        },
        empty: "В этой период нет операций.",
        invalidUsage:
            "Используйте команду так:\n" +
            "/history\n" +
            "/history 10\n" +
            "/history 2026-05-04",
    },

    help: {
      text: (currency: string) =>
        `
👋 Добро пожаловать в бот учёта расходов

Доступные команды:

/start
Регистрация пользователя и запуск бота

/help
Показать эту справку

/language
Изменить язык бота

/income 1000 salary
Добавить доход
Пример:
/income 5000 salary
/income 5000 salary 2026-05-05

/expense 250 food
Добавить расход
Пример:
/expense 250 food
/expense 250 food 2026-05-05 lunch

/report
Показать общий отчёт

/report_day
Показать отчёт за сегодня

/report_week
Показать отчёт за текущую неделю

/report_month
Показать отчёт за текущий месяц

/report_year
Показать отчёт за текущий год

/history
Показать последние 5 операций

/history 10
Показать последние 10 операций

/history 2026-05-04
Показать операции за конкретный день

/delete_last
Удалить последнюю операцию после подтверждения

Примечания:
- Сумма должна быть числом больше нуля.
- Дата необязательна. Если её не указать, будет использована сегодняшняя дата.
- Формат даты: YYYY-MM-DD
- Текущая валюта: ${currency}
`.trim(),
    },
    menu: {
      addIncome: "➕ Добавить доход",
      addExpense: "➖ Добавить расход",
      reportAll: "📊 Общий отчёт",
      reportDay: "📅 Отчёт за день",
      reportWeek: "📆 Отчёт за неделю",
      reportMonth: "🗓 Отчёт за месяц",
      reportYear: "📈 Отчёт за год",
      history: "🧾 Последние операции",
      help: "ℹ️ Помощь",
      deleteLast: "🗑 Удалить последнюю",
      language: "🌐 Язык / Language",
    },
  },

  en: {
    start: {
      chooseLanguage: "Choose language:",
      welcome:
        "Welcome 👋\n" +
        "You have been registered in the expense tracker bot.\n\n" +
        "Use the buttons below or type /help to view available commands.",
    },
    language: {
      selected: "English selected ✅",
      ready: "You can now use the bot from the menu.",
      unsupported: "Unsupported language.",
    },
    report: {
        titles: {
        all: "📊 Full report",
        day: "📊 Today's report",
        week: "📊 This week's report",
        month: "📊 This month's report",
        year: "📊 This year's report",
        },
        totalIncome: "Total income",
        totalExpense: "Total expense",
        balance: "Balance",
        transactionCount: "Transaction count",
    },

    transaction: {
        income: "Income",
        expense: "Expense",
        note: "Note",
        },

        history: {
        titles: {
            recent: (count: number) => `🧾 Last ${count} transactions`,
            date: (date: string) => `🧾 Transactions for ${date}`,
            day: "🧾 Today's transactions",
            week: "🧾 This week's transactions",
            month: "🧾 This month's transactions",
            year: "🧾 This year's transactions",
        },
        empty: "There are no transactions in this period.",
        invalidUsage:
            "Use the command like this:\n" +
            "/history\n" +
            "/history 10\n" +
            "/history 2026-05-04",
    },

    help: {
      text: (currency: string) =>
        `
👋 Welcome to the expense tracker bot

Available commands:

/start
Register the user and start the bot

/help
Show this help message

/language
Change bot language

/income 1000 salary
Add income
Example:
/income 5000 salary
/income 5000 salary 2026-05-05

/expense 250 food
Add expense
Example:
/expense 250 food
/expense 250 food 2026-05-05 lunch

/report
Show full report

/report_day
Show today's report

/report_week
Show current week report

/report_month
Show current month report

/report_year
Show current year report

/history
Show last 5 transactions

/history 10
Show last 10 transactions

/history 2026-05-04
Show transactions for a specific day

/delete_last
Delete the last transaction after confirmation

Notes:
- Amount must be a number greater than zero.
- Date is optional. If omitted, today's date will be used.
- Date format: YYYY-MM-DD
- Current currency: ${currency}
`.trim(),
    },
    menu: {
      addIncome: "➕ Add income",
      addExpense: "➖ Add expense",
      reportAll: "📊 Full report",
      reportDay: "📅 Day report",
      reportWeek: "📆 Week report",
      reportMonth: "🗓 Month report",
      reportYear: "📈 Year report",
      history: "🧾 Recent transactions",
      help: "ℹ️ Help",
      deleteLast: "🗑 Delete last",
      language: "🌐 Language",
    },
  },
};

export function getMessages(language?: SupportedLanguage): Messages {
  return translations[language ?? defaultLanguage];
}