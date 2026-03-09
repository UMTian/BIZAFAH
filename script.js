// PERFORMANCE OPTIMIZATION - Animation Controller
const animationController = {
    activeScenes: new Set(),
    observers: new Map(),

    // Register a Three.js scene with its container ID
    registerScene(containerId, animateFunction) {
        const container = document.getElementById(containerId);
        if (!container) return;

        // Create observer for this container
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    // Scene is visible - add to active scenes
                    this.activeScenes.add(containerId);
                    console.log(`${containerId} is now visible`); // For debugging
                } else {
                    // Scene is hidden - remove from active scenes
                    this.activeScenes.delete(containerId);
                    console.log(`${containerId} is now hidden`); // For debugging
                }
            });
        }, { threshold: 0.05 }); // Trigger when just 5% visible

        observer.observe(container);
        this.observers.set(containerId, observer);

        // Store the animate function
        this.observers.set(`${containerId}-animate`, animateFunction);
    },

    // Check if a scene should be rendering
    shouldRender(containerId) {
        return this.activeScenes.has(containerId);
    },

    // Clean up
    disconnect() {
        this.observers.forEach((observer, key) => {
            if (key.toString().includes('-animate')) return;
            observer.disconnect();
        });
    }
};

// Router System
const router = {
    currentPage: 'home',
    history: [],

    navigate(page, param = null) {
        this.history.push(this.currentPage);
        this.currentPage = page;

        // Hide all pages
        document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));

        // Show target page
        const targetPage = document.getElementById(`page-${page}`);
        if (targetPage) {
            targetPage.classList.add('active');
            window.scrollTo(0, 0);

            // Clear active scenes when switching pages
            animationController.activeScenes.clear();

            // Load dynamic content if needed
            if (page === 'service-detail' && param) {
                loadServiceDetail(param);
            } else if (page === 'case-study' && param) {
                loadCaseStudy(param);
            } else if (page === 'portfolio') {
                loadPortfolio();
            }

            // Re-initialize observers
            setTimeout(() => {
                observeSections();
            }, 100);
        }
    },

    back() {
        if (this.history.length > 0) {
            const prev = this.history.pop();
            this.currentPage = prev;
            document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
            document.getElementById(`page-${prev}`).classList.add('active');
            window.scrollTo(0, 0);

            // Clear active scenes when switching pages
            animationController.activeScenes.clear();

            setTimeout(observeSections, 100);
        }
    }
};

