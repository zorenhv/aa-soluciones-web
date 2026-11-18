<script lang="ts">
	import { SERVICES } from '$lib/data/solutions';
	import AsciiArt from '$lib/components/AsciiArt.svelte';

	interface Props {
		selectedServiceId: string;
		onSelectService: (serviceId: string, contextNote?: string) => void;
	}

	let { selectedServiceId, onSelectService }: Props = $props();
</script>

<section id="servicios" class="border-t border-[#1F1E2E] py-20 lg:py-24">
	<div class="mx-auto max-w-7xl px-6">
		<div class="max-w-2xl">
			<p class="text-sm font-medium text-[#A970FF]">Servicios integrales</p>
			<h2 class="mt-2 font-display text-3xl font-semibold tracking-tight text-[#F4F4F8] sm:text-4xl">
				Todo lo que tu empresa necesita en tecnología, bajo un mismo techo
			</h2>
			<p class="mt-4 text-base leading-relaxed text-[#9897AB]">
				Desde el software que impulsa tus ventas y tus modelos de análisis hasta los equipos,
				redes y servidores que mantienen tu oficina trabajando sin pausas.
			</p>
		</div>

		<!-- Modular ASCII Service Grid inspired by fps.ms -->
		<div class="mt-12 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
			{#each SERVICES as service}
				{@const isSelected = selectedServiceId === service.id}

				<article
					class="group flex flex-col justify-between rounded-xl border p-6 transition-colors {isSelected
						? 'border-[#8447C8] bg-[#161422]'
						: 'border-[#222133] bg-[#12111A] hover:border-[#3B52D4]/70'}"
				>
					<div>
						<!-- Centered animated ASCII art canvas -->
						<div class="flex h-36 items-center justify-center overflow-hidden">
							<AsciiArt variant={service.ascii} class="text-[9.5px] sm:text-[10px]" />
						</div>

						<!-- Title & Plain-Language Summary -->
						<h3 class="mt-5 font-display text-lg font-semibold tracking-tight text-[#F4F4F8]">
							{service.title}
						</h3>
						<p class="mt-2 text-sm leading-relaxed text-[#9897AB]">
							{service.summary}
						</p>
					</div>

					<!-- Clean footer row matching fps.ms card cadence -->
					<div class="mt-6 flex items-center justify-between gap-3 border-t border-[#222133] pt-4">
						<span class="truncate text-xs text-[#7E7D94]">{service.outcome}</span>
						<button
							type="button"
							onclick={() => onSelectService(service.id)}
							class="inline-flex items-center gap-1.5 text-xs font-semibold text-[#A970FF] transition-colors hover:text-[#C59BFF] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#8447C8] whitespace-nowrap shrink-0"
						>
							<span>Cotizar</span>
							<svg
								class="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5"
								viewBox="0 0 24 24"
								fill="none"
								stroke="currentColor"
								stroke-width="2"
							>
								<path d="M5 12h14M13 6l6 6-6 6" />
							</svg>
						</button>
					</div>
				</article>
			{/each}
		</div>
	</div>
</section>
