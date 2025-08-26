// Navbar scroll background toggle
const nav = document.getElementById('siteNav');
const handleScroll = () => {
	if(window.scrollY > 10) nav.classList.add('nav--scrolled');
	else nav.classList.remove('nav--scrolled');
};
window.addEventListener('scroll', handleScroll, { passive:true });

// Parallax for hero slides
const hero = document.getElementById('hero');
function heroParallax(){
	if(!hero) return;
	const rect = hero.getBoundingClientRect();
	// Only apply while hero in view (top within viewport height)
	const visible = rect.top < window.innerHeight && rect.bottom > 0;
	if(!visible) return;
	const progress = Math.min(Math.max(-rect.top / (rect.height || 1), 0), 1); // 0 -> 1
	// Move background slightly (e.g., 40px range)
	const offset = progress * 40; // px
	hero.querySelectorAll('.hero__slide').forEach(slide => {
		slide.style.setProperty('--y', `${offset * 0.6}px`); // dampen for subtle effect
	});
}
window.addEventListener('scroll', heroParallax, { passive:true });
heroParallax();

// Mobile nav toggle
const navToggle = document.getElementById('navToggle');
const navMenu = document.getElementById('mainMenu');
const navSearchForm = document.getElementById('navSearchForm');
const navSearchInput = document.getElementById('navSearchInput');
if(navToggle && navMenu){
	navToggle.addEventListener('click', () => {
		const expanded = navToggle.getAttribute('aria-expanded') === 'true';
		const next = !expanded;
		navToggle.setAttribute('aria-expanded', String(next));
		navMenu.classList.toggle('nav__menu--open', next);
		navMenu.setAttribute('aria-hidden', String(!next));
		document.body.classList.toggle('nav-open', next);
	});
	// Close on resize up
	window.addEventListener('resize', () => {
		if(window.innerWidth > 960 && navToggle.getAttribute('aria-expanded') === 'true'){
			navToggle.setAttribute('aria-expanded','false');
			navMenu.classList.remove('nav__menu--open');
			navMenu.setAttribute('aria-hidden','true');
			document.body.classList.remove('nav-open');
		}
	});
}

// Dropdown toggles
const dropdownButtons = document.querySelectorAll('.nav__link--toggle');
function closeAllDropdowns(except){
	dropdownButtons.forEach(btn => {
		if(btn !== except){
			btn.setAttribute('aria-expanded','false');
			btn.parentElement?.classList.remove('nav__item--open');
		}
	});
}
dropdownButtons.forEach(btn => {
	btn.addEventListener('click', e => {
		const expanded = btn.getAttribute('aria-expanded') === 'true';
		if(!expanded) {
			closeAllDropdowns(btn);
			// Also close notifications when opening dropdowns
			if(typeof closeAllNotifications === 'function') closeAllNotifications();
		} else {
			closeAllDropdowns();
		}
		btn.setAttribute('aria-expanded', String(!expanded));
		btn.parentElement?.classList.toggle('nav__item--open', !expanded);
	});
});
document.addEventListener('click', e => {
	if(!e.target.closest('.nav__item--has-children')) closeAllDropdowns();
});
document.addEventListener('keydown', e => { if(e.key === 'Escape') closeAllDropdowns(); });

// Modal search functionality
const searchBtn = document.getElementById('globalSearchBtn');
const searchModal = document.getElementById('navSearchForm');
const searchInput = document.getElementById('navSearchInput');
const searchCloseBtn = document.getElementById('searchCloseBtn');

function openSearchModal() {
	if (searchModal) {
		searchModal.classList.add('nav__search--open');
		document.body.style.overflow = 'hidden';
		// Close other modals/dropdowns
		closeAllDropdowns();
		if (typeof closeAllNotifications === 'function') closeAllNotifications();
		// Focus the input after animation
		setTimeout(() => {
			if (searchInput) searchInput.focus();
		}, 100);
	}
}

function closeSearchModal() {
	if (searchModal) {
		searchModal.classList.remove('nav__search--open');
		document.body.style.overflow = '';
		if (searchInput) {
			searchInput.blur();
			searchInput.value = '';
		}
	}
}

