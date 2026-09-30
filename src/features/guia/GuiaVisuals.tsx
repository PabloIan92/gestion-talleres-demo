import {
  Plus,
  BookOpen,
  Bell,
  Shield,
  User,
  Camera,
  CheckCircle2,
  AlertTriangle,
  FileSignature,
  Check,
} from 'lucide-react'

// Contenedor estandarizado para cada ilustración con marco de ventana / pantalla
export function MarcoPantalla({
  titulo,
  subtitulo,
  children,
}: {
  titulo: string
  subtitulo?: string
  children: React.ReactNode
}) {
  return (
    <div className="my-5 rounded-lg border-2 border-graphite/40 bg-steel-50 shadow-md overflow-hidden">
      {/* Barra superior estilo ventana de aplicación */}
      <div className="bg-graphite text-white px-3 py-2 flex items-center justify-between border-b border-graphite">
        <div className="flex items-center gap-2">
          <div className="flex gap-1.5">
            <div className="w-2.5 h-2.5 rounded-full bg-rose-500" />
            <div className="w-2.5 h-2.5 rounded-full bg-amber-400" />
            <div className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
          </div>
          <span className="font-mono text-xs text-steel-200 tracking-wider uppercase ml-2">
            {titulo}
          </span>
        </div>
        {subtitulo && (
          <span className="font-sans text-[11px] text-steel-300 hidden sm:inline">
            {subtitulo}
          </span>
        )}
      </div>
      {/* Contenido visual de la pantalla */}
      <div className="p-3 sm:p-5 bg-steel-100/50">{children}</div>
    </div>
  )
}

// 1. ILUSTRACIÓN: Barra superior (Topbar)
export function IlustracionTopbar() {
  return (
    <MarcoPantalla
      titulo="Pantalla Principal: Barra Superior (Topbar)"
      subtitulo="Ubicada siempre arriba en todas las pantallas"
    >
      <div className="bg-navy text-white rounded-md p-3 sm:p-4 shadow-sm border border-white/20">
        <div className="flex items-center justify-between gap-2 flex-wrap">
          {/* Logo y Nombre */}
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded bg-white text-navy font-display font-bold flex items-center justify-center text-xs shadow">
              GT
            </div>
            <div>
              <span className="font-display font-bold uppercase text-sm sm:text-base tracking-wide block">
                Gestión de Talleres
              </span>
              <span className="font-mono text-[9px] text-steel-300 uppercase tracking-widest block -mt-1">
                Mecánica y Carrocería
              </span>
            </div>
          </div>

          {/* Botones de acción */}
          <div className="flex items-center gap-2 flex-wrap">
            {/* Botón 1: Guía */}
            <div className="relative group">
              <div className="bg-white/10 text-white font-mono text-xs font-bold uppercase px-2.5 py-1.5 rounded flex items-center gap-1.5 border border-white/30">
                <BookOpen size={13} className="text-amber-300" />
                <span>Guía</span>
              </div>
              <span className="absolute -top-3 -right-2 bg-amber-500 text-graphite font-mono font-bold text-[10px] w-5 h-5 rounded-full flex items-center justify-center shadow">
                1
              </span>
            </div>

            {/* Botón 2: Nuevo Caso */}
            <div className="relative group">
              <div className="bg-blue text-white font-mono text-xs font-bold uppercase px-3 py-1.5 rounded flex items-center gap-1 border border-white/25 shadow">
                <Plus size={14} strokeWidth={3} />
                <span>Nuevo caso</span>
              </div>
              <span className="absolute -top-3 -right-2 bg-amber-500 text-graphite font-mono font-bold text-[10px] w-5 h-5 rounded-full flex items-center justify-center shadow">
                2
              </span>
            </div>

            {/* Botón 3: Campanita */}
            <div className="relative">
              <div className="p-1.5 bg-white/10 rounded border border-white/20 text-steel-200">
                <Bell size={15} />
              </div>
              <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-rose-500 rounded-full" />
            </div>

            {/* Botón 4: Rol */}
            <span className="font-mono text-xs bg-white/10 border border-white/25 px-2 py-1 rounded text-steel-200 hidden md:inline">
              Dueño
            </span>
          </div>
        </div>
      </div>

      {/* Explicación de las llamadas */}
      <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs font-sans">
        <div className="bg-white p-2.5 rounded border border-steel-300 flex items-start gap-2">
          <span className="bg-amber-500 text-graphite font-mono font-bold w-5 h-5 rounded-full flex items-center justify-center shrink-0">
            1
          </span>
          <div>
            <strong className="text-navy font-bold block">Botón Guía:</strong>
            Abre este manual en cualquier momento si tenés dudas sobre qué hacer.
          </div>
        </div>
        <div className="bg-white p-2.5 rounded border border-steel-300 flex items-start gap-2">
          <span className="bg-amber-500 text-graphite font-mono font-bold w-5 h-5 rounded-full flex items-center justify-center shrink-0">
            2
          </span>
          <div>
            <strong className="text-navy font-bold block">Botón "+ Nuevo Caso":</strong>
            El botón principal. Lo tocás cada vez que entra un vehículo nuevo al taller para cargarlo.
          </div>
        </div>
      </div>
    </MarcoPantalla>
  )
}

