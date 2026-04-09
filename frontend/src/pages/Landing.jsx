import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
	    Phone, Mail, MapPin, Search, Plane, Ship, Truck, Warehouse, 
	    ArrowRight, Star, ChevronDown, CheckCircle, Navigation, Anchor, Globe
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../api/axios';

const MotionA = motion.a;
const MotionSpan = motion.span;
const MotionDiv = motion.div;

// Basic wrapper for consistent constraints
const SectionWrapper = ({ children, bg = "var(--bg-primary)", id }) => (
    <section id={id} style={{ background: bg, padding: '6rem 5%', borderBottom: bg === 'var(--bg-primary)' ? '1px solid var(--border-color)' : 'none' }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
            {children}
        </div>
    </section>
);

const Navbar = () => (
    <header style={{ 
        position: 'sticky', top: 0, left: 0, right: 0, zIndex: 50,
        display: 'flex', justifyContent: 'space-between', alignItems: 'center', 
        padding: '1rem 5%', background: '#fff', borderBottom: '1px solid var(--border-color)'
    }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <Link to="/" style={{ display: 'flex', alignItems: 'center', textDecoration: 'none', gap: '0.75rem' }}>
                <img src="/amooksco.jpeg" alt="AMOOKSCO Logo" style={{ height: '60px', width: 'auto', borderRadius: '50%' }} />
                <h1 style={{ margin: 0, color: 'var(--dark-blue)', fontSize: '1.5rem', fontWeight: 800, letterSpacing: '-0.02em', lineHeight: 1 }}>AMOOKSCO <span style={{ color: 'var(--accent-blue)', display: 'block', fontSize: '0.9rem', letterSpacing: '0.1em', marginTop: '4px' }}>LOGISTICS</span></h1>
            </Link>
        </div>
	        <nav className="d-none-mobile" style={{ display: 'flex', gap: '2rem', alignItems: 'center', fontSize: '0.95rem', fontWeight: '500' }}>
	            <MotionA whileHover={{ color: 'var(--accent-blue)' }} href="#home" style={{ color: 'var(--text-secondary)', textDecoration: 'none' }}>Home</MotionA>
	            <MotionA whileHover={{ color: 'var(--accent-blue)' }} href="#services" style={{ color: 'var(--text-secondary)', textDecoration: 'none' }}>Services</MotionA>
	            <MotionA whileHover={{ color: 'var(--accent-blue)' }} href="#tracking" style={{ color: 'var(--text-secondary)', textDecoration: 'none' }}>Tracking</MotionA>
	            <Link to="/login" style={{ color: 'var(--text-secondary)', textDecoration: 'none' }}><MotionSpan whileHover={{ color: 'var(--accent-blue)' }}>Login / Sign Up</MotionSpan></Link>
	        </nav>
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
            <div className="d-none-mobile" style={{ fontWeight: '600', color: 'var(--dark-blue)' }}>+1 (555) 303-9452</div>
            <Link to="/register" className="btn btn-secondary" style={{ padding: '0.5rem 1rem' }}>Message Us</Link>
            <Link to="/track" className="btn btn-primary" style={{ padding: '0.5rem 1rem' }}>Customer Service</Link>
        </div>
    </header>
);

const HeroSplit = () => (
    <section id="home" style={{ display: 'flex', flexWrap: 'wrap', minHeight: '85vh', borderBottom: '1px solid var(--border-color)' }}>
        {/* LEFT COLLAGE SIDE */}
        <div style={{ flex: '1 1 500px', padding: '4rem 5%', display: 'flex', flexDirection: 'column', justifyContent: 'center', borderRight: '1px solid var(--border-color)', position: 'relative' }}>
	            <MotionDiv initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6 }}>
                <h1 style={{ fontSize: 'clamp(3rem, 5vw, 5rem)', color: 'var(--dark-blue)', fontWeight: '800', lineHeight: 1.1, textTransform: 'uppercase' }}>
                    We Lead <br/><span style={{ color: 'var(--text-secondary)', fontWeight: '300' }}>Freight</span><br/>Forwarding.
                </h1>
                
                {/* Visual Placeholder for collage */}
                <div style={{ position: 'relative', height: '300px', width: '100%', marginTop: '2rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <div style={{ position: 'absolute', width: '250px', height: '250px', background: 'var(--bg-secondary)', borderRadius: '50%', border: '4px solid var(--border-color)', zIndex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <Globe size={150} color="var(--border-color)" strokeWidth={1} />
                    </div>
	                    <MotionDiv animate={{ y: [-10, 10, -10] }} transition={{ duration: 5, repeat: Infinity }} style={{ position: 'absolute', zIndex: 2, top: '20px', left: '10%' }}>
	                        <Plane size={80} color="var(--dark-blue)" fill="#fff" />
	                    </MotionDiv>
	                    <MotionDiv animate={{ x: [-10, 10, -10] }} transition={{ duration: 6, repeat: Infinity }} style={{ position: 'absolute', zIndex: 2, bottom: '20px', right: '10%' }}>
	                        <Truck size={80} color="var(--accent-blue)" fill="#fff" />
	                    </MotionDiv>
                </div>

                {/* Footer blue bar reference */}
                <div style={{ background: 'var(--dark-blue)', color: '#fff', display: 'flex', flexWrap: 'wrap', gap: '2rem', padding: '1.5rem', borderRadius: 'var(--radius-md)', marginTop: '2rem' }}>
                    <div style={{ display: 'flex', gap: '0.5rem', fontSize: '0.85rem' }}><Phone size={18} color="var(--accent-blue)"/> 030 394 0526</div>
                    <div style={{ display: 'flex', gap: '0.5rem', fontSize: '0.85rem' }}><Mail size={18} color="var(--accent-blue)"/> support@amooksco.com</div>
                </div>
	            </MotionDiv>
        </div>

        {/* RIGHT ABOUT SIDE */}
        <div style={{ flex: '1 1 500px', padding: '4rem 5%', display: 'flex', flexDirection: 'column', justifyContent: 'center', background: 'var(--bg-primary)' }}>
	            <MotionDiv initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6, delay: 0.2 }} style={{ maxWidth: '600px' }}>
                <div className="section-label">ABOUT US</div>
                <h2 className="heading-2" style={{ marginBottom: '2rem' }}>Affordable and Reliable Logistics Solutions</h2>
                <p className="text-dim" style={{ fontSize: '1.1rem', lineHeight: '1.8', marginBottom: '3rem' }}>
                    At AMOOKSCO, our mission is to deliver exceptional international logistics services by providing comprehensive, tailored solutions. We aim to enhance the productivity and profitability of our clients — importers, exporters, and partners — while driving global supply chain success.
                </p>
                <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                    <Link to="/dashboard" className="btn btn-primary" style={{ flex: 1, padding: '1.25rem 0' }}>Our Solutions</Link>
                    <Link to="/register" className="btn btn-secondary" style={{ flex: 1, padding: '1.25rem 0', borderColor: 'var(--accent-blue)' }}>Ship with Us</Link>
                </div>
	            </MotionDiv>
        </div>
    </section>
);

