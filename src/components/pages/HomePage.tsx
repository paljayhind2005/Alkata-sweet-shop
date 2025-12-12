// HPI 1.6-V
import React, { useRef, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, useScroll, useTransform, useSpring, MotionValue } from 'framer-motion';
import { Image } from '@/components/ui/image';
import { ArrowRight, Star, Award, Gift } from 'lucide-react';

// --- UTILITY COMPONENTS ---

/**
 * Mandatory AnimatedElement for scroll-triggered reveals.
 * Uses IntersectionObserver for performance.
 */
type AnimatedElementProps = {
  children: React.ReactNode;
  className?: string;
  delay?: number;
};

const AnimatedElement: React.FC<AnimatedElementProps> = ({ children, className, delay = 0 }) => {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        // Add a small delay via style if needed, or just let CSS handle it
        setTimeout(() => {
            element.classList.add('is-visible');
        }, delay);
        observer.unobserve(element);
      }
    }, { threshold: 0.15 });

    observer.observe(element);
    return () => observer.disconnect();
  }, [delay]);

  return (
    <div ref={ref} className={`reveal-on-scroll ${className || ''}`}>
      {children}
    </div>
  );
};

/**
 * ParallaxImage
 * Uses Framer Motion for smooth, optimized parallax effects.
 */
const ParallaxImage = ({ src, alt, className, id }: { src: string, alt: string, className?: string, id: string }) => {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"]
  });
  
  const y = useTransform(scrollYProgress, [0, 1], ["-10%", "10%"]);

  return (
    <div ref={ref} className={`overflow-hidden ${className}`}>
      <motion.div style={{ y }} className="w-full h-[120%] -mt-[10%]">
        <Image
          src={src}
          alt={alt}
          width={1200}
          className="w-full h-full object-cover"
        />
      </motion.div>
    </div>
  );
};

// --- MAIN PAGE COMPONENT ---

