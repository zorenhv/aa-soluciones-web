<script lang="ts">
	import { CONTACT_CONFIG, SERVICES } from '$lib/data/solutions';

	interface Props {
		selectedServiceId: string;
		prefillNote: string;
	}

	let { selectedServiceId = $bindable(), prefillNote = $bindable() }: Props = $props();

	let activeChannel = $state<'email' | 'whatsapp'>('email');
	let fullName = $state('');
	let company = $state('');
	let email = $state('');
	let phone = $state('');
	let budget = $state('por-definir');
	let message = $state('');
	let aceptaAviso = $state(false);
	let aceptaMarketing = $state(false);

	let errors = $state<Record<string, string>>({});
	let sending = $state(false);
	let sendError = $state('');
	let submittedChannel = $state<'email' | 'whatsapp' | null>(null);
	let referenceCode = $state('');
	let copied = $state(false);

	$effect(() => {
		if (prefillNote && prefillNote.trim().length > 0) {
			message = prefillNote;
		}
	});

	const selectedServiceLabel = $derived(
		SERVICES.find((s) => s.id === selectedServiceId)?.title ?? 'Desarrollo de Software'
	);

	const budgetLabels: Record<string, string> = {
		'por-definir': 'Por definir en diagnóstico',
		'under-50k': 'Menos de $50,000 MXN',
		'50k-150k': '$50,000 – $150,000 MXN',
		'150k-400k': '$150,000 – $400,000 MXN',
		'over-400k': 'Más de $400,000 MXN'
	};

	const formattedSummary = $derived(
		[
			`Hola equipo de AA Soluciones,`,
			`Nombre: ${fullName.trim() || '(Por completar)'}`,
			`Empresa: ${company.trim() || '(No especificada)'}`,
			`Correo: ${email.trim() || '(Por completar)'}`,
			phone.trim() ? `Teléfono / WhatsApp: ${phone.trim()}` : null,
			`Servicio de interés: ${selectedServiceLabel}`,
			`Presupuesto estimado: ${budgetLabels[budget] ?? budget}`,
			`Detalle del proyecto: ${message.trim() || '(Describir requerimiento)'}`
		]
			.filter(Boolean)
			.join('\n')
	);

	const whatsappHref = $derived(
		`https://wa.me/${CONTACT_CONFIG.whatsappNumber}?text=${encodeURIComponent(formattedSummary)}`
	);

	const mailtoHref = $derived(
		`mailto:${CONTACT_CONFIG.email}?subject=${encodeURIComponent(
			`Solicitud de cotización — ${selectedServiceLabel}`
		)}&body=${encodeURIComponent(formattedSummary)}`
	);

	function validate(channel: 'email' | 'whatsapp'): boolean {
		const nextErrors: Record<string, string> = {};

		if (fullName.trim().length < 2) {
			nextErrors.fullName = 'Ingrese su nombre completo.';
		}

		if (channel === 'email') {
			const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
			if (!emailRegex.test(email.trim())) {
				nextErrors.email = 'Ingrese un correo electrónico válido.';
			}
		} else {
			if (phone.trim().length < 8) {
				nextErrors.phone = 'Ingrese un número de WhatsApp válido (mínimo 8 dígitos).';
			}
		}

		if (message.trim().length < 15) {
			nextErrors.message = 'Cuéntenos brevemente qué necesita (mínimo 15 caracteres).';
		}

		if (!aceptaAviso) {
			nextErrors.aceptaAviso = 'Debe aceptar el aviso de privacidad para continuar.';
		}

		errors = nextErrors;
		return Object.keys(nextErrors).length === 0;
	}

	async function handleSubmit(e: SubmitEvent) {
		e.preventDefault();
		sendError = '';
		if (!validate(activeChannel)) return;

		const rand = Math.floor(1000 + Math.random() * 9000);
		const ref = `AA-${new Date().getFullYear()}-${rand}`;
		referenceCode = ref;

		if (activeChannel === 'whatsapp') {
			submittedChannel = 'whatsapp';
			return;
		}

		sending = true;
		try {
			const formData = new FormData();
			formData.append('access_key', CONTACT_CONFIG.web3formsKey);
			formData.append('subject', `Nueva cotización (${ref}) — ${selectedServiceLabel}`);
			formData.append('from_name', 'AA Soluciones Web');
			formData.append('replyto', email.trim());
			formData.append('Referencia', ref);
			formData.append('Nombre', fullName.trim());
			formData.append('Empresa', company.trim() || 'No especificada');
			formData.append('Correo', email.trim());
			formData.append('Telefono', phone.trim() || 'No proporcionado');
			formData.append('Servicio', selectedServiceLabel);
			formData.append('Presupuesto', budgetLabels[budget] ?? budget);
			formData.append('Mensaje', message.trim());
			formData.append('acepta_aviso', aceptaAviso ? 'Sí' : 'No');
			formData.append('acepta_marketing', aceptaMarketing ? 'Sí' : 'No');

			const res = await fetch('https://api.web3forms.com/submit', {
				method: 'POST',
				headers: {
					Accept: 'application/json'
				},
				body: formData
			});

			const data = await res.json().catch(() => null);
			if (!res.ok || !data?.success) {
				throw new Error(data?.message || `Error del servicio (${res.status}).`);
			}

			submittedChannel = 'email';
		} catch (err) {
			const detail = err instanceof Error && err.message ? ` (${err.message})` : '';
			sendError = `No fue posible completar el envío automático${detail}. Puedes reintentar, enviarlo por WhatsApp o abrir tu correo.`;
		} finally {
			sending = false;
		}
	}

	function resetSubmission() {
		submittedChannel = null;
		sendError = '';
		copied = false;
	}

	async function copySummary() {
		try {
			await navigator.clipboard.writeText(formattedSummary);
			copied = true;
			setTimeout(() => {
				copied = false;
			}, 2500);
		} catch {
			copied = false;
		}
	}
