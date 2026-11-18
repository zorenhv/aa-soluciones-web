import type { AsciiVariant } from '$lib/data/solutions';

export type Tone = 0 | 1 | 2 | 3 | 4 | 5; // 0=empty, 1=dim, 2=base, 3=bright, 4=blue, 5=purple

export interface Cell {
	ch: string;
	tone: Tone;
}

export interface Canvas {
	w: number;
	h: number;
	px: Uint8Array;
}

const BRAILLE_BITS = [
	[0x01, 0x08],
	[0x02, 0x10],
	[0x04, 0x20],
	[0x40, 0x80]
];

const BAYER4 = [
	[0, 8, 2, 10],
	[12, 4, 14, 6],
	[3, 11, 1, 9],
	[15, 7, 13, 5]
];

export const TONE_HEX: Record<Tone, string> = {
	0: 'transparent',
	1: '#475569',
	2: '#94A3B8',
	3: '#ECECF4',
	4: '#627BFF',
	5: '#B272FF'
};

export const SVG_EXPORT_ITEMS: { variant: AsciiVariant; filename: string; label: string }[] = [
	{ variant: 'hero', filename: 'aa-soluciones-hero.svg', label: 'Hero Principal' },
	{ variant: 'software', filename: 'servicio-01-software.svg', label: '01. Desarrollo de Software' },
	{ variant: 'web', filename: 'servicio-02-paginas-web.svg', label: '02. Páginas y Apps Web' },
	{ variant: 'crm', filename: 'servicio-03-crm.svg', label: '03. CRMs a Medida' },
	{ variant: 'cloud', filename: 'servicio-04-nube.svg', label: '04. Automatización en la Nube' },
	{ variant: 'ai-ml', filename: 'servicio-05-ia-ml.svg', label: '05. Inteligencia Artificial y ML' },
	{ variant: 'math-data', filename: 'servicio-06-modelos-matematicos.svg', label: '06. Análisis de Datos y Modelos Matemáticos' },
	{ variant: 'hardware', filename: 'servicio-07-hardware-soporte.svg', label: '07. Hardware y Soporte Técnico' },
	{ variant: 'network', filename: 'servicio-08-redes-servidores.svg', label: '08. Redes y Servidores' },
	{ variant: 'methodology', filename: 'aa-soluciones-metodologia.svg', label: 'Metodología de Trabajo' }
];

function makeCanvas(cols: number, rows: number): Canvas {
	const w = cols * 2;
	const h = rows * 4;
	return { w, h, px: new Uint8Array(w * h) };
}

function setPx(c: Canvas, x: number, y: number, tone: Tone) {
	const xi = Math.round(x);
	const yi = Math.round(y);
	if (xi >= 0 && xi < c.w && yi >= 0 && yi < c.h) {
		const idx = yi * c.w + xi;
		if (tone >= c.px[idx]) {
			c.px[idx] = tone;
		}
	}
}

function setDitherPx(c: Canvas, x: number, y: number, density: number, tone: Tone) {
	const xi = Math.round(x);
	const yi = Math.round(y);
	if (xi >= 0 && xi < c.w && yi >= 0 && yi < c.h) {
		const threshold = (BAYER4[yi & 3][xi & 3] + 0.5) / 16;
		if (density > threshold) {
			setPx(c, xi, yi, tone);
		}
	}
}

function drawLine(c: Canvas, x0: number, y0: number, x1: number, y1: number, tone: Tone, step = 1) {
	const dist = Math.max(Math.abs(x1 - x0), Math.abs(y1 - y0), 1);
	for (let i = 0; i <= dist; i += step) {
		const t = i / dist;
		setPx(c, x0 + (x1 - x0) * t, y0 + (y1 - y0) * t, tone);
	}
}

function drawRect(c: Canvas, x: number, y: number, w: number, h: number, tone: Tone) {
	drawLine(c, x, y, x + w, y, tone);
	drawLine(c, x, y + h, x + w, y + h, tone);
	drawLine(c, x, y, x, y + h, tone);
	drawLine(c, x + w, y, x + w, y + h, tone);
}

function fillRectDither(c: Canvas, x: number, y: number, w: number, h: number, density: number, tone: Tone) {
	for (let py = y; py <= y + h; py++) {
		for (let px = x; px <= x + w; px++) {
			setDitherPx(c, px, py, density, tone);
		}
	}
}

