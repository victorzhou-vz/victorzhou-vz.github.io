/* Victor Zhou — Portfolio : langue, thème, menu mobile, animations */
(function () {
	var root = document.documentElement;

	function store(key, value) {
		try { localStorage.setItem(key, value); } catch (e) {}
	}

	/* ---------- Langue ---------- */
	var meta = {
		fr: {
			title: 'Victor Zhou — Data Science & IA',
			description: 'Victor Zhou, élève ingénieur en dernière année à Polytech Sorbonne (Mathématiques Appliquées & Informatique). Recherche un stage de 6 mois en Data Science / IA à partir de mars 2027.',
			theme: 'Thème clair / sombre'
		},
		en: {
			title: 'Victor Zhou — Data Science & AI',
			description: 'Victor Zhou, final-year engineering student at Polytech Sorbonne (Applied Mathematics & Computer Science). Looking for a 6-month Data Science / AI internship starting March 2027.',
			theme: 'Light / dark theme'
		}
	};

	function setLang(lang) {
		root.lang = lang;
		document.title = meta[lang].title;
		document.querySelector('meta[name="description"]').setAttribute('content', meta[lang].description);
		document.getElementById('theme-toggle').setAttribute('aria-label', meta[lang].theme);
		document.querySelectorAll('[data-set-lang]').forEach(function (btn) {
			btn.setAttribute('aria-pressed', String(btn.dataset.setLang === lang));
		});
		// Garde l'URL partageable si elle contenait déjà ?lang=
		var url = new URL(location.href);
		if (url.searchParams.has('lang')) {
			url.searchParams.set('lang', lang);
			history.replaceState(null, '', url);
		}
	}

	document.querySelectorAll('[data-set-lang]').forEach(function (btn) {
		btn.addEventListener('click', function () {
			setLang(btn.dataset.setLang);
			store('lang', btn.dataset.setLang);
		});
	});
	setLang(root.lang === 'en' ? 'en' : 'fr');

	/* ---------- Thème ---------- */
	document.getElementById('theme-toggle').addEventListener('click', function () {
		var isDark = root.dataset.theme
			? root.dataset.theme === 'dark'
			: matchMedia('(prefers-color-scheme: dark)').matches;
		root.dataset.theme = isDark ? 'light' : 'dark';
		store('theme', root.dataset.theme);
	});

	/* ---------- Menu mobile ---------- */
	var nav = document.getElementById('site-nav');
	var menuBtn = document.getElementById('menu-toggle');
	menuBtn.addEventListener('click', function () {
		var open = nav.classList.toggle('open');
		menuBtn.setAttribute('aria-expanded', String(open));
	});
	nav.addEventListener('click', function (e) {
		if (e.target.closest('a')) {
			nav.classList.remove('open');
			menuBtn.setAttribute('aria-expanded', 'false');
		}
	});

	/* ---------- Bordure du header au scroll ---------- */
	var header = document.querySelector('.site-header');
	function onScroll() { header.classList.toggle('scrolled', window.scrollY > 8); }
	window.addEventListener('scroll', onScroll, { passive: true });
	onScroll();

	/* ---------- Apparition au scroll + lien actif ---------- */
	if ('IntersectionObserver' in window) {
		var revealObs = new IntersectionObserver(function (entries) {
			entries.forEach(function (entry) {
				if (entry.isIntersecting) {
					entry.target.classList.add('visible');
					revealObs.unobserve(entry.target);
				}
			});
		}, { rootMargin: '0px 0px -8% 0px' });
		document.querySelectorAll('.reveal').forEach(function (el) { revealObs.observe(el); });

		var links = nav.querySelectorAll('a');
		var navObs = new IntersectionObserver(function (entries) {
			entries.forEach(function (entry) {
				if (!entry.isIntersecting) return;
				links.forEach(function (a) {
					a.classList.toggle('active', a.getAttribute('href') === '#' + entry.target.id);
				});
			});
		}, { rootMargin: '-45% 0px -50% 0px' });
		document.querySelectorAll('main section[id]').forEach(function (s) { navObs.observe(s); });
	} else {
		document.querySelectorAll('.reveal').forEach(function (el) { el.classList.add('visible'); });
	}

	document.getElementById('year').textContent = new Date().getFullYear();
})();