if (searchBtn && searchModal && searchInput) {
	// Open search modal when search button clicked
	searchBtn.addEventListener('click', (e) => {
		e.preventDefault();
		openSearchModal();
	});

	// Close button functionality
	if (searchCloseBtn) {
		searchCloseBtn.addEventListener('click', (e) => {
			e.preventDefault();
			closeSearchModal();
		});
	}

	// Handle search form submission
	searchModal.addEventListener('submit', (e) => {
		e.preventDefault();
		const query = searchInput.value.trim();
		if (query) {
			console.log('Searching for:', query);
			// Add your search handling logic here
			// For now, just close the modal
			closeSearchModal();
		}
	});

	// Close modal when clicking outside or pressing Escape
	searchModal.addEventListener('click', (e) => {
		if (e.target === searchModal) {
			closeSearchModal();
		}
	});

	document.addEventListener('keydown', (e) => {
		if (e.key === 'Escape' && searchModal.classList.contains('nav__search--open')) {
			closeSearchModal();
		}
	});
}

// ===============================
// Loading Screen Functionality
// ===============================

const loadingScreen = document.getElementById('loadingScreen');
const loadingText = document.getElementById('loadingText');
const loadingProgressBar = document.getElementById('loadingProgressBar');

// Loading messages for different scenarios
const loadingMessages = {
	default: ['Loading...', 'Please wait...', 'Almost ready...'],
	movies: ['Loading Movies...', 'Fetching latest films...', 'Preparing your entertainment...'],
	celebrities: ['Loading Celebrities...', 'Getting star information...', 'Preparing profiles...'],
	profile: ['Loading Profile...', 'Getting your data...', 'Setting up your account...'],
	pricing: ['Loading Pricing Plans...', 'Fetching subscription options...', 'Preparing plans...'],
	search: ['Searching...', 'Finding results...', 'Almost there...']
};

// Show loading screen
function showLoading(type = 'default', duration = 2000) {
	if (!loadingScreen) return;
	
	loadingScreen.classList.add('loading--active');
	document.body.style.overflow = 'hidden';
	
	const messages = loadingMessages[type] || loadingMessages.default;
	let messageIndex = 0;
	let progress = 0;
	
	// Update loading text
	if (loadingText) {
		loadingText.textContent = messages[messageIndex];
	}
	
	// Reset progress bar
	if (loadingProgressBar) {
		loadingProgressBar.style.width = '0%';
	}
	
	// Simulate progress
	const progressInterval = setInterval(() => {
		progress += Math.random() * 15 + 5; // Random increment between 5-20%
		if (progress > 95) progress = 95;
		
		if (loadingProgressBar) {
			loadingProgressBar.style.width = progress + '%';
		}
		
		// Change text periodically
		if (progress > 30 && messageIndex === 0) {
			messageIndex = 1;
			if (loadingText && messages[messageIndex]) {
				loadingText.textContent = messages[messageIndex];
			}
		} else if (progress > 70 && messageIndex === 1) {
			messageIndex = 2;
			if (loadingText && messages[messageIndex]) {
				loadingText.textContent = messages[messageIndex];
			}
		}
	}, 100);
	
	// Complete loading after duration
	setTimeout(() => {
		clearInterval(progressInterval);
		if (loadingProgressBar) {
			loadingProgressBar.style.width = '100%';
		}
		
		setTimeout(() => {
			hideLoading();
		}, 300);
	}, duration);
}

// Hide loading screen
function hideLoading() {
	if (!loadingScreen) return;
	
	loadingScreen.classList.remove('loading--active');
	document.body.style.overflow = '';
	
	// Reset for next use
	setTimeout(() => {
		if (loadingProgressBar) {
			loadingProgressBar.style.width = '0%';
		}
		if (loadingText) {
			loadingText.textContent = 'Loading...';
		}
	}, 400);
}

// Show page transition loading
function showPageTransitionLoading() {
	if (!loadingScreen) return;
	
	loadingScreen.classList.add('loading--active', 'loading--page-transition');
	document.body.style.overflow = 'hidden';
}

