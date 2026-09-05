/**
 * PowerCore — Main JavaScript Engine
 * Single-line header, Dark/Light Mode, RTL/LTR, Capacity Explorer, Maintenance Switcher, Home 2 Interactive Tools, Modals, Animations
 */

// =========================================================================
// 0. GLOBAL PAGE PRELOADER CONTROLLER
// =========================================================================
(function initGlobalPreloader() {
  function hidePreloader() {
    const preloader = document.getElementById('page-preloader');
    const statusText = document.getElementById('preloader-status-text');
    if (!preloader) return;

    if (statusText) {
      statusText.textContent = 'SYSTEMS ONLINE';
    }

    setTimeout(() => {
      preloader.classList.add('preloader-hidden');
      setTimeout(() => {
        preloader.style.display = 'none';
      }, 500);
    }, 280);
  }

  if (document.readyState === 'complete') {
    hidePreloader();
  } else {
    window.addEventListener('load', hidePreloader);
    // Safety fallback: ensure page is always accessible within 1.2 seconds max
    setTimeout(hidePreloader, 1200);
  }
})();

document.addEventListener('DOMContentLoaded', () => {
  'use strict';

  // =========================================================================
  // 1. THEME TOGGLE (Dark / Light Mode)
  // =========================================================================
  const themeToggles = document.querySelectorAll('.theme-toggle-btn');
  const themeIcons = document.querySelectorAll('.theme-toggle-icon');

  function getPreferredTheme() {
    const saved = localStorage.getItem('powercore-theme');
    if (saved) return saved;
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }

  function applyTheme(theme) {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
      themeIcons.forEach(icon => {
        icon.className = 'fa-solid fa-sun theme-toggle-icon text-amber-400';
      });
    } else {
      document.documentElement.classList.remove('dark');
      themeIcons.forEach(icon => {
        icon.className = 'fa-solid fa-moon theme-toggle-icon text-slate-700';
      });
    }
    localStorage.setItem('powercore-theme', theme);
  }

  // Initial theme setup
  applyTheme(getPreferredTheme());

  themeToggles.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const currentTheme = document.documentElement.classList.contains('dark') ? 'dark' : 'light';
      const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
      applyTheme(newTheme);
    });
  });

  // =========================================================================
  // 2. RTL / LTR SWITCHER
  // =========================================================================
  const rtlToggles = document.querySelectorAll('.rtl-toggle-btn');
  const rtlLabels = document.querySelectorAll('.rtl-toggle-label');

  function getPreferredDir() {
    return localStorage.getItem('powercore-dir') || 'ltr';
  }

  function applyDirection(dir) {
    document.documentElement.dir = dir;
    document.documentElement.setAttribute('dir', dir);
    localStorage.setItem('powercore-dir', dir);

    rtlLabels.forEach(label => {
      label.textContent = dir === 'rtl' ? 'LTR' : 'RTL';
    });

    // Flip directional elements if needed
    const arrowIcons = document.querySelectorAll('[data-rtl-flip]');
    arrowIcons.forEach(arrow => {
      if (dir === 'rtl') {
        arrow.classList.add('rtl-flip');
      } else {
        arrow.classList.remove('rtl-flip');
      }
    });
  }

  // Initial direction setup
  applyDirection(getPreferredDir());

  rtlToggles.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const currentDir = document.documentElement.getAttribute('dir') || 'ltr';
      const newDir = currentDir === 'ltr' ? 'rtl' : 'ltr';
      applyDirection(newDir);
    });
  });

  // =========================================================================
  // 3. STICKY SINGLE-LINE HEADER BEHAVIOR
  // =========================================================================
  const mainHeader = document.getElementById('main-header');

  function handleHeaderScroll() {
    if (!mainHeader) return;
    if (window.scrollY > 20) {
      mainHeader.classList.add('header-scrolled');
    } else {
      mainHeader.classList.remove('header-scrolled');
    }
  }

  window.addEventListener('scroll', handleHeaderScroll, { passive: true });
  handleHeaderScroll();

  // =========================================================================
  // 4. MOBILE MENU DRAWER CONTROLLER & SCROLL LOCK
  // =========================================================================
  const mobileMenuBtn = document.getElementById('mobile-menu-btn');
  const mobileDrawer = document.getElementById('mobile-drawer');
  const mobileMenuIcon = document.getElementById('mobile-menu-icon');
  const mobileNavLinks = document.querySelectorAll('.mobile-nav-link');
  const mobileHomeDropdownBtn = document.getElementById('mobile-home-dropdown-btn');
  const mobileHomeDropdownList = document.getElementById('mobile-home-dropdown-list');
  const mobileHomeChevron = document.getElementById('mobile-home-chevron');

  function resetMobileHomeDropdown() {
    if (mobileHomeDropdownList) {
      mobileHomeDropdownList.classList.add('hidden');
    }
    if (mobileHomeChevron) {
      mobileHomeChevron.classList.remove('rotate-180');
    }
    if (mobileHomeDropdownBtn) {
      mobileHomeDropdownBtn.setAttribute('aria-expanded', 'false');
    }
  }

  function toggleMobileHomeDropdown() {
    if (!mobileHomeDropdownList) return;
    const isHidden = mobileHomeDropdownList.classList.contains('hidden');
    if (isHidden) {
      mobileHomeDropdownList.classList.remove('hidden');
      if (mobileHomeChevron) mobileHomeChevron.classList.add('rotate-180');
      if (mobileHomeDropdownBtn) mobileHomeDropdownBtn.setAttribute('aria-expanded', 'true');
    } else {
      resetMobileHomeDropdown();
    }
  }

  function openMobileMenu() {
    if (!mobileDrawer) return;
    // Always ensure Home dropdown starts CLOSED when opening mobile menu
    resetMobileHomeDropdown();
    mobileDrawer.classList.add('open');
    document.documentElement.classList.add('menu-open');
    document.body.classList.add('menu-open', 'overflow-hidden');
    if (mobileMenuIcon) mobileMenuIcon.className = 'fa-solid fa-xmark text-lg';
    if (mobileMenuBtn) mobileMenuBtn.setAttribute('aria-expanded', 'true');
  }

  function closeMobileMenu() {
    if (!mobileDrawer) return;
    mobileDrawer.classList.remove('open');
    document.documentElement.classList.remove('menu-open');
    document.body.classList.remove('menu-open', 'overflow-hidden');
    if (mobileMenuIcon) mobileMenuIcon.className = 'fa-solid fa-bars text-lg';
    if (mobileMenuBtn) mobileMenuBtn.setAttribute('aria-expanded', 'false');
    // Always reset Home dropdown to CLOSED when mobile menu closes
    resetMobileHomeDropdown();
  }

  function toggleMobileMenu() {
    if (!mobileDrawer) return;
    if (mobileDrawer.classList.contains('open')) {
      closeMobileMenu();
    } else {
      openMobileMenu();
    }
  }

  if (mobileMenuBtn) {
    mobileMenuBtn.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      toggleMobileMenu();
    });
  }

  // Handle Mobile Home Accordion toggle
  if (mobileHomeDropdownBtn) {
    mobileHomeDropdownBtn.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      toggleMobileHomeDropdown();
    });
  }

  // Close mobile drawer and reset dropdown when selecting any link
  mobileNavLinks.forEach(link => {
    link.addEventListener('click', () => {
      resetMobileHomeDropdown();
      closeMobileMenu();
    });
  });

  // Close when clicking outside on mobile
  document.addEventListener('click', (e) => {
    if (!mobileDrawer || !mobileDrawer.classList.contains('open')) return;
    if (!mobileDrawer.contains(e.target) && mobileMenuBtn && !mobileMenuBtn.contains(e.target)) {
      closeMobileMenu();
    }
  });

  // Close on Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && mobileDrawer && mobileDrawer.classList.contains('open')) {
      closeMobileMenu();
    }
  });

  // Highlight Active Link in Mobile Menu (without auto-expanding Home dropdown)
  const currentPageFile = window.location.pathname.split('/').pop() || 'index.html';
  mobileNavLinks.forEach(link => {
    const linkHref = link.getAttribute('href');
    if (linkHref && (linkHref === currentPageFile || (currentPageFile === '' && linkHref === 'index.html'))) {
      link.classList.add('active');
      link.setAttribute('aria-current', 'page');
      // Keep Home dropdown closed by default even if active link is Home 1 / Home 2
    }
  });

  // Ensure Home dropdown starts in closed state on initial load
  resetMobileHomeDropdown();

  // =========================================================================
  // 5. PRODUCT CAPACITY EXPLORER (Home 1 Interactive Selector)
  // =========================================================================
  const capacityData = {
    generator: {
      '1': {
        kva: '1 kVA (0.8 kW)',
        type: 'Portable Silent Petrol / Inverter Generator',
        segment: 'Home / Outdoor / Small Pop-Up Shop',
        fuel: 'Petrol / LPG Dual Fuel (0.45 L/hr)',
        runtime: '7.5 Hours continuous @ 50% load',
        noise: '58 dBA Ultra-Quiet Acoustic Canopy',
        transfer: 'Manual / Automatic Transfer Ready',
        appliances: ['LED Lighting (10-15 bulbs)', 'Ceiling Fans (2-3 units)', 'Wi-Fi 6 Router & Modems', 'Laptops & TV 55"', 'Mobile & POS Charging Units'],
        recommendedFor: 'Compact home backup during short grid cuts, billing counter continuity, outdoor field setups.'
      },
      '3': {
        kva: '3 kVA (2.4 kW)',
        type: 'Compact Silent Diesel / Dual-Fuel Generator',
        segment: 'Independent House / Retail Store',
        fuel: 'Diesel / Petrol (0.75 L/hr efficiency)',
        runtime: '9.0 Hours continuous @ 60% load',
        noise: '62 dBA CPCB-II Certified Enclosure',
        transfer: 'Automatic Transfer Switch (ATS) 10s',
        appliances: ['Standard 1-Ton Inverter AC', 'Double-Door Refrigerator', 'Water Purifier & Wi-Fi', 'All Lights & Fans', 'Security CCTV System'],
        recommendedFor: 'Complete essential household power, small boutique shops, dental/clinic consultation setups.'
      },
      '5': {
        kva: '5 kVA (4.0 kW)',
        type: 'Residential Heavy-Duty Silent Generator',
        segment: '3-4 BHK Apartment / Modern Villa / Bakery',
        fuel: 'High Efficiency Diesel (1.1 L/hr)',
        runtime: '12 Hours with 15L Fuel Tank',
        noise: '65 dBA Weatherproof Acoustic Canopy',
        transfer: 'Full Automated Mains Failure (AMF)',
        appliances: ['Two 1.5-Ton Inverter ACs', 'Full Kitchen Load (Fridge, Microwave)', '0.5 HP Submersible Water Pump', 'All Interior & Exterior Lighting', 'Entertainment Systems & Wi-Fi'],
        recommendedFor: 'Full family power independence, gourmet cafes, restaurant cold-storage protection.'
      },
      '7.5': {
        kva: '7.5 kVA (6.0 kW)',
        type: 'Commercial Grade Prime Power Generator',
        segment: 'Large Villa / Supermarket / Diagnostic Lab',
        fuel: 'Industrial Diesel (1.6 L/hr)',
        runtime: '14 Hours Heavy Duty Run',
        noise: '67 dBA Heavy Soundproof Canopy',
        transfer: 'Seamless AMF + Digital Genset Controller',
        appliances: ['Three 1.5-Ton AC Units', 'Deep Freezers & Display Coolers', '1 HP Water Pump & Geysers', 'Office Workstations (10-15 PCs)', 'Security Gates & Elevator Interlock'],
        recommendedFor: 'Medium commercial hubs, continuous lab diagnostics, luxury residential villas.'
      },
      '10': {
        kva: '10 kVA (8.0 kW)',
        type: '3-Phase Heavy Commercial Generator',
        segment: 'Corporate Branch / Mini Hospital / Restaurant',
        fuel: 'Turbo-Charged Diesel (2.1 L/hr)',
        runtime: '16+ Hours Continuous Rating',
        noise: '68 dBA Industrial Silenced',
        transfer: 'Microprocessor Digital AMF Panel',
        appliances: ['Multiple Central ACs & Chilled Units', 'All Commercial Kitchen Equipment', 'Submersible Heavy Pumps (2 HP)', '25+ Desktop Workstations & Servers', 'Full Commercial Lighting Setup'],
        recommendedFor: 'Uninterrupted commercial operations, IT branch offices, banquet halls.'
      },
      '15+': {
        kva: '15–250+ kVA High Capacity',
        type: 'Heavy Industrial & Institutional Genset System',
        segment: 'Manufacturing / Multi-Story Building / Hospital',
        fuel: 'Heavy Duty Multi-Cylinder Diesel',
        runtime: '24/7 Continuous Mission-Critical',
        noise: 'Custom Attenuated Acoustic Rooms',
        transfer: 'Dual Synchronized AMF Grid Interlock',
        appliances: ['Passenger Elevators & Fire Pumps', 'Central HVAC & Cleanrooms', 'Data Center Server Racks', 'Industrial Production Machines', 'Complete Facility Power'],
        recommendedFor: 'Critical healthcare, manufacturing plants, corporate towers requiring 100% uptime SLA.'
      }
    },
    inverter: {
      '1': {
        kva: '1 kVA (1000 VA / 800W)',
        type: 'Pure Sine Wave Smart Inverter + 150Ah Tubular Battery',
        segment: '1-2 BHK Apartment / Small Home Office',
        fuel: 'Electrical Battery Storage (Zero Emission)',
        runtime: '4–6 Hours backup on essential load',
        noise: '0 dBA Silent Solid-State Operation',
        transfer: '< 10ms Instantaneous UPS Mode',
        appliances: ['4 LED Lights & 3 Ceiling Fans', 'Wi-Fi 6 Router (Continuous)', 'Work Laptop & 32" LED TV', 'Mobile Chargers'],
        recommendedFor: 'Silent urban apartment power cuts, work-from-home desk continuity with zero flicker.'
      },
      '3': {
        kva: '3 kVA (3000 VA / 2400W)',
        type: 'High-Capacity Hybrid Inverter + Dual 220Ah Tall Tubular Batteries',
        segment: '2-3 BHK Home / Pharmacy / Retail Shop',
        fuel: 'Battery / Solar Hybrid Input Compatible',
        runtime: '6–8 Hours backup on moderate load',
        noise: '0 dBA Silent In-house Safe',
        transfer: '< 8ms Fast Transfer for IT / PC',
        appliances: ['1 Inverter Refrigerator', '1-Ton Inverter AC (Eco Mode)', 'All Fans & Home Lighting', 'POS Terminal & Surveillance CCTV', 'Water Purifier & Wi-Fi'],
        recommendedFor: 'Homes wanting quiet night-time sleep during blackouts, retail cash counter resilience.'
      },
      '5': {
        kva: '5 kVA (5000 VA / 4000W)',
        type: 'Solar-Ready Smart Inverter + 48V Lithium-ion (LiFePO4) Battery Pack',
        segment: '3-4 BHK Luxury Apartment / Tech Studio',
        fuel: 'LiFePO4 Fast Charge (2 Hrs Full Charge)',
        runtime: '8–12 Hours with Smart Load Balancing',
        noise: '0 dBA Maintenance-Free Wall Mount',
        transfer: '< 5ms Online UPS Precision',
        appliances: ['Two 1.5-Ton Inverter ACs', 'Double Door Refrigerator + Microwave', 'Washing Machine Cycle', 'Full Home Lighting & Network Mesh', 'Workstation Studio (iMacs, Audio Gear)'],
        recommendedFor: 'Zero maintenance luxury residences, audio-video studios, boutique design offices.'
      },
      '7.5': {
        kva: '7.5 kVA (7500 VA / 6000W)',
        type: '3-Phase Heavy Duty Hybrid Inverter + High-Voltage Lithium Bank',
        segment: 'Commercial Clinic / Architecture Firm / Villa',
        fuel: 'High Voltage LiFePO4 / 96V Industrial Tubular',
        runtime: '10–14 Hours Custom Storage Bank',
        noise: '0 dBA Whisper Quiet Cooling Fan',
        transfer: '< 4ms Seamless Data Center Grade',
        appliances: ['Central VRF / Multiple ACs', 'Diagnostic Imaging Equipment', 'Local Server Rack & 15 PCs', 'Automated Smart Home Automation', 'Water Pumping & Gate Motors'],
        recommendedFor: 'Professional firms wanting clean zero-fume power backup with solar integration.'
      },
      '10': {
        kva: '10 kVA (10000 VA / 8000W)',
        type: '3-Phase Enterprise Power Inverter + Scalable Li-Rack System',
        segment: 'IT Facility / Diagnostic Lab / Multi-Floor Residence',
        fuel: 'Smart BMS Managed Lithium Battery Racks',
        runtime: '12–18 Hours Modular Extensible Capacity',
        noise: 'Silent Rack Enclosure',
        transfer: '0ms True Online Double Conversion',
        appliances: ['Full Clinic / Lab Diagnostics', 'Precision Server Racks & Networking', 'All Lighting & Climate Control', 'Security & Access Control Grids', 'Commercial Refrigeration'],
        recommendedFor: 'Mission-critical enterprise loads requiring pure sine wave clean power without diesel handling.'
      },
      '15+': {
        kva: '15–50+ kVA High Voltage Energy Storage (BESS)',
        type: 'Commercial Battery Energy Storage System (BESS)',
        segment: 'Corporate HQ / Micro-Grid / Solar Farm Hybrid',
        fuel: 'High-Density Prismatic Lithium Iron Phosphate',
        runtime: 'Custom Designed MWh Storage',
        noise: 'Containerized / Plant Room Certified',
        transfer: '0ms Microgrid Seamless Sync',
        appliances: ['Entire Commercial Building Base Load', 'Elevators & Central Cooling Systems', 'Heavy Diagnostic MRIs & Cleanrooms', 'Full Industrial Control Systems'],
        recommendedFor: 'Sustainable green facilities seeking zero emissions, peak shaving, and 100% backup security.'
      }
    }
  };

  let activeSystemType = 'generator';
  let activeCapacityKey = '3';

  const systemTypeBtns = document.querySelectorAll('.capacity-type-btn');
  const capacityScaleBtns = document.querySelectorAll('.capacity-scale-btn');

  const displayKva = document.getElementById('explorer-kva');
  const displayType = document.getElementById('explorer-type');
  const displaySegment = document.getElementById('explorer-segment');
  const displayFuel = document.getElementById('explorer-fuel');
  const displayRuntime = document.getElementById('explorer-runtime');
  const displayNoise = document.getElementById('explorer-noise');
  const displayTransfer = document.getElementById('explorer-transfer');
  const displayRecommended = document.getElementById('explorer-recommended');
  const displayAppliancesList = document.getElementById('explorer-appliances');
  const explorerBookBtn = document.getElementById('explorer-book-btn');

  function updateCapacityExplorer() {
    if (!capacityData[activeSystemType]) return;
    const data = capacityData[activeSystemType][activeCapacityKey];
    if (!data) return;

    if (displayKva) displayKva.textContent = data.kva;
    if (displayType) displayType.textContent = data.type;
    if (displaySegment) displaySegment.textContent = data.segment;
    if (displayFuel) displayFuel.textContent = data.fuel;
    if (displayRuntime) displayRuntime.textContent = data.runtime;
    if (displayNoise) displayNoise.textContent = data.noise;
    if (displayTransfer) displayTransfer.textContent = data.transfer;
    if (displayRecommended) displayRecommended.textContent = data.recommendedFor;

    if (displayAppliancesList) {
      displayAppliancesList.innerHTML = '';
      data.appliances.forEach(appliance => {
        const li = document.createElement('li');
        li.className = 'flex items-center space-x-2 rtl:space-x-reverse text-sm font-medium text-slate-700 dark:text-slate-300';
        li.innerHTML = `
          <span class="w-5 h-5 rounded-full bg-amber-500/15 text-amber-500 flex items-center justify-center text-xs shrink-0">
            <i class="fa-solid fa-check"></i>
          </span>
          <span>${appliance}</span>
        `;
        displayAppliancesList.appendChild(li);
      });
    }

    if (explorerBookBtn) {
      explorerBookBtn.setAttribute('data-prefill-capacity', `${activeSystemType.toUpperCase()} - ${data.kva}`);
      explorerBookBtn.textContent = `Request Setup for ${data.kva} →`;
    }

    capacityScaleBtns.forEach(btn => {
      const key = btn.getAttribute('data-capacity');
      if (key === activeCapacityKey) {
        btn.classList.add('bg-amber-500', 'text-slate-950', 'font-bold', 'border-amber-500', 'shadow-md', 'shadow-amber-500/20');
        btn.classList.remove('bg-white', 'dark:bg-slate-900', 'text-slate-700', 'dark:text-slate-300', 'border-slate-300', 'dark:border-slate-800');
      } else {
        btn.classList.remove('bg-amber-500', 'text-slate-950', 'font-bold', 'border-amber-500', 'shadow-md', 'shadow-amber-500/20');
        btn.classList.add('bg-white', 'dark:bg-slate-900', 'text-slate-700', 'dark:text-slate-300', 'border-slate-300', 'dark:border-slate-800');
      }
    });

    systemTypeBtns.forEach(btn => {
      const type = btn.getAttribute('data-type');
      if (type === activeSystemType) {
        btn.classList.add('active');
        btn.setAttribute('aria-selected', 'true');
      } else {
        btn.classList.remove('active');
        btn.setAttribute('aria-selected', 'false');
      }
    });
  }

  systemTypeBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const newType = btn.getAttribute('data-type');
      if (newType && newType !== activeSystemType) {
        activeSystemType = newType;
        updateCapacityExplorer();
      }
    });
  });

  capacityScaleBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      activeCapacityKey = btn.getAttribute('data-capacity') || '3';
      updateCapacityExplorer();
    });
  });

  if (displayKva) {
    updateCapacityExplorer();
  }

  // =========================================================================
  // 6. MAINTENANCE INTERVALS SWITCHER (Home 1 Section 06)
  // =========================================================================
  const intervalBtns = document.querySelectorAll('.interval-tab-btn');
  const intervalDetailBox = document.getElementById('interval-detail-content');

  const intervalData = {
    monthly: {
      title: 'Monthly Preventive Health Check',
      freq: '12 Visits / Year',
      focus: 'Critical high-use commercial setups & high-frequency power cut areas.',
      includes: [
        'Electrolyte & battery specific gravity testing',
        'Engine oil level, viscosity & contamination audit',
        'Automatic transfer switch (ATS) simulation test',
        'Terminal torque inspection & corrosion cleanup',
        'Air intake filter clearing & fuel water-trap drain'
      ],
      idealFor: 'Hospitals, Data Centers, High-Footfall Commercial Hubs'
    },
    quarterly: {
      title: 'Quarterly Comprehensive Maintenance',
      freq: '4 Visits / Year (Most Popular)',
      focus: 'Standard residential villas, modern apartments, and retail stores.',
      includes: [
        'Complete lube oil & secondary filter replacement',
        'Coolant pH balance & radiator core cleaning',
        'Alternator insulation resistance (Megger test)',
        'Full 100% step-load calibration and governor check',
        'Digital controller firmware & event log diagnostics'
      ],
      idealFor: 'Independent Houses, Standalone Shops, Corporate Offices'
    },
    halfyearly: {
      title: 'Half-Yearly Mid-Term Overhaul Inspection',
      freq: '2 Visits / Year',
      focus: 'Low-frequency backup standby systems and seasonal power backup.',
      includes: [
        'Comprehensive multi-point mechanical inspection',
        'Starter motor & charging alternator bench check',
        'Inverter PCB thermal imaging & dust decontamination',
        'Deep battery discharge & charge cycle calibration',
        'Full safety shutdown interlock verification'
      ],
      idealFor: 'Warehouses, Farmhouses, Backup Redundancy Facilities'
    },
    annual: {
      title: 'Annual Full Spectrum Certified Certification',
      freq: '1 Major Annual Overhaul + 24/7 Breakdown Coverage',
      focus: 'Complete year-round compliance and power reliability peace of mind.',
      includes: [
        'Total fluid renewal: OEM engine oil, coolant & brake flush',
        'Complete fuel tank sediment flushing & injector calibration',
        'Vibration analysis & anti-vibration mount replacement',
        'Statutory emission & sound level compliance certificate',
        'Zero-labor emergency breakdown calls included all 365 days'
      ],
      idealFor: 'Apartment Associations, Commercial Towers, Factories'
    }
  };

  function updateMaintenanceInterval(key) {
    const data = intervalData[key];
    if (!data || !intervalDetailBox) return;

    intervalDetailBox.innerHTML = `
      <div class="flex flex-wrap items-center justify-between gap-2 border-b border-slate-200 dark:border-slate-800 pb-4">
        <div>
          <span class="text-xs font-mono font-semibold uppercase tracking-wider text-amber-500">${data.freq}</span>
          <h4 class="text-lg font-bold text-slate-900 dark:text-white mt-0.5">${data.title}</h4>
        </div>
        <span class="px-3 py-1 rounded-full text-xs font-semibold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
          ${data.idealFor}
        </span>
      </div>
      <p class="text-sm text-slate-800 dark:text-white mt-3 font-medium focus-description-text">${data.focus}</p>
      <ul class="mt-4 space-y-2.5">
        ${data.includes.map(item => `
          <li class="flex items-start space-x-2.5 rtl:space-x-reverse text-xs sm:text-sm text-slate-800 dark:text-white">
            <span class="w-4 h-4 mt-0.5 rounded-full bg-amber-500/15 text-amber-500 flex items-center justify-center text-[10px] shrink-0">
              <i class="fa-solid fa-check"></i>
            </span>
            <span>${item}</span>
          </li>
        `).join('')}
      </ul>
      <div class="mt-5 pt-4 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between">
        <span class="text-xs text-slate-700 dark:text-white">Includes 24/7 Priority Emergency Dispatch</span>
        <a href="amc-plans.html" class="inline-flex items-center text-xs font-bold text-amber-500 hover:text-amber-600 transition-colors">
          Compare AMC Tiers <i class="fa-solid fa-arrow-right ml-1.5 rtl:mr-1.5 rtl:ml-0" data-rtl-flip></i>
        </a>
      </div>
    `;

    intervalBtns.forEach(btn => {
      const btnKey = btn.getAttribute('data-interval');
      if (btnKey === key) {
        btn.classList.add('border-amber-500', 'bg-amber-500/10', 'text-amber-500', 'font-bold');
        btn.classList.remove('border-slate-200', 'dark:border-slate-800', 'text-slate-600', 'dark:text-slate-400');
      } else {
        btn.classList.remove('border-amber-500', 'bg-amber-500/10', 'text-amber-500', 'font-bold');
        btn.classList.add('border-slate-200', 'dark:border-slate-800', 'text-slate-600', 'dark:text-slate-400');
      }
    });
  }

  intervalBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const key = btn.getAttribute('data-interval') || 'quarterly';
      updateMaintenanceInterval(key);
    });
  });

  if (intervalDetailBox) {
    updateMaintenanceInterval('quarterly');
  }

  // =========================================================================
  // 7. HOME 2 SPECIFIC INTERACTIVE ENGINES
  // =========================================================================

  // A. Section 03 — Generator vs Inverter Interactive Decision Table
  const decisionRows = document.querySelectorAll('.decision-row');
  const decisionHighlightBox = document.getElementById('decision-highlight-text');

  const decisionDescriptions = {
    'LOAD': 'Generators effortlessly power continuous heavy inductive motor surges (compressors, lifts), whereas inverters handle sensitive electronic IT loads up to rated inverter peak.',
    'BACKUP TIME': 'Generators run indefinitely as long as diesel/petrol is replenished; Inverter backup duration is governed by Ah battery pack capacity and load discharge rate.',
    'NOISE': 'Inverters operate in 100% absolute silence (0 dBA); Modern soundproof generators operate around 58–68 dBA in acoustic weather-proof canopies.',
    'FUEL': 'Generators utilize Diesel or Petrol/LPG fuels; Inverter systems recharge from the electric AC grid or solar PV panels with zero fumes.',
    'SPACE': 'Generators require outdoor or well-ventilated terrace/ground placement; Inverters and compact LiFePO4 wall-mounts install neatly indoors in utility rooms.',
    'MAINTENANCE': 'Generators require periodic engine lube oil, filter, and coolant changes; Lithium battery inverter systems are virtually maintenance-free.'
  };

  decisionRows.forEach(row => {
    row.addEventListener('mouseenter', () => {
      const param = row.getAttribute('data-decision-param');
      if (decisionHighlightBox && decisionDescriptions[param]) {
        decisionHighlightBox.innerHTML = `
          <span class="font-mono font-bold text-amber-500 uppercase mr-1.5">[${param}]</span>
          <span>${decisionDescriptions[param]}</span>
        `;
      }
      decisionRows.forEach(r => r.classList.remove('bg-amber-500/10', 'border-amber-500'));
      row.classList.add('bg-amber-500/10', 'border-amber-500');
    });

    row.addEventListener('click', () => {
      const param = row.getAttribute('data-decision-param');
      if (decisionHighlightBox && decisionDescriptions[param]) {
        decisionHighlightBox.innerHTML = `
          <span class="font-mono font-bold text-amber-500 uppercase mr-1.5">[${param}]</span>
          <span>${decisionDescriptions[param]}</span>
        `;
      }
      decisionRows.forEach(r => r.classList.remove('bg-amber-500/10', 'border-amber-500'));
      row.classList.add('bg-amber-500/10', 'border-amber-500');
    });
  });

  // B. Section 04 — Product Range Visualizer (Capacity Journey)
  const rangeCards = document.querySelectorAll('.range-visualizer-item');
  const rangeProgressIndicator = document.getElementById('range-progress-bar');

  rangeCards.forEach((card, index) => {
    card.addEventListener('mouseenter', () => {
      if (rangeProgressIndicator) {
        const widths = ['25%', '50%', '75%', '100%'];
        rangeProgressIndicator.style.width = widths[index] || '50%';
      }
    });
  });

  // C. Section 05 — Field Service Story Stages Selector
  const serviceStageBtns = document.querySelectorAll('.service-stage-btn');
  const stageHeading = document.getElementById('service-stage-heading');
  const stageDesc = document.getElementById('service-stage-desc');
  const stageDeliverable = document.getElementById('service-stage-deliverable');

  const stageContent = {
    '01': {
      title: '01. Comprehensive Load & Site Inspection',
      desc: 'Our senior electrical engineer inspects switchgear room, measured peak surge draws, acoustic boundary limits, and earthing impedance before recommending equipment.',
      deliverable: 'Delivered: Calibrated Site Load Audit & Sizing Report'
    },
    '02': {
      title: '02. Precision Turnkey Installation',
      desc: 'Foundation isolation pads, acoustic ducting, certified class-A electrical cable routing, and automatic mains failure (AMF) interlock wiring with complete safety signoff.',
      deliverable: 'Delivered: Safety Certified Grid-Interlock Commissioning'
    },
    '03': {
      title: '03. Full Step-Load Diagnostic Testing',
      desc: 'We perform 100% step-load testing using portable resistive load banks to verify alternator thermal stability, voltage regulation (AVR), and seamless sub-10s ATS transfer.',
      deliverable: 'Delivered: 100% Step-Load Verification Certificate'
    },
    '04': {
      title: '04. Scheduled Preventive Maintenance',
      desc: 'Regular fluid renewal, megger alternator testing, battery specific gravity logging, and digital controller firmware upgrades under our tailored AMC contracts.',
      deliverable: 'Delivered: 365-Day Scheduled Preventive Health Logs'
    },
    '05': {
      title: '05. 24/7 Rapid Emergency Response',
      desc: 'GPS-tracked mobile emergency vans stocked with OEM replacement starters, AVRs, injectors, and backup temporary units ready for < 45-minute dispatch.',
      deliverable: 'Delivered: Under 45-Minute Emergency Dispatch SLA'
    }
  };

  serviceStageBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const stageKey = btn.getAttribute('data-stage') || '01';
      const data = stageContent[stageKey];
      if (!data) return;

      if (stageHeading) stageHeading.textContent = data.title;
      if (stageDesc) stageDesc.textContent = data.desc;
      if (stageDeliverable) stageDeliverable.textContent = data.deliverable;

      serviceStageBtns.forEach(b => {
        b.classList.remove('bg-amber-500', 'text-slate-950', 'border-amber-500', 'font-bold');
        b.classList.add('bg-slate-900', 'text-slate-300', 'border-slate-800');
      });

      btn.classList.add('bg-amber-500', 'text-slate-950', 'border-amber-500', 'font-bold');
      btn.classList.remove('bg-slate-900', 'text-slate-300', 'border-slate-800');
    });
  });

  // D. Section 06 — Number Counter Animation
  const countElements = document.querySelectorAll('.stat-counter');
  let hasAnimatedCounters = false;

  function runCounters() {
    if (hasAnimatedCounters) return;
    countElements.forEach(el => {
      const target = parseInt(el.getAttribute('data-target'), 10);
      const suffix = el.getAttribute('data-suffix') || '';
      if (isNaN(target)) return;

      let current = 0;
      const increment = Math.ceil(target / 40);
      const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
          el.textContent = target + suffix;
          clearInterval(timer);
        } else {
          el.textContent = current + suffix;
        }
      }, 35);
    });
    hasAnimatedCounters = true;
  }

  // E. Home 2 Inline Service Booking Form Handler
  const home2BookingForm = document.getElementById('home2-booking-form');
  const home2SuccessMsg = document.getElementById('home2-booking-success');

  if (home2BookingForm) {
    home2BookingForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const submitBtn = home2BookingForm.querySelector('button[type="submit"]');
      const originalText = submitBtn ? submitBtn.innerHTML : 'Request Service →';

      if (submitBtn) {
        submitBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin mr-2"></i> Registering Request...';
        submitBtn.disabled = true;
      }

      setTimeout(() => {
        if (home2BookingForm && home2SuccessMsg) {
          home2BookingForm.classList.add('hidden');
          home2SuccessMsg.classList.remove('hidden');
        }
        if (submitBtn) {
          submitBtn.innerHTML = originalText;
          submitBtn.disabled = false;
        }
      }, 700);
    });
  }

  // =========================================================================
  // 8. BOOKING SERVICE MODAL
  // =========================================================================
  const bookingModal = document.getElementById('booking-modal');
  const modalOpenBtns = document.querySelectorAll('[data-modal-open="booking-modal"]');
  const modalCloseBtns = document.querySelectorAll('[data-modal-close="booking-modal"]');
  const serviceRequirementInput = document.getElementById('modal-service-requirement');
  const bookingForm = document.getElementById('service-booking-form');
  const bookingSuccessMsg = document.getElementById('booking-success-message');

  function openBookingModal(prefillData = '') {
    if (!bookingModal) return;
    bookingModal.classList.add('active');
    document.body.classList.add('overflow-hidden');

    if (serviceRequirementInput && prefillData) {
      serviceRequirementInput.value = prefillData;
    }

    if (bookingForm && bookingSuccessMsg) {
      bookingForm.classList.remove('hidden');
      bookingSuccessMsg.classList.add('hidden');
    }
  }

  function closeBookingModal() {
    if (!bookingModal) return;
    bookingModal.classList.remove('active');
    document.body.classList.remove('overflow-hidden');
  }

  modalOpenBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const prefill = btn.getAttribute('data-prefill-capacity') || btn.getAttribute('data-prefill-service') || '';
      openBookingModal(prefill);
    });
  });

  modalCloseBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      closeBookingModal();
    });
  });

  if (bookingModal) {
    bookingModal.addEventListener('click', (e) => {
      if (e.target === bookingModal) {
        closeBookingModal();
      }
    });
  }

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeBookingModal();
      toggleMobileMenu(true);
    }
  });

  if (bookingForm) {
    bookingForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const submitBtn = bookingForm.querySelector('button[type="submit"]');
      const originalText = submitBtn ? submitBtn.innerHTML : 'Confirm Booking';

      if (submitBtn) {
        submitBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin mr-2"></i> Scheduling Dispatch...';
        submitBtn.disabled = true;
      }

      setTimeout(() => {
        if (bookingForm && bookingSuccessMsg) {
          bookingForm.classList.add('hidden');
          bookingSuccessMsg.classList.remove('hidden');
        }
        if (submitBtn) {
          submitBtn.innerHTML = originalText;
          submitBtn.disabled = false;
        }
      }, 700);
    });
  }

  // =========================================================================
  // 9. INTERSECTION OBSERVER ANIMATION SYSTEM
  // =========================================================================
  if ('IntersectionObserver' in window) {
    const observerOptions = {
      root: null,
      rootMargin: '0px',
      threshold: 0.12
    };

    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('reveal-active');
          if (entry.target.classList.contains('stats-section-trigger')) {
            runCounters();
          }
          observer.unobserve(entry.target);
        }
      });
    }, observerOptions);

    const revealElements = document.querySelectorAll('.reveal-init, .reveal-left, .reveal-right, .stats-section-trigger');
    revealElements.forEach(el => revealObserver.observe(el));
  } else {
    // Fallback if IntersectionObserver not available
    const revealElements = document.querySelectorAll('.reveal-init, .reveal-left, .reveal-right');
    revealElements.forEach(el => el.classList.add('reveal-active'));
    runCounters();
  }

  // =========================================================================
  // 10. ABOUT PAGE INTERACTIVE CONTROLLERS
  // =========================================================================
  const teamRoleItems = document.querySelectorAll('.team-role-item');
  const teamRoleQuote = document.getElementById('team-role-active-quote');
  const teamMainImage = document.getElementById('team-main-visual');

  const roleQuotes = {
    'engineers': '“We calculate load impedances, thermal limits, and fuel efficiencies to make sure the right machine is deployed safely.”',
    'technicians': '“Precision foundation dampening, acoustic baffles, and torque-calibrated busbar wiring make every installation run clean.”',
    'diagnostics': '“Using digital Megger insulation testers and harmonic scopes, we catch micro-faults before they cause catastrophic blackouts.”',
    'support': '“When power goes out at 2 AM, our GPS dispatch assigns the closest stocked mobile van within 5 minutes.”',
    'amc': '“Scheduled fluid renewals and conductance health logs ensure your generator starts on the first crank, every time.”'
  };

  teamRoleItems.forEach(item => {
    item.addEventListener('mouseenter', () => {
      const roleKey = item.getAttribute('data-role');
      if (teamRoleQuote && roleQuotes[roleKey]) {
        teamRoleQuote.textContent = roleQuotes[roleKey];
      }
      teamRoleItems.forEach(i => i.classList.remove('active'));
      item.classList.add('active');
      if (teamMainImage) {
        teamMainImage.classList.add('scale-[1.02]');
      }
    });

    item.addEventListener('mouseleave', () => {
      if (teamMainImage) {
        teamMainImage.classList.remove('scale-[1.02]');
      }
    });

    item.addEventListener('click', () => {
      const roleKey = item.getAttribute('data-role');
      if (teamRoleQuote && roleQuotes[roleKey]) {
        teamRoleQuote.textContent = roleQuotes[roleKey];
      }
      teamRoleItems.forEach(i => i.classList.remove('active'));
      item.classList.add('active');
    });
  });

  // =========================================================================
  // 11. PRODUCTS PAGE INTERACTIVE ENGINES
  // =========================================================================

  // 0. Hero Equipment Selector Switcher (Generators / Inverters / Batteries)
  const equipmentSelectorBtns = document.querySelectorAll('.equipment-selector-btn');
  if (equipmentSelectorBtns.length > 0) {
    function setActiveEquipmentBtn(targetBtn) {
      equipmentSelectorBtns.forEach(btn => {
        const isCurrent = (btn === targetBtn && targetBtn !== null);
        btn.setAttribute('aria-selected', isCurrent ? 'true' : 'false');
        if (isCurrent) {
          btn.classList.add('active', 'border-amber-500', 'bg-amber-500', 'text-slate-950');
          btn.classList.remove('border-slate-700', 'text-slate-300', 'bg-transparent');
        } else {
          btn.classList.remove('active', 'border-amber-500', 'bg-amber-500', 'text-slate-950');
          btn.classList.add('border-slate-700', 'text-slate-300', 'bg-transparent');
        }
      });
    }

    equipmentSelectorBtns.forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        const targetId = btn.getAttribute('data-equipment-target');
        if (!targetId) return;

        setActiveEquipmentBtn(btn);

        const targetSection = document.getElementById(targetId);
        if (targetSection) {
          const header = document.getElementById('main-header');
          const headerOffset = header ? header.offsetHeight + 16 : 80;
          const elementPosition = targetSection.getBoundingClientRect().top;
          const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

          window.scrollTo({
            top: offsetPosition,
            behavior: 'smooth'
          });

          // Momentary visual feedback pulse on target section
          targetSection.classList.remove('section-highlight-pulse');
          void targetSection.offsetWidth;
          targetSection.classList.add('section-highlight-pulse');
          setTimeout(() => {
            targetSection.classList.remove('section-highlight-pulse');
          }, 1800);
        }
      });
    });

    // When scrolled back to top of the page (Hero area), unhighlight all selector buttons
    window.addEventListener('scroll', () => {
      if (window.scrollY < 350) {
        setActiveEquipmentBtn(null);
      }
    }, { passive: true });
  }

  // A. Product Discovery Selector (Section 02)
  const discoveryRows = document.querySelectorAll('.product-discovery-row');
  const discoveryCapacityBadge = document.getElementById('discovery-capacity-badge');
  const discoveryLoadsList = document.getElementById('discovery-loads-list');
  const discoverySystemTitle = document.getElementById('discovery-system-title');
  const discoverySystemDesc = document.getElementById('discovery-system-desc');
  const discoveryPrefillBtn = document.getElementById('discovery-prefill-btn');

  const discoveryData = {
    'home': {
      capacity: '1 – 10 kVA',
      systemTitle: 'Residential Pure Sine Inverter or Silent Petrol/Diesel Genset',
      systemDesc: 'Designed for residential silent night backup, zero flicker for sensitive computers, and automatic utility failover.',
      loads: ['LED Lighting & 4–6 Ceiling Fans', 'Smart TVs, Gaming Consoles & Wi-Fi 6 Routers', 'Inverter Refrigerators & RO Water Purifiers', '1.5-Ton Inverter AC (with 5+ kVA systems)']
    },
    'shop': {
      capacity: '5 – 25 kVA',
      systemTitle: 'Commercial Soundproof Diesel Genset + High-Surge Inverter',
      systemDesc: 'Continuous power security for retail checkout counters, cold display freezers, lighting tracks, and security DVR cameras.',
      loads: ['Billing POS Terminals & Card Readers', 'Display Deep Freezers & Cold Beverage Coolers', 'Storefront Lighting & Air Curtains', 'CCTV DVR & Network Gateway']
    },
    'office': {
      capacity: '10 – 50+ kVA',
      systemTitle: '3-Phase Diesel Generator with Synchronized Online UPS',
      systemDesc: 'Zero-downtime mission critical architecture designed for server racks, workstation pods, and central VRF climate control.',
      loads: ['Data Center Server Racks & Fiber Switches', '50+ High-Performance Workstation Desktops', 'Central Duct & VRF Air Conditioning', 'Biometric Access Control & Fire Alarm Panels']
    },
    'commercial': {
      capacity: '25 – 250+ kVA',
      systemTitle: 'Heavy Industrial Prime Generator with Automated AMF Panel',
      systemDesc: 'Heavy-duty multi-cylinder turbocharged power stations built for multi-story towers, diagnostic clinics, and industrial machinery.',
      loads: ['Passenger & Freight Elevators', 'Medical Imaging (X-Ray / MRI) & Cleanrooms', 'Heavy Manufacturing Conveyors & Motors', 'Emergency Hydrant Fire Fighting Pumps']
    }
  };

  discoveryRows.forEach(row => {
    row.addEventListener('click', () => {
      const type = row.getAttribute('data-discovery-type') || 'home';
      const data = discoveryData[type];
      if (!data) return;

      discoveryRows.forEach(r => r.classList.remove('active'));
      row.classList.add('active');

      if (discoveryCapacityBadge) discoveryCapacityBadge.textContent = data.capacity;
      if (discoverySystemTitle) discoverySystemTitle.textContent = data.systemTitle;
      if (discoverySystemDesc) discoverySystemDesc.textContent = data.systemDesc;
      if (discoveryPrefillBtn) discoveryPrefillBtn.setAttribute('data-prefill-service', `${type.toUpperCase()} Backup System Consultation (${data.capacity})`);

      if (discoveryLoadsList) {
        discoveryLoadsList.innerHTML = data.loads.map(load => `
          <div class="flex items-center space-x-2 rtl:space-x-reverse text-xs text-slate-700 dark:text-slate-300">
            <i class="fa-solid fa-circle-check text-amber-500"></i>
            <span>${load}</span>
          </div>
        `).join('');
      }
    });
  });

  // B. Generator Range Explorer (Section 03)
  const generatorRangeRows = document.querySelectorAll('.generator-range-row');
  const genDetailCapacity = document.getElementById('gen-detail-capacity');
  const genDetailTitle = document.getElementById('gen-detail-title');
  const genDetailFuel = document.getElementById('gen-detail-fuel');
  const genDetailBenefit = document.getElementById('gen-detail-benefit');
  const genDetailNoise = document.getElementById('gen-detail-noise');
  const genDetailCta = document.getElementById('gen-detail-cta');

  const generatorRangeData = {
    '01': {
      capacity: '1 – 5 kVA',
      title: 'Compact Silent Residential Genset',
      fuel: 'Petrol / LPG Dual-Fuel',
      benefit: 'Ultra-portable compact footprint (<58 dBA acoustic soundproofing) for apartments, villas, and small clinics.',
      noise: '< 58 dBA Ultra-Quiet',
      prefill: '1-5 kVA Compact Silent Genset'
    },
    '02': {
      capacity: '5 – 10 kVA',
      title: 'Heavy Home & Shop Prime Genset',
      fuel: 'Silent Diesel (Direct Injection)',
      benefit: 'Integrated electric key start, automatic AMF transfer compatibility, and high fuel economy for long power cuts.',
      noise: '< 65 dBA CPCB-II Silenced',
      prefill: '5-10 kVA Prime Diesel Genset'
    },
    '03': {
      capacity: '10 – 25 kVA',
      title: 'Commercial Office & Clinic Genset',
      fuel: 'Water-Cooled Diesel Engine',
      benefit: 'Balanced 3-Phase output, digital microprocessor engine controller, and 12-hour continuous base fuel tank.',
      noise: '< 68 dBA Acoustic Canopy',
      prefill: '10-25 kVA Commercial 3-Phase Genset'
    },
    '04': {
      capacity: '25 – 100 kVA',
      title: 'Heavy Commercial Power Station',
      fuel: 'Turbocharged Industrial Diesel',
      benefit: 'Powers central VRF air conditioners, passenger elevators, and large IT floor plates with sub-10 second failover.',
      noise: '< 70 dBA Heavy Silenced',
      prefill: '25-100 kVA Heavy Commercial Power Station'
    },
    '05': {
      capacity: '100+ kVA',
      title: 'Industrial High-Demand Fleet',
      fuel: 'Multi-Cylinder Turbocharged Industrial Diesel',
      benefit: 'Continuous prime power for manufacturing plants, hospitals, and cloud infrastructure with dual synchronized AMF.',
      noise: '< 72 dBA Industrial Silenced',
      prefill: '100+ kVA Industrial High-Demand Genset'
    }
  };

  generatorRangeRows.forEach(row => {
    row.addEventListener('click', () => {
      const id = row.getAttribute('data-gen-range') || '01';
      const data = generatorRangeData[id];
      if (!data) return;

      generatorRangeRows.forEach(r => r.classList.remove('active'));
      row.classList.add('active');

      if (genDetailCapacity) genDetailCapacity.textContent = data.capacity;
      if (genDetailTitle) genDetailTitle.textContent = data.title;
      if (genDetailFuel) genDetailFuel.textContent = data.fuel;
      if (genDetailBenefit) genDetailBenefit.textContent = data.benefit;
      if (genDetailNoise) genDetailNoise.textContent = data.noise;
      if (genDetailCta) genDetailCta.setAttribute('data-prefill-service', data.prefill);
    });
  });

  // C. Inverter Segment Switcher (Section 04)
  const inverterSegmentBtns = document.querySelectorAll('.inverter-segment-btn');
  const inverterRatingText = document.getElementById('inverter-rating-text');
  const inverterBatteryText = document.getElementById('inverter-battery-text');
  const inverterAppText = document.getElementById('inverter-app-text');

  const inverterData = {
    'home': {
      rating: '2 – 5 kVA Pure Sine Wave',
      battery: '1 – 4 Tubular or LiFePO4 Wall-Pack',
      app: 'Lights, Fans, Refrigerator, Smart TV, Wi-Fi router'
    },
    'shop': {
      rating: '3 – 10 kVA High-Surge Sine Wave',
      battery: '2 – 8 Deep-Cycle High Ah Batteries',
      app: 'POS checkout, barcode scanners, cold drink coolers, LED tracks'
    },
    'office': {
      rating: '5 – 20 kVA Online Double-Conversion',
      battery: '4 – 16 Battery Rack with Smart BMS',
      app: 'Workstation PCs, server racks, network switches, biometric doors'
    }
  };

  inverterSegmentBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const seg = btn.getAttribute('data-inverter-seg') || 'home';
      const data = inverterData[seg];
      if (!data) return;

      inverterSegmentBtns.forEach(b => {
        b.classList.remove('active');
        b.setAttribute('aria-selected', 'false');
      });
      btn.classList.add('active');
      btn.setAttribute('aria-selected', 'true');

      if (inverterRatingText) inverterRatingText.textContent = data.rating;
      if (inverterBatteryText) inverterBatteryText.textContent = data.battery;
      if (inverterAppText) inverterAppText.textContent = data.app;
    });
  });

  // D. Decision Tree Engine (Section 07)
  const dtChoices = {
    space: 'home',
    load: 'medium',
    backup: 'hybrid'
  };

  const dtButtons = document.querySelectorAll('.dt-choice-btn');
  const dtOutputTitle = document.getElementById('dt-output-title');
  const dtOutputSpecs = document.getElementById('dt-output-specs');
  const dtOutputCta = document.getElementById('dt-output-cta');

  function calculateDecisionTree() {
    let title = '';
    let specs = '';
    let prefill = '';

    const s = dtChoices.space;
    const l = dtChoices.load;
    const b = dtChoices.backup;

    if (s === 'home') {
      if (b === 'inverter' || l === 'light') {
        title = '2.5 kVA Pure Sine Inverter + 150Ah LiFePO4 Battery';
        specs = 'Silent operation, sub-10ms transfer, zero maintenance, 6-8 hrs backup for essential home appliances.';
        prefill = 'Home 2.5 kVA LiFePO4 Inverter System';
      } else if (b === 'generator') {
        title = '3.5 kVA Silent Portable Petrol/LPG Genset';
        specs = 'Acoustic canopy (<58 dBA), powers 1.5-ton AC + refrigerator, electric start, compact balcony footprint.';
        prefill = 'Home 3.5 kVA Silent Petrol Genset';
      } else {
        title = '5 kVA Hybrid Power Setup (3 kVA Inverter + 5 kVA Auto Genset)';
        specs = 'Instant zero-flicker battery bridge with automated generator engine start for extended power cuts.';
        prefill = 'Home 5 kVA Hybrid Inverter + Genset System';
      }
    } else if (s === 'shop') {
      if (b === 'inverter') {
        title = '5 kVA High-Surge Inverter + 2x 200Ah Tubular Battery Bank';
        specs = 'Heavy surge handling for cold refrigeration compressors and non-stop billing POS counter uptime.';
        prefill = 'Shop 5 kVA Inverter + Tubular Bank';
      } else {
        title = '7.5 kVA Silent CPCB-II Diesel Genset with AMF Auto-Start';
        specs = 'Full shop floor coverage including display chillers, air curtains, and emergency lighting.';
        prefill = 'Shop 7.5 kVA Diesel Generator Setup';
      }
    } else if (s === 'office') {
      if (b === 'inverter') {
        title = '10 kVA 3-Phase Online UPS Inverter + 8x Lithium Battery Rack';
        specs = 'Zero-millisecond transfer for enterprise server racks, cloud gateways, and 30+ desktop computers.';
        prefill = 'Office 10 kVA Online UPS Battery System';
      } else {
        title = '15 kVA 3-Phase Silent Diesel Genset with Automated ATS';
        specs = 'Complete office floor coverage: servers, VRF air conditioning, conference audiovisuals, and AMF panel.';
        prefill = 'Office 15 kVA 3-Phase Generator Setup';
      }
    } else { // commercial
      title = '30 – 100+ kVA Multi-Cylinder Turbo Diesel Power Station';
      specs = 'Turnkey engineered power plant with automated synchronizing AMF panel, acoustic canopy & 24/7 AMC support.';
      prefill = 'Commercial 30-100+ kVA Industrial Power Station';
    }

    if (dtOutputTitle) dtOutputTitle.textContent = title;
    if (dtOutputSpecs) dtOutputSpecs.textContent = specs;
    if (dtOutputCta) dtOutputCta.setAttribute('data-prefill-service', `Configured Solution: ${prefill}`);
  }

  dtButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const step = btn.getAttribute('data-dt-step');
      const val = btn.getAttribute('data-dt-val');
      if (!step || !val) return;

      dtChoices[step] = val;

      const groupBtns = document.querySelectorAll(`.dt-choice-btn[data-dt-step="${step}"]`);
      groupBtns.forEach(b => b.classList.remove('selected'));
      btn.classList.add('selected');

      calculateDecisionTree();
    });
  });

  // E. Product Showroom Instant Quote Form Handler (Section 08)
  const productQuoteForm = document.getElementById('product-quote-form');
  const productQuoteSuccess = document.getElementById('product-quote-success');

  if (productQuoteForm) {
    productQuoteForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const submitBtn = productQuoteForm.querySelector('button[type="submit"]');
      const originalText = submitBtn ? submitBtn.innerHTML : 'Calculate & Get Equipment Estimate →';

      if (submitBtn) {
        submitBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin mr-2"></i> Generating Equipment Spec...';
        submitBtn.disabled = true;
      }

      setTimeout(() => {
        if (productQuoteForm && productQuoteSuccess) {
          productQuoteForm.classList.add('hidden');
          productQuoteSuccess.classList.remove('hidden');
        }
        if (submitBtn) {
          submitBtn.innerHTML = originalText;
          submitBtn.disabled = false;
        }
      }, 650);
    });
  }

  // =========================================================================
  // 12. REPAIR SERVICES PAGE INTERACTIVE CONTROLLERS
  // =========================================================================

  // A. Symptom Map Interactive Selector (Section 02)
  const symptomBtns = document.querySelectorAll('.symptom-tag-btn');
  const symptomTitle = document.getElementById('symptom-detail-title');
  const symptomCause = document.getElementById('symptom-detail-cause');
  const symptomInspect = document.getElementById('symptom-detail-inspect');
  const symptomAction = document.getElementById('symptom-detail-action');
  const symptomPriority = document.getElementById('symptom-detail-priority');
  const symptomPrefillBtn = document.getElementById('symptom-prefill-btn');

  const symptomData = {
    'gen-not-start': {
      title: 'Generator Will Not Crank / Start',
      cause: 'Depleted 12V starter battery, choked fuel solenoid, faulty ignition key switch, or air-locked diesel line.',
      inspect: 'Starter motor draw, battery cranking CCA, fuel cut-off solenoid continuity, and fuel filter cleanliness.',
      action: 'Electrolyte recharge / battery replacement, bleeding fuel system, solenoid terminal cleaning.',
      priority: 'HIGH PRIORITY',
      priorityClass: 'text-amber-500',
      prefill: 'Emergency Repair: Generator Won\'t Start'
    },
    'gen-stops-sudden': {
      title: 'Generator Starts but Stops Suddenly',
      cause: 'Low engine oil pressure sensor trip, high coolant temperature safety cutoff, or clogged fuel tank breather.',
      inspect: 'Lube oil level & viscosity sensor, radiator coolant flow, fuel filter flow rate, and overheat sensors.',
      action: 'Oil top-up/sensor calibration, coolant flushing, fuel line cleaning and safety bypass testing.',
      priority: 'CRITICAL PRIORITY',
      priorityClass: 'text-red-500',
      prefill: 'Urgent Repair: Generator Stops Suddenly Under Load'
    },
    'low-power-output': {
      title: 'Low Power Output / Inadequate Capacity',
      cause: 'AVR excitation voltage loss, carbon-fouled alternator brushes, engine governor droop, or heavy overload.',
      inspect: 'Automatic Voltage Regulator (AVR) output, stator coil resistance, governor frequency (50 Hz ± 1%).',
      action: 'AVR replacement/tuning, governor spring adjustment, and load circuit balancing.',
      priority: 'HIGH PRIORITY',
      priorityClass: 'text-amber-500',
      prefill: 'Service: Low Power / Capacity Output Fault'
    },
    'excessive-smoke': {
      title: 'Excessive Black / White / Blue Smoke',
      cause: 'Black: Choked air filter or faulty fuel injector; White: Water in fuel or timing fault; Blue: Piston oil burn.',
      inspect: 'Air cleaner restriction indicator, diesel injector spray atomization, cylinder compression ratio.',
      action: 'Air filter replacement, injector nozzle calibration, cylinder valve seal replacement.',
      priority: 'STANDARD PRIORITY',
      priorityClass: 'text-slate-300',
      prefill: 'Service: Generator Engine Smoke Diagnostics'
    },
    'battery-not-charge': {
      title: 'Backup Battery Not Charging',
      cause: 'Dynamo charging alternator rectifier diode failure, loose V-belt, or dead internal battery cell.',
      inspect: 'Charging alternator DC output voltage (13.8V – 14.4V), battery conductance & internal impedance.',
      action: 'Belt tensioning, rectifier bridge repair, or battery pack replacement.',
      priority: 'HIGH PRIORITY',
      priorityClass: 'text-amber-500',
      prefill: 'Repair: Battery Not Charging Issue'
    },
    'inverter-not-on': {
      title: 'Inverter Completely Dead / Not Powering Up',
      cause: 'Internal DC fuse blown, shorted MOSFET power transistors, micro-controller PCB trip, or deep battery drain.',
      inspect: 'Battery DC bus voltage (>10.5V), DC fuse link, MOSFET bridge continuity, and main PCB traces.',
      action: 'MOSFET component-level micro-soldering, fuse replacement, and battery recovery boost charge.',
      priority: 'HIGH PRIORITY',
      priorityClass: 'text-amber-500',
      prefill: 'Emergency Repair: Inverter Dead / Not Turning On'
    },
    'backup-time-low': {
      title: 'Backup Runtime Significantly Reduced',
      cause: 'Battery capacity degradation, severe lead-plate sulfation, low electrolyte levels, or creeping load increase.',
      inspect: 'Specific gravity of each cell with optical hydrometer, Ah discharge curve under 50% load.',
      action: 'Distilled water top-up, desulfation rejuvenation cycle, or battery bank replacement.',
      priority: 'STANDARD PRIORITY',
      priorityClass: 'text-slate-300',
      prefill: 'Service: Inverter Low Backup Duration Audit'
    },
    'overheating': {
      title: 'Engine / Inverter Overheating Alarm',
      cause: 'Radiator fin choke, blocked cooling fan duct, coolant pump impeller failure, or poor room ventilation.',
      inspect: 'Radiator delta-T temperature, cooling fan RPM, inverter heatsink thermal paste, and ambient airflow.',
      action: 'Radiator pressure wash, coolant flush, thermal paste renewal, and ventilation ducting.',
      priority: 'CRITICAL PRIORITY',
      priorityClass: 'text-red-500',
      prefill: 'Urgent Service: Generator / Inverter Overheating'
    },
    'unusual-noise': {
      title: 'Unusual Engine Clatter, Squeal or Humming',
      cause: 'Worn alternator bearing, loose pulley belt, valve tappet clearance misalignment, or inverter inductor hum.',
      inspect: 'Alternator bearing play with stethoscope, valve clearance feeler gauge, fan belt wear.',
      action: 'Bearing replacement, tappet clearance setting, belt replacement, and anti-vibration pad renewal.',
      priority: 'STANDARD PRIORITY',
      priorityClass: 'text-slate-300',
      prefill: 'Service: Mechanical Noise / Vibration Diagnostics'
    },
    'voltage-fluctuation': {
      title: 'Severe Voltage Fluctuation / Flickering Lights',
      cause: 'Failing AVR circuit, mechanical engine hunting, poor neutral earthing bond, or loose switchgear lugs.',
      inspect: 'Earth-to-neutral voltage (<2V), AVR trimmer potentiometer, mechanical governor dashpot damper.',
      action: 'AVR replacement, neutral earthing pit rejuvenation, and busbar torque re-tightening.',
      priority: 'HIGH PRIORITY',
      priorityClass: 'text-amber-500',
      prefill: 'Repair: Voltage Fluctuation & Neutral Inspection'
    }
  };

  symptomBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const key = btn.getAttribute('data-symptom') || 'gen-not-start';
      const data = symptomData[key];
      if (!data) return;

      symptomBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      if (symptomTitle) symptomTitle.textContent = data.title;
      if (symptomCause) symptomCause.textContent = data.cause;
      if (symptomInspect) symptomInspect.textContent = data.inspect;
      if (symptomAction) symptomAction.textContent = data.action;
      if (symptomPriority) {
        symptomPriority.textContent = data.priority;
        symptomPriority.className = `font-mono font-bold text-xs ${data.priorityClass}`;
      }
      if (symptomPrefillBtn) {
        symptomPrefillBtn.setAttribute('data-prefill-service', data.prefill);
      }
    });
  });

  // B. Generator Repair Lab Inspection Zones (Section 03)
  const genZoneBtns = document.querySelectorAll('.gen-zone-btn');
  const genZoneTitle = document.getElementById('gen-zone-title');
  const genZoneDesc = document.getElementById('gen-zone-desc');
  const genZoneAction = document.getElementById('gen-zone-action');

  const genZoneData = {
    '01': {
      title: '01. Diesel / Petrol Internal Combustion Engine',
      desc: 'Cylinder compression measurement, piston ring blow-by inspection, valve tappet clearance adjustment, and oil pump pressure calibration.',
      action: 'Procedure: Compression gauge testing + head gasket thermal inspection'
    },
    '02': {
      title: '02. Precision Fuel Delivery System',
      desc: 'High-pressure fuel injection pump timing, injector atomization pattern testing, fuel water separator servicing, and electronic governor calibration.',
      action: 'Procedure: Nozzle pop-testing + high pressure line de-aeration'
    },
    '03': {
      title: '03. Radiator & Forced Air Cooling Circuit',
      desc: 'Thermal core descaling, coolant pH & anti-freeze specific gravity check, thermostat valve opening verification, and fan belt tension calibration.',
      action: 'Procedure: Radiator pressure cap testing + infrared thermal imaging'
    },
    '04': {
      title: '04. Brushless Alternator & Rotor Core',
      desc: 'Megger insulation testing (>10 MΩ), stator winding resistance balancing, exciter diode bridge verification, and bearing lubrication.',
      action: 'Procedure: 1000V DC Megger test + AVR voltage regulation calibration'
    },
    '05': {
      title: '05. High-Crank Starter Battery System',
      desc: 'Internal conductance testing, cold cranking amperage (CCA) capacity verification, charging dynamo diode check, and terminal corrosion treatment.',
      action: 'Procedure: Digital battery conductance scan + starter draw amp test'
    },
    '06': {
      title: '06. Microprocessor AMF Control Panel',
      desc: 'Automatic mains failure (AMF) interlock testing, engine safety shut-off sensors (LOP, HCT), digital LCD controller firmware diagnostic.',
      action: 'Procedure: Automated grid-cutover simulation + fault code clearance'
    },
    '07': {
      title: '07. Heavy Gauge Control & Power Wiring',
      desc: 'Torque check on all busbar terminals, neutral-to-earth bonding verification (<2Ω), cable insulation resistance, and crimp lug integrity.',
      action: 'Procedure: Calibrated torque wrench verification + thermal scan'
    },
    '08': {
      title: '08. Step-Load Power Output Stage',
      desc: 'Full step-load testing (25%, 50%, 75%, 100% load steps), voltage stability (AVR), frequency response (50 Hz ± 0.5%), and THD harmonic distortion check.',
      action: 'Procedure: Portable resistive load bank step verification'
    }
  };

  genZoneBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const zone = btn.getAttribute('data-gen-zone') || '01';
      const data = genZoneData[zone];
      if (!data) return;

      genZoneBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      if (genZoneTitle) genZoneTitle.textContent = data.title;
      if (genZoneDesc) genZoneDesc.textContent = data.desc;
      if (genZoneAction) genZoneAction.textContent = data.action;
    });
  });

  // C. Inverter & Battery Live Circuit Diagnostic Simulation (Section 04)
  const runDiagnosticBtn = document.getElementById('run-circuit-diagnostic-btn');
  const circuitNodes = document.querySelectorAll('.circuit-diagnostic-node');
  const circuitReportBox = document.getElementById('circuit-diagnostic-report');

  if (runDiagnosticBtn) {
    runDiagnosticBtn.addEventListener('click', () => {
      runDiagnosticBtn.disabled = true;
      runDiagnosticBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin mr-2"></i> Running Live Diagnostics...';

      if (circuitReportBox) {
        circuitReportBox.innerHTML = `
          <div class="flex items-center space-x-2 rtl:space-x-reverse text-blue-400 font-mono text-xs animate-pulse">
            <i class="fa-solid fa-wave-square"></i>
            <span>Injecting test load waveform across Grid, Inverter DSP, and Battery Bank...</span>
          </div>
        `;
      }

      circuitNodes.forEach(node => node.classList.add('circuit-node-testing'));

      setTimeout(() => {
        circuitNodes.forEach(node => node.classList.remove('circuit-node-testing'));
        runDiagnosticBtn.disabled = false;
        runDiagnosticBtn.innerHTML = '<i class="fa-solid fa-rotate-right mr-2"></i> Re-Run Diagnostic Scan';

        if (circuitReportBox) {
          circuitReportBox.innerHTML = `
            <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs font-mono">
              <div class="flex items-center space-x-2 rtl:space-x-reverse text-emerald-400 font-bold">
                <i class="fa-solid fa-circle-check text-sm"></i>
                <span>CIRCUIT STATUS: 100% HEALTHY • PURE SINE WAVE (THD &lt; 2.5%) • 230V ± 1%</span>
              </div>
              <button type="button" data-modal-open="booking-modal" data-prefill-service="Schedule Comprehensive Circuit Health Audit" class="text-amber-400 underline font-bold hover:text-amber-300">
                Book Real-World On-Site Diagnostic →
              </button>
            </div>
          `;
        }
      }, 1600);
    });
  }

  // =========================================================================
  // 13. AMC PLANS PAGE INTERACTIVE CONTROLLERS
  // =========================================================================

  // A. 12-Month Maintenance Calendar Selector (Section 04)
  const monthBtns = document.querySelectorAll('.calendar-month-btn');
  const calActiveMonth = document.getElementById('cal-active-month');
  const calGenAction = document.getElementById('cal-gen-action');
  const calInvAction = document.getElementById('cal-inv-action');
  const calBatAction = document.getElementById('cal-bat-action');
  const calServiceNote = document.getElementById('cal-service-note');

  const calendarData = {
    'jan': {
      monthTitle: 'JANUARY // WINTER FLUID & STARTER AUDIT',
      gen: 'Cold-crank starter CCA battery draw verification & anti-gel fuel additive inspection.',
      inv: 'DSP firmware baseline diagnostic and voltage surge suppressors (MOV) check.',
      bat: 'Electrolyte specific gravity test across all cells (target: 1.240–1.260 SG).',
      note: 'Q1 Scheduled Preventive Health Visit 01'
    },
    'feb': {
      monthTitle: 'FEBRUARY // EXHAUST & ACOUSTIC BAFFLE SCAN',
      gen: 'Exhaust silencer backpressure test & vibration isolator pad integrity check.',
      inv: 'Cooling fan bearing lubrication & internal dust purge using dry nitrogen.',
      bat: 'Terminal post torque verification and petroleum jelly anti-corrosion renewal.',
      note: 'Routine Remote Telemetry & Fluid Level Verification'
    },
    'mar': {
      monthTitle: 'MARCH // PRE-SUMMER PEAK SURGE AUDIT',
      gen: 'Lube oil replacement (15W-40 CI-4), spin-on fuel filter renewal & valve tappet check.',
      inv: 'Full step-load inverter transfer simulation & harmonic THD waveform capture.',
      bat: 'Conductance impedance measurement to identify aging or high-resistance cells.',
      note: 'Pre-Summer Critical Load Preparedness Audit'
    },
    'apr': {
      monthTitle: 'APRIL // RADIATOR CORE & THERMAL FLUSH',
      gen: 'Radiator external fin pressure descaling, coolant pH test & fan belt tension setting.',
      inv: 'MOSFET power heatsink thermal paste inspection with infrared thermal camera.',
      bat: 'Distilled water top-up across tubular bank & equalization boost charge.',
      note: 'Thermal Equilibrium & Overheat Protection Inspection'
    },
    'may': {
      monthTitle: 'MAY // CONTINUOUS RUNTIME PEAK LOAD TEST',
      gen: '2-Hour continuous prime power run test with resistive load bank at 80% capacity.',
      inv: 'Automatic transfer switch (ATS) sub-10ms changeover relay contact inspection.',
      bat: 'High-rate discharge test under simulated 100% building blackout.',
      note: 'Q2 Major Load-Bank Commissioning & Stress Test'
    },
    'jun': {
      monthTitle: 'JUNE // MONSOON MOISTURE & EARTHING CHECK',
      gen: 'Alternator stator & rotor 1000V Megger insulation scan (>10 MΩ target).',
      inv: 'Conformal PCB coating inspection & moisture ingress barrier seal renewal.',
      bat: 'Neutral-to-earth impedance audit on battery racks and DC isolator switch.',
      note: 'Monsoon Insulation Resistance & Weatherproofing Audit'
    },
    'jul': {
      monthTitle: 'JULY // FUEL WATER-SEPARATOR & TANK PURGE',
      gen: 'Fuel sediment drain, primary water-separator cartridge replacement & tank breather check.',
      inv: 'DC capacitor bank ESR capacitance test to prevent ripple voltage degradation.',
      bat: 'Terminal voltage balancing across series battery bank under float charge.',
      note: 'Fuel Quality & DC Bus Ripple Voltage Analysis'
    },
    'aug': {
      monthTitle: 'AUGUST // GOVERNOR FREQUENCY & AVR TUNING',
      gen: 'Mechanical/electronic governor speed calibration (50.0 Hz ± 0.5% at no-load).',
      inv: 'Output pure sine wave voltage regulation calibration (230V ± 1.0%).',
      bat: 'Inter-cell connector busbar resistance test using micro-ohmmeter.',
      note: 'Voltage Stability & Frequency Drift Rectification'
    },
    'sep': {
      monthTitle: 'SEPTEMBER // POST-MONSOON SERVICE & LUBE CHANGE',
      gen: 'Engine lube oil & secondary fuel filter renewal; air cleaner element replacement.',
      inv: 'Control keypad & digital LCD telemetry diagnostics and safety alarm test.',
      bat: 'Specific gravity audit & top-up of de-ionized battery water.',
      note: 'Q3 Comprehensive Preventive Service & Fluid Renewal'
    },
    'oct': {
      monthTitle: 'OCTOBER // CONTROL PANEL AMF SIMULATION',
      gen: 'Simulated mains utility power failure to verify 8-second auto-start & load transfer.',
      inv: 'Mains-fail sensing circuit sensitivity calibration & battery cut-off threshold test.',
      bat: 'Battery charger float-to-boost automatic transition voltage verification.',
      note: 'Automated Failover & AMF Logic Validation'
    },
    'nov': {
      monthTitle: 'NOVEMBER // TURBOCHARGER & COMPRESSION CHECK',
      gen: 'Cylinder compression measurement across all cylinders & turbo boost pressure scan.',
      inv: 'AC output breaker thermal trip curve test & emergency shut-off validation.',
      bat: 'Conductance health score logging for annual lifespan forecasting report.',
      note: 'Mechanical Wear & Degradation Index Assessment'
    },
    'dec': {
      monthTitle: 'DECEMBER // ANNUAL COMPREHENSIVE CERTIFICATION',
      gen: '100% Step-load resistive bank testing, oil spectral analysis, full torque signoff.',
      inv: 'Complete component-level diagnostic signoff & pure sine wave certification.',
      bat: 'Full battery capacity Ah rating certification & annual AMC health certificate.',
      note: 'Q4 Annual Comprehensive System Health Certification'
    }
  };

  monthBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const m = btn.getAttribute('data-month') || 'mar';
      const data = calendarData[m];
      if (!data) return;

      monthBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      if (calActiveMonth) calActiveMonth.textContent = data.monthTitle;
      if (calGenAction) calGenAction.textContent = data.gen;
      if (calInvAction) calInvAction.textContent = data.inv;
      if (calBatAction) calBatAction.textContent = data.bat;
      if (calServiceNote) calServiceNote.textContent = data.note;
    });
  });

  // B. Dependency-Based AMC Plan Band Highlighting (Section 05)
  const amcDependencyBtns = document.querySelectorAll('.amc-dep-btn');
  const amcPlanBands = document.querySelectorAll('.amc-plan-band');

  const dependencyMap = {
    'home': 'essential',
    'shop': 'professional',
    'office': 'professional',
    'critical': 'critical-power'
  };

  amcDependencyBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const dep = btn.getAttribute('data-amc-dep') || 'home';
      const targetPlan = dependencyMap[dep];

      amcDependencyBtns.forEach(b => {
        b.classList.remove('bg-amber-500', 'text-slate-950', 'font-bold');
        b.classList.add('bg-white', 'dark:bg-slate-900', 'text-slate-700', 'dark:text-slate-300');
      });
      btn.classList.add('bg-amber-500', 'text-slate-950', 'font-bold');
      btn.classList.remove('bg-white', 'dark:bg-slate-900', 'text-slate-700', 'dark:text-slate-300');

      amcPlanBands.forEach(band => {
        const planKey = band.getAttribute('data-plan-key');
        if (planKey === targetPlan) {
          band.classList.add('highlighted');
          band.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        } else {
          band.classList.remove('highlighted');
        }
      });
    });
  });

  // =========================================================================
  // 14. SERVICE AREAS PAGE INTERACTIVE CONTROLLERS
  // =========================================================================

  // A. Location Search Finder (Section 03)
  const areaSearchInput = document.getElementById('area-search-input');
  const areaSearchBtn = document.getElementById('area-search-btn');
  const areaSearchResult = document.getElementById('area-search-result');
  const areaQuickFilters = document.querySelectorAll('.area-quick-filter');

  const sampleAreaDirectory = [
    {
      keywords: ['central', 'downtown', 'metro', 'hub', 'core', 'city'],
      zoneName: 'CENTRAL METRO // REGIONAL HUB 01',
      status: 'FULL SERVICE ACTIVE',
      statusClass: 'text-white bg-emerald-500/10 border-emerald-500/30',
      sla: 'SLA: < 30 Mins (Primary Rapid Zone)',
      services: ['24/7 Generator Breakdown Repair', 'Pure Sine Inverter Installation', 'Battery Diagnostics', 'Commercial AMC']
    },
    {
      keywords: ['north', 'industrial', 'plant', 'factory', 'belt'],
      zoneName: 'NORTH ZONE // INDUSTRIAL BELT 02',
      status: 'FULL HEAVY FLEET ACTIVE',
      statusClass: 'text-white bg-emerald-500/10 border-emerald-500/30',
      sla: 'SLA: < 45 Mins (Heavy Genset Van Ready)',
      services: ['3-Phase Genset Overhaul', '100% Load-Bank Testing', 'Bi-Monthly Industrial AMC', 'OEM Spares Van']
    },
    {
      keywords: ['east', 'commercial', 'tech', 'park', 'plaza', 'office'],
      zoneName: 'EAST COMMERCIAL // SECTOR 03',
      status: 'ENTERPRISE COVERAGE ACTIVE',
      statusClass: 'text-white bg-emerald-500/10 border-emerald-500/30',
      sla: 'SLA: < 35 Mins (Office UPS & Genset Dispatch)',
      services: ['Server Room UPS Diagnostics', 'Silent Inverter Service', 'AMF Panel Sync', 'Quarterly AMC']
    },
    {
      keywords: ['west', 'highway', 'suburb', 'residence', 'home', 'town'],
      zoneName: 'WEST HIGHWAY // RESIDENTIAL CORRIDOR 04',
      status: 'RESIDENTIAL & RETAIL ACTIVE',
      statusClass: 'text-white bg-emerald-500/10 border-emerald-500/30',
      sla: 'SLA: < 45 Mins (Mobile Tech Unit)',
      services: ['Home Inverter Installation', 'Tubular Battery Top-Up', 'Silent Diesel Gen Tuneup', 'Essential AMC']
    },
    {
      keywords: ['south', 'valley', 'coastal', 'harbor', 'terminal'],
      zoneName: 'SOUTH TECH VALLEY // SUB-ZONE 05',
      status: 'FULL SERVICE ACTIVE',
      statusClass: 'text-white bg-emerald-500/10 border-emerald-500/30',
      sla: 'SLA: < 40 Mins (Rapid Dispatch Unit)',
      services: ['Emergency 24/7 Breakdown', 'Inverter DSP Diagnostics', 'Battery Rejuvenation', 'Preventive AMC']
    }
  ];

  function runAreaSearch(query) {
    if (!areaSearchResult) return;
    const cleanQuery = (query || '').trim().toLowerCase();

    let matched = null;
    if (cleanQuery) {
      matched = sampleAreaDirectory.find(area =>
        area.keywords.some(k => cleanQuery.includes(k)) || area.zoneName.toLowerCase().includes(cleanQuery)
      );
    }

    if (!matched && cleanQuery) {
      // Extended zone fallback
      areaSearchResult.innerHTML = `
        <div class="p-6 rounded-2xl bg-slate-900 border border-slate-800 text-white space-y-4">
          <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-3">
            <div>
              <span class="text-xs font-mono font-bold text-amber-400 block">[OUTSIDE STANDARD GRID]</span>
              <h4 class="text-base font-bold font-heading text-white">Extended Service Coverage: "${query}"</h4>
            </div>
            <span class="px-2.5 py-1 rounded text-xs font-mono font-bold bg-amber-500/10 border border-amber-500/30 text-amber-400">
              CONFIRMATION REQUIRED
            </span>
          </div>
          <p class="text-xs text-slate-300">
            Technician dispatch to this extended location is available on confirmed reservation. Our logistics coordinator will verify travel timing.
          </p>
          <div class="flex flex-wrap items-center gap-3 pt-1">
            <button type="button" data-modal-open="booking-modal" data-prefill-service="Extended Area Coverage Check: ${query}" class="px-5 py-2.5 rounded-lg btn-primary text-xs font-bold uppercase tracking-wider">
              Request Extended Area Dispatch →
            </button>
            <a href="tel:18001234567" class="text-xs font-mono text-amber-400 hover:underline">
              Call Dispatch Hub: 1800 123 4567
            </a>
          </div>
        </div>
      `;
    } else if (matched) {
      // Matched Zone
      areaSearchResult.innerHTML = `
        <div class="p-6 rounded-2xl bg-slate-900 border border-slate-800 text-white space-y-4">
          <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-3">
            <div>
              <span class="text-xs font-mono font-bold text-emerald-400 block">[PRIMARY COVERAGE VERIFIED]</span>
              <h4 class="text-base font-bold font-heading text-white">${matched.zoneName}</h4>
            </div>
            <span class="px-2.5 py-1 rounded text-xs font-mono font-bold ${matched.statusClass} border">
              ${matched.status}
            </span>
          </div>
          <div class="text-xs font-mono text-amber-400 font-semibold">
            ${matched.sla}
          </div>
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs font-mono text-white">
            ${matched.services.map(s => `<div class="flex items-center space-x-2 rtl:space-x-reverse"><i class="fa-solid fa-check text-emerald-400"></i><span class="text-white">${s}</span></div>`).join('')}
          </div>
          <div class="pt-2 flex flex-wrap items-center justify-between gap-3">
            <button type="button" data-modal-open="booking-modal" data-prefill-service="Book Dispatch to ${matched.zoneName}" class="px-5 py-2.5 rounded-lg btn-primary text-xs font-bold uppercase tracking-wider">
              Book Service in This Zone →
            </button>
            <span class="text-[11px] font-mono text-white">Next Available Van: In 15 Mins</span>
          </div>
        </div>
      `;
    }
  }

  if (areaSearchBtn && areaSearchInput) {
    areaSearchBtn.addEventListener('click', () => {
      runAreaSearch(areaSearchInput.value);
    });

    areaSearchInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        runAreaSearch(areaSearchInput.value);
      }
    });
  }

  areaQuickFilters.forEach(btn => {
    btn.addEventListener('click', () => {
      const q = btn.getAttribute('data-quick-area') || 'central';
      if (areaSearchInput) areaSearchInput.value = q;
      runAreaSearch(q);
    });
  });

  // B. Service Zone Map Switcher (Section 04)
  const zoneBtns = document.querySelectorAll('.service-zone-btn');
  const zoneTitle = document.getElementById('zone-inspector-title');
  const zoneSla = document.getElementById('zone-inspector-sla');
  const zoneDesc = document.getElementById('zone-inspector-desc');
  const zonePrefillBtn = document.getElementById('zone-inspector-prefill-btn');

  const zoneData = {
    'zone-01': {
      title: 'ZONE 01: CENTRAL METRO // HUB 01',
      sla: 'RAPID RESPONSE SLA: < 30 MINS',
      desc: 'High-density urban coverage with 4 dedicated mobile vans stationed at the Central Workshop. Full support for residential inverters, silent gensets, and corporate high-availability UPS.',
      prefill: 'Service Dispatch: Central Metro Hub 01'
    },
    'zone-02': {
      title: 'ZONE 02: NORTH ZONE // INDUSTRIAL BELT 02',
      sla: 'RAPID RESPONSE SLA: < 45 MINS',
      desc: 'Industrial manufacturing plants, pharmaceutical facilities, and cold storage warehouses. Equipped with mobile 100% resistive load banks and high-kVA replacement spares.',
      prefill: 'Service Dispatch: North Industrial Belt 02'
    },
    'zone-03': {
      title: 'ZONE 03: EAST COMMERCIAL // SECTOR 03',
      sla: 'RAPID RESPONSE SLA: < 35 MINS',
      desc: 'Retail shopping centers, IT tech parks, private hospitals, and hotel complexes. Specialized in automatic AMF transfer panels, pure sine wave inverters, and emergency fuel drops.',
      prefill: 'Service Dispatch: East Commercial Sector 03'
    },
    'zone-04': {
      title: 'ZONE 04: WEST HIGHWAY // CORRIDOR 04',
      sla: 'RAPID RESPONSE SLA: < 45 MINS',
      desc: 'Gated residential communities, educational institutes, and highway logistics parks. Routine quarterly maintenance visits, battery top-ups, and on-demand diesel generator repair.',
      prefill: 'Service Dispatch: West Highway Corridor 04'
    }
  };

  zoneBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const zKey = btn.getAttribute('data-zone-key') || 'zone-01';
      const data = zoneData[zKey];
      if (!data) return;

      zoneBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      if (zoneTitle) zoneTitle.textContent = data.title;
      if (zoneSla) zoneSla.textContent = data.sla;
      if (zoneDesc) zoneDesc.textContent = data.desc;
      if (zonePrefillBtn) zonePrefillBtn.setAttribute('data-prefill-service', data.prefill);
    });
  });

  // C. Location Type Bands (Section 05)
  const locTypeBands = document.querySelectorAll('.location-type-band');
  const locTypeOutput = document.getElementById('loc-type-recommendation');

  const locTypeData = {
    'home': 'Home Recommendation: Pure Sine Wave Inverter (1–3 kVA) + Tubular Battery Bank + Annual Essential AMC.',
    'shop': 'Retail Shop Recommendation: Silent Diesel/Petrol Generator (3–7.5 kVA) with AMF Auto-Start + Professional AMC.',
    'office': 'Corporate Office Recommendation: 15–30 kVA 3-Phase Soundproof Genset + High-Capacity Online Inverter System.',
    'commercial': 'Industrial Facility Recommendation: 50–250+ kVA Multi-Generator Fleet + 24/7 VIP Critical Power AMC Contract.'
  };

  locTypeBands.forEach(band => {
    band.addEventListener('click', () => {
      const loc = band.getAttribute('data-loc-type') || 'home';
      locTypeBands.forEach(b => b.classList.remove('active'));
      band.classList.add('active');

      if (locTypeOutput) {
        locTypeOutput.textContent = locTypeData[loc] || locTypeData['home'];
      }
    });
  });

  // =========================================================================
  // 15. CONTACT & BOOKING COMMAND CENTER CONTROLLERS
  // =========================================================================

  // A. Service Intake Selector (Section 02)
  const intakeOptionRows = document.querySelectorAll('.intake-option-row');
  const intakeTitle = document.getElementById('intake-selected-title');
  const intakeNext = document.getElementById('intake-selected-next');
  const intakeInfo = document.getElementById('intake-selected-info');
  const intakePrefillBtn = document.getElementById('intake-prefill-btn');

  const intakeData = {
    'repair': {
      title: 'EMERGENCY REPAIR & BREAKDOWN RESTORATION',
      next: 'Describe the symptom (not starting, voltage drop, noise) and equipment location for immediate dispatch.',
      info: 'Equipment brand, approximate kVA capacity, failure symptoms, and access notes.',
      prefill: 'Repair Service: Emergency Breakdown Request'
    },
    'maintenance': {
      title: 'PERIODIC PREVENTIVE SERVICE & FLUID TUNEUP',
      next: 'Select preferred date for oil/filter change, battery hydrometer check, and general health audit.',
      info: 'Last service date, running hours, and filter part numbers (if available).',
      prefill: 'Maintenance Service: Routine Preventive Overhaul'
    },
    'amc': {
      title: 'ANNUAL MAINTENANCE CONTRACT (AMC) ENROLLMENT',
      next: 'Choose between Essential Residential, Commercial Pro, or 24/7 Critical Power coverage tiers.',
      info: 'Number of backup units, installation environment, and desired inspection frequency.',
      prefill: 'AMC Enrollment: Annual Maintenance Contract Request'
    },
    'installation': {
      title: 'NEW SYSTEM SIZING, DELIVERY & COMMISSIONING',
      next: 'Tell us your building load requirement, phase setup (Single vs. 3-Phase), and site delivery constraints.',
      info: 'Estimated peak wattage, appliance list, acoustic canopy limits, and changeover AMF preferences.',
      prefill: 'Installation: Turnkey Genset/Inverter Commissioning'
    },
    'battery': {
      title: 'BATTERY HEALTH SCAN, TOP-UP & REPLACEMENT',
      next: 'Specify battery chemistry (Tubular Lead-Acid, SMF, LiFePO4 Lithium) and current backup duration issue.',
      info: 'Battery voltage/Ah rating, age in months, and terminal condition.',
      prefill: 'Battery Service: Conductance Test & Replacement'
    },
    'inverter': {
      title: 'PURE SINE WAVE INVERTER & DSP BOARD DIAGNOSTICS',
      next: 'Report inverter error code or MOSFET trip for bench-testing or on-site micro-soldering.',
      info: 'Inverter capacity (VA/kVA), error display code, and connected load types.',
      prefill: 'Inverter Service: Pure Sine Wave Diagnostics'
    },
    'generator': {
      title: 'DIESEL / PETROL GENERATOR OVERHAUL & AVR TUNING',
      next: 'Request high-pressure fuel pump timing, compression gauge testing, or automated AMF sync.',
      info: 'Engine make (Cummins/Kirloskar/Honda), prime kVA rating, and fault code.',
      prefill: 'Generator Service: Engine & Alternator Overhaul'
    },
    'enquiry': {
      title: 'GENERAL CONSULTATION & FLEET PRICING',
      next: 'Connect with a senior power systems engineer to discuss custom electrical solutions or multi-brand orders.',
      info: 'Project outline, timeframe, and contact preferences.',
      prefill: 'General Enquiry: Technical Consultation'
    }
  };

  intakeOptionRows.forEach(row => {
    row.addEventListener('click', () => {
      const key = row.getAttribute('data-intake-key') || 'repair';
      const data = intakeData[key];
      if (!data) return;

      intakeOptionRows.forEach(r => r.classList.remove('active'));
      row.classList.add('active');

      if (intakeTitle) intakeTitle.textContent = data.title;
      if (intakeNext) intakeNext.textContent = data.next;
      if (intakeInfo) intakeInfo.textContent = data.info;
      if (intakePrefillBtn) intakePrefillBtn.setAttribute('data-prefill-service', data.prefill);
    });
  });

  // B. Multi-Step Service Booking Form Controller (Section 03)
  const bookingSteps = document.querySelectorAll('.form-step-panel');
  const stepPills = document.querySelectorAll('.form-step-pill');
  const btnNext1 = document.getElementById('step-next-1');
  const btnNext2 = document.getElementById('step-next-2');
  const btnNext3 = document.getElementById('step-next-3');
  const btnPrev2 = document.getElementById('step-prev-2');
  const btnPrev3 = document.getElementById('step-prev-3');
  const btnPrev4 = document.getElementById('step-prev-4');
  const fullBookingForm = document.getElementById('multi-step-booking-form');
  const bookingSuccessBox = document.getElementById('multi-booking-success');

  // Summary elements
  const sumName = document.getElementById('sum-customer-name');
  const sumPhone = document.getElementById('sum-customer-phone');
  const sumLocation = document.getElementById('sum-location');
  const sumEquipment = document.getElementById('sum-equipment');
  const sumService = document.getElementById('sum-service');
  const sumDateTime = document.getElementById('sum-datetime');

  function goToStep(stepIndex) {
    bookingSteps.forEach((panel, idx) => {
      if (idx === stepIndex) {
        panel.classList.remove('hidden');
      } else {
        panel.classList.add('hidden');
      }
    });

    stepPills.forEach((pill, idx) => {
      if (idx === stepIndex) {
        pill.classList.add('active');
        pill.classList.remove('completed');
      } else if (idx < stepIndex) {
        pill.classList.remove('active');
        pill.classList.add('completed');
      } else {
        pill.classList.remove('active', 'completed');
      }
    });
  }

  if (btnNext1) {
    btnNext1.addEventListener('click', () => {
      const name = document.getElementById('bf-name')?.value.trim();
      const phone = document.getElementById('bf-phone')?.value.trim();
      const loc = document.getElementById('bf-location')?.value.trim();

      if (!name || !phone || !loc) {
        alert('Please fill out your Name, Phone Number, and Location to continue.');
        return;
      }
      goToStep(1);
    });
  }

  if (btnPrev2) btnPrev2.addEventListener('click', () => goToStep(0));

  if (btnNext2) {
    btnNext2.addEventListener('click', () => {
      goToStep(2);
    });
  }

  if (btnPrev3) btnPrev3.addEventListener('click', () => goToStep(1));

  if (btnNext3) {
    btnNext3.addEventListener('click', () => {
      // Assemble review summary
      const name = document.getElementById('bf-name')?.value.trim() || 'N/A';
      const phone = document.getElementById('bf-phone')?.value.trim() || 'N/A';
      const loc = document.getElementById('bf-location')?.value.trim() || 'N/A';
      const eqType = document.getElementById('bf-eq-type')?.value || 'Generator';
      const eqBrand = document.getElementById('bf-eq-brand')?.value.trim() || 'Standard';
      const eqCap = document.getElementById('bf-eq-capacity')?.value.trim() || 'Standard kVA';
      const srvType = document.getElementById('bf-service-type')?.value || 'Emergency Diagnostic';
      const srvDate = document.getElementById('bf-date')?.value || 'Earliest Available';
      const srvTime = document.getElementById('bf-time')?.value || 'Standard Dispatch';

      if (sumName) sumName.textContent = name;
      if (sumPhone) sumPhone.textContent = phone;
      if (sumLocation) sumLocation.textContent = loc;
      if (sumEquipment) sumEquipment.textContent = `${eqType} (${eqBrand}, ${eqCap})`;
      if (sumService) sumService.textContent = srvType;
      if (sumDateTime) sumDateTime.textContent = `${srvDate} @ ${srvTime}`;

      goToStep(3);
    });
  }

  if (btnPrev4) btnPrev4.addEventListener('click', () => goToStep(2));

  if (fullBookingForm) {
    fullBookingForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const submitBtn = fullBookingForm.querySelector('button[type="submit"]');
      if (submitBtn) {
        submitBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin mr-2"></i> Logging Dispatch Request...';
        submitBtn.disabled = true;
      }

      setTimeout(() => {
        if (fullBookingForm && bookingSuccessBox) {
          fullBookingForm.classList.add('hidden');
          bookingSuccessBox.classList.remove('hidden');
        }
      }, 700);
    });
  }

  // C. Demo Request Status Lookup (Section 07)
  const statusCheckBtn = document.getElementById('status-check-btn');
  const statusQueryInput = document.getElementById('status-query-input');
  const statusResultDisplay = document.getElementById('status-result-display');

  if (statusCheckBtn && statusQueryInput && statusResultDisplay) {
    statusCheckBtn.addEventListener('click', () => {
      const q = statusQueryInput.value.trim() || 'SERVICE-8492';
      statusResultDisplay.innerHTML = `
        <div class="p-5 rounded-xl bg-slate-900 border border-slate-800 space-y-3 font-mono text-xs">
          <div class="flex items-center justify-between border-b border-slate-800 pb-2">
            <span class="text-amber-400 font-bold">REQUEST ID: #${q.toUpperCase()}</span>
            <span class="px-2 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/30 text-emerald-400">
              DISPATCH CONFIRMED
            </span>
          </div>
          <div class="space-y-1 text-slate-300">
            <div><strong>STAGE:</strong> Technician Assigned &amp; In Transit</div>
            <div><strong>ASSIGNED UNIT:</strong> Mobile Van #04 (Eng. David K.)</div>
            <div><strong>ESTIMATED ARRIVAL:</strong> Under 25 Minutes</div>
          </div>
          <div class="text-[11px] text-white pt-1">
            Need to reschedule? Call central dispatch: 1800 123 4567
          </div>
        </div>
      `;
    });
  }

  // =========================================================================
  // 16. EMERGENCY CALL TRACKER TOAST
  // =========================================================================
  const emergencyCallBtns = document.querySelectorAll('a[href^="tel:"]');
  emergencyCallBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      console.log('⚡ PowerCore 24/7 Emergency Dispatch Hotline Triggered: 1800 123 4567');
    });
  });







  // =========================================================================
  // 17. SCROLL TO TOP (UP ARROW) CONTROLLER
  // =========================================================================
  const scrollToTopBtn = document.getElementById('scroll-to-top');
  if (scrollToTopBtn) {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 300) {
        scrollToTopBtn.classList.add('visible');
      } else {
        scrollToTopBtn.classList.remove('visible');
      }
    }, { passive: true });

    scrollToTopBtn.addEventListener('click', (e) => {
      e.preventDefault();
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });
  }

});