const AccordionItem = ({ title, desc, initOpen }) => {
    const [open, setOpen] = useState(initOpen || false);
    return (
        <div style={{ borderBottom: '1px solid var(--border-color)', marginBottom: '1rem' }}>
            <button 
                onClick={() => setOpen(!open)}
                style={{ width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1.5rem', background: open ? 'var(--dark-blue)' : '#fff', color: open ? '#fff' : 'var(--dark-blue)', border: open ? 'none' : '1px solid var(--border-color)', borderRadius: 'var(--radius-sm)', cursor: 'pointer', outline: 'none', transition: 'var(--transition)' }}
            >
                <h3 style={{ fontSize: '1.25rem', fontWeight: '600', margin: 0 }}>{title}</h3>
                <ChevronDown style={{ transform: open ? 'rotate(180deg)' : 'none', transition: 'transform 0.3s' }} />
            </button>
            <AnimatePresence>
                {open && (
	                    <MotionDiv 
                        initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }}
                        style={{ overflow: 'hidden' }}
                    >
                        <div style={{ padding: '2rem 1.5rem', color: 'var(--text-secondary)', lineHeight: '1.7' }}>
                            {desc}
                        </div>
	                    </MotionDiv>
                )}
            </AnimatePresence>
        </div>
    );
};

