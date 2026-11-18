<script lang="ts">
	import { onMount } from 'svelte';

	let canvasEl: HTMLCanvasElement | undefined = $state();

	interface Star {
		arm: number;
		radius: number; // normalized 0..1
		angleOffset: number;
		spread: number;
		speed: number;
		tone: 'dim' | 'base' | 'bright' | 'blue' | 'purple';
		phase: number;
		size: number;
	}

	interface AmbientDot {
		x: number; // normalized 0..1
		y: number; // normalized 0..1
		tone: 'dim' | 'base' | 'blue' | 'purple';
		phase: number;
	}

	onMount(() => {
		if (!canvasEl) return;
		const ctx = canvasEl.getContext('2d');
		if (!ctx) return;

		const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
		let reducedMotion = mq.matches;
		const onMotionChange = (e: MediaQueryListEvent) => {
			reducedMotion = e.matches;
		};
		mq.addEventListener('change', onMotionChange);

		// Deterministic pseudo-random generator for stable visual composition
		let seed = 4219;
		const rand = () => {
			seed = (seed * 16807) % 2147483647;
			return (seed - 1) / 2147483646;
		};

		// Build spiral galaxy dots (3 logarithmic arms)
		const stars: Star[] = [];
		const arms = 3;
		const starCount = 1350;

		for (let i = 0; i < starCount; i++) {
			const arm = i % arms;
			// Bias density toward core & mid arms
			const r = Math.pow(rand(), 1.35);
			const scatter = (rand() - 0.5) * (0.28 + r * 0.72);
			const roll = rand();
			let tone: Star['tone'] = 'base';
			if (r < 0.22) {
				tone = roll < 0.4 ? 'purple' : roll < 0.78 ? 'blue' : 'bright';
			} else if (r < 0.6) {
				tone = roll < 0.24 ? 'purple' : roll < 0.48 ? 'blue' : roll < 0.75 ? 'bright' : 'base';
			} else {
				tone = roll < 0.14 ? 'purple' : roll < 0.28 ? 'blue' : roll < 0.62 ? 'base' : 'dim';
			}

			stars.push({
				arm,
				radius: r,
				angleOffset: scatter,
				spread: (rand() - 0.5) * 0.16 * (0.4 + r),
				speed: 0.00018 + (1 - r) * 0.00024,
				tone,
				phase: rand() * Math.PI * 2,
				size: r < 0.35 && roll > 0.7 ? 2.2 : 1.7
			});
		}

		// Sparse ambient background dot-matrix starfield
		const ambientDots: AmbientDot[] = [];
		for (let i = 0; i < 240; i++) {
			const roll = rand();
			ambientDots.push({
				x: rand(),
				y: rand(),
				tone: roll < 0.12 ? 'purple' : roll < 0.24 ? 'blue' : roll < 0.6 ? 'base' : 'dim',
				phase: rand() * Math.PI * 2
			});
		}

		const palette: Record<Star['tone'], [number, number, number]> = {
			dim: [96, 95, 122],
			base: [152, 151, 178],
			bright: [232, 232, 244],
			blue: [98, 123, 255], // #627BFF (logo royal blue highlight)
			purple: [178, 114, 255] // #B272FF (logo royal purple highlight)
		};

		let width = 0;
		let height = 0;
		let dpr = 1;

		function resize() {
			if (!canvasEl || !ctx) return;
			dpr = Math.min(window.devicePixelRatio || 1, 2);
			width = window.innerWidth;
			height = window.innerHeight;
			canvasEl.width = Math.floor(width * dpr);
			canvasEl.height = Math.floor(height * dpr);
			canvasEl.style.width = `${width}px`;
			canvasEl.style.height = `${height}px`;
			ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
		}

		resize();
		window.addEventListener('resize', resize);

		let rafId = 0;
		let startTime = performance.now();
		let lastDraw = 0;
		const frameInterval = 33; // ~30 fps for silky, low-CPU dot-matrix motion

		// Dot-matrix snap step (gives that authentic fps.ms Braille/dot-grid look)
		const gridStep = 6;

		function draw(now: number) {
			if (!ctx) return;

			if (!reducedMotion && now - lastDraw < frameInterval) {
				rafId = requestAnimationFrame(draw);
				return;
			}
			lastDraw = now;

			const elapsed = reducedMotion ? 12000 : now - startTime;
			ctx.clearRect(0, 0, width, height);

			// Subtle scroll parallax so galaxy anchors in hero and drifts gently
			const scrollY = window.scrollY || 0;
			const parallaxY = -scrollY * 0.14;

			// Galaxy center positioned cleanly behind the hero
			const cx = width >= 1024 ? width * 0.62 : width * 0.52;
			const cy = Math.min(height * 0.44, 420) + parallaxY;
			const maxRadius = Math.min(width * 0.62, 680);
			const tiltY = 0.48; // Perspective tilt for elliptical galaxy disc
			const discRotation = -0.24; // Subtle diagonal tilt like fps.ms
			const cosRot = Math.cos(discRotation);
			const sinRot = Math.sin(discRotation);

			// 1. Subtle ambient field dots snapped to dot-matrix grid
			for (let i = 0; i < ambientDots.length; i++) {
				const d = ambientDots[i];
				const gx = Math.round((d.x * width) / gridStep) * gridStep;
				const gy = Math.round((d.y * height) / gridStep) * gridStep;
				const twinkle = 0.22 + 0.25 * (0.5 + 0.5 * Math.sin(elapsed * 0.0014 + d.phase));
				const [r, g, b] = palette[d.tone];
				ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${twinkle.toFixed(3)})`;
				ctx.fillRect(gx, gy, 1.6, 1.6);
			}

			// 2. Spiral galaxy dot-matrix arms
			for (let i = 0; i < stars.length; i++) {
				const s = stars[i];
				const armBase = (s.arm / arms) * Math.PI * 2;
				const spiralTwist = s.radius * 4.4;
				const angle = armBase + spiralTwist + s.angleOffset + elapsed * s.speed;

				const localX = Math.cos(angle) * s.radius * maxRadius;
				const localY = (Math.sin(angle) * s.radius * maxRadius + s.spread * maxRadius) * tiltY;

				// Apply disc rotation
				const rx = cx + localX * cosRot - localY * sinRot;
				const ry = cy + localX * sinRot + localY * cosRot;

				if (rx < -10 || rx > width + 10 || ry < -10 || ry > height + 10) continue;

				// Snap to fine dot-matrix lattice
				const gx = Math.round(rx / gridStep) * gridStep;
				const gy = Math.round(ry / gridStep) * gridStep;

				const twinkle = 0.72 + 0.28 * Math.sin(elapsed * 0.0022 + s.phase);
				const edgeFade = Math.max(0.12, 1 - Math.pow(s.radius, 1.8));
				const alpha = Math.min(0.92, edgeFade * twinkle * (s.tone === 'dim' ? 0.55 : 0.85));

				const [r, g, b] = palette[s.tone];
				ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${alpha.toFixed(3)})`;
				ctx.fillRect(gx, gy, s.size, s.size);
			}

			if (!reducedMotion) {
				rafId = requestAnimationFrame(draw);
			}
		}

		rafId = requestAnimationFrame(draw);

		return () => {
			cancelAnimationFrame(rafId);
			window.removeEventListener('resize', resize);
			mq.removeEventListener('change', onMotionChange);
		};
	});
</script>

<div aria-hidden="true" class="pointer-events-none fixed inset-0 z-0 overflow-hidden bg-[#0A0A0F]">
	<canvas bind:this={canvasEl} class="block h-full w-full"></canvas>
	<!-- Subtle radial readability scrim so foreground copy always keeps high WCAG contrast -->
	<div
		class="absolute inset-0 bg-[radial-gradient(ellipse_at_62%_38%,transparent_0%,rgba(10,10,15,0.45)_58%,rgba(10,10,15,0.88)_100%)]"
	></div>
</div>