// <!-- =========================================================================
//      SECTION 05 — SCROLL SCRIPT
//      ========================================================================= -->


document.addEventListener("DOMContentLoaded", function () {

  const section =
    document.querySelector("#reliability-section");

  const items =
    document.querySelectorAll(".reliability-item");

  if (!section) return;


  const observer =
    new IntersectionObserver(
      function (entries) {

        entries.forEach(function (entry) {

          if (entry.isIntersecting) {

            section.classList.add("reliability-visible");

            items.forEach(function (item, index) {

              setTimeout(function () {

                item.classList.add("is-visible");

              }, index * 120);

            });

            observer.unobserve(section);

          }

        });

      },
      {
        threshold: 0.15
      }
    );


  observer.observe(section);

});



// <!-- =========================================================================
//      SECTION 06 — JS
//      ========================================================================= -->



document.addEventListener("DOMContentLoaded", function () {

  const section =
    document.getElementById("engineering-intelligence");

  if (!section) return;

  const observer =
    new IntersectionObserver(
      function (entries) {

        entries.forEach(function (entry) {

          if (entry.isIntersecting) {

            section.classList.add("s06-visible");

            observer.unobserve(section);

          }

        });

      },
      {
        threshold: 0.12
      }
    );

  observer.observe(section);

});


