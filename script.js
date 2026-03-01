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

            // Load dynamic content if needed
            if (page === 'service-detail' && param) {
                loadServiceDetail(param);
            } else if (page === 'case-study' && param) {
                loadCaseStudy(param);
            } else if (page === 'portfolio') {
                loadPortfolio();
            }

            // Re-initialize animations
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
            setTimeout(observeSections, 100);
        }
    }
};

// Service Detail Data
const serviceData = {
    strategy: {
        title: "Digital Strategy",
        subtitle: "Navigate the digital landscape with confidence",
        description: "Our strategic consulting services help organizations identify opportunities, mitigate risks, and create actionable roadmaps for digital transformation.",
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
        title: "AI Integration",
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
    mobile: {
        title: "Mobile Apps",
        subtitle: "Native experiences that users love",
        description: "iOS and Android applications built with cutting-edge technologies that deliver smooth performance and intuitive user experiences.",
        problems: [
            "Poor app store ratings",
            "High uninstall rates",
            "Slow performance",
            "Security concerns",
            "Difficulty maintaining code"
        ],
        approach: [
            "UX Research: Understanding user needs and behaviors",
            "Prototyping: Rapid iteration on user flows",
            "Development: Native or cross-platform excellence",
            "Launch: App store optimization and release"
        ],
        deliverables: [
            "iOS & Android Apps",
            "App Store Optimization",
            "Backend Infrastructure",
            "Analytics Integration",
            "Maintenance & Updates"
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
        title: "Motion Graphics",
        subtitle: "Bringing your story to life",
        description: "High-quality animations and motion design that capture attention and communicate complex ideas simply and effectively.",
        problems: [
            "Static content failing to engage",
            "Difficulty explaining complex processes",
            "High drop-off rates on explanations",
            "Brand feeling 'static' or 'old'",
            "Low social media engagement"
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

// Case Study Data
const caseStudyData = {
    ecommerce: {
        title: "Luxury E-Commerce Platform",
        client: "Prestige Retail Group",
        category: "E-Commerce",
        overview: "A complete digital transformation for a luxury retailer seeking to modernize their online presence and capture the growing high-end digital market.",
        problem: "Legacy platform with 8+ second load times, 2% conversion rate, and inability to handle flash sale traffic. Brand perception was suffering due to poor digital experience.",
        strategy: "Headless commerce architecture with React frontend, AI-powered personalization, and mobile-first luxury experience design.",
        execution: "6-month phased rollout including platform migration, custom AR try-on features, and VIP customer portal.",
        results: [
            { label: "Revenue Growth", value: "+180%" },
            { label: "Conversion Rate", value: "4.5%" },
            { label: "Page Load Time", value: "0.8s" },
            { label: "Mobile Revenue", value: "+240%" }
        ]
    },
    fintech: {
        title: "Neobank App Redesign",
        client: "Future Finance",
        category: "FinTech",
        overview: "Complete UX overhaul of a digital banking application to improve user engagement and compete with established fintech players.",
        problem: "Complex navigation causing 60% drop-off during onboarding. Users complained about 'too many steps' to complete basic transactions.",
        strategy: "Simplified information architecture, biometric authentication, and predictive transaction features powered by ML.",
        execution: "3-month design sprint followed by gradual feature rollout with extensive A/B testing.",
        results: [
            { label: "User Acquisition", value: "2M+" },
            { label: "Onboarding Completion", value: "+85%" },
            { label: "Daily Active Users", value: "+150%" },
            { label: "App Store Rating", value: "4.9★" }
        ]
    },
    healthcare: {
        title: "Telemedicine Platform",
        client: "MedConnect Health",
        category: "Healthcare",
        overview: "End-to-end telehealth solution enabling remote consultations, prescription management, and patient monitoring.",
        problem: "Inefficient manual scheduling, no-show rates of 30%, and provider burnout from administrative tasks.",
        strategy: "AI-powered triage, automated scheduling, integrated EHR, and remote monitoring devices.",
        execution: "12-month development with strict HIPAA compliance, security audits, and provider training programs.",
        results: [
            { label: "Cost Reduction", value: "-40%" },
            { label: "Patient Satisfaction", value: "4.8/5" },
            { label: "No-Show Rate", value: "5%" },
            { label: "Provider Efficiency", value: "+60%" }
        ]
    }
};

// Portfolio Data
const portfolioItems = [
    { id: 'ecommerce', title: "Luxury Retail Platform", category: "ecommerce", result: "+180% Revenue" },
    { id: 'fintech', title: "Neobank Redesign", category: "fintech", result: "2M+ Users" },
    { id: 'healthcare', title: "Telemedicine Platform", category: "healthcare", result: "-40% Costs" },
    { id: 'saas', title: "B2B Analytics Dashboard", category: "saas", result: "+300% Engagement" },
    { id: 'ecommerce2', title: "Fashion Marketplace", category: "ecommerce", result: "$50M GMV" },
    { id: 'fintech2', title: "Crypto Trading App", category: "fintech", result: "$2B Volume" }
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
    grid.innerHTML = portfolioItems.map((item, i) => `
        <div class="portfolio-card group cursor-pointer section-hidden" style="transition-delay: ${i * 0.1}s" onclick="router.navigate('case-study', '${item.id}')" data-category="${item.category}">
            <div class="aspect-[4/3] bg-gray-800 relative overflow-hidden rounded-lg">
                <div class="absolute inset-0 bg-gradient-to-br from-[#00b894]/10 to-[#9b59b6]/10"></div>
                <div class="absolute inset-0 flex items-center justify-center">
                    <div class="text-4xl font-bold text-white/10">${item.title.charAt(0)}</div>
                </div>
                <div class="portfolio-overlay absolute inset-0 flex flex-col justify-end p-6">
                    <div class="transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                        <div class="text-[#00b894] text-xs font-medium mb-1 uppercase">${item.category}</div>
                        <h3 class="text-xl font-bold mb-1">${item.title}</h3>
                        <div class="text-[#00b894] font-bold">${item.result}</div>
                    </div>
                </div>
            </div>
        </div>
    `).join('');

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

// Hero Section: Neural Network Particles
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

    function animate() {
        requestAnimationFrame(animate);

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

    animate();

    window.addEventListener('resize', () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    });
}

// About: Floating Geometric Shapes
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
    function animate() {
        requestAnimationFrame(animate);
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

    animate();

    window.addEventListener('resize', () => {
        camera.aspect = container.clientWidth / container.clientHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(container.clientWidth, container.clientHeight);
    });
}

// WHY CHOOSE US: DNA Helix
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
    function animate() {
        requestAnimationFrame(animate);
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

    animate();

    window.addEventListener('resize', () => {
        camera.aspect = container.clientWidth / container.clientHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(container.clientWidth, container.clientHeight);
    });
}

// SERVICES: Flowing Data Stream
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
    function animate() {
        requestAnimationFrame(animate);
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

    animate();

    window.addEventListener('resize', () => {
        camera.aspect = container.clientWidth / container.clientHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(container.clientWidth, container.clientHeight);
    });
}

// PORTFOLIO: Constellation Network
function initPortfolioConstellation() {
    const container = document.getElementById('portfolio-canvas-container');
    if (!container) return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, container.clientWidth / container.clientHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });

    renderer.setSize(container.clientWidth, container.clientHeight);
    container.appendChild(renderer.domElement);

    const stars = [];
    const starCount = 60;
    const connections = [];

    // Create stars
    for (let i = 0; i < starCount; i++) {
        const geometry = new THREE.SphereGeometry(0.1, 8, 8);
        const material = new THREE.MeshBasicMaterial({
            color: Math.random() > 0.7 ? 0x9b59b6 : 0x00b894,
            transparent: true,
            opacity: 0.8
        });

        const star = new THREE.Mesh(geometry, material);
        star.position.set(
            (Math.random() - 0.5) * 20,
            (Math.random() - 0.5) * 15,
            (Math.random() - 0.5) * 5
        );

        star.userData = {
            pulseSpeed: 0.5 + Math.random(),
            baseOpacity: 0.4 + Math.random() * 0.4,
            twinkleOffset: Math.random() * Math.PI * 2
        };

        scene.add(star);
        stars.push(star);
    }

    camera.position.z = 12;

    let time = 0;
    function animate() {
        requestAnimationFrame(animate);
        time += 0.01;

        // Clear old connections
        connections.forEach(line => scene.remove(line));
        connections.length = 0;

        // Update stars and create connections
        stars.forEach((star, i) => {
            // Twinkle effect
            const opacity = star.userData.baseOpacity +
                Math.sin(time * star.userData.pulseSpeed + star.userData.twinkleOffset) * 0.3;
            star.material.opacity = Math.max(0.2, opacity);

            // Gentle drift
            star.position.y += Math.sin(time * 0.5 + i) * 0.002;

            // Connect nearby stars
            let connectionCount = 0;
            for (let j = i + 1; j < stars.length && connectionCount < 3; j++) {
                const dist = star.position.distanceTo(stars[j].position);

                if (dist < 4) {
                    const geometry = new THREE.BufferGeometry().setFromPoints([
                        star.position,
                        stars[j].position
                    ]);
                    const line = new THREE.Line(geometry, new THREE.LineBasicMaterial({
                        color: 0x00b894,
                        transparent: true,
                        opacity: (1 - dist / 4) * 0.15
                    }));
                    scene.add(line);
                    connections.push(line);
                    connectionCount++;
                }
            }
        });

        // Slow rotation
        scene.rotation.z = Math.sin(time * 0.1) * 0.05;

        renderer.render(scene, camera);
    }

    animate();

    window.addEventListener('resize', () => {
        camera.aspect = container.clientWidth / container.clientHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(container.clientWidth, container.clientHeight);
    });
}

// Intersection Observer
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
                stat.textContent = target + (stat.dataset.suffix || '+');
                clearInterval(timer);
            } else {
                stat.textContent = Math.floor(current);
            }
        }, 16);
    });
}

// Mobile menu toggle
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

// Initialize everything
document.addEventListener('DOMContentLoaded', () => {
    initHeroParticles();
    initAboutShapes();
    initDNAHelix();
    initServicesStream();
    initPortfolioConstellation();
    observeSections();
});