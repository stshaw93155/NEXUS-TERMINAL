/**
 * NEXUS - High-Fidelity Intelligence & News Dataset
 * Built in accordance with PRD specifications.
 */

export const MOCK_STORIES = [
  {
    id: "DEV-047",
    code: "CASE // 2026-0047",
    title: "US–China Semiconductor Bilateral Talks & New High-Bandwidth Memory Export Directives",
    headline: "Washington and Beijing engage in high-stakes bilateral technology dialogue as new multilateral export controls on advanced AI packaging take effect.",
    summary: "Diplomatic delegations from the United States and China met in Geneva for an unscheduled 8-hour bilateral technology conference. High on the agenda were newly expanded restrictions on advanced HBM4 packaging and extreme ultraviolet lithography consumables. Financial markets in Tokyo, Seoul, and Taipei showed sharp early volatility before paring losses.",
    status: "DEVELOPING",
    importance: "CRITICAL",
    category: "TECHNOLOGY",
    region: "GLOBAL",
    location: "Geneva, Switzerland",
    coordinates: [46.2044, 6.1432],
    articleCount: 27,
    sourceCount: 12,
    timestamp: "14:32 UTC",
    relativeTime: "4m ago",
    consensus: "HIGH",
    videoFeedUrl: "https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
    sources: [
      { name: "Reuters", time: "14:28 UTC", stance: "Neutral reporting on Swiss bilateral delegations" },
      { name: "AP News", time: "14:21 UTC", stance: "Confirmation of Commerce Dept statement draft" },
      { name: "Bloomberg", time: "14:15 UTC", stance: "Analysis of market response across Taiwan semi index" },
      { name: "Nikkei Asia", time: "14:02 UTC", stance: "Impact assessment on Tokyo Electron & ASML supply lines" },
      { name: "Financial Times", time: "13:45 UTC", stance: "Diplomatic sources confirm unscheduled second session" }
    ],
    timeline: [
      { time: "08:14 UTC", text: "Geneva diplomatic sources report arrival of special technology envoys from US Department of Commerce and PRC Ministry of Commerce." },
      { time: "09:30 UTC", text: "Formal closed-door bilateral talks commence regarding advanced lithography guidelines and dual-use foundry limits." },
      { time: "11:45 UTC", text: "US Commerce Department issues preliminary guidance on third-party offshore packaging inspection standards." },
      { time: "13:20 UTC", text: "Asian tech equities close mixed; semiconductor foundry futures rise +1.4% on hopes of structured compliance window." },
      { time: "14:28 UTC", text: "Spokesperson from Swiss Federal Department of Foreign Affairs confirms talks extended into evening working session." }
    ],
    entities: [
      { name: "US Dept of Commerce", type: "Organization", role: "Regulatory Authority" },
      { name: "PRC Ministry of Commerce", type: "Organization", role: "Negotiating Party" },
      { name: "TSMC", type: "Company", role: "Affected Manufacturer" },
      { name: "ASML", type: "Company", role: "Equipment Supplier" },
      { name: "Geneva", type: "Location", role: "Summit Host" },
      { name: "HBM4 Memory", type: "Technology", role: "Restricted Asset" }
    ],
    aiAssessment: {
      reported: "US and Chinese trade negotiators have extended unscheduled bilateral discussions in Geneva over advanced semiconductor packaging and supply-chain inspection standards.",
      analysis: "The willingness to extend sessions rather than issue an immediate retaliatory statement suggests both administrations are seeking a structured licensing corridor rather than a blanket embargo.",
      uncertainty: "Conflicting reports remain regarding whether existing Japanese and Dutch equipment vendor contracts will be granted safe-harbor grace periods beyond Q3 2026.",
      whatToWatch: [
        "Joint communique expected at 18:00 CET from Geneva Press Club.",
        "US Department of Commerce Federal Register filing scheduled for 09:00 EST tomorrow.",
        "Hang Seng Tech Index futures reaction during Asian pre-market trading."
      ]
    }
  },
  {
    id: "DEV-048",
    code: "CASE // 2026-0048",
    title: "India Semiconductor Mission 2.0 Inks $14B Quad Fabrication & Packaging Accord in New Delhi",
    headline: "Union Ministry approves three new commercial 3nm test-bed facilities and advanced packaging hubs in Gujarat and Karnataka with Quad consortium backing.",
    summary: "India's Ministry of Electronics and Information Technology (MeitY) formally announced the expansion of the India Semiconductor Mission with $14 Billion in joint consortium capital. Partnering with enterprise leads from the US, Japan, and Australia, the initiative establishes commercial wafer test beds and advanced packaging clusters.",
    status: "DEVELOPING",
    importance: "HIGH",
    category: "TECHNOLOGY",
    region: "INDIA",
    location: "New Delhi, India",
    coordinates: [28.6139, 77.2090],
    articleCount: 19,
    sourceCount: 14,
    timestamp: "14:15 UTC",
    relativeTime: "21m ago",
    consensus: "HIGH",
    sources: [
      { name: "The Hindu", time: "14:10 UTC", stance: "Detailed breakdown of Union Cabinet approval" },
      { name: "Economic Times", time: "14:04 UTC", stance: "Financial breakdown of subsidies & equity structure" },
      { name: "Reuters", time: "13:50 UTC", stance: "Global supply chain diversification angle" },
      { name: "Livemint", time: "13:30 UTC", stance: "Infrastructure readiness in Dholera and Sanand" }
    ],
    timeline: [
      { time: "07:30 UTC", text: "Cabinet Committee on Economic Affairs (CCEA) greenlights expanded incentive pool." },
      { time: "10:15 UTC", text: "Joint press briefing held at Bharat Mandapam, New Delhi with visiting industry delegates." },
      { time: "12:45 UTC", text: "MoUs signed between Tata Electronics, Micron Technology, and state development agencies." },
      { time: "14:10 UTC", text: "MeitY issues operational notification for pilot line equipment clearance." }
    ],
    entities: [
      { name: "MeitY", type: "Organization", role: "Government Regulator" },
      { name: "Tata Electronics", type: "Company", role: "Anchor Fabricator" },
      { name: "New Delhi", type: "Location", role: "Capital City" },
      { name: "Gujarat / Sanand", type: "Location", role: "Manufacturing Hub" }
    ],
    aiAssessment: {
      reported: "India has finalized an expanded $14B subsidy and infrastructure package for commercial semiconductor fabrication.",
      analysis: "Accelerates South Asia's transition into the primary tier of global assembly, testing, and packaging (ATMP) and wafer fabrication.",
      uncertainty: "Timelines for water recycling plants and 24/7 dedicated high-voltage power sub-stations remain under municipal review in two states.",
      whatToWatch: [
        "Groundbreaking timelines scheduled for Sanand phase-2 facility next month.",
        "Foreign investment approvals from Japanese Ministry of Economy, Trade and Industry (METI)."
      ]
    }
  },
  {
    id: "DEV-049",
    code: "CASE // 2026-0049",
    title: "Strait of Hormuz Commercial Shipping Advisory Following Drone Interception Incident",
    headline: "Joint Maritime Information Center elevates risk posture to Amber after naval task force intercepts reconnaissance UAV over shipping corridors.",
    summary: "Maritime trade associations and the Combined Maritime Forces issued updated safety routing notices for merchant vessels transiting the Strait of Hormuz. A commercial container carrier escorted by regional naval patrols safely passed following the interception of an unidentified low-altitude reconnaissance drone.",
    status: "CRITICAL",
    importance: "CRITICAL",
    category: "DEFENCE",
    region: "MIDDLE EAST",
    location: "Strait of Hormuz",
    coordinates: [26.5667, 56.2500],
    articleCount: 34,
    sourceCount: 21,
    timestamp: "14:02 UTC",
    relativeTime: "34m ago",
    consensus: "SPLIT",
    videoFeedUrl: "https://storage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4",
    sources: [
      { name: "Lloyd's List", time: "13:58 UTC", stance: "War-risk insurance premium updates for Gulf transit" },
      { name: "UKMTO", time: "13:42 UTC", stance: "Official advisory bulletin 019/MAR/2026" },
      { name: "Al Jazeera", time: "13:30 UTC", stance: "Regional naval denial of offensive intent" },
      { name: "BBC News", time: "13:15 UTC", stance: "Naval escort protocols activated for LNG tankers" }
    ],
    timeline: [
      { time: "06:10 UTC", text: "UKMTO receives initial notification of suspicious radar track 18 nautical miles north of Ras Musandam." },
      { time: "08:45 UTC", text: "Combined task force ship dispatches air defense interceptor; drone destroyed without damage to commercial traffic." },
      { time: "11:20 UTC", text: "International marine insurance underwriters convene emergency joint war committee session." },
      { time: "14:02 UTC", text: "Maritime advisory elevated to Condition Bravo: transit permitted only with designated tracking transponders active." }
    ],
    entities: [
      { name: "UKMTO", type: "Organization", role: "Maritime Safety Agency" },
      { name: "Combined Maritime Forces", type: "Organization", role: "Naval Coalition" },
      { name: "Strait of Hormuz", type: "Location", role: "Critical Chokepoint" }
    ],
    aiAssessment: {
      reported: "An unidentified drone was intercepted over the Strait of Hormuz, prompting an elevated shipping advisory and increased insurance premiums.",
      analysis: "The incident represents a probe of commercial corridor escort readiness rather than an opening salvo of kinetic strikes, but threatens immediate upward pressure on spot tanker charter rates.",
      uncertainty: "Origin and control frequency of the intercepted UAV remains disputed between regional military statements.",
      whatToWatch: [
        "Lloyd's Market Association war risk syndicate rate bulletin tomorrow morning.",
        "Bunker fuel pricing shifts in Singapore and Fujairah."
      ]
    }
  },
  {
    id: "DEV-050",
    code: "CASE // 2026-0050",
    title: "European Commission Finalizes Enforcement Directives for Frontier AI Autonomous Agent Frameworks",
    headline: "Brussels publishes harmonized testing benchmarks for autonomous models operating with financial and infrastructure execution privileges.",
    summary: "The European AI Board and the European Commission have released the final implementation guidelines under the EU AI Act covering frontier multi-agent frameworks. Developers deploying autonomous software agents capable of programmatic financial transactions or critical infrastructure access must complete third-party red-teaming certification.",
    status: "CONFIRMED",
    importance: "HIGH",
    category: "AI",
    region: "EUROPE",
    location: "Brussels, Belgium",
    coordinates: [50.8503, 4.3517],
    articleCount: 22,
    sourceCount: 16,
    timestamp: "13:48 UTC",
    relativeTime: "48m ago",
    consensus: "HIGH",
    sources: [
      { name: "Euractiv", time: "13:45 UTC", stance: "Regulatory timetable and compliance grace periods" },
      { name: "Politico EU", time: "13:32 UTC", stance: "Reactions from European tech founders and industry groups" },
      { name: "Financial Times", time: "13:10 UTC", stance: "Comparison with proposed UK and US light-touch regulatory codes" }
    ],
    timeline: [
      { time: "09:00 UTC", text: "EU AI Board submits consensus documentation to Directorate-General for Communications Networks." },
      { time: "11:30 UTC", text: "Commissioner holds press conference announcing 180-day grace transition window." },
      { time: "13:48 UTC", text: "Official journal publishes 142-page technical annex on automated agent boundaries." }
    ],
    entities: [
      { name: "European Commission", type: "Organization", role: "Regulatory Body" },
      { name: "EU AI Board", type: "Organization", role: "Enforcement Agency" },
      { name: "Brussels", type: "Location", role: "EU Headquarters" }
    ],
    aiAssessment: {
      reported: "Brussels has published definitive technical standards and audit requirements for autonomous AI agents.",
      analysis: "Sets the benchmark for global regulatory compliance; large international developers will likely harmonize global safety stacks to the European standard to prevent fragmented codebases.",
      uncertainty: "Clarity on liability attribution between model creators vs downstream application orchestrators remains subject to national court precedent.",
      whatToWatch: [
        "Reaction from US tech lobby and open-source model maintainers.",
        "Member state digital ministry appointments to the auditing board."
      ]
    }
  },
  {
    id: "DEV-051",
    code: "CASE // 2026-0051",
    title: "OPEC+ Ministers Schedule Emergency Virtual Session as Brent Spot Volatility Spikes",
    headline: "Crude benchmark trades in sharp 3.8% intraday band following Middle East logistics updates and unexpected US inventory draws.",
    summary: "Energy ministers representing the OPEC+ coalition agreed to convene an extraordinary consultative session via teleconference. With Brent crude testing $83.40 per barrel following geopolitical friction and unexpected refinery demand across East Asia, delegates are evaluating dynamic output quota adjustments.",
    status: "DEVELOPING",
    importance: "HIGH",
    category: "MARKETS",
    region: "GLOBAL",
    location: "Riyadh, Saudi Arabia",
    coordinates: [24.7136, 46.6753],
    articleCount: 18,
    sourceCount: 15,
    timestamp: "13:15 UTC",
    relativeTime: "1h 21m ago",
    consensus: "HIGH",
    sources: [
      { name: "Bloomberg Energy", time: "13:12 UTC", stance: "Analysis of production headroom among Gulf producers" },
      { name: "Wall Street Journal", time: "12:55 UTC", stance: "Sources confirm Saudi-Russian co-chairs requested meeting" },
      { name: "Argus Media", time: "12:30 UTC", stance: "Physical refinery margins and tanker freight impact" }
    ],
    timeline: [
      { time: "10:00 UTC", text: "EIA release reveals larger-than-forecast draw of 4.2M barrels." },
      { time: "11:45 UTC", text: "Brent prompts break through 50-day moving average resistance." },
      { time: "13:15 UTC", text: "OPEC Secretariat issues calendar update for Friday 13:00 GMT virtual gathering." }
    ],
    entities: [
      { name: "OPEC+", type: "Organization", role: "Petroleum Producer Alliance" },
      { name: "Brent Crude", type: "Topic", role: "Commodity Benchmark" },
      { name: "Riyadh", type: "Location", role: "Secretariat Liaison" }
    ],
    aiAssessment: {
      reported: "OPEC+ will hold an emergency virtual consultation this Friday to review current supply dynamics.",
      analysis: "Signals that core producers want to prevent runaway pricing that might trigger inflation backlash in major importing economies while defending floor support.",
      uncertainty: "Whether voluntary production cuts will be unwound or extended through Q4 remains unresolved.",
      whatToWatch: [
        "Preliminary informal statements from UAE and Saudi energy ministers.",
        "Weekly CFTC speculative commitment of traders report."
      ]
    }
  },
  {
    id: "DEV-052",
    code: "CASE // 2026-0052",
    title: "NASA-ESA Lunar Gateway Optical Relay Satellite Successfully Inserted into Halo Orbit",
    headline: "High-bandwidth laser communication payload achieves 1.2 Gbps optical downlink test with Goldstone Deep Space Communications Complex.",
    summary: "The Pathfinder-2 lunar relay spacecraft completed its final orbit insertion burn, establishing a persistent high-throughput communications link for the upcoming Artemis IV surface expedition. Ground engineers at Darmstadt and Houston confirmed flawless lock on optical ground stations.",
    status: "CONFIRMED",
    importance: "INFO",
    category: "SCIENCE",
    region: "US",
    location: "Cape Canaveral, FL, USA",
    coordinates: [28.3922, -80.6077],
    articleCount: 15,
    sourceCount: 11,
    timestamp: "12:40 UTC",
    relativeTime: "1h 56m ago",
    consensus: "HIGH",
    sources: [
      { name: "SpaceNews", time: "12:35 UTC", stance: "Telemetry validation and orbital trajectory analysis" },
      { name: "Aviation Week", time: "12:15 UTC", stance: "Technical evaluation of optical laser terminal vs traditional S-band" },
      { name: "ESA Bulletin", time: "11:50 UTC", stance: "European Space Operations Centre telemetry readout" }
    ],
    timeline: [
      { time: "04:20 UTC", text: "Relay spacecraft initiates main thruster burn." },
      { time: "05:05 UTC", text: "Near-rectilinear halo orbit (NRHO) insertion confirmed." },
      { time: "12:40 UTC", text: "First gigabit optical link verified with California ground station." }
    ],
    entities: [
      { name: "NASA", type: "Organization", role: "Space Agency" },
      { name: "ESA", type: "Organization", role: "Space Agency" },
      { name: "Artemis IV", type: "Topic", role: "Lunar Mission" }
    ],
    aiAssessment: {
      reported: "Lunar communications relay successfully inserted into NRHO with working gigabit laser downlink.",
      analysis: "Removes a critical bottleneck for high-definition live astronaut scientific feeds and lunar south pole autonomous rover telemetry.",
      uncertainty: "Atmospheric cloud interference mitigation protocols during monsoon and heavy precipitation will undergo seasonal testing.",
      whatToWatch: [
        "First public 4K ultra-high-definition test broadcast from lunar orbit."
      ]
    }
  },
  {
    id: "DEV-053",
    code: "CASE // 2026-0053",
    title: "Extreme Meteorological Heatwave Triggers Synchronized Grid Load Curtailment in Southeast Asia",
    headline: "Industrial operations in Bangkok, Ho Chi Minh City, and Kuala Lumpur activate peak-demand response as wet-bulb temperatures exceed seasonal records.",
    summary: "National electrical dispatchers across Thailand, Vietnam, and Malaysia implemented coordinated grid stability measures as temperatures climbed to 43°C accompanied by high humidity. Steel mills and heavy industrial users were instructed to shift heavy energy intensive cycles to off-peak night hours.",
    status: "DEVELOPING",
    importance: "HIGH",
    category: "CLIMATE",
    region: "ASIA",
    location: "Bangkok, Thailand",
    coordinates: [13.7563, 100.5018],
    articleCount: 16,
    sourceCount: 10,
    timestamp: "12:10 UTC",
    relativeTime: "2h 26m ago",
    consensus: "HIGH",
    sources: [
      { name: "Bangkok Post", time: "12:05 UTC", stance: "Industrial zoning energy allocation schedules" },
      { name: "VnExpress", time: "11:40 UTC", stance: "Hydroelectric reservoir water head levels in northern provinces" },
      { name: "CNA", time: "11:15 UTC", stance: "Regional meteorological outlook for next 72 hours" }
    ],
    timeline: [
      { time: "06:00 UTC", text: "Peak thermal demand spikes 14% above historical records." },
      { time: "09:30 UTC", text: "Industrial grid switchgear automatically sheds tier-3 industrial loads." },
      { time: "12:10 UTC", text: "Ministries announce public cooling shelter networks and hospital emergency readiness." }
    ],
    entities: [
      { name: "EGAT", type: "Organization", role: "Electricity Generating Authority" },
      { name: "Bangkok", type: "Location", role: "Affected Capital" },
      { name: "Mekong Basin", type: "Location", role: "Regional Hydro Network" }
    ],
    aiAssessment: {
      reported: "Southeast Asian power authorities have mandated industrial load shedding amid an intense regional heatwave.",
      analysis: "Highlights the fragility of rapid manufacturing electrification during extreme climate anomalies; could cause minor delivery delays in consumer electronics assembly.",
      uncertainty: "Weather forecast models differ on whether tropical monsoon rainfall will break the ridge pattern within 48 or 96 hours.",
      whatToWatch: [
        "Hydropower reservoir storage updates from provincial energy authorities."
      ]
    }
  },
  {
    id: "DEV-054",
    code: "CASE // 2026-0054",
    title: "Global Tech Industry Coalition Forms Autonomous Agent Red-Teaming & Verification League",
    headline: "Twelve leading artificial intelligence labs establish standardized safety containment protocols and shared threat intelligence database.",
    summary: "In a landmark joint initiative, twelve of the world's most prominent AI laboratories and enterprise cloud infrastructure providers announced the formation of the Global AI Verification League (GAVL). The alliance will establish open protocols for evaluating model autonomy, sandboxing, and systemic risk mitigation.",
    status: "DEVELOPING",
    importance: "MEDIUM",
    category: "AI",
    region: "GLOBAL",
    location: "San Francisco, CA, USA",
    coordinates: [37.7749, -122.4194],
    articleCount: 29,
    sourceCount: 18,
    timestamp: "11:30 UTC",
    relativeTime: "3h 6m ago",
    consensus: "HIGH",
    sources: [
      { name: "MIT Tech Review", time: "11:25 UTC", stance: "Evaluation of the verification framework metrics" },
      { name: "Wired", time: "11:00 UTC", stance: "Behind-the-scenes negotiation between competing lab executives" },
      { name: "The Verge", time: "10:45 UTC", stance: "Open source vs proprietary model audit access rights" }
    ],
    timeline: [
      { time: "08:00 UTC", text: "Charter announcement published simultaneously across partner channels." },
      { time: "10:30 UTC", text: "First shared repository of automated containment exploit signatures released." },
      { time: "11:30 UTC", text: "Coalition representatives commit to bi-monthly public benchmark reporting." }
    ],
    entities: [
      { name: "GAVL", type: "Organization", role: "Industry Alliance" },
      { name: "San Francisco", type: "Location", role: "HQ Hub" }
    ],
    aiAssessment: {
      reported: "Major AI organizations have formed an autonomous agent security alliance to standardize containment benchmarks.",
      analysis: "Represents an industry-led effort to self-regulate and pre-empt more onerous national legislative mandates by showcasing rigorous standardized safety benchmarks.",
      uncertainty: "Whether Chinese frontier AI labs will be invited to participate in the threat intelligence exchange remains diplomatically sensitive.",
      whatToWatch: [
        "Inaugural safety benchmark release date slated for Q3."
      ]
    }
  }
];