function drawCircle(c: Canvas, cx: number, cy: number, r: number, tone: Tone, fillDensity = 0) {
	if (fillDensity > 0) {
		for (let py = Math.floor(cy - r); py <= Math.ceil(cy + r); py++) {
			for (let px = Math.floor(cx - r); px <= Math.ceil(cx + r); px++) {
				const d = Math.hypot(px - cx, py - cy);
				if (d <= r) setDitherPx(c, px, py, fillDensity, tone);
			}
		}
	}
	const steps = Math.max(24, Math.round(r * 6));
	for (let i = 0; i < steps; i++) {
		const a = (i / steps) * Math.PI * 2;
		setPx(c, cx + Math.cos(a) * r, cy + Math.sin(a) * r, tone);
	}
}

function drawIsoBox(
	c: Canvas,
	cx: number,
	cy: number,
	rx: number,
	ry: number,
	height: number,
	t: number,
	accentFaces = false
) {
	const top = { x: cx, y: cy - ry };
	const right = { x: cx + rx, y: cy };
	const bottom = { x: cx, y: cy + ry };
	const left = { x: cx - rx, y: cy };

	for (let u = 0; u <= 1; u += 0.04) {
		for (let v = 0; v <= 1; v += 0.04) {
			const px = top.x + (right.x - top.x) * u + (left.x - top.x) * v;
			const py = top.y + (right.y - top.y) * u + (left.y - top.y) * v;
			setDitherPx(c, px, py, 0.55, 2);
		}
	}

	for (let u = 0; u <= 1; u += 0.045) {
		for (let v = 0; v <= 1; v += 0.05) {
			const px = left.x + (bottom.x - left.x) * u;
			const py = left.y + (bottom.y - left.y) * u + height * v;
			const isPulse = accentFaces && Math.abs(((u + v + t * 0.03) % 1) - 0.5) < 0.08;
			setDitherPx(c, px, py, isPulse ? 0.95 : 0.42, isPulse ? 4 : 2);
		}
	}

	for (let u = 0; u <= 1; u += 0.045) {
		for (let v = 0; v <= 1; v += 0.05) {
			const px = bottom.x + (right.x - bottom.x) * u;
			const py = bottom.y + (right.y - bottom.y) * u + height * v;
			const isPulse = accentFaces && Math.abs(((u - v + 2 + t * 0.03) % 1) - 0.5) < 0.08;
			setDitherPx(c, px, py, isPulse ? 0.95 : 0.72, isPulse ? 5 : 2);
		}
	}

	drawLine(c, top.x, top.y, right.x, right.y, 3);
	drawLine(c, top.x, top.y, left.x, left.y, 3);
	drawLine(c, left.x, left.y, bottom.x, bottom.y, 3);
	drawLine(c, right.x, right.y, bottom.x, bottom.y, 3);
	drawLine(c, left.x, left.y, left.x, left.y + height, 3);
	drawLine(c, right.x, right.y, right.x, right.y + height, 3);
	drawLine(c, bottom.x, bottom.y, bottom.x, bottom.y + height, 3);
	drawLine(c, left.x, left.y + height, bottom.x, bottom.y + height, 3);
	drawLine(c, right.x, right.y + height, bottom.x, bottom.y + height, 3);
}