// Auto-show loading on page load
document.addEventListener('DOMContentLoaded', () => {
	// Determine loading type based on current page
	const currentPage = window.location.pathname;
	let loadingType = 'default';
	let loadingDuration = 1500;
	
	if (currentPage.includes('movie-list') || currentPage.includes('movie-detail')) {
		loadingType = 'movies';
		loadingDuration = 2000;
	} else if (currentPage.includes('celebrities')) {
		loadingType = 'celebrities';
		loadingDuration = 1800;
	} else if (currentPage.includes('profile')) {
		loadingType = 'profile';
		loadingDuration = 1600;
	} else if (currentPage.includes('pricing')) {
		loadingType = 'pricing';
		loadingDuration = 1700;
	}
	
	// Show loading screen on page load
	showLoading(loadingType, loadingDuration);
});

// Add loading for all internal navigation links
document.addEventListener('click', (e) => {
	const link = e.target.closest('a[href]');
	if (link && link.href) {
		const url = new URL(link.href);
		const currentDomain = window.location.hostname;
		
		// Only show loading for internal links (same domain)
		if (url.hostname === currentDomain && !link.href.includes('#')) {
			e.preventDefault();
			showPageTransitionLoading();
			
			// Navigate after a short delay
			setTimeout(() => {
				window.location.href = link.href;
			}, 600);
		}
	}
});

// Add loading for form submissions
document.addEventListener('submit', (e) => {
	const form = e.target;
	if (form && !form.hasAttribute('data-no-loading')) {
		showLoading('default', 2500);
	}
});

// Enhanced search functionality with loading
if (searchBtn && searchModal && searchInput) {
	// Override the existing search submit handler
	searchModal.addEventListener('submit', (e) => {
		e.preventDefault();
		const query = searchInput.value.trim();
		if (query) {
			showLoading('search', 1500);
			console.log('Searching for:', query);
			// Add your search handling logic here
			// Close search modal after loading
			setTimeout(() => {
				closeSearchModal();
			}, 1500);
		}
	});
}

// Add loading for button clicks that trigger actions
function addLoadingToButton(buttonSelector, loadingType = 'default', duration = 2000) {
	const buttons = document.querySelectorAll(buttonSelector);
	buttons.forEach(button => {
		button.addEventListener('click', (e) => {
			// Don't add loading to links or buttons that already prevent default
			if (button.tagName === 'A' || button.hasAttribute('data-no-loading')) {
				return;
			}
			showLoading(loadingType, duration);
		});
	});
}

// Add loading to common buttons
document.addEventListener('DOMContentLoaded', () => {
	// Add loading to pricing buttons
	addLoadingToButton('.pricing__plan-button, .price-btn', 'default', 2000);
	
	// Add loading to movie cards and buttons
	addLoadingToButton('.movie-card, .card, .hero__search-btn', 'movies', 1500);
	
	// Add loading to profile form submissions
	addLoadingToButton('.profile-btn--primary', 'profile', 2500);
	
	// Add loading to newsletter subscription
	addLoadingToButton('.newsletter__button', 'default', 1500);
	
	// Add loading to login/signup buttons
	addLoadingToButton('.nav__login-btn, .modal__submit', 'default', 2000);
});

// Window load event to ensure everything is ready
window.addEventListener('load', () => {
	// Hide loading screen if it's still visible after everything loads
	setTimeout(() => {
		if (loadingScreen && loadingScreen.classList.contains('loading--active')) {
			hideLoading();
		}
	}, 100);
});

// Handle back/forward browser navigation
window.addEventListener('popstate', () => {
	showLoading('default', 800);
});

// ===============================
// Notification Dropdown
// ===============================
const notificationBtns = document.querySelectorAll('.nav__icon-btn--notify');

// Sample notification data
const notificationData = [
	{
		id: 1,
		title: 'New Movie Added',
		message: 'Spider-Man: No Way Home is now available to watch',
		time: '2 hours ago',
		icon: 'play',
		unread: true
	},
	{
		id: 2,
		title: 'Watchlist Update',
		message: 'Your favorite movie "The Batman" has been updated',
		time: '1 day ago',
		icon: 'heart',
		unread: true
	},
	{
		id: 3,
		title: 'Subscription Renewal',
		message: 'Your premium subscription will expire in 3 days',
		time: '2 days ago',
		icon: 'star',
		unread: false
	},
	{
		id: 4,
		title: 'New Episode Available',
		message: 'Stranger Things Season 5 Episode 1 is now live',
		time: '3 days ago',
		icon: 'tv',
		unread: false
	}
];