export const MOCK_ALERTS = [
  {
    id: "ALT-01",
    level: "CRITICAL",
    category: "DEFENCE",
    region: "MIDDLE EAST",
    headline: "Strait of Hormuz: High-risk drone intercept reported over commercial channel",
    timestamp: "14:02 UTC",
    relativeTime: "34m ago",
    storyId: "DEV-049"
  },
  {
    id: "ALT-02",
    level: "HIGH",
    category: "TECHNOLOGY",
    region: "GLOBAL",
    headline: "US-China Geneva bilateral talks extended into unscheduled evening session",
    timestamp: "14:28 UTC",
    relativeTime: "8m ago",
    storyId: "DEV-047"
  },
  {
    id: "ALT-03",
    level: "HIGH",
    category: "MARKETS",
    region: "GLOBAL",
    headline: "OPEC+ calls extraordinary ministerial consultation on spot volatility",
    timestamp: "13:15 UTC",
    relativeTime: "1h 21m ago",
    storyId: "DEV-051"
  },
  {
    id: "ALT-04",
    level: "MEDIUM",
    category: "CLIMATE",
    region: "ASIA",
    headline: "Southeast Asia regional grid emergency triggered by record heat dome",
    timestamp: "12:10 UTC",
    relativeTime: "2h 26m ago",
    storyId: "DEV-053"
  },
  {
    id: "ALT-05",
    level: "INFO",
    category: "SCIENCE",
    region: "US",
    headline: "NASA-ESA lunar relay satellite locks 1.2 Gbps optical telemetry link",
    timestamp: "12:40 UTC",
    relativeTime: "1h 56m ago",
    storyId: "DEV-052"
  }
];