// 2. ILUSTRACIÓN: Selector Seguro vs Particular
export function IlustracionCanales() {
  return (
    <MarcoPantalla
      titulo="Paso Inicial: ¿Cómo paga el cliente el arreglo?"
      subtitulo="Al crear un caso, elegís entre dos caminos"
    >
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Opción Seguro */}
        <div className="bg-white p-4 rounded-lg border-2 border-blue shadow-sm relative">
          <span className="absolute -top-2.5 right-3 bg-blue text-white font-mono text-[10px] font-bold uppercase px-2 py-0.5 rounded">
            Opción 1: Por Compañía
          </span>
          <div className="flex items-center gap-2 mb-2 text-blue">
            <Shield className="w-5 h-5" />
            <h4 className="font-display text-base font-bold uppercase text-navy">
              Canal Seguro
            </h4>
          </div>
          <p className="text-xs text-steel-600 font-sans mb-3">
            El cliente tuvo un siniestro o granizo y lo cubre una aseguradora (ej. La Segunda, San Cristóbal, Rivadavia, Zurich).
          </p>
          <div className="bg-blue-50 border border-blue-200 rounded p-2 text-[11px] font-mono text-blue-900 space-y-1">
            <div className="flex items-center gap-1.5">
              <Check size={12} className="text-blue font-bold" />
              <span>Pide: Compañía aseguradora</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Check size={12} className="text-blue font-bold" />
              <span>Pide: N° de siniestro y franquicia</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Check size={12} className="text-blue font-bold" />
              <span>Flujo: Pasa por peritaje / aprobación</span>
            </div>
          </div>
        </div>

        {/* Opción Particular */}
        <div className="bg-white p-4 rounded-lg border-2 border-emerald-500 shadow-sm relative">
          <span className="absolute -top-2.5 right-3 bg-emerald-600 text-white font-mono text-[10px] font-bold uppercase px-2 py-0.5 rounded">
            Opción 2: De Bolsillo
          </span>
          <div className="flex items-center gap-2 mb-2 text-emerald-700">
            <User className="w-5 h-5" />
            <h4 className="font-display text-base font-bold uppercase text-navy">
              Canal Particular
            </h4>
          </div>
          <p className="text-xs text-steel-600 font-sans mb-3">
            El cliente viene por su cuenta a arreglar un bollo o golpe y paga él directamente con transferencia, efectivo o tarjeta.
          </p>
          <div className="bg-emerald-50 border border-emerald-200 rounded p-2 text-[11px] font-mono text-emerald-900 space-y-1">
            <div className="flex items-center gap-1.5">
              <Check size={12} className="text-emerald-700 font-bold" />
              <span>Sin trámites de aseguradora</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Check size={12} className="text-emerald-700 font-bold" />
              <span>Pide: Presupuesto en pesos acordado</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Check size={12} className="text-emerald-700 font-bold" />
              <span>Flujo: Se aprueba directo y se coordina turno</span>
            </div>
          </div>
        </div>
      </div>
    </MarcoPantalla>
  )
}