// Service Detail Data (YOUR ORIGINAL DATA - UNCHANGED)
const serviceData = {
    strategy: {
        title: "Digital Strategy",
        subtitle: "Navigate the digital landscape with confidence",
        description: "Our strategic consulting services help organizations identify opportunities, mitigate risks, and create actionable roadmaps for digital transformation. We align your business goals with the latest technological possibilities.",
        problems: [
            "Unclear digital direction and priorities",
            "Legacy systems hindering growth",
            "Competitors outpacing your innovation",
            "Siloed departments and inefficiencies",
            "Difficulty measuring digital ROI"
        ],
        approach: [
            "Discovery & Audit: Comprehensive analysis of your current state",
            "Strategy Formulation: Clear roadmap aligned with business goals",
            "Implementation Planning: Phased execution with measurable milestones",
            "Continuous Optimization: Data-driven refinements and improvements"
        ],
        deliverables: [
            "Digital Maturity Assessment",
            "Competitive Analysis Report",
            "3-Year Digital Roadmap",
            "Technology Stack Recommendations",
            "KPI Framework & Dashboard"
        ]
    },
    social: {
        title: "Social Media Marketing",
        subtitle: "Build community and brand presence",
        description: "Strategic social media management and data-driven campaigns designed to engage your audience where they spend their time. We build authentic connections that turn followers into brand advocates.",
        problems: [
            "Low engagement on social platforms",
            "Inconsistent posting and brand voice",
            "Difficulty reaching target demographics",
            "Lack of clear social ROI",
            "Underutilized community building opportunities"
        ],
        approach: [
            "Audience Research: Identifying where your customers live online",
            "Content Strategy: Creating a unique brand voice and rhythm",
            "Campaign Management: Targeted ads and organic growth",
            "Reporting: Measuring engagement and conversion metrics"
        ],
        deliverables: [
            "Social Media Strategy",
            "Monthly Content Calendar",
            "Paid Social Ad Management",
            "Community Engagement Report",
            "Brand Voice Guidelines"
        ]
    },
    content: {
        title: "Content Creation",
        subtitle: "Tell your story with impact",
        description: "High-engagement content across all formats—from blog posts to infographics—designed to resonate with your target audience and establish your brand as a thought leader in its space.",
        problems: [
            "Generic or boring brand content",
            "Low SEO ranking for content",
            "Difficulty explaining complex concepts",
            "High drop-off rates on long-form content",
            "Lack of consistent content production"
        ],
        approach: [
            "Narrative Design: Defining your brand story",
            "Production: High-quality writing and visual design",
            "SEO Integration: Content optimized for search intent",
            "Distribution: Getting eyes on your best work"
        ],
        deliverables: [
            "Detailed Blog Posts & Articles",
            "Infographics & Visual Guides",
            "E-books & Whitepapers",
            "Email Marketing Content",
            "Video Scripts & Storyboards"
        ]
    },
    web: {
        title: "Web Development",
        subtitle: "High-performance digital experiences",
        description: "We build websites and web applications that load instantly, convert consistently, and scale effortlessly with your business growth.",
        problems: [
            "Slow loading times hurting SEO",
            "Poor mobile experience",
            "Difficulty updating content",
            "Security vulnerabilities",
            "Inability to handle traffic spikes"
        ],
        approach: [
            "Architecture Design: Scalable, secure foundation",
            "Agile Development: Iterative builds with continuous feedback",
            "Performance Optimization: Sub-second load times guaranteed",
            "Launch & Support: 24/7 monitoring and maintenance"
        ],
        deliverables: [
            "Custom Website or Web App",
            "CMS Integration",
            "Performance Optimization",
            "Security Hardening",
            "Documentation & Training"
        ]
    },
    branding: {
        title: "Brand Identity",
        subtitle: "Stand out in a crowded market",
        description: "We create visual identities that capture your essence and communicate your value proposition with clarity and impact.",
        problems: [
            "Inconsistent brand presentation",
            "Outdated visual identity",
            "Poor brand recognition",
            "Misalignment with target audience",
            "Lack of brand guidelines"
        ],
        approach: [
            "Brand Discovery: Understanding your essence and audience",
            "Concept Development: Exploring visual directions",
            "Identity Design: Logo, typography, color systems",
            "Guideline Creation: Comprehensive brand manual"
        ],
        deliverables: [
            "Logo System (Primary, Secondary, Icons)",
            "Color Palette & Typography",
            "Brand Guidelines Book",
            "Marketing Templates",
            "Brand Strategy Document"
        ]
    },
    marketing: {
        title: "Growth Marketing",
        subtitle: "Acquire, engage, and retain customers",
        description: "Data-driven marketing strategies that deliver measurable business growth through optimized acquisition channels and retention programs.",
        problems: [
            "High customer acquisition costs",
            "Low conversion rates",
            "Poor customer retention",
            "Inability to scale campaigns",
            "Lack of attribution clarity"
        ],
        approach: [
            "Channel Analysis: Identifying highest-ROI opportunities",
            "Campaign Setup: Precision targeting and creative testing",
            "Automation: Scaling with smart workflows",
            "Optimization: Continuous A/B testing and refinement"
        ],
        deliverables: [
            "Marketing Strategy & Calendar",
            "Campaign Setup & Management",
            "Marketing Automation",
            "Analytics & Reporting Dashboard",
            "Content Strategy"
        ]
    },
    ai: {
        title: "AI Automation",
        subtitle: "Intelligent automation for competitive advantage",
        description: "Leverage machine learning and artificial intelligence to automate processes, gain insights, and create personalized experiences at scale.",
        problems: [
            "Manual processes consuming resources",
            "Inability to personalize at scale",
            "Data overload without insights",
            "Reactive rather than predictive operations",
            "Falling behind AI-adopting competitors"
        ],
        approach: [
            "Use Case Identification: High-impact AI opportunities",
            "Data Preparation: Cleaning and structuring for ML",
            "Model Development: Custom AI solutions",
            "Integration: Seamless deployment into workflows"
        ],
        deliverables: [
            "AI Strategy Roadmap",
            "Custom ML Models",
            "Automation Workflows",
            "Analytics Dashboard",
            "Team Training & Documentation"
        ]
    },
    analytics: {
        title: "Data Analytics",
        subtitle: "Unlock intelligence from your raw data",
        description: "We transform complex datasets into clear, actionable business intelligence through advanced visualization, statistical analysis, and predictive modeling.",
        problems: [
            "Data silos and inaccessible information",
            "Inability to track key performance indicators",
            "Manual, error-prone reporting processes",
            "Reactive rather than predictive decision making",
            "Underutilized customer and operational data"
        ],
        approach: [
            "Data Audit: Identifying and connecting data sources",
            "ETL Processing: Cleaning and structuring data flows",
            "Analysis & Modeling: Applying statistical and ML models",
            "Visualization: Building intuitive interactive dashboards"
        ],
        deliverables: [
            "Interactive Analytics Dashboards",
            "Predictive Performance Models",
            "Data Governance Framework",
            "Automated Reporting Systems",
            "Strategic Insight Reports"
        ]
    },
    design: {
        title: "UI/UX Design",
        subtitle: "Interfaces that delight and convert",
        description: "User-centered design processes that create intuitive, accessible, and beautiful interfaces backed by thorough research and testing.",
        problems: [
            "High bounce rates",
            "User confusion and frustration",
            "Low conversion rates",
            "Accessibility issues",
            "Inconsistent user experience"
        ],
        approach: [
            "User Research: Interviews, surveys, and analytics",
            "Information Architecture: Logical content structure",
            "Wireframing & Prototyping: Low to high fidelity",
            "Testing & Iteration: Continuous improvement"
        ],
        deliverables: [
            "User Research Report",
            "Wireframes & Prototypes",
            "High-Fidelity UI Designs",
            "Design System",
            "Usability Test Results"
        ]
    },
    motion: {
        title: "Photography & Videography",
        subtitle: "Professional visual storytelling",
        description: "High-quality commercial photography and professional video production that capture your brand's essence and communicate complex ideas with cinematic impact.",
        problems: [
            "Low-quality visual assets hurting brand perception",
            "Difficulty explaining processes through text alone",
            "Lack of high-end commercial imagery",
            "Low social media engagement with static content",
            "Need for professional video for ads or websites"
        ],
        approach: [
            "Storyboarding: Planning the visual narrative",
            "Style Frames: Defining the look and feel",
            "Animation: Bringing the designs to life",
            "Sound Design: Adding the final atmospheric touch"
        ],
        deliverables: [
            "Explainer Videos",
            "Logo Animations",
            "Social Media Motion Content",
            "UI Motion Guidelines",
            "3D Product Visualizations"
        ]
    },
    graphic: {
        title: "Visual Design",
        subtitle: "Stunning visuals for every platform",
        description: "Comprehensive graphic design services that ensure your brand looks premium and professional across all physical and digital touchpoints.",
        problems: [
            "Low-quality marketing materials",
            "Inconsistent visual style",
            "Poor conversion on ad creatives",
            "Brand looking 'unprofessional'",
            "Difficulty standing out visually"
        ],
        approach: [
            "Visual Audit: Checking current brand assets",
            "Creative Direction: Setting the visual tone",
            "Design Production: Creating the actual assets",
            "Quality Control: Ensuring pixel perfection"
        ],
        deliverables: [
            "Social Media Kits",
            "Ad Creatives",
            "Print Materials",
            "Digital Assets",
            "Presentation Designs"
        ]
    },
    seo: {
        title: "SEO & Analytics",
        subtitle: "Data-driven visibility and insights",
        description: "Technical SEO and comprehensive data analytics that help you dominate search results and understand exactly how your users behave.",
        problems: [
            "Low organic traffic",
            "Ranking for the wrong keywords",
            "Technical SEO errors",
            "No clear data on user behavior",
            "High bounce rates from search"
        ],
        approach: [
            "Technical Audit: Fixing underlying site issues",
            "Keyword Research: Finding high-intent opportunities",
            "On-Page Optimization: Tuning content for search",
            "Analytics Setup: Tracking what matters"
        ],
        deliverables: [
            "SEO Audit Report",
            "Keyword Strategy",
            "Monthly Performance Reports",
            "Custom Analytics Dashboard",
            "Link Building Roadmap"
        ]
    }
};

