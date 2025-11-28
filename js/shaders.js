// GLSL Shader Code for Diffraction Simulation

const vertexShader = `
    varying vec2 vUv;
    
    void main() {
        vUv = uv;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
`;

const fragmentShader = `
    uniform float uSlitWidth;
    uniform float uSlitDistance;
    uniform float uWavelength;
    uniform float uBloom;
    uniform int uPatternType;
    uniform int uNumSlits;
    uniform int uLightType; // 0: mono, 1: white
    
    varying vec2 vUv;
    
    const float PI = 3.14159265359;
    const float BESSEL_ITERATIONS = 20.0;
    
    // Convert wavelength to RGB color
    vec3 wavelengthToRGB(float wavelength) {
        float r, g, b;
        
        if (wavelength >= 380.0 && wavelength < 440.0) {
            r = -(wavelength - 440.0) / (440.0 - 380.0);
            g = 0.0;
            b = 1.0;
        } else if (wavelength >= 440.0 && wavelength < 490.0) {
            r = 0.0;
            g = (wavelength - 440.0) / (490.0 - 440.0);
            b = 1.0;
        } else if (wavelength >= 490.0 && wavelength < 510.0) {
            r = 0.0;
            g = 1.0;
            b = -(wavelength - 510.0) / (510.0 - 490.0);
        } else if (wavelength >= 510.0 && wavelength < 580.0) {
            r = (wavelength - 510.0) / (580.0 - 510.0);
            g = 1.0;
            b = 0.0;
        } else if (wavelength >= 580.0 && wavelength < 645.0) {
            r = 1.0;
            g = -(wavelength - 645.0) / (645.0 - 580.0);
            b = 0.0;
        } else if (wavelength >= 645.0 && wavelength <= 750.0) {
            r = 1.0;
            g = 0.0;
            b = 0.0;
        } else {
            r = 0.0;
            g = 0.0;
            b = 0.0;
        }
        
        // Intensity factor for edges of visible spectrum
        float factor = 1.0;
        if (wavelength >= 380.0 && wavelength < 420.0) {
            factor = 0.3 + 0.7 * (wavelength - 380.0) / (420.0 - 380.0);
        } else if (wavelength >= 645.0 && wavelength <= 750.0) {
            factor = 0.3 + 0.7 * (750.0 - wavelength) / (750.0 - 645.0);
        }
        
        return vec3(r, g, b) * factor;
    }
    
    // Bessel function J1 approximation for circular aperture
    float besselJ1(float x) {
        if (abs(x) < 0.001) return x * 0.5;
        
        float sum = 0.0;
        float term = x * 0.5;
        
        for (float n = 0.0; n < BESSEL_ITERATIONS; n++) {
            sum += term / (n + 1.0);
            term *= -0.25 * x * x / ((n + 1.0) * (n + 2.0));
        }
        
        return sum;
    }
    
    // Calculate intensity for a given wavelength
    float calculateIntensityForWavelength(vec2 pos, float lambda) {
        float x = (pos.x - 0.5) * 10.0;
        float y = (pos.y - 0.5) * 10.0;
        
        float lambdaM = lambda * 1e-6;
        float a = uSlitWidth * 1e-3;
        float d = uSlitDistance * 1e-3;
        float L = 1.0;
        
        float intensity = 0.0;
        
        // Pattern Type: 0=single, 1=double, 2=multiple, 3=circular, 4=cross, 5=vertical
        if (uPatternType == 0) {
            // Single slit
            float theta = atan(x / L);
            float beta = PI * a * sin(theta) / lambdaM;
            
            if (abs(beta) < 0.001) {
                intensity = 1.0;
            } else {
                float sinc = sin(beta) / beta;
                intensity = sinc * sinc;
            }
        } 
        else if (uPatternType == 1) {
            // Double slit
            float theta = atan(x / L);
            float beta = PI * a * sin(theta) / lambdaM;
            float delta = PI * d * sin(theta) / lambdaM;
            
            if (abs(beta) < 0.001) {
                intensity = 4.0 * cos(delta) * cos(delta);
            } else {
                float sinc = sin(beta) / beta;
                intensity = sinc * sinc * 4.0 * cos(delta) * cos(delta);
            }
        } 
        else if (uPatternType == 2) {
            // Multiple slits (grating)
            float theta = atan(x / L);
            float beta = PI * a * sin(theta) / lambdaM;
            float delta = PI * d * sin(theta) / lambdaM;
            float N = float(uNumSlits);
            
            if (abs(beta) < 0.001) {
                if (abs(sin(delta)) < 0.001) {
                    intensity = N * N;
                } else {
                    intensity = sin(N * delta) * sin(N * delta) / (sin(delta) * sin(delta));
                }
            } else {
                float sinc = sin(beta) / beta;
                if (abs(sin(delta)) < 0.001) {
                    intensity = sinc * sinc * N * N;
                } else {
                    intensity = sinc * sinc * sin(N * delta) * sin(N * delta) / (sin(delta) * sin(delta));
                }
            }
        }
        else if (uPatternType == 3) {
            // Circular aperture (Airy disk)
            float r = sqrt(x * x + y * y);
            float theta = atan(r / L);
            float k = 2.0 * PI / lambdaM;
            float arg = k * a * sin(theta);
            
            if (abs(arg) < 0.001) {
                intensity = 1.0;
            } else {
                float bessel = besselJ1(arg);
                intensity = 4.0 * bessel * bessel / (arg * arg);
            }
        }
        else if (uPatternType == 4) {
            // Cross aperture
            float thetaX = atan(x / L);
            float thetaY = atan(y / L);
            float betaX = PI * a * sin(thetaX) / lambdaM;
            float betaY = PI * a * sin(thetaY) / lambdaM;
            
            float intensityX = 1.0;
            float intensityY = 1.0;
            
            if (abs(betaX) >= 0.001) {
                float sincX = sin(betaX) / betaX;
                intensityX = sincX * sincX;
            }
            
            if (abs(betaY) >= 0.001) {
                float sincY = sin(betaY) / betaY;
                intensityY = sincY * sincY;
            }
            
            intensity = intensityX * intensityY;
        }
        else if (uPatternType == 5) {
            // Vertical slit
            float thetaY = atan(y / L);
            float beta = PI * a * sin(thetaY) / lambdaM;
            
            if (abs(beta) < 0.001) {
                intensity = 1.0;
            } else {
                float sinc = sin(beta) / beta;
                intensity = sinc * sinc;
            }
        }
        
        return intensity;
    }
    
    void main() {
        vec3 finalColor = vec3(0.0);
        
        if (uLightType == 0) {
            // Monochromatic light
            float intensity = calculateIntensityForWavelength(vUv, uWavelength);
            intensity = pow(intensity, 0.8);
            intensity *= uBloom;
            
            vec3 color = wavelengthToRGB(uWavelength);
            finalColor = color * intensity;
            
            float bloom = intensity * 0.5;
            finalColor += vec3(bloom) * color;
        } else {
            // White light (polychromatic) - sum multiple wavelengths
            float wavelengths[7];
            wavelengths[0] = 450.0;  // Blue
            wavelengths[1] = 500.0;  // Cyan
            wavelengths[2] = 550.0;  // Green
            wavelengths[3] = 580.0;  // Yellow
            wavelengths[4] = 600.0;  // Orange
            wavelengths[5] = 650.0;  // Red
            wavelengths[6] = 700.0;  // Deep Red
            
            for (int i = 0; i < 7; i++) {
                float wl = wavelengths[i];
                float intensity = calculateIntensityForWavelength(vUv, wl);
                intensity = pow(intensity, 0.8);
                intensity *= uBloom * 0.4; // Reduce intensity for white light
                
                vec3 color = wavelengthToRGB(wl);
                finalColor += color * intensity;
            }
        }
        
        // Tone mapping
        finalColor = 1.0 - exp(-finalColor * 0.5);
        
        // Vignette effect
        float vignette = 1.0 - length(vUv - 0.5) * 0.3;
        finalColor *= vignette;
        
        gl_FragColor = vec4(finalColor, 1.0);
    }
`;

// Export shaders
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { vertexShader, fragmentShader };
}