function getIconSVG(iconType) {
	const icons = {
		play: '<path d="M8 5v14l11-7z" fill="currentColor"/>',
		heart: '<path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" fill="currentColor"/>',
		star: '<polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26" fill="currentColor"/>',
		tv: '<rect x="2" y="3" width="20" height="14" rx="2" ry="2" fill="currentColor"/><line x1="8" y1="21" x2="16" y2="21" stroke="currentColor" stroke-width="2"/><line x1="12" y1="17" x2="12" y2="21" stroke="currentColor" stroke-width="2"/>'
	};
	return icons[iconType] || icons.play;
}

function createNotificationHTML() {
	const unreadCount = notificationData.filter(n => n.unread).length;
	
	return `
		<div class="nav__notifications">
			<div class="nav__notifications-header">
				<h3 class="nav__notifications-title">Notifications</h3>
				<button class="nav__notifications-clear" onclick="clearAllNotifications()">Mark all read</button>
			</div>
			<div class="nav__notifications-list">
				${notificationData.map(notification => `
					<div class="nav__notification-item ${notification.unread ? 'nav__notification-item--unread' : ''}" data-id="${notification.id}">
						<div class="nav__notification-content">
							<div class="nav__notification-icon">
								<svg viewBox="0 0 24 24">${getIconSVG(notification.icon)}</svg>
							</div>
							<div class="nav__notification-text">
								<h4 class="nav__notification-title">${notification.title}</h4>
								<p class="nav__notification-message">${notification.message}</p>
								<span class="nav__notification-time">${notification.time}</span>
							</div>
						</div>
					</div>
				`).join('')}
			</div>
			<div class="nav__notifications-footer">
				<a href="#" class="nav__notifications-view-all">View all notifications</a>
			</div>
		</div>
	`;
}

function updateNotificationBadge() {
	const unreadCount = notificationData.filter(n => n.unread).length;
	notificationBtns.forEach(btn => {
		const badge = btn.querySelector('.nav__badge');
		if (badge) {
			badge.textContent = unreadCount;
			badge.style.display = unreadCount > 0 ? 'block' : 'none';
		}
	});
}

function closeAllNotifications() {
	notificationBtns.forEach(btn => {
		btn.classList.remove('nav__icon-btn--open');
	});
}

function clearAllNotifications() {
	notificationData.forEach(n => n.unread = false);
	updateNotificationBadge();
	// Re-render notifications
	notificationBtns.forEach(btn => {
		const existingDropdown = btn.querySelector('.nav__notifications');
		if (existingDropdown) {
			existingDropdown.remove();
		}
		btn.insertAdjacentHTML('beforeend', createNotificationHTML());
		bindNotificationEvents(btn);
	});
}

function bindNotificationEvents(btn) {
	const notificationItems = btn.querySelectorAll('.nav__notification-item');
	notificationItems.forEach(item => {
		item.addEventListener('click', () => {
			const id = parseInt(item.dataset.id);
			const notification = notificationData.find(n => n.id === id);
			if (notification && notification.unread) {
				notification.unread = false;
				item.classList.remove('nav__notification-item--unread');
				updateNotificationBadge();
			}
			closeAllNotifications();
		});
	});
}

// Initialize notification dropdowns
notificationBtns.forEach(btn => {
	// Add notification dropdown HTML
	btn.insertAdjacentHTML('beforeend', createNotificationHTML());
	
	// Bind events
	bindNotificationEvents(btn);
	
	// Toggle dropdown on button click
	btn.addEventListener('click', (e) => {
		e.preventDefault();
		e.stopPropagation();
		
		const isOpen = btn.classList.contains('nav__icon-btn--open');
		
		// Close all other dropdowns and notifications
		closeAllDropdowns();
		closeAllNotifications();
		
		// Toggle this notification dropdown
		if (!isOpen) {
			btn.classList.add('nav__icon-btn--open');
		}
	});
});

// Close notifications when clicking outside
document.addEventListener('click', (e) => {
	if (!e.target.closest('.nav__icon-btn--notify')) {
		closeAllNotifications();
	}
});

// Close notifications on escape key
document.addEventListener('keydown', (e) => {
	if (e.key === 'Escape') {
		closeAllNotifications();
	}
});

// Update initial badge count
updateNotificationBadge();

// Hero slider
const slidesContainer = document.getElementById('heroSlides');
const dotsContainer = document.getElementById('heroDots');
let slideIndex = 0;
let slideTimer;

