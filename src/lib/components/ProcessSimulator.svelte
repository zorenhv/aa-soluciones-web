<script lang="ts">
	import { SIMULATOR_SCENARIOS } from '$lib/data/solutions';

	interface Props {
		onApplyEstimate: (serviceId: string, summary: string) => void;
	}

	let { onApplyEstimate }: Props = $props();

	let activeScenarioId = $state(SIMULATOR_SCENARIOS[0].id);
	let monthlyVolume = $state(SIMULATOR_SCENARIOS[0].defaultVolume);
	let weeklyManualHours = $state(SIMULATOR_SCENARIOS[0].defaultHours);

	const scenario = $derived(
		SIMULATOR_SCENARIOS.find((s) => s.id === activeScenarioId) ?? SIMULATOR_SCENARIOS[0]
	);

	function selectScenario(id: string) {
		const next = SIMULATOR_SCENARIOS.find((s) => s.id === id);
		if (!next) return;
		activeScenarioId = next.id;
		monthlyVolume = next.defaultVolume;
		weeklyManualHours = next.defaultHours;
	}

	const monthlyHoursSaved = $derived(
		Math.round(weeklyManualHours * 4.33 * scenario.automationRate)
	);

	const annualSavingsUsd = $derived(
		Math.round(monthlyHoursSaved * 12 * scenario.hourlyRateUsd)
	);

	const throughputFactor = $derived(
		(1 / (1 - scenario.automationRate)).toFixed(1)
	);

	function formatCurrency(val: number): string {
		return new Intl.NumberFormat('es-MX', {
			style: 'currency',
			currency: 'USD',
			maximumFractionDigits: 0
		}).format(val);
	}

	function sendToContact() {
		const note = `Estimación del simulador (${scenario.label}): ${monthlyVolume.toLocaleString('es-MX')} ${scenario.volumeUnit}/mes y ${weeklyManualHours} h manuales/semana. Ahorro proyectado: ${monthlyHoursSaved} h/mes (${formatCurrency(annualSavingsUsd)} USD/año). Solución sugerida: ${scenario.solutionSummary}.`;
		onApplyEstimate(scenario.serviceId, note);
	}
</script>

