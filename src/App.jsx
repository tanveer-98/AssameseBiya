import { useMemo, useState } from 'react';
import {
  ArrowDown, ArrowRight, Check, ChevronDown, Heart, MapPin, Menu, Search,
  ShieldCheck, SlidersHorizontal, Sparkles, Users, X,
} from 'lucide-react';

const profiles = [
  {
    id: 1, name: 'Priyanka', age: 27, city: 'Guwahati', occupation: 'Architect',
    education: 'M.Arch, CEPT University', height: "5'4\"", faith: 'Hindu',
    image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=900&q=85',
    about: 'A curious soul who finds joy in old songs, new cities, and long Sunday breakfasts. Hoping to meet someone kind, grounded, and ready to build a life together.',
  },
  {
    id: 2, name: 'Arjun', age: 29, city: 'Jorhat', occupation: 'Software Engineer',
    education: 'B.Tech, IIT Guwahati', height: "5'10\"", faith: 'Hindu',
    image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=900&q=85',
    about: 'Software engineer by day, amateur guitarist by night. I love exploring Assam, making a great cup of coffee, and spending time with family.',
  },
  {
    id: 3, name: 'Nandita', age: 26, city: 'Dibrugarh', occupation: 'Doctor',
    education: 'MBBS, Assam Medical College', height: "5'3\"", faith: 'Hindu',
    image: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=900&q=85',
    about: 'A doctor with a soft spot for poetry, rainy afternoons, and the smell of tea gardens. Looking for a thoughtful partner and a best friend.',
  },
  {
    id: 4, name: 'Rishav', age: 30, city: 'Bengaluru', occupation: 'Product Designer',
    education: 'M.Des, NID Ahmedabad', height: "5'11\"", faith: 'Hindu',
    image: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=900&q=85',
    about: 'An Assamese at heart, currently building products in Bengaluru. Usually sketching, hiking, or planning my next trip back home.',
  },
  {
    id: 5, name: 'Ananya', age: 28, city: 'Guwahati', occupation: 'Chartered Accountant',
    education: 'CA, ICAI', height: "5'5\"", faith: 'Hindu',
    image: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=900&q=85',
    about: 'Numbers at work, stories after hours. I enjoy discovering little cafés, spending time with my close-knit family, and taking spontaneous road trips.',
  },
  {
    id: 6, name: 'Debojit', age: 31, city: 'Tezpur', occupation: 'Civil Engineer',
    education: 'B.E., Jorhat Engineering College', height: "5'9\"", faith: 'Hindu',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=900&q=85',
    about: 'Home is wherever there is good company and a plate of pitha. I value honesty, laughter, and making the most of ordinary days.',
  },
];

function Brand() {
  return (
    <a className="brand" href="#home" aria-label="Axaam Jibon home">
      <span className="brand-mark">অ</span>
      <span className="brand-name">axaam<span>jibon</span></span>
    </a>
  );
}

function SelectField({ label, value, options, onChange }) {
  return (
    <label className="search-field">
      <span>{label}</span>
      <span className="select-wrap">
        <select value={value} onChange={onChange}>
          {options.map((option) => <option key={option}>{option}</option>)}
        </select>
        <ChevronDown size={15} />
      </span>
    </label>
  );
}

function ProfileCard({ profile, saved, onSave, onView }) {
  return (
    <article className="profile-card">
      <button className="profile-image-button" onClick={onView} aria-label={`View ${profile.name}'s profile`}>
        <img src={profile.image} alt={`${profile.name}, ${profile.age}`} loading="lazy" />
        <span className="verified"><Check size={12} strokeWidth={3} /> Verified</span>
      </button>
      <button
        className={`heart-button ${saved ? 'is-saved' : ''}`}
        onClick={() => onSave(profile.id)}
        aria-label={saved ? 'Remove from saved profiles' : 'Save profile'}
      >
        <Heart size={18} fill={saved ? 'currentColor' : 'none'} />
      </button>
      <button className="profile-info" onClick={onView}>
        <span className="profile-name">{profile.name}, {profile.age}</span>
        <span className="profile-job">{profile.occupation}</span>
        <span className="profile-location"><MapPin size={13} /> {profile.city}, Assam</span>
        <span className="profile-divider" />
        <span className="profile-education">{profile.education}</span>
      </button>
    </article>
  );
}