function goToSlide(idx){
	const slides = slidesContainer?.querySelectorAll('.hero__slide');
	const dots = dotsContainer?.querySelectorAll('.hero__dot');
	if(!slides || !dots) return;
	slideIndex = (idx + slides.length) % slides.length;
	slides.forEach(s => s.classList.remove('hero__slide--active'));
	dots.forEach(d => { d.classList.remove('hero__dot--active'); d.setAttribute('aria-selected','false'); });
	slides[slideIndex].classList.add('hero__slide--active');
	dots[slideIndex].classList.add('hero__dot--active');
	dots[slideIndex].setAttribute('aria-selected','true');
}

function nextSlide(){ goToSlide(slideIndex + 1); }

function startAuto(){
	clearInterval(slideTimer);
	slideTimer = setInterval(nextSlide, 7000);
}

if(dotsContainer){
	dotsContainer.addEventListener('click', (e) => {
		const btn = e.target.closest('.hero__dot');
		if(!btn) return; 
		const s = parseInt(btn.dataset.slide || '0',10);
		goToSlide(s);
		startAuto();
	});
}

// Kick off
goToSlide(0); startAuto();

// ===============================
// Video modal (Upcoming section)
// ===============================
const videoModal = document.getElementById('videoModal');
const videoFrame = document.getElementById('videoFrame');
const videoClose = document.getElementById('videoModalClose');
function openVideo(id){
	if(!videoModal || !videoFrame) return;
	videoFrame.src = `https://www.youtube.com/embed/${id}?autoplay=1&rel=0`;
	videoModal.hidden = false;
	requestAnimationFrame(()=> videoModal.classList.add('video-modal--open'));
	document.body.style.overflow = 'hidden';
	videoClose?.focus();
}
function closeVideo(){
	if(!videoModal || !videoFrame) return;
	videoModal.classList.remove('video-modal--open');
	setTimeout(()=>{ videoModal.hidden = true; videoFrame.src=''; document.body.style.overflow=''; }, 260);
}
document.addEventListener('click', e => {
	const trigger = e.target.closest('[data-video-trigger]');
	if(trigger){
		const parent = trigger.closest('[data-video]');
		const id = parent?.getAttribute('data-video');
		if(id) openVideo(id);
	} else {
		const card = e.target.closest('.upcoming__featured, .upcoming__card');
		if(card && card.hasAttribute('data-video')) openVideo(card.getAttribute('data-video'));
	}
	// Handle play buttons for catalog and TV shows
	const playButton = e.target.closest('.card__play, .tv-card__play');
	if(playButton){
		const card = playButton.closest('[data-video]');
		const videoId = card?.getAttribute('data-video');
		if(videoId) {
			e.preventDefault();
			openVideo(videoId);
		}
	}
});
videoModal?.addEventListener('click', e => { if(e.target === videoModal) closeVideo(); });
videoClose?.addEventListener('click', closeVideo);
document.addEventListener('keydown', e => { if(e.key === 'Escape') closeVideo(); });

// ===============================
// Section background detachment effect
// ===============================
const detachSections = [
	{ el: document.querySelector('.upcoming'), varName: '--upcoming-shift', ratio: 0.3 }
];
function updateDetach(){
	const scrollY = window.scrollY;
	detachSections.forEach(s => {
		if(!s.el) return;
		const rect = s.el.getBoundingClientRect();
		// base offset equals page scroll amount scaled but clamped while section is near viewport
		const inRange = rect.top < window.innerHeight && rect.bottom > 0;
		if(!inRange) return;
		const base = scrollY * s.ratio;
		s.el.style.setProperty(s.varName, `${base * -0.05}px`); // subtle upward counter shift
	});
}
window.addEventListener('scroll', updateDetach, { passive:true });
window.addEventListener('resize', updateDetach);
updateDetach();

