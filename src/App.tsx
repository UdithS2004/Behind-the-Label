/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Leaf, 
  Search, 
  Gamepad2, 
  Brain, 
  BookOpen, 
  Info, 
  ChevronRight, 
  AlertCircle,
  CheckCircle2,
  ExternalLink,
  Menu,
  X
} from 'lucide-react';

// --- Types ---
type SectionId = 'home' | 'what-is' | 'game' | 'why-it-works' | 'research' | 'about';

// --- Components ---

const Navbar = ({ activeSection, setActiveSection }: { activeSection: SectionId, setActiveSection: (id: SectionId) => void }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems: { id: SectionId; label: string }[] = [
    { id: 'home', label: 'Home' },
    { id: 'what-is', label: 'What is Healthwashing' },
    { id: 'game', label: 'Play the Game' },
    { id: 'why-it-works', label: 'Why it Works' },
    { id: 'research', label: 'Research' },
    { id: 'about', label: 'About' },
  ];

  const handleNavClick = (id: SectionId) => {
    setActiveSection(id);
    setIsMobileMenuOpen(false);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <nav className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${isScrolled ? 'bg-white/90 backdrop-blur-md shadow-sm py-3' : 'bg-transparent py-6'}`}>
      <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
        <div 
          className="flex items-center gap-2 cursor-pointer group"
          onClick={() => handleNavClick('home')}
        >
          <div className="w-10 h-10 bg-brand-green rounded-xl flex items-center justify-center text-white group-hover:scale-110 transition-transform">
            <Leaf size={20} />
          </div>
          <span className="font-display font-bold text-xl tracking-tight text-brand-green">Behind the Label</span>
        </div>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-8">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => handleNavClick(item.id)}
              className={`nav-link ${activeSection === item.id ? 'active' : ''}`}
            >
              {item.label}
            </button>
          ))}
        </div>

        {/* Mobile Menu Toggle */}
        <button 
          className="md:hidden text-zinc-600"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Nav Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="absolute top-full left-0 w-full bg-white shadow-xl border-t border-zinc-100 p-6 md:hidden"
          >
            <div className="flex flex-col gap-4">
              {navItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className={`text-left py-2 font-medium ${activeSection === item.id ? 'text-brand-green' : 'text-zinc-600'}`}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

const SectionHeading = ({ children, subtitle, light = false }: { children: React.ReactNode; subtitle?: string; light?: boolean }) => (
  <div className="mb-12">
    <h2 className={`text-3xl md:text-4xl font-bold mb-4 ${light ? 'text-white' : 'text-zinc-900'}`}>
      {children}
    </h2>
    {subtitle && (
      <p className={`text-lg max-w-2xl ${light ? 'text-white/80' : 'text-zinc-500'}`}>
        {subtitle}
      </p>
    )}
    <div className={`w-20 h-1.5 mt-6 rounded-full ${light ? 'bg-white/30' : 'bg-brand-accent/30'}`}></div>
  </div>
);

const BuzzwordBadge = ({ children }: { children: React.ReactNode }) => (
  <span className="px-4 py-2 bg-white border border-zinc-200 rounded-full text-sm font-semibold text-zinc-700 shadow-sm hover:border-brand-accent hover:text-brand-green transition-all cursor-default">
    {children}
  </span>
);

const TacticCard = ({ title, description, icon: Icon }: { title: string; description: string; icon: any }) => (
  <div className="glass-card p-8 hover:shadow-md transition-shadow group">
    <div className="w-12 h-12 bg-brand-light rounded-2xl flex items-center justify-center text-brand-green mb-6 group-hover:bg-brand-green group-hover:text-white transition-colors">
      <Icon size={24} />
    </div>
    <h3 className="text-xl font-bold mb-3 text-zinc-900">{title}</h3>
    <p className="text-zinc-600 leading-relaxed">{description}</p>
  </div>
);

const PsychologyCard = ({ title, description, icon: Icon }: { title: string; description: string; icon: any }) => (
  <div className="flex gap-6 p-6 rounded-2xl hover:bg-white/50 transition-colors">
    <div className="flex-shrink-0 w-12 h-12 bg-white rounded-full flex items-center justify-center text-brand-accent shadow-sm">
      <Icon size={24} />
    </div>
    <div>
      <h3 className="text-lg font-bold mb-2 text-zinc-900">{title}</h3>
      <p className="text-zinc-600 text-sm leading-relaxed">{description}</p>
    </div>
  </div>
);

export default function App() {
  const [activeSection, setActiveSection] = useState<SectionId>('home');

  // Intersection Observer to update active nav item on scroll
  useEffect(() => {
    const observerOptions = {
      root: null,
      rootMargin: '-20% 0px -70% 0px',
      threshold: 0
    };

    const observerCallback = (entries: IntersectionObserverEntry[]) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          setActiveSection(entry.target.id as SectionId);
        }
      });
    };

    const observer = new IntersectionObserver(observerCallback, observerOptions);
    const sections = ['home', 'what-is', 'game', 'why-it-works', 'research', 'about'];
    sections.forEach(id => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  return (
    <div className="min-h-screen selection:bg-brand-accent/30">
      <Navbar activeSection={activeSection} setActiveSection={setActiveSection} />

      {/* --- HERO SECTION --- */}
      <header id="home" className="relative pt-32 pb-20 md:pt-48 md:pb-32 overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full -z-10 opacity-40">
          <div className="absolute top-[-10%] right-[-5%] w-[40%] h-[60%] bg-brand-accent/20 rounded-full blur-3xl"></div>
          <div className="absolute bottom-[-10%] left-[-5%] w-[30%] h-[50%] bg-brand-green/10 rounded-full blur-3xl"></div>
        </div>

        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-brand-green/10 text-brand-green rounded-full text-xs font-bold uppercase tracking-wider mb-6">
                <AlertCircle size={14} />
                Food Media Literacy Project
              </div>
              <h1 className="text-5xl md:text-7xl font-bold text-zinc-900 leading-[1.1] mb-8">
                Behind the <span className="text-brand-green">Label</span>
              </h1>
              <p className="text-xl text-zinc-600 leading-relaxed mb-10 max-w-lg">
                Unmasking the marketing tactics that make ultra-processed foods look like health foods. Designed to help college students see past the buzzwords and become more critical consumers.
              </p>
              <div className="flex flex-wrap gap-4">
                <button 
                  onClick={() => {
                    const el = document.getElementById('game');
                    el?.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="px-8 py-4 bg-brand-green text-white rounded-xl font-bold shadow-lg shadow-brand-green/20 hover:bg-brand-green/90 hover:-translate-y-1 transition-all flex items-center gap-2"
                >
                  Play the Game <Gamepad2 size={20} />
                </button>
                <button 
                  onClick={() => {
                    const el = document.getElementById('what-is');
                    el?.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="px-8 py-4 bg-white text-zinc-700 border border-zinc-200 rounded-xl font-bold hover:bg-zinc-50 transition-all"
                >
                  Learn More
                </button>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="relative"
            >
              <div className="glass-card p-8 md:p-12 relative overflow-hidden">
                <div className="absolute top-0 right-0 p-4 opacity-10">
                  <Search size={120} />
                </div>
                <h3 className="text-sm font-bold text-brand-green uppercase tracking-widest mb-6">Common Buzzwords</h3>
                <div className="flex flex-wrap gap-3">
                  <BuzzwordBadge>Natural</BuzzwordBadge>
                  <BuzzwordBadge>Gut Health</BuzzwordBadge>
                  <BuzzwordBadge>High Protein</BuzzwordBadge>
                  <BuzzwordBadge>Low Fat</BuzzwordBadge>
                  <BuzzwordBadge>Plant-Based</BuzzwordBadge>
                  <BuzzwordBadge>No Added Sugar</BuzzwordBadge>
                  <BuzzwordBadge>Superfood</BuzzwordBadge>
                  <BuzzwordBadge>Artisan</BuzzwordBadge>
                  <BuzzwordBadge>Clean Label</BuzzwordBadge>
                  <BuzzwordBadge>Non-GMO</BuzzwordBadge>
                </div>
                <p className="mt-8 text-sm text-zinc-500 italic">
                  * These terms are often used to create a "health halo" around products that may still be high in sugar, sodium, or saturated fats.
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </header>

      {/* --- WHAT IS HEALTHWASHING --- */}
      <section id="what-is" className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <SectionHeading 
            subtitle="Healthwashing is a marketing strategy used to mislead consumers into believing that a company's products are healthier than they actually are."
          >
            What is Healthwashing?
          </SectionHeading>

          <div className="grid md:grid-cols-3 gap-8 mb-16">
            <TacticCard 
              icon={Search}
              title="Vague Health Claims"
              description="Using terms like 'natural' or 'wholesome' which have little to no legal definition, allowing brands to imply health benefits without evidence."
            />
            <TacticCard 
              icon={BookOpen}
              title="Scientific Buzzwords"
              description="Highlighting specific nutrients like 'antioxidants' or 'probiotics' to distract from high levels of sugar or processed ingredients."
            />
            <TacticCard 
              icon={Leaf}
              title="Natural Imagery"
              description="Using pictures of fresh fruit, farm landscapes, or green leaves on packaging for products that are highly processed and shelf-stable."
            />
            <TacticCard 
              icon={Brain}
              title="Color Psychology"
              description="Utilizing earthy tones, greens, and matte finishes to signal 'organic' or 'earth-friendly' qualities to the subconscious mind."
            />
            <TacticCard 
              icon={AlertCircle}
              title="Benefit Highlighting"
              description="Highlighting one positive attribute (e.g., 'Gluten Free') while hiding high amounts of saturated fat or sodium in the fine print."
            />
            <TacticCard 
              icon={CheckCircle2}
              title="Misleading Certifications"
              description="Creating proprietary 'seals of approval' that look like independent certifications but are actually just internal marketing icons."
            />
          </div>

          <div className="bg-brand-light rounded-3xl p-8 md:p-12 flex flex-col md:flex-row gap-12 items-center">
            
            <div className="md:w-1/2">
              <h3 className="text-2xl font-bold mb-4">Why it matters today</h3>

              <p className="text-zinc-600 leading-relaxed mb-6">
                In the modern food media landscape, we are bombarded with information. 
                Social media influencers, targeted ads, and aesthetic packaging make it 
                harder than ever to distinguish between genuine nutrition and clever marketing.
              </p>

              <ul className="space-y-3">
                {[
                  "Erodes consumer trust in legitimate health information",
                  "Leads to overconsumption of ultra-processed foods",
                  "Makes healthy eating feel more expensive and complicated",
                  "Influences long-term dietary habits of young adults"
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-3 text-sm text-zinc-700">
                    <CheckCircle2 size={18} className="text-brand-green mt-0.5 flex-shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            <div className="md:w-1/2 grid grid-cols-2 gap-4">

              <div className="aspect-square bg-zinc-200 rounded-2xl overflow-hidden">
                <img
                  src="https://images.unsplash.com/photo-1606787366850-de6330128bfc"
                  alt="Snack packaging with health claims"
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>

              <div className="aspect-square bg-zinc-200 rounded-2xl overflow-hidden mt-8">
                <img
                  src="https://images.unsplash.com/photo-1585238342024-78d387f4a707"
                  alt="Sugary drink with natural imagery"
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>

            </div>

          </div>
        </div>
      </section>

      {/* --- PLAY THE GAME --- */}
      <section id="game" className="py-24 bg-brand-green text-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">Spot the Healthwashing</h2>
            <p className="text-xl text-white/80 max-w-2xl mx-auto">
              Test your skills! Can you identify which products are genuinely healthy and which are just using clever marketing tactics?
            </p>
          </div>

          <div className="max-w-4xl mx-auto bg-white/10 backdrop-blur-md border border-white/20 rounded-3xl p-12 flex flex-col items-center justify-center text-center">
            <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mb-6">
              <Gamepad2 size={40} />
            </div>
            <h3 className="text-2xl font-bold mb-4">Interactive Experience</h3>
            <p className="text-white/70 max-w-md mb-8">
              We've developed an interactive game to help you practice identifying healthwashing in the real world. Click below to launch the experience in a new tab.
            </p>
            <a 
              href="https://mayaoden.github.io/info358-healthwashing/"
              target="_blank"
              rel="noopener noreferrer"
              className="px-10 py-5 bg-white text-brand-green rounded-2xl font-bold text-lg shadow-xl hover:scale-105 transition-all flex items-center gap-3"
            >
              Launch the Game <ExternalLink size={24} />
            </a>
          </div>
        </div>
      </section>

      {/* --- WHY IT WORKS --- */}
      <section id="why-it-works" className="py-24 bg-brand-light">
        <div className="max-w-7xl mx-auto px-6">
          <SectionHeading 
            subtitle="Marketing isn't just about information; it's about psychology. Brands leverage cognitive biases to influence our choices."
          >
            The Psychology of Marketing
          </SectionHeading>

          <div className="grid md:grid-cols-2 gap-x-12 gap-y-8">
            <PsychologyCard 
              icon={Brain}
              title="The Health Halo Effect"
              description="When one 'healthy' attribute (like 'Organic') makes us perceive the entire product as healthy, leading us to ignore high sugar or calorie counts."
            />
            <PsychologyCard 
              icon={Search}
              title="Packaging Design"
              description="Matte textures and minimalist layouts signal 'premium' and 'pure' qualities, whereas glossy, bright packaging is associated with 'junk' food."
            />
            <PsychologyCard 
              icon={Info}
              title="Color Psychology"
              description="Green signals nature and safety; brown signals whole grains and earthiness; white signals purity and low-calorie options."
            />
            <PsychologyCard 
              icon={ExternalLink}
              title="Social Media Wellness"
              description="Influencers use 'aesthetic' food choices to signal status and health, creating a desire for specific brands regardless of nutritional value."
            />
          </div>

          <div className="mt-20 glass-card p-10 bg-gradient-to-br from-white to-brand-accent/5">
            <div className="flex flex-col md:flex-row gap-10 items-center">
              <div className="md:w-1/3">
                <div className="aspect-square bg-brand-green/10 rounded-3xl flex items-center justify-center text-brand-green">
                  <Brain size={80} />
                </div>
              </div>
              <div className="md:w-2/3">
                <h3 className="text-2xl font-bold mb-4">Cognitive Ease</h3>
                <p className="text-zinc-600 leading-relaxed mb-6">
                  Our brains prefer information that is easy to process. Buzzwords like "Natural" provide a mental shortcut, allowing us to make quick decisions without the cognitive effort of reading a complex nutrition label. Marketers know this and use it to their advantage.
                </p>
                <div className="p-4 bg-white rounded-xl border border-zinc-100 text-sm text-zinc-500 italic">
                  "The goal of healthwashing isn't to lie, it's to frame the truth in a way that leads the consumer to a specific, often incorrect, conclusion."
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* --- RESEARCH / SOURCES --- */}
      <section id="research" className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <SectionHeading 
            subtitle="This project is grounded in academic research and industry analysis of food marketing and consumer behavior."
          >
            Research & Sources
          </SectionHeading>

          <div className="space-y-6 max-w-4xl">
            {[
              {
                author: "Chandon, P., & Wansink, B.",
                year: "2007",
                title: "The Biasing Health Halos of Fast-Food Restaurant Health Claims: Lower Calorie Estimates and Higher Side-Dish Consumption Intentions.",
                journal: "Journal of Consumer Research",
                url: "https://academic.oup.com/jcr/article/34/3/301/1792455"
              },
              {
                author: "Miller, C. J., & Cassady, D. L.",
                year: "2015",
                title: "The role of nutrition knowledge in food label use. A review of recent literature.",
                journal: "Appetite",
                url: "https://pubmed.ncbi.nlm.nih.gov/26021487/"
              },
              {
                author: "Temple, N. J.",
                year: "2020",
                title: "Front-of-package food labels: A narrative review.",
                journal: "Appetite",
                url: "https://pubmed.ncbi.nlm.nih.gov/32194178/"
              },
            ].map((source, i) => (
              <a 
                key={i} 
                href={source.url} 
                target="_blank" 
                rel="noopener noreferrer"
                className="block p-6 border-l-4 border-brand-accent bg-zinc-50 rounded-r-2xl hover:bg-brand-accent/5 transition-colors group"
              >
                <div className="flex justify-between items-start gap-4">
                  <div>
                    <p className="text-zinc-800 font-medium mb-1">
                      {source.author} ({source.year}).
                    </p>
                    <p className="text-zinc-900 italic mb-1 group-hover:text-brand-green transition-colors">{source.title}</p>
                    <p className="text-zinc-500 text-sm">{source.journal}</p>
                  </div>
                  <ExternalLink size={18} className="text-zinc-400 group-hover:text-brand-green transition-colors flex-shrink-0 mt-1" />
                </div>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* --- ABOUT THE PROJECT --- */}
      <section id="about" className="py-24 bg-zinc-900 text-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div>
              <SectionHeading light subtitle="Exploring the intersection of information design, food media, and media literacy.">
                About the Project
              </SectionHeading>
              <p className="text-white/70 leading-relaxed mb-6">
                "Behind the Label" was created as a final project for a University Food Media course. The project aims to bridge the gap between complex nutritional science and everyday consumer choices through effective information design.
              </p>
              <p className="text-white/70 leading-relaxed mb-8">
                By deconstructing marketing tactics, we hope to empower young adults to make more informed decisions and foster a more critical approach to the media they consume in the grocery aisle.
              </p>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center">
                  <Info size={24} />
                </div>
                <div>
                  <p className="text-sm font-bold">University Food Media Project</p>
                  <p className="text-xs text-white/50">Spring 2026 • Media Literacy Initiative</p>
                </div>
              </div>
            </div>
            <div className="relative">
              <div className="aspect-video bg-white/5 rounded-3xl border border-white/10 p-8 flex flex-col justify-center">
                <h4 className="text-xl font-bold mb-4 text-brand-accent">Project Goals</h4>
                <ul className="space-y-4">
                  {[
                    "Increase awareness of healthwashing tactics",
                    "Improve food label literacy among students",
                    "Analyze the impact of visual design on perception",
                    "Provide credible resources for further learning"
                  ].map((goal, i) => (
                    <li key={i} className="flex items-center gap-3 text-sm text-white/80">
                      <div className="w-1.5 h-1.5 bg-brand-accent rounded-full"></div>
                      {goal}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* --- FOOTER --- */}
      <footer className="py-12 bg-zinc-950 text-zinc-500 border-t border-white/5">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex items-center gap-2">
            <Leaf size={18} className="text-brand-green" />
            <span className="font-display font-bold text-lg text-white">Behind the Label</span>
          </div>
          <div className="text-sm">
            © 2026 Behind the Label Project. For educational purposes only.
          </div>
          <div className="flex gap-6">
            <a href="#" className="hover:text-white transition-colors">Privacy</a>
            <a href="#" className="hover:text-white transition-colors">Terms</a>
            <a href="#" className="hover:text-white transition-colors">Contact</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
