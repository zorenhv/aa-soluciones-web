<script lang="ts">
	import type { AsciiVariant } from '$lib/data/solutions';
	import { generateBrailleSvg, SVG_EXPORT_ITEMS } from '$lib/utils/brailleArt';
	import AsciiArt from '$lib/components/AsciiArt.svelte';

	interface Props {
		open: boolean;
		onClose: () => void;
	}

	let { open, onClose }: Props = $props();
	let transparentBg = $state(false);
	let downloadedKey = $state<string | null>(null);
	let downloadingAll = $state(false);

	function triggerDownload(svgContent: string, filename: string) {
		const blob = new Blob([svgContent], { type: 'image/svg+xml;charset=utf-8' });
		const url = URL.createObjectURL(blob);
		const link = document.createElement('a');
		link.href = url;
		link.download = filename;
		document.body.appendChild(link);
		link.click();
		document.body.removeChild(link);
		setTimeout(() => URL.revokeObjectURL(url), 1000);
	}

	function downloadOne(variant: AsciiVariant, filename: string) {
		const svg = generateBrailleSvg(variant, 12, { transparentBg });
		triggerDownload(svg, filename);
		downloadedKey = variant;
		setTimeout(() => {
			if (downloadedKey === variant) downloadedKey = null;
		}, 1800);
	}

	async function downloadAll() {
		if (downloadingAll) return;
		downloadingAll = true;
		for (const item of SVG_EXPORT_ITEMS) {
			const svg = generateBrailleSvg(item.variant, 12, { transparentBg });
			triggerDownload(svg, item.filename);
			await new Promise((resolve) => setTimeout(resolve, 180));
		}
		downloadingAll = false;
	}

	function handleKeydown(e: KeyboardEvent) {
		if (open && e.key === 'Escape') {
			onClose();
		}
	}
</script>

<svelte:window onkeydown={handleKeydown} />

{#if open}
	<div
		role="dialog"
		aria-modal="true"
		aria-labelledby="svg-export-title"
		class="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4 backdrop-blur-sm"
	>
		<div
			class="flex max-h-[88vh] w-full max-w-4xl flex-col overflow-hidden rounded-xl border border-[#2A2940] bg-[#100F18]"
		>
			<!-- Modal Header -->
			<div class="flex flex-wrap items-center justify-between gap-4 border-b border-[#222133] px-6 py-4">
				<div>
					<h3 id="svg-export-title" class="font-display text-xl font-semibold text-[#F4F4F8]">
						Descargar ilustraciones de puntitos en SVG
					</h3>
					<p class="mt-1 text-xs text-[#9897AB]">
						Archivos vectoriales editables (compatibles con Figma, Illustrator, Canva y PowerPoint).
					</p>
				</div>

				<button
					type="button"
					onclick={onClose}
					aria-label="Cerrar ventana"
					class="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-[#252436] text-[#9897AB] transition-colors hover:border-[#8447C8] hover:text-white"
				>
					<svg class="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
						<path d="M6 6l12 12M18 6L6 18" />
					</svg>
				</button>
			</div>

			<!-- Controls Bar -->
			<div class="flex flex-wrap items-center justify-between gap-4 border-b border-[#222133] bg-[#0B0A11] px-6 py-3">
				<label class="inline-flex cursor-pointer items-center gap-2.5 text-xs text-[#C6C5D6]">
					<input
						type="checkbox"
						bind:checked={transparentBg}
						class="h-4 w-4 rounded border-[#34334D] bg-[#12111A] accent-[#8447C8]"
					/>
					<span>Exportar con fondo transparente (sin recuadro oscuro)</span>
				</label>

				<button
					type="button"
					onclick={downloadAll}
					disabled={downloadingAll}
					class="inline-flex items-center gap-2 rounded-lg bg-[#3B52D4] px-4 py-2 text-xs font-semibold text-white transition-colors hover:bg-[#4B63E6] disabled:opacity-60 whitespace-nowrap shrink-0"
				>
					<svg class="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
						<path d="M12 3v12m0 0l-4-4m4 4l4-4M4 17v2a2 2 0 002 2h12a2 2 0 002-2v-2" />
					</svg>
					<span>{downloadingAll ? 'Descargando SVGs...' : 'Descargar los 10 SVG'}</span>
				</button>
			</div>

			<!-- Scrollable Grid of Downloadable SVGs -->
			<div class="grid grid-cols-1 gap-4 overflow-y-auto p-6 sm:grid-cols-2 lg:grid-cols-3">
				{#each SVG_EXPORT_ITEMS as item}
					<div class="flex flex-col justify-between rounded-lg border border-[#222133] bg-[#14131E] p-4">
						<div class="flex h-28 items-center justify-center overflow-hidden rounded-md bg-[#0D0C14] p-2">
							<AsciiArt variant={item.variant} class="text-[7px]" />
						</div>

						<div class="mt-3 flex items-center justify-between gap-2">
							<div class="min-w-0">
								<p class="truncate text-xs font-semibold text-[#F4F4F8]">{item.label}</p>
								<p class="truncate font-mono text-[11px] text-[#7E7D94]">{item.filename}</p>
							</div>
							<button
								type="button"
								onclick={() => downloadOne(item.variant, item.filename)}
								class="inline-flex items-center gap-1.5 rounded-md border border-[#2E2D45] bg-[#1B1A29] px-3 py-1.5 text-xs font-medium text-[#C59BFF] transition-colors hover:border-[#8447C8] hover:text-white whitespace-nowrap shrink-0"
							>
								<span>{downloadedKey === item.variant ? 'Listo' : 'SVG'}</span>
							</button>
						</div>
					</div>
				{/each}
			</div>
		</div>
	</div>
{/if}