</script>

<section id="contacto" class="border-t border-[#1F1E2E] py-20 lg:py-24">
	<div class="mx-auto max-w-7xl px-6">
		<div class="grid grid-cols-1 items-start gap-10 lg:grid-cols-12">
			<!-- Left Column: Direct Channels & Context -->
			<div class="lg:col-span-5">
				<p class="text-sm font-medium text-[#A970FF]">Contacto directo</p>
				<h2 class="mt-2 font-display text-3xl font-semibold tracking-tight text-[#F4F4F8] sm:text-4xl">
					Platícanos tu proyecto por correo o WhatsApp
				</h2>
				<p class="mt-4 text-base leading-relaxed text-[#9897AB]">
					Cuéntanos qué deseas construir, automatizar o mejorar en tu empresa. Te respondemos en menos
					de 24 horas hábiles con una propuesta clara y sin tecnicismos innecesarios.
				</p>

				<div class="mt-8 space-y-4">
					<div class="rounded-xl border border-[#222133] bg-[#12111A] p-5">
						<p class="text-xs font-medium text-[#9897AB]">Correo electrónico</p>
						<a
							href="mailto:{CONTACT_CONFIG.email}"
							class="mt-1 inline-block font-mono text-sm font-medium text-[#F4F4F8] transition-colors hover:text-[#7D92FF]"
						>
							{CONTACT_CONFIG.email}
						</a>
						<p class="mt-1.5 text-xs text-[#6F6E85]">
							Ideal para cotizaciones formales, licitaciones o envío de requerimientos detallados.
						</p>
					</div>

					<div class="rounded-xl border border-[#222133] bg-[#12111A] p-5">
						<p class="text-xs font-medium text-[#9897AB]">WhatsApp empresarial</p>
						<a
							href={whatsappHref}
							target="_blank"
							rel="noopener noreferrer"
							class="mt-1 inline-block font-mono text-sm font-medium text-[#A970FF] transition-colors hover:text-[#C59BFF]"
						>
							{CONTACT_CONFIG.whatsappDisplay}
						</a>
						<p class="mt-1.5 text-xs text-[#6F6E85]">
							Atención rápida para resolver dudas, agendar una llamada o solicitar soporte.
						</p>
					</div>
				</div>

				<p class="mt-6 text-xs text-[#6F6E85]">{CONTACT_CONFIG.location}</p>
			</div>

			<!-- Right Column: Interactive Dual-Channel Contact Form -->
			<div class="lg:col-span-7">
				<div class="rounded-xl border border-[#222133] bg-[#12111A] p-6 sm:p-8">
					<!-- Channel Segmented Control -->
					<div
						role="tablist"
						aria-label="Canal de contacto preferido"
						class="grid grid-cols-2 gap-1.5 rounded-lg border border-[#222133] bg-[#0A0A0F] p-1"
					>
						<button
							type="button"
							role="tab"
							aria-selected={activeChannel === 'email'}
							onclick={() => {
								activeChannel = 'email';
								errors = {};
								sendError = '';
								submittedChannel = null;
							}}
							class="flex items-center justify-center gap-2 rounded-md px-4 py-2.5 text-xs font-semibold transition-colors whitespace-nowrap shrink-0 {activeChannel ===
							'email'
								? 'bg-[#3B52D4] text-white'
								: 'text-[#9897AB] hover:text-[#F4F4F8]'}"
						>
							<svg class="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
								<rect x="3" y="5" width="18" height="14" rx="2" />
								<path d="M3 7l9 6 9-6" />
							</svg>
							<span>Correo Electrónico</span>
						</button>

						<button
							type="button"
							role="tab"
							aria-selected={activeChannel === 'whatsapp'}
							onclick={() => {
								activeChannel = 'whatsapp';
								errors = {};
								sendError = '';
								submittedChannel = null;
							}}
							class="flex items-center justify-center gap-2 rounded-md px-4 py-2.5 text-xs font-semibold transition-colors whitespace-nowrap shrink-0 {activeChannel ===
							'whatsapp'
								? 'bg-[#8447C8] text-white'
								: 'text-[#9897AB] hover:text-[#F4F4F8]'}"
						>
							<svg class="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
								<path d="M21 11.5a8.38 8.38 0 01-.9 3.8 8.5 8.5 0 01-7.6 4.7 8.38 8.38 0 01-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 01-.9-3.8 8.5 8.5 0 014.7-7.6 8.38 8.38 0 013.8-.9h.5a8.48 8.48 0 018 8v.5z" />
							</svg>
							<span>WhatsApp Directo</span>
						</button>
					</div>

					{#if submittedChannel}
						<!-- Confirmation State -->
						<div class="mt-6 rounded-xl border border-[#8447C8]/50 bg-[#0A0A0F] p-6">
							<div class="flex items-start justify-between gap-4">
								<div>
									<p class="font-mono text-xs text-[#A970FF]">Referencia {referenceCode}</p>
									<h3 class="mt-1 font-display text-xl font-semibold text-[#F4F4F8]">
										{submittedChannel === 'email'
											? '¡Solicitud enviada por correo!'
											: 'Mensaje estructurado listo para WhatsApp'}
									</h3>
									<p class="mt-2 text-sm leading-relaxed text-[#9897AB]">
										{#if submittedChannel === 'email'}
											Recibimos tu solicitud directamente en {CONTACT_CONFIG.email}. Nuestro equipo te
											responderá en menos de 24 horas hábiles.
										{:else}
											Tu mensaje ya incluye todos los datos de tu solicitud. Haz clic en el botón para
											iniciar la conversación directa con nuestro equipo en WhatsApp.
										{/if}
									</p>
								</div>
							</div>

							<pre
								class="mt-4 overflow-x-auto rounded-lg border border-[#222133] bg-[#12111A] p-4 font-mono text-xs leading-relaxed text-[#D6D5E3] whitespace-pre-wrap"
							>{formattedSummary}</pre>

							<div class="mt-5 flex flex-wrap items-center gap-3">
								{#if submittedChannel === 'email'}
									<a
										href={whatsappHref}
										target="_blank"
										rel="noopener noreferrer"
										class="inline-flex items-center gap-2 rounded-lg bg-[#8447C8] px-4 py-2.5 text-xs font-semibold text-white transition-colors hover:bg-[#9558DB] whitespace-nowrap shrink-0"
									>
										<span>Dar seguimiento por WhatsApp</span>
									</a>
								{:else}
									<a
										href={whatsappHref}
										target="_blank"
										rel="noopener noreferrer"
										class="inline-flex items-center gap-2 rounded-lg bg-[#8447C8] px-4 py-2.5 text-xs font-semibold text-white transition-colors hover:bg-[#9558DB] whitespace-nowrap shrink-0"
									>
										<span>Abrir chat en WhatsApp</span>
									</a>
								{/if}

								<button
									type="button"
									onclick={copySummary}
									class="inline-flex items-center gap-1.5 rounded-lg border border-[#252436] px-3.5 py-2.5 text-xs font-medium text-[#C6C5D6] transition-colors hover:border-[#3B52D4] hover:text-white whitespace-nowrap shrink-0"
								>
									<span>{copied ? 'Resumen copiado' : 'Copiar resumen'}</span>
								</button>

								<button
									type="button"
									onclick={resetSubmission}
									class="ml-auto text-xs font-medium text-[#9897AB] underline-offset-4 hover:text-white hover:underline"
								>
									Enviar otra solicitud
								</button>
							</div>
						</div>
					{:else}
						<form onsubmit={handleSubmit} novalidate class="mt-6 space-y-5">
							<div class="grid grid-cols-1 gap-5 sm:grid-cols-2">
								<div>
									<label for="contact-name" class="block text-xs font-medium text-[#C6C5D6]">
										Nombre completo <span class="text-[#A970FF]">*</span>
									</label>
									<input
										id="contact-name"
										type="text"
										bind:value={fullName}
										placeholder="Ej. Carlos Hernández"
										class="mt-1.5 w-full rounded-lg border bg-[#0A0A0F] px-3.5 py-2.5 text-sm text-[#F4F4F8] placeholder:text-[#5B5A70] focus:border-[#8447C8] focus:outline-none {errors.fullName
											? 'border-red-500/80'
											: 'border-[#252436]'}"
									/>
									{#if errors.fullName}
										<p class="mt-1.5 text-xs text-red-400">{errors.fullName}</p>
									{/if}
								</div>

								<div>
									<label for="contact-company" class="block text-xs font-medium text-[#C6C5D6]">
										Empresa u organización
									</label>
									<input
										id="contact-company"
										type="text"
										bind:value={company}
										placeholder="Ej. Grupo Industrial Norte"
										class="mt-1.5 w-full rounded-lg border border-[#252436] bg-[#0A0A0F] px-3.5 py-2.5 text-sm text-[#F4F4F8] placeholder:text-[#5B5A70] focus:border-[#8447C8] focus:outline-none"
									/>
								</div>
							</div>

							<div class="grid grid-cols-1 gap-5 sm:grid-cols-2">
								<div>
									<label for="contact-email" class="block text-xs font-medium text-[#C6C5D6]">
										Correo electrónico {#if activeChannel === 'email'}<span class="text-[#A970FF]">*</span>{/if}
									</label>
									<input
										id="contact-email"
										type="email"
										bind:value={email}
										placeholder="nombre@empresa.com"
										class="mt-1.5 w-full rounded-lg border bg-[#0A0A0F] px-3.5 py-2.5 text-sm text-[#F4F4F8] placeholder:text-[#5B5A70] focus:border-[#8447C8] focus:outline-none {errors.email
											? 'border-red-500/80'
											: 'border-[#252436]'}"
									/>
									{#if errors.email}
										<p class="mt-1.5 text-xs text-red-400">{errors.email}</p>
									{/if}
								</div>

								<div>
									<label for="contact-phone" class="block text-xs font-medium text-[#C6C5D6]">
										Teléfono / WhatsApp {#if activeChannel === 'whatsapp'}<span class="text-[#A970FF]">*</span>{/if}
									</label>
									<input
										id="contact-phone"
										type="tel"
										bind:value={phone}
										placeholder="+52 744 000 0000"
										class="mt-1.5 w-full rounded-lg border bg-[#0A0A0F] px-3.5 py-2.5 text-sm text-[#F4F4F8] placeholder:text-[#5B5A70] focus:border-[#8447C8] focus:outline-none {errors.phone
											? 'border-red-500/80'
											: 'border-[#252436]'}"
									/>
									{#if errors.phone}
										<p class="mt-1.5 text-xs text-red-400">{errors.phone}</p>
									{/if}
								</div>
							</div>

							<div class="grid grid-cols-1 gap-5 sm:grid-cols-2">
								<div>
									<label for="contact-service" class="block text-xs font-medium text-[#C6C5D6]">
										Servicio principal
									</label>
									<select
										id="contact-service"
										bind:value={selectedServiceId}
										class="mt-1.5 w-full rounded-lg border border-[#252436] bg-[#0A0A0F] px-3.5 py-2.5 text-sm text-[#F4F4F8] focus:border-[#8447C8] focus:outline-none"
									>
										{#each SERVICES as service}
											<option value={service.id}>{service.title}</option>
										{/each}
									</select>
								</div>

								<div>
									<label for="contact-budget" class="block text-xs font-medium text-[#C6C5D6]">
										Presupuesto estimado (MXN)
									</label>
									<select
										id="contact-budget"
										bind:value={budget}
										class="mt-1.5 w-full rounded-lg border border-[#252436] bg-[#0A0A0F] px-3.5 py-2.5 text-sm text-[#F4F4F8] focus:border-[#8447C8] focus:outline-none"
									>
										<option value="por-definir">Por definir en diagnóstico</option>
										<option value="under-50k">Menos de $50,000 MXN</option>
										<option value="50k-150k">$50,000 – $150,000 MXN</option>
										<option value="150k-400k">$150,000 – $400,000 MXN</option>
										<option value="over-400k">Más de $400,000 MXN</option>
									</select>
								</div>
							</div>

							<div>
								<label for="contact-message" class="block text-xs font-medium text-[#C6C5D6]">
									Cuéntanos qué necesitas <span class="text-[#A970FF]">*</span>
								</label>
								<textarea
									id="contact-message"
									rows={4}
									bind:value={message}
									placeholder="Ej. Necesitamos un CRM para 12 vendedores, renovar el Wi-Fi de oficina o automatizar nuestros reportes."
									class="mt-1.5 w-full rounded-lg border bg-[#0A0A0F] px-3.5 py-2.5 text-sm leading-relaxed text-[#F4F4F8] placeholder:text-[#5B5A70] focus:border-[#8447C8] focus:outline-none {errors.message
										? 'border-red-500/80'
										: 'border-[#252436]'}"
								></textarea>
								{#if errors.message}
									<p class="mt-1.5 text-xs text-red-400">{errors.message}</p>
								{/if}
							</div>

							{#if sendError}
								<div class="rounded-lg border border-red-500/40 bg-red-500/10 p-3.5 text-xs text-red-200">
									<p>{sendError}</p>
									<div class="mt-2 flex flex-wrap gap-3">
										<a
											href={mailtoHref}
											class="font-semibold text-[#7D92FF] underline underline-offset-4 hover:text-white"
										>
											Abrir correo ({CONTACT_CONFIG.email})
										</a>
										<a
											href={whatsappHref}
											target="_blank"
											rel="noopener noreferrer"
											class="font-semibold text-[#C59BFF] underline underline-offset-4 hover:text-white"
										>
											Enviar por WhatsApp
										</a>
										<button
											type="button"
											onclick={copySummary}
											class="font-semibold text-white underline underline-offset-4"
										>
											{copied ? 'Resumen copiado' : 'Copiar resumen'}
										</button>
									</div>
								</div>
							{/if}

							{#if activeChannel === 'whatsapp'}
								<div class="rounded-lg border border-[#222133] bg-[#0A0A0F] p-4">
									<p class="text-xs font-medium text-[#9897AB]">Vista previa del mensaje de WhatsApp</p>
									<p class="mt-2 font-mono text-xs leading-relaxed text-[#D6D5E3] whitespace-pre-wrap">
										{formattedSummary}
									</p>
								</div>
							{/if}

							<div class="space-y-3 pt-1">
								<div>
									<label class="flex items-start gap-3 text-xs leading-relaxed text-[#C6C5D6] cursor-pointer">
										<input
											type="checkbox"
											name="acepta_aviso"
											required
											bind:checked={aceptaAviso}
											class="mt-0.5 h-4 w-4 shrink-0 rounded border-[#252436] bg-[#0A0A0F] accent-[#8447C8]"
										/>
										<span>
											He leído y acepto el
											<a
												href="/aviso-de-privacidad"
												class="text-[#A970FF] underline underline-offset-4 transition-colors hover:text-[#C59BFF]"
											>
												aviso de privacidad
											</a>
											<span class="text-[#A970FF]">*</span>
										</span>
									</label>
									{#if errors.aceptaAviso}
										<p class="mt-1.5 pl-7 text-xs text-red-400">{errors.aceptaAviso}</p>
									{/if}
								</div>

								<label class="flex items-start gap-3 text-xs leading-relaxed text-[#9897AB] cursor-pointer">
									<input
										type="checkbox"
										name="acepta_marketing"
										value="Sí"
										bind:checked={aceptaMarketing}
										class="mt-0.5 h-4 w-4 shrink-0 rounded border-[#252436] bg-[#0A0A0F] accent-[#3B52D4]"
									/>
									<span>
										Autorizo que mis datos se usen para recibir información sobre servicios y novedades (opcional).
									</span>
								</label>
							</div>

							<div class="flex flex-col gap-3 pt-1 sm:flex-row sm:items-center sm:justify-between">
								<p class="text-xs text-[#6F6E85]">
									Tus datos se utilizan únicamente para atender tu cotización.
								</p>
								<button
									type="submit"
									disabled={sending}
									class="inline-flex items-center justify-center gap-2 rounded-lg px-6 py-3 text-sm font-semibold text-white transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#8447C8] disabled:cursor-not-allowed disabled:opacity-60 whitespace-nowrap shrink-0 {activeChannel ===
									'email'
										? 'bg-[#3B52D4] hover:bg-[#4B63E6]'
										: 'bg-[#8447C8] hover:bg-[#9558DB]'}"
								>
									<span>
										{#if sending}
											Enviando solicitud...
										{:else if activeChannel === 'email'}
											Enviar solicitud por correo
										{:else}
											Preparar envío por WhatsApp
										{/if}
									</span>
									<svg class="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
										<path d="M5 12h14M13 6l6 6-6 6" />
									</svg>
								</button>
							</div>
						</form>
					{/if}
				</div>
			</div>
		</div>
	</div>
</section>
