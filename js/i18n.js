// Internationalization (i18n) - Language Management
const translations = {
    en: {
        title: "Diffraction Simulator",
        patternType: "Diffraction Pattern",
        patternSingle: "Single Slit",
        patternDouble: "Double Slit",
        patternMultiple: "Grating (N slits)",
        patternCircular: "Circular Aperture",
        patternCross: "Cross Aperture",
        patternVertical: "Vertical Slit",
        lightType: "Light Source",
        lightMono: "Monochromatic",
        lightWhite: "White Light",
        slitWidth: "Slit Width (mm)",
        slitDistance: "Slit Separation (mm)",
        numSlits: "Number of Slits",
        wavelength: "Wavelength (nm)",
        bloom: "Bloom Intensity",
        reset: "Reset to Defaults",
        presetRed: "Red Laser",
        presetGreen: "Green Laser",
        presetBlue: "Blue Laser",
        presetWhite: "White Light",
        currentColor: "Current Color",
        infoTitle: "Quantum Physics",
        infoText: "This simulator uses Fraunhofer diffraction equations to calculate interference patterns in real-time via GLSL shaders.",
        infoTech: "GPU Calculations • WebGL • Three.js",
        shortcutsHint: "Press 'H' for keyboard shortcuts",
        violet: "Violet",
        red: "Red",
        shortcutsTitle: "Keyboard Shortcuts",
        shortcutLang: "Toggle Language",
        shortcutInfo: "Toggle Info Panel",
        shortcutReset: "Reset Parameters",
        shortcutPattern1: "Single Slit",
        shortcutPattern2: "Double Slit",
        shortcutPattern3: "Multiple Slits",
        shortcutPattern4: "Circular",
        shortcutPattern5: "Cross",
        shortcutPattern6: "Vertical",
        shortcutClose: "Close Shortcuts"
    },
    fr: {
        title: "Simulateur de Diffraction",
        patternType: "Figure de Diffraction",
        patternSingle: "Fente Simple",
        patternDouble: "Double Fente",
        patternMultiple: "Réseau (N fentes)",
        patternCircular: "Ouverture Circulaire",
        patternCross: "Ouverture en Croix",
        patternVertical: "Fente Verticale",
        lightType: "Source Lumineuse",
        lightMono: "Monochromatique",
        lightWhite: "Lumière Blanche",
        slitWidth: "Largeur Fente (mm)",
        slitDistance: "Séparation Fentes (mm)",
        numSlits: "Nombre de Fentes",
        wavelength: "Longueur d'Onde (nm)",
        bloom: "Intensité Bloom",
        reset: "Réinitialiser",
        presetRed: "Laser Rouge",
        presetGreen: "Laser Vert",
        presetBlue: "Laser Bleu",
        presetWhite: "Lumière Blanche",
        currentColor: "Couleur Actuelle",
        infoTitle: "Physique Quantique",
        infoText: "Ce simulateur utilise les équations de diffraction de Fraunhofer pour calculer les figures d'interférence en temps réel via des shaders GLSL.",
        infoTech: "Calculs GPU • WebGL • Three.js",
        shortcutsHint: "Appuyez sur 'H' pour les raccourcis clavier",
        violet: "Violet",
        red: "Rouge",
        shortcutsTitle: "Raccourcis Clavier",
        shortcutLang: "Changer de Langue",
        shortcutInfo: "Afficher/Masquer Info",
        shortcutReset: "Réinitialiser",
        shortcutPattern1: "Fente Simple",
        shortcutPattern2: "Double Fente",
        shortcutPattern3: "Fentes Multiples",
        shortcutPattern4: "Circulaire",
        shortcutPattern5: "Croix",
        shortcutPattern6: "Verticale",
        shortcutClose: "Fermer Raccourcis"
    }
};

class I18n {
    constructor() {
        this.currentLang = localStorage.getItem('language') || 'en';
        this.init();
    }

    init() {
        this.updateLanguage(this.currentLang);
    }

    updateLanguage(lang) {
        this.currentLang = lang;
        localStorage.setItem('language', lang);

        // Update all elements with data-i18n attribute
        const elements = document.querySelectorAll('[data-i18n]');
        elements.forEach(element => {
            const key = element.getAttribute('data-i18n');
            if (translations[lang] && translations[lang][key]) {
                element.textContent = translations[lang][key];
            }
        });

        // Update select options
        const options = document.querySelectorAll('option[data-i18n]');
        options.forEach(option => {
            const key = option.getAttribute('data-i18n');
            if (translations[lang] && translations[lang][key]) {
                option.textContent = translations[lang][key];
            }
        });

        // Update HTML lang attribute
        document.documentElement.lang = lang;

        // Update current language display
        const langDisplay = document.getElementById('current-lang');
        if (langDisplay) {
            langDisplay.textContent = lang.toUpperCase();
        }
    }

    toggle() {
        const newLang = this.currentLang === 'en' ? 'fr' : 'en';
        this.updateLanguage(newLang);
    }

    get(key) {
        return translations[this.currentLang][key] || key;
    }

    getCurrentLang() {
        return this.currentLang;
    }
}

// Export for use in other files
const i18n = new I18n();