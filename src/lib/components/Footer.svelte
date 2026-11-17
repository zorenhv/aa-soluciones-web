<script lang="ts">
	import { CONTACT_CONFIG } from '$lib/data/solutions';
	import logoImg from '../../assets/logo_aa_transparent.png';
</script>

<footer class="border-t border-[#1F1E2E] bg-[#08080D] py-12">
	<div class="mx-auto max-w-7xl px-6">
		<div class="flex flex-col justify-between gap-8 md:flex-row md:items-center">
			<div>
				<a href="#inicio" class="inline-flex items-center gap-3 font-display text-lg font-bold tracking-tight text-[#F4F4F8]">
					<img
						src={logoImg}
						alt="Logo AA Soluciones"
						referrerpolicy="no-referrer"
						class="h-11 w-auto object-contain"
					/>
					<span>AA Soluciones</span>
				</a>
				<p class="mt-3 max-w-md text-xs leading-relaxed text-[#7E7D94]">
					Desarrollo de software, páginas web, CRMs, automatización en la nube, inteligencia
					artificial, modelos matemáticos, hardware, soporte técnico, redes y servidores.
				</p>
			</div>

			<div class="flex flex-wrap items-center gap-6 text-xs font-medium text-[#9897AB]">
				<a href="#servicios" class="transition-colors hover:text-[#F4F4F8]">Servicios</a>
				<a href="#simulador" class="transition-colors hover:text-[#F4F4F8]">Simulador</a>
				<a href="#casos" class="transition-colors hover:text-[#F4F4F8]">Casos</a>
				<a href="#contacto" class="transition-colors hover:text-[#F4F4F8]">Contacto</a>
			</div>
		</div>

		<div
			class="mt-8 flex flex-col justify-between gap-3 border-t border-[#1F1E2E] pt-6 text-xs text-[#6F6E85] sm:flex-row sm:items-center"
		>
			<p>© {new Date().getFullYear()} AA Soluciones. Todos los derechos reservados.</p>
			<div class="flex flex-wrap items-center gap-4 font-mono">
				<a href="mailto:{CONTACT_CONFIG.email}" class="transition-colors hover:text-[#C6C5D6]">
					{CONTACT_CONFIG.email}
				</a>
				<span aria-hidden="true">·</span>
				<span>{CONTACT_CONFIG.whatsappDisplay}</span>
			</div>
		</div>
	</div>
</footer>