document.addEventListener("DOMContentLoaded", function () {

  const futureSection = document.getElementById("jcdiux");

  if (!futureSection) return;

  const observer = new IntersectionObserver(
    function (entries, obs) {

      entries.forEach(function (entry) {

        if (entry.isIntersecting) {

          futureSection.classList.add("future-visible");

          obs.unobserve(entry.target);

        }

      });

    },
    {
      threshold: 0.15,
      rootMargin: "0px 0px -60px 0px"
    }
  );

  observer.observe(futureSection);

});



// <!-- =========================================================================
//    SECTION 03 — DYNAMIC GENERATOR DATA
//    ========================================================================= -->



document.addEventListener("DOMContentLoaded", function () {

  const section =
    document.getElementById("generator-range-section");

  if (!section) return;


  const points =
    section.querySelectorAll(".generator-scale-point");


  const capacity =
    document.getElementById("gen-detail-capacity");

  const title =
    document.getElementById("gen-detail-title");

  const benefit =
    document.getElementById("gen-detail-benefit");

  const noise =
    document.getElementById("gen-detail-noise");

  const fuel =
    document.getElementById("gen-detail-fuel");

  const fuelShort =
    document.getElementById("gen-detail-fuel-short");

  const output =
    document.getElementById("gen-detail-output");

  const phase =
    document.getElementById("gen-detail-phase");

  const use =
    document.getElementById("gen-detail-use");

  const application =
    document.getElementById("gen-detail-application");

  const image =
    document.getElementById("generator-detail-image");

  const cta =
    document.getElementById("gen-detail-cta");

  const progress =
    document.getElementById("generator-scale-progress");


  const data = {

    "01": {

      capacity: "1–5",

      title:
        "Compact Silent Residential Genset",

      benefit:
        "Ultra-portable compact footprint with acoustic soundproofing for apartments, villas, and small clinics.",

      noise:
        "<58 dBA",

      fuel:
        "PETROL / LPG",

      fuelShort:
        "LPG",

      output:
        "1–5 kVA",

      phase:
        "SINGLE",

      use:
        "RESIDENTIAL",

      application:
        "HOME BACKUP",

      image:
        "assets/images/p6.jpg",

      service:
        "1-5 kVA Compact Silent Genset"

    },


    "02": {

      capacity: "5–10",

      title:
        "Silent Diesel Business Backup System",

      benefit:
        "Efficient backup architecture for larger homes, small shops, clinics, and essential commercial loads.",

      noise:
        "<62 dBA",

      fuel:
        "SILENT DIESEL",

      fuelShort:
        "DIESEL",

      output:
        "5–10 kVA",

      phase:
        "SINGLE",

      use:
        "SMALL BUSINESS",

      application:
        "SHOP / CLINIC",

      image:
        "assets/images/p7.jpg",

      service:
        "5-10 kVA Silent Diesel Genset"

    },


    "03": {

      capacity: "10–25",

      title:
        "Three-Phase Commercial Power System",

      benefit:
        "Balanced three-phase generation for offices, businesses, IT equipment, HVAC, and critical operational loads.",

      noise:
        "<68 dBA",

      fuel:
        "DIESEL",

      fuelShort:
        "DIESEL",

      output:
        "10–25 kVA",

      phase:
        "3-PHASE",

      use:
        "COMMERCIAL",

      application:
        "OFFICE / BUSINESS",

      image:
        "assets/images/p8.jpg",

      service:
        "10-25 kVA Commercial Genset"

    },


    "04": {

      capacity: "25–100",

      title:
        "Heavy-Duty Commercial Diesel System",

      benefit:
        "High-capacity diesel generation designed for commercial facilities, pumps, elevators, HVAC, and demanding backup loads.",

      noise:
        "<72 dBA",

      fuel:
        "TURBO DIESEL",

      fuelShort:
        "DIESEL",

      output:
        "25–100 kVA",

      phase:
        "3-PHASE",

      use:
        "COMMERCIAL",

      application:
        "LARGE FACILITY",

      image:
        "assets/images/p9.jpg",

      service:
        "25-100 kVA Heavy Duty Genset"

    },


    "05": {

      capacity: "100+",

      title:
        "Industrial Multi-Cylinder Power Plant",

      benefit:
        "Industrial-grade generation architecture for production plants, heavy machinery, infrastructure, and high-demand facilities.",

      noise:
        "<78 dBA",

      fuel:
        "INDUSTRIAL DIESEL",

      fuelShort:
        "DIESEL",

      output:
        "100+ kVA",

      phase:
        "3-PHASE",

      use:
        "INDUSTRIAL",

      application:
        "HIGH DEMAND",

      image:
        "assets/images/p10.jpg",

      service:
        "100+ kVA Industrial Genset"

    }

  };


  function updateGenerator(type) {

    const item = data[type];

    if (!item) return;


    /* Active point */

    points.forEach(function (point) {

      point.classList.remove("active");

    });

    const active =
      section.querySelector(
        '[data-gen-range="' + type + '"]'
      );

    if (active) {

      active.classList.add("active");

    }


    /* Progress */

    const positions = {

      "01": "0%",

      "02": "25%",

      "03": "50%",

      "04": "75%",

      "05": "100%"

    };

    if (progress) {

      progress.style.width =
        positions[type];

    }


    /* Image */

    if (image) {

      image.style.opacity = "0.25";

      setTimeout(function () {

        image.src = item.image;

        image.onload = function () {

          image.style.opacity = "0.8";

        };

      }, 180);

    }


    /* Main Data */

    if (capacity)
      capacity.textContent = item.capacity;

    if (title)
      title.textContent = item.title;

    if (benefit)
      benefit.textContent = item.benefit;

    if (noise)
      noise.textContent = item.noise;

    if (fuel)
      fuel.textContent = item.fuel;

    if (fuelShort)
      fuelShort.textContent = item.fuelShort;

    if (output)
      output.textContent = item.output;

    if (phase)
      phase.textContent = item.phase;

    if (use)
      use.textContent = item.use;

    if (application)
      application.textContent = item.application;


    /* Modal Prefill */

    if (cta) {

      cta.dataset.prefillService =
        item.service;

    }

  }


  /* Click events */

  points.forEach(function (point) {

    point.addEventListener("click", function () {

      const type =
        point.getAttribute("data-gen-range");

      updateGenerator(type);

    });

  });


  /* Initial state */

  updateGenerator("01");


  /* Section reveal */

  if ("IntersectionObserver" in window) {

    const observer =
      new IntersectionObserver(
        function (entries, obs) {

          entries.forEach(function (entry) {

            if (entry.isIntersecting) {

              section.classList.add("generator-loaded");

              obs.unobserve(entry.target);

            }

          });

        },
        {
          threshold: 0.12
        }
      );

    observer.observe(section);

  } else {

    section.classList.add("generator-loaded");

  }

});