// 3. ILUSTRACIÓN: El Mapa de Daños Interactivo
export function IlustracionMapaDanos() {
  return (
    <MarcoPantalla
      titulo="Ficha de Inspección: Mapa del Auto (Zonas de Chapa)"
      subtitulo="Tocá cada parte del auto para registrar bollos y granizo"
    >
      <div className="bg-white p-4 rounded-lg border border-steel-300">
        <div className="flex flex-col md:flex-row items-center gap-6">
          {/* Silueta visual de auto con partes marcadas */}
          <div className="relative w-full max-w-[280px] bg-steel-100 rounded-lg p-3 border-2 border-graphite/30">
            <div className="text-center font-mono text-[11px] text-steel-500 uppercase mb-2 font-bold">
              Vista Superior del Vehículo
            </div>

            {/* Esquema del auto en cajas visuales */}
            <div className="space-y-1.5">
              {/* Frente / Capot */}
              <div className="p-2 rounded bg-rose-100 border-2 border-rose-500 text-center font-mono text-xs font-bold text-rose-800 shadow-sm flex items-center justify-between px-3">
                <span>Capot (15 bollos)</span>
                <span className="bg-rose-500 text-white text-[10px] px-1.5 py-0.2 rounded">
                  Severo
                </span>
              </div>

              {/* Centro: Puertas y Techo */}
              <div className="grid grid-cols-3 gap-1.5">
                <div className="p-2 rounded bg-steel-200 text-steel-600 text-center font-mono text-[10px]">
                  Puerta Del. Izq. (Sano)
                </div>
                <div className="p-2 rounded bg-amber-100 border-2 border-amber-500 text-center font-mono text-xs font-bold text-amber-900">
                  Techo (25 bollos)
                </div>
                <div className="p-2 rounded bg-steel-200 text-steel-600 text-center font-mono text-[10px]">
                  Puerta Del. Der. (Sano)
                </div>
              </div>

              {/* Parte Trasera: Portón */}
              <div className="p-2 rounded bg-steel-200 text-steel-600 text-center font-mono text-[10px]">
                Portón Trasero / Baúl (Sano)
              </div>
            </div>

            <div className="mt-3 text-center">
              <span className="inline-block bg-navy text-white text-[10px] font-mono uppercase px-2 py-0.5 rounded">
                Total Zonas Dañadas: 2 de 10
              </span>
            </div>
          </div>

          {/* Explicación paso a paso de cómo marcar */}
          <div className="space-y-2.5 text-xs font-sans text-graphite flex-1">
            <h4 className="font-display text-sm font-bold uppercase text-navy">
              ¿Cómo se usa en la tablet o computadora?
            </h4>
            <div className="space-y-2">
              <div className="flex items-start gap-2 bg-steel-50 p-2 rounded border border-steel-200">
                <span className="w-5 h-5 rounded-full bg-blue text-white font-mono font-bold flex items-center justify-center shrink-0 text-[11px]">
                  1
                </span>
                <p>
                  <strong>Hacés click o tocás con el dedo</strong> la zona del auto que tiene daño (por ejemplo, el Capot).
                </p>
              </div>
              <div className="flex items-start gap-2 bg-steel-50 p-2 rounded border border-steel-200">
                <span className="w-5 h-5 rounded-full bg-blue text-white font-mono font-bold flex items-center justify-center shrink-0 text-[11px]">
                  2
                </span>
                <p>
                  <strong>Elegís la gravedad:</strong> Leve (1 a 5 bollos), Medio (granizo moderado), o Severo (impactos profundos o pintura comprometida).
                </p>
              </div>
              <div className="flex items-start gap-2 bg-steel-50 p-2 rounded border border-steel-200">
                <span className="w-5 h-5 rounded-full bg-blue text-white font-mono font-bold flex items-center justify-center shrink-0 text-[11px]">
                  3
                </span>
                <p>
                  <strong>La zona cambia de color al instante</strong> (amarillo o rojo) para que el chapista sepa exactamente qué paneles reparar sin confusiones.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </MarcoPantalla>
  )
}