function Modal({ children, onClose, label }) {
  return (
    <div className="modal-backdrop" onMouseDown={(event) => event.target === event.currentTarget && onClose()}>
      <section className="modal" role="dialog" aria-modal="true" aria-label={label}>
        <button className="modal-close" onClick={onClose} aria-label="Close"><X size={19} /></button>
        {children}
      </section>
    </div>
  );
}

function App() {
  const [gender, setGender] = useState('Bride');
  const [ageRange, setAgeRange] = useState('22 – 30 years');
  const [location, setLocation] = useState('Any location');
  const [saved, setSaved] = useState([]);
  const [modal, setModal] = useState(null);
  const [activeProfile, setActiveProfile] = useState(null);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [searchApplied, setSearchApplied] = useState(false);
  const [showSavedOnly, setShowSavedOnly] = useState(false);
  const [notice, setNotice] = useState('');

  const results = useMemo(() => {
    const [minAge, maxAge] = ageRange.match(/\d+/g).map(Number);
    const matchesGender = (profile) => gender === 'Bride'
      ? ['Priyanka', 'Nandita', 'Ananya'].includes(profile.name)
      : ['Arjun', 'Rishav', 'Debojit'].includes(profile.name);
    return profiles.filter((profile) => matchesGender(profile)
      && profile.age >= minAge && profile.age <= maxAge
      && (location === 'Any location' || profile.city === location)
      && (!showSavedOnly || saved.includes(profile.id)));
  }, [ageRange, gender, location, saved, showSavedOnly]);

  function toggleSaved(id) {
    setSaved((current) => current.includes(id) ? current.filter((item) => item !== id) : [...current, id]);
  }

  function showProfile(profile) {
    setNotice('');
    setActiveProfile(profile);
    setModal('profile');
  }

  function showSignup() {
    setNotice('');
    setModal('signup');
  }

  function handleSignup(event) {
    event.preventDefault();
    setNotice('You’re on the list! We’ll be in touch soon.');
  }

  function scrollToProfiles() {
    document.getElementById('profiles')?.scrollIntoView({ behavior: 'smooth' });
    setMobileNavOpen(false);
  }

  return (
    <div id="home">
      <header className="site-header">
        <div className="header-inner">
          <Brand />
          <button className="mobile-menu" onClick={() => setMobileNavOpen((open) => !open)} aria-label="Toggle menu">
            {mobileNavOpen ? <X size={23} /> : <Menu size={23} />}
          </button>
          <nav className={mobileNavOpen ? 'nav-open' : ''}>
            <a href="#how-it-works" onClick={() => setMobileNavOpen(false)}>How it works</a>
            <a href="#profiles" onClick={scrollToProfiles}>Browse profiles</a>
            <button className="saved-nav" onClick={() => { setShowSavedOnly(true); setMobileNavOpen(false); document.getElementById('profiles')?.scrollIntoView({ behavior: 'smooth' }); }}>
              <Heart size={16} /> Saved {saved.length > 0 && <span className="saved-count">{saved.length}</span>}
            </button>
            <span className="nav-divider" />
            <button className="login-link" onClick={() => setModal('login')}>Log in</button>
            <button className="button button-small" onClick={showSignup}>Join free <ArrowRight size={15} /></button>
          </nav>
        </div>
      </header>

      <main>
        <section className="hero">
          <div className="hero-pattern" aria-hidden="true" />
          <div className="hero-copy">
            <span className="eyebrow"><Sparkles size={14} /> MADE FOR ASSAMESE HEARTS</span>
            <h1>Somewhere,<br />your <em>person</em> is<br />looking for you.</h1>
            <p>Real connections. Shared roots. A beautiful new beginning, right here in Assam.</p>
            <div className="hero-proof">
              <div className="avatar-stack" aria-hidden="true">
                <img src={profiles[0].image} alt="" />
                <img src={profiles[1].image} alt="" />
                <img src={profiles[2].image} alt="" />
                <span>+</span>
              </div>
              <span><strong>2,400+</strong> Assamese singles<br />ready to meet someone real</span>
            </div>
          </div>
          <div className="hero-visual">
            <div className="hero-photo">
              <img src="https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1300&q=90" alt="A couple celebrating their wedding day" />
            </div>
            <div className="floating-note"><span className="note-icon"><Heart size={17} fill="currentColor" /></span><span><strong>Made for meaningful</strong><br />connections</span></div>
            <div className="photo-caption"><span className="caption-dot" /> YOUR STORY STARTS HERE</div>
          </div>
          <div className="hero-bottom"><span>01 — A BETTER WAY TO MEET</span><a href="#search">FIND YOUR MATCH <ArrowDown size={14} /></a></div>
        </section>

        <section className="search-section" id="search">
          <div className="search-heading">
            <div><span className="eyebrow">A GOOD PLACE TO START</span><h2>Who are you hoping to meet?</h2></div>
            <span className="search-helper">A few details help us find your kind of person.</span>
          </div>
          <div className="search-panel">
            <SelectField label="I’m looking for" value={gender} options={['Bride', 'Groom']} onChange={(event) => setGender(event.target.value)} />
            <span className="field-separator" />
            <SelectField label="Age range" value={ageRange} options={['22 – 30 years', '25 – 35 years', '28 – 40 years', '18 – 25 years']} onChange={(event) => setAgeRange(event.target.value)} />
            <span className="field-separator" />
            <SelectField label="Based in" value={location} options={['Any location', 'Guwahati', 'Jorhat', 'Dibrugarh', 'Tezpur', 'Bengaluru']} onChange={(event) => setLocation(event.target.value)} />
            <button className="button search-button" onClick={() => { setSearchApplied(true); setShowSavedOnly(false); scrollToProfiles(); }}>
              <Search size={17} /> Find my matches
            </button>
          </div>
          <div className="search-foot"><span><ShieldCheck size={15} /> Your details stay private, always.</span><button onClick={() => { setGender('Bride'); setAgeRange('22 – 30 years'); setLocation('Any location'); }}>Clear filters</button></div>
        </section>

        <section className="profiles-section" id="profiles">
          <div className="section-heading">
            <div><span className="eyebrow">{showSavedOnly ? 'YOUR SHORTLIST' : searchApplied ? 'YOUR HANDPICKED MATCHES' : 'GOOD PEOPLE, GREAT STORIES'}</span><h2>{showSavedOnly ? 'The ones you saved.' : searchApplied ? 'Your kind of people.' : 'A few lovely people.'}</h2></div>
            <button className="text-link" onClick={() => { setShowSavedOnly(false); setSearchApplied(true); }}>See all profiles <ArrowRight size={16} /></button>
          </div>
          <div className="profile-toolbar">
            <span><strong>{results.length}</strong> profiles to explore</span>
            <button className="filter-button" onClick={() => document.getElementById('search')?.scrollIntoView({ behavior: 'smooth' })}><SlidersHorizontal size={15} /> Filters</button>
          </div>
          {results.length > 0 ? (
            <div className="profile-grid">
              {results.map((profile) => (
                <ProfileCard key={profile.id} profile={profile} saved={saved.includes(profile.id)} onSave={toggleSaved} onView={() => showProfile(profile)} />
              ))}
            </div>
          ) : (
            <div className="empty-state"><Users size={28} /><strong>{showSavedOnly ? 'No saved profiles yet' : 'No profiles just yet'}</strong><span>{showSavedOnly ? 'Tap the heart on a profile to save it for later.' : 'Try widening your age range or choosing another location.'}</span><button className="text-link" onClick={() => { setShowSavedOnly(false); setAgeRange('22 – 30 years'); setLocation('Any location'); }}>Reset search <ArrowRight size={15} /></button></div>
          )}
          <div className="profiles-cta">
            <span>YOUR PERSON IS OUT THERE</span>
            <p>Good things begin with a hello.</p>
            <button className="button button-light" onClick={showSignup}>Create your free profile <ArrowRight size={16} /></button>
          </div>
        </section>

        <section className="how-section" id="how-it-works">
          <div className="how-intro"><span className="eyebrow">THOUGHTFULLY, FROM THE START</span><h2>Less swiping.<br /><em>More meaning.</em></h2><p>Finding your person shouldn't feel like finding a needle in a haystack. We make space for the things that really matter.</p></div>
          <div className="steps">
            <div className="step"><span className="step-number">01</span><div><h3>Tell us your story</h3><p>Share what makes you, you. Your profile is more than a checklist.</p></div></div>
            <div className="step"><span className="step-number">02</span><div><h3>Meet your kind of people</h3><p>Discover genuine Assamese singles who share your values and outlook.</p></div></div>
            <div className="step"><span className="step-number">03</span><div><h3>Start something real</h3><p>When someone feels right, say hello. The rest is your story to write.</p></div></div>
          </div>
        </section>

        <section className="trust-strip"><div><ShieldCheck size={23} /><span><strong>Profiles you can trust</strong><br />Every member is verified by our team.</span></div><div><Heart size={22} /><span><strong>Your privacy comes first</strong><br />You decide who sees your details.</span></div><div><Users size={22} /><span><strong>Rooted in our community</strong><br />Made with care, for Assamese people.</span></div></section>
      </main>

      <footer className="footer"><Brand /><span>Made with care, for the moments that matter.</span><span>© 2025 Axaam Jibon</span></footer>

      {modal === 'profile' && activeProfile && (
        <Modal onClose={() => setModal(null)} label={`${activeProfile.name}'s profile`}>
          <div className="profile-modal">
            <img src={activeProfile.image} alt={activeProfile.name} />
            <div className="modal-profile-content">
              <span className="eyebrow"><span className="caption-dot" /> VERIFIED PROFILE</span>
              <h2>{activeProfile.name}, {activeProfile.age}</h2>
              <p className="modal-subtitle">{activeProfile.occupation} · {activeProfile.city}, Assam</p>
              <div className="profile-facts"><span>{activeProfile.height}</span><span>{activeProfile.faith}</span><span>{activeProfile.education}</span></div>
              <h3>A little about me</h3><p>{activeProfile.about}</p>
              <button className="button modal-action" onClick={() => { setNotice('Interest sent! We’ll let you know if it’s a match.'); }}>{notice || 'Show interest'} <ArrowRight size={16} /></button>
            </div>
          </div>
        </Modal>
      )}

      {modal === 'signup' && (
        <Modal onClose={() => setModal(null)} label="Create your profile">
          <div className="form-modal"><span className="eyebrow">YOUR STORY STARTS HERE</span><h2>Let’s find your person.</h2><p>Join our community — it’s free to get started.</p>
            <form onSubmit={handleSignup}><label>Your name<input required placeholder="What should we call you?" /></label><label>Email address<input required type="email" placeholder="you@example.com" /></label><label>I’m here to find<select defaultValue=""><option value="" disabled>Select one</option><option>A bride</option><option>A groom</option></select></label><button className="button modal-action" type="submit">Create my free profile <ArrowRight size={16} /></button></form>
            {notice && <span className="form-success"><Check size={16} />{notice}</span>}<span className="form-privacy"><ShieldCheck size={14} /> Your information stays private.</span>
          </div>
        </Modal>
      )}

      {modal === 'login' && (
        <Modal onClose={() => setModal(null)} label="Log in">
          <div className="form-modal"><span className="eyebrow">WELCOME BACK</span><h2>Good to see you.</h2><p>Log in to pick up where your story left off.</p>
            <form onSubmit={(event) => { event.preventDefault(); setNotice('Login is coming soon — thanks for your patience!'); }}><label>Email address<input required type="email" placeholder="you@example.com" /></label><label>Password<input required type="password" placeholder="Your password" /></label><button className="button modal-action" type="submit">Log in <ArrowRight size={16} /></button></form>
            {notice && <span className="form-success"><Check size={16} />{notice}</span>}<span className="form-privacy"><ShieldCheck size={14} /> Your information stays private.</span>
          </div>
        </Modal>
      )}
    </div>
  );
}

export default App;