// ===============================
// TV Shows horizontal slider (4 visible like swiper)
// ===============================
(function(){
	const track = document.getElementById('tvTrack');
	if(!track) return;
	const prevBtn = document.getElementById('tvPrev');
	const nextBtn = document.getElementById('tvNext');
	const dotsWrap = document.getElementById('tvDots');
	const cards = Array.from(track.children);
	let index = 0; // page index

	function visibleCount(){
		if(window.innerWidth >= 1024) return 4;
		if(window.innerWidth >= 768) return 3;
		if(window.innerWidth >= 480) return 2;
		return 1;
	}

	function pages(){
		return Math.max(1, Math.ceil(cards.length / visibleCount()));
	}

	function updateDots(){
		if(!dotsWrap) return;
		const p = pages();
		if(dotsWrap.childElementCount !== p){
			dotsWrap.innerHTML = '';
			for(let i=0;i<p;i++){
				const btn = document.createElement('button');
				btn.className = 'tv__dot' + (i===index ? ' tv__dot--active':'' );
				btn.type='button';
				btn.setAttribute('aria-label', `Go to set ${i+1}`);
				btn.dataset.index = i;
				dotsWrap.appendChild(btn);
			}
		} else {
			[...dotsWrap.children].forEach((d,i)=> d.classList.toggle('tv__dot--active', i===index));
		}
	}

	function clampIndex(){
		const max = pages()-1;
		if(index < 0) index = max; // loop backwards
		if(index > max) index = 0;  // loop forwards
	}

	function update(){
		clampIndex();
		const vc = visibleCount();
		const cardWidth = cards[0].getBoundingClientRect().width + parseFloat(getComputedStyle(track).gap || 0);
		const offset = index * cardWidth * vc;
		track.style.transform = `translateX(${-offset}px)`;
		updateDots();
		// Disable state (even though looping) for accessibility feedback
		if(prevBtn) prevBtn.disabled = false;
		if(nextBtn) nextBtn.disabled = false;
	}

	function go(dir){ index += dir; update(); }

	prevBtn?.addEventListener('click', ()=> go(-1));
	nextBtn?.addEventListener('click', ()=> go(1));
	dotsWrap?.addEventListener('click', e => {
		const btn = e.target.closest('.tv__dot');
		if(!btn) return;
		index = parseInt(btn.dataset.index,10) || 0;
		update();
	});

	let resizeTimer;
	window.addEventListener('resize', ()=>{ clearTimeout(resizeTimer); resizeTimer = setTimeout(()=>{ index = 0; update(); }, 120); });

	// Autoplay
	let autoTimer; const AUTO_MS = 6000;
	function startAuto(){ clearInterval(autoTimer); autoTimer = setInterval(()=>{ index++; update(); }, AUTO_MS); }
	function stopAuto(){ clearInterval(autoTimer); }
	track.addEventListener('pointerenter', stopAuto); track.addEventListener('pointerleave', startAuto);
	track.addEventListener('focusin', stopAuto); track.addEventListener('focusout', startAuto);

	update();
	startAuto();
})();

// ===============================
// Catalog horizontal slider (matching TV Shows functionality)
// ===============================
(function(){
	const track = document.getElementById('catalogTrack');
	if(!track) return;
	const prevBtn = document.getElementById('catalogPrev');
	const nextBtn = document.getElementById('catalogNext');
	const cards = Array.from(track.children);
	let index = 0; // page index

	function visibleCount(){
		if(window.innerWidth >= 1024) return 4;
		if(window.innerWidth >= 768) return 3;
		if(window.innerWidth >= 480) return 2;
		return 1;
	}

	function pages(){
		return Math.max(1, Math.ceil(cards.length / visibleCount()));
	}

	function clampIndex(){
		const max = pages()-1;
		if(index < 0) index = max; // loop backwards
		if(index > max) index = 0;  // loop forwards
	}

	function update(){
		clampIndex();
		const vc = visibleCount();
		const cardWidth = cards[0].getBoundingClientRect().width + parseFloat(getComputedStyle(track).gap || 0);
		const offset = index * cardWidth * vc;
		track.style.transform = `translateX(${-offset}px)`;
		// Disable state (even though looping) for accessibility feedback
		if(prevBtn) prevBtn.disabled = false;
		if(nextBtn) nextBtn.disabled = false;
	}

	function go(dir){ index += dir; update(); }

	prevBtn?.addEventListener('click', ()=> go(-1));
	nextBtn?.addEventListener('click', ()=> go(1));

	let resizeTimer;
	window.addEventListener('resize', ()=>{ clearTimeout(resizeTimer); resizeTimer = setTimeout(()=>{ index = 0; update(); }, 120); });

	// Autoplay
	let autoTimer; const AUTO_MS = 6000;
	function startAuto(){ clearInterval(autoTimer); autoTimer = setInterval(()=>{ index++; update(); }, AUTO_MS); }
	function stopAuto(){ clearInterval(autoTimer); }
	track.addEventListener('pointerenter', stopAuto); track.addEventListener('pointerleave', startAuto);
	track.addEventListener('focusin', stopAuto); track.addEventListener('focusout', startAuto);

	update();
	startAuto();
})();