// 4. ILUSTRACIÓN: Las 4 Fotos Obligatorias
export function IlustracionFotosObligatorias() {
  return (
    <MarcoPantalla
      titulo="Requisito Estricto: Las 4 Fotos Obligatorias"
      subtitulo="El sistema no te deja guardar hasta tener las 4 fotos del auto"
    >
      <div className="bg-white p-4 rounded-lg border border-steel-300">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-3">
          {/* Foto 1: Frente */}
          <div className="p-3 bg-emerald-50 border-2 border-emerald-500 rounded-lg text-center flex flex-col items-center justify-center shadow-sm">
            <div className="w-8 h-8 rounded-full bg-emerald-500 text-white flex items-center justify-center mb-1.5 shadow">
              <CheckCircle2 size={18} />
            </div>
            <span className="font-mono text-xs font-bold text-emerald-900 block uppercase">
              1. Frente
            </span>
            <span className="text-[10px] font-sans text-emerald-700">Foto subida ✓</span>
          </div>

          {/* Foto 2: Trasera */}
          <div className="p-3 bg-emerald-50 border-2 border-emerald-500 rounded-lg text-center flex flex-col items-center justify-center shadow-sm">
            <div className="w-8 h-8 rounded-full bg-emerald-500 text-white flex items-center justify-center mb-1.5 shadow">
              <CheckCircle2 size={18} />
            </div>
            <span className="font-mono text-xs font-bold text-emerald-900 block uppercase">
              2. Trasera
            </span>
            <span className="text-[10px] font-sans text-emerald-700">Foto subida ✓</span>
          </div>

          {/* Foto 3: Lateral Izquierdo */}
          <div className="p-3 bg-amber-50 border-2 border-dashed border-amber-400 rounded-lg text-center flex flex-col items-center justify-center hover:bg-amber-100 transition-colors cursor-pointer">
            <div className="w-8 h-8 rounded-full bg-amber-400 text-graphite flex items-center justify-center mb-1.5 shadow animate-pulse">
              <Camera size={18} />
            </div>
            <span className="font-mono text-xs font-bold text-amber-900 block uppercase">
              3. Lat. Izquierdo
            </span>
            <span className="text-[10px] font-sans text-amber-800 font-bold">¡Tocar para subir!</span>
          </div>

          {/* Foto 4: Lateral Derecho */}
          <div className="p-3 bg-amber-50 border-2 border-dashed border-amber-400 rounded-lg text-center flex flex-col items-center justify-center hover:bg-amber-100 transition-colors cursor-pointer">
            <div className="w-8 h-8 rounded-full bg-amber-400 text-graphite flex items-center justify-center mb-1.5 shadow animate-pulse">
              <Camera size={18} />
            </div>
            <span className="font-mono text-xs font-bold text-amber-900 block uppercase">
              4. Lat. Derecho
            </span>
            <span className="text-[10px] font-sans text-amber-800 font-bold">¡Tocar para subir!</span>
          </div>
        </div>

        {/* Estado del botón de guardar */}
        <div className="bg-steel-100 rounded p-3 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs">
          <div className="flex items-center gap-2 text-amber-800 font-sans">
            <AlertTriangle size={16} className="text-amber-600 shrink-0" />
            <span>
              <strong>Estado actual:</strong> 2 de 4 fotos cargadas. El botón de guardar se habilitará cuando subas las 4.
            </span>
          </div>
          <button
            disabled
            className="bg-steel-300 text-steel-500 font-mono text-xs font-bold uppercase px-4 py-2 rounded cursor-not-allowed"
          >
            Guardar Inspección (Bloqueado)
          </button>
        </div>
      </div>
    </MarcoPantalla>
  )
}

