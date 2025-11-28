# 🌈 Quantum Diffraction Simulator

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Three.js](https://img.shields.io/badge/Three.js-r128-blue.svg)](https://threejs.org/)
[![WebGL](https://img.shields.io/badge/WebGL-2.0-green.svg)](https://www.khronos.org/webgl/)

A photorealistic real-time diffraction pattern simulator using WebGL shaders and Three.js. Visualize quantum wave interference with stunning visual effects.

[🇫🇷 Version française](README.fr.md) | [📺 Live Demo](#) | [📖 Technical Documentation](docs/TECHNICAL.md)

![Diffraction Simulator Screenshot](assets/screenshots/demo.png)

## ✨ Features

- **Multiple Diffraction Patterns**
  - Single slit diffraction
  - Double slit (Young's experiment)
  - Multiple slits (diffraction grating)
  - Circular aperture
  - Cross aperture
  - Vertical slit

- **Light Sources**
  - Monochromatic light (380-750 nm)
  - White light (polychromatic)
  - Color presets (Red/Green/Blue lasers)

- **Real-time Physics**
  - Fraunhofer diffraction equations
  - GPU-accelerated calculations via GLSL shaders
  - Accurate wavelength-to-RGB conversion
  - Photorealistic bloom effects

- **Interactive Controls**
  - Adjustable slit width (0.01-0.5 mm)
  - Variable slit separation (0.1-2 mm)
  - Number of slits (2-10)
  - Bloom intensity control
  - Language switcher (EN/FR)

## 🚀 Quick Start

### Online Demo
Visit the [live demo](#) to try it instantly in your browser.

### Local Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/diffraction-simulator.git
cd diffraction-simulator
```

2. Open with a local server:
```bash
# Using Python 3
python -m http.server 8000

# Using Node.js
npx serve

# Using PHP
php -S localhost:8000
```

3. Open your browser at `http://localhost:8000`

> ⚠️ **Note**: Opening `index.html` directly won't work due to CORS restrictions. Use a local server.

## 🎮 Usage

1. **Select Pattern Type**: Choose from single slit, double slit, grating, circular, cross, or vertical
2. **Choose Light Source**: Monochromatic or white light
3. **Adjust Parameters**: Use sliders to modify slit dimensions and wavelength
4. **Experiment**: See real-time changes to the diffraction pattern

### Keyboard Shortcuts
- `L`: Toggle language (EN/FR)
- `I`: Toggle info panel
- `R`: Reset to defaults
- `1-6`: Quick pattern selection

## 🛠️ Technology Stack

- **Three.js** (r128) - 3D graphics library
- **WebGL 2.0** - GPU rendering
- **GLSL** - Custom fragment shaders
- **Vanilla JavaScript** - No framework dependencies
- **CSS3** - Modern styling with glassmorphism

## 📚 Physics Background

This simulator implements the **Fraunhofer diffraction** equations:

### Single Slit
```
I(θ) = I₀ × (sin(β) / β)²
where β = (πa sin(θ)) / λ
```

### Double Slit
```
I(θ) = I₀ × (sin(β) / β)² × cos²(δ)
where δ = (πd sin(θ)) / λ
```

### N-Slit Grating
```
I(θ) = I₀ × (sin(β) / β)² × (sin(Nδ) / sin(δ))²
```

See [Technical Documentation](docs/TECHNICAL.md) for detailed explanations.

## 🎨 Screenshots

| Single Slit | Double Slit | Grating |
|-------------|-------------|---------|
| ![Single](assets/screenshots/single.png) | ![Double](assets/screenshots/double.png) | ![Grating](assets/screenshots/grating.png) |

| White Light | Circular | Cross |
|-------------|----------|-------|
| ![White](assets/screenshots/white.png) | ![Circular](assets/screenshots/circular.png) | ![Cross](assets/screenshots/cross.png) |

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the project
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👤 Author

**Your Name**
- Portfolio: [yourwebsite.com](#)
- GitHub: [@yourusername](https://github.com/yourusername)
- LinkedIn: [Your Name](https://linkedin.com/in/yourname)

## 🙏 Acknowledgments

- Three.js community
- Quantum physics educational resources
- WebGL shader tutorials

## 📈 Future Improvements

- [ ] Fresnel diffraction mode
- [ ] 3D visualization of wave propagation
- [ ] Pattern export (PNG/SVG)
- [ ] Mobile touch controls
- [ ] VR mode support
- [ ] Multiple light sources
- [ ] Time-domain animation

---

⭐ If you find this project useful, please consider giving it a star!