export function renderDotCanvas(variant: AsciiVariant, t: number): Canvas {
	switch (variant) {
		case 'hero': {
			const c = makeCanvas(44, 20);
			const cx = 44;
			const cy = 34;

			for (let i = 0; i < 96; i++) {
				const a = (i / 96) * Math.PI * 2;
				if (Math.sin(a) < 0) {
					const ox = cx + Math.cos(a) * 38;
					const oy = cy + 12 + Math.sin(a) * 14;
					if (i % 2 === 0) setPx(c, ox, oy, 1);
				}
			}

			const bob = Math.sin(t * 0.1) * 1.8;
			drawIsoBox(c, cx, cy + bob, 20, 11, 20, t, true);
			drawLine(c, cx - 16, cy + bob + 8, cx - 4, cy + bob + 14, 4);
			drawLine(c, cx - 16, cy + bob + 14, cx - 4, cy + bob + 20, 4);

			for (let i = 0; i < 96; i++) {
				const a = (i / 96) * Math.PI * 2;
				if (Math.sin(a) >= -0.15) {
					const ox = cx + Math.cos(a) * 38;
					const oy = cy + 12 + Math.sin(a) * 14;
					if (i % 2 === 0) setPx(c, ox, oy, 2);
				}
			}

			const a1 = (t * 0.08) % (Math.PI * 2);
			const a2 = (a1 + Math.PI) % (Math.PI * 2);
			const beacons: [number, Tone][] = [
				[a1, 5],
				[a2, 4]
			];
			for (const [ang, tone] of beacons) {
				const bx = cx + Math.cos(ang) * 38;
				const by = cy + 12 + Math.sin(ang) * 14;
				drawCircle(c, bx, by, 1.8, tone, 1);
			}
			return c;
		}

		case 'software': {
			const c = makeCanvas(32, 13);
			const bob = Math.sin(t * 0.12) * 1.2;
			drawIsoBox(c, 26, 20 + bob, 11, 6, 13, t, true);
			drawIsoBox(c, 38, 26 - bob, 11, 6, 13, t + 12, true);
			return c;
		}

		case 'web': {
			const c = makeCanvas(32, 13);
			drawRect(c, 6, 5, 52, 40, 3);
			drawLine(c, 6, 12, 58, 12, 2);
			setPx(c, 10, 8, 5);
			setPx(c, 11, 8, 5);
			setPx(c, 14, 8, 4);
			setPx(c, 15, 8, 4);
			setPx(c, 18, 8, 2);

			const scanX = 24 + ((t * 2) % 30);
			setPx(c, scanX, 8, 5);
			setPx(c, scanX + 1, 8, 5);
			setPx(c, scanX, 9, 5);

			fillRectDither(c, 10, 17, 20, 3, 0.85, 3);
			drawLine(c, 10, 24, 28, 24, 2);
			drawLine(c, 10, 28, 25, 28, 2);
			drawLine(c, 10, 32, 29, 32, 2);
			drawLine(c, 10, 36, 22, 36, 1);

			const activeLineY = 24 + (Math.floor(t / 10) % 3) * 4;
			drawLine(c, 10, activeLineY, 18, activeLineY, 4);

			fillRectDither(c, 35, 17, 18, 22, 0.6, 2);
			drawRect(c, 35, 17, 18, 22, 2);
			const glowY = 19 + (t % 18);
			drawLine(c, 37, glowY, 51, glowY, 5, 2);
			return c;
		}

		case 'crm': {
			const c = makeCanvas(32, 13);
			const hub = { x: 32, y: 26 };
			const clients = [
				{ x: 12, y: 12 },
				{ x: 52, y: 12 },
				{ x: 12, y: 40 },
				{ x: 52, y: 40 }
			];

			for (let i = 0; i < clients.length; i++) {
				const cl = clients[i];
				drawLine(c, cl.x, cl.y, hub.x, hub.y, 1, 2);
				const p = (t * 0.05 + i * 0.25) % 1;
				const px = cl.x + (hub.x - cl.x) * p;
				const py = cl.y + (hub.y - cl.y) * p;
				drawCircle(c, px, py, 1.5, i % 2 === 0 ? 4 : 5, 1);
				drawCircle(c, cl.x, cl.y, 4.5, 2, 0.35);
			}

			drawCircle(c, hub.x, hub.y, 8, 3, 0.55);
			drawCircle(c, hub.x, hub.y, 3.2, 5, 0.9);
			return c;
		}

		case 'cloud': {
			const c = makeCanvas(32, 13);
			drawCircle(c, 22, 21, 9, 2, 0.45);
			drawCircle(c, 32, 16, 11, 3, 0.55);
			drawCircle(c, 43, 21, 8.5, 2, 0.45);
			fillRectDither(c, 20, 22, 24, 7, 0.5, 2);
			drawLine(c, 16, 29, 48, 29, 3);

			const lanes = [20, 28, 36, 44];
			for (let i = 0; i < lanes.length; i++) {
				const lx = lanes[i];
				drawLine(c, lx, 32, lx, 47, 1, 2);
				const py = 32 + ((t * 2 + i * 4) % 16);
				const tone: Tone = i % 2 === 0 ? 4 : 5;
				setPx(c, lx, py, tone);
				setPx(c, lx, py + 1, tone);
				setPx(c, lx + 1, py, tone);
			}
			return c;
		}

		case 'ai-ml': {
			const c = makeCanvas(32, 13);
			const layers = [
				{ x: 12, ys: [12, 26, 40] },
				{ x: 32, ys: [9, 20, 32, 43] },
				{ x: 52, ys: [18, 34] }
			];

			for (let l = 0; l < 2; l++) {
				for (const y1 of layers[l].ys) {
					for (const y2 of layers[l + 1].ys) {
						drawLine(c, layers[l].x, y1, layers[l + 1].x, y2, 1, 3);
					}
				}
			}

			const phase = (t * 0.07) % 2;
			const srcLayer = phase < 1 ? 0 : 1;
			const frac = phase % 1;
			for (let i = 0; i < layers[srcLayer].ys.length; i++) {
				const y1 = layers[srcLayer].ys[i];
				const y2 = layers[srcLayer + 1].ys[i % layers[srcLayer + 1].ys.length];
				const px = layers[srcLayer].x + (layers[srcLayer + 1].x - layers[srcLayer].x) * frac;
				const py = y1 + (y2 - y1) * frac;
				drawCircle(c, px, py, 1.4, srcLayer === 0 ? 4 : 5, 1);
			}

			for (let l = 0; l < layers.length; l++) {
				const active = Math.floor(t / 12) % 3 === l;
				for (const y of layers[l].ys) {
					drawCircle(c, layers[l].x, y, 3.2, active ? (l === 1 ? 5 : 4) : 3, active ? 0.85 : 0.4);
				}
			}
			return c;
		}

		case 'math-data': {
			const c = makeCanvas(32, 13);
			const phase = t * 0.14;
			for (let gy = -5; gy <= 5; gy++) {
				for (let gx = -7; gx <= 7; gx++) {
					const z = Math.sin(gx * 0.55 + phase) * Math.cos(gy * 0.55 - phase * 0.6) * 7.5;
					const sx = 32 + (gx - gy) * 2.4;
					const sy = 27 + (gx + gy) * 1.25 - z;
					const tone: Tone = z > 4.2 ? 5 : z > 1.8 ? 4 : z > -1.5 ? 3 : 1;
					setPx(c, sx, sy, tone);
					if (z > 2.5) setPx(c, sx + 1, sy, tone);
				}
			}
			return c;
		}

		case 'hardware': {
			const c = makeCanvas(32, 13);
			drawRect(c, 17, 11, 30, 30, 3);
			fillRectDither(c, 22, 16, 20, 20, 0.5, 2);
			drawRect(c, 22, 16, 20, 20, 2);

			for (let i = 0; i < 6; i++) {
				const offset = 20 + i * 4.8;
				const topActive = (i + Math.floor(t / 4)) % 6 === 0;
				const botActive = (i + Math.floor(t / 4) + 3) % 6 === 0;
				drawLine(c, offset, 5, offset, 10, topActive ? 4 : 2);
				drawLine(c, offset, 42, offset, 47, botActive ? 5 : 2);

				const yOff = 14 + i * 4.8;
				drawLine(c, 11, yOff, 16, yOff, botActive ? 5 : 2);
				drawLine(c, 48, yOff, 53, yOff, topActive ? 4 : 2);
			}

			const corePulse = 2 + Math.sin(t * 0.25) * 1.2;
			drawCircle(c, 32, 26, corePulse + 2, 4, 0.6);
			drawCircle(c, 32, 26, 2, 5, 1);
			return c;
		}

		case 'network': {
			const c = makeCanvas(32, 13);
			drawRect(c, 6, 17, 14, 24, 3);
			fillRectDither(c, 8, 19, 10, 20, 0.45, 2);
			drawLine(c, 8, 24, 18, 24, 3);
			drawLine(c, 8, 31, 18, 31, 3);
			setPx(c, 10, 21, 4);
			setPx(c, 11, 21, 4);
			setPx(c, 10, 28, 5);
			setPx(c, 11, 28, 5);

			const arcSteps = 18;
			for (let i = 0; i <= arcSteps; i++) {
				const frac = i / arcSteps;
				const ax = 21 + frac * 17;
				const ay = 22 - Math.sin(frac * Math.PI) * 11;
				if (i % 2 === 0) setPx(c, ax, ay, 2);
			}
			const pf = (t % 20) / 20;
			const px = 21 + pf * 17;
			const py = 22 - Math.sin(pf * Math.PI) * 11;
			drawCircle(c, px, py, 1.5, 5, 1);

			const gcx = 48;
			const gcy = 27;
			const gr = 11;
			drawCircle(c, gcx, gcy, gr, 3, 0);
			for (const lat of [-0.45, 0, 0.45]) {
				const ly = gcy + lat * gr;
				const lw = Math.sqrt(1 - lat * lat) * gr;
				drawLine(c, gcx - lw, ly, gcx + lw, ly, 1, 2);
			}
			for (let m = 0; m < 3; m++) {
				const ang = (m / 3) * Math.PI + t * 0.06;
				const rx = Math.cos(ang) * gr;
				for (let s = -12; s <= 12; s++) {
					const a = (s / 12) * (Math.PI / 2);
					const mx = gcx + Math.cos(a) * rx;
					const my = gcy + Math.sin(a) * gr;
					setPx(c, mx, my, m === 0 ? 4 : 2);
				}
			}
			return c;
		}

		case 'methodology': {
			const c = makeCanvas(44, 15);
			const xs = [18, 44, 70];
			drawLine(c, 26, 32, 36, 32, 1, 2);
			drawLine(c, 52, 32, 62, 32, 1, 2);

			const p1 = (t % 24) / 24;
			drawCircle(c, 26 + p1 * 10, 32, 1.3, 4, 1);
			drawCircle(c, 52 + ((p1 + 0.5) % 1) * 10, 32, 1.3, 5, 1);

			for (let i = 0; i < xs.length; i++) {
				drawIsoBox(c, xs[i], 24, 9, 5, 12, t + i * 8, true);
			}
			return c;
		}
	}
}