// Statistics counter animation
document.addEventListener('DOMContentLoaded', function() {
    const statisticsItems = document.querySelectorAll('.statistics__item');
    
    function animateCounter(element, target, duration = 2000) {
        const numberElement = element.querySelector('.statistics__number');
        if (!numberElement) return;
        
        let start = 0;
        const increment = target / (duration / 16); // 60fps
        let current = 0;
        
        function updateCounter() {
            current += increment;
            if (current >= target) {
                numberElement.textContent = target.toLocaleString();
                return;
            }
            numberElement.textContent = Math.floor(current).toLocaleString();
            requestAnimationFrame(updateCounter);
        }
        
        updateCounter();
    }
    
    // Start animation on page load with staggered delays
    statisticsItems.forEach((item, index) => {
        const target = parseInt(item.dataset.target, 10);
        if (target) {
            setTimeout(() => {
                animateCounter(item, target, 2500);
            }, index * 300 + 500); // Start after 500ms with 300ms stagger
        }
    });
});

// Modal functionality
document.addEventListener('DOMContentLoaded', function() {
    // Modal functions
    function openModal(modalId) {
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.style.display = 'flex';
            document.body.style.overflow = 'hidden';
            setTimeout(() => {
                modal.classList.add('modal--active');
            }, 10);
        }
    }

    function closeModal(modal) {
        if (modal) {
            modal.classList.remove('modal--active');
            setTimeout(() => {
                modal.style.display = 'none';
                document.body.style.overflow = 'auto';
            }, 300);
        }
    }

    // Login button functionality
    const loginBtns = document.querySelectorAll('.nav__login-btn, [data-modal="signInModal"]');
    loginBtns.forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.preventDefault();
            openModal('signInModal');
        });
    });

    // Modal close buttons
    document.addEventListener('click', function(e) {
        if (e.target.classList.contains('modal__close') || e.target.closest('.modal__close')) {
            const modal = e.target.closest('.modal');
            closeModal(modal);
        }

        // Close modal when clicking on overlay
        if (e.target.classList.contains('modal')) {
            closeModal(e.target);
        }
    });

    // Switch between modals
    document.addEventListener('click', function(e) {
        if (e.target.hasAttribute('data-modal')) {
            e.preventDefault();
            const currentModal = e.target.closest('.modal');
            const targetModalId = e.target.getAttribute('data-modal');
            
            if (currentModal) {
                closeModal(currentModal);
                setTimeout(() => {
                    openModal(targetModalId);
                }, 300);
            } else {
                openModal(targetModalId);
            }
        }
    });

    // Escape key to close modals
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            const activeModal = document.querySelector('.modal.modal--active');
            if (activeModal) {
                closeModal(activeModal);
            }
        }
    });

    // Form submissions
    const signInForm = document.getElementById('signInForm');
    if (signInForm) {
        signInForm.addEventListener('submit', function(e) {
            e.preventDefault();
            // Handle sign in logic here
            console.log('Sign in form submitted');
            // You can add your authentication logic here
        });
    }

    const signUpForm = document.getElementById('signUpForm');
    if (signUpForm) {
        signUpForm.addEventListener('submit', function(e) {
            e.preventDefault();
            // Handle sign up logic here
            console.log('Sign up form submitted');
            
            // Simulate successful registration and show OTP modal
            const currentModal = e.target.closest('.modal');
            closeModal(currentModal);
            setTimeout(() => {
                openModal('otpModal');
            }, 300);
        });
    }

    const forgotPasswordForm = document.getElementById('forgotPasswordForm');
    if (forgotPasswordForm) {
        forgotPasswordForm.addEventListener('submit', function(e) {
            e.preventDefault();
            // Handle forgot password logic here
            console.log('Forgot password form submitted');
            // You can add your password reset logic here
        });
    }

    // OTP Form submission
    const otpForm = document.getElementById('otpForm');
    if (otpForm) {
        otpForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get OTP value
            const otpInputs = document.querySelectorAll('.otp-input');
            let otpValue = '';
            otpInputs.forEach(input => {
                otpValue += input.value;
            });
            
            if (otpValue.length === 6) {
                // Handle OTP verification logic here
                console.log('OTP submitted:', otpValue);
                
                // Simulate successful verification
                alert('Email verified successfully! Welcome to Movify!');
                const currentModal = e.target.closest('.modal');
                closeModal(currentModal);
            } else {
                // Show error for incomplete OTP
                otpInputs.forEach(input => {
                    if (!input.value) {
                        input.classList.add('error');
                        setTimeout(() => {
                            input.classList.remove('error');
                        }, 1000);
                    }
                });
            }
        });
    }

    // OTP Input handling
    const otpInputs = document.querySelectorAll('.otp-input');
    otpInputs.forEach((input, index) => {
        // Auto-focus next input on digit entry
        input.addEventListener('input', function(e) {
            const value = e.target.value;
            
            // Only allow numeric input
            if (!/^\d$/.test(value) && value !== '') {
                e.target.value = '';
                return;
            }
            
            // Move to next input if digit entered
            if (value && index < otpInputs.length - 1) {
                otpInputs[index + 1].focus();
            }
        });
        
        // Handle backspace to move to previous input
        input.addEventListener('keydown', function(e) {
            if (e.key === 'Backspace' && !e.target.value && index > 0) {
                otpInputs[index - 1].focus();
            }
        });
        
        // Handle paste
        input.addEventListener('paste', function(e) {
            e.preventDefault();
            const pastedData = e.clipboardData.getData('text');
            const digits = pastedData.replace(/\D/g, '').slice(0, 6);
            
            digits.split('').forEach((digit, i) => {
                if (otpInputs[i]) {
                    otpInputs[i].value = digit;
                }
            });
            
            // Focus on the next empty input or the last input
            const nextEmptyIndex = digits.length < 6 ? digits.length : 5;
            if (otpInputs[nextEmptyIndex]) {
                otpInputs[nextEmptyIndex].focus();
            }
        });
    });

    // Resend OTP functionality
    const resendOtpBtn = document.getElementById('resendOtp');
    if (resendOtpBtn) {
        let resendTimer = null;
        let timeLeft = 0;
        
        function startResendTimer() {
            timeLeft = 60; // 60 seconds
            resendOtpBtn.style.pointerEvents = 'none';
            resendOtpBtn.style.opacity = '0.6';
            
            // Create or update timer display
            let timerDisplay = resendOtpBtn.parentNode.querySelector('.resend-timer');
            if (!timerDisplay) {
                timerDisplay = document.createElement('div');
                timerDisplay.className = 'resend-timer';
                resendOtpBtn.parentNode.appendChild(timerDisplay);
            }
            
            resendTimer = setInterval(() => {
                timeLeft--;
                timerDisplay.textContent = `Resend code in ${timeLeft}s`;
                
                if (timeLeft <= 0) {
                    clearInterval(resendTimer);
                    resendOtpBtn.style.pointerEvents = 'auto';
                    resendOtpBtn.style.opacity = '1';
                    timerDisplay.textContent = '';
                }
            }, 1000);
        }
        
        resendOtpBtn.addEventListener('click', function(e) {
            e.preventDefault();
            
            if (timeLeft > 0) return; // Prevent multiple clicks during cooldown
            
            // Handle resend OTP logic here
            console.log('Resending OTP...');
            
            // Clear current OTP inputs
            otpInputs.forEach(input => {
                input.value = '';
                input.classList.remove('error');
            });
            
            // Focus first input
            if (otpInputs[0]) {
                otpInputs[0].focus();
            }
            
            // Start cooldown timer
            startResendTimer();
            
            // Show success message
            const messageP = document.querySelector('#otpModal .modal__message p');
            const originalText = messageP.textContent;
            messageP.textContent = 'A new verification code has been sent to your email address.';
            messageP.style.color = '#4caf50';
            
            setTimeout(() => {
                messageP.textContent = originalText;
                messageP.style.color = '#666';
            }, 3000);
        });
    }
});
