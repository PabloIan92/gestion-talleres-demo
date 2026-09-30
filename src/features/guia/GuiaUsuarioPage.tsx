import { useState } from 'react'
import {
  BookOpen,
  Wrench,
  Users,
  ShieldCheck,
  ChevronDown,
  ChevronUp,
  Search,
  Sparkles,
  Info,
  Building2,
  CheckCircle2,
} from 'lucide-react'
import { useAuth } from '../../auth/useAuth'
import type { Profile } from '../../auth/AuthProvider'
import { Ficha } from '../../ui/Ficha'
import {
  IlustracionTopbar,
  IlustracionCanales,
  IlustracionMapaDanos,
  IlustracionFotosObligatorias,
  IlustracionPlanillaSemaforo,
  IlustracionTallerPDR,
  IlustracionFirmaCliente,
  IlustracionConexionArca,
} from './GuiaVisuals'
import { BotonDescargarApp } from '../pwa/BotonDescargarApp'

type GuiaRoleView = 'dueno' | 'recepcion' | 'taller'

export function GuiaUsuarioPage({ onVolver }: { onVolver?: () => void } = {}) {
  const { profile } = useAuth()
  const userRole: Profile['role'] = profile?.role || 'sin_rol'

  // El dueño puede alternar entre ver la guía completa o la de cada rol para capacitarlos
  const [selectedRoleView, setSelectedRoleView] = useState<GuiaRoleView>(
    userRole === 'dueno' ? 'dueno' : userRole === 'taller' ? 'taller' : 'recepcion'
  )
  const [filtro, setFiltro] = useState('')
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({
    'inicio-cero': true,
    'glosario': true,
    'paso1-topbar': true,
    'paso2-canales': true,
    'paso3-mapa': true,
    'paso4-fotos': true,
    'paso5-planilla': true,
    'paso6-taller': true,
    'paso7-firma': true,
    'paso8-facturacion': true,
    'paso-arca': true,
    'rec-rutina': true,
    'tal-rutina': true,
    'faq': true,
  })

  function toggleSection(id: string) {
    setOpenSections((prev) => ({ ...prev, [id]: !prev[id] }))
  }

  const activeView: GuiaRoleView = userRole === 'dueno' ? selectedRoleView : (userRole as GuiaRoleView)

  // Función simple para saber si mostrar una sección con base en el filtro de búsqueda
  const matchesFilter = (text: string) => {
    if (!filtro) return true
    return text.toLowerCase().includes(filtro.toLowerCase())
  }

  return (
    <div className="p-4 sm:p-6 md:p-8 max-w-5xl mx-auto">
      {/* Encabezado Principal */}
      <div className="border-b-2 border-graphite pb-4 mb-6">
        <div className="flex items-center gap-2 text-blue font-mono text-xs font-bold uppercase tracking-wider mb-1">
          <BookOpen className="w-4 h-4" />
          <span>Manual Didáctico Ilustrado • Sistema de Gestión para Talleres</span>
        </div>
        <h1 className="font-display text-2xl sm:text-3xl md:text-4xl font-bold uppercase text-graphite tracking-tight">
          Guía Visual Paso a Paso para el Usuario
        </h1>
        <p className="font-sans text-sm sm:text-base text-steel-600 mt-1 max-w-3xl">
          Esta guía está escrita para que <strong>cualquier persona</strong>, aunque nunca antes haya usado una computadora o sistema en un taller, pueda entender qué botón tocar, cómo cargar un auto, cómo sacar las fotos y cómo cobrar el trabajo.
        </p>

        {/* Badge de Rol Actual */}
        <div className="mt-3 flex items-center gap-2 flex-wrap">
          <span className="text-xs font-mono font-bold uppercase text-steel-500">Tu usuario actual:</span>
          <span className="font-mono text-xs font-bold uppercase px-2.5 py-1 rounded bg-navy text-white shadow-sm">
            {profile?.full_name || 'Usuario'} ({userRole === 'dueno' ? 'Dueño' : userRole === 'recepcion' ? 'Recepción' : 'Taller'})
          </span>

          {userRole === 'dueno' && (
            <span className="text-xs font-sans text-emerald-800 bg-emerald-50 border border-emerald-300 px-2 py-0.5 rounded font-medium">
              Tenés acceso maestro a todas las pantallas y herramientas
            </span>
          )}
        </div>
      </div>

      {/* Descargar en versión App Card */}
      <BotonDescargarApp variant="card" className="mb-6" />

      {/* Selector de Perspectiva (Exclusivo para el Dueño) */}
      {userRole === 'dueno' && (
        <Ficha className="mb-6 bg-steel-100/80 border-2 border-navy">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <span className="font-mono text-xs font-bold uppercase text-navy block flex items-center gap-1.5">
                <Sparkles size={14} className="text-amber-600" />
                Selector de Manual para Capacitación (Modo Dueño)
              </span>
              <p className="text-xs text-steel-600 font-sans">
                Podés ver la guía completa o alternar para ver exactamente lo que ve tu personal de Recepción o de Taller:
              </p>
            </div>
            <div className="flex gap-1.5 shrink-0 flex-wrap">
              <button
                type="button"
                onClick={() => setSelectedRoleView('dueno')}
                className={`px-3 py-1.5 text-xs font-mono font-bold uppercase rounded transition-colors ${
                  selectedRoleView === 'dueno'
                    ? 'bg-navy text-white shadow'
                    : 'bg-white text-graphite hover:bg-steel-200 border border-steel-300'
                }`}
              >
                Dueño (Completo)
              </button>
              <button
                type="button"
                onClick={() => setSelectedRoleView('recepcion')}
                className={`px-3 py-1.5 text-xs font-mono font-bold uppercase rounded transition-colors ${
                  selectedRoleView === 'recepcion'
                    ? 'bg-blue text-white shadow'
                    : 'bg-white text-graphite hover:bg-steel-200 border border-steel-300'
                }`}
              >
                Ver como Recepción
              </button>
              <button
                type="button"
                onClick={() => setSelectedRoleView('taller')}
                className={`px-3 py-1.5 text-xs font-mono font-bold uppercase rounded transition-colors ${
                  selectedRoleView === 'taller'
                    ? 'bg-graphite text-white shadow'
                    : 'bg-white text-graphite hover:bg-steel-200 border border-steel-300'
                }`}
              >
                Ver como Taller
              </button>
            </div>
          </div>
        </Ficha>
      )}

      {/* Barra de Búsqueda Rápida */}
      <div className="mb-6 relative">
        <Search className="w-4 h-4 text-steel-400 absolute left-3 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          value={filtro}
          onChange={(e) => setFiltro(e.target.value)}
          placeholder="Escribí lo que querés buscar (ej: fotos, nuevo caso, repuesto, seguro, turno, factura)..."
          className="w-full pl-9 pr-3 py-2.5 text-sm font-sans bg-white border-2 border-steel-300 focus:border-navy focus:outline-none rounded shadow-sm"
        />
        {filtro && (
          <button
            onClick={() => setFiltro('')}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-mono text-steel-500 hover:text-graphite px-2 py-1 bg-steel-100 rounded"
          >
            Limpiar búsqueda
          </button>
        )}
      </div>

      {/* ========================================================================= */}
      {/* VISTA 1: GUÍA COMPLETA DEL DUEÑO (Con todas las ilustraciones paso a paso) */}
      {/* ========================================================================= */}
      {activeView === 'dueno' && (
        <div className="space-y-6">
          {/* Bienvenida y Principio Clave */}
          <div className="p-4 bg-navy text-white rounded-lg border-2 border-graphite shadow-md">
            <h2 className="font-display text-lg uppercase tracking-wide flex items-center gap-2 mb-1">
              <ShieldCheck className="w-5 h-5 text-amber-400" />
              ¿Cuál es la idea de este sistema?
            </h2>
            <p className="text-xs sm:text-sm font-sans text-steel-200 leading-relaxed">
              En lugar de anotar los autos en un cuaderno o en un Excel que se desactualiza, este sistema es una <strong>Planilla de Control Inteligente</strong>. 
              Cada vez que entra un auto, Recepción carga los datos y saca las fotos. El chapista ve qué hacer en el taller. Y cuando el auto se repara y se entrega, 
              la planilla se actualiza <strong>sola y en vivo</strong> con colores como un semáforo. Vos como dueño tenés el control total del taller en tu celular o computadora.
            </p>
          </div>

          {/* 0. DICCIONARIO BÁSICO: Para entender el taller */}
          {matchesFilter('glosario caso ot semaforo franquicia pdr') && (
            <section className="border-2 border-graphite bg-white rounded-lg shadow-sm overflow-hidden">
              <button
                onClick={() => toggleSection('glosario')}
                className="w-full flex items-center justify-between p-4 bg-steel-100 hover:bg-steel-200/70 text-left transition-colors border-b border-steel-300"
              >
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-full bg-steel-700 text-white text-xs font-mono font-bold flex items-center justify-center">
                    📖
                  </div>
                  <div>
                    <h3 className="font-display text-base sm:text-lg font-bold uppercase text-graphite">
                      Diccionario para Principiantes: ¿Qué significa cada término?
                    </h3>
                    <span className="text-xs text-steel-600 font-sans block">
                      Las 5 palabras clave que vas a ver en las pantallas
                    </span>
                  </div>
                </div>
                {openSections['glosario'] ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
              </button>

              {openSections['glosario'] && (
                <div className="p-4 sm:p-5 text-xs sm:text-sm font-sans text-graphite space-y-3">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 font-sans">
                    <div className="p-3 bg-steel-50 border border-steel-300 rounded">
                      <strong className="text-navy font-bold text-sm block mb-1">
                        1. Caso
                      </strong>
                      <p className="text-steel-600">
                        Es la carpeta virtual de un auto en particular. Ahí se guarda la patente, el dueño, las fotos, el presupuesto, el turno y la factura.
                      </p>
                    </div>

                    <div className="p-3 bg-steel-50 border border-steel-300 rounded">
                      <strong className="text-navy font-bold text-sm block mb-1">
                        2. OT (Orden de Trabajo)
                      </strong>
                      <p className="text-steel-600">
                        Es el número de ficha interna del taller (ejemplo: OT #1042). Sirve para que el chapista identifique físicamente el vehículo en el taller.
                      </p>
                    </div>

                    <div className="p-3 bg-steel-50 border border-steel-300 rounded">
                      <strong className="text-navy font-bold text-sm block mb-1">
                        3. Semáforo
                      </strong>
                      <p className="text-steel-600">
                        Son las luces de colores de la Planilla de Control: <strong>Gris</strong> (no empezó), <strong>Azul</strong> (en proceso), <strong>Verde</strong> (listo) y <strong>Rojo</strong> (parado por falta de repuesto).
                      </p>
                    </div>

                    <div className="p-3 bg-steel-50 border border-steel-300 rounded">
                      <strong className="text-navy font-bold text-sm block mb-1">
                        4. PDR / Sacabollos
                      </strong>
                      <p className="text-steel-600">
                        Técnica de reparación de abolladuras y granizo mediante palancas e inducción sin tener que pintar ni masillar el auto, manteniendo la pintura de fábrica.
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </section>
          )}

          {/* PASO 1: ¿Dónde está cada botón en la pantalla? */}
          {matchesFilter('topbar boton nuevo caso guia campana') && (
            <section className="border-2 border-graphite bg-white rounded-lg shadow-sm overflow-hidden">
              <button
                onClick={() => toggleSection('paso1-topbar')}
                className="w-full flex items-center justify-between p-4 bg-steel-100 hover:bg-steel-200/70 text-left transition-colors border-b border-steel-300"
              >
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-full bg-navy text-white text-xs font-mono font-bold flex items-center justify-center">
                    1
                  </div>
                  <div>
                    <h3 className="font-display text-base sm:text-lg font-bold uppercase text-graphite">
                      Paso 1: ¿Cómo ingresar un vehículo nuevo al taller?
                    </h3>
                    <span className="text-xs text-steel-600 font-sans block">
                      Ubicación de los botones en la barra superior
                    </span>
                  </div>
                </div>
                {openSections['paso1-topbar'] ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
              </button>

              {openSections['paso1-topbar'] && (
                <div className="p-4 sm:p-5 text-xs sm:text-sm font-sans text-graphite space-y-3">
                  <p>
                    Mirá arriba a la derecha de la pantalla. Vas a ver la barra azul oscura del taller con los siguientes elementos:
                  </p>

                  {/* IMAGEN / ILUSTRACIÓN 1 */}
                  <IlustracionTopbar />

                  <div className="bg-blue-50 border-l-4 border-blue p-3 rounded text-xs space-y-1">
                    <strong className="text-blue font-bold block text-sm">
                      ¿Qué hacés cuando entra un cliente al taller?
                    </strong>
                    <p className="text-graphite">
                      Hacés click en el botón azul <strong>"+ NUEVO CASO"</strong>. Esto te va a abrir una pantalla para cargar los datos del auto y del cliente.
                    </p>
                  </div>
                </div>
              )}
            </section>
          )}

          {/* PASO 2: Seguro vs Particular */}
          {matchesFilter('seguro particular franquicia compania siniestro') && (
            <section className="border-2 border-graphite bg-white rounded-lg shadow-sm overflow-hidden">
              <button
                onClick={() => toggleSection('paso2-canales')}
                className="w-full flex items-center justify-between p-4 bg-steel-100 hover:bg-steel-200/70 text-left transition-colors border-b border-steel-300"
              >
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-full bg-navy text-white text-xs font-mono font-bold flex items-center justify-center">
                    2
                  </div>
                  <div>
                    <h3 className="font-display text-base sm:text-lg font-bold uppercase text-graphite">
                      Paso 2: ¿Quién paga el arreglo? (Seguro vs Particular)
                    </h3>
                    <span className="text-xs text-steel-600 font-sans block">
                      Cómo elegir entre compañía aseguradora o cliente directo
                    </span>
                  </div>
                </div>
                {openSections['paso2-canales'] ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
              </button>

              {openSections['paso2-canales'] && (
                <div className="p-4 sm:p-5 text-xs sm:text-sm font-sans text-graphite space-y-3">
                  <p>
                    Cuando creás un caso, lo primero que te pregunta el sistema es si el trabajo viene por una <strong>compañía de seguros</strong> o si es un cliente <strong>particular</strong> que paga de su bolsillo:
                  </p>

                  {/* IMAGEN / ILUSTRACIÓN 2 */}
                  <IlustracionCanales />

                  <div className="space-y-2 mt-2">
                    <div className="p-3 bg-steel-50 rounded border border-steel-300">
                      <strong className="text-blue block font-bold">
                        Si elegís Seguro:
                      </strong>
                      <span className="text-steel-600">
                        Tenés que seleccionar la compañía (ej: La Segunda, San Cristóbal, etc.). El sistema te pedirá el número de siniestro y franquicia. El caso pasará al estado "Enviado a la Aseguradora" para que autoricen el presupuesto antes de meter el auto a taller.
                      </span>
                    </div>

                    <div className="p-3 bg-steel-50 rounded border border-steel-300">
                      <strong className="text-emerald-700 block font-bold">
                        Si elegís Particular:
                      </strong>
                      <span className="text-steel-600">
                        No hay compañías en el medio. Le pasás el presupuesto directo en pesos al cliente. Si acepta, se marca "Aprobado" y ya podés coordinarle turno para el ingreso.
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </section>
          )}

          {/* PASO 3: Mapa de Daños (Auto con Zonas) */}
          {matchesFilter('mapa inspeccion danos chapa capot techo zonas') && (
            <section className="border-2 border-graphite bg-white rounded-lg shadow-sm overflow-hidden">
              <button
                onClick={() => toggleSection('paso3-mapa')}
                className="w-full flex items-center justify-between p-4 bg-steel-100 hover:bg-steel-200/70 text-left transition-colors border-b border-steel-300"
              >
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-full bg-navy text-white text-xs font-mono font-bold flex items-center justify-center">
                    3
                  </div>
                  <div>
                    <h3 className="font-display text-base sm:text-lg font-bold uppercase text-graphite">
                      Paso 3: Ficha de Inspección y Mapa de Daños del Auto
                    </h3>
                    <span className="text-xs text-steel-600 font-sans block">
                      Cómo marcar en la pantalla dónde están los bollos
                    </span>
                  </div>
                </div>
                {openSections['paso3-mapa'] ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
              </button>

              {openSections['paso3-mapa'] && (
                <div className="p-4 sm:p-5 text-xs sm:text-sm font-sans text-graphite space-y-3">
                  <p>
                    Para no anotar en papeles que se pierden, el sistema te muestra un <strong>dibujo del auto visto desde arriba</strong> con sus 10 zonas de chapa (Capot, Techo, Portón, Guardabarros y Puertas):
                  </p>

                  {/* IMAGEN / ILUSTRACIÓN 3 */}
                  <IlustracionMapaDanos />

                  <div className="p-3 bg-amber-50 border border-amber-300 rounded text-xs text-amber-900 flex items-start gap-2">
                    <Info size={16} className="text-amber-600 shrink-0 mt-0.5" />
                    <div>
                      <strong>Consejo para el mostrador:</strong> Cuando revises el auto junto al cliente o perito, tocá directamente la pantalla de la tablet o celular para registrar cada bollo. Así el cliente ve con total transparencia qué partes quedan registradas para reparar.
                    </div>
                  </div>
                </div>
              )}
            </section>
          )}

          {/* PASO 4: Las 4 Fotos Obligatorias */}
          {matchesFilter('fotos obligatorias camara frente trasera laterales') && (
            <section className="border-2 border-graphite bg-white rounded-lg shadow-sm overflow-hidden">
              <button
                onClick={() => toggleSection('paso4-fotos')}
                className="w-full flex items-center justify-between p-4 bg-steel-100 hover:bg-steel-200/70 text-left transition-colors border-b border-steel-300"
              >
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-full bg-navy text-white text-xs font-mono font-bold flex items-center justify-center">
                    4
                  </div>
                  <div>
                    <h3 className="font-display text-base sm:text-lg font-bold uppercase text-graphite">
                      Paso 4: Las 4 Fotos Obligatorias (Requisito Indispensable)
                    </h3>
                    <span className="text-xs text-steel-600 font-sans block">
                      ¿Por qué el sistema no me deja avanzar si no las subo?
                    </span>
                  </div>
                </div>
                {openSections['paso4-fotos'] ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
              </button>

              {openSections['paso4-fotos'] && (
                <div className="p-4 sm:p-5 text-xs sm:text-sm font-sans text-graphite space-y-3">
                  <p>
                    Tanto las compañías de seguro como el control de calidad del taller exigen <strong>4 fotos testigo</strong>: Frente con patente, Trasera con patente, Lateral Izquierdo y Lateral Derecho.
                  </p>

                  {/* IMAGEN / ILUSTRACIÓN 4 */}
                  <IlustracionFotosObligatorias />

                  <div className="p-3 bg-rose-50 border-l-4 border-rose-500 rounded text-xs text-rose-900 space-y-1">
                    <strong className="block font-bold">
                      ¿Qué pasa si el botón "Guardar" está gris o no responde?
                    </strong>
                    <p>
                      Revisá los 4 casilleros de fotos. Si falta aunque sea 1 sola foto, el botón permanecerá bloqueado. Esto protege al taller ante reclamos posteriores por golpes previos que el auto ya traía.
                    </p>
                  </div>
                </div>
              )}
            </section>
          )}

          {/* PASO 5: La Planilla de Control y los Semáforos */}
          {matchesFilter('planilla control semaforo colores azul verde rojo gris') && (
            <section className="border-2 border-graphite bg-white rounded-lg shadow-sm overflow-hidden">
              <button
                onClick={() => toggleSection('paso5-planilla')}
                className="w-full flex items-center justify-between p-4 bg-steel-100 hover:bg-steel-200/70 text-left transition-colors border-b border-steel-300"
              >
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-full bg-navy text-white text-xs font-mono font-bold flex items-center justify-center">
                    5
                  </div>
                  <div>
                    <h3 className="font-display text-base sm:text-lg font-bold uppercase text-graphite">
                      Paso 5: La Planilla de Control con Semáforos (Tu Pantalla Principal)
                    </h3>
                    <span className="text-xs text-steel-600 font-sans block">
                      Cómo monitorear de un vistazo todos los autos del taller
                    </span>
                  </div>
                </div>
                {openSections['paso5-planilla'] ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
              </button>

              {openSections['paso5-planilla'] && (
                <div className="p-4 sm:p-5 text-xs sm:text-sm font-sans text-graphite space-y-3">
                  <p>
                    Cuando entrás con tu usuario de Dueño, esta es la pantalla que ves. Cada fila es un auto y las columnas indican el avance de cada etapa:
                  </p>

                  {/* IMAGEN / ILUSTRACIÓN 5 */}
                  <IlustracionPlanillaSemaforo />

                  <div className="bg-steel-50 p-3 rounded border border-steel-300 text-xs space-y-2">
                    <strong className="text-navy font-bold text-sm block">
                      ¿Cómo interactuar con la planilla?
                    </strong>
                    <ul className="list-disc list-inside text-steel-600 space-y-1">
                      <li><strong>Hacé click en cualquier fila:</strong> Se abre un cajón lateral a la derecha con la información detallada del auto, el teléfono del cliente y el botón para ver la ficha técnica.</li>
                      <li><strong>Filtrar por canal:</strong> Arriba podés apretar "Solo Seguros" o "Solo Particulares" para ver cuántos autos tenés de cada rubro.</li>
                    </ul>
                  </div>
                </div>
              )}
            </section>
          )}

          {/* PASO 6: Taller PDR y Bloqueo por Repuestos */}
          {matchesFilter('taller reparacion esperando repuesto pausa terminar') && (
            <section className="border-2 border-graphite bg-white rounded-lg shadow-sm overflow-hidden">
              <button
                onClick={() => toggleSection('paso6-taller')}
                className="w-full flex items-center justify-between p-4 bg-steel-100 hover:bg-steel-200/70 text-left transition-colors border-b border-steel-300"
              >
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-full bg-navy text-white text-xs font-mono font-bold flex items-center justify-center">
                    6
                  </div>
                  <div>
                    <h3 className="font-display text-base sm:text-lg font-bold uppercase text-graphite">
                      Paso 6: En el Taller (Reparación y Repuestos Faltantes)
                    </h3>
                    <span className="text-xs text-steel-600 font-sans block">
                      Qué hace el chapista y cómo se avisa si falta una pieza
                    </span>
                  </div>
                </div>
                {openSections['paso6-taller'] ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
              </button>

              {openSections['paso6-taller'] && (
                <div className="p-4 sm:p-5 text-xs sm:text-sm font-sans text-graphite space-y-3">
                  <p>
                    Cuando el auto ingresa físicamente al taller, el chapista entra a la <strong>Ficha de Trabajo</strong>. Allí ve exactamente los bollos a reparar y dispone de dos botones clave:
                  </p>

                  {/* IMAGEN / ILUSTRACIÓN 6 */}
                  <IlustracionTallerPDR />

                  <div className="p-3 bg-rose-50 border-l-4 border-rose-500 rounded text-xs text-rose-900">
                    <strong>La alerta roja en tiempo real:</strong> En el segundo que el chapista marca "Esperando repuesto", la planilla del dueño titila en <strong>ROJO</strong>. Así el dueño o recepción se entera inmediatamente de que hay que llamar a la casa de repuestos o a la aseguradora para pedir la pieza.
                  </div>
                </div>
              )}
            </section>
          )}

          {/* PASO 7: Retiro y Firma Digital */}
          {matchesFilter('firma retiro entrega conformidad dedo tablet') && (
            <section className="border-2 border-graphite bg-white rounded-lg shadow-sm overflow-hidden">
              <button
                onClick={() => toggleSection('paso7-firma')}
                className="w-full flex items-center justify-between p-4 bg-steel-100 hover:bg-steel-200/70 text-left transition-colors border-b border-steel-300"
              >
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-full bg-navy text-white text-xs font-mono font-bold flex items-center justify-center">
                    7
                  </div>
                  <div>
                    <h3 className="font-display text-base sm:text-lg font-bold uppercase text-graphite">
                      Paso 7: Entrega del Auto y Firma Digital del Cliente
                    </h3>
                    <span className="text-xs text-steel-600 font-sans block">
                      Cómo hacer firmar el retiro del vehículo en la pantalla
                    </span>
                  </div>
                </div>
                {openSections['paso7-firma'] ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
              </button>

              {openSections['paso7-firma'] && (
                <div className="p-4 sm:p-5 text-xs sm:text-sm font-sans text-graphite space-y-3">
                  <p>
                    Cuando el trabajo está terminado y el cliente viene a retirar su vehículo, Recepción abre la <strong>Ficha de Cierre</strong>:
                  </p>

                  {/* IMAGEN / ILUSTRACIÓN 7 */}
                  <IlustracionFirmaCliente />

                  <div className="p-3 bg-emerald-50 border border-emerald-300 rounded text-xs text-emerald-900">
                    <strong>Respaldo legal total:</strong> La firma queda grabada en el caso junto a la fecha y hora exacta de entrega. Ya no necesitás archivar hojas de papel que se rompen o pierden.
                  </div>
                </div>
              )}
            </section>
          )}

          {/* PASO 8: Facturación y Cobro */}
          {matchesFilter('factura facturacion cobro pago afip liquidar dinero') && (
            <section className="border-2 border-graphite bg-white rounded-lg shadow-sm overflow-hidden">
              <button
                onClick={() => toggleSection('paso8-facturacion')}
                className="w-full flex items-center justify-between p-4 bg-steel-100 hover:bg-steel-200/70 text-left transition-colors border-b border-steel-300"
              >
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-full bg-navy text-white text-xs font-mono font-bold flex items-center justify-center">
                    8
                  </div>
                  <div>
                    <h3 className="font-display text-base sm:text-lg font-bold uppercase text-graphite">
                      Paso 8: Facturación, Pagos y Reclamos a Aseguradoras
                    </h3>
                    <span className="text-xs text-steel-600 font-sans block">
                      El módulo exclusivo para que el Dueño liquide y cobre
                    </span>
                  </div>
                </div>
                {openSections['paso8-facturacion'] ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
              </button>

              {openSections['paso8-facturacion'] && (
                <div className="p-4 sm:p-5 text-xs sm:text-sm font-sans text-graphite space-y-3">
                  <p>
                    Una vez que el auto fue firmado por el cliente, pasa al estado <strong>"Firmado"</strong> y aparece listo en el menú de <strong>Facturación</strong>:
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                    <div className="p-3 bg-steel-50 rounded border border-steel-300">
                      <strong className="text-navy font-bold block mb-1">1. Emitir Factura</strong>
                      Cargás el número de factura emitida (ej. Factura B-0001-00004523) y el importe total.
                    </div>
                    <div className="p-3 bg-steel-50 rounded border border-steel-300">
                      <strong className="text-navy font-bold block mb-1">2. Registrar Cobro</strong>
                      Anotás cuánto dinero ingresó (sea una seña o el total). Podés cargar pagos parciales sucesivos.
                    </div>
                    <div className="p-3 bg-steel-50 rounded border border-steel-300">
                      <strong className="text-navy font-bold block mb-1">3. Saldo Cero</strong>
                      Cuando el saldo diferencial llega a $0, el caso se cierra con éxito y el semáforo final se pone en <strong>VERDE ($ COBRADO)</strong>.
                    </div>
                  </div>
                </div>
              )}
            </section>
          )}

          {/* PASO ESPECIAL: CONEXIÓN ARCA (ex-AFIP) */}
          {activeView === 'dueno' && matchesFilter('arca afip facturacion electronica cae wsfe punto de venta certificado crt key') && (
            <section id="paso-arca" className="border-2 border-navy bg-white rounded-lg shadow-sm overflow-hidden">
              <button
                type="button"
                onClick={() => toggleSection('paso-arca')}
                className="w-full flex items-center justify-between p-4 bg-navy text-white text-left transition-colors cursor-pointer"
              >
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-full bg-white text-navy text-xs font-mono font-bold flex items-center justify-center">
                    <Building2 size={16} />
                  </div>
                  <div>
                    <h3 className="font-display text-base sm:text-lg font-bold uppercase text-white">
                      Guía Fiscal: Cómo Conectar y Facturar con ARCA (ex-AFIP)
                    </h3>
                    <span className="text-xs text-steel-300 font-sans block">
                      Toda la información y archivos que necesitás extraer de la web de ARCA para que el facturador funcione
                    </span>
                  </div>
                </div>
                {openSections['paso-arca'] ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
              </button>

              {openSections['paso-arca'] && (
                <div className="p-4 sm:p-5 text-xs sm:text-sm font-sans text-graphite space-y-4">
                  <p>
                    Para que el sistema de <strong>Gestión de Talleres</strong> pueda comunicarse con los servidores de ARCA (Agencia de Recaudación y Control Aduanero, ex-AFIP) y autorizar facturas con <strong>CAE oficial</strong> en un solo clic, necesitás configurar los datos fiscales del taller.
                  </p>

                  {/* Resumen de los 4 datos obligatorios a extraer de ARCA */}
                  <div className="p-4 bg-blue-50 border-2 border-blue/40 rounded-lg space-y-2">
                    <span className="font-mono font-bold uppercase text-navy text-xs sm:text-sm block flex items-center gap-1.5">
                      <Sparkles size={16} className="text-blue" />
                      Los 4 Datos que tenés que sacar de la web de ARCA:
                    </span>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1 text-xs font-sans">
                      <div className="p-2.5 bg-white rounded border border-steel-300">
                        <strong className="text-navy font-bold block mb-0.5">1. CUIT del Taller</strong>
                        Los 11 dígitos de la empresa o titular (ej. 30-71234567-8) con Clave Fiscal Nivel 3.
                      </div>
                      <div className="p-2.5 bg-white rounded border border-steel-300">
                        <strong className="text-navy font-bold block mb-0.5">2. Punto de Venta Web Services</strong>
                        Un número de punto de venta (ej: 00001) dado de alta bajo el sistema <em>"Facturación Electrónica - Web Services"</em>.
                      </div>
                      <div className="p-2.5 bg-white rounded border border-steel-300">
                        <strong className="text-navy font-bold block mb-0.5">3. Certificado Digital (.crt)</strong>
                        El archivo de certificado X.509 descargado del servicio <em>"Administración de Certificados Digitales"</em> de ARCA.
                      </div>
                      <div className="p-2.5 bg-white rounded border border-steel-300">
                        <strong className="text-navy font-bold block mb-0.5">4. Clave Privada (.key)</strong>
                        La clave criptográfica privada generada al crear el pedido de certificado (CSR) para firmar los accesos (WSAA).
                      </div>
                    </div>
                  </div>

                  {/* Paso a paso de 5 pasos dentro de ARCA */}
                  <div>
                    <h4 className="font-mono text-xs font-bold uppercase tracking-wider text-navy mb-2">
                      Procedimiento Paso a Paso en la Web de ARCA (ex-AFIP):
                    </h4>
                    <div className="space-y-2.5">
                      <div className="flex items-start gap-2.5 p-3 bg-steel-50 rounded border border-steel-300">
                        <span className="w-5 h-5 rounded-full bg-navy text-white text-[11px] font-bold flex items-center justify-center shrink-0">1</span>
                        <div>
                          <strong className="text-navy block">Ingresá a la web oficial de ARCA con tu Clave Fiscal</strong>
                          <p className="text-xs text-steel-600 mt-0.5">
                            Entrá a <a href="https://www.arca.gob.ar" target="_blank" rel="noreferrer" className="text-blue underline font-semibold">www.arca.gob.ar</a> con tu CUIT y Clave Fiscal nivel 3 o superior del titular o sociedad.
                          </p>
                        </div>
                      </div>

                      <div className="flex items-start gap-2.5 p-3 bg-steel-50 rounded border border-steel-300">
                        <span className="w-5 h-5 rounded-full bg-navy text-white text-[11px] font-bold flex items-center justify-center shrink-0">2</span>
                        <div>
                          <strong className="text-navy block">Generá el Certificado Digital (.crt)</strong>
                          <p className="text-xs text-steel-600 mt-0.5">
                            Buscá el servicio <strong>"Administración de Certificados Digitales"</strong>. Creá un alias para el taller (ej: <code>TallerFactura</code>), subí tu CSR o generá el pedido y descargá el archivo con extensión <strong>.crt</strong> a tu computadora. Guardá también la clave privada <strong>.key</strong>.
                          </p>
                        </div>
                      </div>

                      <div className="flex items-start gap-2.5 p-3 bg-steel-50 rounded border border-steel-300">
                        <span className="w-5 h-5 rounded-full bg-navy text-white text-[11px] font-bold flex items-center justify-center shrink-0">3</span>
                        <div>
                          <strong className="text-navy block">Asociá el Servicio "WSFE - Facturación Electrónica"</strong>
                          <p className="text-xs text-steel-600 mt-0.5">
                            En el menú principal de ARCA, entrá a <strong>"Administrador de Relaciones de Clave Fiscal"</strong>. Hacé clic en <em>"Nueva Relación"</em>, seleccioná <strong>ARCA &gt; Servicios Web &gt; Facturación Electrónica</strong> y en el campo "Representante" elegí el alias creado en el paso anterior.
                          </p>
                        </div>
                      </div>

                      <div className="flex items-start gap-2.5 p-3 bg-steel-50 rounded border border-steel-300">
                        <span className="w-5 h-5 rounded-full bg-navy text-white text-[11px] font-bold flex items-center justify-center shrink-0">4</span>
                        <div>
                          <strong className="text-navy block">Creá el Punto de Venta específico para Web Services</strong>
                          <p className="text-xs text-steel-600 mt-0.5">
                            Entrá al servicio <strong>"Regímenes de Facturación y Registración (REAR/RECE/RFI)" &gt; "A/B/M de Puntos de Venta"</strong>. Creá un nuevo punto de venta (por ejemplo el número <code>1</code>). En el desplegable de sistema, elegí <strong>"Facturación Electrónica - Web Services"</strong> (¡Atención: NO elijas Comprobantes en línea!).
                          </p>
                        </div>
                      </div>

                      <div className="flex items-start gap-2.5 p-3 bg-steel-50 rounded border border-steel-300">
                        <span className="w-5 h-5 rounded-full bg-navy text-white text-[11px] font-bold flex items-center justify-center shrink-0">5</span>
                        <div>
                          <strong className="text-navy block">Cargá los datos en el sistema</strong>
                          <p className="text-xs text-steel-600 mt-0.5">
                            En el sistema, andá a <strong>Facturación &gt; botón "Conexión ARCA"</strong> (arriba a la derecha). Escribí tu CUIT, tu Punto de Venta, pegá el Certificado (.crt) y la Clave Privada (.key). Tocá <strong>"Probar Conexión con ARCA"</strong> para verificar que responda el servidor y guardá.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Ilustración */}
                  <IlustracionConexionArca />

                  {/* Cómo se factura en la práctica */}
                  <div className="p-3.5 bg-emerald-50 border border-emerald-300 rounded text-xs font-sans text-emerald-900 space-y-1">
                    <span className="font-bold block text-sm flex items-center gap-1.5">
                      <CheckCircle2 size={16} className="text-emerald-700" />
                      ¿Cómo emito una factura en el día a día?
                    </span>
                    <p>
                      1. Cuando un auto ya fue reparado y entregado, entrás a la ficha de <strong>Facturación</strong> del caso.<br />
                      2. El sistema detecta automáticamente si es <strong>Particular (Factura B)</strong> o <strong>Seguro (Factura A)</strong>.<br />
                      3. En el bloque de ARCA presionás el botón verde <strong>"⚡ Emitir Comprobante y Obtener CAE"</strong>.<br />
                      4. En 1 segundo el sistema consulta el Web Service de ARCA, obtiene el <strong>CAE oficial</strong>, asigna el número correlativo y deja registrado el comprobante con validez tributaria.
                    </p>
                  </div>
                </div>
              )}
            </section>
          )}

          {/* PREGUNTAS FRECUENTES Y ERRORES COMUNES */}
          {matchesFilter('faq preguntas problemas error no puedo boton') && (
            <section className="border-2 border-graphite bg-white rounded-lg shadow-sm overflow-hidden">
              <button
                onClick={() => toggleSection('faq')}
                className="w-full flex items-center justify-between p-4 bg-steel-100 hover:bg-steel-200/70 text-left transition-colors border-b border-steel-300"
              >
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-full bg-amber-500 text-graphite text-xs font-mono font-bold flex items-center justify-center">
                    ?
                  </div>
                  <div>
                    <h3 className="font-display text-base sm:text-lg font-bold uppercase text-graphite">
                      Preguntas Frecuentes y Solución de Problemas
                    </h3>
                    <span className="text-xs text-steel-600 font-sans block">
                      Respuestas rápidas a las dudas del día a día
                    </span>
                  </div>
                </div>
                {openSections['faq'] ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
              </button>

              {openSections['faq'] && (
                <div className="p-4 sm:p-5 text-xs sm:text-sm font-sans text-graphite space-y-3">
                  <div className="space-y-2">
                    <div className="p-3 bg-blue-50 rounded border border-blue-200">
                      <strong className="text-navy block mb-1">
                        ¿Cómo edito los datos de un caso si tipeé mal la patente, el teléfono o el cliente?
                      </strong>
                      <p className="text-graphite">
                        Tanto el <strong>Dueño</strong> como <strong>Recepción</strong> pueden corregir los datos del vehículo, cliente o seguro en cualquier momento:
                      </p>
                      <ul className="list-disc list-inside text-steel-700 mt-1 space-y-1">
                        <li><strong>Desde la Ficha del Caso:</strong> Arriba a la derecha hacé click en <strong>"✏️ Editar Datos"</strong>.</li>
                        <li><strong>Desde la Planilla de Control:</strong> Seleccioná la fila del auto para abrir el panel lateral y hacé click en <strong>"✏️ Editar Datos del Caso"</strong>.</li>
                      </ul>
                      <p className="text-steel-600 mt-1 text-[11px]">
                        Podés corregir la patente, marca, modelo, color, nombre y teléfono del cliente, o los datos del siniestro y productor. Al guardar, los cambios se actualizan automáticamente en todo el sistema.
                      </p>
                    </div>

                    <div className="p-3 bg-rose-50 rounded border border-rose-200">
                      <strong className="text-rose-900 block mb-1">
                        ¿Cómo borro o elimino un caso si me equivoqué de patente o lo cargué mal?
                      </strong>
                      <p className="text-graphite">
                        Tenés dos formas muy fáciles de eliminar un caso mal cargado:
                      </p>
                      <ul className="list-disc list-inside text-steel-700 mt-1 space-y-1">
                        <li><strong>Desde la Ficha del Caso o de Inspección:</strong> Arriba a la derecha verás el botón rojo <strong>"🗑️ Eliminar Caso"</strong>.</li>
                        <li><strong>Desde la Planilla de Control:</strong> Hacé click en el auto para abrir el cajón lateral derecho; abajo de todo verás el botón <strong>"🗑️ Eliminar Caso Mal Cargado"</strong>.</li>
                      </ul>
                      <p className="text-steel-600 mt-1 text-[11px]">
                        El Dueño puede eliminar cualquier caso; Recepción puede eliminar casos mientras estén en borrador. El sistema te pedirá confirmación antes de borrar para evitar accidentes.
                      </p>
                    </div>

                    <div className="p-3 bg-steel-50 rounded border border-steel-200">
                      <strong className="text-navy block mb-1">
                        ¿Por qué el botón "Guardar Inspección" no hace nada o está deshabilitado?
                      </strong>
                      <p className="text-steel-600">
                        Asegurate de haber subido las 4 fotos requeridas (Frente, Trasera, Lateral Izquierdo y Lateral Derecho). Si falta aunque sea una, el sistema no permite guardar para evitar peritajes incompletos.
                      </p>
                    </div>

                    <div className="p-3 bg-steel-50 rounded border border-steel-200">
                      <strong className="text-navy block mb-1">
                        ¿Cómo le mando un mensaje de WhatsApp prearmado al cliente?
                      </strong>
                      <p className="text-steel-600">
                        Andá al menú <strong>Plantillas</strong> en la barra superior. Vas a encontrar mensajes listos para coordinar turno, avisar que el auto está listo para retirar o enviar la factura. Hacés click en "Copiar" o "Abrir WhatsApp" y se envía directo.
                      </p>
                    </div>

                    <div className="p-3 bg-steel-50 rounded border border-steel-200">
                      <strong className="text-navy block mb-1">
                        ¿Puedo usar el sistema desde el celular en el taller?
                      </strong>
                      <p className="text-steel-600">
                        Sí, el sistema es 100% compatible con teléfonos móviles y tablets. Podés abrir la cámara del celular para sacar las 4 fotos directamente desde el auto sin tener que pasarlas a la computadora.
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </section>
          )}
        </div>
      )}

      {/* ========================================================================= */}
      {/* VISTA 2: GUÍA EXCLUSIVA DE RECEPCIÓN (Mesa de Entrada)                    */}
      {/* ========================================================================= */}
      {activeView === 'recepcion' && (
        <div className="space-y-6">
          <div className="p-4 bg-blue text-white rounded-lg border-2 border-navy shadow-md">
            <h2 className="font-display text-lg uppercase tracking-wide flex items-center gap-2 mb-1">
              <Users className="w-5 h-5 text-amber-300" />
              Manual de Puesto: Personal de Recepción
            </h2>
            <p className="text-xs sm:text-sm font-sans text-blue-50 leading-relaxed">
              Tu trabajo es el primer y último contacto con el cliente: cargar el vehículo, realizar la inspección inicial con fotos, coordinar el turno, recibir físicamente las llaves y entregar el auto reparado con la firma de conformidad.
            </p>
          </div>

          {/* Ilustración de la barra */}
          <IlustracionTopbar />

          {/* Rutina de Recepción */}
          <div className="space-y-4">
            <div className="p-4 bg-white border-2 border-graphite rounded-lg shadow-sm">
              <h3 className="font-display text-base font-bold uppercase text-navy mb-2 flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-blue text-white font-mono text-xs flex items-center justify-center">1</span>
                Cargar Caso Nuevo al Llegar el Auto
              </h3>
              <p className="text-xs sm:text-sm text-graphite mb-3">
                Tocá el botón azul <strong>"+ Nuevo caso"</strong> arriba a la derecha. Preguntale al cliente si viene por aseguradora o particular y completá sus datos:
              </p>
              <IlustracionCanales />
            </div>

            <div className="p-4 bg-white border-2 border-graphite rounded-lg shadow-sm">
              <h3 className="font-display text-base font-bold uppercase text-navy mb-2 flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-blue text-white font-mono text-xs flex items-center justify-center">2</span>
                Marcar los Daños y Sacar las 4 Fotos con el Celular
              </h3>
              <p className="text-xs sm:text-sm text-graphite mb-3">
                Entrá a <strong>Ficha de Inspección</strong>. Marcá en el auto dónde están los bollos y tocá los 4 recuadros de fotos para sacarlas con la cámara:
              </p>
              <IlustracionMapaDanos />
              <IlustracionFotosObligatorias />
            </div>

            <div className="p-4 bg-white border-2 border-graphite rounded-lg shadow-sm">
              <h3 className="font-display text-base font-bold uppercase text-navy mb-2 flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-blue text-white font-mono text-xs flex items-center justify-center">3</span>
                Entrega del Auto: Firma del Cliente
              </h3>
              <p className="text-xs sm:text-sm text-graphite mb-3">
                Cuando taller termina el auto, abrí la <strong>Ficha de Cierre</strong> y pedile al cliente que firme con el dedo en la pantalla para llevarse el auto:
              </p>
              <IlustracionFirmaCliente />
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* VISTA 3: GUÍA EXCLUSIVA DE TALLER (Chapistas y Sacabollos)                 */}
      {/* ========================================================================= */}
      {activeView === 'taller' && (
        <div className="space-y-6">
          <div className="p-4 bg-graphite text-white rounded-lg border-2 border-navy shadow-md">
            <h2 className="font-display text-lg uppercase tracking-wide flex items-center gap-2 mb-1">
              <Wrench className="w-5 h-5 text-amber-400" />
              Manual de Puesto: Operarios y Sacabollos (Taller)
            </h2>
            <p className="text-xs sm:text-sm font-sans text-steel-200 leading-relaxed">
              En tu pantalla solo ves los autos que ingresaron al taller. Tu función es consultar qué paneles tienen bollos, registrar el inicio de reparación, avisar con el botón rojo si falta algún repuesto, y sacar las 4 fotos finales cuando el auto está impecable.
            </p>
          </div>

          <div className="space-y-4">
            <div className="p-4 bg-white border-2 border-graphite rounded-lg shadow-sm">
              <h3 className="font-display text-base font-bold uppercase text-navy mb-2 flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-graphite text-white font-mono text-xs flex items-center justify-center">1</span>
                Consultar el Mapa de Daños antes de Empezar
              </h3>
              <p className="text-xs sm:text-sm text-graphite mb-3">
                Hacé click en la <strong>Ficha de Trabajo</strong> del auto. Vas a ver el dibujo con las zonas marcadas para saber qué partes reparar sin tener que preguntar:
              </p>
              <IlustracionMapaDanos />
            </div>

            <div className="p-4 bg-white border-2 border-graphite rounded-lg shadow-sm">
              <h3 className="font-display text-base font-bold uppercase text-navy mb-2 flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-graphite text-white font-mono text-xs flex items-center justify-center">2</span>
                ¿Falta un Repuesto? Botón de Pausa
              </h3>
              <p className="text-xs sm:text-sm text-graphite mb-3">
                Si al desarmar una puerta o paragolpes encontrás trabas rotas o falta una pieza, apretá el botón rojo <strong>"Esperando Repuesto"</strong>. Eso le avisa al dueño al instante para que compre la pieza:
              </p>
              <IlustracionTallerPDR />
            </div>

            <div className="p-4 bg-white border-2 border-graphite rounded-lg shadow-sm">
              <h3 className="font-display text-base font-bold uppercase text-navy mb-2 flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-graphite text-white font-mono text-xs flex items-center justify-center">3</span>
                Terminar el Trabajo: 4 Fotos Finales
              </h3>
              <p className="text-xs sm:text-sm text-graphite mb-3">
                Una vez reparado el vehículo, sacale las 4 fotos finales (Frente, Trasera, Laterales) con buena luz para comprobar que no quedaron imperfecciones y apretá <strong>"Listo para Firma"</strong>.
              </p>
              <IlustracionFotosObligatorias />
            </div>
          </div>
        </div>
      )}

      {/* Pie de página de la Guía */}
      <div className="mt-8 pt-6 border-t-2 border-graphite/20 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs font-mono text-steel-500">
        <span>Sistema de Gestión para Talleres • Mecánica, Carrocería y Siniestros</span>
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => {
              if (onVolver) onVolver()
              else window.location.hash = '#casos'
            }}
            className="text-blue hover:underline font-bold cursor-pointer"
          >
            ← Volver a la pantalla principal
          </button>
          <a
            href="#top"
            onClick={(e) => {
              e.preventDefault()
              window.scrollTo({ top: 0, behavior: 'smooth' })
            }}
            className="hover:text-graphite font-bold underline"
          >
            Subir al inicio ↑
          </a>
        </div>
      </div>
    </div>
  )
}
