import { useEffect, useRef } from 'react';

const ParticleWaveBackground = () => {
    const canvasRef = useRef(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        let animationFrameId;

        let width = window.innerWidth;
        let height = window.innerHeight;

        // Configuration
        const particles = [];
        const rows = 50; // Number of rows in the wave
        const cols = 50; // Number of columns in the wave
        const spacing = 30; // Space between particles
        const waveHeight = 60; // Amplitude of the wave
        const speed = 0.002; // Ultra-slow motion
        let time = 0;

        // Colors
        const colorPrimary = { r: 139, g: 92, b: 246 }; // Purple-500
        const colorSecondary = { r: 236, g: 72, b: 153 }; // Pink-500
        const colorBase = { r: 30, g: 58, b: 138 }; // Deep Blue

        // Initialize Canvas
        const init = () => {
            width = window.innerWidth;
            height = window.innerHeight;
            canvas.width = width;
            canvas.height = height;
            createParticles();
        };

        const createParticles = () => {
            particles.length = 0;
            for (let r = 0; r < rows; r++) {
                for (let c = 0; c < cols; c++) {
                    particles.push({
                        x: c * spacing - (cols * spacing) / 2, // Center horizontally
                        z: r * spacing - (rows * spacing) / 2, // Center depth
                        y: 0,
                        initialX: c * spacing - (cols * spacing) / 2,
                        initialZ: r * spacing - (rows * spacing) / 2,
                    });
                }
            }
        };

        const draw = () => {
            ctx.fillStyle = '#0f172a'; // Dark background (slate-900)
            ctx.fillRect(0, 0, width, height);

            // Add Aurora Gradient Effect (Background Glow)
            const gradient = ctx.createRadialGradient(width / 2, height / 2, 0, width / 2, height / 2, width);
            gradient.addColorStop(0, 'rgba(30, 58, 138, 0.3)'); // Deep Blue center
            gradient.addColorStop(0.5, 'rgba(88, 28, 135, 0.2)'); // Purple mid
            gradient.addColorStop(1, 'rgba(15, 23, 42, 0)'); // Fade out
            ctx.fillStyle = gradient;
            ctx.fillRect(0, 0, width, height);

            // Update Particle Positions (Wave Logic)
            time += speed;
            
            // Perspective Projection Settings
            const fov = 300;
            const viewDistance = 500;
            const centerX = width / 2;
            const centerY = height / 2 + 50; // Slightly lower to look up at the wave

            particles.forEach((p, i) => {
                // 3D Wave Formula: combination of Sine and Cosine for organic movement
                const distance = Math.sqrt(p.initialX * p.initialX + p.initialZ * p.initialZ);
                const wave1 = Math.sin(distance * 0.02 - time * 2) * waveHeight;
                const wave2 = Math.cos(p.initialX * 0.03 + time) * (waveHeight * 0.5);
                
                p.y = wave1 + wave2;

                // 3D Rotation (Optional, slight tilt)
                const angleX = 0.3; // Tilt forward
                const rotatedY = p.y * Math.cos(angleX) - p.z * Math.sin(angleX);
                const rotatedZ = p.y * Math.sin(angleX) + p.z * Math.cos(angleX);

                // Project 3D to 2D
                const scale = fov / (viewDistance + rotatedZ + 200); // +200 pushes it back a bit
                p.projX = p.initialX * scale + centerX;
                p.projY = rotatedY * scale + centerY;
                p.scale = scale;
                p.alpha = Math.min(1, scale * 1.5); // Fade out distant particles
            });

            // Draw Lines (Mesh)
            ctx.lineWidth = 1;
            for (let i = 0; i < particles.length; i++) {
                const p = particles[i];
                
                // Don't draw if too far or off screen
                if (p.scale < 0) continue;

                // Color interpolation based on height (Y)
                const normalizedY = (p.y + waveHeight) / (waveHeight * 2); // 0 to 1
                const r = Math.floor(colorBase.r + (colorSecondary.r - colorBase.r) * normalizedY);
                const g = Math.floor(colorBase.g + (colorSecondary.g - colorBase.g) * normalizedY);
                const b = Math.floor(colorBase.b + (colorSecondary.b - colorBase.b) * normalizedY);
                const color = `rgba(${r}, ${g}, ${b}, ${p.alpha * 0.4})`;

                // Connect to right neighbor
                if ((i + 1) % cols !== 0) {
                    const right = particles[i + 1];
                    if (right.scale > 0) {
                        ctx.strokeStyle = color;
                        ctx.beginPath();
                        ctx.moveTo(p.projX, p.projY);
                        ctx.lineTo(right.projX, right.projY);
                        ctx.stroke();
                    }
                }

                // Connect to bottom neighbor
                if (i + cols < particles.length) {
                    const bottom = particles[i + cols];
                    if (bottom.scale > 0) {
                        ctx.strokeStyle = color;
                        ctx.beginPath();
                        ctx.moveTo(p.projX, p.projY);
                        ctx.lineTo(bottom.projX, bottom.projY);
                        ctx.stroke();
                    }
                }

                // Draw Particle (Dot)
                ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${p.alpha})`;
                ctx.beginPath();
                ctx.arc(p.projX, p.projY, 1.5 * Math.max(0.5, p.scale), 0, Math.PI * 2);
                ctx.fill();
            }

            animationFrameId = requestAnimationFrame(draw);
        };

        window.addEventListener('resize', init);
        init();
        draw();

        return () => {
            window.removeEventListener('resize', init);
            cancelAnimationFrame(animationFrameId);
        };
    }, []);

    return (
        <canvas 
            ref={canvasRef} 
            className="absolute inset-0 w-full h-full pointer-events-none"
            style={{ zIndex: 0 }}
        />
    );
};

export default ParticleWaveBackground;