export default function HomePage() {
  // Canonical Data Sources (Preserved from original)
  const heroCards = [
    { title: "Gulab Jamun", id: "hero-card-1", rotation: "-2deg" },
    { title: "Barfi Collection", id: "hero-card-2", rotation: "1deg" },
    { title: "Jalebi & More", id: "hero-card-3", rotation: "-1deg" }
  ];

  const features = [
    { 
      title: "Pure Ingredients", 
      desc: "We use the finest milk, ghee, and natural flavors sourced from trusted suppliers.",
      icon: Star,
      id: "feat-1"
    },
    { 
      title: "Traditional Methods", 
      desc: "Each sweet is handmade using time-honored techniques passed down through generations.",
      icon: Award,
      id: "feat-2"
    },
    { 
      title: "Authentic Flavors", 
      desc: "Experience the true taste of India with our authentic sweet recipes and presentations.",
      icon: Gift,
      id: "feat-3"
    }
  ];

  return (
    <div className="bg-black text-white min-h-screen w-full overflow-x-clip selection:bg-white selection:text-black">
      {/* Custom Styles for this page only */}
      <style>{`
        .reveal-on-scroll {
          opacity: 0;
          transform: translateY(40px);
          transition: opacity 1s cubic-bezier(0.16, 1, 0.3, 1), transform 1s cubic-bezier(0.16, 1, 0.3, 1);
          will-change: opacity, transform;
        }
        .reveal-on-scroll.is-visible {
          opacity: 1;
          transform: translateY(0);
        }
        .font-heading {
          font-family: 'didot-w01-italic', serif;
        }
        .font-paragraph {
          font-family: 'baskervillemtw01-smbdit', serif;
        }
        /* Custom scrollbar for a premium feel */
        ::-webkit-scrollbar {
          width: 8px;
        }
        ::-webkit-scrollbar-track {
          background: #000;
        }
        ::-webkit-scrollbar-thumb {
          background: #333;
          border-radius: 4px;
        }
        ::-webkit-scrollbar-thumb:hover {
          background: #555;
        }
      `}</style>

      {/* --- HERO SECTION --- */}
      {/* Replicating the "Live & Love" structure: Big Title + 3 Tilted Cards */}
      <section className="relative w-full min-h-screen flex flex-col items-center justify-center pt-32 pb-20 px-6 overflow-hidden">
        
        {/* Background Ambient Effect */}
        <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-white/5 rounded-full blur-[120px] mix-blend-screen animate-pulse" style={{ animationDuration: '4s' }} />
            <div className="absolute bottom-0 right-1/4 w-[600px] h-[600px] bg-white/5 rounded-full blur-[150px] mix-blend-screen" />
        </div>

        <div className="relative z-10 w-full max-w-[120rem] mx-auto flex flex-col items-center">
          {/* Main Headline */}
          <AnimatedElement className="mb-16 md:mb-24 text-center relative z-20">
            <h1 className="font-heading text-[5rem] md:text-[8rem] lg:text-[11rem] leading-[0.85] tracking-tight text-white mix-blend-difference">
              Al Kata <br />
              <span className="ml-[1em] md:ml-[2em] block text-white/90">Sweet</span>
            </h1>
          </AnimatedElement>

          {/* Tilted Cards Container */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12 w-full max-w-7xl px-4">
            {heroCards.map((card, index) => (
              <AnimatedElement key={card.id} delay={index * 150} className="group perspective-1000">
                <Link to="/store" className="block">
                  <div 
                    className="relative bg-zinc-900 rounded-[2rem] overflow-hidden transition-all duration-500 ease-out group-hover:scale-[1.02] group-hover:z-10 group-hover:shadow-2xl group-hover:shadow-white/10"
                    style={{ transform: `rotate(${card.rotation})` }}
                  >
                    {/* Image Container */}
                    <div className="aspect-[3/4] relative overflow-hidden">
                      <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors duration-500 z-10" />
                      <Image
                        src={'https://static.wixstatic.com/media/b1c664_432c0450ce3741d0a87ee8124c036870~mv2.png?originWidth=576&originHeight=768'}
                        alt={card.title}
                        width={600}
                        className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
                      />
                    </div>
                    
                    {/* Card Content */}
                    <div className="absolute bottom-0 left-0 w-full p-8 bg-gradient-to-t from-black/90 via-black/50 to-transparent z-20">
                      <h3 className="font-heading text-3xl text-white mb-2 translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500">
                        {card.title}
                      </h3>
                      <div className="h-px w-0 bg-white group-hover:w-full transition-all duration-700 delay-100" />
                    </div>
                  </div>
                </Link>
              </AnimatedElement>
            ))}
          </div>

          {/* Scroll Indicator */}
          <AnimatedElement delay={800} className="mt-24 flex flex-col items-center gap-4 opacity-60">
            <span className="font-paragraph text-sm tracking-widest uppercase">Scroll to Explore</span>
            <div className="w-px h-16 bg-gradient-to-b from-white to-transparent" />
          </AnimatedElement>
        </div>
      </section>

      {/* --- STICKY NARRATIVE SECTION --- */}
      {/* "Crafted with Passion" - Sticky Left, Scrolling Right */}
      <section className="relative w-full bg-zinc-950 text-white py-32 border-t border-white/10">
        <div className="max-w-[120rem] mx-auto px-6">
          <div className="flex flex-col lg:flex-row gap-16 lg:gap-32">
            
            {/* Sticky Content */}
            <div className="lg:w-1/3 relative">
              <div className="lg:sticky lg:top-32 lg:h-[calc(100vh-16rem)] flex flex-col justify-center">
                <AnimatedElement>
                  <div className="w-12 h-1 bg-white mb-8" />
                  <h2 className="font-heading text-5xl md:text-7xl mb-8 leading-tight">
                    Authentic Indian <br />
                    <span className="italic text-white/50">Sweets</span>
                  </h2>
                  <p className="font-paragraph text-xl md:text-2xl leading-relaxed text-zinc-400 mb-12 max-w-md">
                    Every sweet we create honors traditional Indian recipes passed down through generations. Using only the finest milk, ghee, and natural ingredients, we craft authentic flavors that transport you to the heart of India.
                  </p>
                  <Link 
                    to="/about" 
                    className="group inline-flex items-center gap-3 text-lg font-paragraph border-b border-white/30 pb-1 hover:border-white transition-colors w-fit"
                  >
                    Our Story <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                  </Link>
                </AnimatedElement>
              </div>
            </div>

            {/* Scrolling Visuals */}
            <div className="lg:w-2/3 flex flex-col gap-24 lg:pt-32">
              <AnimatedElement className="w-full">
                <div className="relative aspect-[16/9] rounded-sm overflow-hidden">
                  <ParallaxImage 
                    src="https://static.wixstatic.com/media/b1c664_5204bc27b5764a9ab64726fd135e4587~mv2.png?originWidth=1152&originHeight=640" 
                    alt="Chocolatier at work" 
                    id="about-1"
                  />
                  <div className="absolute bottom-8 left-8 bg-black/80 backdrop-blur-md px-6 py-4 border border-white/10">
                    <p className="font-heading text-xl">Master Sweet Makers</p>
                  </div>
                </div>
                <p className="mt-6 font-paragraph text-zinc-500 text-lg max-w-xl">
                  Our master sweet makers bring decades of experience to every creation, ensuring that each bite delivers the true essence of Indian confectionery excellence.
                </p>
              </AnimatedElement>

              <AnimatedElement className="w-full pl-0 lg:pl-24">
                <div className="relative aspect-[4/5] md:aspect-[16/9] rounded-sm overflow-hidden">
                  <ParallaxImage 
                    src="https://static.wixstatic.com/media/b1c664_77f9a800f5f44668b87da5c35d05c5e8~mv2.png?originWidth=1152&originHeight=640" 
                    alt="Detailed process of chocolate making" 
                    id="about-2"
                  />
                  <div className="absolute top-8 right-8 bg-black/80 backdrop-blur-md px-6 py-4 border border-white/10">
                    <p className="font-heading text-xl">Precision & Art</p>
                  </div>
                </div>
              </AnimatedElement>
            </div>

          </div>
        </div>
      </section>

      {/* --- FULL BLEED BREAK --- */}
      <section className="relative w-full h-[80vh] overflow-hidden flex items-center justify-center">
        <div className="absolute inset-0">
          <ParallaxImage 
            src="https://static.wixstatic.com/media/b1c664_445529d9124644fda78a764391826b0f~mv2.png?originWidth=1280&originHeight=704" 
            alt="Artistic chocolate splash" 
            className="w-full h-full"
            id="break-bg"
          />
          <div className="absolute inset-0 bg-black/40" />
        </div>
        
        <AnimatedElement className="relative z-10 text-center max-w-4xl px-6">
          <h2 className="font-heading text-6xl md:text-8xl text-white mb-6 mix-blend-overlay">
            "Taste the Tradition."
          </h2>
          <p className="font-paragraph text-xl text-white/80 italic">
            — Al Kata Sweet Philosophy
          </p>
        </AnimatedElement>
      </section>

      {/* --- FEATURES GRID --- */}
      <section className="w-full py-32 bg-black px-6">
        <div className="max-w-[120rem] mx-auto">
          <AnimatedElement className="mb-24 text-center">
            <h2 className="font-heading text-5xl md:text-6xl mb-6">The Al Kata Sweet Experience</h2>
            <div className="w-px h-12 bg-white/30 mx-auto" />
          </AnimatedElement>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-white/10 border border-white/10">
            {features.map((feature, idx) => (
              <div key={feature.id} className="group relative bg-black p-12 md:p-16 hover:bg-zinc-900 transition-colors duration-500">
                <AnimatedElement delay={idx * 100}>
                  <div className="mb-8 inline-block p-4 rounded-full border border-white/20 group-hover:border-white transition-colors duration-300">
                    <feature.icon className="w-8 h-8 text-white" strokeWidth={1} />
                  </div>
                  <h3 className="font-heading text-3xl mb-4 group-hover:translate-x-2 transition-transform duration-300">
                    {feature.title}
                  </h3>
                  <p className="font-paragraph text-zinc-400 leading-relaxed group-hover:text-zinc-300 transition-colors">
                    {feature.desc}
                  </p>
                  
                  {/* Decorative Corner */}
                  <div className="absolute top-4 right-4 w-2 h-2 border-t border-r border-white/0 group-hover:border-white/50 transition-all duration-500" />
                </AnimatedElement>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* --- HORIZONTAL SCROLL / GALLERY TEASER --- */}
      <section className="w-full py-32 bg-zinc-950 overflow-hidden">
        <div className="max-w-[120rem] mx-auto px-6 mb-16 flex justify-between items-end">
          <AnimatedElement>
            <h2 className="font-heading text-5xl md:text-6xl">Curated Collections</h2>
          </AnimatedElement>
          <AnimatedElement delay={200}>
            <Link to="/store" className="hidden md:flex items-center gap-2 font-paragraph text-lg hover:text-zinc-300 transition-colors">
              View All <ArrowRight className="w-4 h-4" />
            </Link>
          </AnimatedElement>
        </div>

        {/* Marquee-like Gallery */}
        <div className="flex gap-8 px-6 overflow-x-auto pb-12 snap-x snap-mandatory scrollbar-hide">
          {[1, 2, 3, 4].map((item) => (
            <div key={item} className="flex-none w-[85vw] md:w-[40vw] lg:w-[25vw] snap-center">
              <Link to="/store" className="group block">
                <div className="aspect-[3/4] relative overflow-hidden rounded-lg mb-6">
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors z-10" />
                  <Image
                    src={'https://static.wixstatic.com/media/b1c664_54c54491496f40cb8561263534b96e98~mv2.png?originWidth=576&originHeight=768'}
                    alt={`Collection item ${item}`}
                    width={600}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute bottom-6 left-6 z-20 translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500">
                    <span className="bg-white text-black px-4 py-2 text-sm font-paragraph uppercase tracking-wider">Shop Now</span>
                  </div>
                </div>
                <h3 className="font-heading text-2xl group-hover:italic transition-all">Seasonal Selection {item}</h3>
                <p className="font-paragraph text-zinc-500">$24.00</p>
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* --- MINIMALIST CTA --- */}
      <section className="w-full py-40 bg-white text-black flex flex-col items-center justify-center text-center px-6">
        <AnimatedElement>
          <h2 className="font-heading text-6xl md:text-8xl mb-8">Taste Authentic India</h2>
          <p className="font-paragraph text-xl md:text-2xl max-w-2xl mx-auto mb-12 text-zinc-600">
            Discover our collection of authentic Indian sweets, each one crafted with traditional recipes and the finest ingredients.
          </p>
          <Link
            to="/store"
            className="group relative inline-flex items-center justify-center px-12 py-5 overflow-hidden font-paragraph text-lg tracking-tighter text-white bg-black rounded-full transition-all duration-300 hover:bg-zinc-800 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-zinc-400 focus:ring-offset-2"
          >
            <span className="absolute w-0 h-0 transition-all duration-500 ease-out bg-white rounded-full group-hover:w-56 group-hover:h-56 opacity-10"></span>
            <span className="relative flex items-center gap-2">
              Shop The Collection <ArrowRight className="w-4 h-4" />
            </span>
          </Link>
        </AnimatedElement>
      </section>

    </div>
  );
}