export function renderBrailleGrid(variant: AsciiVariant, frame: number): Cell[][] {
	const c = renderDotCanvas(variant, frame);
	const cols = c.w / 2;
	const rows = c.h / 4;
	const out: Cell[][] = [];

	for (let r = 0; r < rows; r++) {
		const row: Cell[] = [];
		for (let col = 0; col < cols; col++) {
			let mask = 0;
			let bestTone: Tone = 0;
			for (let dy = 0; dy < 4; dy++) {
				for (let dx = 0; dx < 2; dx++) {
					const tone = c.px[(r * 4 + dy) * c.w + (col * 2 + dx)] as Tone;
					if (tone > 0) {
						mask |= BRAILLE_BITS[dy][dx];
						if (tone > bestTone) bestTone = tone;
					}
				}
			}
			row.push({
				ch: mask === 0 ? ' ' : String.fromCharCode(0x2800 | mask),
				tone: bestTone
			});
		}
		out.push(row);
	}
	return out;
}

export function generateBrailleSvg(
	variant: AsciiVariant,
	frame = 12,
	options: { transparentBg?: boolean } = {}
): string {
	const c = renderDotCanvas(variant, frame);
	const pitch = 6;
	const radius = 1.65;
	const pad = 24;
	const width = c.w * pitch + pad * 2;
	const height = c.h * pitch + pad * 2;

	const groups: Record<Tone, string[]> = {
		0: [],
		1: [],
		2: [],
		3: [],
		4: [],
		5: []
	};

	for (let y = 0; y < c.h; y++) {
		for (let x = 0; x < c.w; x++) {
			const tone = c.px[y * c.w + x] as Tone;
			if (tone > 0) {
				const cx = pad + x * pitch + pitch / 2;
				const cy = pad + y * pitch + pitch / 2;
				groups[tone].push(`<circle cx="${cx}" cy="${cy}" r="${radius}"/>`);
			}
		}
	}

	const bgRect = options.transparentBg
		? ''
		: `<rect width="${width}" height="${height}" rx="16" fill="#12111A"/>`;

	const layers = ([1, 2, 3, 4, 5] as Tone[])
		.filter((t) => groups[t].length > 0)
		.map((t) => `<g fill="${TONE_HEX[t]}">${groups[t].join('')}</g>`)
		.join('\n  ');

	return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}" width="${width}" height="${height}" fill="none">
  ${bgRect}
  ${layers}
</svg>
`;
}