document.addEventListener("DOMContentLoaded", function () {

  const symptomButtons =
    document.querySelectorAll(".symptom-tag-btn");

  const title =
    document.getElementById("symptom-detail-title");

  const priority =
    document.getElementById("symptom-detail-priority");

  const cause =
    document.getElementById("symptom-detail-cause");

  const inspect =
    document.getElementById("symptom-detail-inspect");

  const action =
    document.getElementById("symptom-detail-action");

  const visualPriority =
    document.getElementById("symptom-visual-priority");

  const signalStatus =
    document.getElementById("symptom-signal-status");

  const prefillButton =
    document.getElementById("symptom-prefill-btn");


  /* ==============================================================
     SYMPTOM DATA
     ============================================================== */

  const symptomData = {

    "gen-not-start": {
      title: "Generator Will Not Crank / Start",
      priority: "HIGH PRIORITY",
      priorityColor: "amber",
      cause:
        "Depleted 12V starter battery, choked fuel solenoid, faulty ignition key switch, or air-locked diesel line.",
      inspect:
        "Starter motor draw, battery cranking CCA, fuel cut-off solenoid continuity, and fuel filter cleanliness.",
      action:
        "Electrolyte recharge / battery replacement, bleeding fuel system, solenoid terminal cleaning.",
      service:
        "Emergency Repair: Generator Won't Start"
    },

    "gen-stops-sudden": {
      title: "Generator Stops Suddenly",
      priority: "CRITICAL",
      priorityColor: "red",
      cause:
        "Low engine oil pressure, fuel starvation, overheating, emergency shutdown activation, or controller trip.",
      inspect:
        "Oil pressure, coolant temperature, fuel supply, controller fault history, and emergency stop circuit.",
      action:
        "Fault-code diagnosis, fluid correction, cooling-system inspection, and controller reset.",
      service:
        "Emergency Repair: Generator Stops Suddenly"
    },

    "low-power-output": {
      title: "Generator Produces Low Power",
      priority: "HIGH PRIORITY",
      priorityColor: "amber",
      cause:
        "AVR instability, overloaded alternator, incorrect excitation, poor fuel delivery, or engine speed variation.",
      inspect:
        "Output voltage, frequency, AVR response, engine RPM, excitation circuit, and connected load.",
      action:
        "AVR calibration, load balancing, excitation repair, fuel-system service, or alternator testing.",
      service:
        "Generator Repair: Low Power Output"
    },

    "excessive-smoke": {
      title: "Excessive Exhaust Smoke",
      priority: "SERVICE REQUIRED",
      priorityColor: "slate",
      cause:
        "Incomplete combustion, dirty air filter, injector issue, excessive oil consumption, or incorrect fuel mixture.",
      inspect:
        "Air intake, injector condition, engine oil level, exhaust temperature, and combustion performance.",
      action:
        "Air-filter replacement, injector testing, oil correction, and combustion-system servicing.",
      service:
        "Generator Repair: Excessive Smoke"
    },

    "battery-not-charge": {
      title: "Battery Is Not Charging",
      priority: "HIGH PRIORITY",
      priorityColor: "amber",
      cause:
        "Failed alternator, loose terminals, damaged charging cable, blown fuse, or weak battery.",
      inspect:
        "Charging voltage, alternator output, battery terminals, wiring continuity, and fuse condition.",
      action:
        "Terminal restoration, charging-system repair, alternator replacement, or battery replacement.",
      service:
        "Generator Repair: Battery Not Charging"
    },

    "inverter-not-on": {
      title: "Inverter Will Not Turn On",
      priority: "CRITICAL",
      priorityColor: "red",
      cause:
        "DC battery failure, protection trip, internal fault, damaged fuse, or control-board issue.",
      inspect:
        "DC voltage, battery bank condition, input protection, fault logs, fuses, and control circuitry.",
      action:
        "Battery restoration, protection reset, fuse replacement, or inverter control-board diagnosis.",
      service:
        "Emergency Repair: Inverter Not Turning On"
    },

    "backup-time-low": {
      title: "Backup Time Is Too Low",
      priority: "HIGH PRIORITY",
      priorityColor: "amber",
      cause:
        "Battery degradation, excessive connected load, incorrect battery sizing, or charging inefficiency.",
      inspect:
        "Battery health, load profile, discharge capacity, charging performance, and system sizing.",
      action:
        "Battery replacement, load optimization, capacity correction, or charging-system repair.",
      service:
        "UPS / Inverter Service: Low Backup Time"
    },

    "overheating": {
      title: "Overheating Alarm Detected",
      priority: "CRITICAL",
      priorityColor: "red",
      cause:
        "Restricted airflow, low coolant, radiator blockage, thermostat failure, or excessive engine load.",
      inspect:
        "Coolant level, radiator condition, fan operation, thermostat, temperature sensor, and load.",
      action:
        "Cooling-system flush, radiator cleaning, thermostat replacement, or load correction.",
      service:
        "Emergency Repair: Generator Overheating"
    },

    "unusual-noise": {
      title: "Unusual Mechanical Noise / Clatter",
      priority: "SERVICE REQUIRED",
      priorityColor: "slate",
      cause:
        "Loose mounting, worn bearings, belt failure, injector knock, or internal mechanical wear.",
      inspect:
        "Engine mounting, belts, bearings, vibration level, injectors, and mechanical clearances.",
      action:
        "Mechanical tightening, belt replacement, bearing service, injector testing, or engine inspection.",
      service:
        "Generator Repair: Unusual Noise"
    },

    "voltage-fluctuation": {
      title: "Voltage Fluctuation Detected",
      priority: "HIGH PRIORITY",
      priorityColor: "amber",
      cause:
        "AVR malfunction, unstable engine speed, loose electrical connection, or uneven phase loading.",
      inspect:
        "Voltage stability, frequency, AVR response, phase balance, terminals, and engine RPM.",
      action:
        "AVR calibration, terminal correction, load balancing, or alternator/control-system service.",
      service:
        "Generator Repair: Voltage Fluctuation"
    }

  };


  /* ==============================================================
     COLOR HELPERS
     ============================================================== */

  function updatePriorityColor(type) {

    const colors = {
      amber: ["text-amber-500", "bg-amber-500/10"],
      red: ["text-red-500", "bg-red-500/10"],
      slate: ["text-slate-500", "bg-slate-500/10"]
    };

    const selected =
      colors[type] || colors.amber;

    priority.classList.remove(
      "text-amber-500",
      "text-red-500",
      "text-slate-500",
      "bg-amber-500/10",
      "bg-red-500/10",
      "bg-slate-500/10"
    );

    priority.classList.add(
      selected[0],
      selected[1]
    );

    visualPriority.classList.remove(
      "text-amber-400",
      "text-red-400",
      "text-slate-400"
    );

    if (type === "red") {
      visualPriority.classList.add("text-red-400");
    } else if (type === "slate") {
      visualPriority.classList.add("text-slate-400");
    } else {
      visualPriority.classList.add("text-amber-400");
    }
  }


  /* ==============================================================
     UPDATE
     ============================================================== */

  function updateSymptom(type) {

    const data = symptomData[type];

    if (!data) return;


    [
      title,
      priority,
      cause,
      inspect,
      action
    ].forEach(el => {
      if (el) {
        el.classList.add("symptom-content-refresh");
      }
    });


    setTimeout(() => {

      title.textContent = data.title;
      priority.textContent = data.priority;
      cause.textContent = data.cause;
      inspect.textContent = data.inspect;
      action.textContent = data.action;

      if (prefillButton) {
        prefillButton.setAttribute(
          "data-prefill-service",
          data.service
        );
      }

      updatePriorityColor(data.priorityColor);

      [
        title,
        priority,
        cause,
        inspect,
        action
      ].forEach(el => {
        if (el) {
          el.classList.remove("symptom-content-refresh");
        }
      });

    }, 180);


    symptomButtons.forEach(btn => {

      btn.classList.remove("active");

      const number =
        btn.querySelector("span:first-child");

      if (number) {

        number.classList.remove(
          "bg-amber-500",
          "text-slate-950"
        );

      }

    });


    const activeButton =
      document.querySelector(
        `[data-symptom="${type}"]`
      );

    if (activeButton) {

      activeButton.classList.add("active");

      const number =
        activeButton.querySelector("span:first-child");

      if (number) {

        number.classList.add(
          "bg-amber-500",
          "text-slate-950"
        );

      }

    }


    signalStatus.textContent =
      data.priority === "CRITICAL"
        ? "CRITICAL SIGNAL"
        : "ABNORMAL";

  }


  /* ==============================================================
     CLICK
     ============================================================== */

  symptomButtons.forEach(button => {

    button.addEventListener("click", function () {

      const symptom =
        this.getAttribute("data-symptom");

      updateSymptom(symptom);

    });

  });


  /* Initial */
  updateSymptom("gen-not-start");

});



