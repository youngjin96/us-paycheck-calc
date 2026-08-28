/**
 * 주별 편집 콘텐츠.
 *
 * 각 주 페이지가 "템플릿에 숫자만 바꾼 페이지"가 되지 않도록, 그 주에서만
 * 성립하는 사실을 중심으로 쓴다. Google 의 scaled content abuse 정책과
 * 애드센스 thin content 반려를 피하는 핵심 장치다.
 */
export type StateContent = {
  /** 페이지 상단 요약 — 그 주 급여의 가장 특징적인 사실 한 가지 */
  lede: string;
  /** 본문 도입 문단들 */
  intro: string[];
  keyPoints: { title: string; body: string }[];
  faqs: { q: string; a: string }[];
};

export const STATE_CONTENT: Record<string, StateContent> = {
  CA: {
    lede: "California has the highest top income tax rate in the country — and since 2024, its disability insurance tax has no wage ceiling at all.",
    intro: [
      "California withholds more from a high earner's paycheck than any other state. The headline is the income tax: nine brackets running from 1% to 12.3%, plus a 1% Mental Health Services surcharge on income above $1 million, for a 13.3% top rate.",
      "But the change that actually caught people off guard was to State Disability Insurance. Before 2024, SDI stopped once your wages passed a cap of roughly $153,000. Senate Bill 951 removed that ceiling entirely. Every dollar you earn in California is now subject to SDI, and for 2026 the rate rose again to 1.3%.",
    ],
    keyPoints: [
      {
        title: "SDI is uncapped and rose to 1.3% in 2026",
        body: "On a $400,000 salary that is $5,200 a year, up from $4,800 at the 2025 rate. Under the pre-2024 rules it would have been about $1,600. This is the single biggest reason California take-home estimates from older calculators are wrong for high earners.",
      },
      {
        title: "The standard deduction is small",
        body: "California's standard deduction is $5,540 for single filers — about a third of the federal $16,100. More of your income is exposed to state tax than you might expect coming from another state.",
      },
      {
        title: "Personal exemptions are credits, not deductions",
        body: "California subtracts a flat $153 (single) or $306 (joint) from the tax you owe, rather than from your taxable income, plus $475 for each dependent. That structure is worth proportionally more to lower earners.",
      },
      {
        title: "No local income taxes",
        body: "Unlike New York or Pennsylvania, no California city levies its own income tax. San Francisco's gross receipts tax falls on businesses, not on employee wages.",
      },
    ],
    faqs: [
      {
        q: "Why is California SDI taken out of my whole salary now?",
        a: "SB 951 eliminated the taxable wage ceiling effective January 1, 2024. The tax funds State Disability Insurance and Paid Family Leave benefits, which were increased at the same time. There is no income level at which SDI withholding stops.",
      },
      {
        q: "Does California tax my 401(k) contributions?",
        a: "No. California follows the federal treatment: pre-tax 401(k) contributions reduce both your federal and your California taxable income. (Pennsylvania is the notable state that does not.)",
      },
      {
        q: "What is the 13.3% California tax rate?",
        a: "It applies only to taxable income above $1 million, and it is 12.3% plus the 1% Mental Health Services Act surcharge. A worker earning $200,000 pays a top marginal rate of 9.3%, not 13.3%.",
      },
    ],
  },

  TX: {
    lede: "Texas has no state income tax, so your paycheck deductions stop at the federal line — but that is not the whole tax picture.",
    intro: [
      "Texas is one of eight states with no individual income tax on wages, and it levies no employee-side payroll taxes either. Your Texas paycheck has exactly three mandatory deductions: federal income tax, Social Security, and Medicare.",
      "That makes Texas take-home pay unusually easy to predict. It also makes the comparison to states like California or New York larger than most people expect — often eight to ten percent of gross for a mid-career salary.",
    ],
    keyPoints: [
      {
        title: "Three deductions, no state layer",
        body: "Federal income tax, 6.2% Social Security up to $184,500, and 1.45% Medicare with no cap. Nothing else is withheld by law.",
      },
      {
        title: "No employee unemployment or disability tax",
        body: "Texas funds unemployment insurance entirely through employer contributions. Compare that with New Jersey, where employees pay into three separate state programs.",
      },
      {
        title: "The trade-off shows up in property tax",
        body: "Texas has among the highest effective property tax rates in the country, and a 6.25% state sales tax before local add-ons. A higher take-home paycheck does not automatically mean a lower total tax burden — it depends heavily on whether you own a home.",
      },
    ],
    faqs: [
      {
        q: "Will I owe Texas state tax if I work remotely for a company in another state?",
        a: "Generally your state income tax follows where you physically perform the work, not where your employer is based. Living and working in Texas usually means no state income tax withholding. Some states apply 'convenience of the employer' rules that can change this — New York is the most aggressive — so check if your employer is New York-based.",
      },
      {
        q: "Why is federal tax still taken out of my Texas paycheck?",
        a: "Federal income tax and FICA are levied by the federal government and apply in all fifty states. Only the state layer is absent in Texas.",
      },
    ],
  },

  NY: {
    lede: "New York State tax is only part of the story — living in New York City adds a separate city income tax on top.",
    intro: [
      "New York's state income tax runs from 3.9% to 10.9% across nine brackets. For 2026 the lower brackets were reduced, which modestly increases take-home pay for middle earners.",
      "The bigger variable is geography. New York City levies its own resident income tax of roughly 3.078% to 3.876%, and Yonkers adds a surcharge equal to 16.75% of your state tax. Two people with identical salaries can see meaningfully different paychecks depending on which side of the city line they live on.",
    ],
    keyPoints: [
      {
        title: "NYC residency is the biggest single factor",
        body: "The city tax applies based on where you live, not where you work. A Manhattan office worker commuting from New Jersey pays no NYC resident tax; a Brooklyn resident working remotely for a Texas company does.",
      },
      {
        title: "Paid Family Leave is capped at $411.91",
        body: "The 2026 contribution rate is 0.432% of gross wages, but it stops once you hit the cap tied to the state average weekly wage. Above roughly $95,000 in salary the deduction is a flat annual amount.",
      },
      {
        title: "Yonkers is a surcharge, not a separate rate",
        body: "Yonkers residents pay an extra 16.75% of their New York State tax liability. Because it is calculated on tax rather than on income, it scales with your bracket.",
      },
      {
        title: "The 'convenience of the employer' rule",
        body: "If you work remotely for a New York employer, New York may still tax that income unless your remote work is for your employer's necessity rather than your own convenience. This catches many out-of-state remote workers.",
      },
    ],
    faqs: [
      {
        q: "Do I pay NYC income tax if I work in Manhattan but live in New Jersey?",
        a: "No. The New York City resident income tax applies only to city residents. You will owe New York State non-resident tax on the income earned in New York, and New Jersey generally gives you a credit for it.",
      },
      {
        q: "How much is NYC income tax?",
        a: "Rates run from 3.078% to 3.876%, with the top rate applying above about $50,000 of taxable income for single filers. Our calculator applies the top rate, so treat it as a conservative estimate for lower incomes.",
      },
    ],
  },

  FL: {
    lede: "Florida levies no individual income tax and no employee payroll taxes, so only federal deductions come out of your paycheck.",
    intro: [
      "Florida's constitution prohibits a personal income tax. As in Texas, your paycheck is reduced only by federal income tax and FICA — there is no state withholding line at all.",
      "For someone relocating from a high-tax state, the difference is immediate and large. A $120,000 salary keeps roughly $7,000 more per year in Florida than in California, before considering cost of living.",
    ],
    keyPoints: [
      {
        title: "No state income tax, and no realistic path to one",
        body: "Introducing a personal income tax would require a constitutional amendment, so this is unusually stable compared to states where rates change year to year.",
      },
      {
        title: "No employee-side unemployment or disability withholding",
        body: "Florida's reemployment tax is paid entirely by employers.",
      },
      {
        title: "Sales and property taxes carry the load",
        body: "Florida has a 6% state sales tax plus county surtaxes, and property insurance costs — while not a tax — have risen sharply enough to offset income tax savings for many homeowners.",
      },
    ],
    faqs: [
      {
        q: "Do I need to file a Florida state tax return?",
        a: "No. Florida has no individual income tax return. You file only your federal return.",
      },
      {
        q: "I moved to Florida mid-year. Do I still owe tax to my old state?",
        a: "Yes, on the income you earned while a resident there. You will generally file a part-year resident return in your former state for that portion of the year.",
      },
    ],
  },

  IL: {
    lede: "Illinois taxes all income at a single flat 4.95% rate — there is no standard deduction, only a personal exemption allowance.",
    intro: [
      "Illinois is a flat-tax state. Whether you earn $40,000 or $400,000, the state rate is 4.95%. A 2020 ballot measure to move to graduated rates was rejected by voters, so the flat structure remains in the state constitution.",
      "What surprises people is the absence of a standard deduction. Illinois only lets you subtract a personal exemption allowance — $2,925 per person for 2026 — before applying the rate. Low earners therefore pay state tax on almost all of their income.",
    ],
    keyPoints: [
      {
        title: "Flat 4.95% with no brackets",
        body: "Your marginal and average state rates are effectively identical, which makes Illinois take-home pay very simple to project across raises.",
      },
      {
        title: "The exemption allowance scales with household size",
        body: "$2,925 for yourself, doubled if married filing jointly, plus $2,925 for each dependent. At the 4.95% rate each exemption is worth about $145 a year.",
      },
      {
        title: "No employee payroll taxes",
        body: "Illinois has no state disability or paid family leave program funded by employee withholding, unlike California, New York, New Jersey, or Washington.",
      },
      {
        title: "Retirement income is exempt",
        body: "Illinois does not tax distributions from 401(k)s, IRAs, or pensions — unusual among states with an income tax, and a significant factor in retirement planning.",
      },
    ],
    faqs: [
      {
        q: "Does Chicago have a city income tax?",
        a: "No. Chicago levies no municipal income tax on wages. Illinois residents pay only the 4.95% state rate regardless of city.",
      },
      {
        q: "Is my 401(k) contribution deductible in Illinois?",
        a: "Yes. Illinois starts from federal adjusted gross income, so pre-tax 401(k) contributions are already excluded. Withdrawals in retirement are also exempt from Illinois tax.",
      },
    ],
  },

  WA: {
    lede: "Washington has no income tax, but two mandatory state programs still come out of every paycheck — and one of them jumped 23% in 2026.",
    intro: [
      "Washington is often listed alongside Texas and Florida as a no-income-tax state, and for wages that is accurate. But unlike those states, Washington funds two social insurance programs directly through employee withholding.",
      "Paid Family and Medical Leave premiums rose from 0.92% to 1.13% of wages on January 1, 2026, with employees paying 71.43% of that. Separately, the WA Cares Fund long-term care premium takes 0.58% of gross wages with no cap at all. Together they can exceed 1.3% of pay.",
    ],
    keyPoints: [
      {
        title: "PFML rose to 1.13% total in 2026",
        body: "Employees pay 71.43% of the premium — about 0.81% of wages — capped at the Social Security wage base of $184,500.",
      },
      {
        title: "WA Cares has no wage cap",
        body: "The 0.58% long-term care premium applies to every dollar of wages. On a $300,000 salary that is $1,740 a year. Workers who obtained an approved exemption before the window closed are excluded.",
      },
      {
        title: "No tax on wages, but a capital gains tax exists",
        body: "Washington enacted a 7% tax on long-term capital gains above an annual threshold. It does not touch salary income, but it matters if you have RSUs you have already sold or other investment gains.",
      },
    ],
    faqs: [
      {
        q: "Why is money being deducted if Washington has no income tax?",
        a: "PFML and WA Cares are insurance premiums, not income taxes. They fund paid leave and long-term care benefits you can claim later. They appear on your pay stub as separate lines from any tax.",
      },
      {
        q: "Can I opt out of WA Cares?",
        a: "The general exemption window for people with private long-term care insurance closed at the end of 2022. Some narrow exemptions remain — for example certain non-residents and military spouses — and must be approved by the Employment Security Department.",
      },
    ],
  },

  NJ: {
    lede: "New Jersey withholds three separate employee payroll taxes on top of income tax — but two of their rates were cut for 2026.",
    intro: [
      "New Jersey's income tax runs from 1.4% to 10.75%, with the top rate reserved for income above $1 million. Married filers get a distinct bracket structure rather than simply doubled thresholds, which is unusual.",
      "What sets New Jersey apart is the payroll side. Employees contribute to unemployment insurance, temporary disability, and family leave insurance as three separate line items, each with its own rate and wage base. For 2026 both the disability and family leave rates fell — TDI from 0.23% to 0.19%, FLI from 0.33% to 0.23%.",
    ],
    keyPoints: [
      {
        title: "Two different wage bases apply",
        body: "Unemployment and workforce contributions stop at $44,800 of wages, while disability and family leave run to $171,100. Mid-year, a New Jersey pay stub can shrink noticeably as the lower cap is reached.",
      },
      {
        title: "TDI and FLI rates both dropped for 2026",
        body: "The maximum employee disability contribution is $325.09 and family leave is $393.53. Combined, the three programs cost a high earner about $909 a year.",
      },
      {
        title: "No standard deduction, but personal exemptions",
        body: "New Jersey allows $1,000 per filer ($2,000 married filing jointly) and $1,500 per dependent, subtracted from income rather than from tax.",
      },
      {
        title: "New York commuters get a credit, not an exemption",
        body: "If you live in New Jersey and work in New York, you pay New York non-resident tax first, then claim a credit on your New Jersey return. Because New York's rates are generally higher, most commuters owe little additional New Jersey tax.",
      },
    ],
    faqs: [
      {
        q: "What are the UI, DI and FLI lines on my New Jersey pay stub?",
        a: "They are employee contributions to unemployment insurance, temporary disability insurance, and family leave insurance respectively. Unlike most states, New Jersey funds part of each program through employee withholding rather than employer taxes alone.",
      },
      {
        q: "Why did my New Jersey deductions get smaller partway through the year?",
        a: "The unemployment and workforce wage base is only $44,800. Once your year-to-date wages pass it, that deduction stops for the rest of the year while disability and family leave continue to $171,100.",
      },
    ],
  },

  PA: {
    lede: "Pennsylvania's 3.07% flat rate looks cheap — until you add local earned income tax and discover the state taxes your 401(k) contributions.",
    intro: [
      "Pennsylvania has the lowest flat income tax rate of any state that levies one: 3.07%, with no standard deduction and no personal exemption. On paper that is a bargain compared with neighbouring New York or New Jersey.",
      "Two things complicate it. Nearly every municipality and school district levies its own Earned Income Tax, typically 1% but reaching 3.75% for Philadelphia residents. And Pennsylvania is one of the very few states that taxes elective 401(k) deferrals in the year you make them, rather than when you withdraw.",
    ],
    keyPoints: [
      {
        title: "Your 401(k) does not reduce Pennsylvania tax",
        body: "Contributing $20,000 to a traditional 401(k) cuts your federal taxable income by $20,000 but your Pennsylvania taxable income by nothing. The upside is that qualified retirement distributions are then exempt from Pennsylvania tax later.",
      },
      {
        title: "Philadelphia's Wage Tax applies to gross pay",
        body: "The 3.75% resident rate is charged on gross wages with no deductions at all. Non-residents working in the city pay 3.44%. Combined with the state rate, a Philadelphia resident faces roughly 6.8% before federal tax.",
      },
      {
        title: "Suburban EIT is usually 1%",
        body: "Outside Philadelphia, the local Earned Income Tax is typically split between your municipality and school district and totals around 1%. The exact rate depends on your home address, not your workplace.",
      },
      {
        title: "Employees pay a small unemployment tax",
        body: "Pennsylvania withholds 0.07% for unemployment compensation with no wage cap — small, but one of the few states to charge employees at all.",
      },
    ],
    faqs: [
      {
        q: "Does Pennsylvania really tax 401(k) contributions?",
        a: "Yes, for elective deferrals to a 401(k) or 403(b). Pennsylvania does not follow the federal exclusion at contribution time. In exchange, distributions after age 59½ from qualified plans are generally not taxed by Pennsylvania.",
      },
      {
        q: "How do I find my local EIT rate?",
        a: "Pennsylvania's Department of Community and Economic Development publishes an official municipal tax register searchable by address. Your rate is set by where you live, and your employer withholds based on the higher of your resident or work-location rate.",
      },
      {
        q: "Is Pennsylvania's flat tax really only 3.07%?",
        a: "At the state level, yes. But almost everyone also pays local Earned Income Tax, so the realistic combined rate is about 4.07% for most residents and 6.82% for Philadelphia residents.",
      },
    ],
  },
};