// Case Study Data (YOUR ORIGINAL DATA - UNCHANGED)
const caseStudyData = {
    'pizza-shop': {
        title: "Pizza Shop Website Building Solution",
        client: "Slice Masters",
        category: "Web Development",
        overview: "A modern, high-converting digital storefront and ordering system designed to dramatically increase online sales for a busy pizza shop.",
        problem: "The shop relied entirely on third-party delivery apps that took 30% cuts. Their existing website was non-responsive and lacked online ordering capabilities, leading to lost direct sales.",
        strategy: "We built a custom, mobile-first web application featuring a friction-free ordering process, mouth-watering visual menus, and seamless integration with their point-of-sale system.",
        execution: "4-week rapid development cycle including UX design, custom photography, secure payment gateway integration, and staff training on the new digital order flow.",
        results: [
            { label: "Online Orders", value: "+300%" },
            { label: "Third-party Fees Saved", value: "$45k/yr" },
            { label: "Mobile Conversion", value: "8.5%" },
            { label: "Average Order Value", value: "+22%" }
        ]
    },
    'voice-agent': {
        title: "Voice Calling Agent Project",
        client: "Global Logistics Co.",
        category: "AI Automation",
        overview: "Implementation of an advanced conversational AI voice agent to handle high-volume customer inquiries, dispatch routing, and automated follow-ups.",
        problem: "Customer service agents were overwhelmed with repetitive 'Where is my order?' queries, leading to long hold times (avg 15 mins) and plummeting customer satisfaction scores.",
        strategy: "Deploy a natural language processing voice agent capable of understanding multiple accents, querying the logistics database in real-time, and seamlessly escalating complex issues to human agents.",
        execution: "3-month implementation including dialogue mapping, API integrations with tracking systems, voice synthesis tuning, and rigorous edge-case testing.",
        results: [
            { label: "Availability", value: "24/7" },
            { label: "Calls Handled", value: "10k+/day" },
            { label: "Hold Time", value: "< 5 secs" },
            { label: "Deflection Rate", value: "75%" }
        ]
    },
    'furniture-analysis': {
        title: "Stock and Sales Analysis for Furniture",
        client: "Urban Home Design",
        category: "Data Analytics",
        overview: "A comprehensive data warehousing and visualization project designed to give a national furniture retailer real-time visibility into their inventory and sales performance.",
        problem: "Data was locked in siloed legacy systems. It took the operations team two weeks to generate sales reports, leading to frequent stockouts of popular items and overstock of slow movers.",
        strategy: "Build an automated ETL pipeline feeding into a centralized data warehouse, layered with interactive PowerBI dashboards for regional managers and executive leadership.",
        execution: "8-week data engineering sprint to connect POS, ERP, and e-commerce platforms, followed by 4 weeks of dashboard design and user adoption workshops.",
        results: [
            { label: "Reporting Speed", value: "Real-time" },
            { label: "Inventory Costs", value: "-18%" },
            { label: "Stockouts", value: "Down 85%" },
            { label: "Sales Margin", value: "+4.2%" }
        ]
    },
    'perfume-social': {
        title: "Perfume Brand Social Campaign",
        client: "Aura Fragrances",
        category: "Social Media",
        overview: "A comprehensive social media overhaul and influencer marketing campaign designed to launch a new line of premium fragrances to a younger demographic.",
        problem: "The brand had a legacy image and was struggling to connect with Gen Z and millennial consumers on platforms like TikTok and Instagram. Engagement rates were below 0.5%.",
        strategy: "We developed a visually striking, aesthetic-first content strategy paired with micro-influencer partnerships to create authentic, user-generated-style content.",
        execution: "3-month campaign involving 50+ creators, custom AR unboxing filters, and daily short-form video content highlighting the sensory experience of the scents.",
        results: [
            { label: "Engagement Rate", value: "6.8%" },
            { label: "Follower Growth", value: "+150k" },
            { label: "Direct Sales", value: "$400k+" },
            { label: "Impressions", value: "12M+" }
        ]
    },
    'machine-analytics': {
        title: "Industrial Machine IoT Analytics",
        client: "Apex Manufacturing",
        category: "Data Analytics",
        overview: "Implementation of an IoT data pipeline and predictive maintenance dashboard for a large-scale manufacturing plant.",
        problem: "Unexpected machine breakdowns were causing millions of dollars in lost production time. Maintenance was purely reactive or based on outdated manual schedules.",
        strategy: "We connected existing machine sensors to a cloud data lake and built machine learning models to detect anomalies and predict component failures before they occurred.",
        execution: "6-month project involving edge computing setup, cloud infrastructure deployment, and custom dashboard development for the floor supervisors.",
        results: [
            { label: "Downtime Reduced", value: "65%" },
            { label: "Maintenance Costs", value: "-30%" },
            { label: "Production Output", value: "+12%" },
            { label: "ROI Timeframe", value: "4 Months" }
        ]
    },
    'mining-analytics': {
        title: "Global Supply Chain Mining Analytics",
        client: "Terra Resources",
        category: "Data Analytics",
        overview: "A complex data visualization platform merging geological data, supply chain logistics, and market pricing to optimize mineral extraction and shipping.",
        problem: "Data was fragmented across dozens of separate systems worldwide, making it impossible for executives to make timely decisions on production volume vs market demand.",
        strategy: "Created an enterprise-wide single source of truth, utilizing advanced geospatial analytics and predictive pricing models.",
        execution: "12-month enterprise deployment, integrating with Oracle ERP, custom geological software, and global shipping APIs.",
        results: [
            { label: "Logistics Optimization", value: "$12M Saved" },
            { label: "Decision Speed", value: "10x Faster" },
            { label: "Yield Accuracy", value: "99.2%" },
            { label: "Market Adaptability", value: "+20%" }
        ]
    },
    'shoes-web': {
        title: "Custom Footwear Web Platform",
        client: "Sole Craft",
        category: "Web Development",
        overview: "A highly interactive e-commerce platform featuring a custom 3D shoe configurator, allowing users to design and order bespoke sneakers.",
        problem: "The client was relying on offline custom orders, which severely limited scalability. They needed a web platform that replicated the premium, personalized in-store design experience.",
        strategy: "We architected a high-performance web application using Three.js for 3D rendering in the browser, coupled with a robust backend for managing complex manufacturing orders.",
        execution: "5-month build including 3D model optimization, secure payment processing, and an automated order-routing system to the manufacturing floor.",
        results: [
            { label: "Conversion Rate", value: "5.2%" },
            { label: "Time on Site", value: "+400%" },
            { label: "Global Sales", value: "Expanded 12x" },
            { label: "Custom Orders", value: "1000+/mo" }
        ]
    },
    'clinic-web': {
        title: "Modern Dental Clinic Web Presence",
        client: "Smile Design Group",
        category: "Web Development",
        overview: "A complete rebuild of a high-end dental clinic network's website, focusing on patient acquisition, SEO dominance, and seamless appointment booking.",
        problem: "Their old website was slow, not mobile-friendly, and was losing local search rankings to competitors. Their online booking system was broken, forcing patients to call.",
        strategy: "Constructed a lightning-fast, mobile-first website with targeted local SEO pages for each clinic location and integrated a friction-free patient portal.",
        execution: "10-week project including new professional photography, copywriting, HIPAA-compliant form integration, and speed optimization.",
        results: [
            { label: "Page Speed Score", value: "98/100" },
            { label: "New Patient Leads", value: "+150%" },
            { label: "Organic Traffic", value: "+210%" },
            { label: "Booking Completion", value: "85%" }
        ]
    },
    'ai-meeting': {
        title: "Automated AI Meeting Assistant",
        client: "Venture Capital Partners",
        category: "AI Automation",
        overview: "Development and integration of a custom AI meeting assistant designed to transcribe, summarize, and extract actionable items from high-stakes investment meetings.",
        problem: "Partners were spending hours every week writing meeting notes and following up on complex deal terms, leading to delayed communications and lost opportunities.",
        strategy: "Built a secure, private LLM-powered tool that hooks directly into their video conferencing software to process conversations in real-time.",
        execution: "4-month training phase to help the AI understand complex financial jargon and specific VC deal frameworks before firm-wide deployment.",
        results: [
            { label: "Time Saved", value: "15 hrs/wk" },
            { label: "Action Item Catch Rate", value: "99%" },
            { label: "Meeting Efficiency", value: "+40%" },
            { label: "ROI", value: "250%" }
        ]
    },
    'ai-pos': {
        title: "Intelligent AI POS Integration",
        client: "Retail Dynamics",
        category: "AI Automation",
        overview: "Integration of an AI-powered analytics engine directly into the client's point-of-sale systems across 150+ physical store locations.",
        problem: "Store managers had no real-time insights into foot traffic conversion or dynamic stock needs, leading to overstaffing during slow hours and lost sales during unexpected rushes.",
        strategy: "We built a custom machine-learning model that analyzes live POS transactions locally and cross-references them with external data like weather and local events.",
        execution: "Phased 6-month rollout starting with 5 pilot stores. Integrated seamlessly with existing legacy register hardware via custom edge computing nodes.",
        results: [
            { label: "Labor Costs", value: "-15%" },
            { label: "Upsell Success", value: "+28%" },
            { label: "System Uptime", value: "99.9%" },
            { label: "Revenue per SqFt", value: "+12%" }
        ]
    }
};