// 5. ILUSTRACIÓN: Planilla de Control con Semáforos
export function IlustracionPlanillaSemaforo() {
  return (
    <MarcoPantalla
      titulo="Pantalla Principal del Dueño: Planilla de Control"
      subtitulo="La tabla inteligente con los semáforos de cada auto"
    >
      <div className="bg-white rounded-lg border border-steel-300 overflow-x-auto shadow-sm">
        {/* Cabecera simulada de la tabla */}
        <div className="bg-navy text-white text-[11px] font-mono uppercase px-3 py-2 grid grid-cols-12 gap-1 items-center border-b border-steel-400">
          <div className="col-span-4 font-bold text-amber-300">Patente / Auto</div>
          <div className="col-span-2 text-center">Inspección</div>
          <div className="col-span-2 text-center">Turno</div>
          <div className="col-span-2 text-center">Taller</div>
          <div className="col-span-2 text-center">Cobrado</div>
        </div>

        {/* Fila 1: Auto en taller normal */}
        <div className="px-3 py-2 grid grid-cols-12 gap-1 items-center border-b border-steel-200 text-xs font-sans hover:bg-steel-50">
          <div className="col-span-4 font-mono font-bold text-graphite flex flex-col">
            <span>AA 123 BB</span>
            <span className="text-[10px] text-steel-500 font-normal">Peugeot 208 • Seguro</span>
          </div>
          <div className="col-span-2 text-center">
            <span className="bg-emerald-100 text-emerald-800 font-mono font-bold text-[10px] px-2 py-0.5 rounded">
              VERDE
            </span>
          </div>
          <div className="col-span-2 text-center">
            <span className="bg-emerald-100 text-emerald-800 font-mono font-bold text-[10px] px-2 py-0.5 rounded">
              VERDE
            </span>
          </div>
          <div className="col-span-2 text-center">
            <span className="bg-blue-100 text-blue font-mono font-bold text-[10px] px-2 py-0.5 rounded">
              AZUL
            </span>
          </div>
          <div className="col-span-2 text-center">
            <span className="bg-steel-200 text-steel-600 font-mono text-[10px] px-2 py-0.5 rounded">
              GRIS
            </span>
          </div>
        </div>

        {/* Fila 2: Auto con repuesto faltante (ROJO) */}
        <div className="px-3 py-2 grid grid-cols-12 gap-1 items-center border-b border-steel-200 text-xs font-sans bg-rose-50/60">
          <div className="col-span-4 font-mono font-bold text-graphite flex flex-col">
            <span>AF 456 CD</span>
            <span className="text-[10px] text-rose-700 font-bold">Toyota Hilux • ¡Falta óptico!</span>
          </div>
          <div className="col-span-2 text-center">
            <span className="bg-emerald-100 text-emerald-800 font-mono font-bold text-[10px] px-2 py-0.5 rounded">
              VERDE
            </span>
          </div>
          <div className="col-span-2 text-center">
            <span className="bg-emerald-100 text-emerald-800 font-mono font-bold text-[10px] px-2 py-0.5 rounded">
              VERDE
            </span>
          </div>
          <div className="col-span-2 text-center">
            <span className="bg-rose-600 text-white font-mono font-bold text-[10px] px-2 py-0.5 rounded animate-pulse shadow">
              ROJO ⚠️
            </span>
          </div>
          <div className="col-span-2 text-center">
            <span className="bg-steel-200 text-steel-600 font-mono text-[10px] px-2 py-0.5 rounded">
              GRIS
            </span>
          </div>
        </div>

        {/* Fila 3: Auto terminado y cobrado */}
        <div className="px-3 py-2 grid grid-cols-12 gap-1 items-center text-xs font-sans hover:bg-steel-50">
          <div className="col-span-4 font-mono font-bold text-graphite flex flex-col">
            <span>AE 789 ZX</span>
            <span className="text-[10px] text-steel-500 font-normal">VW Amarok • Particular</span>
          </div>
          <div className="col-span-2 text-center">
            <span className="bg-emerald-100 text-emerald-800 font-mono font-bold text-[10px] px-2 py-0.5 rounded">
              VERDE
            </span>
          </div>
          <div className="col-span-2 text-center">
            <span className="bg-emerald-100 text-emerald-800 font-mono font-bold text-[10px] px-2 py-0.5 rounded">
              VERDE
            </span>
          </div>
          <div className="col-span-2 text-center">
            <span className="bg-emerald-100 text-emerald-800 font-mono font-bold text-[10px] px-2 py-0.5 rounded">
              VERDE
            </span>
          </div>
          <div className="col-span-2 text-center">
            <span className="bg-emerald-600 text-white font-mono font-bold text-[10px] px-2 py-0.5 rounded shadow">
              $ COBRADO
            </span>
          </div>
        </div>
      </div>

      {/* Significado de los colores */}
      <div className="mt-3 grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs font-sans">
        <div className="p-2 rounded bg-white border border-steel-300 flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-steel-400 shrink-0" />
          <span><strong>Gris:</strong> Pendiente / No iniciado</span>
        </div>
        <div className="p-2 rounded bg-white border border-blue-200 flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-blue shrink-0" />
          <span><strong>Azul:</strong> En curso / Trabajando</span>
        </div>
        <div className="p-2 rounded bg-white border border-emerald-300 flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-emerald-600 shrink-0" />
          <span><strong>Verde:</strong> Aprobado / Finalizado</span>
        </div>
        <div className="p-2 rounded bg-white border border-rose-300 flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-rose-600 shrink-0 animate-pulse" />
          <span><strong>Rojo:</strong> ¡Trabajo frenado!</span>
        </div>
      </div>
    </MarcoPantalla>
  )
}

