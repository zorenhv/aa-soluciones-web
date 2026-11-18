export type AsciiVariant =
	| 'hero'
	| 'software'
	| 'web'
	| 'crm'
	| 'cloud'
	| 'ai-ml'
	| 'math-data'
	| 'hardware'
	| 'network'
	| 'methodology';

export interface ServiceItem {
	id: string;
	number: string;
	title: string;
	shortTitle: string;
	summary: string;
	deliverables: string[];
	outcome: string;
	ascii: AsciiVariant;
}

export interface SimulatorScenario {
	id: string;
	label: string;
	serviceId: string;
	volumeLabel: string;
	volumeUnit: string;
	minVolume: number;
	maxVolume: number;
	defaultVolume: number;
	defaultHours: number;
	automationRate: number;
	errorReduction: string;
	solutionSummary: string;
	hourlyRateMxn: number;
}

export interface CaseStudy {
	id: string;
	sector: string;
	timeframe: string;
	title: string;
	challenge: string;
	solution: string;
	metricValue: string;
	metricLabel: string;
	secondaryMetric: string;
}

export const CONTACT_CONFIG = {
	email: 'aa.soluciones.empresariales@gmail.com',
	whatsappDisplay: '+52 744 500 5199',
	whatsappNumber: '527445005199',
	location: 'Atención presencial y remota para empresas'
};

export const SERVICES: ServiceItem[] = [
	{
		id: 'software',
		number: '01.',
		title: 'Desarrollo de Software',
		shortTitle: 'Software a Medida',
		summary:
			'Sistemas internos y plataformas diseñadas exactamente para la forma en que opera tu empresa, sin licencias rígidas.',
		deliverables: [
			'Aplicaciones a la medida de tus procesos',
			'Conexión con tus sistemas y facturación actuales',
			'Código propio con soporte continuo'
		],
		outcome: 'Control total de tu operación',
		ascii: 'software'
	},
	{
		id: 'web',
		number: '02.',
		title: 'Páginas y Apps Web',
		shortTitle: 'Páginas Web',
		summary:
			'Sitios corporativos, tiendas y portales de clientes rápidos, claros y diseñados para generar oportunidades comerciales.',
		deliverables: [
			'Diseño adaptable a celular y escritorio',
			'Portales de autogestión para clientes',
			'Velocidad de carga y SEO técnico incluidos'
		],
		outcome: 'Presencia digital que convierte',
		ascii: 'web'
	},
	{
		id: 'crm',
		number: '03.',
		title: 'CRMs a Medida',
		shortTitle: 'CRMs a Medida',
		summary:
			'Centraliza prospectos, cotizaciones, seguimiento postventa y cobranza en un solo tablero adaptado a tu equipo comercial.',
		deliverables: [
			'Seguimiento automático de oportunidades',
			'Integración con WhatsApp y correo electrónico',
			'Reportes claros de ventas y desempeño'
		],
		outcome: 'Ningún prospecto sin seguimiento',
		ascii: 'crm'
	},
	{
		id: 'cloud',
		number: '04.',
		title: 'Automatización en la Nube',
		shortTitle: 'Automatización Cloud',
		summary:
			'Eliminamos tareas repetitivas conectando tus herramientas en la nube para generar reportes, alertas y respaldos automáticos.',
		deliverables: [
			'Flujos automáticos de reportes y conciliaciones',
			'Infraestructura escalable en la nube',
			'Monitoreo y control de costos operativos'
		],
		outcome: 'Menos trabajo manual cada semana',
		ascii: 'cloud'
	},
	{
		id: 'ai-ml',
		number: '05.',
		title: 'Inteligencia Artificial y ML',
		shortTitle: 'IA y Machine Learning',
		summary:
			'Modelos predictivos y asistentes inteligentes entrenados con tus datos para anticipar demanda, clasificar documentos y agilizar decisiones.',
		deliverables: [
			'Predicción de ventas, demanda y riesgo',
			'Lectura automática de facturas y contratos',
			'Asistentes internos seguros para tu equipo'
		],
		outcome: 'Decisiones respaldadas por datos',
		ascii: 'ai-ml'
	},
	{
		id: 'math-data',
		number: '06.',
		title: 'Análisis de Datos y Modelos Matemáticos',
		shortTitle: 'Modelos Matemáticos',
		summary:
			'Optimizamos rutas, inventarios, turnos y presupuestos mediante modelos matemáticos y tableros ejecutivos claros.',
		deliverables: [
			'Optimización de costos, rutas e inventarios',
			'Simulación de escenarios financieros y operativos',
			'Tableros gerenciales con indicadores en vivo'
		],
		outcome: 'Eficiencia medible en márgenes',
		ascii: 'math-data'
	},
	{
		id: 'hardware',
		number: '07.',
		title: 'Hardware y Soporte Técnico',
		shortTitle: 'Hardware y Soporte',
		summary:
			'Ensamble de computadoras a la medida según tu carga de trabajo, mantenimiento preventivo y pólizas de soporte técnico.',
		deliverables: [
			'Estaciones de trabajo y PCs ensambladas a medida',
			'Mantenimiento preventivo y correctivo programado',
			'Pólizas de soporte técnico presencial y remoto'
		],
		outcome: 'Equipos siempre listos para trabajar',
		ascii: 'hardware'
	},
	{
		id: 'network',
		number: '08.',
		title: 'Redes y Servidores',
		shortTitle: 'Redes y Servidores',
		summary:
			'Cableado estructurado Ethernet/fibra, cobertura Wi-Fi empresarial sin zonas muertas y servidores locales o en la nube con respaldos seguros.',
		deliverables: [
			'Cableado estructurado Ethernet y fibra óptica',
			'Cobertura Wi-Fi empresarial estable sin zonas muertas',
			'Servidores locales o en la nube con respaldos seguros'
		],
		outcome: 'Conectividad estable y datos protegidos',
		ascii: 'network'
	}
];