// Portfolio Data (YOUR ORIGINAL DATA - UNCHANGED)
const portfolioItems = [
    { id: 'pizza-shop', title: "Pizza Shop Solution", category: "web", result: "+300% Orders", image: "pizza.png" },
    { id: 'voice-agent', title: "Voice Calling Agent", category: "ai", result: "24/7 Availability", image: "voice.png" },
    { id: 'furniture-analysis', title: "Furniture Analysis", category: "analytics", result: "Real-time Data", image: "furniture.png" },
    { id: 'perfume-social', title: "Perfume Brand Campaign", category: "social", result: "12M+ Impressions", image: "perfume.png" },
    { id: 'machine-analytics', title: "Industrial IoT Analytics", category: "analytics", result: "65% Less Downtime", image: "machine.png" },
    { id: 'mining-analytics', title: "Global Supply Chain", category: "analytics", result: "$12M Saved", image: "minning.png" },
    { id: 'shoes-web', title: "Custom Footwear Platform", category: "web", result: "5.2% Conversion", image: "shoes.png" },
    { id: 'clinic-web', title: "Dental Clinic Network", category: "web", result: "+150% New Patients", image: "clinic.png" },
    { id: 'ai-meeting', title: "AI Meeting Assistant", category: "ai", result: "15 hrs/wk Saved", image: "meeting.png" },
    { id: 'ai-pos', title: "Intelligent AI POS", category: "ai", result: "Labor Costs -15%", image: "pos.png" }
];

function loadServiceDetail(serviceId) {
    const service = serviceData[serviceId];
    if (!service) return;

    const content = document.getElementById('service-content');
    content.innerHTML = `
        <div class="mb-12">
            <div class="text-[#00b894] text-sm tracking-widest uppercase mb-4">Service Detail</div>
            <h1 class="text-5xl md:text-6xl font-bold mb-4">${service.title}</h1>
            <p class="text-2xl text-gray-400">${service.subtitle}</p>
        </div>

        <div class="glass-card p-8 rounded-xl mb-12">
            <p class="text-lg text-gray-300 leading-relaxed">${service.description}</p>
        </div>

        <div class="grid md:grid-cols-2 gap-12 mb-12">
            <div>
                <h3 class="text-2xl font-bold mb-6 text-[#9b59b6]">Problems We Solve</h3>
                <ul class="space-y-4">
                    ${service.problems.map(p => `
                        <li class="flex items-start gap-3">
                            <span class="text-red-400 mt-1">✕</span>
                            <span class="text-gray-300">${p}</span>
                        </li>
                    `).join('')}
                </ul>
            </div>
            <div>
                <h3 class="text-2xl font-bold mb-6 text-[#00b894]">Our Approach</h3>
                <div class="space-y-6">
                    ${service.approach.map((step, i) => `
                        <div class="flex gap-4">
                            <div class="w-8 h-8 rounded-full bg-[#00b894]/10 border border-[#00b894]/30 flex items-center justify-center flex-shrink-0 text-[#00b894] font-bold text-sm">
                                ${i + 1}
                            </div>
                            <p class="text-gray-300">${step}</p>
                        </div>
                    `).join('')}
                </div>
            </div>
        </div>

        <div class="glass-card p-8 rounded-xl mb-12">
            <h3 class="text-2xl font-bold mb-6">What You Get</h3>
            <div class="grid md:grid-cols-2 gap-4">
                ${service.deliverables.map(d => `
                    <div class="flex items-center gap-3 p-4 bg-white/5 rounded-lg">
                        <span class="text-[#00b894]">✓</span>
                        <span class="text-gray-300">${d}</span>
                    </div>
                `).join('')}
            </div>
        </div>

        <div class="text-center">
            <button class="btn-primary text-lg px-12 py-4" onclick="scrollToContact()">Start Your Project</button>
        </div>
    `;
}