export const MOCK_TRENDING = [
  { rank: "01", topic: "US-CHINA SEMICONDUCTORS", count: 27, velocity: 94, trend: "up" },
  { rank: "02", topic: "HORMUZ MARITIME ADVISORY", count: 34, velocity: 88, trend: "up" },
  { rank: "03", topic: "INDIA SEMICONDUCTOR MISSION", count: 19, velocity: 76, trend: "up" },
  { rank: "04", topic: "EU AI AGENT DIRECTIVE", count: 22, velocity: 68, trend: "stable" },
  { rank: "05", topic: "BRENT SPOT VOLATILITY", count: 18, velocity: 62, trend: "up" },
  { rank: "06", topic: "SOUTHEAST ASIA HEAT DOME", count: 16, velocity: 54, trend: "stable" }
];

export const MOCK_GEMINI_KNOWLEDGE = {
  defaultAnswer: {
    summary: "Global intelligence monitoring indicates two high-priority developments active right now: **Bilateral US-China semiconductor talks in Geneva** extending into overtime, and an **elevated commercial maritime advisory in the Strait of Hormuz** following drone interception activity.",
    keyDevelopments: [
      "Geneva bilateral talks between US Commerce and Chinese Ministry of Commerce extended into evening session.",
      "Maritime security condition elevated in Persian Gulf shipping lanes with naval escort units on alert.",
      "India approved $14B expanded Quad semiconductor initiative in New Delhi.",
      "European Commission released binding autonomous AI agent audit standards."
    ],
    whyItMatters: "These synchronized developments affect international tech hardware supply chains, immediate crude energy transit routes, and global regulatory compliance for autonomous intelligence systems.",
    timeline: [
      { time: "08:14 UTC", text: "US and China trade delegations arrive in Geneva." },
      { time: "11:20 UTC", text: "Gulf maritime warning issued following air intercept." },
      { time: "14:10 UTC", text: "India MeitY signs $14B Quad semiconductor pact." },
      { time: "14:28 UTC", text: "Geneva talks extended into overtime." }
    ],
    sources: [
      { name: "Reuters", time: "14:28 UTC", note: "Bilateral Geneva talks coverage" },
      { name: "UKMTO", time: "14:02 UTC", note: "Maritime safety bulletin 019" },
      { name: "The Hindu", time: "14:10 UTC", note: "MeitY semiconductor announcement" },
      { name: "Bloomberg", time: "13:15 UTC", note: "OPEC emergency conference report" }
    ],
    confidence: "HIGH",
    whatToWatch: [
      "Geneva joint communique expected within 2 hours.",
      "Global energy spot markets opening reaction in Tokyo and London."
    ]
  }
};
