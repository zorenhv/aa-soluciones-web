<script lang="ts">
	import logoImg from '../../assets/logo_aa_transparent.png';

	let mobileOpen = $state(false);

	const navItems = [
		{ href: '#servicios', label: 'Servicios' },
		{ href: '#simulador', label: 'Simulador' },
		{ href: '#casos', label: 'Casos' },
		{ href: '#contacto', label: 'Contacto' }
	];

	function closeMenu() {
		mobileOpen = false;
	}
</script>

<header class="sticky top-0 z-40 border-b border-[#232233] bg-[#0A0A0F]/90 backdrop-blur-md">
	<div class="mx-auto flex max-w-7xl items-center justify-between gap-8 px-6 py-3">
		<!-- Zone 1: Company Logo + Clean Wordmark -->
		<a
			href="#inicio"
			class="flex items-center gap-3 font-display text-lg font-bold tracking-tight text-[#F4F4F8] transition-colors hover:text-[#B272FF] whitespace-nowrap shrink-0"
		>
			<img
				src={logoImg}
				alt="Logo AA Soluciones"
				width="53"
				height="44"
				referrerpolicy="no-referrer"
				class="block h-11 w-[53px] shrink-0 object-contain"
			/>
			<span>AA Soluciones</span>
		</a>

		<!-- Zone 2: Clean single-line navigation links -->
		<nav aria-label="Navegación principal" class="hidden md:flex items-center gap-7 text-sm font-medium text-[#9897AB]">
			{#each navItems as item}
				<a
					href={item.href}
					class="transition-colors hover:text-[#F4F4F8] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#8447C8] whitespace-nowrap shrink-0"
				>
					{item.label}
				</a>
			{/each}
		</nav>

		<!-- Zone 3: Single primary action -->
		<div class="flex items-center gap-3 shrink-0">
			<a
				href="#contacto"
				class="hidden sm:inline-flex items-center justify-center rounded-lg bg-[#3B52D4] px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-[#4B63E6] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#8447C8] whitespace-nowrap shrink-0"
			>
				Cotizar Proyecto
			</a>

			<button
				type="button"
				onclick={() => (mobileOpen = !mobileOpen)}
				aria-expanded={mobileOpen}
				aria-label={mobileOpen ? 'Cerrar menú' : 'Abrir menú'}
				class="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-[#252436] text-[#C6C5D6] transition-colors hover:border-[#3B52D4] hover:text-white md:hidden"
			>
				{#if mobileOpen}
					<svg class="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round">
						<path d="M6 6l12 12M18 6L6 18" />
					</svg>
				{:else}
					<svg class="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round">
						<path d="M4 7h16M4 12h16M4 17h16" />
					</svg>
				{/if}
			</button>
		</div>
	</div>

	{#if mobileOpen}
		<div class="border-t border-[#232233] bg-[#0A0A0F] px-6 py-4 md:hidden">
			<nav aria-label="Navegación móvil" class="flex flex-col gap-3">
				{#each navItems as item}
					<a
						href={item.href}
						onclick={closeMenu}
						class="py-2 text-sm font-medium text-[#C6C5D6] transition-colors hover:text-white"
					>
						{item.label}
					</a>
				{/each}
				<a
					href="#contacto"
					onclick={closeMenu}
					class="mt-2 inline-flex items-center justify-center rounded-lg bg-[#3B52D4] px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#4B63E6]"
				>
					Cotizar Proyecto
				</a>
			</nav>
		</div>
	{/if}
</header>
