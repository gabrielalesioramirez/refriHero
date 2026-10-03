export interface CircuitComponentInfo {
  id: string;
  name: string;
  shortName: string;
  unit: 'Unidad Exterior (Condensadora)' | 'Unidad Interior (Evaporadora)' | 'Línea de Interconexión';
  role: string;
  thermodynamicPrinciple: string;
  summerMode: {
    inletState: string;
    outletState: string;
    inletPressure: string;
    outletPressure: string;
    inletTemp: string;
    outletTemp: string;
    phaseTransformation: string;
  };
  winterMode: {
    inletState: string;
    outletState: string;
    inletPressure: string;
    outletPressure: string;
    inletTemp: string;
    outletTemp: string;
    phaseTransformation: string;
  };
  teachingPoints: string[];
  commonFailures: string[];
  color: string;
}

export const CIRCUIT_COMPONENTS: Record<string, CircuitComponentInfo> = {
  compressor: {
    id: 'compressor',
    name: 'Motocompresor Hermético (Rotativo / Scroll)',
    shortName: 'Compresor',
    unit: 'Unidad Exterior (Condensadora)',
    role: 'Corazón mecánico del sistema. Aspira vapor a baja presión y temperatura, realizando trabajo mecánico para elevarlo a alta presión y alta temperatura.',
    thermodynamicPrinciple: 'Proceso de compresión cuasi-isentrópica ($s_1 \\approx s_2$). El trabajo eléctrico aplicado se convierte en energía interna y entalpía en el fluido refrigerante.',
    summerMode: {
      inletState: 'Vapor sobrecalentado a baja presión',
      outletState: 'Gas recalentado a alta presión y alta temperatura',
      inletPressure: '118 - 125 psig (R-410A)',
      outletPressure: '360 - 390 psig (R-410A)',
      inletTemp: '8°C a 12°C',
      outletTemp: '75°C a 95°C',
      phaseTransformation: 'Gas recalentado frío ➔ Gas supercaliente a alta presión'
    },
    winterMode: {
      inletState: 'Vapor sobrecalentado a baja presión (desde serpentín exterior)',
      outletState: 'Gas supercaliente a alta presión (hacia serpentín interior)',
      inletPressure: '75 - 90 psig (R-410A en invierno)',
      outletPressure: '380 - 430 psig (R-410A en calor)',
      inletTemp: '0°C a 5°C',
      outletTemp: '85°C a 105°C',
      phaseTransformation: 'Gas frío exterior ➔ Gas muy caliente hacia consola interior'
    },
    teachingPoints: [
      'El compresor solo puede comprimir fluidos en fase gaseosa. Cualquier gota de líquido en succión genera rotura mecánica de láminas (golpe de ariete).',
      'El calor del gas de descarga no solo proviene del ambiente; incluye el calor equivalente al trabajo de compresión eléctrico ($W_{comp}$).',
      'En compresores inverter modernos, el motor síncrono BLDC modula sus RPM entre 15 Hz y 120 Hz según la demanda térmica del ambiente.'
    ],
    commonFailures: [
      'Baja compresión por desgaste o rotura de láminas flapper.',
      'Quemadura de devanado por falta de lubricación o acidez en aceite POE.',
      'Disparo de protector térmico clixon por condensador sucio o ventilador detenido.'
    ],
    color: '#ef4444'
  },

  reversing_valve: {
    id: 'reversing_valve',
    name: 'Válvula Inversora de 4 Vías (Bomba de Calor)',
    shortName: 'Válvula de 4 Vías',
    unit: 'Unidad Exterior (Condensadora)',
    role: 'Permite alternar entre Modo Verano (Refrigeración) y Modo Invierno (Calefacción) invirtiendo el sentido del flujo en los intercambiadores.',
    thermodynamicPrinciple: 'Conmutación hidroneumática asistida por electroimán piloto. La presión del propio gas desplaza un pistón de corredera de teflón para reorientar los circuitos.',
    summerMode: {
      inletState: 'Descarga del compresor (puerto superior)',
      outletState: 'Dirige gas caliente al condensador exterior; conecta succión a evaporador',
      inletPressure: '370 psig',
      outletPressure: '120 psig en retorno',
      inletTemp: '85°C',
      outletTemp: '10°C en succión',
      phaseTransformation: 'Reenvío de flujo: Exterior = Condensador | Interior = Evaporador'
    },
    winterMode: {
      inletState: 'Descarga del compresor (puerto superior)',
      outletState: 'Dirige gas caliente a la unidad interior; conecta succión al exterior',
      inletPressure: '400 psig',
      outletPressure: '80 psig en retorno',
      inletTemp: '90°C',
      outletTemp: '2°C en succión',
      phaseTransformation: 'Reenvío de flujo: Interior = Condensador | Exterior = Evaporador'
    },
    teachingPoints: [
      'La bobina solenoide (220V) solo mueve una micro-aguja piloto; el movimiento de la corredera pesada lo realiza la diferencia de presión manométrica entre alta y baja.',
      'Si el equipo no tiene diferencial de presión suficiente (> 30 psig), la corredera puede quedar trabada en el centro provocando bypass total.',
      'Al soldar este componente se debe proteger su cuerpo con trapos húmedos para no derretir los sellos internos de teflón.'
    ],
    commonFailures: [
      'Fuga interna por desgaste de sellos de teflón (bypass de gas caliente a succión).',
      'Corredera trabada a mitad de carrera por viruta de soldadura o baja presión.',
      'Bobina solenoide quemada o circuito de mando electrónico abierto.'
    ],
    color: '#8b5cf6'
  },

  condenser: {
    id: 'condenser',
    name: 'Batería Condensadora (Unidad Exterior en Frío)',
    shortName: 'Condensador',
    unit: 'Unidad Exterior (Condensadora)',
    role: 'Disipa al aire exterior el calor absorbido en la habitación más el calor generado por el trabajo del motocompresor.',
    thermodynamicPrinciple: 'Proceso de condensación isobárica ($P \\approx constante$). El fluido cede calor sensible de desrecalentamiento, calor latente de condensación y calor de subenfriamiento.',
    summerMode: {
      inletState: 'Gas sobrecalentado a alta presión y alta temperatura',
      outletState: 'Líquido subenfriado a alta presión',
      inletPressure: '370 psig',
      outletPressure: '365 psig (ligera pérdida de carga)',
      inletTemp: '85°C a 75°C',
      outletTemp: '42°C a 46°C (Subenfriamiento: 5K a 8K)',
      phaseTransformation: 'Gas recalentado ➔ Mezcla bifásica ➔ Líquido 100% puro'
    },
    winterMode: {
      inletState: 'Mezcla líquido-vapor a muy baja temperatura (actúa como Evaporador)',
      outletState: 'Vapor recalentado frío hacia succión',
      inletPressure: '80 psig',
      outletPressure: '75 psig',
      inletTemp: '-2°C a 0°C',
      outletTemp: '3°C a 6°C',
      phaseTransformation: 'En calor actúa como evaporador absorbiendo energía del aire invernal'
    },
    teachingPoints: [
      'Tres etapas fundamentales en el condensador: 1) Desrecalentamiento (primeros tubos), 2) Condensación latente (zona media a $T_{sat}$), 3) Subenfriamiento (últimos tubos).',
      'El subenfriamiento garantiza que solo ingrese 100% líquido al elemento de expansión, evitando burbujas prematuras que disminuyan el rendimiento.',
      'Un condensador sucio o con aletas dobladas eleva la temperatura de condensación y dispara el consumo eléctrico entre 2% y 3% por cada grado de incremento.'
    ],
    commonFailures: [
      'Obstrucción exterior por polvo, hojas o pelusa (disparo de presión de alta).',
      'Fuga en uniones de cobre con codos de horquilla por vibración.',
      'Fallo de ventilador exterior o capacitor de marcha desvalorizado.'
    ],
    color: '#f97316'
  },

  expansion_device: {
    id: 'expansion_device',
    name: 'Dispositivo de Expansión (Tubo Capilar / VET / EEV)',
    shortName: 'Elemento de Expansión',
    unit: 'Unidad Exterior (Condensadora)',
    role: 'Genera una brusca caída de presión en el líquido subenfriado para que comience a evaporarse a muy baja temperatura dentro del evaporador.',
    thermodynamicPrinciple: 'Proceso de laminación o estrangulamiento isoentálpico ($h_{in} = h_{out}$). No hay trabajo ni calor intercambiado con el exterior durante el paso.',
    summerMode: {
      inletState: 'Líquido subenfriado a alta presión',
      outletState: 'Mezcla líquido-vapor a baja presión y baja temperatura (Flash Gas)',
      inletPressure: '365 psig',
      outletPressure: '120 psig',
      inletTemp: '44°C',
      outletTemp: '4°C a 6°C',
      phaseTransformation: 'Líquido puro caliente ➔ Niebla bifásica fría (20% vapor flash / 80% líquido)'
    },
    winterMode: {
      inletState: 'Líquido a alta presión proveniente de la consola interior',
      outletState: 'Mezcla a muy baja presión ingresando al serpentín exterior',
      inletPressure: '390 psig',
      outletPressure: '78 psig',
      inletTemp: '40°C',
      outletTemp: '-5°C',
      phaseTransformation: 'Expansión hacia el serpentín exterior para que absorba calor del frío exterior'
    },
    teachingPoints: [
      'La caída violenta de presión produce la auto-evaporación instantánea del 15% al 25% del líquido ("flash gas"), enfriando al 80% restante a temperatura bajo cero.',
      'En sistemas mini-split convencionales el tubo capilar está ubicado en la unidad exterior para reducir el ruido de laminación dentro de la habitación.',
      'Un orificio demasiado estrecho o parcialmente obstruido crea subenfriamiento alto en condensador y succión excesivamente baja con recalentamiento alto.'
    ],
    commonFailures: [
      'Obstrucción parcial por lodos de aceite quemado o humedad congelada.',
      'Deformación mecánica por doblado o aplastamiento indebido de la tubería.',
      'Filtro de malla previo tapado por impurezas de soldadura sin nitrógeno.'
    ],
    color: '#06b6d4'
  },

  evaporator: {
    id: 'evaporator',
    name: 'Batería Evaporadora (Unidad Interior Split)',
    shortName: 'Evaporador',
    unit: 'Unidad Interior (Evaporadora)',
    role: 'Absorbe el calor del aire del recinto. El refrigerante frío hierve a baja presión y enfría el aire impulsado por la turbina tangencial.',
    thermodynamicPrinciple: 'Proceso de ebullición y sobrecalentamiento isobárico ($P \\approx constante$). El refrigerante absorbe calor latente de evaporación del ambiente.',
    summerMode: {
      inletState: 'Mezcla bifásica líquido-vapor atomizada',
      outletState: 'Vapor sobrecalentado a baja presión (Recalentamiento útil)',
      inletPressure: '120 psig',
      outletPressure: '118 psig',
      inletTemp: '5°C (ebulle a temperatura constante)',
      outletTemp: '10°C a 12°C (Recalentamiento: 5K a 7K)',
      phaseTransformation: 'Niebla líquida fría ➔ Ebullición ➔ Vapor 100% seco y recalentado'
    },
    winterMode: {
      inletState: 'Gas supercaliente a alta presión (actúa como Condensador de ambiente)',
      outletState: 'Líquido subenfriado que viaja hacia el exterior',
      inletPressure: '395 psig',
      outletPressure: '390 psig',
      inletTemp: '85°C',
      outletTemp: '38°C a 42°C',
      phaseTransformation: 'En invierno cede calor a la habitación calentando el aire a 40-50°C'
    },
    teachingPoints: [
      'El Recalentamiento ($SH = T_{succión} - T_{saturación}$) garantiza que todo el refrigerante se transforme en vapor antes de ingresar a la cañería hacia el compresor.',
      'Si los filtros de aire están tapados de polvo, no hay intercambio térmico: el refrigerante no logra hervir y sale líquido puro congelando el serpentín.',
      'La condensación de agua en la bandeja no es una falla: es la deshumidificación natural del aire húmedo al contactar el metal por debajo de su punto de rocío.'
    ],
    commonFailures: [
      'Filtros de malla y aletas colmadas de pelusa (congelamiento de serpentín).',
      'Turbina tangencial sucia o buje trabado que reduce el caudal CFM.',
      'Manguera de drenaje de condensado tapada con desborde de agua al interior.'
    ],
    color: '#3b82f6'
  },

  liquid_line: {
    id: 'liquid_line',
    name: 'Cañería de Líquido / Expansión (Línea Fina de 1/4")',
    shortName: 'Línea de Líquido',
    unit: 'Línea de Interconexión',
    role: 'Transporta el refrigerante dosificado desde la unidad exterior hacia el distribuidor de la unidad interior.',
    thermodynamicPrinciple: 'Transporte de fluido a velocidad controlada (1 a 1.5 m/s) minimizando la pérdida de carga por fricción hidráulica en el cobre.',
    summerMode: {
      inletState: 'Mezcla atomizada fría post-expansión (en mini-splits residenciales)',
      outletState: 'Ingreso directo al distribuidor del evaporador interior',
      inletPressure: '120 psig',
      outletPressure: '119 psig',
      inletTemp: '5°C',
      outletTemp: '5.5°C',
      phaseTransformation: 'Transporte en fase fría hacia la consola'
    },
    winterMode: {
      inletState: 'Líquido a alta presión proveniente de la consola interior condensadora',
      outletState: 'Retorno hacia la unidad exterior para expandirse',
      inletPressure: '390 psig',
      outletPressure: '388 psig',
      inletTemp: '40°C',
      outletTemp: '38°C',
      phaseTransformation: 'Transporte de líquido caliente hacia el exterior'
    },
    teachingPoints: [
      'En mini-splits con capilar en la unidad exterior, esta cañería ya transporta mezcla fría en expansión, por lo que DEBE ir siempre aislada térmicamente.',
      'Si se observa escarcha densa en la virola de esta cañería en modo frío, indica evaporación prematura por falta severa de gas o filtro previo obstruido.',
      'El torque de apriete en tuercas de 1/4" debe realizarse con llave dinamométrica calibrada (16 a 18 N·m) para no fisurar el cobre blando.'
    ],
    commonFailures: [
      'Virola agrietada por sobretorque en la tuerca abocinada de 1/4".',
      'Aplastamiento o estrangulamiento de la curva detrás de la unidad interior.',
      'Aislación rota o deteriorada por rayos UV que causa goteo de agua por condensación.'
    ],
    color: '#0284c7'
  },

  suction_line: {
    id: 'suction_line',
    name: 'Cañería de Gas / Succión (Línea Gruesa de 3/8" a 5/8")',
    shortName: 'Línea de Succión',
    unit: 'Línea de Interconexión',
    role: 'Conduce el vapor sobrecalentado desde la unidad interior de regreso al motocompresor para cerrar el ciclo frigorífico.',
    thermodynamicPrinciple: 'Transporte de vapor con velocidad suficiente (> 4 m/s en tramos horizontales, > 7 m/s en columnas verticales) para asegurar el arrastre continuo del aceite al cárter.',
    summerMode: {
      inletState: 'Vapor sobrecalentado a baja presión saliente del evaporador',
      outletState: 'Ingreso a la válvula de servicio de la unidad exterior',
      inletPressure: '118 psig',
      outletPressure: '116 psig',
      inletTemp: '10°C',
      outletTemp: '12°C (Recalentamiento total)',
      phaseTransformation: 'Transporte de vapor sobrecalentado garantizando arrastre de aceite'
    },
    winterMode: {
      inletState: 'Gas supercaliente a alta presión desde compresor hacia consola',
      outletState: 'Ingreso al serpentín interior para calefaccionar',
      inletPressure: '395 psig',
      outletPressure: '392 psig',
      inletTemp: '90°C',
      outletTemp: '86°C',
      phaseTransformation: 'En calor esta cañería transporta gas de descarga caliente'
    },
    teachingPoints: [
      'Debe estar rigurosamente aislada con coquilla elastomérica de mínimo 9 mm para evitar condensación parásita y calentamiento excesivo del gas.',
      'El diámetro es notablemente mayor que la línea de líquido debido al alto volumen específico del refrigerante en fase vapor ($v \\approx 0.02 - 0.04 \\text{ m}^3/\\text{kg}$).',
      'En tiradas verticales mayores a 3 metros se deben realizar sifones trampa de aceite para que el lubricante retorne gradualmente al compresor.'
    ],
    commonFailures: [
      'Microfugas en la tuerca abocinada por dilatación térmica cíclica.',
      'Retorno de líquido por falta de evaporación que lava el aceite del cárter.',
      'Aislante desintegrado por la intemperie provocando pérdida de eficiencia frigorífica.'
    ],
    color: '#2563eb'
  },

  outdoor_fan: {
    id: 'outdoor_fan',
    name: 'Forzador Axial de la Unidad Exterior',
    shortName: 'Ventilador Exterior',
    unit: 'Unidad Exterior (Condensadora)',
    role: 'Induce un flujo de aire constante a través de las aletas del serpentín exterior para maximizar la transferencia térmica por convección forzada.',
    thermodynamicPrinciple: 'Convección forzada ($q = h \\cdot A \\cdot \\Delta T_{lm}$). Aumenta drásticamente el coeficiente pelicular $h$ del aire exterior.',
    summerMode: {
      inletState: 'Aire exterior a temperatura ambiente (ej. 32°C)',
      outletState: 'Aire caliente expulsado hacia el frente (ej. 45°C)',
      inletPressure: 'Presión atmosférica normal',
      outletPressure: 'Presión atmosférica normal',
      inletTemp: '32°C ambiente',
      outletTemp: '44°C a 48°C expulsado',
      phaseTransformation: 'Evacúa al ambiente exterior entre 3,000 y 4,500 kcal/h de calor'
    },
    winterMode: {
      inletState: 'Aire frío invernal exterior (ej. 7°C)',
      outletState: 'Aire helado expulsado tras ceder calor al serpentín (ej. 2°C)',
      inletPressure: 'Presión atmosférica normal',
      outletPressure: 'Presión atmosférica normal',
      inletTemp: '7°C ambiente',
      outletTemp: '2°C (riesgo de escarcha externa)',
      phaseTransformation: 'Extrae calor del aire frío invernal para enviarlo al interior'
    },
    teachingPoints: [
      'En equipos Inverter la velocidad del motor BLDC se regula continuamente para mantener la presión de condensación estable ante variaciones de clima.',
      'Si el forzador gira a bajas RPM por capacitor defectuoso, la presión de alta se dispara rápidamente superando los 500 psig en R-410A.',
      'En invierno, cuando la temperatura exterior es baja (< 5°C), la humedad se congela en este serpentín, requiriendo ciclos periódicos de desescarche (defrost).'
    ],
    commonFailures: [
      'Capacitor permanente desvalorizado o hinchado (motor gira lento o zumba).',
      'Bujes o rodamientos desgastados con vibración y ruido estridente.',
      'Aspas plásticas desbalanceadas o fracturadas por impacto exterior.'
    ],
    color: '#eab308'
  },

  indoor_turbine: {
    id: 'indoor_turbine',
    name: 'Turbina Tangencial de Flujo Cruzado (Interior)',
    shortName: 'Turbina Interior',
    unit: 'Unidad Interior (Evaporadora)',
    role: 'Aspira el aire caliente del techo de la habitación, lo fuerza a través del serpentín evaporador y lo expulsa silenciosamente como aire climatizado.',
    thermodynamicPrinciple: 'Ventilación centrífuga tangencial de bajo nivel acústico ($< 22 \\text{ dB}$) con distribución uniforme a lo largo de toda la tobera frontal.',
    summerMode: {
      inletState: 'Aire ambiente interior caliente y húmedo (ej. 26°C / 60% HR)',
      outletState: 'Aire frío deshumidificado (ej. 11°C a 13°C / Salto térmico $\\Delta T = 13$°C)',
      inletPressure: 'Presión atmosférica interior',
      outletPressure: 'Presión atmosférica interior',
      inletTemp: '26°C retorno',
      outletTemp: '12°C inyección',
      phaseTransformation: 'Enfría el aire y condensa la humedad ambiental hacia el desagüe'
    },
    winterMode: {
      inletState: 'Aire fresco de la habitación (ej. 18°C)',
      outletState: 'Aire calefaccionado a alta temperatura (ej. 42°C a 48°C)',
      inletPressure: 'Presión atmosférica interior',
      outletPressure: 'Presión atmosférica interior',
      inletTemp: '18°C retorno',
      outletTemp: '45°C inyección',
      phaseTransformation: 'Calienta el aire mediante el calor latente cedido por el refrigerante'
    },
    teachingPoints: [
      'El salto térmico normal ($\Delta T = T_{retorno} - T_{inyección}$) debe situarse entre 12°C y 16°C en modo frío para una carga correcta.',
      'El motor PG o BLDC interior cuenta con sensor de efecto Hall que informa a la plaqueta las RPM exactas de la turbina en todo momento.',
      'Si las aspas se cubren de polvo graso, el perfil alar pierde sustentación y el caudal de aire cae hasta un 50% con soplido irregular.'
    ],
    commonFailures: [
      'Buje de goma del extremo opuesto al motor desgastado o reseco (chirrido).',
      'Aspas colmadas de moho y suciedad que reducen el caudal CFM.',
      'Falla del triac de regulación de velocidad o sensor Hall en placa electrónica.'
    ],
    color: '#059669'
  }
};
