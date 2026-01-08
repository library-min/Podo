import { useEffect, useRef } from 'react';

const StarryBackground = () => {
    const canvasRef = useRef(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        let animationFrameId;

        let width = window.innerWidth;
        let height = window.innerHeight;

        // Configuration
        const STAR_COUNT = 400;
        const SHOOTING_STAR_FREQUENCY = 0.01; // Probability per frame

        // State
        const stars = [];
        const shootingStars = [];

        // Colors
        const colorBg = '#000000'; // Pure Black
        
        // Initialize
        const init = () => {
            width = window.innerWidth;
            height = window.innerHeight;
            canvas.width = width;
            canvas.height = height;
            createStars();
        };

        class Star {
            constructor() {
                this.reset();
                // Initial random start for twinkle to prevent synchronized twinkling
                this.twinklePhase = Math.random() * Math.PI * 2; 
            }

            reset() {
                this.x = Math.random() * width;
                this.y = Math.random() * height;
                this.size = Math.random() * 1.5 + 0.5; // 0.5 ~ 2.0
                this.baseAlpha = Math.random() * 0.5 + 0.3; // 0.3 ~ 0.8
                this.twinkleSpeed = Math.random() * 0.05 + 0.01;
            }

            update() {
                this.twinklePhase += this.twinkleSpeed;
                // Move very slowly to simulate rotation/movement
                this.x -= 0.05; 
                if (this.x < 0) this.x = width;
            }

            draw(ctx) {
                const alpha = this.baseAlpha + Math.sin(this.twinklePhase) * 0.2;
                ctx.fillStyle = `rgba(255, 255, 255, ${Math.max(0, Math.min(1, alpha))})`;
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                ctx.fill();
            }
        }

        class ShootingStar {
            constructor() {
                this.reset(true); // Start inactive
            }

            reset(startInactive = false) {
                this.active = !startInactive;
                if (startInactive) return;

                this.x = Math.random() * width + 200; // Start slightly right
                this.y = Math.random() * (height / 2); // Start in top half
                this.len = Math.random() * 80 + 20;
                this.speed = Math.random() * 5 + 5;
                this.size = Math.random() * 1 + 0.5;
                // Angle: shooting down-left
                this.angle = Math.PI / 4 + (Math.random() * 0.2 - 0.1); // approx 45 degrees
                this.dx = -Math.cos(this.angle) * this.speed;
                this.dy = Math.sin(this.angle) * this.speed;
                this.opacity = 1;
            }

            update() {
                if (!this.active) {
                    if (Math.random() < SHOOTING_STAR_FREQUENCY) {
                        this.reset();
                    }
                    return;
                }

                this.x += this.dx;
                this.y += this.dy;
                this.opacity -= 0.01;

                if (this.x < -100 || this.y > height + 100 || this.opacity <= 0) {
                    this.active = false;
                }
            }

            draw(ctx) {
                if (!this.active) return;

                const tailX = this.x - this.dx * 10; // Simple tail calculation
                const tailY = this.y - this.dy * 10;

                const gradient = ctx.createLinearGradient(this.x, this.y, tailX, tailY);
                gradient.addColorStop(0, `rgba(255, 255, 255, ${this.opacity})`);
                gradient.addColorStop(1, `rgba(255, 255, 255, 0)`);

                ctx.strokeStyle = gradient;
                ctx.lineWidth = this.size;
                ctx.lineCap = 'round';
                ctx.beginPath();
                ctx.moveTo(this.x, this.y);
                ctx.lineTo(this.x - this.dx * 5, this.y - this.dy * 5); // Longer tail
                ctx.stroke();
            }
        }

        const createStars = () => {
            stars.length = 0;
            for (let i = 0; i < STAR_COUNT; i++) {
                stars.push(new Star());
            }
            // Add a few shooting star controllers
            shootingStars.length = 0;
            for (let i = 0; i < 3; i++) {
                shootingStars.push(new ShootingStar());
            }
        };

        const animate = () => {
            // Clear background
            ctx.fillStyle = colorBg;
            ctx.fillRect(0, 0, width, height);

            // Draw Stars
            stars.forEach(star => {
                star.update();
                star.draw(ctx);
            });

            // Draw Shooting Stars
            shootingStars.forEach(s => {
                s.update();
                s.draw(ctx);
            });

            animationFrameId = requestAnimationFrame(animate);
        };

        window.addEventListener('resize', init);
        init();
        animate();

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

export default StarryBackground;