// 6. ILUSTRACIÓN: Ficha de Trabajo de Taller y Botón de Repuesto
export function IlustracionTallerPDR() {
  return (
    <MarcoPantalla
      titulo="Vista del Taller: Cómo frenar si falta un repuesto"
      subtitulo="El chapista avisa al dueño tocando un solo botón"
    >
      <div className="bg-white p-4 rounded-lg border border-steel-300 space-y-3">
        <div className="flex items-center justify-between border-b pb-2">
          <div>
            <span className="font-mono text-xs text-steel-500 uppercase">Orden de Trabajo</span>
            <h4 className="font-display text-base font-bold uppercase text-navy">
              OT #1042 — VW Gol Trend (AB 987 CD)
            </h4>
          </div>
          <span className="bg-amber-100 text-amber-800 font-mono text-xs font-bold px-2 py-1 rounded">
            En Reparación
          </span>
        </div>

        <p className="text-xs text-graphite font-sans">
          Si durante el desarme descubrís que una grampa, moldura o repuesto está roto y no se puede terminar el auto:
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
          {/* Botón Rojo: Pausar */}
          <div className="p-3 bg-rose-50 border-2 border-rose-400 rounded-lg flex flex-col justify-between">
            <div className="mb-2">
              <span className="font-display font-bold uppercase text-xs text-rose-900 block">
                Paso A: Marcar bloqueo
              </span>
              <span className="text-[11px] text-rose-700 font-sans">
                Apretás este botón y escribís qué pieza hace falta (ej. traba de panel).
              </span>
            </div>
            <button className="w-full bg-rose-600 text-white font-mono text-xs font-bold uppercase py-2 rounded shadow hover:bg-rose-700 transition-colors flex items-center justify-center gap-1.5">
              <AlertTriangle size={14} />
              <span>Marcar Esperando Repuesto</span>
            </button>
          </div>

          {/* Botón Verde: Finalizar */}
          <div className="p-3 bg-emerald-50 border-2 border-emerald-400 rounded-lg flex flex-col justify-between">
            <div className="mb-2">
              <span className="font-display font-bold uppercase text-xs text-emerald-900 block">
                Paso B: Cuando está terminado
              </span>
              <span className="text-[11px] text-emerald-700 font-sans">
                Sacás las 4 fotos finales del auto brillante y lo pasás a firma de entrega.
              </span>
            </div>
            <button className="w-full bg-emerald-600 text-white font-mono text-xs font-bold uppercase py-2 rounded shadow hover:bg-emerald-700 transition-colors flex items-center justify-center gap-1.5">
              <CheckCircle2 size={14} />
              <span>Listo para Firma</span>
            </button>
          </div>
        </div>
      </div>
    </MarcoPantalla>
  )
}

