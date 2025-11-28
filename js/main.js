// Main Application Logic
let scene, camera, renderer, plane, material;

const params = {
    patternType: 'double',
    lightType: 'mono',
    slitWidth: 0.1,
    slitDistance: 0.5,
    numSlits: 5,
    wavelength: 550,
    bloom: 2.5
};

const defaultParams = { ...params };

// Initialize Three.js scene
function init() {
    const container = document.getElementById('canvas-container');

    // Create scene
    scene = new THREE.Scene();
    scene.background = new THREE.Color(0x0a0a0a);

    // Create camera
    camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);

    // Create renderer
    renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    // Create shader material
    const geometry = new THREE.PlaneGeometry(2, 2);
    material = new THREE.ShaderMaterial({
        uniforms: {
            uSlitWidth: { value: params.slitWidth },
            uSlitDistance: { value: params.slitDistance },
            uWavelength: { value: params.wavelength },
            uBloom: { value: params.bloom },
            uPatternType: { value: getPatternTypeValue(params.patternType) },
            uNumSlits: { value: params.numSlits },
            uLightType: { value: 0 }
        },
        vertexShader: vertexShader,
        fragmentShader: fragmentShader
    });

    plane = new THREE.Mesh(geometry, material);
    scene.add(plane);

    // Setup controls
    setupControls();
    setupKeyboardShortcuts();

    // Start animation loop
    animate();

    // Handle window resize
    window.addEventListener('resize', onWindowResize);
}

function getPatternTypeValue(type) {
    const types = {
        'single': 0,
        'double': 1,
        'multiple': 2,
        'circular': 3,
        'cross': 4,
        'vertical': 5
    };
    return types[type] || 1;
}

function getLightTypeValue(type) {
    return type === 'white' ? 1 : 0;
}

function setupControls() {
    // Pattern type
    const patternType = document.getElementById('pattern-type');
    patternType.addEventListener('change', (e) => {
        params.patternType = e.target.value;
        material.uniforms.uPatternType.value = getPatternTypeValue(e.target.value);
        updateVisibility();
    });

    // Light type
    const lightType = document.getElementById('light-type');
    lightType.addEventListener('change', (e) => {
        params.lightType = e.target.value;
        material.uniforms.uLightType.value = getLightTypeValue(e.target.value);
        updateVisibility();
        updateColorIndicator();
    });

    // Slit width
    const slitWidth = document.getElementById('slit-width');
    slitWidth.addEventListener('input', (e) => {
        params.slitWidth = parseFloat(e.target.value);
        material.uniforms.uSlitWidth.value = params.slitWidth;
        document.getElementById('slit-width-val').textContent = params.slitWidth.toFixed(2);
    });

    // Slit distance
    const slitDistance = document.getElementById('slit-distance');
    slitDistance.addEventListener('input', (e) => {
        params.slitDistance = parseFloat(e.target.value);
        material.uniforms.uSlitDistance.value = params.slitDistance;
        document.getElementById('slit-distance-val').textContent = params.slitDistance.toFixed(2);
    });

    // Number of slits
    const numSlits = document.getElementById('num-slits');
    numSlits.addEventListener('input', (e) => {
        params.numSlits = parseInt(e.target.value);
        material.uniforms.uNumSlits.value = params.numSlits;
        document.getElementById('num-slits-val').textContent = params.numSlits;
    });

    // Wavelength
    const wavelength = document.getElementById('wavelength');
    wavelength.addEventListener('input', (e) => {
        params.wavelength = parseFloat(e.target.value);
        material.uniforms.uWavelength.value = params.wavelength;
        document.getElementById('wavelength-val').textContent = params.wavelength;
        document.getElementById('wavelength-display').textContent = params.wavelength;
        updateColorIndicator();
    });

    // Bloom
    const bloom = document.getElementById('bloom');
    bloom.addEventListener('input', (e) => {
        params.bloom = parseFloat(e.target.value);
        material.uniforms.uBloom.value = params.bloom;
        document.getElementById('bloom-val').textContent = params.bloom.toFixed(1);
    });

    // Presets
    const presets = {
        red: { wavelength: 650, slitWidth: 0.08, slitDistance: 0.4, lightType: 'mono' },
        green: { wavelength: 532, slitWidth: 0.1, slitDistance: 0.5, lightType: 'mono' },
        blue: { wavelength: 450, slitWidth: 0.12, slitDistance: 0.6, lightType: 'mono' },
        white: { wavelength: 550, slitWidth: 0.1, slitDistance: 0.5, lightType: 'white' }
    };

    document.querySelectorAll('.preset-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const preset = presets[btn.dataset.preset];
            if (preset) {
                applyPreset(preset);
            }
        });
    });

    // Reset button
    document.getElementById('reset-btn').addEventListener('click', resetToDefaults);

    // Language toggle
    document.getElementById('lang-toggle').addEventListener('click', () => {
        i18n.toggle();
    });

    // Info toggle
    const toggleInfo = document.getElementById('toggle-info');
    const info = document.getElementById('info');
    toggleInfo.addEventListener('click', () => {
        info.classList.toggle('collapsed');
    });

    // Initial visibility update
    updateVisibility();
}