// <!-- =========================================================================
//      SECTION 04 JS
//      ========================================================================= -->

document.addEventListener("DOMContentLoaded", function () {

  const section = document.getElementById(
    "inverter-battery-diagnostics"
  );

  if (!section) return;

  const revealItems = section.querySelectorAll(
    ".reveal-on-scroll"
  );

  const observer = new IntersectionObserver(
    (entries, obs) => {

      entries.forEach((entry) => {

        if (entry.isIntersecting) {

          entry.target.classList.add("is-visible");

          obs.unobserve(entry.target);

        }

      });

    },
    {
      threshold: 0.12
    }
  );

  revealItems.forEach((item) => {
    observer.observe(item);
  });

});


// <!-- =========================================================================
//      SECTION 04 — JAVASCRIPT
//      ========================================================================= -->


document.addEventListener("DOMContentLoaded", function () {

  const section =
    document.getElementById("service-network-section");

  if (!section) return;


  /* ================================================================
     ELEMENTS
     ================================================================ */

  const zoneButtons =
    section.querySelectorAll(".network-zone-marker");

  const title =
    document.getElementById("zone-inspector-title");

  const sla =
    document.getElementById("zone-inspector-sla");

  const desc =
    document.getElementById("zone-inspector-desc");

  const activeZone =
    document.getElementById("zone-map-active");

  const mobileUnits =
    document.getElementById("zone-mobile-units");

  const systems =
    document.getElementById("zone-systems");

  const dispatchBtn =
    document.getElementById("zone-inspector-prefill-btn");


  /* ================================================================
     ZONE DATA
     ================================================================ */

  const zoneData = {

    "zone-01": {
      active: "ZONE 01 / CENTRAL METRO",

      title:
        "Fast Response. Local Teams.",

      sla:
        "RAPID RESPONSE SLA: < 30 MINS",

      desc:
        "High-density urban coverage with dedicated mobile vans stationed at the Central Workshop. Full support for residential inverters, silent gensets and corporate high-availability UPS systems.",

      mobile:
        "04",

      systems:
        "03",

      service:
        "Service Dispatch: Central Metro Hub 01"
    },


    "zone-02": {
      active: "ZONE 02 / NORTH INDUSTRIAL",

      title:
        "Heavy Power. Ready to Move.",

      sla:
        "HEAVY GENSET RESPONSE: < 45 MINS",

      desc:
        "Industrial response coverage focused on high-capacity generator systems, commercial electrical infrastructure and emergency mechanical service requirements.",

      mobile:
        "03",

      systems:
        "04",

      service:
        "Service Dispatch: North Industrial Zone 02"
    },


    "zone-03": {
      active: "ZONE 03 / EAST COMMERCIAL",

      title:
        "Business Continuity. Protected.",

      sla:
        "CORPORATE UPS RESPONSE: < 35 MINS",

      desc:
        "Dedicated commercial support for UPS systems, inverter installations, battery banks and critical office power infrastructure requiring dependable response.",

      mobile:
        "03",

      systems:
        "03",

      service:
        "Service Dispatch: East Commercial Zone 03"
    },


    "zone-04": {
      active: "ZONE 04 / WEST HIGHWAY",

      title:
        "Field Support. Wherever Power Moves.",

      sla:
        "MOBILE UNIT RESPONSE: < 45 MINS",

      desc:
        "High-mobility service coverage for highway-side facilities, commercial sites and remote installations requiring on-site generator and backup-power support.",

      mobile:
        "02",

      systems:
        "04",

      service:
        "Service Dispatch: West Highway Zone 04"
    }

  };


  /* ================================================================
     UPDATE ZONE
     ================================================================ */

  function updateZone(zoneKey) {

    const data = zoneData[zoneKey];

    if (!data) return;


    /* Active marker */

    zoneButtons.forEach(function (button) {

      button.classList.remove("active");

    });

    const activeButton =
      section.querySelector(
        '[data-zone-key="' + zoneKey + '"]'
      );

    if (activeButton) {
      activeButton.classList.add("active");
    }


    /* Content transition */

    const contentElements = [
      title,
      sla,
      desc,
      activeZone,
      mobileUnits,
      systems
    ];

    contentElements.forEach(function (element) {

      if (element) {
        element.classList.add("zone-content-refresh");
      }

    });


    setTimeout(function () {

      if (activeZone) {
        activeZone.textContent = data.active;
      }

      if (title) {
        title.textContent = data.title;
      }

      if (sla) {
        sla.textContent = data.sla;
      }

      if (desc) {
        desc.textContent = data.desc;
      }

      if (mobileUnits) {
        mobileUnits.textContent = data.mobile;
      }

      if (systems) {
        systems.textContent = data.systems;
      }

      if (dispatchBtn) {
        dispatchBtn.setAttribute(
          "data-prefill-service",
          data.service
        );
      }


      contentElements.forEach(function (element) {

        if (element) {
          element.classList.remove(
            "zone-content-refresh"
          );
        }

      });

    }, 160);

  }


  /* ================================================================
     CLICK EVENTS
     ================================================================ */

  zoneButtons.forEach(function (button) {

    button.addEventListener("click", function () {

      const zone =
        button.getAttribute("data-zone-key");

      updateZone(zone);

    });

  });


  /* ================================================================
     INITIAL STATE
     ================================================================ */

  updateZone("zone-01");


  /* ================================================================
     SCROLL REVEAL
     ================================================================ */

  const revealItems =
    section.querySelectorAll(".reveal-network");

  const observer =
    new IntersectionObserver(
      function (entries, obs) {

        entries.forEach(function (entry) {

          if (entry.isIntersecting) {

            entry.target.classList.add(
              "is-visible"
            );

            obs.unobserve(entry.target);

          }

        });

      },
      {
        threshold: 0.12
      }
    );


  revealItems.forEach(function (item) {

    observer.observe(item);

  });

});



// <!-- =========================================================================
//      SECTION 01 — JAVASCRIPT
//      ========================================================================= -->


document.addEventListener("DOMContentLoaded", function () {

  const hero =
    document.getElementById("power-hero");

  if (!hero) return;


  const revealItems =
    hero.querySelectorAll(".reveal-hero");


  /* ================================================================
     SCROLL REVEAL
     ================================================================ */

  const observer =
    new IntersectionObserver(
      function (entries, obs) {

        entries.forEach(function (entry) {

          if (entry.isIntersecting) {

            entry.target.classList.add(
              "is-visible"
            );

            obs.unobserve(entry.target);

          }

        });

      },
      {
        threshold: 0.12
      }
    );


  revealItems.forEach(function (item) {

    observer.observe(item);

  });

});