<section id="simulador" class="border-t border-[#1F1E2E] py-20 lg:py-24">
	<div class="mx-auto max-w-7xl px-6">
		<div class="grid grid-cols-1 items-start gap-10 lg:grid-cols-12">
			<!-- Left column: Context & Controls -->
			<div class="lg:col-span-6">
				<p class="text-sm font-medium text-[#A970FF]">Simulador de impacto</p>
				<h2 class="mt-2 font-display text-3xl font-semibold tracking-tight text-[#F4F4F8] sm:text-4xl">
					Calcula cuánto tiempo y costo puede recuperar tu equipo
				</h2>
				<p class="mt-4 text-base leading-relaxed text-[#9897AB]">
					Elige el área donde hoy pierden más tiempo y ajusta el volumen aproximado de tu operación.
					Te mostramos una estimación clara y conservadora del ahorro posible.
				</p>

				<!-- Scenario selector buttons -->
				<div class="mt-7 grid grid-cols-1 gap-2 sm:grid-cols-2">
					{#each SIMULATOR_SCENARIOS as item}
						<button
							type="button"
							onclick={() => selectScenario(item.id)}
							class="rounded-lg border px-4 py-3 text-left text-sm font-medium transition-colors focus-visible:outline-2 focus-visible:outline-[#8447C8] {activeScenarioId ===
							item.id
								? 'border-[#8447C8] bg-[#8447C8]/15 text-[#F4F4F8]'
								: 'border-[#222133] bg-[#12111A] text-[#9897AB] hover:border-[#3B52D4]/70 hover:text-[#F4F4F8]'}"
						>
							{item.label}
						</button>
					{/each}
				</div>

				<!-- Sliders -->
				<div class="mt-7 space-y-6 rounded-xl border border-[#222133] bg-[#12111A] p-6">
					<div>
						<div class="flex items-center justify-between gap-4">
							<label for="volume-slider" class="text-sm font-medium text-[#F4F4F8]">
								{scenario.volumeLabel}
							</label>
							<span class="font-mono text-sm font-medium text-[#7D92FF] tabular-nums">
								{monthlyVolume.toLocaleString('es-MX')} {scenario.volumeUnit}
							</span>
						</div>
						<input
							id="volume-slider"
							type="range"
							min={scenario.minVolume}
							max={scenario.maxVolume}
							step={Math.max(1, Math.round((scenario.maxVolume - scenario.minVolume) / 50))}
							bind:value={monthlyVolume}
							class="mt-3 h-1.5 w-full cursor-pointer appearance-none rounded-lg bg-[#232236] accent-[#8447C8]"
						/>
						<div class="mt-1.5 flex justify-between font-mono text-xs text-[#6F6E85] tabular-nums">
							<span>{scenario.minVolume.toLocaleString('es-MX')}</span>
							<span>{scenario.maxVolume.toLocaleString('es-MX')}</span>
						</div>
					</div>

					<div class="border-t border-[#222133] pt-5">
						<div class="flex items-center justify-between gap-4">
							<label for="hours-slider" class="text-sm font-medium text-[#F4F4F8]">
								Horas semanales perdidas en tareas manuales o fallas
							</label>
							<span class="font-mono text-sm font-medium text-[#B272FF] tabular-nums">
								{weeklyManualHours} h / semana
							</span>
						</div>
						<input
							id="hours-slider"
							type="range"
							min={6}
							max={120}
							step={2}
							bind:value={weeklyManualHours}
							class="mt-3 h-1.5 w-full cursor-pointer appearance-none rounded-lg bg-[#232236] accent-[#3B52D4]"
						/>
						<div class="mt-1.5 flex justify-between font-mono text-xs text-[#6F6E85] tabular-nums">
							<span>6 h</span>
							<span>120 h</span>
						</div>
					</div>
				</div>
			</div>

			<!-- Right column: Calculated Output -->
			<div class="lg:col-span-6">
				<div class="rounded-xl border border-[#222133] bg-[#12111A] p-6 sm:p-8">
					<div class="flex flex-wrap items-baseline justify-between gap-2 border-b border-[#222133] pb-5">
						<div>
							<p class="text-xs font-medium text-[#9897AB]">Proyección estimada</p>
							<h3 class="mt-1 font-display text-xl font-semibold text-[#F4F4F8]">
								{scenario.label}
							</h3>
						</div>
						<span class="font-mono text-xs text-[#A970FF] tabular-nums">
							Capacidad {throughputFactor}x
						</span>
					</div>

					<!-- Primary quantified metrics -->
					<div class="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
						<div class="rounded-lg border border-[#222133] bg-[#0A0A0F] p-4">
							<p class="text-xs text-[#9897AB]">Horas operativas recuperadas</p>
							<p class="mt-2 font-mono text-3xl font-semibold text-[#F4F4F8] tabular-nums">
								{monthlyHoursSaved} h
							</p>
							<p class="mt-1 text-xs text-[#6F6E85]">cada mes ({Math.round(scenario.automationRate * 100)}% optimizable)</p>
						</div>

						<div class="rounded-lg border border-[#222133] bg-[#0A0A0F] p-4">
							<p class="text-xs text-[#9897AB]">Ahorro anual estimado</p>
							<p class="mt-2 font-mono text-3xl font-semibold text-[#7D92FF] tabular-nums">
								{formatCurrency(annualSavingsUsd)}
							</p>
							<p class="mt-1 text-xs text-[#6F6E85]">USD · referencia ${scenario.hourlyRateUsd} USD/h</p>
						</div>
					</div>

					<!-- Plain-language solution summary -->
					<div class="mt-6 space-y-3 border-t border-[#222133] pt-5 text-sm">
						<div class="flex flex-col justify-between gap-1 sm:flex-row">
							<span class="text-[#9897AB]">Solución recomendada</span>
							<span class="font-medium text-[#F4F4F8] sm:text-right">{scenario.solutionSummary}</span>
						</div>
						<div class="flex flex-col justify-between gap-1 sm:flex-row">
							<span class="text-[#9897AB]">Mejora esperada</span>
							<span class="font-medium text-[#B272FF] sm:text-right">{scenario.errorReduction}</span>
						</div>
					</div>

					<div class="mt-7 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
						<p class="text-xs text-[#6F6E85]">
							Referencia orientativa para tu diagnóstico gratuito.
						</p>
						<button
							type="button"
							onclick={sendToContact}
							class="inline-flex items-center justify-center gap-2 rounded-lg bg-[#3B52D4] px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#4B63E6] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#8447C8] whitespace-nowrap shrink-0"
						>
							<span>Enviar estimación a contacto</span>
							<svg class="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
								<path d="M5 12h14M13 6l6 6-6 6" />
							</svg>
						</button>
					</div>
				</div>
			</div>
		</div>
	</div>
</section>
