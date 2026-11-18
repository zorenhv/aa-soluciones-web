<script lang="ts">
	import GalaxyBackground from '$lib/components/GalaxyBackground.svelte';
	import Header from '$lib/components/Header.svelte';
	import AsciiArt from '$lib/components/AsciiArt.svelte';
	import ServicesBento from '$lib/components/ServicesBento.svelte';
	import ProcessSimulator from '$lib/components/ProcessSimulator.svelte';
	import CaseStudies from '$lib/components/CaseStudies.svelte';
	import ContactSection from '$lib/components/ContactSection.svelte';
	import Footer from '$lib/components/Footer.svelte';

	let selectedServiceId = $state('software');
	let prefillNote = $state('');

	function handleSelectService(serviceId: string, contextNote?: string) {
		selectedServiceId = serviceId;
		if (contextNote) {
			prefillNote = contextNote;
		}
		const target = document.getElementById('contacto');
		if (target) {
			target.scrollIntoView({ behavior: 'smooth', block: 'start' });
		}
	}

	const heroStats = [
		{ value: '8', label: 'Áreas de tecnología e infraestructura integradas' },
		{ value: '100%', label: 'Soluciones a la medida de tu operación' },
		{ value: '< 24 h', label: 'Tiempo de respuesta para diagnóstico inicial' },
		{ value: '24/7', label: 'Respaldo, monitoreo y soporte continuo' }
	];
</script>

<GalaxyBackground />

<div id="inicio" class="relative z-10 min-h-screen text-[#F4F4F8]">
	<Header />

	<main>
		<!-- Clean Business-Friendly Hero over Animated Dot-Matrix Galaxy -->
		<section class="relative overflow-hidden py-16 lg:py-24">
			<div
				class="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#8447C8]/40 to-transparent"
			></div>

			<div class="mx-auto max-w-7xl px-6">
				<div class="grid grid-cols-1 items-center gap-10 lg:grid-cols-12 lg:gap-12">
					<!-- Left: Clear Non-Technical Value Proposition -->
					<div class="lg:col-span-6">
						<p class="text-sm font-medium text-[#A970FF]">
							AA Soluciones · Tecnología integral para empresas
						</p>

						<h1
							class="mt-4 font-display text-4xl font-semibold leading-[1.08] tracking-tight text-[#F4F4F8] sm:text-5xl lg:text-[3.5rem]"
						>
							Software, inteligencia artificial e infraestructura que hacen crecer tu negocio
						</h1>

						<p class="mt-6 max-w-xl text-base leading-relaxed text-[#B2B1C4] sm:text-lg">
							Desarrollamos tus sistemas web, CRMs, automatizaciones y modelos de análisis, y
							mantenemos tus equipos, redes y servidores trabajando sin interrupciones.
						</p>

						<div class="mt-8 flex flex-wrap items-center gap-4">
							<a
								href="#contacto"
								class="inline-flex items-center justify-center gap-2 rounded-lg bg-[#3B52D4] px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-[#4B63E6] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#8447C8] whitespace-nowrap shrink-0"
							>
								<span>Solicitar cotización</span>
								<svg class="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
									<path d="M5 12h14M13 6l6 6-6 6" />
								</svg>
							</a>

							<a
								href="#servicios"
								class="inline-flex items-center justify-center rounded-lg border border-[#252436] bg-[#12111A]/85 px-5 py-3 text-sm font-medium text-[#D6D5E3] backdrop-blur-sm transition-colors hover:border-[#8447C8] hover:text-white whitespace-nowrap shrink-0"
							>
								Ver servicios
							</a>
						</div>

						<!-- Clean unboxed service overview -->
						<div class="mt-10 border-t border-[#1F1E2E] pt-6">
							<p class="text-xs font-medium text-[#7E7D94]">Nuestras líneas de servicio</p>
							<p class="mt-2 text-sm leading-relaxed text-[#9897AB]">
								Software a Medida · Páginas Web · CRMs · Automatización Cloud · IA y Machine
								Learning · Modelos Matemáticos · Hardware y Soporte · Redes y Servidores
							</p>
						</div>
					</div>

					<!-- Right: Live Animated Dot-Matrix Focal Visual -->
					<div class="lg:col-span-6">
						<div
							class="flex min-h-[340px] items-center justify-center rounded-xl border border-[#222133]/90 bg-[#111019]/70 p-6 backdrop-blur-sm sm:min-h-[400px] sm:p-8"
						>
							<AsciiArt variant="hero" class="text-[9.5px] sm:text-[12px] lg:text-[12.5px]" />
						</div>
					</div>
				</div>

				<!-- Full-width 4-column quantified capability strip below hero split -->
				<div
					class="mt-14 grid grid-cols-2 divide-y divide-[#1F1E2E] overflow-hidden rounded-xl border border-[#222133] bg-[#12111A]/85 backdrop-blur-sm sm:divide-y-0 sm:divide-x lg:grid-cols-4"
				>
					{#each heroStats as stat}
						<div class="p-5 sm:p-6">
							<p class="font-mono text-2xl font-semibold text-[#F4F4F8] tabular-nums sm:text-3xl">
								{stat.value}
							</p>
							<p class="mt-1.5 text-xs leading-relaxed text-[#9897AB]">{stat.label}</p>
						</div>
					{/each}
				</div>
			</div>
		</section>

		<ServicesBento {selectedServiceId} onSelectService={handleSelectService} />

		<ProcessSimulator onApplyEstimate={handleSelectService} />

		<CaseStudies />

		<ContactSection bind:selectedServiceId bind:prefillNote />
	</main>

	<Footer />
</div>