function applyPreset(preset) {
    params.wavelength = preset.wavelength;
    params.slitWidth = preset.slitWidth;
    params.slitDistance = preset.slitDistance;
    params.lightType = preset.lightType;

    // Update UI
    document.getElementById('wavelength').value = params.wavelength;
    document.getElementById('wavelength-val').textContent = params.wavelength;
    document.getElementById('wavelength-display').textContent = params.wavelength;
    document.getElementById('slit-width').value = params.slitWidth;
    document.getElementById('slit-width-val').textContent = params.slitWidth.toFixed(2);
    document.getElementById('slit-distance').value = params.slitDistance;
    document.getElementById('slit-distance-val').textContent = params.slitDistance.toFixed(2);
    document.getElementById('light-type').value = params.lightType;

    // Update uniforms
    material.uniforms.uWavelength.value = params.wavelength;
    material.uniforms.uSlitWidth.value = params.slitWidth;
    material.uniforms.uSlitDistance.value = params.slitDistance;
    material.uniforms.uLightType.value = getLightTypeValue(params.lightType);

    updateColorIndicator();
    updateVisibility();
}

function resetToDefaults() {
    Object.assign(params, defaultParams);

    // Update UI
    document.getElementById('pattern-type').value = params.patternType;
    document.getElementById('light-type').value = params.lightType;
    document.getElementById('slit-width').value = params.slitWidth;
    document.getElementById('slit-width-val').textContent = params.slitWidth.toFixed(2);
    document.getElementById('slit-distance').value = params.slitDistance;
    document.getElementById('slit-distance-val').textContent = params.slitDistance.toFixed(2);
    document.getElementById('num-slits').value = params.numSlits;
    document.getElementById('num-slits-val').textContent = params.numSlits;
    document.getElementById('wavelength').value = params.wavelength;
    document.getElementById('wavelength-val').textContent = params.wavelength;
    document.getElementById('wavelength-display').textContent = params.wavelength;
    document.getElementById('bloom').value = params.bloom;
    document.getElementById('bloom-val').textContent = params.bloom.toFixed(1);

    // Update uniforms
    material.uniforms.uPatternType.value = getPatternTypeValue(params.patternType);
    material.uniforms.uLightType.value = getLightTypeValue(params.lightType);
    material.uniforms.uSlitWidth.value = params.slitWidth;
    material.uniforms.uSlitDistance.value = params.slitDistance;
    material.uniforms.uNumSlits.value = params.numSlits;
    material.uniforms.uWavelength.value = params.wavelength;
    material.uniforms.uBloom.value = params.bloom;

    updateColorIndicator();
    updateVisibility();
}

function updateVisibility() {
    const numSlitsGroup = document.getElementById('num-slits-group');
    const wavelengthGroup = document.getElementById('wavelength-group');

    // Show/hide number of slits based on pattern type
    if (params.patternType === 'multiple') {
        numSlitsGroup.classList.remove('hidden');
    } else {
        numSlitsGroup.classList.add('hidden');
    }

    // Show/hide wavelength based on light type
    if (params.lightType === 'white') {
        wavelengthGroup.classList.add('hidden');
    } else {
        wavelengthGroup.classList.remove('hidden');
    }
}

function updateColorIndicator() {
    const colorCircle = document.getElementById('color-circle');

    if (params.lightType === 'white') {
        colorCircle.style.background = 'linear-gradient(135deg, #ff0000, #ffff00, #00ff00, #00ffff, #0000ff, #ff00ff)';
    } else {
        const color = wavelengthToRGB(params.wavelength);
        colorCircle.style.background = `rgb(${color.r}, ${color.g}, ${color.b})`;
    }
}