function loadCaseStudy(caseId) {
    const study = caseStudyData[caseId];
    if (!study) return;

    const content = document.getElementById('case-study-content');
    content.innerHTML = `
        <div class="mb-12">
            <div class="text-[#00b894] text-sm tracking-widest uppercase mb-4">${study.category}</div>
            <h1 class="text-5xl md:text-6xl font-bold mb-4">${study.title}</h1>
            <p class="text-xl text-gray-400">Client: ${study.client}</p>
        </div>

        <div class="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12">
            ${study.results.map(r => `
                <div class="glass-card p-6 rounded-xl text-center">
                    <div class="text-3xl font-bold text-[#00b894] mb-2">${r.value}</div>
                    <div class="text-sm text-gray-400">${r.label}</div>
                </div>
            `).join('')}
        </div>

        <div class="space-y-12">
            <div class="glass-card p-8 rounded-xl">
                <h3 class="text-2xl font-bold mb-4 text-[#9b59b6]">Project Overview</h3>
                <p class="text-gray-300 leading-relaxed">${study.overview}</p>
            </div>

            <div class="glass-card p-8 rounded-xl">
                <h3 class="text-2xl font-bold mb-4 text-red-400">The Challenge</h3>
                <p class="text-gray-300 leading-relaxed">${study.problem}</p>
            </div>

            <div class="glass-card p-8 rounded-xl">
                <h3 class="text-2xl font-bold mb-4 text-[#00b894]">Our Strategy</h3>
                <p class="text-gray-300 leading-relaxed">${study.strategy}</p>
            </div>

            <div class="glass-card p-8 rounded-xl">
                <h3 class="text-2xl font-bold mb-4 text-blue-400">Execution</h3>
                <p class="text-gray-300 leading-relaxed">${study.execution}</p>
            </div>
        </div>

        <div class="mt-12 text-center">
            <button class="btn-primary text-lg px-12 py-4" onclick="scrollToContact()">Discuss Your Project</button>
        </div>
    `;
}