const ServicesAccordionLayout = () => (
    <SectionWrapper id="services">
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4rem' }}>
            <div style={{ flex: '1 1 400px' }}>
                <div className="section-label">SERVICES</div>
                <h2 className="heading-1" style={{ marginBottom: '2rem' }}>We assure fast and <span style={{ color: 'var(--dark-blue)', textDecoration: 'underline', textDecorationColor: 'var(--accent-blue)' }}>secure</span> logistics solutions for you.</h2>
	                <div style={{ alignItems: 'center', gap: '1rem', background: 'var(--bg-secondary)', padding: '1rem', borderRadius: 'var(--radius-md)', display: 'inline-flex', marginTop: '1rem' }}>
                    <div style={{ width: '40px', height: '40px', background: 'var(--accent-blue)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Search size={20} color="#fff" /></div>
                    <span style={{ fontWeight: '600', color: 'var(--dark-blue)' }}>Expert Solutions</span>
                </div>
            </div>
            <div style={{ flex: '1 1 500px' }}>
                <AccordionItem initOpen={true} title="Air Freight Service" desc="As a leader in global air freight forwarding, AMOOKSCO excels in providing tailored transportation, ensuring your urgent cargo hits the skies quickly." />
                <AccordionItem title="Sea Freight Forwarding" desc="Cost-effective FCL and LCL sea freight solutions handling heavy constraints with optimized routing and reliable global partners." />
                <AccordionItem title="Road Freight Forwarding" desc="Cargo is transported securely at some stage of its journey along the world's roads, providing seamless door-to-door delivery." />
            </div>
        </div>
    </SectionWrapper>
);

const TimelineProcess = () => {
    const steps = ["Receive Shipment and Orders", "Processing & Transportation", "Delivery to Destinations"];
    return (
        <SectionWrapper bg="#fff">
            <div style={{ background: 'var(--bg-secondary)', padding: '2rem 4rem', borderRadius: '100px', display: 'flex', justifyContent: 'center', alignItems: 'center', overflowX: 'auto', gap: '3rem', margin: '4rem 0' }}>
                {steps.map((step, i) => (
                    <React.Fragment key={i}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', flexShrink: 0 }}>
                            <div style={{ width: '50px', height: '50px', background: '#fff', color: 'var(--dark-blue)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '800', fontSize: '1.25rem', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)' }}>
                                {i + 1}
                            </div>
                            <span style={{ fontWeight: '700', color: 'var(--dark-blue)', fontSize: '1.1rem' }}>{step}</span>
                        </div>
                        {i < steps.length - 1 && <div style={{ fontSize: '1.5rem', color: 'var(--text-secondary)' }}>&gt;</div>}
                    </React.Fragment>
                ))}
            </div>
        </SectionWrapper>
    );
};

const Testimonials = () => {
    const reviews = [
        {
            text: "AMOOKSCO transformed our supply chain with their forwarding services from China. The cost savings and timely deliveries were impressive. Their team's expertise made importing seamless, and the portal gave us absolute peace of mind.",
            author: "Yayra Godslove",
            role: "CEO of Bags and Bottles"
        },
        {
            text: "The absolute best real-time CBM calculation engine we've used. By combining their global sea freight tracking with instantaneous data, we reduced our global shipment overhead by 22% in a single quarter.",
            author: "Marcus Chen",
            role: "Head of Operations, GlobalTech"
        },
        {
            text: "Exceptional door-to-door delivery. We were initially concerned about shipping fragile electronics across continents, but AMOOKSCO's container monitoring ensured our stock arrived perfectly intact.",
            author: "Elena Rodriguez",
            role: "Supply Chain Manager"
        }
    ];

    const [currentIndex, setCurrentIndex] = useState(0);

    const nextReview = () => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % reviews.length);
    };

    const prevReview = () => {
        setCurrentIndex((prevIndex) => (prevIndex === 0 ? reviews.length - 1 : prevIndex - 1));
    };

    return (
        <section style={{ background: 'var(--dark-blue)', color: '#fff', padding: '10rem 5%', position: 'relative', overflow: 'hidden' }}>
            <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, opacity: 0.15, backgroundImage: 'url("https://images.unsplash.com/photo-1586528116311-ad8ed7c50aab?auto=format&fit=crop&q=80")', backgroundSize: 'cover', backgroundPosition: 'center', backgroundAttachment: 'fixed', zIndex: 0 }}></div>
            <div style={{ maxWidth: '1280px', margin: '0 auto', position: 'relative', zIndex: 1, display: 'flex', flexWrap: 'wrap', gap: '4rem' }}>
                <div style={{ flex: '1 1 500px', position: 'relative' }}>
                    <div style={{ position: 'absolute', top: '-60px', left: '-20px', fontSize: '150px', opacity: 0.1, fontFamily: 'serif', lineHeight: 0.8 }}>“</div>
                    <div className="section-label" style={{ color: 'var(--accent-blue)' }}>TESTIMONIALS</div>
                    <h2 style={{ fontSize: '3.5rem', fontWeight: '800', lineHeight: 1.1, margin: '2rem 0 3rem' }}>Let's read user reviews.</h2>
                    
                    <AnimatePresence mode="wait">
	                        <MotionDiv 
                            key={currentIndex}
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            transition={{ duration: 0.3 }}
                        >
                            <div style={{ fontSize: '1.35rem', lineHeight: '1.8', color: 'rgba(255,255,255,0.9)', marginBottom: '3rem', maxWidth: '600px', minHeight: '150px' }}>
                                "{reviews[currentIndex].text}"
                            </div>
                            <div style={{ fontWeight: '600', fontSize: '1.1rem' }}>
                                {reviews[currentIndex].author}; <span style={{ color: 'var(--accent-blue)', fontWeight: '400' }}>{reviews[currentIndex].role}</span>
                            </div>
	                        </MotionDiv>
                    </AnimatePresence>
                    
                    <div style={{ display: 'flex', gap: '2rem', marginTop: '3rem', alignItems: 'center' }}>
                        <span onClick={prevReview} style={{ cursor: 'pointer', fontSize: '1.5rem', userSelect: 'none', transition: 'var(--transition)' }} onMouseOver={(e)=>e.target.style.color='var(--accent-blue)'} onMouseOut={(e)=>e.target.style.color='#fff'}>&larr;</span>
                        <span style={{ fontWeight: '600' }}>{currentIndex + 1} — {reviews.length}</span>
                        <span onClick={nextReview} style={{ cursor: 'pointer', fontSize: '1.5rem', userSelect: 'none', transition: 'var(--transition)' }} onMouseOver={(e)=>e.target.style.color='var(--accent-blue)'} onMouseOut={(e)=>e.target.style.color='#fff'}>&rarr;</span>
                    </div>
                </div>
            </div>
        </section>
    );
};