export const SIMULATOR_SCENARIOS: SimulatorScenario[] = [
	{
		id: 'crm-ops',
		label: 'CRM y Seguimiento Comercial',
		serviceId: 'crm',
		volumeLabel: 'Prospectos o cotizaciones al mes',
		volumeUnit: 'prospectos',
		minVolume: 100,
		maxVolume: 5000,
		defaultVolume: 850,
		defaultHours: 32,
		automationRate: 0.62,
		errorReduction: '78% menos omisiones en seguimiento comercial',
		solutionSummary: 'CRM a medida conectado con WhatsApp, correo y alertas automáticas',
		hourlyRateMxn: 480
	},
	{
		id: 'cloud-auto',
		label: 'Automatización y Reportes Cloud',
		serviceId: 'cloud',
		volumeLabel: 'Documentos o registros mensuales',
		volumeUnit: 'registros',
		minVolume: 500,
		maxVolume: 25000,
		defaultVolume: 4500,
		defaultHours: 45,
		automationRate: 0.76,
		errorReduction: '92% menos errores de captura manual',
		solutionSummary: 'Flujos automáticos en la nube conectados a tus hojas y sistemas actuales',
		hourlyRateMxn: 520
	},
	{
		id: 'math-ml',
		label: 'IA y Modelos Matemáticos',
		serviceId: 'math-data',
		volumeLabel: 'Órdenes, rutas o productos activos',
		volumeUnit: 'elementos',
		minVolume: 100,
		maxVolume: 10000,
		defaultVolume: 1500,
		defaultHours: 36,
		automationRate: 0.7,
		errorReduction: '14% a 22% ahorro en costos operativos e inventario',
		solutionSummary: 'Modelos predictivos y optimización matemática con tablero gerencial',
		hourlyRateMxn: 680
	},
	{
		id: 'infra-soporte',
		label: 'Hardware, Redes y Servidores',
		serviceId: 'network',
		volumeLabel: 'Equipos y usuarios en oficina',
		volumeUnit: 'equipos',
		minVolume: 5,
		maxVolume: 250,
		defaultVolume: 35,
		defaultHours: 20,
		automationRate: 0.8,
		errorReduction: '85% menos tiempo muerto por fallas de red o equipo',
		solutionSummary: 'Red empresarial, servidores con respaldo automático y póliza preventiva',
		hourlyRateMxn: 440
	}
];

export const CASE_STUDIES: CaseStudy[] = [
	{
		id: 'logistica',
		sector: 'Logística y Distribución',
		timeframe: 'Implementado en 7 semanas',
		title: 'Optimización matemática de rutas y asignación de flota regional',
		challenge:
			'La planeación diaria de entregas tomaba 4 horas manuales y generaba recorridos largos con sobrecosto en combustible.',
		solution:
			'Creamos un sistema con modelo matemático de rutas conectado a su operación y un panel web sencillo para despacho diario.',
		metricValue: '-18.4%',
		metricLabel: 'Costo operativo de reparto en 90 días',
		secondaryMetric: 'Planeación reducida de 4 h a 11 min diarios'
	},
	{
		id: 'fintech-crm',
		sector: 'Servicios Financieros B2B',
		timeframe: 'Implementado en 6 semanas',
		title: 'CRM a medida con automatización y seguimiento por WhatsApp',
		challenge:
			'El equipo comercial usaba tres herramientas distintas, perdiendo el historial entre solicitudes web, revisión y cierre.',
		solution:
			'Desarrollamos un CRM propio integrado con correo electrónico, WhatsApp y recordatorios automáticos para cada asesor.',
		metricValue: '+42%',
		metricLabel: 'Tasa de conversión de prospectos en 4 meses',
		secondaryMetric: 'Primera respuesta reducida a menos de 6 min'
	},
	{
		id: 'infraestructura-oficina',
		sector: 'Manufactura y Oficinas Corporativas',
		timeframe: 'Implementado en 4 semanas',
		title: 'Renovación de red Wi-Fi empresarial, servidores y estaciones de trabajo',
		challenge:
			'Cortes frecuentes de conexión en planta y oficinas, equipos lentos para diseño y respaldos manuales sin garantía.',
		solution:
			'Instalamos cableado estructurado con fibra, Wi-Fi empresarial sin zonas muertas, servidor con respaldos automáticos y PCs ensambladas a medida.',
		metricValue: '99.9%',
		metricLabel: 'Continuidad de red y operación diaria',
		secondaryMetric: 'Respaldos automáticos verificados cada noche'
	}
];
