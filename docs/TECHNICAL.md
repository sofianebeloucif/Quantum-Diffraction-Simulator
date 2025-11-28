# Technical Documentation

## Architecture Overview

The Quantum Diffraction Simulator is built using a modern web stack with GPU-accelerated rendering for real-time physics calculations.

### Technology Stack

- **Three.js (r128)**: 3D rendering engine
- **WebGL 2.0**: Low-level graphics API
- **GLSL ES 3.0**: Shader language for GPU computations
- **Vanilla JavaScript**: No framework dependencies
- **CSS3**: Modern styling with CSS variables and animations

## Physics Implementation

### Fraunhofer Diffraction

The simulator implements the Fraunhofer (far-field) diffraction approximation, which is valid when:
- The observation distance L >> (aperture size)²/λ
- The source is effectively at infinity

### Mathematical Formulations

#### 1. Single Slit Diffraction

The intensity pattern is given by:
```
I(θ) = I₀ × [sin(β) / β]²

where:
- β = (πa sin(θ)) / λ
- a = slit width
- θ = observation angle
- λ = wavelength
```

**Implementation Details:**
- Sinc function approximation for small angles
- Special case handling when β → 0 to avoid division by zero

#### 2. Double Slit (Young's Experiment)
```
I(θ) = I₀ × [sin(β) / β]² × 4cos²(δ)

where:
- δ = (πd sin(θ)) / λ
- d = slit separation
- The first term is the single-slit envelope
- The second term creates the interference fringes
```

#### 3. Multiple Slit Grating
```
I(θ) = I₀ × [sin(β) / β]² × [sin(Nδ) / sin(δ)]²

where:
- N = number of slits
- Creates sharp principal maxima
- (N-2) secondary maxima between principal maxima
```

#### 4. Circular Aperture (Airy Disk)
```
I(r) = I₀ × [2J₁(x) / x]²

where:
- J₁ = Bessel function of the first kind
- x = (2πa/λ) × sin(θ)
- a = aperture radius
```

**Implementation:**
- Series approximation of Bessel function J₁
- 20 iterations for accuracy
- Produces the characteristic Airy disk pattern

#### 5. Cross Aperture

Multiplication of two perpendicular single-slit patterns:
```
I(x,y) = I_x(x) × I_y(y)
```

Creates a cross-shaped diffraction pattern.

#### 6. Vertical Slit

Single-slit diffraction rotated 90 degrees:
- Diffraction occurs along the y-axis
- Horizontal fringes

### White Light Simulation

White light is simulated by sampling 7 wavelengths across the visible spectrum:
- 450 nm (Blue)
- 500 nm (Cyan)
- 550 nm (Green)
- 580 nm (Yellow)
- 600 nm (Orange)
- 650 nm (Red)
- 700 nm (Deep Red)

Each wavelength is calculated independently and summed with appropriate color weighting.

## Shader Architecture

### Vertex Shader
- Pass-through shader
- Transfers UV coordinates to fragment shader
- No vertex transformations needed (fullscreen quad)

### Fragment Shader

**Inputs (Uniforms):**
- `uSlitWidth`: Physical slit width in mm
- `uSlitDistance`: Separation between slits in mm
- `uWavelength`: Light wavelength in nm
- `uBloom`: Bloom intensity multiplier
- `uPatternType`: Integer (0-5) for pattern selection
- `uNumSlits`: Number of slits for grating
- `uLightType`: 0 for monochromatic, 1 for white

**Processing Pipeline:**
1. Calculate observation angle from UV coordinates
2. Compute diffraction parameters (β, δ)
3. Apply appropriate diffraction formula
4. Convert wavelength to RGB color
5. Apply bloom effect
6. Tone mapping (exposure adjustment)
7. Vignette effect for aesthetics

### Color Conversion

Wavelength to RGB conversion follows the CIE color matching functions approximation:
```
380-440 nm: Violet (Blue with red component)
440-490 nm: Blue to Cyan transition
490-510 nm: Cyan to Green transition
510-580 nm: Green to Yellow transition
580-645 nm: Yellow to Red transition
645-750 nm: Red
```

Intensity falloff at spectrum edges for realistic appearance.

## Performance Optimizations

### GPU Acceleration
- All diffraction calculations run on GPU via fragment shader
- Parallel processing of every pixel
- 60 FPS on modern hardware

### Render Loop
- RequestAnimationFrame for smooth animation
- Minimal CPU overhead
- Continuous rendering mode

### Memory Management
- Single geometry and material
- No dynamic allocations per frame
- Efficient uniform updates

## Code Structure
```
diffraction-simulator/
├── index.html          # Main HTML structure
├── css/
│   └── style.css       # All styling
├── js/
│   ├── main.js         # Application logic & Three.js setup
│   ├── shaders.js      # GLSL shader code
│   └── i18n.js         # Internationalization
└── assets/
    └── screenshots/    # Demo images
```

## Browser Compatibility

**Minimum Requirements:**
- WebGL 2.0 support
- ES6 JavaScript support
- Modern browser (Chrome 56+, Firefox 51+, Safari 14+, Edge 79+)

**Tested On:**
- Chrome 120+
- Firefox 121+
- Safari 17+
- Edge 120+

## Known Limitations

1. **Fresnel Diffraction**: Not implemented (only Fraunhofer)
2. **Polarization**: Not modeled
3. **Coherence**: Assumes perfectly coherent light
4. **3D Visualization**: 2D intensity patterns only
5. **Mobile Performance**: May be limited on older devices

## Future Enhancements

### Short Term
- [ ] Export patterns as PNG/SVG
- [ ] More aperture shapes (rectangular, hexagonal)
- [ ] Adjustable observation distance
- [ ] Side-by-side comparison mode

### Medium Term
- [ ] Fresnel diffraction mode
- [ ] Temporal evolution animation
- [ ] Multiple simultaneous light sources
- [ ] Educational overlays with measurements

### Long Term
- [ ] 3D wave propagation visualization
- [ ] VR/AR support
- [ ] Real-time camera input for AR overlays
- [ ] Machine learning for pattern recognition

## References

1. Hecht, E. (2016). *Optics (5th ed.)*. Pearson.
2. Born, M., & Wolf, E. (1999). *Principles of Optics*. Cambridge University Press.
3. Goodman, J. W. (2005). *Introduction to Fourier Optics*. Roberts and Company.
4. Three.js Documentation: https://threejs.org/docs/
5. WebGL Specification: https://www.khronos.org/webgl/

## Contributing

When contributing, please:
1. Maintain physics accuracy
2. Test across multiple browsers
3. Document any new physics implementations
4. Optimize for 60 FPS performance
5. Follow existing code style

## License

MIT License - See LICENSE file for details.