const MinimalTracker = () => {
    const [id, setId] = useState('');
    const navigate = useNavigate();

    return (
        <SectionWrapper id="tracking" bg="#fff">
            <div style={{ background: 'var(--bg-secondary)', borderRadius: 'var(--radius-lg)', padding: '5rem 5%', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', border: '1px solid var(--border-color)' }}>
                <h2 style={{ fontSize: '2.5rem', fontWeight: '700', marginBottom: '1rem', color: 'var(--dark-blue)' }}>Track Your Parcel</h2>
                <p style={{ color: 'var(--text-secondary)', marginBottom: '3rem', maxWidth: '500px' }}>Enter your tracking ID to get real-time updates on your shipment status and container routing.</p>
                
                <form onSubmit={(e) => { e.preventDefault(); navigate(`/track?id=${id}`); }} style={{ border: '1px solid var(--border-color)', display: 'flex', width: '100%', maxWidth: '600px', background: '#fff', padding: '0.5rem', borderRadius: '99px' }}>
                    <div style={{ padding: '0 1.5rem', display: 'flex', alignItems: 'center' }}><Search color="var(--text-secondary)" size={20} /></div>
                    <input 
                        type="text" placeholder="AMOOKSCO Tracking ID..." 
                        value={id} onChange={(e) => setId(e.target.value)}
                        style={{ flex: 1, border: 'none', outline: 'none', fontSize: '1.1rem', color: 'var(--dark-blue)' }}
                        required
                    />
                    <button type="submit" className="btn btn-primary" style={{ borderRadius: '99px', padding: '1rem 2.5rem' }}>Track</button>
                </form>
            </div>
        </SectionWrapper>
    );
};

const Community = () => {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [total, setTotal] = useState(0);
    const [dbConnected, setDbConnected] = useState(true);

    const fetchData = async () => {
        setError('');
        setLoading(true);
        try {
            const { data } = await api.get('/public/registrations?role=Customer');
            setTotal(Number(data?.total || 0));
            setDbConnected(data?.dbConnected !== false);
        } catch (err) {
            setError(err.response?.data?.message || 'Could not load community');
            setTotal(0);
            setDbConnected(true);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    return (
        <SectionWrapper bg="var(--bg-secondary)">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: '1rem', marginBottom: '2rem' }}>
                <div>
                    <div className="section-label">COMMUNITY</div>
                    <h2 className="heading-2" style={{ marginBottom: '0.5rem' }}>Recently registered customers</h2>
                    <div className="text-dim">Total customers: <span style={{ fontWeight: 800, color: 'var(--dark-blue)' }}>{total}</span></div>
                </div>
                <button className="btn btn-secondary" onClick={fetchData} disabled={loading} style={{ padding: '0.5rem 0.9rem' }}>
                    {loading ? 'Loading…' : 'Refresh'}
                </button>
            </div>

            {error && <div className="badge badge-error" style={{ marginBottom: '1rem' }}>{error}</div>}

            <div className="glass-card" style={{ padding: '1.5rem' }}>
                {loading ? (
                    <div className="text-dim">Loading…</div>
                ) : (
                    <>
                        {!dbConnected && (
                            <div className="badge badge-warning" style={{ marginBottom: '1rem', display: 'inline-block' }}>
                                Backend database not connected
                            </div>
                        )}
                        <div className="text-dim">
                            Customers registered: <span style={{ fontWeight: 900, color: 'var(--dark-blue)' }}>{total}</span>
                        </div>
                    </>
                )}
            </div>
        </SectionWrapper>
    );
};

const Footer = () => (
    <footer style={{ background: '#0a0f1b', padding: '5rem 5% 2rem', color: '#fff' }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '3rem', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '3rem', marginBottom: '2rem' }}>
            <div>
                <Link to="/" style={{ display: 'inline-flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem', textDecoration: 'none' }}>
                    <img src="/amooksco.jpeg" alt="AMOOKSCO Logo" style={{ height: '70px', width: 'auto', borderRadius: '50%', background: '#fff', padding: '0.25rem' }} />
                    <h2 style={{ margin: 0, color: '#fff', fontSize: '1.5rem', fontWeight: 800, letterSpacing: '-0.02em', lineHeight: 1 }}>AMOOKSCO <span style={{ color: 'var(--accent-blue)', display: 'block', fontSize: '0.9rem', letterSpacing: '0.1em', marginTop: '4px' }}>LOGISTICS</span></h2>
                </Link>
                <p style={{ color: 'rgba(255,255,255,0.6)', lineHeight: '1.7' }}>Delivering fast, globally conscious shipping solutions via modern container management dashboards.</p>
            </div>
            <div>
                <h4 style={{ fontWeight: '600', marginBottom: '1.5rem', color: 'var(--accent-blue)' }}>Our Services</h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', color: 'rgba(255,255,255,0.6)' }}>
                    <span>Air Freight</span>
                    <span>Ocean Freight</span>
                    <span>Road Freight</span>
                    <span>Warehousing</span>
                </div>
            </div>
            <div>
                <h4 style={{ fontWeight: '600', marginBottom: '1.5rem', color: 'var(--accent-blue)' }}>Contact Info</h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', color: 'rgba(255,255,255,0.6)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><Phone size={16}/> +1 555 303 9452</div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><Mail size={16}/> info@amooksco.com</div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><MapPin size={16}/> 123 Global Shipping Lane</div>
                </div>
            </div>
        </div>
        <div style={{ textAlign: 'center', color: 'rgba(255,255,255,0.4)', fontSize: '0.85rem' }}>
            &copy; {new Date().getFullYear()} AMOOKSCO Logistics. All rights reserved.
        </div>
    </footer>
);

const Landing = () => (
	    <div style={{ background: 'var(--bg-primary)', minHeight: '100vh', color: 'var(--text-primary)' }}>
	        <Navbar />
	        <main>
	            <HeroSplit />
	            <ServicesAccordionLayout />
	            <TimelineProcess />
	            <Testimonials />
	            <Community />
	            <MinimalTracker />
	        </main>
	        <Footer />
	    </div>
);

export default Landing;