function loadPortfolio() {
    const grid = document.getElementById('portfolio-grid');
    grid.innerHTML = portfolioItems.map((item, i) => {
        let btnText = '';
        if (item.category === 'social') btnText = 'Visit Page <i class="fas fa-arrow-right ml-1"></i>';
        else if (item.category === 'web') btnText = 'Visit Site <i class="fas fa-arrow-right ml-1"></i>';
        else if (item.category === 'ai' && item.id !== 'voice-agent') btnText = 'Visit App <i class="fas fa-arrow-right ml-1"></i>';

        return `
        <div class="portfolio-card group cursor-pointer section-hidden" style="transition-delay: ${i * 0.1}s" onclick="router.navigate('case-study', '${item.id}')" data-category="${item.category}">
            <div class="aspect-[4/3] bg-gray-800 relative overflow-hidden rounded-lg">
                ${item.image ?
                `<img src="${item.image}" alt="${item.title}" class="absolute inset-0 w-full h-full object-cover opacity-80 group-hover:opacity-100 grayscale group-hover:grayscale-0 transition-all duration-500">
                <div class="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent"></div>
                <div class="absolute inset-0 bg-gradient-to-br from-[#00b894]/20 to-[#9b59b6]/20 mix-blend-overlay opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>` :
                `<div class="absolute inset-0 bg-gradient-to-br from-[#00b894]/10 to-[#9b59b6]/10"></div>
                <div class="absolute inset-0 flex items-center justify-center">
                    <div class="text-4xl font-bold text-white/10">${item.title.charAt(0)}</div>
                </div>`}
                <div class="portfolio-overlay absolute inset-0 flex flex-col justify-end p-6">
                    <div class="transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                        <div class="text-[#00b894] text-xs font-medium mb-1 uppercase">${item.category}</div>
                        <h3 class="text-xl font-bold mb-1">${item.title}</h3>
                        <div class="text-[#00b894] font-bold mb-3">${item.result}</div>
                        ${btnText ? `<div class="inline-block px-4 py-2 border border-white/20 rounded-full text-xs text-white bg-black/40 backdrop-blur-sm group-hover:bg-[#00b894] group-hover:border-[#00b894] transition-all duration-300 mt-2">${btnText}</div>` : ''}
                    </div>
                </div>
            </div>
        </div>
    `}).join('');

    setTimeout(observeSections, 100);
}

// Filter functionality
document.addEventListener('click', (e) => {
    if (e.target.classList.contains('filter-btn')) {
        document.querySelectorAll('.filter-btn').forEach(btn => {
            btn.classList.remove('active', 'bg-[#00b894]/10', 'text-[#00b894]', 'border-[#00b894]');
            btn.classList.add('border-white/10');
        });
        e.target.classList.add('active', 'bg-[#00b894]/10', 'text-[#00b894]', 'border-[#00b894]');
        e.target.classList.remove('border-white/10');

        const filter = e.target.dataset.filter;
        document.querySelectorAll('#portfolio-grid > div').forEach(card => {
            if (filter === 'all' || card.dataset.category === filter) {
                card.style.display = 'block';
            } else {
                card.style.display = 'none';
            }
        });
    }
});

// Hero Section: Neural Network Particles (YOUR ORIGINAL CODE - ONLY ANIMATE FUNCTION MODIFIED)
function initHeroParticles() {
    const container = document.getElementById('hero-canvas-container');
    if (!container) return;

    let scene, camera, renderer, particles, lines;
    const particleCount = 250;
    const maxDistance = 150;
    const particlesData = [];

    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 1, 1000);
    camera.position.z = 450;

    renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);
    container.appendChild(renderer.domElement);

    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount; i++) {
        const x = Math.random() * 900 - 450;
        const y = Math.random() * 900 - 450;
        const z = Math.random() * 800 - 400;

        positions[i * 3] = x;
        positions[i * 3 + 1] = y;
        positions[i * 3 + 2] = z;

        particlesData.push({
            velocity: new THREE.Vector3(-0.8 + Math.random() * 1.6, -0.8 + Math.random() * 1.6, -0.8 + Math.random() * 1.6),
            numConnections: 0
        });
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3).setUsage(THREE.DynamicDrawUsage));

    const sprite = new THREE.Texture(generateRoundTexture());
    sprite.needsUpdate = true;

    const pMaterial = new THREE.PointsMaterial({
        color: 0xffffff,
        size: 8,
        map: sprite,
        blending: THREE.AdditiveBlending,
        transparent: true,
        opacity: 0.8,
        sizeAttenuation: true,
        depthWrite: false
    });

    particles = new THREE.Points(geometry, pMaterial);
    scene.add(particles);

    const lineGeometry = new THREE.BufferGeometry();
    const lineMaterial = new THREE.LineBasicMaterial({
        color: 0x0ff4d0,
        transparent: true,
        opacity: 0.35,
        blending: THREE.AdditiveBlending
    });

    lines = new THREE.LineSegments(lineGeometry, lineMaterial);
    scene.add(lines);

    function generateRoundTexture() {
        const canvas = document.createElement('canvas');
        canvas.width = 16;
        canvas.height = 16;
        const context = canvas.getContext('2d');
        const gradient = context.createRadialGradient(8, 8, 0, 8, 8, 8);
        gradient.addColorStop(0, 'rgba(255,255,255,1)');
        gradient.addColorStop(0.3, 'rgba(255,255,255,1)');
        gradient.addColorStop(0.5, 'rgba(255,255,255,0.4)');
        gradient.addColorStop(1, 'rgba(255,255,255,0)');
        context.fillStyle = gradient;
        context.fillRect(0, 0, 16, 16);
        return canvas;
    }

    // MODIFIED ANIMATE FUNCTION - Only runs when visible
    function animate() {
        requestAnimationFrame(animate);

        // ONLY RENDER IF THIS SECTION IS VISIBLE
        if (animationController.shouldRender('hero-canvas-container')) {
            const positions = particles.geometry.attributes.position.array;
            const linePositions = new Float32Array(particleCount * 60);
            let lineCount = 0;

            for (let i = 0; i < particleCount; i++) {
                const particleData = particlesData[i];

                positions[i * 3] += particleData.velocity.x * 0.6;
                positions[i * 3 + 1] += particleData.velocity.y * 0.6;
                positions[i * 3 + 2] += particleData.velocity.z * 0.6;

                if (positions[i * 3 + 1] < -450 || positions[i * 3 + 1] > 450) particleData.velocity.y *= -1;
                if (positions[i * 3] < -450 || positions[i * 3] > 450) particleData.velocity.x *= -1;
                if (positions[i * 3 + 2] < -400 || positions[i * 3 + 2] > 400) particleData.velocity.z *= -1;

                for (let j = i + 1; j < particleCount; j++) {
                    const dx = positions[i * 3] - positions[j * 3];
                    const dy = positions[i * 3 + 1] - positions[j * 3 + 1];
                    const dz = positions[i * 3 + 2] - positions[j * 3 + 2];
                    const dist = Math.sqrt(dx * dx + dy * dy + dz * dz);

                    if (dist < maxDistance) {
                        linePositions[lineCount++] = positions[i * 3];
                        linePositions[lineCount++] = positions[i * 3 + 1];
                        linePositions[lineCount++] = positions[i * 3 + 2];

                        linePositions[lineCount++] = positions[j * 3];
                        linePositions[lineCount++] = positions[j * 3 + 1];
                        linePositions[lineCount++] = positions[j * 3 + 2];
                    }
                }
            }

            lines.geometry.setAttribute('position', new THREE.BufferAttribute(linePositions.slice(0, lineCount), 3));
            particles.geometry.attributes.position.needsUpdate = true;

            particles.rotation.y += 0.0012;
            lines.rotation.y += 0.0012;

            renderer.render(scene, camera);
        }
    }

    animate();

    // Register this scene with the controller
    animationController.registerScene('hero-canvas-container', animate);

    window.addEventListener('resize', () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    });
}

// About: Floating Geometric Shapes (YOUR ORIGINAL CODE - ONLY ANIMATE FUNCTION MODIFIED)
function initAboutShapes() {
    const container = document.getElementById('about-canvas-container');
    if (!container) return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, container.clientWidth / container.clientHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });

    renderer.setSize(container.clientWidth, container.clientHeight);
    container.appendChild(renderer.domElement);

    const shapes = [];
    const geometries = [
        new THREE.IcosahedronGeometry(0.5, 0),
        new THREE.OctahedronGeometry(0.5, 0),
        new THREE.TetrahedronGeometry(0.6, 0),
        new THREE.TorusGeometry(0.4, 0.15, 16, 100)
    ];

    const aquaMaterial = new THREE.MeshBasicMaterial({
        color: 0x00b894,
        wireframe: true,
        transparent: true,
        opacity: 0.3
    });

    const purpleMaterial = new THREE.MeshBasicMaterial({
        color: 0x9b59b6,
        wireframe: true,
        transparent: true,
        opacity: 0.2
    });

    // Create floating shapes
    for (let i = 0; i < 15; i++) {
        const geometry = geometries[Math.floor(Math.random() * geometries.length)];
        const material = Math.random() > 0.6 ? purpleMaterial : aquaMaterial;
        const shape = new THREE.Mesh(geometry, material);

        shape.position.set(
            (Math.random() - 0.5) * 15,
            (Math.random() - 0.5) * 15,
            (Math.random() - 0.5) * 5 - 5
        );

        shape.userData = {
            rotationSpeed: {
                x: (Math.random() - 0.5) * 0.02,
                y: (Math.random() - 0.5) * 0.02,
                z: (Math.random() - 0.5) * 0.01
            },
            floatSpeed: Math.random() * 0.005 + 0.002,
            floatOffset: Math.random() * Math.PI * 2
        };

        scene.add(shape);
        shapes.push(shape);
    }

    camera.position.z = 10;

    let time = 0;

    // MODIFIED ANIMATE FUNCTION - Only runs when visible
    function animate() {
        requestAnimationFrame(animate);

        // ONLY RENDER IF THIS SECTION IS VISIBLE
        if (animationController.shouldRender('about-canvas-container')) {
            time += 0.01;

            shapes.forEach((shape, i) => {
                shape.rotation.x += shape.userData.rotationSpeed.x;
                shape.rotation.y += shape.userData.rotationSpeed.y;
                shape.rotation.z += shape.userData.rotationSpeed.z;

                shape.position.y += Math.sin(time + shape.userData.floatOffset) * 0.01;

                const scale = 1 + Math.sin(time * 2 + i) * 0.1;
                shape.scale.setScalar(scale);
            });

            renderer.render(scene, camera);
        }
    }

    animate();

    // Register this scene with the controller
    animationController.registerScene('about-canvas-container', animate);

    window.addEventListener('resize', () => {
        camera.aspect = container.clientWidth / container.clientHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(container.clientWidth, container.clientHeight);
    });
}

// WHY CHOOSE US: DNA Helix (YOUR ORIGINAL CODE - ONLY ANIMATE FUNCTION MODIFIED)
function initDNAHelix() {
    const container = document.getElementById('why-canvas-container');
    if (!container) return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, container.clientWidth / container.clientHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });

    renderer.setSize(container.clientWidth, container.clientHeight);
    container.appendChild(renderer.domElement);

    const particles = [];
    const particleCount = 100;
    const helixRadius = 3;
    const helixHeight = 20;
    const turns = 3;

    const aquaMaterial = new THREE.MeshBasicMaterial({ color: 0x00b894 });
    const purpleMaterial = new THREE.MeshBasicMaterial({ color: 0x9b59b6 });
    const geometry = new THREE.SphereGeometry(0.08, 8, 8);

    // Create double helix
    for (let i = 0; i < particleCount; i++) {
        const t = (i / particleCount) * Math.PI * 2 * turns;
        const y = (i / particleCount) * helixHeight - helixHeight / 2;

        // First strand
        const particle1 = new THREE.Mesh(geometry, aquaMaterial);
        particle1.position.set(
            Math.cos(t) * helixRadius,
            y,
            Math.sin(t) * helixRadius
        );
        scene.add(particle1);
        particles.push({ mesh: particle1, t: t, strand: 0, baseY: y });

        // Second strand (offset by PI)
        const particle2 = new THREE.Mesh(geometry, purpleMaterial);
        particle2.position.set(
            Math.cos(t + Math.PI) * helixRadius,
            y,
            Math.sin(t + Math.PI) * helixRadius
        );
        scene.add(particle2);
        particles.push({ mesh: particle2, t: t + Math.PI, strand: 1, baseY: y });

        // Connection lines between strands
        if (i % 3 === 0) {
            const lineGeometry = new THREE.BufferGeometry().setFromPoints([
                particle1.position,
                particle2.position
            ]);
            const lineMaterial = new THREE.LineBasicMaterial({
                color: 0xffffff,
                transparent: true,
                opacity: 0.1
            });
            const line = new THREE.Line(lineGeometry, lineMaterial);
            scene.add(line);
            particles.push({ line: line, t: t, baseY: y });
        }
    }

    camera.position.z = 15;
    camera.position.y = 0;

    let time = 0;

    // MODIFIED ANIMATE FUNCTION - Only runs when visible
    function animate() {
        requestAnimationFrame(animate);

        // ONLY RENDER IF THIS SECTION IS VISIBLE
        if (animationController.shouldRender('why-canvas-container')) {
            time += 0.005;

            particles.forEach(p => {
                if (p.mesh) {
                    const newT = p.t + time;
                    p.mesh.position.x = Math.cos(newT) * helixRadius;
                    p.mesh.position.z = Math.sin(newT) * helixRadius;

                    p.mesh.position.y = p.baseY + Math.sin(time * 2 + p.t) * 0.5;
                }
                if (p.line) {
                    const positions = p.line.geometry.attributes.position.array;
                    const newT = p.t + time;

                    positions[0] = Math.cos(newT) * helixRadius;
                    positions[1] = p.baseY + Math.sin(time * 2 + p.t) * 0.5;
                    positions[2] = Math.sin(newT) * helixRadius;

                    positions[3] = Math.cos(newT + Math.PI) * helixRadius;
                    positions[4] = p.baseY + Math.sin(time * 2 + p.t) * 0.5;
                    positions[5] = Math.sin(newT + Math.PI) * helixRadius;

                    p.line.geometry.attributes.position.needsUpdate = true;
                }
            });

            scene.rotation.y = Math.sin(time * 0.5) * 0.2;

            renderer.render(scene, camera);
        }
    }

    animate();

    // Register this scene with the controller
    animationController.registerScene('why-canvas-container', animate);

    window.addEventListener('resize', () => {
        camera.aspect = container.clientWidth / container.clientHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(container.clientWidth, container.clientHeight);
    });
}

// SERVICES: Flowing Data Stream (YOUR ORIGINAL CODE - ONLY ANIMATE FUNCTION MODIFIED)
function initServicesStream() {
    const container = document.getElementById('services-canvas-container');
    if (!container) return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, container.clientWidth / container.clientHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });

    renderer.setSize(container.clientWidth, container.clientHeight);
    container.appendChild(renderer.domElement);

    const streams = [];
    const streamCount = 8;

    const aquaMaterial = new THREE.MeshBasicMaterial({
        color: 0x00b894,
        transparent: true,
        opacity: 0.6
    });

    const purpleMaterial = new THREE.MeshBasicMaterial({
        color: 0x9b59b6,
        transparent: true,
        opacity: 0.4
    });

    // Create flowing particles
    for (let i = 0; i < streamCount; i++) {
        const particleCount = 30;
        const particles = [];

        for (let j = 0; j < particleCount; j++) {
            const geometry = new THREE.SphereGeometry(0.05 + Math.random() * 0.05, 8, 8);
            const material = Math.random() > 0.5 ? aquaMaterial : purpleMaterial;
            const particle = new THREE.Mesh(geometry, material);

            const x = (i - streamCount / 2) * 2 + (Math.random() - 0.5);
            const y = (j / particleCount) * 20 - 10;

            particle.position.set(x, y, (Math.random() - 0.5) * 5);
            particle.userData = {
                speed: 0.02 + Math.random() * 0.03,
                wobble: Math.random() * Math.PI * 2,
                wobbleSpeed: 0.02 + Math.random() * 0.02
            };

            scene.add(particle);
            particles.push(particle);
        }

        streams.push(particles);
    }

    camera.position.z = 12;

    let time = 0;

    // MODIFIED ANIMATE FUNCTION - Only runs when visible
    function animate() {
        requestAnimationFrame(animate);

        // ONLY RENDER IF THIS SECTION IS VISIBLE
        if (animationController.shouldRender('services-canvas-container')) {
            time += 0.01;

            streams.forEach((stream, streamIdx) => {
                stream.forEach((particle, i) => {
                    particle.position.y += particle.userData.speed;

                    if (particle.position.y > 10) {
                        particle.position.y = -10;
                    }

                    particle.position.x += Math.sin(time * particle.userData.wobbleSpeed + particle.userData.wobble) * 0.01;

                    const scale = 1 + Math.sin(time * 3 + i * 0.2) * 0.3;
                    particle.scale.setScalar(scale);
                });
            });

            renderer.render(scene, camera);
        }
    }

    animate();

    // Register this scene with the controller
    animationController.registerScene('services-canvas-container', animate);

    window.addEventListener('resize', () => {
        camera.aspect = container.clientWidth / container.clientHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(container.clientWidth, container.clientHeight);
    });
}

// PORTFOLIO: Crystalline Shards
function initPortfolioCrystals() {
    const container = document.getElementById('portfolio-canvas-container');
    if (!container) return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, container.clientWidth / container.clientHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });

    renderer.setSize(container.clientWidth, container.clientHeight);
    container.appendChild(renderer.domElement);

    const crystals = [];
    const count = 25;

    // Use a sharp, long geometry for crystals
    const geometry = new THREE.CylinderGeometry(0, 0.4, 2.5, 4);

    for (let i = 0; i < count; i++) {
        const color = Math.random() > 0.6 ? 0x9b59b6 : 0x00b894;
        const material = new THREE.MeshBasicMaterial({
            color: color,
            wireframe: true,
            transparent: true,
            opacity: 0.25
        });

        const crystal = new THREE.Mesh(geometry, material);

        // Add a soft core
        const coreGeo = new THREE.CylinderGeometry(0, 0.2, 1.5, 4);
        const coreMat = new THREE.MeshBasicMaterial({
            color: color,
            transparent: true,
            opacity: 0.1
        });
        const core = new THREE.Mesh(coreGeo, coreMat);
        crystal.add(core);

        // Random position in a 3D volume
        crystal.position.set(
            (Math.random() - 0.5) * 35,
            (Math.random() - 0.5) * 20,
            (Math.random() - 0.5) * 15
        );

        // Random initial orientation
        crystal.rotation.set(
            Math.random() * Math.PI,
            Math.random() * Math.PI,
            Math.random() * Math.PI
        );

        crystal.userData = {
            rotSpeed: new THREE.Vector3(
                (Math.random() - 0.5) * 0.012,
                (Math.random() - 0.5) * 0.012,
                (Math.random() - 0.5) * 0.008
            ),
            floatSpeed: 0.004 + Math.random() * 0.006,
            floatOffset: Math.random() * Math.PI * 2
        };

        scene.add(crystal);
        crystals.push(crystal);
    }

    camera.position.z = 18;

    let time = 0;
    function animate() {
        requestAnimationFrame(animate);

        if (animationController.shouldRender('portfolio-canvas-container')) {
            time += 0.01;

            crystals.forEach((c, idx) => {
                // Smooth rotation
                c.rotation.x += c.userData.rotSpeed.x;
                c.rotation.y += c.userData.rotSpeed.y;
                c.rotation.z += c.userData.rotSpeed.z;

                // Gentle floating motion
                c.position.y += Math.sin(time * 0.5 + c.userData.floatOffset) * 0.015;
                c.position.x += Math.cos(time * 0.3 + c.userData.floatOffset) * 0.005;

                // Pulsing scale and opacity
                const pulse = 1 + Math.sin(time * 2 + idx) * 0.15;
                c.scale.set(pulse, pulse, pulse);
                c.material.opacity = 0.2 + Math.sin(time + idx) * 0.1;
            });

            // Subtle scene rotation for depth
            scene.rotation.y = Math.sin(time * 0.2) * 0.1;

            renderer.render(scene, camera);
        }
    }

    animate();

    // Register this scene with the controller
    animationController.registerScene('portfolio-canvas-container', animate);

    window.addEventListener('resize', () => {
        camera.aspect = container.clientWidth / container.clientHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(container.clientWidth, container.clientHeight);
    });
}

// Intersection Observer for section animations (YOUR ORIGINAL CODE - UNCHANGED)
function observeSections() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('section-visible');
                entry.target.classList.remove('section-hidden');

                if (entry.target.querySelector('.stat-number')) {
                    animateStats(entry.target);
                }
            }
        });
    }, { threshold: 0.1 });

    document.querySelectorAll('.section-hidden').forEach(section => {
        observer.observe(section);
    });
}

function animateStats(container) {
    container.querySelectorAll('.stat-number').forEach(stat => {
        const target = parseInt(stat.dataset.target);
        const duration = 2000;
        const step = target / (duration / 16);
        let current = 0;

        const timer = setInterval(() => {
            current += step;
            if (current >= target) {
                stat.textContent = target + (stat.dataset.suffix || '');
                clearInterval(timer);
            } else {
                stat.textContent = Math.floor(current);
            }
        }, 16);
    });
}

// Mobile menu toggle (YOUR ORIGINAL CODE - UNCHANGED)
function toggleMobileMenu() {
    const menu = document.getElementById('mobile-menu');
    menu.classList.toggle('hidden');
    menu.classList.toggle('flex');
}

function scrollToContact() {
    window.open('https://wa.me/923338010986', '_blank');
}

function openCalendar() {
    window.open('https://wa.me/923338010986', '_blank');
}

function initRoadAnimation() {
    const roadPath = document.getElementById('road-path');
    const roadTraveler = document.getElementById('road-traveler');
    const section = document.getElementById('process-section');
    if (!roadPath || !roadTraveler || !section) return;

    const pathLength = roadPath.getTotalLength();
    roadPath.style.strokeDasharray = pathLength;
    roadPath.style.strokeDashoffset = pathLength;

    let targetProgress = 0;
    let currentProgress = 0;
    const lerpFactor = 0.1; // Smoothness factor (0 to 1)

    // Scroll listener updates the target
    window.addEventListener('scroll', () => {
        const rect = section.getBoundingClientRect();
        const viewHeight = window.innerHeight;
        const startTrigger = viewHeight * 0.5;

        let progress = (startTrigger - rect.top) / (rect.height);
        targetProgress = Math.min(Math.max(progress, 0), 1);
    });

    // Animation loop handles the smoothing (Lerp)
    function animate() {
        // Smoothly approach the target
        currentProgress += (targetProgress - currentProgress) * lerpFactor;

        // Apply progress to visuals
        roadPath.style.strokeDashoffset = pathLength * (1 - currentProgress);

        const point = roadPath.getPointAtLength(currentProgress * pathLength);
        roadTraveler.style.left = `${point.x}%`;
        roadTraveler.style.top = `${point.y}%`;
        roadTraveler.style.transform = `translate(-50%, -50%)`;

        // Sync content reveals with smoothed progress
        const thresholds = [0.1, 0.35, 0.6, 0.85];
        const steps = document.querySelectorAll('.process-step');
        steps.forEach((step, idx) => {
            if (currentProgress >= thresholds[idx]) {
                step.classList.add('active');
            } else {
                step.classList.remove('active');
            }
        });

        requestAnimationFrame(animate);
    }

    animate();
}

// Initialize everything
document.addEventListener('DOMContentLoaded', () => {
    initHeroParticles();
    initAboutShapes();
    initDNAHelix();
    initServicesStream();
    initPortfolioCrystals();
    initRoadAnimation();
    initTestimonials();
    observeSections();
});

function initTestimonials() {
    const cards = document.querySelectorAll('.testimonial-card');

    cards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            const centerX = rect.width / 2;
            const centerY = rect.height / 2;

            const rotateX = (centerY - y) / 15;
            const rotateY = (x - centerX) / 15;

            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-10px) scale(1.02)`;

            // Move glow effect if we add one later
            const glow = card.querySelector('.glow-effect');
            if (glow) {
                glow.style.left = `${x}px`;
                glow.style.top = `${y}px`;
            }
        });

        card.addEventListener('mouseleave', () => {
            card.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0) scale(1)`;
        });
    });
}