// 7. ILUSTRACIÓN: Firma de Retiro en Pantalla
export function IlustracionFirmaCliente() {
  return (
    <MarcoPantalla
      titulo="Entrega del Vehículo: Firma Digital del Cliente"
      subtitulo="El cliente firma en la pantalla del celular o tablet antes de retirar"
    >
      <div className="bg-white p-4 rounded-lg border border-steel-300">
        <div className="text-center mb-3">
          <span className="font-display text-base font-bold uppercase text-navy block">
            Acta de Conformidad y Retiro
          </span>
          <p className="text-xs text-steel-600 font-sans">
            "Declaro haber recibido el vehículo reparado en perfectas condiciones técnicas y estéticas."
          </p>
        </div>

        {/* Recuadro simulado de firma */}
        <div className="h-28 bg-steel-50 border-2 border-dashed border-steel-400 rounded-lg relative flex items-center justify-center mb-3">
          {/* Trazo simulado de firma */}
          <div className="font-serif italic text-navy/40 text-2xl select-none">
            Juan Carlos Pérez (Firma Digital)
          </div>
          <span className="absolute bottom-2 right-3 font-mono text-[10px] text-steel-400">
            Dedo o lápiz óptico
          </span>
        </div>

        <button className="w-full bg-navy hover:bg-navy/90 text-white font-mono text-xs font-bold uppercase py-2.5 rounded shadow flex items-center justify-center gap-2">
          <FileSignature size={15} />
          <span>Confirmar Retiro y Guardar Firma Legal</span>
        </button>
      </div>
    </MarcoPantalla>
  )
}

// 8. ILUSTRACIÓN: Conexión y Facturación ARCA (ex-AFIP)
export function IlustracionConexionArca() {
  return (
    <MarcoPantalla
      titulo="Conexión ARCA (ex-AFIP) — Facturación Electrónica con CAE"
      subtitulo="Cómo se conecta el taller con los servidores fiscales de ARCA"
    >
      <div className="space-y-3">
        {/* Banner de Estado de Conexión Fiscal */}
        <div className="bg-navy text-white p-3.5 rounded-lg flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded bg-white/10 flex items-center justify-center font-mono font-bold text-sm border border-white/20">
              ARCA
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-mono font-bold text-xs uppercase tracking-wider">
                  Servicio WSFE v1.2 Conectado
                </span>
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              </div>
              <span className="font-sans text-[11px] text-steel-300 block">
                CUIT: 30-71234567-8 | Punto de Venta: 00001 (Web Services)
              </span>
            </div>
          </div>
          <span className="text-[11px] font-mono bg-emerald-500/20 text-emerald-300 border border-emerald-400/40 px-2.5 py-1 rounded">
            ✓ CAE Habilitado
          </span>
        </div>

        {/* Simulación de Comprobante Emitido */}
        <div className="bg-white p-4 rounded-lg border border-steel-300 shadow-xs">
          <div className="flex items-center justify-between border-b border-steel-200 pb-2 mb-3">
            <span className="font-mono text-xs font-bold uppercase text-navy">
              Vista Previa de Comprobante Autorizado
            </span>
            <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-blue text-white">
              Factura B
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs font-mono">
            <div className="p-2 bg-steel-50 rounded border border-steel-200">
              <span className="text-[10px] text-steel-500 block uppercase">N° Comprobante:</span>
              <strong className="text-navy text-sm">B-00001-00000089</strong>
            </div>
            <div className="p-2 bg-emerald-50 rounded border border-emerald-200">
              <span className="text-[10px] text-emerald-700 block uppercase font-bold">CAE Oficial:</span>
              <strong className="text-emerald-900 text-sm">74392819284721</strong>
            </div>
            <div className="p-2 bg-steel-50 rounded border border-steel-200">
              <span className="text-[10px] text-steel-500 block uppercase">Vencimiento CAE:</span>
              <strong className="text-graphite text-sm">10 Días</strong>
            </div>
            <div className="p-2 bg-steel-50 rounded border border-steel-200">
              <span className="text-[10px] text-steel-500 block uppercase">Monto Total:</span>
              <strong className="text-navy text-sm">$ 320.000</strong>
            </div>
          </div>
        </div>
      </div>
    </MarcoPantalla>
  )
}