function wavelengthToRGB(wavelength) {
    let r, g, b;

    if (wavelength >= 380 && wavelength < 440) {
        r = -(wavelength - 440) / (440 - 380);
        g = 0.0;
        b = 1.0;
    } else if (wavelength >= 440 && wavelength < 490) {
        r = 0.0;
        g = (wavelength - 440) / (490 - 440);
        b = 1.0;
    } else if (wavelength >= 490 && wavelength < 510) {
        r = 0.0;
        g = 1.0;
        b = -(wavelength - 510) / (510 - 490);
    } else if (wavelength >= 510 && wavelength < 580) {
        r = (wavelength - 510) / (580 - 510);
        g = 1.0;
        b = 0.0;
    } else if (wavelength >= 580 && wavelength < 645) {
        r = 1.0;
        g = -(wavelength - 645) / (645 - 580);
        b = 0.0;
    } else if (wavelength >= 645 && wavelength <= 750) {
        r = 1.0;
        g = 0.0;
        b = 0.0;
    } else {
        r = 0.0;
        g = 0.0;
        b = 0.0;
    }

    let factor = 1.0;
    if (wavelength >= 380 && wavelength < 420) {
        factor = 0.3 + 0.7 * (wavelength - 380) / (420 - 380);
    } else if (wavelength >= 645 && wavelength <= 750) {
        factor = 0.3 + 0.7 * (750 - wavelength) / (750 - 645);
    }

    return {
        r: Math.round(r * factor * 255),
        g: Math.round(g * factor * 255),
        b: Math.round(b * factor * 255)
    };
}

function setupKeyboardShortcuts() {
    document.addEventListener('keydown', (e) => {
        switch(e.key.toLowerCase()) {
            case 'l':
                i18n.toggle();
                break;
            case 'i':
                document.getElementById('info').classList.toggle('collapsed');
                break;
            case 'r':
                resetToDefaults();
                break;
            case '1':
                document.getElementById('pattern-type').value = 'single';
                params.patternType = 'single';
                material.uniforms.uPatternType.value = 0;
                updateVisibility();
                break;
            case '2':
                document.getElementById('pattern-type').value = 'double';
                params.patternType = 'double';
                material.uniforms.uPatternType.value = 1;
                updateVisibility();
                break;
            case '3':
                document.getElementById('pattern-type').value = 'multiple';
                params.patternType = 'multiple';
                material.uniforms.uPatternType.value = 2;
                updateVisibility();
                break;
            case '4':
                document.getElementById('pattern-type').value = 'circular';
                params.patternType = 'circular';
                material.uniforms.uPatternType.value = 3;
                updateVisibility();
                break;
            case '5':
                document.getElementById('pattern-type').value = 'cross';
                params.patternType = 'cross';
                material.uniforms.uPatternType.value = 4;
                updateVisibility();
                break;
            case '6':
                document.getElementById('pattern-type').value = 'vertical';
                params.patternType = 'vertical';
                material.uniforms.uPatternType.value = 5;
                updateVisibility();
                break;
            case 'h':
                showShortcutsModal();
                break;
        }
    });
}

function showShortcutsModal() {
    // Remove existing modal if any
    const existingModal = document.querySelector('.modal-overlay');
    if (existingModal) {
        existingModal.remove();
        return;
    }

    const overlay = document.createElement('div');
    overlay.className = 'modal-overlay';

    const modal = document.createElement('div');
    modal.id = 'shortcuts-modal';

    const shortcuts = [
        { key: 'L', desc: i18n.get('shortcutLang') },
        { key: 'I', desc: i18n.get('shortcutInfo') },
        { key: 'R', desc: i18n.get('shortcutReset') },
        { key: '1', desc: i18n.get('shortcutPattern1') },
        { key: '2', desc: i18n.get('shortcutPattern2') },
        { key: '3', desc: i18n.get('shortcutPattern3') },
        { key: '4', desc: i18n.get('shortcutPattern4') },
        { key: '5', desc: i18n.get('shortcutPattern5') },
        { key: '6', desc: i18n.get('shortcutPattern6') },
        { key: 'H', desc: i18n.get('shortcutClose') }
    ];

    let html = `<h2>⌨️ ${i18n.get('shortcutsTitle')}</h2><div class="shortcut-list">`;
    shortcuts.forEach(s => {
        html += `
            <div class="shortcut-item">
                <span class="shortcut-desc">${s.desc}</span>
                <span class="shortcut-key">${s.key}</span>
            </div>
        `;
    });
    html += '</div>';

    modal.innerHTML = html;

    overlay.addEventListener('click', () => overlay.remove());

    document.body.appendChild(overlay);
    document.body.appendChild(modal);
}

function animate() {
    requestAnimationFrame(animate);
    renderer.render(scene, camera);
}

function onWindowResize() {
    renderer.setSize(window.innerWidth, window.innerHeight);
}

// Initialize when DOM is loaded
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}