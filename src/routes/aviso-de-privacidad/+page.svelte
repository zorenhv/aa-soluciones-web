<script lang="ts">
	import Header from '$lib/components/Header.svelte';
	import Footer from '$lib/components/Footer.svelte';
	import { CONTACT_CONFIG } from '$lib/data/solutions';
</script>

<svelte:head>
	<title>Aviso de privacidad</title>
	<meta name="description" content="Aviso de privacidad integral de AA Soluciones." />
</svelte:head>

<div class="min-h-screen bg-[#0A0A0F] text-[#F4F4F8]">
	<Header />

	<main class="mx-auto max-w-[70ch] px-6 py-14 sm:py-20">
		<a
			href="/"
			class="inline-flex items-center gap-2 text-xs font-medium text-[#A970FF] transition-colors hover:text-[#C59BFF]"
		>
			<svg class="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
				<path d="M19 12H5M11 18l-6-6 6-6" />
			</svg>
			<span>Volver al inicio</span>
		</a>

		<article class="mt-8 space-y-8 text-[15px] leading-relaxed text-[#C6C5D6]">
			<header class="border-b border-[#222133] pb-6">
				<h1 class="font-display text-3xl font-semibold tracking-tight text-[#F4F4F8] sm:text-4xl">
					AVISO DE PRIVACIDAD INTEGRAL
				</h1>
				<p class="mt-3 font-mono text-xs text-[#9897AB]">Última actualización: [DD/MM/AAAA]</p>
			</header>

			<section class="space-y-3">
				<p>
					1. Alan Rodrigo Vega Reza, persona física con actividad empresarial, que opera bajo el
					nombre comercial AA Soluciones, con domicilio en Rada 98, Nueva Industrial Vallejo,
					Alcaldía Gustavo A. Madero, 07700, Ciudad de México, es responsable del tratamiento de sus
					datos personales, de conformidad con la Ley Federal de Protección de Datos Personales en
					Posesión de los Particulares (LFPDPPP).
				</p>
				<p>
					Para cualquier asunto relacionado con este aviso puede escribirnos a:
					<a
						href="mailto:{CONTACT_CONFIG.email}"
						class="font-mono text-[#7D92FF] underline underline-offset-4 transition-colors hover:text-[#A970FF]"
					>
						{CONTACT_CONFIG.email}
					</a>.
				</p>
			</section>

			<section class="space-y-3">
				<h2 class="font-display text-xl font-semibold text-[#F4F4F8]">
					2. Datos personales que recabamos
				</h2>
				<p>
					Cuando usted completa el formulario de contacto de nuestro sitio web, recabamos los
					siguientes datos:
				</p>
				<ul class="list-disc space-y-1.5 pl-6 text-[#D6D5E3]">
					<li>Nombre completo</li>
					<li>Nombre de la empresa (opcional)</li>
					<li>Número de teléfono</li>
					<li>Correo electrónico</li>
					<li>Presupuesto estimado para su proyecto</li>
					<li>Tipo de proyecto que desea desarrollar</li>
				</ul>
				<p>
					No recabamos datos personales sensibles. Le pedimos no incluir en el formulario información
					de ese tipo (salud, origen étnico, religión, orientación sexual, creencias políticas, entre
					otros).
				</p>
			</section>

			<section class="space-y-3">
				<h2 class="font-display text-xl font-semibold text-[#F4F4F8]">
					3. Finalidades del tratamiento
				</h2>
				<p class="font-medium text-[#F4F4F8]">
					Finalidades primarias (necesarias para atender su solicitud):
				</p>
				<ul class="list-disc space-y-1.5 pl-6 text-[#D6D5E3]">
					<li>Contactarle por teléfono o correo electrónico para responder su solicitud.</li>
					<li>Evaluar la viabilidad de su proyecto y elaborar cotizaciones o propuestas.</li>
					<li>
						Dar seguimiento a la negociación y, en su caso, formalizar la prestación de los
						servicios.
					</li>
				</ul>
				<p class="pt-2 font-medium text-[#F4F4F8]">
					Finalidades secundarias (no necesarias; usted puede negarse sin que ello afecte su
					solicitud):
				</p>
				<ul class="list-disc space-y-1.5 pl-6 text-[#D6D5E3]">
					<li>Enviarle información sobre nuestros servicios, novedades o promociones.</li>
					<li>Elaborar estadísticas internas para mejorar nuestros servicios.</li>
				</ul>
				<p>
					Si no desea que sus datos se traten para las finalidades secundarias, puede indicarlo
					mediante la casilla correspondiente del formulario o escribiéndonos al correo de
					privacidad, al enviar sus datos o en cualquier momento posterior. Su negativa no será
					motivo para negarle los servicios.
				</p>
			</section>

			<section class="space-y-3">
				<h2 class="font-display text-xl font-semibold text-[#F4F4F8]">
					4. Proveedores que intervienen y transferencias
				</h2>
				<p>
					No vendemos ni transferimos sus datos personales a terceros para fines propios de estos,
					salvo que la ley lo exija o lo ordene una autoridad competente.
				</p>
				<p>
					Para operar nuestro sitio y atender su solicitud nos apoyamos en los siguientes proveedores,
					que tratan sus datos por cuenta nuestra, bajo nuestras instrucciones y sin utilizarlos para
					fines propios:
				</p>
				<ul class="list-disc space-y-1.5 pl-6 text-[#D6D5E3]">
					<li>
						Web3Forms, servicio que procesa el envío del formulario y lo entrega a nuestro correo
						electrónico.
					</li>
					<li>
						Proton Mail (Proton AG), proveedor del correo electrónico en el que recibimos y
						conservamos sus mensajes.
					</li>
				</ul>
				<p>
					Estos proveedores pueden encontrarse fuera de México. Al enviar el formulario, usted
					reconoce y acepta este tratamiento.
				</p>
			</section>

			<section class="space-y-3">
				<h2 class="font-display text-xl font-semibold text-[#F4F4F8]">5. Derechos del titular</h2>
				<p>
					Usted tiene derecho a acceder a sus datos personales, rectificarlos cuando sean inexactos o
					estén incompletos, solicitar su supresión, oponerse a su tratamiento, limitar su uso o
					divulgación y revocar el consentimiento que nos haya otorgado, en los términos de la
					LFPDPPP.
				</p>
				<p>Para ejercer estos derechos, envíe su solicitud al correo de privacidad incluyendo:</p>
				<ol class="list-decimal space-y-1.5 pl-6 text-[#D6D5E3]">
					<li>Su nombre completo y un medio para comunicarle la respuesta.</li>
					<li>
						Un documento que acredite su identidad (o la de su representante legal, con el documento
						que acredite su representación).
					</li>
					<li>
						La descripción clara y precisa de los datos respecto de los que desea ejercer sus
						derechos.
					</li>
					<li>
						El derecho que desea ejercer y cualquier elemento que facilite la localización de sus
						datos.
					</li>
				</ol>
				<p>Le responderemos en los plazos previstos por la ley.</p>
			</section>

			<section class="space-y-3">
				<h2 class="font-display text-xl font-semibold text-[#F4F4F8]">
					6. Cookies y tecnologías de rastreo
				</h2>
				<p>
					Nuestro sitio web no utiliza cookies ni tecnologías de rastreo para recabar datos
					personales, ni herramientas de analítica o publicidad de terceros.
				</p>
			</section>

			<section class="space-y-3">
				<h2 class="font-display text-xl font-semibold text-[#F4F4F8]">7. Medidas de seguridad</h2>
				<p>
					Contamos con medidas de seguridad administrativas, técnicas y físicas para proteger sus
					datos personales contra daño, pérdida, alteración, destrucción o uso, acceso o tratamiento
					no autorizado. Los mensajes del formulario se reciben en una cuenta de correo de acceso
					restringido.
				</p>
			</section>

			<section class="space-y-3">
				<h2 class="font-display text-xl font-semibold text-[#F4F4F8]">
					8. Conservación de los datos
				</h2>
				<p>
					Conservaremos sus datos durante el tiempo necesario para cumplir las finalidades descritas
					y, posteriormente, por el plazo que exijan las obligaciones legales aplicables. Una vez
					cumplido, serán suprimidos de forma segura.
				</p>
			</section>

			<section class="space-y-3">
				<h2 class="font-display text-xl font-semibold text-[#F4F4F8]">
					9. Cambios al aviso de privacidad
				</h2>
				<p>
					Cualquier modificación a este aviso se publicará en esta misma página. Si los cambios
					implican tratar sus datos para finalidades distintas a las aquí descritas, le solicitaremos
					nuevamente su consentimiento.
				</p>
			</section>

			<section class="space-y-3">
				<h2 class="font-display text-xl font-semibold text-[#F4F4F8]">10. Autoridad</h2>
				<p>
					Si considera que su derecho a la protección de datos personales ha sido vulnerado, puede
					acudir ante la Secretaría Anticorrupción y Buen Gobierno, autoridad en la materia.
				</p>
			</section>
		</article>
	</main>

	<Footer />
</div>
