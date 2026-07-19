/* =========================================================
   مساعد حفظ القرآن — منطق التطبيق
   ملاحظة مهمة: هذا الملف لا يحتوي على أي نص قرآني، ولا يولّد
   أو يخمّن آيات. يتعامل فقط مع بيانات تنظيمية (اسم السورة/رقم
   الحزب أو الجزء/رقم الوحدة) يدخلها المستخدم بنفسه لتتبع خطة
   الحفظ والمراجعة والتثبيت.
   ========================================================= */

(() => {
  "use strict";

  /* ---------- ثوابت وإعدادات ---------- */

  const STORAGE_KEY = "quran-hifz-app-v2";

  // أسماء السور فقط (بيانات فهرسة تنظيمية، وليست نصاً قرآنياً)
  const SURAHS = [
    "الفاتحة","البقرة","آل عمران","النساء","المائدة","الأنعام","الأعراف","الأنفال","التوبة","يونس",
    "هود","يوسف","الرعد","إبراهيم","الحجر","النحل","الإسراء","الكهف","مريم","طه",
    "الأنبياء","الحج","المؤمنون","النور","الفرقان","الشعراء","النمل","القصص","العنكبوت","الروم",
    "لقمان","السجدة","الأحزاب","سبأ","فاطر","يس","الصافات","ص","الزمر","غافر",
    "فصلت","الشورى","الزخرف","الدخان","الجاثية","الأحقاف","محمد","الفتح","الحجرات","ق",
    "الذاريات","الطور","النجم","القمر","الرحمن","الواقعة","الحديد","المجادلة","الحشر","الممتحنة",
    "الصف","الجمعة","المنافقون","التغابن","الطلاق","التحريم","الملك","القلم","الحاقة","المعارج",
    "نوح","الجن","المزمل","المدثر","القيامة","الإنسان","المرسلات","النبأ","النازعات","عبس",
    "التكوير","الانفطار","المطففين","الانشقاق","البروج","الطارق","الأعلى","الغاشية","الفجر","البلد",
    "الشمس","الليل","الضحى","الشرح","التين","العلق","القدر","البينة","الزلزلة","العاديات",
    "القارعة","التكاثر","العصر","الهمزة","الفيل","قريش","الماعون","الكوثر","الكافرون","النصر",
    "المسد","الإخلاص","الفلق","الناس"
  ];

  const HIZB_COUNT = 60;
  const JUZ_COUNT = 30;

  // بيانات بدايات الأحزاب الستين (السورة/الصفحة/أول العبارة) كما
  // زوّدني بها المستخدم — تُستخدم فقط للتسمية والتنظيم، لا كمصدر
  // لعرض آيات كاملة داخل التطبيق.
  const HIZB_DATA = [
    { number: 1, surah: "الفاتحة", page: 1, start: "بسم الله الرحمن الرحيم" },
    { number: 2, surah: "البقرة", page: 11, start: "أفتطمعون أن يؤمنوا لكم" },
    { number: 3, surah: "البقرة", page: 22, start: "سيقول السفهاء من الناس ما ولاهم" },
    { number: 4, surah: "البقرة", page: 32, start: "واذكروا الله في أيام معدودات" },
    { number: 5, surah: "البقرة", page: 42, start: "تلك الرسل فضلنا بعضهم على بعض" },
    { number: 6, surah: "آل عمران", page: 51, start: "قل أؤنبئكم بخير من ذلكم للذين اتقوا" },
    { number: 7, surah: "آل عمران", page: 62, start: "كل الطعام كان حلا لبني إسرائيل" },
    { number: 8, surah: "آل عمران", page: 72, start: "يستبشرون بنعمة من الله وفضل" },
    { number: 9, surah: "النساء", page: 82, start: "والمحصنات من النساء إلا ما ملكت أيمانكم" },
    { number: 10, surah: "النساء", page: 92, start: "فما لكم في المنافقين فئتين والله أركسهم" },
    { number: 11, surah: "النساء", page: 102, start: "لا يحب الله الجهر بالسوء من القول" },
    { number: 12, surah: "المائدة", page: 112, start: "واتل عليهم نبأ ابني آدم بالحق" },
    { number: 13, surah: "المائدة", page: 121, start: "لتجدن أشد الناس عداوة للذين آمنوا اليهود" },
    { number: 14, surah: "الأنعام", page: 132, start: "إنما يستجيب الذين يسمعون والموتى يبعثهم الله" },
    { number: 15, surah: "الأنعام", page: 142, start: "ولو أننا نزلنا إليهم الملائكة وكلمهم الموتى" },
    { number: 16, surah: "الأعراف", page: 151, start: "المص، كتاب أنزل إليك" },
    { number: 17, surah: "الأعراف", page: 162, start: "قال الملأ الذين استكبروا من قومه لنخرجنك" },
    { number: 18, surah: "الأعراف", page: 173, start: "وإذ نتقنا الجبل فوقهم كأنه ظلة" },
    { number: 19, surah: "الأنفال", page: 182, start: "واعلموا أنما غنمتم من شيء فأن لله خمسه" },
    { number: 20, surah: "التوبة", page: 192, start: "يا أيها الذين آمنوا إن كثيرا من الأحبار" },
    { number: 21, surah: "التوبة", page: 201, start: "إنما السبيل على الذين يستأذنونك وهم أغنياء" },
    { number: 22, surah: "يونس", page: 212, start: "للذين أحسنوا الحسنى وزيادة" },
    { number: 23, surah: "هود", page: 222, start: "وما من دابة في الأرض إلا على الله رزقها" },
    { number: 24, surah: "هود", page: 231, start: "وإلى مدين أخاهم شعيبا" },
    { number: 25, surah: "يوسف", page: 242, start: "وما أبرئ نفسي إن النفس لأمارة بالسوء" },
    { number: 26, surah: "الرعد", page: 252, start: "أفمن يعلم أنما أنزل إليك من ربك الحق" },
    { number: 27, surah: "الحجر", page: 262, start: "الر تلك آيات الكتاب وقرآن مبين" },
    { number: 28, surah: "النحل", page: 272, start: "وقال الله لا تتخذوا إلهين اثنين" },
    { number: 29, surah: "الإسراء", page: 282, start: "سبحان الذي أسرى بعبده ليلا" },
    { number: 30, surah: "الإسراء", page: 292, start: "أولم يروا أن الله الذي خلق السماوات" },
    { number: 31, surah: "الكهف", page: 302, start: "قال ألم أقل لك إنك لن تستطيع" },
    { number: 32, surah: "طه", page: 312, start: "طه، ما أنزلنا عليك القرآن لتشقى" },
    { number: 33, surah: "الأنبياء", page: 322, start: "اقترب للناس حسابهم وهم في غفلة معرضون" },
    { number: 34, surah: "الحج", page: 332, start: "يا أيها الناس اتقوا ربكم إن زلزلة" },
    { number: 35, surah: "المؤمنون", page: 342, start: "قد أفلح المؤمنون، الذين هم في" },
    { number: 36, surah: "النور", page: 352, start: "يا أيها الذين آمنوا لا تتبعوا خطوات" },
    { number: 37, surah: "الفرقان", page: 362, start: "وقال الذين لا يرجون لقاءنا" },
    { number: 38, surah: "الشعراء", page: 371, start: "قالوا أنؤمن لك واتبعك الأرذلون" },
    { number: 39, surah: "النمل", page: 382, start: "فما كان جواب قومه إلا أن قالوا" },
    { number: 40, surah: "القصص", page: 392, start: "ولقد وصلنا لهم القول لعلهم يتذكرون" },
    { number: 41, surah: "العنكبوت", page: 402, start: "ولا تجادلوا أهل الكتاب إلا بالتي هي أحسن" },
    { number: 42, surah: "لقمان", page: 413, start: "ومن يسلم وجهه إلى الله وهو محسن" },
    { number: 43, surah: "الأحزاب", page: 422, start: "ومن يقنت منكن لله ورسوله وتعمل صالحا" },
    { number: 44, surah: "سبأ", page: 431, start: "قل من يرزقكم من السماوات والأرض" },
    { number: 45, surah: "يس", page: 442, start: "وما أنزلنا على قومه من بعده من جند" },
    { number: 46, surah: "الصافات", page: 451, start: "فنبذناه بالعراء وهو سقيم" },
    { number: 47, surah: "الزمر", page: 462, start: "فمن أظلم ممن كذب على الله وكذب" },
    { number: 48, surah: "غافر", page: 472, start: "ويا قوم ما لي أدعوكم إلى النجاة" },
    { number: 49, surah: "فصلت", page: 482, start: "إليه يرد علم الساعة" },
    { number: 50, surah: "الزخرف", page: 491, start: "قال أولو جئتكم بأهدى مما وجدتم" },
    { number: 51, surah: "الأحقاف", page: 502, start: "حم، تنزيل الكتاب من الله العزيز الحكيم" },
    { number: 52, surah: "الفتح", page: 513, start: "لقد رضي الله عن المؤمنين إذ يبايعونك" },
    { number: 53, surah: "الذاريات", page: 522, start: "قال فما خطبكم أيها المرسلون" },
    { number: 54, surah: "الرحمن", page: 531, start: "الرحمن، علم القرآن" },
    { number: 55, surah: "المجادلة", page: 542, start: "قد سمع الله قول التي تجادلك" },
    { number: 56, surah: "الجمعة", page: 553, start: "يسبح لله ما في السماوات وما في الأرض" },
    { number: 57, surah: "الملك", page: 562, start: "تبارك الذي بيده الملك" },
    { number: 58, surah: "الجن", page: 572, start: "قل أوحي إلي أنه استمع نفر من الجن" },
    { number: 59, surah: "النبأ", page: 582, start: "عم يتساءلون، عن النبإ العظيم" },
    { number: 60, surah: "الأعلى", page: 591, start: "سبح اسم ربك الأعلى، الذي خلق فسوى" },
  ];

  function getHizbInfo(number) {
    return HIZB_DATA.find((h) => h.number === Number(number)) || null;
  }

  // عدد "الأثمان" التقريبي لكل سورة — تقسيم تنظيمي مبسّط وليس
  // ترقيماً معتمداً من المصحف. يُستحسن استبداله لاحقاً ببيانات
  // دقيقة من مصدر مصحف ورش الموثوق (حدود الصفحات/الأثمان الفعلية).
  function estimateThumnCount(surahIndex) {
    if (surahIndex === 1) return 40; // البقرة
    if ([2, 3].includes(surahIndex)) return 16; // آل عمران، النساء
    if (surahIndex === 4) return 12; // المائدة
    if (surahIndex === 5) return 10; // الأنعام
    if (surahIndex <= 10) return 8;
    if (surahIndex <= 30) return 5;
    if (surahIndex <= 60) return 3;
    return 1;
  }

  // تقدير عدد الوحدات الفرعية (ربع/نصف صفحة/صفحة) اعتماداً على
  // عدد الأثمان التقريبي — تقديرات تنظيمية وليست ترقيماً معتمداً.
  function estimateUnitCount(surahIndex, unitType) {
    const thumnCount = estimateThumnCount(surahIndex);
    switch (unitType) {
      case "thumn": return thumnCount;
      case "quarter": return Math.max(1, Math.ceil(thumnCount / 2));
      case "halfPage": return Math.max(1, Math.round(thumnCount * 2.5));
      case "page": return Math.max(1, Math.round(thumnCount * 1.25));
      default: return 1;
    }
  }

  const SUB_UNIT_LABELS = {
    quarter: "الربع",
    thumn: "الثمن",
    halfPage: "نصف الصفحة",
    page: "الصفحة",
  };

  // أهداف عدد التكرار في كل مرحلة تثبيت (حسب المنهج المطلوب)
  const DAY1_TARGET = 25; // اليوم الأول للحفظ الجديد
  const DAY1_RESTABILIZE_TARGET = 20; // اليوم الأول لإعادة تثبيت متفلت: 10 نظراً + 10 غيباً
  const DAILY_TARGET = 5; // بقية الأسبوع الأول
  const WEEK_TARGET = 5; // الأسبوع الثاني والثالث

  // سعة "التثبيت" القصوى المستحسنة قبل التنبيه بالتوقف عن حفظ جديد
  const STABILIZE_CAPACITY = 15;

  // بعد كم يوم تأخير عن الموعد يعتبر المحفوظ "متفلتاً"
  const LOOSE_GRACE_DAYS = 2;

  /* ---------- أدوات مساعدة للتاريخ ---------- */

  const MS_DAY = 24 * 60 * 60 * 1000;

  function todayISO() {
    return new Date().toISOString().slice(0, 10);
  }

  function daysSince(dateISO) {
    const d1 = new Date(dateISO + "T00:00:00");
    const d2 = new Date(todayISO() + "T00:00:00");
    return Math.round((d2 - d1) / MS_DAY);
  }

  function addDaysISO(dateISO, n) {
    const d = new Date(dateISO + "T00:00:00");
    d.setDate(d.getDate() + n);
    return d.toISOString().slice(0, 10);
  }

  /* ---------- طبقة التخزين المحلي ---------- */

  function loadState() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return defaultState();
      const parsed = JSON.parse(raw);
      return Object.assign(defaultState(), parsed);
    } catch (e) {
      console.warn("تعذّرت قراءة البيانات المحفوظة، سيتم البدء من جديد.", e);
      return defaultState();
    }
  }

  function defaultState() {
    return {
      units: [],
      activeUnitId: null,
      activeTab: "new",
      totalReviewsDone: 0,
    };
  }

  let state = loadState();

  function saveState() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }

  /* ---------- نموذج وحدة الحفظ ----------
     unit = {
       id,
       unitType,        // surah | hizb | juz | quarter | thumn | halfPage | page
       surahIndex,       // فهرس السورة (يُستخدم مع surah/quarter/thumn/halfPage/page)
       surahName,
       number,           // رقم الحزب/الجزء، أو رقم الوحدة الفرعية داخل السورة
       createdDate,
       stage,            // day1 | week1 | week2 | week3 | monthly | loose
       lastDoneDate,
       doneCountToday,
       weekOccurrences,
       history: [],
       restabilize,      // true إن أُضيفت عبر "التثبيت" (محفوظ سابق تفلّت)
       confirmedMastery,  // true بعد تأكيد المستخدم أنها أصبحت متقنة
     }
  */

  function createUnit({ unitType, surahIndex = null, number = null, restabilize = false, directToReview = false }) {
    const today = todayISO();
    const surahName = surahIndex != null ? SURAHS[surahIndex] : null;

    // محفوظ سابق تفلّت (يُدار عبر التثبيت) يمر بنفس نظام التثبيت
    // تماماً، بما في ذلك اليوم الأول — لكن بهدف أخف لأنه ليس حفظاً
    // من الصفر: 10 مرات نظراً في المصحف + 10 مرات غيباً (٢٠ إجمالاً)
    // بدل الـ٢٥ المخصصة للحفظ الجديد. بعدها 5 مرات يومياً بقية الأسبوع.
    const initialStage = directToReview ? "monthly" : "day1";

    const unit = {
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      unitType,
      surahIndex,
      surahName,
      number,
      createdDate: today,
      stage: initialStage,
      lastDoneDate: directToReview ? today : null,
      doneCountToday: 0,
      weekOccurrences: directToReview ? 1 : 0,
      history: directToReview ? [{ date: today, count: 0 }] : [],
      restabilize,
      confirmedMastery: directToReview ? true : false,
    };
    state.units.push(unit);
    saveState();
    return unit;
  }

  function findExistingUnit(unitType, surahIndex, number) {
    return state.units.find(
      (u) => u.unitType === unitType && u.surahIndex === surahIndex && u.number === number && u.stage !== "loose"
    );
  }

  /* ---------- منطق الجدولة (منهج التثبيت) ---------- */

  function refreshStage(unit) {
    const age = daysSince(unit.createdDate);
    if (unit.stage === "loose") return; // يُدار يدوياً عبر إعادة التثبيت

    if (age === 0) unit.stage = "day1";
    else if (age >= 1 && age <= 6) unit.stage = "week1";
    else if (age >= 7 && age <= 13) unit.stage = "week2";
    else if (age >= 14 && age <= 20) unit.stage = "week3";
    else {
      if (unit.restabilize && !unit.confirmedMastery) {
        // ينتظر تأكيد المستخدم أن الحفظ أصبح متقناً قبل الانتقال للمراجعة
        unit.stage = "week3";
      } else {
        unit.stage = "monthly";
      }
    }
  }

  function targetForStage(stage, unit) {
    switch (stage) {
      case "day1": return unit && unit.restabilize ? DAY1_RESTABILIZE_TARGET : DAY1_TARGET;
      case "week1": return DAILY_TARGET;
      case "week2":
      case "week3": return WEEK_TARGET;
      case "monthly": return DAILY_TARGET;
      case "loose": return DAILY_TARGET + 5;
      default: return DAILY_TARGET;
    }
  }

  // مرحلة اليوم الأول لإعادة التثبيت: هل ما زلنا في شطر "نظراً" أم "غيباً"؟
  function day1PhaseInfo(unit) {
    const half = DAY1_RESTABILIZE_TARGET / 2; // 10
    if (unit.doneCountToday < half) {
      return { label: "نظراً في المصحف", done: unit.doneCountToday, target: half };
    }
    return { label: "غيباً", done: unit.doneCountToday - half, target: half };
  }

  function occurrencesNeeded(stage) {
    switch (stage) {
      case "day1": return 1;
      case "week1": return 6;
      case "week2": return 3;
      case "week3": return 2;
      case "monthly": return 1;
      case "loose": return 2;
      default: return 1;
    }
  }

  function isDueToday(unit) {
    if (unit.stage === "loose") return true;
    if (unit.lastDoneDate === todayISO()) return false;

    if (unit.stage === "day1") return true;

    if (unit.stage === "monthly") {
      const weekday = new Date().getDay();
      const hash = hashCode(unit.id) % 7;
      const weeksSinceLast = unit.lastDoneDate ? daysSince(unit.lastDoneDate) : 999;
      return hash === weekday && weeksSinceLast >= 6;
    }

    if (unit.weekOccurrences >= occurrencesNeeded(unit.stage)) return false;
    if (unit.stage === "week1") return true;

    const gap = unit.stage === "week2" ? 2 : 3;
    const daysSinceLast = unit.lastDoneDate ? daysSince(unit.lastDoneDate) : 999;
    return daysSinceLast >= gap;
  }

  function hashCode(str) {
    let h = 0;
    for (let i = 0; i < str.length; i++) {
      h = (h << 5) - h + str.charCodeAt(i);
      h |= 0;
    }
    return Math.abs(h);
  }

  // فحص التفلّت: إن تجاوز التأخير عن آخر مراجعة الحدّ المسموح
  // لمرحلة الوحدة الحالية، تُنقل تلقائياً إلى قائمة "المتفلت"
  function checkLoose(unit) {
    if (unit.stage === "loose") return;
    if (!unit.lastDoneDate && unit.stage === "day1") return;
    const reference = unit.lastDoneDate || unit.createdDate;
    const overdue = daysSince(reference);
    const maxGap = { week1: 1 + LOOSE_GRACE_DAYS, week2: 4, week3: 6, monthly: 10 }[unit.stage];
    if (maxGap && overdue > maxGap) {
      unit.stage = "loose";
      unit.weekOccurrences = 0;
      unit.restabilize = true; // متى أُعيد تثبيتها ستمر بنفس مسار إعادة التثبيت
      unit.confirmedMastery = false;
    }
  }

  function refreshAll() {
    state.units.forEach((u) => {
      refreshStage(u);
      checkLoose(u);
    });
    saveState();
  }

  /* ---------- بناء خطة اليوم ---------- */

  function getDailyPlan() {
    refreshAll();
    const due = state.units.filter(isDueToday);
    const stabilizing = state.units.filter((u) => ["day1", "week1", "week2", "week3"].includes(u.stage));
    const loose = state.units.filter((u) => u.stage === "loose");

    const overCapacity = stabilizing.length >= STABILIZE_CAPACITY;

    return {
      dueToday: due,
      loose,
      overCapacity,
      stabilizingCount: stabilizing.length,
      suggestNewAmount: overCapacity ? "لا شيء — أكمل التثبيت أولاً" : (due.length > 5 ? "نصف صفحة" : "صفحة كاملة"),
    };
  }

  function renderDailyPlan() {
    const plan = getDailyPlan();
    const el = document.getElementById("dailyPlan");
    const parts = [];

    if (plan.overCapacity) {
      parts.push(
        `<p class="alert alert-warn">⚠️ عدد المحفوظات في مرحلة التثبيت (${toArabicDigits(plan.stabilizingCount)}) تجاوز قدرتك على المتابعة. يُستحسن التوقف عن حفظ جديد اليوم والتركيز على التثبيت.</p>`
      );
    }

    if (plan.loose.length) {
      parts.push(
        `<p class="alert alert-loose">🔺 لديك ${toArabicDigits(plan.loose.length)} من المحفوظ المتفلت يحتاج عناية عاجلة.</p>`
      );
    }

    parts.push(`<p><strong>مقترح الحفظ الجديد اليوم:</strong> ${plan.suggestNewAmount}</p>`);

    if (plan.dueToday.length) {
      parts.push(`<p><strong>مستحق المراجعة اليوم (${toArabicDigits(plan.dueToday.length)}):</strong></p>`);
      parts.push(
        "<ul class='plan-list'>" +
          plan.dueToday
            .slice(0, 8)
            .map((u) => `<li>${unitLabel(u)} <span class="tag tag-${u.stage}">${stageLabel(u.stage)}</span></li>`)
            .join("") +
          "</ul>"
      );
      if (plan.dueToday.length > 8) {
        parts.push(`<p class="muted">و ${toArabicDigits(plan.dueToday.length - 8)} أخرى…</p>`);
      }
    } else {
      parts.push("<p class='muted'>لا توجد مراجعات مستحقة الآن، أحسنت 🌿</p>");
    }

    el.innerHTML = parts.join("");
  }

  /* ---------- تسمية الوحدات ---------- */

  function unitLabel(u) {
    switch (u.unitType) {
      case "surah": return `سورة ${u.surahName}`;
      case "hizb": {
        const info = getHizbInfo(u.number);
        return info
          ? `الحزب ${toArabicDigits(u.number)} — سورة ${info.surah} (ص ${toArabicDigits(info.page)})`
          : `الحزب ${toArabicDigits(u.number)}`;
      }
      case "juz": return `الجزء ${toArabicDigits(u.number)}`;
      case "quarter": return `سورة ${u.surahName} — الربع ${toArabicDigits(u.number)}`;
      case "thumn": return `سورة ${u.surahName} — الثمن ${toArabicDigits(u.number)}`;
      case "halfPage": return `سورة ${u.surahName} — نصف الصفحة ${toArabicDigits(u.number)}`;
      case "page": return `سورة ${u.surahName} — الصفحة ${toArabicDigits(u.number)}`;
      default: return u.surahName ? `سورة ${u.surahName}` : "وحدة حفظ";
    }
  }

  function stageLabel(stage) {
    return {
      day1: "اليوم الأول",
      week1: "الأسبوع الأول",
      week2: "الأسبوع الثاني",
      week3: "الأسبوع الثالث",
      monthly: "مراجعة أسبوعية",
      loose: "متفلت",
    }[stage] || stage;
  }

  // أرقام عادية (0123...) وليست الأرقام الهندية الشرقية (٠١٢٣...)
  function toArabicDigits(n) {
    return String(n);
  }

  /* ---------- تعبئة قوائم "الحفظ الجديد" ---------- */

  function populateSurahSelect() {
    const sel = document.getElementById("surah");
    sel.innerHTML = SURAHS.map((name, i) => `<option value="${i}">${name}</option>`).join("");
    sel.addEventListener("change", populateSubUnitSelect);
    document.getElementById("unitType").addEventListener("change", populateSubUnitSelect);
    populateSubUnitSelect();
  }

  function populateSubUnitSelect() {
    const type = document.getElementById("unitType").value;
    const wrap = document.getElementById("subUnitWrap");
    const labelEl = document.getElementById("subUnitLabel");
    const sel = document.getElementById("thumn");

    if (type === "surah") {
      wrap.hidden = true;
      sel.innerHTML = "";
      return;
    }

    wrap.hidden = false;
    labelEl.textContent = SUB_UNIT_LABELS[type] || "الوحدة";

    const surahIndex = Number(document.getElementById("surah").value || 0);
    const count = estimateUnitCount(surahIndex, type);
    let opts = "";
    for (let i = 1; i <= count; i++) {
      opts += `<option value="${i}">${SUB_UNIT_LABELS[type]} ${toArabicDigits(i)}</option>`;
    }
    sel.innerHTML = opts;
  }

  /* ---------- تعبئة نماذج "أضف إلى المراجعة" و"ضع خطة تثبيت" ---------- */

  function populateGenericUnitNumberSelect(typeSelectEl, numberSelectEl) {
    const type = typeSelectEl.value;
    let opts = "";
    if (type === "surah") {
      opts = SURAHS.map((name, i) => `<option value="${i}">${name}</option>`).join("");
    } else if (type === "hizb") {
      for (let i = 1; i <= HIZB_COUNT; i++) {
        const info = getHizbInfo(i);
        const suffix = info ? ` — سورة ${info.surah} (ص ${toArabicDigits(info.page)})` : "";
        opts += `<option value="${i}">الحزب ${toArabicDigits(i)}${suffix}</option>`;
      }
    } else if (type === "juz") {
      for (let i = 1; i <= JUZ_COUNT; i++) opts += `<option value="${i}">الجزء ${toArabicDigits(i)}</option>`;
    }
    numberSelectEl.innerHTML = opts;
  }

  function setupAddForms() {
    const reviewType = document.getElementById("reviewUnitType");
    const reviewNumber = document.getElementById("reviewUnitNumber");
    const stabilizeType = document.getElementById("stabilizeUnitType");
    const stabilizeNumber = document.getElementById("stabilizeUnitNumber");

    populateGenericUnitNumberSelect(reviewType, reviewNumber);
    populateGenericUnitNumberSelect(stabilizeType, stabilizeNumber);

    reviewType.addEventListener("change", () => populateGenericUnitNumberSelect(reviewType, reviewNumber));
    stabilizeType.addEventListener("change", () => populateGenericUnitNumberSelect(stabilizeType, stabilizeNumber));

    document.getElementById("addToReview").addEventListener("click", () => {
      const type = reviewType.value;
      const value = Number(reviewNumber.value);
      const surahIndex = type === "surah" ? value : null;
      const number = type === "surah" ? null : value;

      const existing = findExistingUnit(type, surahIndex, number);
      if (existing) {
        existing.stage = "monthly";
        existing.confirmedMastery = true;
        existing.restabilize = false;
        saveState();
      } else {
        createUnit({ unitType: type, surahIndex, number, directToReview: true });
      }
      renderReviewOrStabilize();
      renderDailyPlan();
      renderStats();
    });

    document.getElementById("addToStabilize").addEventListener("click", () => {
      const type = stabilizeType.value;
      const value = Number(stabilizeNumber.value);
      const surahIndex = type === "surah" ? value : null;
      const number = type === "surah" ? null : value;

      const existing = findExistingUnit(type, surahIndex, number);
      if (existing) {
        alert("هذه الوحدة موجودة بالفعل ضمن خططك.");
        return;
      }
      createUnit({ unitType: type, surahIndex, number, restabilize: true });
      renderReviewOrStabilize();
      renderDailyPlan();
      renderStats();
    });
  }

  /* ---------- بدء حفظ جديد ---------- */

  function startMemorize() {
    const unitType = document.getElementById("unitType").value;
    const surahIndex = Number(document.getElementById("surah").value);
    const number = unitType === "surah" ? null : Number(document.getElementById("thumn").value);

    const plan = getDailyPlan();
    if (plan.overCapacity) {
      const proceed = confirm(
        "عدد المحفوظات في التثبيت كبير حالياً. هل تريد المتابعة بحفظ جديد رغم ذلك؟"
      );
      if (!proceed) return;
    }

    const existing = findExistingUnit(unitType, surahIndex, number);
    const unit = existing || createUnit({ unitType, surahIndex, number });
    state.activeUnitId = unit.id;
    unit.doneCountToday = unit.lastDoneDate === todayISO() ? unit.doneCountToday : 0;
    saveState();

    setActiveTab("new");
    setupCounterForActiveUnit();
    renderDailyPlan();
  }

  /* ---------- عداد التكرار وشريط التقدم ---------- */

  function getActiveUnit() {
    return state.units.find((u) => u.id === state.activeUnitId) || null;
  }

  function setupCounterForActiveUnit() {
    const unit = getActiveUnit();
    const counterEl = document.getElementById("repeatCounter");
    const progressEl = document.getElementById("repeatProgress");
    const phaseEl = document.getElementById("counterPhase");

    if (!unit) {
      counterEl.textContent = "0";
      progressEl.max = DAY1_TARGET;
      progressEl.value = 0;
      phaseEl.textContent = "";
      phaseEl.hidden = true;
      return;
    }

    const target = targetForStage(unit.stage, unit);
    progressEl.max = target;
    progressEl.value = unit.doneCountToday;
    counterEl.textContent = toArabicDigits(unit.doneCountToday);

    if (unit.restabilize && unit.stage === "day1") {
      const phase = day1PhaseInfo(unit);
      phaseEl.textContent = `المرحلة الحالية: ${phase.label} (${toArabicDigits(phase.done)} / ${toArabicDigits(phase.target)})`;
      phaseEl.hidden = false;
    } else {
      phaseEl.textContent = "";
      phaseEl.hidden = true;
    }
  }

  function changeCounter(delta) {
    const unit = getActiveUnit();
    if (!unit) {
      alert("اختر وحدة حفظ من «الحفظ الجديد» أو «المراجعة» أو «التثبيت» أولاً.");
      return;
    }
    const target = targetForStage(unit.stage, unit);
    unit.doneCountToday = Math.max(0, Math.min(target, unit.doneCountToday + delta));
    saveState();
    setupCounterForActiveUnit();

    if (unit.doneCountToday >= target) {
      completeToday(unit);
    }
  }

  function completeToday(unit) {
    const already = unit.lastDoneDate === todayISO();
    unit.lastDoneDate = todayISO();
    unit.history.push({ date: todayISO(), count: unit.doneCountToday });
    if (!already) {
      unit.weekOccurrences += 1;
      state.totalReviewsDone += 1;
    }
    saveState();
    renderDailyPlan();
    renderReviewOrStabilize();
    renderLoose();
    renderStats();
  }

  /* ---------- المراجعة / التثبيت (تُعرضان في نفس البطاقة) ---------- */

  function renderReviewOrStabilize() {
    const listEl = document.getElementById("reviewList");
    refreshAll();

    let units;
    let title;
    if (state.activeTab === "stabilize") {
      units = state.units.filter((u) => ["day1", "week1", "week2", "week3"].includes(u.stage));
      title = "التثبيت";
    } else {
      units = state.units.filter((u) => u.stage === "monthly");
      title = "المراجعة العامة";
    }

    document.getElementById("reviewSectionTitle").textContent = title;

    if (!units.length) {
      listEl.innerHTML = `<p class="muted">لا يوجد عناصر في هذه القائمة حالياً.</p>`;
      return;
    }

    listEl.innerHTML = units
      .map((u) => {
        const due = isDueToday(u);
        const canConfirm =
          state.activeTab === "stabilize" &&
          u.restabilize &&
          u.stage === "week3" &&
          u.weekOccurrences >= occurrencesNeeded("week3") &&
          !u.confirmedMastery;

        return `<div class="list-item ${due ? "due" : ""}" data-id="${u.id}">
          <div>
            <strong>${unitLabel(u)}</strong>
            <span class="tag tag-${u.stage}">${stageLabel(u.stage)}</span>
          </div>
          <div class="item-actions">
            <button class="small-btn" data-select="${u.id}">${due ? "راجع الآن" : "تم مؤخراً"}</button>
            ${canConfirm ? `<button class="small-btn confirm-btn" data-confirm="${u.id}">تأكيد الإتقان ✓</button>` : ""}
          </div>
        </div>`;
      })
      .join("");

    listEl.querySelectorAll("[data-select]").forEach((btn) => {
      btn.addEventListener("click", () => {
        state.activeUnitId = btn.getAttribute("data-select");
        saveState();
        setupCounterForActiveUnit();
        setActiveTab("new");
      });
    });

    listEl.querySelectorAll("[data-confirm]").forEach((btn) => {
      btn.addEventListener("click", () => {
        const unit = state.units.find((u) => u.id === btn.getAttribute("data-confirm"));
        if (!unit) return;
        unit.stage = "monthly";
        unit.confirmedMastery = true;
        unit.weekOccurrences = 1;
        unit.lastDoneDate = todayISO();
        saveState();
        renderReviewOrStabilize();
        renderDailyPlan();
        renderStats();
      });
    });
  }

  /* ---------- المحفوظ المتفلت ---------- */

  function renderLoose() {
    const listEl = document.getElementById("looseList");
    const loose = state.units.filter((u) => u.stage === "loose");

    if (!loose.length) {
      listEl.innerHTML = `<p class="muted">لا يوجد محفوظ متفلت حالياً، بارك الله فيك.</p>`;
      return;
    }

    listEl.innerHTML = loose
      .map(
        (u) => `<div class="list-item due" data-id="${u.id}">
          <div>
            <strong>${unitLabel(u)}</strong>
            <span class="tag tag-loose">يحتاج إعادة تثبيت</span>
          </div>
          <button class="small-btn" data-select="${u.id}">ضعه في خطة التثبيت الآن</button>
        </div>`
      )
      .join("");

    listEl.querySelectorAll("[data-select]").forEach((btn) => {
      btn.addEventListener("click", () => {
        const unit = state.units.find((u) => u.id === btn.getAttribute("data-select"));
        if (unit) {
          // إخراجها من "متفلت" وإدخالها رسمياً في خطة التثبيت،
          // بدءاً من اليوم الأول: 10 مرات نظراً + 10 مرات غيباً،
          // ثم 5 مرات يومياً بقية الأسبوع (نفس نظام التثبيت تماماً).
          unit.createdDate = todayISO();
          unit.stage = "day1";
          unit.doneCountToday = 0;
          unit.weekOccurrences = 0;
          unit.restabilize = true;
          unit.confirmedMastery = false;
          saveState();
        }
        setActiveTab("stabilize");
      });
    });
  }

  /* ---------- الإحصائيات ---------- */

  function renderStats() {
    const totalUnits = state.units.length;
    const stablePages = state.units.filter((u) => u.stage === "monthly").length;
    const looseCount = state.units.filter((u) => u.stage === "loose").length;
    const successRate = totalUnits ? Math.round(((totalUnits - looseCount) / totalUnits) * 100) : 0;

    document.getElementById("savedAthman").textContent = toArabicDigits(totalUnits);
    document.getElementById("savedPages").textContent = toArabicDigits(stablePages);
    document.getElementById("completedReview").textContent = toArabicDigits(state.totalReviewsDone);
    document.getElementById("successRate").textContent = toArabicDigits(successRate) + "%";
  }

  /* ---------- التسجيل الصوتي ---------- */

  let mediaRecorder = null;
  let recordedChunks = [];
  let mediaStream = null;
  let currentRecordingUrl = null;

  async function startRecording() {
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      alert("المتصفح لا يدعم التسجيل الصوتي.");
      return;
    }
    try {
      mediaStream = await navigator.mediaDevices.getUserMedia({ audio: true });
      recordedChunks = [];
      mediaRecorder = new MediaRecorder(mediaStream);
      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) recordedChunks.push(e.data);
      };
      mediaRecorder.onstop = () => {
        const blob = new Blob(recordedChunks, { type: "audio/webm" });
        if (currentRecordingUrl) URL.revokeObjectURL(currentRecordingUrl);
        currentRecordingUrl = URL.createObjectURL(blob);
        const player = document.getElementById("player");
        player.src = currentRecordingUrl;
        mediaStream.getTracks().forEach((t) => t.stop());
        document.getElementById("recordBtn").classList.remove("recording");
        document.getElementById("clearRecordingBtn").hidden = false;
      };
      mediaRecorder.start();
      document.getElementById("recordBtn").classList.add("recording");
    } catch (err) {
      alert("تعذّر الوصول إلى الميكروفون. تأكد من منح الإذن اللازم.");
      console.error(err);
    }
  }

  function stopRecording() {
    if (mediaRecorder && mediaRecorder.state !== "inactive") {
      mediaRecorder.stop();
    }
  }

  function clearRecording() {
    const player = document.getElementById("player");
    if (currentRecordingUrl) {
      URL.revokeObjectURL(currentRecordingUrl);
      currentRecordingUrl = null;
    }
    player.removeAttribute("src");
    player.load();
    document.getElementById("clearRecordingBtn").hidden = true;
  }

  /* ---------- التبويبات ---------- */

  const TAB_SECTIONS = {
    new: ["dailyPlanCard", "newMemorizeCard", "counterCard", "recordCard"],
    review: ["reviewCard"],
    stabilize: ["reviewCard"],
    loose: ["looseCard"],
    stats: ["statsCard"],
  };

  function setActiveTab(tab) {
    state.activeTab = tab;
    saveState();

    Object.values(TAB_SECTIONS)
      .flat()
      .forEach((id) => {
        const el = document.getElementById(id);
        if (el) el.hidden = true;
      });

    (TAB_SECTIONS[tab] || []).forEach((id) => {
      const el = document.getElementById(id);
      if (el) el.hidden = false;
    });

    document.getElementById("reviewAddForm").hidden = tab !== "review";
    document.getElementById("stabilizeAddForm").hidden = tab !== "stabilize";

    document.querySelectorAll("nav button").forEach((b) => b.classList.remove("active"));
    const map = { new: "newBtn", review: "reviewBtn", stabilize: "stabilizeBtn", loose: "looseBtn", stats: "statsBtn" };
    const btn = document.getElementById(map[tab]);
    if (btn) btn.classList.add("active");

    if (tab === "review" || tab === "stabilize") renderReviewOrStabilize();
    if (tab === "loose") renderLoose();
    if (tab === "stats") renderStats();
    if (tab === "new") setupCounterForActiveUnit();
  }

  /* ---------- التاريخ اليوم ---------- */

  function renderTodayDate() {
    const el = document.getElementById("todayDate");
    if (!el) return;
    const formatter = new Intl.DateTimeFormat("ar", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
    el.textContent = formatter.format(new Date());
  }

  /* ---------- ربط الأحداث ---------- */

  function bindEvents() {
    document.getElementById("newBtn").addEventListener("click", () => setActiveTab("new"));
    document.getElementById("reviewBtn").addEventListener("click", () => setActiveTab("review"));
    document.getElementById("stabilizeBtn").addEventListener("click", () => setActiveTab("stabilize"));
    document.getElementById("looseBtn").addEventListener("click", () => setActiveTab("loose"));
    document.getElementById("statsBtn").addEventListener("click", () => setActiveTab("stats"));

    document.getElementById("startMemorize").addEventListener("click", startMemorize);

    document.querySelector(".counter .minus").addEventListener("click", () => changeCounter(-1));
    document.querySelector(".counter .plus").addEventListener("click", () => changeCounter(1));

    document.getElementById("recordBtn").addEventListener("click", startRecording);
    document.getElementById("stopBtn").addEventListener("click", stopRecording);
    document.getElementById("clearRecordingBtn").addEventListener("click", clearRecording);
  }

  /* ---------- تسجيل عامل الخدمة (اختياري لاحقاً) ---------- */

  function registerServiceWorkerIfAvailable() {
    if (!("serviceWorker" in navigator)) return;
    window.addEventListener("load", () => {
      navigator.serviceWorker.register("sw.js").catch(() => {
        /* لا يوجد sw.js بعد — يُتجاهل بصمت */
      });
    });
  }

  /* ---------- الإقلاع ---------- */

  function init() {
    renderTodayDate();
    populateSurahSelect();
    setupAddForms();
    bindEvents();
    refreshAll();
    renderDailyPlan();
    renderReviewOrStabilize();
    renderLoose();
    renderStats();
    setupCounterForActiveUnit();
    setActiveTab(state.activeTab || "new");
    registerServiceWorkerIfAvailable();
  }

  document.addEventListener("DOMContentLoaded", init);
})();
