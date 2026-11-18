<script lang="ts">
	import { onMount } from 'svelte';
	import type { AsciiVariant } from '$lib/data/solutions';
	import { renderBrailleGrid, type Tone } from '$lib/utils/brailleArt';

	interface Props {
		variant: AsciiVariant;
		class?: string;
	}

	let { variant, class: className = '' }: Props = $props();

	let frame = $state(0);
	let reducedMotion = $state(false);

	onMount(() => {
		const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
		reducedMotion = mq.matches;
		const onChange = (e: MediaQueryListEvent) => {
			reducedMotion = e.matches;
		};
		mq.addEventListener('change', onChange);

		let rafId = 0;
		let lastTime = 0;
		const fpsInterval = 85;

		const tick = (now: number) => {
			if (!reducedMotion && now - lastTime >= fpsInterval) {
				frame = (frame + 1) % 360;
				lastTime = now;
			}
			rafId = requestAnimationFrame(tick);
		};

		rafId = requestAnimationFrame(tick);

		return () => {
			cancelAnimationFrame(rafId);
			mq.removeEventListener('change', onChange);
		};
	});

	const grid = $derived(renderBrailleGrid(variant, frame));

	const toneClass: Record<Tone, string> = {
		0: '',
		1: 'text-slate-600/85',
		2: 'text-slate-400/90',
		3: 'text-[#ECECF4]',
		4: 'text-[#627BFF]',
		5: 'text-[#B272FF]'
	};
</script>

<div
	aria-hidden="true"
	class="select-none overflow-hidden font-mono leading-[1.05] tracking-[0.01em] {className}"
>
	{#each grid as row}
		<div class="whitespace-pre text-center">
			{#each row as cell}<span class={toneClass[cell.tone]}>{cell.ch}</span>{/each}
		</div>
	{/each}
</div>
