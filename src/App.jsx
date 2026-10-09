import { useMemo, useState } from 'react';
import {
  ArrowDown, ArrowRight, Check, ChevronDown, Heart, MapPin, Menu, Search,
  ShieldCheck, SlidersHorizontal, Sparkles, Users, X,
} from 'lucide-react';
import {
  clearGuestSaved, clearSession, createPasswordCredentials, loadUserData,
  persistGuestSaved, persistSession, persistUsers, verifyPassword,
} from './userStore.js';
import landingImage from './landingpage.png'
const profiles = [
  {
    id: 1, name: 'Rabina', age: 27, city: 'Nalbari', occupation: 'Teacher',
    education: 'M.Arch, CEPT University', height: "5'4\"", faith: 'Hindu',
    image: 'rabina.png',
    about: 'A curious soul who finds joy in old songs, new cities, and long Sunday breakfasts. Hoping to meet someone kind, grounded, and ready to build a life together.',
  },
  {
    id: 2, name: 'Rimpi', age: 28, city: 'Nalbari', occupation: 'Teacher',
    education: 'Modern English school', height: "5'10\"", faith: 'Hindu',
    image: 'rimpi.png',
    about: 'Teacher by day, amateur guitarist by night. I love exploring Assam, making a great cup of coffee, and spending time with family.',
  },
  {
    id: 3, name: 'Somashree', age: 26, city: 'Bengaluru', occupation: 'MBA Graduate',
    education: 'Institute of public Enterprise', height: "5'3\"", faith: 'Hindu',
    image: 'somashree.png',
    about: 'A MBA Student with a soft spot for poetry, rainy afternoons, and the smell of tea gardens. Looking for a thoughtful partner and a best friend.',
  },
  {
    id: 4, name: 'Abhinav', age: 28, city: 'Bengaluru', occupation: 'Senior software Developer',
    education: 'B.Tech NIT Silchar', height: "5'11\"", faith: 'Hindu',
    image: 'abhinav.png',
    about: 'An Assamese at heart, currently building products in Bengaluru. Usually Building software , hiking, or planning my next trip back home.',
  }
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
  const [initialUserData] = useState(() => {
    try {
      return { ...loadUserData(), error: '' };
    } catch (error) {
      return { users: [], user: null, saved: [], error: error.message };
    }
  });
  const [users, setUsers] = useState(initialUserData.users);
  const [currentUser, setCurrentUser] = useState(initialUserData.user);
  const [gender, setGender] = useState(initialUserData.user?.lookingFor === 'A groom' ? 'Groom' : 'Bride');
  const [ageRange, setAgeRange] = useState('22 – 30 years');
  const [location, setLocation] = useState('Any location');
  const [saved, setSaved] = useState(initialUserData.saved);
  const [modal, setModal] = useState(null);
  const [activeProfile, setActiveProfile] = useState(null);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [searchApplied, setSearchApplied] = useState(false);
  const [showSavedOnly, setShowSavedOnly] = useState(false);
  const [notice, setNotice] = useState('');
  const [storageError, setStorageError] = useState(initialUserData.error);
  const [submitting, setSubmitting] = useState(false);

  const results = useMemo(() => {
    const [minAge, maxAge] = ageRange.match(/\d+/g).map(Number);
    const matchesGender = (profile) => gender === 'Bride'
      ? ['Rimpi', 'Somashree','Rabina'].includes(profile.name)
      : ['Abhinav'].includes(profile.name);
    return profiles.filter((profile) => matchesGender(profile)
      && profile.age >= minAge && profile.age <= maxAge
      && (location === 'Any location' || profile.city === location)
      && (!showSavedOnly || saved.includes(profile.id)));
  }, [ageRange, gender, location, saved, showSavedOnly]);

  function toggleSaved(id) {
    const nextSaved = saved.includes(id) ? saved.filter((item) => item !== id) : [...saved, id];
    try {
      if (currentUser) {
        const updatedUser = { ...currentUser, savedProfileIds: nextSaved };
        const nextUsers = users.map((user) => user.email === currentUser.email ? updatedUser : user);
        persistUsers(nextUsers);
        setUsers(nextUsers);
        setCurrentUser(updatedUser);
      } else {
        persistGuestSaved(nextSaved);
      }
      setSaved(nextSaved);
      setStorageError('');
    } catch (error) {
      setStorageError(error.message);
    }
  }

  function showProfile(profile) {
    setNotice('');
    setActiveProfile(profile);
    setModal('profile');
  }

  function showSignup() {
    setNotice('');
    setStorageError('');
    setModal('signup');
  }

  function showLogin() {
    setNotice('');
    setStorageError('');
    setModal('login');
  }

  function openAccount() {
    setNotice('');
    setStorageError('');
    setModal('account');
  }

  function completeLogin(user) {
    persistSession(user.email);
    setCurrentUser(user);
    setSaved(user.savedProfileIds);
    setShowSavedOnly(false);
    setStorageError('');
    setNotice('');
    setModal(null);
  }

  async function handleSignup(event) {
    event.preventDefault();
    if (submitting) return;
    if (initialUserData.error) {
      setStorageError(initialUserData.error);
      return;
    }
    setSubmitting(true);
    setNotice('');
    setStorageError('');
    const form = new FormData(event.currentTarget);
    const name = String(form.get('name')).trim();
    const email = String(form.get('email')).trim().toLowerCase();
    const lookingFor = String(form.get('lookingFor'));
    const password = String(form.get('password'));

    try {
      if (users.some((user) => user.email === email)) {
        setStorageError('An account with this email already exists. Log in instead.');
        return;
      }
      const credentials = await createPasswordCredentials(password);
      const newUser = {
        id: crypto.randomUUID(),
        name,
        email,
        lookingFor,
        savedProfileIds: [...new Set(saved)],
        createdAt: new Date().toISOString(),
        ...credentials,
      };
      const nextUsers = [...users, newUser];
      persistUsers(nextUsers);
      persistSession(email);
      clearGuestSaved();
      setUsers(nextUsers);
      setCurrentUser(newUser);
      setSaved(newUser.savedProfileIds);
      setGender(lookingFor === 'A bride' ? 'Bride' : 'Groom');
      setShowSavedOnly(false);
      setModal(null);
    } catch (error) {
      setStorageError(error.message || 'We couldn’t create your account. Please try again.');
    } finally {
      setSubmitting(false);
    }
  }

  async function handleLogin(event) {
    event.preventDefault();
    if (submitting) return;
    if (initialUserData.error) {
      setStorageError(initialUserData.error);
      return;
    }
    setSubmitting(true);
    setNotice('');
    setStorageError('');
    const form = new FormData(event.currentTarget);
    const email = String(form.get('email')).trim().toLowerCase();
    const password = String(form.get('password'));

    try {
      const user = users.find((entry) => entry.email === email);
      if (!user || !(await verifyPassword(password, user))) {
        setStorageError('Email or password is incorrect.');
        return;
      }
      completeLogin(user);
      setGender(user.lookingFor === 'A bride' ? 'Bride' : 'Groom');
    } catch (error) {
      setStorageError(error.message || 'We couldn’t log you in. Please try again.');
    } finally {
      setSubmitting(false);
    }
  }

  function handleAccountUpdate(event) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const updatedUser = {
      ...currentUser,
      name: String(form.get('name')).trim(),
      lookingFor: String(form.get('lookingFor')),
    };
    const nextUsers = users.map((user) => user.email === currentUser.email ? updatedUser : user);
    try {
      persistUsers(nextUsers);
      setUsers(nextUsers);
      setCurrentUser(updatedUser);
      setGender(updatedUser.lookingFor === 'A bride' ? 'Bride' : 'Groom');
      setNotice('Your profile details have been updated.');
      setStorageError('');
    } catch (error) {
      setStorageError(error.message);
    }
  }

  function handleLogout() {
    try {
      clearSession();
      const guestSaved = [];
      persistGuestSaved(guestSaved);
      setCurrentUser(null);
      setSaved(guestSaved);
      setShowSavedOnly(false);
      setModal(null);
      setNotice('');
      setStorageError('');
    } catch (error) {
      setStorageError(error.message);
    }
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
            {currentUser ? (
              <>
                <button className="login-link account-link" onClick={openAccount}>{currentUser.name}</button>
                <button className="button button-small" onClick={handleLogout}>Log out</button>
              </>
            ) : (
              <>
                <button className="login-link" onClick={showLogin}>Log in</button>
                <button className="button button-small" onClick={showSignup}>Join free <ArrowRight size={15} /></button>
              </>
            )}
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
              <img src={landingImage} alt="A couple celebrating their wedding day" />
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
          <div className="search-foot"><span><ShieldCheck size={15} /> Saved in this browser, not sent to a server.</span><button onClick={() => { setGender('Bride'); setAgeRange('22 – 30 years'); setLocation('Any location'); }}>Clear filters</button></div>
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
            <form onSubmit={handleSignup}><label>Your name<input name="name" required maxLength={80} autoComplete="name" placeholder="What should we call you?" /></label><label>Email address<input name="email" required type="email" autoComplete="email" placeholder="you@example.com" /></label><label>I’m here to find<select name="lookingFor" defaultValue={gender === 'Bride' ? 'A bride' : 'A groom'}><option>A bride</option><option>A groom</option></select></label><label>Password<input name="password" required type="password" minLength={8} autoComplete="new-password" placeholder="At least 8 characters" /></label><button className="button modal-action" type="submit" disabled={submitting}>{submitting ? 'Creating account…' : 'Create my free profile'} {!submitting && <ArrowRight size={16} />}</button></form>
            {storageError && <span className="form-error" role="alert">{storageError}</span>}
            <span className="form-privacy"><ShieldCheck size={14} /> Your profile and saved matches stay in this browser.</span>
            <p className="auth-switch">Already a member? <button onClick={showLogin}>Log in</button></p>
          </div>
        </Modal>
      )}

      {modal === 'login' && (
        <Modal onClose={() => setModal(null)} label="Log in">
          <div className="form-modal"><span className="eyebrow">WELCOME BACK</span><h2>Good to see you.</h2><p>Log in to pick up where your story left off.</p>
            <form onSubmit={handleLogin}><label>Email address<input name="email" required type="email" autoComplete="email" placeholder="you@example.com" /></label><label>Password<input name="password" required type="password" autoComplete="current-password" placeholder="Your password" /></label><button className="button modal-action" type="submit" disabled={submitting}>{submitting ? 'Logging in…' : 'Log in'} {!submitting && <ArrowRight size={16} />}</button></form>
            {storageError && <span className="form-error" role="alert">{storageError}</span>}
            <span className="form-privacy"><ShieldCheck size={14} /> Your account and saved matches stay in this browser.</span>
            <p className="auth-switch">New to Axaam Jibon? <button onClick={showSignup}>Join free</button></p>
          </div>
        </Modal>
      )}

      {modal === 'account' && currentUser && (
        <Modal onClose={() => setModal(null)} label="Your account">
          <div className="form-modal">
            <span className="eyebrow">YOUR AXAAM JIBON ACCOUNT</span><h2>Your profile.</h2>
            <p>Update your details and keep track of the profiles you’ve saved.</p>
            <div className="account-stats"><span><strong>{saved.length}</strong> saved profiles</span><span><strong>{new Date(currentUser.createdAt).toLocaleDateString()}</strong> joined</span></div>
            <form onSubmit={handleAccountUpdate}>
              <label>Your name<input name="name" required maxLength={80} defaultValue={currentUser.name} /></label>
              <label>Email address<input value={currentUser.email} readOnly /></label>
              <label>I’m here to find<select name="lookingFor" defaultValue={currentUser.lookingFor}><option>A bride</option><option>A groom</option></select></label>
              <button className="button modal-action" type="submit">Save profile details <Check size={16} /></button>
            </form>
            {notice && <span className="form-success"><Check size={16} />{notice}</span>}
            {storageError && <span className="form-error" role="alert">{storageError}</span>}
            <button className="logout-button" onClick={handleLogout}>Log out of this browser</button>
          </div>
        </Modal>
      )}
    </div>
  );
}

export default App;
