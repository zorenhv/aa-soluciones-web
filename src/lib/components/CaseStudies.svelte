<script lang="ts">
	import { CASE_STUDIES } from '$lib/data/solutions';
	import AsciiArt from '$lib/components/AsciiArt.svelte';
</script>

<section id="casos" class="border-t border-[#1F1E2E] py-20 lg:py-24">
	<div class="mx-auto max-w-7xl px-6">
		<!-- ASCII Methodology Showcase Band -->
		<div class="mb-16 overflow-hidden rounded-xl border border-[#222133] bg-[#12111A]">
			<div class="grid grid-cols-1 items-stretch lg:grid-cols-12">
				<div
					class="flex min-h-[240px] items-center justify-center border-b border-[#222133] bg-[#0D0C14] p-6 lg:col-span-6 lg:border-r lg:border-b-0"
				>
					<AsciiArt variant="methodology" class="text-[9.5px] sm:text-[11px]" />
				</div>

				<div class="flex flex-col justify-center p-6 sm:p-10 lg:col-span-6">
					<p class="text-sm font-medium text-[#A970FF]">Cómo trabajamos</p>
					<h2 class="mt-2 font-display text-2xl font-semibold tracking-tight text-[#F4F4F8] sm:text-3xl">
						Del diagnóstico a resultados en operación sin complicaciones
					</h2>
					<p class="mt-3 text-sm leading-relaxed text-[#9897AB]">
						Hablamos en el idioma de tu negocio. Avanzamos en entregas claras y verificables para que
						siempre sepas qué se está construyendo o instalando y cuándo estará funcionando.
					</p>

					<div class="mt-6 grid grid-cols-1 gap-4 border-t border-[#222133] pt-6 sm:grid-cols-3">
						<div>
							<p class="font-mono text-xs text-[#7D92FF] tabular-nums">Paso 01</p>
							<p class="mt-1 text-sm font-semibold text-[#F4F4F8]">Diagnóstico claro</p>
							<p class="mt-1 text-xs text-[#9897AB]">Entendemos tus metas, procesos y necesidades.</p>
						</div>
						<div>
							<p class="font-mono text-xs text-[#A970FF] tabular-nums">Paso 02</p>
							<p class="mt-1 text-sm font-semibold text-[#F4F4F8]">Implementación ágil</p>
							<p class="mt-1 text-xs text-[#9897AB]">Avances semanales visibles y sin sorpresas.</p>
						</div>
						<div>
							<p class="font-mono text-xs text-[#7D92FF] tabular-nums">Paso 03</p>
							<p class="mt-1 text-sm font-semibold text-[#F4F4F8]">Soporte continuo</p>
							<p class="mt-1 text-xs text-[#9897AB]">Capacitación, mantenimiento y respaldo real.</p>
						</div>
					</div>
				</div>
			</div>
		</div>

		<!-- Quantified B2B Case Studies -->
		<div class="max-w-2xl">
			<p class="text-sm font-medium text-[#A970FF]">Resultados comprobados</p>
			<h2 class="mt-2 font-display text-3xl font-semibold tracking-tight text-[#F4F4F8] sm:text-4xl">
				Impacto real en empresas que confiaron en nosotros
			</h2>
			<p class="mt-4 text-base leading-relaxed text-[#9897AB]">
				Proyectos recientes de software, automatización, modelos matemáticos e infraestructura de
				red y hardware con mejoras medibles desde los primeros meses.
			</p>
		</div>

		<div class="mt-10 grid grid-cols-1 gap-5 lg:grid-cols-3">
			{#each CASE_STUDIES as study}
				<article class="flex flex-col justify-between rounded-xl border border-[#222133] bg-[#12111A] p-6">
					<div>
						<div class="flex items-center gap-2 text-xs text-[#9897AB]">
							<span>{study.sector}</span>
							<span aria-hidden="true">·</span>
							<span>{study.timeframe}</span>
						</div>

						<h3 class="mt-3 font-display text-lg font-semibold leading-snug text-[#F4F4F8]">
							{study.title}
						</h3>

						<!-- Quantified primary outcome -->
						<div class="mt-5 rounded-lg border border-[#222133] bg-[#0A0A0F] p-4">
							<p class="font-mono text-3xl font-semibold text-[#A970FF] tabular-nums">
								{study.metricValue}
							</p>
							<p class="mt-1 text-xs font-medium text-[#F4F4F8]">{study.metricLabel}</p>
							<p class="mt-1 text-xs text-[#9897AB]">{study.secondaryMetric}</p>
						</div>

						<div class="mt-5 space-y-2.5 text-xs leading-relaxed text-[#9897AB]">
							<p><span class="font-medium text-[#D6D5E3]">Reto:</span> {study.challenge}</p>
							<p><span class="font-medium text-[#D6D5E3]">Solución:</span> {study.solution}</p>
						</div>
					</div>
				</article>
			{/each}
		</div>
	</div>
</section>
