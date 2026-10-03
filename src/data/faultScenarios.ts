import type { FaultScenario } from '../types';

export const FAULT_SCENARIOS: FaultScenario[] = [
  // CASO 1: Falta de refrigerante
  {
    id: 'undercharge-leak',
    title: 'Fuga y Falta Severa de Refrigerante',
    category: 'Carga de Refrigerante',
    difficulty: 'Básico',
    systemType: 'Mini-Split Inverter 12,000 BTU / 3000 fg',
    refrigerant: 'R-410A',
    description: 'El equipo funciona continuamente sin detenerse pero no logra acondicionar el ambiente. El flujo de aire de inyección sale a temperatura casi ambiente.',
    symptoms: {
      suctionPressure: { value: 68, unit: 'psig', status: 'Baja' },
      dischargePressure: { value: 230, unit: 'psig', status: 'Baja' },
      superheat: { value: 26.5, unit: 'K / °C', status: 'Alto' },
      subcooling: { value: 0.8, unit: 'K / °C', status: 'Bajo' },
      amperage: { value: 2.8, unit: 'A (Nom: 5.2A)', status: 'Bajo' },
      airDeltaT: { value: 4.2, unit: '°C (Nom: 12-16°C)', status: 'Bajo' },
      compressorTemp: { value: 88, unit: '°C', status: 'Alto' },
      visualNotes: [
        'Formación de escarcha densa en la válvula de servicio de líquido (caño fino exterior)',
        'Evaporador seco, sin goteo en la manguera de desagüe de condensado',
        'Aceite lubricante visible en la virola de interconexión de la unidad exterior'
      ],
      acousticNote: 'El compresor trabaja con un zumbido muy suave debido a la baja carga másica de vapor que comprime.'
    },
    options: [
      {
        id: 'opt1',
        text: 'Rellenar refrigerante en fase líquida por la toma de servicio de baja presión hasta elevar la succión a 120 psig sin presurizar con nitrógeno ni buscar fugas.',
        isCorrect: false,
        explanation: 'Incorrecto. Rellenar refrigerante sin localizar y subsanar la fuga física viola las normativas ambientales y provocará que la carga se pierda nuevamente en poco tiempo.'
      },
      {
        id: 'opt2',
        text: 'Recuperar el remanente, presurizar con nitrógeno seco a 450 psig para reparar la virola dañada, realizar evacuación profunda menor a 500 micrones y recargar por peso.',
        isCorrect: true,
        explanation: '¡Dictamen correcto! El recalentamiento alto (26.5 K) y subenfriamiento casi nulo (0.8 K) confirman falta severa de fluido originada por fuga mecánica en la unión abocinada.'
      },
      {
        id: 'opt3',
        text: 'Desoldar el dispositivo de expansión capilar por sospecha de obstrucción parcial de orificio, reemplazar el filtro deshidratador y realizar barrido con solvente.',
        isCorrect: false,
        explanation: 'Incorrecto. Si el capilar estuviera obstruido, el refrigerante quedaría retenido en el condensador arrojando un subenfriamiento alto, pero aquí el subenfriamiento es casi nulo.'
      },
      {
        id: 'opt4',
        text: 'Reemplazar el motocompresor inverter por presunción de pérdida de rendimiento volumétrico interno ante el bajo consumo eléctrico y el escaso salto térmico del equipo.',
        isCorrect: false,
        explanation: 'Incorrecto. En una falla de compresión la presión de succión se eleva y la de descarga cae; en este caso ambas presiones se encuentran caídas por falta de refrigerante.'
      }
    ],
    educationalNote: 'Regla de oro: En falta de gas, el evaporador está hambriento (Recalentamiento muy alto) y el condensador carece de reserva líquida (Subenfriamiento casi nulo).',
    technicalTheory: 'Al disminuir la masa de refrigerante en el circuito, la presión de evaporación cae. El poco líquido disponible se evapora apenas ingresa al inicio del evaporador, haciendo que el vapor recorra el resto de la tubería calentándose excesivamente (superheat alto). En el condensador no se logra acumular líquido suficiente, por lo que el subcooling cae a valores cercanos a cero.',
    recommendedSolution: '1) Conectar recuperadora y almacenar el gas remanente. 2) Presurizar con nitrógeno seco a 450 psig y aplicar solución jabonosa o detector electrónico en virolas. 3) Rehacer pestaña dañada con herramienta adecuada. 4) Prueba de estanqueidad durante 30 min. 5) Evacuación profunda con bomba de vacío de doble etapa y vacuómetro digital hasta alcanzar < 500 micrones estables. 6) Carga por peso según placa del fabricante en fase líquida utilizando balanza.'
  },

  // CASO 2: Sobrecarga de gas
  {
    id: 'overcharge',
    title: 'Exceso de Carga de Refrigerante (Sobrecarga)',
    category: 'Carga de Refrigerante',
    difficulty: 'Básico',
    systemType: 'Sistema Split 18,000 BTU / 4500 fg con capilar',
    refrigerant: 'R-410A',
    description: 'El equipo fue intervenido recientemente por un técnico que le cargó refrigerante sin balanza. El compresor se apaga por térmico a los 20 minutos en los días más calurosos.',
    symptoms: {
      suctionPressure: { value: 148, unit: 'psig (Nom: 120)', status: 'Alta' },
      dischargePressure: { value: 470, unit: 'psig (Nom: 360)', status: 'Alta' },
      superheat: { value: 2.1, unit: 'K / °C (Nom: 6-8K)', status: 'Bajo' },
      subcooling: { value: 17.5, unit: 'K / °C (Nom: 5-8K)', status: 'Alto' },
      amperage: { value: 11.8, unit: 'A (Nom: 8.2A)', status: 'Alto' },
      airDeltaT: { value: 8.5, unit: '°C', status: 'Bajo' },
      compressorTemp: { value: 96, unit: '°C', status: 'Alto' },
      visualNotes: [
        'Caño grueso de succión cubierto de abundante condensación de agua y frío al tacto hasta la entrada del compresor',
        'Aire expulsado por el condensador excesivamente caliente',
        'Vibración marcada en la base del motocompresor'
      ],
      acousticNote: 'Sonido metálico forzado en el compresor debido a la alta presión de compresión y presencia de niebla líquida en las válvulas.'
    },
    options: [
      {
        id: 'opt1',
        text: 'Realizar desincrustado químico profundo de los serpentines exterior e interior con detergente espumante alcalino para mejorar la disipación del calor sensible del refrigerante.',
        isCorrect: false,
        explanation: 'Incorrecto. Si bien un condensador sucio eleva la alta, aquí el recalentamiento está colapsado (2.1 K) y la succión está alta (148 psig), síntoma típico de sobrellenado.'
      },
      {
        id: 'opt2',
        text: 'Purgar gases incondensables acumulados por la toma de servicio de alta presión hasta atenuar las pulsaciones del manómetro y estabilizar la presión de descarga en 360 psig.',
        isCorrect: false,
        explanation: 'Incorrecto. La presencia de incondensables mantiene el recalentamiento en valores normales o altos; en este sistema el evaporador está inundado con recalentamiento excesivamente bajo.'
      },
      {
        id: 'opt3',
        text: 'Recuperar refrigerante con estación recuperadora hacia garrafa homologada hasta normalizar el subenfriamiento entre 5K y 8K y restablecer el recalentamiento sobre 6K.',
        isCorrect: true,
        explanation: '¡Dictamen correcto! El subenfriamiento elevado (17.5 K) junto con recalentamiento nulo (2.1 K) y alto consumo de corriente certifican acumulación excesiva de refrigerante.'
      },
      {
        id: 'opt4',
        text: 'Inyectar refrigerante adicional en fase líquida por la línea de baja para elevar la presión de evaporación y forzar el incremento del salto térmico en el evaporador.',
        isCorrect: false,
        explanation: 'Incorrecto. Añadir refrigerante incrementará críticamente la presión de condensación y provocará rotura inmediata de válvulas por golpe de ariete hidráulico.'
      }
    ],
    educationalNote: 'El Subenfriamiento es el indicador primordial para diagnosticar la cantidad de masa líquida en el condensador. Subcooling alto = Exceso de líquido.',
    technicalTheory: 'El refrigerante excedente no tiene espacio para alojarse y se almacena en el fondo del serpentín condensador. Esto inunda las hileras inferiores de tubos, disminuyendo la superficie útil para que el vapor condense. Al perder área efectiva de disipación, la temperatura y presión de saturación de descarga se disparan, elevando la relación de compresión y el amperaje consumido.',
    recommendedSolution: '1) Conectar manómetros y termopares en línea de líquido y succión. 2) Conectar máquina recuperadora con cilindro habilitado. 3) Retirar refrigerante lentamente en modo recuperación hasta estabilizar el Subcooling entre 5 y 7 K y verificar que el recalentamiento supere los 5 K para proteger el compresor.'
  },

  // CASO 3: Capilar tapado
  {
    id: 'clogged-capillary',
    title: 'Tubo Capilar Parcialmente Obstruido por Lodos/Ceras',
    category: 'Restricciones y Expansión',
    difficulty: 'Intermedio',
    systemType: 'Heladera / Refrigerador No-Frost Familiar',
    refrigerant: 'R-134a',
    description: 'La heladera no logra congelar en el freezer (-5°C en vez de -18°C) y el refrigerador inferior está tibio. El motocompresor funciona casi de manera ininterrumpida.',
    symptoms: {
      suctionPressure: { value: 1.5, unit: 'psig (Nom: 8-10)', status: 'Baja' },
      dischargePressure: { value: 115, unit: 'psig (Nom: 145)', status: 'Baja' },
      superheat: { value: 28.0, unit: 'K / °C', status: 'Alto' },
      subcooling: { value: 13.5, unit: 'K / °C', status: 'Alto' },
      amperage: { value: 0.75, unit: 'A (Nom: 1.2A)', status: 'Bajo' },
      airDeltaT: { value: 3.5, unit: '°C', status: 'Bajo' },
      compressorTemp: { value: 62, unit: '°C', status: 'Bajo' },
      visualNotes: [
        'Aparición de escarcha blanca localizada justo en el primer tramo del capilar antes del evaporador',
        'Filtro deshidratador a temperatura tibia pero con capilar saliente frío',
        'Evaporador parcialmente escarchado solo en las primeras curvas'
      ],
      acousticNote: 'Silbido estrangulado muy fino en el punto de ingreso al evaporador.'
    },
    options: [
      {
        id: 'opt1',
        text: 'Efectuar una recarga paulatina de gas R-134a por la toma de succión hasta elevar la presión a 10 psig y lograr la cobertura total de escarcha en el evaporador.',
        isCorrect: false,
        explanation: 'Incorrecto. La baja succión se debe a una restricción de paso; el subenfriamiento alto (13.5 K) confirma que el condensador está repleto de líquido retenido.'
      },
      {
        id: 'opt2',
        text: 'Recuperar refrigerante, sustituir el tubo capilar calibrado junto con el filtro molecular deshidratador, realizar barrido con nitrógeno y vacío profundo a 250 micrones.',
        isCorrect: true,
        explanation: '¡Dictamen correcto! El subcooling elevado (13.5 K) sumado a succión cercana a vacío y recalentamiento alto (28 K) delata que el líquido no puede cruzar el capilar.'
      },
      {
        id: 'opt3',
        text: 'Sustituir el motocompresor reciprocante hermético por presunción de pérdida de estanqueidad en las válvulas de descarga y degradación del rendimiento volumétrico.',
        isCorrect: false,
        explanation: 'Incorrecto. Si las válvulas del compresor estuviesen dañadas, la succión estaría elevada y la descarga deprimida; aquí la succión se desploma a 1.5 psig.'
      },
      {
        id: 'opt4',
        text: 'Inyectar agente deshidratante metílico al circuito para fluidificar parafinas y aplicar choque térmico directo sobre el tubo capilar durante el funcionamiento.',
        isCorrect: false,
        explanation: 'Incorrecto. El uso de solventes o alcoholes metílicos deteriora el barniz dieléctrico del bobinado, acidifica el aceite y no remueve ceras o lodos sólidos carbonizados.'
      }
    ],
    educationalNote: 'Diferencia clave entre falta de gas y capilar tapado: en falta de gas el Subcooling es BAJO; con capilar tapado el Subcooling es ALTO (líquido retenido en el condensador).',
    technicalTheory: 'El tubo capilar restringe el caudal másico por fricción en su longitud calibrada. Si residuos de aceite degradado, barnices del motor o humedad taponan parcialmente el orificio interno, el flujo másico se desploma. El refrigerante no puede pasar al evaporador y se acumula en el condensador (subcooling alto), mientras que el evaporador queda hambriento y la succión cae hacia el vacío.',
    recommendedSolution: '1) Cortar el circuito con corta-capilar especial (evitar aplastamiento). 2) Desechar filtro secador y capilar viejo. 3) Realizar barrido con R-141b / solvente dieléctrico ecológico y nitrógeno en ambos serpentines. 4) Soldar filtro molecular con silica gel virgen y tubo capilar nuevo de idéntica longitud y diámetro interior. 5) Vacío profundo < 250 micrones y carga en fase líquida por balanza según placa (gramos exactos).'
  },

  // CASO 4: Filtros sucios / flujo de aire interior
  {
    id: 'dirty-air-filters',
    title: 'Filtros de Aire y Serpentín Evaporador Tapados de Suciedad',
    category: 'Flujo de Aire y Suciedad',
    difficulty: 'Básico',
    systemType: 'Mini-Split On/Off 18,000 BTU / 4500 fg',
    refrigerant: 'R-410A',
    description: 'El usuario se queja de que el equipo gotea agua por el panel frontal y sopla muy poco caudal de aire. Se observan bloques de hielo formados en la consola interior.',
    symptoms: {
      suctionPressure: { value: 82, unit: 'psig (Nom: 120)', status: 'Baja' },
      dischargePressure: { value: 275, unit: 'psig (Nom: 350)', status: 'Baja' },
      superheat: { value: 1.5, unit: 'K / °C (Nom: 6-8K)', status: 'Bajo' },
      subcooling: { value: 4.8, unit: 'K / °C', status: 'Normal' },
      amperage: { value: 6.2, unit: 'A (Nom: 7.8A)', status: 'Bajo' },
      airDeltaT: { value: 18.5, unit: '°C (Aire sale helado pero poco volumen)', status: 'Alto' },
      compressorTemp: { value: 54, unit: '°C', status: 'Bajo' },
      visualNotes: [
        'Malla de filtros plásticos interiores tapizada de polvo y pelusa densa',
        'Turbina tangencial con aspas colmadas de suciedad que impiden impulsar aire',
        'Serpentín evaporador congelado con escarcha desde el centro hacia la salida'
      ],
      acousticNote: 'Ruido ahogado del ventilador interior, con zumbido de esfuerzo aerodinámico.'
    },
    options: [
      {
        id: 'opt1',
        text: 'Descongelar la unidad interior, limpiar profundamente los filtros de aire y desengrasar la turbina tangencial y serpentín para restablecer el caudal volumétrico CFM.',
        isCorrect: true,
        explanation: '¡Dictamen correcto! El bajo caudal de aire impide la transferencia térmica: el líquido no logra hervir, provocando recalentamiento mínimo (1.5 K) y congelamiento.'
      },
      {
        id: 'opt2',
        text: 'Cargar refrigerante R-410A en fase líquida por la toma de servicio de baja hasta alcanzar 120 psig y compensar el escarchamiento visible del serpentín interior.',
        isCorrect: false,
        explanation: 'Incorrecto. El congelamiento por falta de flujo de aire no se soluciona cargando gas; hacerlo sobrecargará masivamente el sistema enviando líquido puro al motocompresor.'
      },
      {
        id: 'opt3',
        text: 'Sustituir el elemento de expansión y el filtro secador por presunción de laminación prematura e insuficiente alimentación de fluido al distribuidor del evaporador.',
        isCorrect: false,
        explanation: 'Incorrecto. Una restricción en el elemento de expansión generaría un recalentamiento muy alto; aquí el recalentamiento es de apenas 1.5 K debido a la falta de carga térmica.'
      },
      {
        id: 'opt4',
        text: 'Reemplazar el capacitor permanente del forzador interior y la placa de control por sospecha de caída de tensión en el devanado auxiliar del motor ventilador.',
        isCorrect: false,
        explanation: 'Incorrecto. El motor y la placa operan correctamente; la causa del estrangulamiento de aire es la acumulación física de suciedad en filtros y álabe de turbina.'
      }
    ],
    educationalNote: 'El Recalentamiento BAJO (< 3K) en conjunto con baja presión indica que el líquido no logra hervir por falta de carga térmica en el evaporador.',
    technicalTheory: 'El evaporador requiere un caudal constante de aire cálido del recinto para ceder calor al refrigerante. Cuando los filtros o la turbina se cubren de polvo, el caudal CFM cae drásticamente. El refrigerante no encuentra calor que absorber, por lo que su temperatura y presión de saturación caen por debajo de los 0°C. La humedad del aire se congela sobre el metal, creando una capa aislante de hielo que empeora progresivamente el ciclo hasta enviar refrigerante líquido puro al compresor.',
    recommendedSolution: '1) Desconectar la unidad de la red eléctrica. 2) Desmontar carcasa y filtros plásticos. 3) Aplicar limpiador espumante para serpentines y enjuagar con pulverizadora a baja presión cuidando la electrónica. 4) Limpiar las aspas de la turbina tangencial. 5) Verificar drenaje libre de obstrucciones. 6) Reencender y constatar presión de baja normalizada (~120 psig para R-410A) y salto térmico adecuado (12°C a 15°C).'
  },

  // CASO 5: Condensador sucio
  {
    id: 'dirty-condenser',
    title: 'Condensador Exterior Obstruido por Suciedad o Pelusa',
    category: 'Flujo de Aire y Suciedad',
    difficulty: 'Básico',
    systemType: 'Sistema Central 36,000 BTU / 9000 fg (3 TR)',
    refrigerant: 'R-410A',
    description: 'En las horas centrales de la tarde el equipo corta intempestivamente. La unidad exterior se encuentra instalada en una terraza expuesta a pelusa de árboles y hollín.',
    symptoms: {
      suctionPressure: { value: 145, unit: 'psig (Nom: 120)', status: 'Alta' },
      dischargePressure: { value: 510, unit: 'psig (Nom: 370)', status: 'Alta' },
      superheat: { value: 7.0, unit: 'K / °C', status: 'Normal' },
      subcooling: { value: 16.5, unit: 'K / °C', status: 'Alto' },
      amperage: { value: 21.0, unit: 'A (Nom: 15.5A)', status: 'Alto' },
      airDeltaT: { value: 7.2, unit: '°C', status: 'Bajo' },
      compressorTemp: { value: 104, unit: '°C (Al límite de corte)', status: 'Alto' },
      visualNotes: [
        'Aletas de aluminio del condensador tapadas con un fieltro espeso de suciedad',
        'Aire expulsado hacia arriba por el forzador exterior a temperatura quemante',
        'Carcasa del compresor intocable (>100°C)'
      ],
      acousticNote: 'Compresor emitiendo un sonido grave y forzado, con corte violento al abrirse el protector térmico interno.'
    },
    options: [
      {
        id: 'opt1',
        text: 'Descargar refrigerante hacia la unidad de recuperación hasta reducir la presión manométrica de alta a 370 psig y estabilizar la corriente de consumo del compresor.',
        isCorrect: false,
        explanation: 'Incorrecto. Retirar refrigerante sin limpiar el condensador dejará al sistema severamente falto de gas una vez que el serpentín sea higienizado, recalentando el motor.'
      },
      {
        id: 'opt2',
        text: 'Sustituir la válvula inversora de cuatro vías por sospecha de fuga interna de corredera que provoca recalentamiento masivo y sobrepresión en la línea de alta.',
        isCorrect: false,
        explanation: 'Incorrecto. La fuga en la válvula inversora comunica la alta con la baja provocando succión elevada con descarga deprimida; aquí la condensación está en 510 psig.'
      },
      {
        id: 'opt3',
        text: 'Reemplazar el motor forzador del condensador exterior y su capacitor por considerar que la sobrepresión responde a insuficientes revoluciones en el intercambio térmico.',
        isCorrect: false,
        explanation: 'Incorrecto. Las RPM y el flujo de ventilador son normales; el impedimento de intercambio térmico proviene de la capa física de polvo y pelusa en las aletas.'
      },
      {
        id: 'opt4',
        text: 'Desenergizar la unidad exterior y lavar a contrapresión el serpentín con detergente desengrasante biodegradable específico para disipar la saturación térmica del condensador.',
        isCorrect: true,
        explanation: '¡Dictamen correcto! Al remover el fieltro de suciedad de las aletas de aluminio, el condensador recupera su coeficiente de transferencia y las presiones bajan a valores nominales.'
      }
    ],
    educationalNote: 'Un condensador sucio eleva la temperatura de condensación. Por cada 1°C que sube la condensación, el consumo eléctrico del compresor se incrementa entre 2% y 3%.',
    technicalTheory: 'La condensación es el proceso de transferir al ambiente el calor absorbido en el evaporador más el calor generado por la compresión mecánica. Al bloquearse las aletas del serpentín exterior, el coeficiente de transferencia U cae. Para poder transferir calor con menor área disponible, el refrigerante se ve forzado a elevar su temperatura y presión de saturación. Esta sobrepresión eleva el consumo del motor hasta el punto de disparo térmico.',
    recommendedSolution: '1) Desenergizar la unidad exterior y bloquear disyuntor. 2) Retirar la rejilla superior y motor del forzador si es accesible. 3) Aplicar producto desengrasante alcalino diluido específico para aluminio (evitar corrosión). 4) Dejar actuar 10 minutos y enjuagar con manguera o hidrolavadora a baja presión con chorro plano paralelo a las aletas para no doblarlas. 5) Verificar peinado de aletas dobladas con peine metálico.'
  },

  // CASO 6: Baja compresión / válvulas rotas
  {
    id: 'low-compression',
    title: 'Baja Compresión Mecánica / Válvulas Flapper Desgastadas',
    category: 'Compresión y Mecánica',
    difficulty: 'Avanzado',
    systemType: 'Equipo Piso-Techo 36,000 BTU / 3 TR',
    refrigerant: 'R-22',
    description: 'El compresor funciona ininterrumpidamente sin enfriar. Al colocar manómetros, el técnico nota que casi no hay diferencia entre la presión de alta y la de baja.',
    symptoms: {
      suctionPressure: { value: 102, unit: 'psig (Nom: 65)', status: 'Alta' },
      dischargePressure: { value: 160, unit: 'psig (Nom: 260)', status: 'Baja' },
      superheat: { value: 22.0, unit: 'K / °C', status: 'Alto' },
      subcooling: { value: 1.5, unit: 'K / °C', status: 'Bajo' },
      amperage: { value: 6.5, unit: 'A (Nom: 16.0A)', status: 'Bajo' },
      airDeltaT: { value: 1.5, unit: '°C (Sin enfriamiento)', status: 'Bajo' },
      compressorTemp: { value: 72, unit: '°C', status: 'Normal' },
      visualNotes: [
        'Caño de descarga del compresor apenas tibio en lugar de estar caliente (>70°C)',
        'Salto térmico de aire prácticamente cero en la unidad interior',
        'Al apagar el equipo, las presiones de alta y baja se ecualizan en cuestión de 2 segundos'
      ],
      acousticNote: 'El compresor gira muy liviano, con un sonido hueco y silencioso, sin el esfuerzo característico de bombear gas.'
    },
    options: [
      {
        id: 'opt1',
        text: 'Cargar refrigerante R-22 por la toma de servicio de alta presión hasta restablecer la presión de condensación nominal de 260 psig y equilibrar el ciclo térmico.',
        isCorrect: false,
        explanation: 'Incorrecto. La succión ya se encuentra excesivamente alta (102 psig); agregar refrigerante empeorará la sobrepresión de baja sin crear compresión efectiva.'
      },
      {
        id: 'opt2',
        text: 'Sustituir la válvula de expansión termostática por presunción de descalibración interna que mantiene la tobera abierta e inunda la línea de succión del equipo.',
        isCorrect: false,
        explanation: 'Incorrecto. Una VET trabada abierta causaría un recalentamiento colapsado cercano a 0 K; en este caso el recalentamiento es de 22 K con amperaje muy por debajo de placa.'
      },
      {
        id: 'opt3',
        text: 'Reemplazar el motocompresor por pérdida irreversible de rendimiento volumétrico en válvulas flapper, confirmada por baja compresión, bajo consumo y ecualización inmediata.',
        isCorrect: true,
        explanation: '¡Dictamen correcto! Succión anormalmente alta (102 psig) combinada con descarga baja (160 psig), bajo amperaje y ecualización en 2 segundos es la firma de válvulas dañadas.'
      },
      {
        id: 'opt4',
        text: 'Efectuar purga de incondensables en el domo superior del condensador asumiendo que la falta de compresión diferencial se debe a acumulación de nitrógeno u oxígeno.',
        isCorrect: false,
        explanation: 'Incorrecto. La presencia de incondensables elevaría bruscamente la presión de condensación por encima de lo normal; aquí la descarga está deprimida en 160 psig.'
      }
    ],
    educationalNote: 'Diagnóstico diferencial: Cuando la succión está ALTA y la descarga está BAJA con bajo consumo de corriente, el compresor no está comprimiendo (bypass interno).',
    technicalTheory: 'En un compresor reciprocante o scroll, las válvulas de lengüeta (flapper valves) impiden que el gas comprimido retorne al cilindro o a la cámara de baja. Si se fisuran, deforman por recalentamiento o sufren desgaste, el gas a alta presión recircula internamente hacia la cámara de succión. La relación de compresión cae a valores mínimos (1.5:1), el compresor no realiza trabajo mecánico real y el consumo eléctrico se desploma.',
    recommendedSolution: '1) Realizar prueba de estanqueidad de válvulas: apagar el compresor y observar la velocidad de ecualización manométrica (si ecualiza al instante, las válvulas no retienen). 2) Proceder a la recuperación de refrigerante. 3) Desoldar y retirar el compresor dañado. 4) Limpieza del circuito con solvente si hubo recalentamiento. 5) Instalar nuevo motocompresor con aceite compatible. 6) Cambio de filtro secador, vacío a < 500 micrones y carga por peso.'
  },

  // CASO 7: Humedad en el circuito
  {
    id: 'moisture-freezing',
    title: 'Humedad en el Circuito: Congelamiento Cíclico en la Expansión',
    category: 'Contaminación y Vacío',
    difficulty: 'Intermedio',
    systemType: 'Freezer / Congelador Comercial de Pozos',
    refrigerant: 'R-134a',
    description: 'El congelador arranca normalmente, enfría muy bien durante 15 a 20 minutos, pero repentinamente la presión de baja cae a vacío total y deja de enfriar. Si se lo apaga 10 minutos, vuelve a funcionar y repite el ciclo.',
    symptoms: {
      suctionPressure: { value: -10, unit: 'inHg (Vacío total)', status: 'Baja' },
      dischargePressure: { value: 85, unit: 'psig', status: 'Baja' },
      superheat: { value: 35.0, unit: 'K / °C', status: 'Alto' },
      subcooling: { value: 14.0, unit: 'K / °C', status: 'Alto' },
      amperage: { value: 0.65, unit: 'A (Nom: 1.4A)', status: 'Bajo' },
      airDeltaT: { value: 0.5, unit: '°C (Ciclo bloqueado)', status: 'Bajo' },
      compressorTemp: { value: 58, unit: '°C', status: 'Bajo' },
      visualNotes: [
        'Al aplicar calor con pistola térmica o trapo tibio sobre el ingreso del capilar, la aguja de baja salta instantáneamente a 15 psig y el gas comienza a fluir',
        'Aceite en el visor de servicio con leve tonalidad turbia',
        'Condensador se enfría por completo al detenerse la circulación'
      ],
      acousticNote: 'El flujo de expansión se detiene en seco con un chasquido fino al formarse el tapón de hielo.'
    },
    options: [
      {
        id: 'opt1',
        text: 'Inyectar alcohol metílico deshidratante por la succión para descender el punto de congelación del agua y fluidificar el tapón formado en el orificio capilar.',
        isCorrect: false,
        explanation: 'Incorrecto. El uso de metanol está estrictamente contraindicado: reacciona con la humedad generando ácidos, degrada el esmalte de las bobinas y causa quemadura hermética.'
      },
      {
        id: 'opt2',
        text: 'Calibrar el tornillo diferencial del presostato de baja y reajustar el termostato de temperatura del gabinete por sospecha de disparo falso en el circuito de control.',
        isCorrect: false,
        explanation: 'Incorrecto. La caída de presión a vacío es un bloqueo físico-hidráulico comprobable: al calentar externamente el capilar, el flujo de refrigerante se restablece al instante.'
      },
      {
        id: 'opt3',
        text: 'Recuperar refrigerante, sustituir filtro con tamiz molecular deshidratante de alta retención, realizar triple evacuación profunda a 250 micrones y recargar gas seco.',
        isCorrect: true,
        explanation: '¡Dictamen correcto! El síntoma de funcionamiento normal durante 20 minutos seguido de caída a vacío que remite al calentar el capilar es la firma típica de humedad congelada.'
      },
      {
        id: 'opt4',
        text: 'Sustituir el tubo capilar por uno de mayor sección interna para reducir la pérdida de carga y evitar que la expansión térmica alcance temperaturas bajo cero.',
        isCorrect: false,
        explanation: 'Incorrecto. El capilar original está correctamente dimensionado para la aplicación; alterar su calibre modificará la temperatura de diseño sin eliminar el agua del circuito.'
      }
    ],
    educationalNote: 'El síntoma de "enfría un rato, se va a vacío, se apaga, se derrite el tapón y vuelve a enfriar" es la firma indiscutible de humedad congelándose en el orificio restrictor.',
    technicalTheory: 'El agua es prácticamente insoluble en los refrigerantes modernos a bajas temperaturas. Al atravesar el elemento de expansión, la temperatura del refrigerante desciende bruscamente por debajo de los 0°C. La humedad libre en el fluido se separa y se congela instantáneamente en la tobera más estrecha, formando un tapón de hielo sólido que bloquea el paso del líquido. Al apagar el equipo, la temperatura se eleva, el hielo se funde y el ciclo se reinicia erráticamente.',
    recommendedSolution: '1) Recuperar el refrigerante (no reutilizar por contaminación ácida potencial). 2) Desoldar filtro saturado. 3) Barrido con nitrógeno ultra seco (OFDN) calentando suavemente las cañerías para evaporar humedad interna. 4) Soldar filtro secador de primera marca con 100% tamiz molecular compatible con R-134a/POE. 5) Triple vacío: evacuar a 1000 micrones, romper con nitrógeno a 5 psig, volver a evacuar a 500 micrones y finalmente alcanzar < 250 micrones con test de retención de 15 minutos sin elevación. 6) Recarga de gas virgen seco.'
  },

  // CASO 8: Incondensables
  {
    id: 'non-condensables',
    title: 'Presencia de Incondensables (Aire y Humedad) por Falta de Vacío',
    category: 'Contaminación y Vacío',
    difficulty: 'Intermedio',
    systemType: 'Split Residencial 12,000 BTU / 3000 fg',
    refrigerant: 'R-410A',
    description: 'Instalación nueva donde el instalador realizó "barrido" o purga con el propio gas en lugar de utilizar bomba de vacío y vacuómetro. El equipo no rinde y vibra intensamente.',
    symptoms: {
      suctionPressure: { value: 125, unit: 'psig (Nom: 118)', status: 'Normal' },
      dischargePressure: { value: 450, unit: 'psig (Nom: 350)', status: 'Alta' },
      superheat: { value: 7.5, unit: 'K / °C', status: 'Normal' },
      subcooling: { value: 14.5, unit: 'K / °C', status: 'Alto' },
      amperage: { value: 8.9, unit: 'A (Nom: 5.4A)', status: 'Alto' },
      airDeltaT: { value: 8.0, unit: '°C (Nom: 12-16°C)', status: 'Bajo' },
      compressorTemp: { value: 98, unit: '°C', status: 'Alto' },
      visualNotes: [
        'La aguja del manómetro de alta oscila y vibra con trepidación constante de ± 15 psig',
        'Consumo de energía disparado en la pinza amperométrica',
        'Temperatura de descarga excesiva en la salida del compresor'
      ],
      acousticNote: 'Vibración y ruido seco en la cabeza del motocompresor por sobrecompresión de gases no condensables.'
    },
    options: [
      {
        id: 'opt1',
        text: 'Realizar desincrustado hidroneumático de aletas del condensador e incrementar las RPM del ventilador exterior para contrarrestar la sobrepresión térmica en la descarga.',
        isCorrect: false,
        explanation: 'Incorrecto. La oscilación rápida de la aguja del manómetro (±15 psig) no responde a suciedad exterior, sino a presiones parciales de gases que no condensan.'
      },
      {
        id: 'opt2',
        text: 'Recuperar la totalidad del fluido contaminado, renovar el filtro secador, efectuar vacío profundo por debajo de 250 micrones con vacuómetro digital y recargar gas virgen.',
        isCorrect: true,
        explanation: '¡Dictamen correcto! Siguiendo la Ley de Dalton, el aire no condensable suma presión a la descarga y produce trepidación de aguja manométrica, requiriendo evacuación total.'
      },
      {
        id: 'opt3',
        text: 'Efectuar purga manual por la válvula de servicio de la línea de líquido con el compresor apagado para expulsar el exceso de presión acumulado en el condensador.',
        isCorrect: false,
        explanation: 'Incorrecto. Los gases incondensables se acumulan en la parte superior del serpentín condensador en fase vapor; purgar por la línea de líquido solo expulsará refrigerante útil.'
      },
      {
        id: 'opt4',
        text: 'Extraer refrigerante en fase líquida por la toma de succión hasta lograr que el consumo de corriente descienda a los 5.4A nominales fijados por el fabricante.',
        isCorrect: false,
        explanation: 'Incorrecto. Extraer fluido sin hacer vacío no eliminará el aire atrapado en el circuito y dejará al equipo operando con falta severa de refrigerante.'
      }
    ],
    educationalNote: 'Aguja de manómetro de alta vibrando o temblando fuertemente + sobrepresión de condensación = Signo clásico de aire e incondensables en el circuito.',
    technicalTheory: 'Según la Ley de presiones parciales de Dalton, en una mezcla de gases la presión total ejercida es igual a la suma de las presiones que ejercería cada gas por separado ($P_{total} = P_{ref} + P_{aire}$). El aire (nitrógeno + oxígeno) tiene una temperatura crítica extremadamente baja ($-140^\circ\text{C}$), por lo que no se condensa en el serpentín exterior, acumulándose en la parte superior y restando superficie al refrigerante, además de elevar la presión total.',
    recommendedSolution: '1) Recuperar todo el refrigerante a un cilindro de descarte (no apto para reutilización). 2) Reemplazar filtro secador. 3) Realizar vacío profundo con bomba de doble etapa acoplada con mangueras cortas de 3/8" y vacuómetro digital. 4) Alcanzar una lectura inferior a 250 micrones y verificar estabilidad (standing test) durante 15 minutos sin subir de 500 micrones. 5) Cargar refrigerante virgen por balanza electrónica en fase líquida.'
  },

  // CASO 9: VET trabada cerrada
  {
    id: 'txv-stuck-closed',
    title: 'Válvula de Expansión Termostática (VET) Bloqueada en Cerrado',
    category: 'Restricciones y Expansión',
    difficulty: 'Intermedio',
    systemType: 'Cámara Frigorífica de Conservación de Carnes (0°C)',
    refrigerant: 'R-404A',
    description: 'La cámara no baja de 12°C. El compresor arranca pero a los 30 segundos corta por la actuación del presostato de baja presión.',
    symptoms: {
      suctionPressure: { value: 3, unit: 'psig (Nom: 42)', status: 'Baja' },
      dischargePressure: { value: 165, unit: 'psig (Nom: 245)', status: 'Baja' },
      superheat: { value: 34.0, unit: 'K / °C', status: 'Alto' },
      subcooling: { value: 15.0, unit: 'K / °C', status: 'Alto' },
      amperage: { value: 3.8, unit: 'A (Nom: 8.5A)', status: 'Bajo' },
      airDeltaT: { value: 1.0, unit: '°C', status: 'Bajo' },
      compressorTemp: { value: 55, unit: '°C', status: 'Bajo' },
      visualNotes: [
        'Cuerpo de la VET cubierto de escarcha blanca inmediatamente después del asiento de la aguja',
        'Visor de líquido transparente y lleno de refrigerante líquido antes de la VET',
        'Serpentín evaporador totalmente desprovisto de escarcha o frío'
      ],
      acousticNote: 'Ciclado repetitivo del presostato electromecánico de baja con clics constantes.'
    },
    options: [
      {
        id: 'opt1',
        text: 'Efectuar recarga progresiva de gas R-404A en fase líquida por el tubo recibidor para elevar la presión de evaporación y evitar el corte cíclico por presostato de baja.',
        isCorrect: false,
        explanation: 'Incorrecto. El visor antes de la VET está totalmente lleno de líquido y el subenfriamiento es de 15 K; agregar fluido no abrirá una válvula mecánicamente bloqueada.'
      },
      {
        id: 'opt2',
        text: 'Comprobar la pérdida de fluido motriz en el tren termostático del bulbo sensor y sustituir el elemento de potencia o el cuerpo de la VET tras realizar pump down.',
        isCorrect: true,
        explanation: '¡Dictamen correcto! El visor lleno de líquido junto a subenfriamiento alto (15 K), recalentamiento desmedido (34 K) y vacío rápido certifican una VET que no abre.'
      },
      {
        id: 'opt3',
        text: 'Modificar el diferencial de corte del presostato de baja presión y puentear sus terminales eléctricos para impedir la desconexión del contactor de potencia.',
        isCorrect: false,
        explanation: 'Incorrecto. Anular o puentear la protección de baja forzará al motocompresor a operar en vacío continuo, provocando sobrecalentamiento interno y arco en bornes herméticos.'
      },
      {
        id: 'opt4',
        text: 'Sustituir los motores forzadores del evaporador por presunción de baja velocidad aerodinámica que genera acumulación prematura de escarcha en el cuerpo de la válvula.',
        isCorrect: false,
        explanation: 'Incorrecto. Una falla de forzadores evaporadores causaría recalentamiento nulo (0 K) por falta de ebullición; en este caso el recalentamiento es sumamente alto (34 K).'
      }
    ],
    educationalNote: 'El visor de líquido lleno de líquido antes de la VET junto con Recalentamiento altísimo y corte por baja es la combinación inequívoca de VET cerrada.',
    technicalTheory: 'La VET opera mediante el balance de tres fuerzas: la presión del bulbo ($P_1$) que intenta abrir la válvula, contra la presión de evaporación ($P_2$) y la fuerza del resorte ($P_3$) que intentan cerrarla ($P_1 = P_2 + P_3$). Si el capilar del bulbo sensor sufre una microfisura y pierde su fluido de potencia, $P_1$ se reduce a cero; consecuentemente, el resorte $P_3$ cierra la aguja contra el orificio impidiendo la inyección de refrigerante.',
    recommendedSolution: '1) Realizar prueba de calor: calentar el bulbo con la mano (si la presión no responde, el tren termostático está descargado). 2) Bombear refrigerante hacia el tubo recibidor de líquido (pump down). 3) Desmontar el elemento de poder o la VET completa. 4) Limpiar filtro de malla de entrada. 5) Instalar nueva VET calibrada según la capacidad en TR de la cámara. 6) Evacuar la sección intervenida, abrir válvulas y ajustar recalentamiento de operación (6 a 8 K).'
  },

  // CASO 10: Bulbo de VET suelto
  {
    id: 'txv-bulb-loose',
    title: 'Bulbo Sensor de VET Desprendido o Sin Aislación Térmica',
    category: 'Restricciones y Expansión',
    difficulty: 'Intermedio',
    systemType: 'Enfriadora de Líquido / Chiller 10 TR',
    refrigerant: 'R-404A',
    description: 'La unidad presenta condensación copiosa de humedad y escarcha en toda la cañería de succión hasta el propio cárter del motocompresor. Hay riesgo de daño mecánico inminente.',
    symptoms: {
      suctionPressure: { value: 65, unit: 'psig (Nom: 45)', status: 'Alta' },
      dischargePressure: { value: 240, unit: 'psig (Nom: 235)', status: 'Normal' },
      superheat: { value: 0.5, unit: 'K / °C (Nom: 6-8K)', status: 'Bajo' },
      subcooling: { value: 5.5, unit: 'K / °C', status: 'Normal' },
      amperage: { value: 19.5, unit: 'A (Nom: 18.0A)', status: 'Alto' },
      airDeltaT: { value: 9.0, unit: '°C', status: 'Normal' },
      compressorTemp: { value: 32, unit: '°C (Muy frío / sudando)', status: 'Bajo' },
      visualNotes: [
        'El bulbo sensor de la VET se encuentra colgando suelto en el aire del recinto o desprovisto de aislación elastomérica',
        'Caño de retorno de succión completamente blanco de escarcha hasta la boca de entrada del compresor',
        'Cárter del compresor transpirado y frío al tacto'
      ],
      acousticNote: 'Golpeteo hidráulico amortiguado periódico en los pistones del compresor por presencia de líquido en la compresión.'
    },
    options: [
      {
        id: 'opt1',
        text: 'Cargar refrigerante adicional por la toma de servicio de baja asumiendo que la escarcha visible en el caño de succión hasta el compresor evidencia falta de fluido.',
        isCorrect: false,
        explanation: 'Incorrecto. La escarcha en la succión con recalentamiento casi nulo (0.5 K) indica retorno de refrigerante líquido; cargar gas causará rotura por golpe de ariete.'
      },
      {
        id: 'opt2',
        text: 'Girar a fondo el vástago de ajuste del resorte de recalentamiento estático de la VET para forzar el cierre de la tobera sin necesidad de reposicionar el bulbo.',
        isCorrect: false,
        explanation: 'Incorrecto. La presión generada en el bulbo al censar aire ambiente a 25°C supera ampliamente la fuerza máxima que puede ejercer el resorte interno de calibración.'
      },
      {
        id: 'opt3',
        text: 'Recuperar refrigerante y sustituir el cuerpo completo de la VET por presunción de rotura en el vástago interno y filtración incontrolada hacia el serpentín evaporador.',
        isCorrect: false,
        explanation: 'Incorrecto. La válvula no presenta daño interno mecánico; la anomalía es de sensado térmico externo provocada por el desprendimiento del bulbo sensor.'
      },
      {
        id: 'opt4',
        text: 'Limpiar el caño de succión, fijar el bulbo sensor con abrazadera metálica en posición horaria adecuada y forrarlo con aislación elastomérica de celda cerrada.',
        isCorrect: true,
        explanation: '¡Dictamen correcto! Al estar suelto, el bulbo capta calor ambiente e incrementa la presión de apertura, inundando el evaporador y enviando líquido al cárter.'
      }
    ],
    educationalNote: 'El bulbo de la VET debe sentir ÚNICAMENTE la temperatura del tubo de succión, NUNCA el aire exterior. Si se suelta, inunda el compresor de refrigerante líquido.',
    technicalTheory: 'El bulbo de la VET censa la temperatura a la salida del evaporador para regular el recalentamiento. Si el bulbo se desprende de la tubería de cobre o pierde su coquilla de aislación térmica, queda en contacto con el aire ambiente cálido (25°C a 30°C). El gas dentro del bulbo se sobrecalienta, generando una presión $P_1$ muy superior a la normal, forzando a la aguja de la válvula a abrirse al máximo. Esto inunda el evaporador y envía refrigerante en fase líquida directo al compresor.',
    recommendedSolution: '1) Apagar de inmediato el compresor para evitar rotura de bielas/flappers. 2) Limpiar la superficie del caño de succión con lija fina. 3) Montar el bulbo firmemente con su abrazadera metálica (posición horaria 2 o 4 en caños de 7/8" o mayores para no censar el aceite del fondo). 4) Forrar completamente el bulbo y su entorno con cinta o aislante elastomérico de celda cerrada (tipo Armaflex). 5) Reencender y verificar que el recalentamiento retorne a valores seguros (6 a 8 K).'
  },

  // CASO 11: Filtro secador tapado
  {
    id: 'filter-drier-clogged',
    title: 'Filtro Deshidratador Parcialmente Obstruido',
    category: 'Restricciones y Expansión',
    difficulty: 'Intermedio',
    systemType: 'Sistema Split Comercial 24,000 BTU / 6000 fg',
    refrigerant: 'R-410A',
    description: 'El equipo pierde rendimiento térmico. Al inspeccionar la línea de líquido exterior, se observa condensación de gotas de agua sobre el cuerpo del filtro secador.',
    symptoms: {
      suctionPressure: { value: 92, unit: 'psig (Nom: 120)', status: 'Baja' },
      dischargePressure: { value: 310, unit: 'psig (Nom: 360)', status: 'Baja' },
      superheat: { value: 16.5, unit: 'K / °C', status: 'Alto' },
      subcooling: { value: 14.0, unit: 'K / °C (Antes del filtro)', status: 'Alto' },
      amperage: { value: 6.8, unit: 'A (Nom: 10.2A)', status: 'Bajo' },
      airDeltaT: { value: 7.5, unit: '°C', status: 'Bajo' },
      compressorTemp: { value: 78, unit: '°C', status: 'Normal' },
      visualNotes: [
        'Diferencia de temperatura táctil apreciable entre la entrada y salida del filtro secador (ΔT > 3°C)',
        'Salida del filtro húmeda y fría con formación incipiente de rocío',
        'Burbujas continuas visibles en el visor de líquido posterior al filtro'
      ],
      acousticNote: 'Siseo perceptible dentro del cuerpo del filtro deshidratador debido a la caída de presión forzada.'
    },
    options: [
      {
        id: 'opt1',
        text: 'Cargar refrigerante R-410A por la toma de baja interpretando que las burbujas visibles en el visor de líquido y la baja succión señalan pérdida de refrigerante.',
        isCorrect: false,
        explanation: 'Incorrecto. El visor burbujea por evaporación instantánea (flash gas) debido a la caída de presión en el filtro; el subenfriamiento previo de 14 K confirma carga óptima.'
      },
      {
        id: 'opt2',
        text: 'Recuperar el refrigerante, sustituir el filtro deshidratador obstruido respetando la orientación de flecha, realizar vacío menor a 500 micrones y recargar el sistema.',
        isCorrect: true,
        explanation: '¡Dictamen correcto! Una caída térmica (ΔT > 3°C) entre entrada y salida del filtro junto con sudoración externa demuestran pérdida de carga por taponamiento interno.'
      },
      {
        id: 'opt3',
        text: 'Invertir el sentido de circulación del filtro secador en la línea de líquido para que el contraflujo desaloje las partículas retenidas en la malla metálica.',
        isCorrect: false,
        explanation: 'Incorrecto. Invertir el filtro enviará todos los contaminantes, virutas y desecante retenido directamente hacia el dispositivo de expansión, agravando el daño.'
      },
      {
        id: 'opt4',
        text: 'Desmontar la válvula de expansión termostática para desobstruir su tobera interna por considerar que la restricción de caudal se localiza en el distribuidor.',
        isCorrect: false,
        explanation: 'Incorrecto. El diferencial de temperatura y la condensación de humedad se localizan directamente sobre el filtro secador, evidenciando el punto exacto de la restricción.'
      }
    ],
    educationalNote: 'Regla de inspección: Un filtro deshidratador en buen estado NO debe tener diferencia de temperatura entre su entrada y su salida (ΔT < 0.5°C). Si está frío a la salida, actúa como un expansor indeseado.',
    technicalTheory: 'El filtro deshidratador contiene una malla de retención de partículas sólidas y un bloque desecante de tamiz molecular. Cuando retiene exceso de virutas de cobre, carbón de soldaduras sin nitrógeno o sedimentos de aceite, el paso de fluido se estrangula. Esta restricción localizada genera una pérdida de carga abrupta ($\Delta P$), provocando una expansión prematura del líquido con evaporación parcial instantánea (flash gas) y caída de temperatura.',
    recommendedSolution: '1) Medir con termómetro digital de doble sonda la entrada y salida del filtro (si $\Delta T > 1.5^\circ\text{C}$, está obstruido). 2) Conectar recuperadora y extraer el gas del sistema. 3) Desoldar o desenroscar el filtro usado protegiendo los componentes circundantes del calor. 4) Instalar un filtro nuevo de cobre/acero con núcleo de alúmina activada y tamiz molecular, respetando escrupulosamente la flecha de sentido de circulación. 5) Vacío < 500 micrones y reincorporación del refrigerante.'
  },

  // CASO 12: Forzador exterior fallando (Capacitor desvalorizado)
  {
    id: 'condenser-fan-failure',
    title: 'Fallo o Baja Velocidad del Forzador Condensador Exterior',
    category: 'Flujo de Aire y Suciedad',
    difficulty: 'Básico',
    systemType: 'Mini-Split 24,000 BTU / 6000 fg',
    refrigerant: 'R-410A',
    description: 'La unidad exterior enciende, pero a los 5 minutos el compresor corta por térmico. El forzador exterior gira visiblemente lento y pesado.',
    symptoms: {
      suctionPressure: { value: 140, unit: 'psig (Nom: 120)', status: 'Alta' },
      dischargePressure: { value: 530, unit: 'psig (Nom: 360)', status: 'Alta' },
      superheat: { value: 6.0, unit: 'K / °C', status: 'Normal' },
      subcooling: { value: 18.0, unit: 'K / °C', status: 'Alto' },
      amperage: { value: 14.5, unit: 'A (Nom: 9.8A)', status: 'Alto' },
      airDeltaT: { value: 6.0, unit: '°C', status: 'Bajo' },
      compressorTemp: { value: 108, unit: '°C', status: 'Alto' },
      visualNotes: [
        'Las aspas del ventilador exterior giran con desgano a menos del 30% de sus RPM nominales',
        'Capacitor permanente del motor de forzador hinchado o deformado en su cabeza plástica',
        'La carcasa del motor del forzador está excesivamente caliente al tacto'
      ],
      acousticNote: 'Zumbido eléctrico audible de frecuencia 50/60 Hz en el motor del forzador con silbido forzado del compresor.'
    },
    options: [
      {
        id: 'opt1',
        text: 'Recuperar refrigerante del circuito hasta lograr que la presión de alta descienda a 360 psig y el consumo eléctrico se ajuste a los 9.8A nominales de catálogo.',
        isCorrect: false,
        explanation: 'Incorrecto. Extraer fluido no soluciona la falta de ventilación forzada y dejará al equipo sin refrigerante cuando el motor del forzador se detenga por completo.'
      },
      {
        id: 'opt2',
        text: 'Sustituir el motocompresor por presunción de fricción interna en el mecanismo reciprocante y sobrecalentamiento del estator ante la excesiva corriente de consumo.',
        isCorrect: false,
        explanation: 'Incorrecto. El compresor responde pasivamente a la altísima presión de descarga generada por la incapacidad del condensador de evacuar el calor latente.'
      },
      {
        id: 'opt3',
        text: 'Medir la capacitancia con capacímetro digital y reemplazar el capacitor permanente del motor del forzador por uno nuevo de idénticos microfaradios y tensión de 450 VAC.',
        isCorrect: true,
        explanation: '¡Dictamen correcto! El capacitor de marcha desvalorizado reduce drásticamente las RPM del forzador, colapsando el caudal de aire y disparando la presión de descarga.'
      },
      {
        id: 'opt4',
        text: 'Efectuar venteo de gases incondensables por la toma de servicio de descarga asumiendo que la elevación térmica a 108°C responde a aire atrapado en la instalación.',
        isCorrect: false,
        explanation: 'Incorrecto. El fallo es evidente en la rotación pesada y lenta del ventilador exterior y la deformación del capacitor de arranque/marcha del forzador.'
      }
    ],
    educationalNote: 'El capacitor de marcha provee el desfase de 90° necesario para el campo magnético giratorio del motor del forzador. Si pierde microfaradios, el motor pierde velocidad y torque.',
    technicalTheory: 'El condensador debe evacuar calor latente y sensible mediante convección forzada de aire. Si el motor del ventilador pierde RPM por desvalorización de su capacitor de marcha (por ejemplo de 3.5 µF cae a 0.8 µF), el caudal de aire disminuye exponencialmente. El refrigerante no puede subenfriarse correctamente a presión nominal, acumulando vapor sobrecalentado a alta presión hasta disparar el clixon de protección.',
    recommendedSolution: '1) Desconectar la alimentación eléctrica general. 2) Descargar el capacitor con una resistencia de 20k ohm antes de tocarlo. 3) Desconectar terminales y medir con capacímetro digital en escala de microfaradios (µF). 4) Reemplazar por capacitor nuevo de idéntica capacidad con tolerancia ±5% y 450V. 5) Verificar giro suave de los rodamientos/bujes del eje del motor. 6) Rearmar y controlar presión de descarga en marcha normal.'
  },

  // CASO 13: Turbina interior bloqueada
  {
    id: 'evaporator-fan-failure',
    title: 'Fallo Total del Motor del Ventilador / Turbina Evaporadora',
    category: 'Flujo de Aire y Suciedad',
    difficulty: 'Intermedio',
    systemType: 'Mini-Split Inverter 12,000 BTU / 3000 fg',
    refrigerant: 'R-32',
    description: 'La unidad exterior enciende y comprime, pero el forzador de la consola interior no gira. A los pocos minutos, toda la unidad interior cruje y comienza a congelarse por completo.',
    symptoms: {
      suctionPressure: { value: 60, unit: 'psig (Nom: 115)', status: 'Baja' },
      dischargePressure: { value: 240, unit: 'psig (Nom: 350)', status: 'Baja' },
      superheat: { value: 0.0, unit: 'K / °C', status: 'Bajo' },
      subcooling: { value: 4.0, unit: 'K / °C', status: 'Normal' },
      amperage: { value: 3.1, unit: 'A (Nom: 4.8A)', status: 'Bajo' },
      airDeltaT: { value: 0.0, unit: '°C (Sin caudal)', status: 'Bajo' },
      compressorTemp: { value: 42, unit: '°C', status: 'Bajo' },
      visualNotes: [
        'Turbina tangencial completamente inmóvil',
        'Todo el serpentín evaporador cubierto de un bloque de hielo impenetrable',
        'Cañería de succión congelada en su totalidad con hielo espeso ingresando a la unidad condensadora'
      ],
      acousticNote: 'Crujidos de contracción térmica de los plásticos por congelamiento súbito.'
    },
    options: [
      {
        id: 'opt1',
        text: 'Cargar refrigerante R-32 en fase líquida por la toma de baja presión hasta elevar la succión a 115 psig y restablecer la evaporación por encima de 0°C.',
        isCorrect: false,
        explanation: 'Incorrecto. Cargar gas con la turbina detenida inundará completamente el cárter con líquido puro a baja temperatura, destruyendo el compresor por golpe hidráulico.'
      },
      {
        id: 'opt2',
        text: 'Sustituir el capilar de expansión y filtro secador por sospecha de taponamiento parcial que restringe la alimentación de fluido y provoca el congelamiento del serpentín.',
        isCorrect: false,
        explanation: 'Incorrecto. Una restricción provocaría un recalentamiento muy elevado; en este caso el recalentamiento es de 0.0 K (líquido sin hervir saliendo del evaporador).'
      },
      {
        id: 'opt3',
        text: 'Reprogramar los parámetros de corte en la tarjeta electrónica principal y calibrar los termistores NTC de ambiente para forzar el arranque del ciclo de ventilación.',
        isCorrect: false,
        explanation: 'Incorrecto. La inmovilidad de la turbina obedece a un daño eléctrico o mecánico concreto en el motor fan, capacitor o circuito driver, no a configuración de software.'
      },
      {
        id: 'opt4',
        text: 'Comprobar el circuito de alimentación del motor forzador interior, verificar su capacitor o pulso de señal Hall y reemplazar el componente defectuoso.',
        isCorrect: true,
        explanation: '¡Dictamen correcto! Sin flujo de aire forzado sobre el evaporador no existe aporte térmico: el refrigerante no hierve (SH = 0 K) y el serpentín se bloquea de hielo.'
      }
    ],
    educationalNote: 'Recalentamiento CERO ($SH = 0\\text{ K}$) significa que está saliendo líquido sin evaporar del serpentín interior hacia el motocompresor.',
    technicalTheory: 'El evaporador es un intercambiador de calor donde el líquido absorbe calor del aire para vaporizarse completamente. Si la turbina no gira, el caudal de aire es cero. La única fuente de calor es la escasa convección natural, insuficiente para evaporar la masa de líquido inyectada. El refrigerante permanece líquido a baja temperatura y presión, congelando la humedad exterior del serpentín y retornando en fase líquida al compresor.',
    recommendedSolution: '1) Apagar de inmediato el equipo para evitar golpe de ariete hidráulico en el compresor. 2) Descongelar el serpentín por completo de forma pasiva. 3) Comprobar manualmente el giro libre del buje de la turbina. 4) Con multímetro medir tensiones de salida de la placa electrónica hacia el motor (si es motor AC medir capacitor de placa; si es BLDC medir tensiones DC y pulso de feedback Hall). 5) Reemplazar motor o reparar circuito de control de velocidad.'
  },

  // CASO 14: Válvula de 4 vías con fuga interna
  {
    id: 'four-way-valve-leak',
    title: 'Válvula Inversora de 4 Vías con Fuga Interna de Corredera (Bypass)',
    category: 'Restricciones y Expansión',
    difficulty: 'Avanzado',
    systemType: 'Sistema Split Frío/Calor 18,000 BTU / 4500 fg',
    refrigerant: 'R-410A',
    description: 'En modo frío el equipo apenas refresca. Al colocar manómetros, la presión de baja está inusualmente alta y la de alta baja, simulando un compresor roto.',
    symptoms: {
      suctionPressure: { value: 142, unit: 'psig (Nom: 120)', status: 'Alta' },
      dischargePressure: { value: 270, unit: 'psig (Nom: 360)', status: 'Baja' },
      superheat: { value: 24.0, unit: 'K / °C', status: 'Alto' },
      subcooling: { value: 2.0, unit: 'K / °C', status: 'Bajo' },
      amperage: { value: 6.8, unit: 'A (Nom: 8.0A)', status: 'Bajo' },
      airDeltaT: { value: 3.0, unit: '°C', status: 'Bajo' },
      compressorTemp: { value: 89, unit: '°C', status: 'Alto' },
      visualNotes: [
        'Diferencia de temperatura anormal en los 3 caños inferiores de la válvula de 4 vías',
        'El caño de succión que sale de la válvula hacia el compresor está caliente al tacto',
        'Salto térmico casi nulo tanto en la unidad interior como en la exterior'
      ],
      acousticNote: 'Siseo continuo de paso de gas a alta velocidad dentro del cuerpo de latón de la válvula inversora.'
    },
    options: [
      {
        id: 'opt1',
        text: 'Diagnosticar pérdida de rendimiento mecánico en el motocompresor y proceder a su reemplazo inmediato debido al escaso diferencial entre presiones de trabajo.',
        isCorrect: false,
        explanation: 'Incorrecto. El compresor bombea correctamente; el problema radica en que el gas comprimido a alta temperatura se desvía internamente hacia la succión dentro de la válvula.'
      },
      {
        id: 'opt2',
        text: 'Constatar el salto térmico anormal entre las tuberías de la válvula inversora y sustituirla soldando con nitrógeno y envolviendo el cuerpo en paños húmedos.',
        isCorrect: true,
        explanation: '¡Dictamen correcto! El calentamiento anormal en la línea de succión que sale de la válvula hacia el compresor confirma fuga en la corredera interna de teflón.'
      },
      {
        id: 'opt3',
        text: 'Cargar refrigerante R-410A por la toma de servicio de baja hasta incrementar la presión de descarga hacia los 360 psig recomendados por el fabricante.',
        isCorrect: false,
        explanation: 'Incorrecto. Agregar refrigerante aumentará aún más la presión de succión y sobrecargará el circuito sin solucionar la recirculación interna de gas caliente.'
      },
      {
        id: 'opt4',
        text: 'Sustituir el dispositivo de expansión por presunción de sobrealimentación masiva de fluido que inunda la cañería de succión e impide generar salto térmico.',
        isCorrect: false,
        explanation: 'Incorrecto. Una sobrealimentación de expansión reduciría el recalentamiento hacia 0 K; aquí el recalentamiento es de 24 K y el caño de succión sale caliente de la válvula.'
      }
    ],
    educationalNote: 'Para distinguir entre compresor descomprimido y válvula de 4 vías con fuga interna: toca el caño de succión que ingresa a la válvula vs el que sale hacia el compresor; si se calienta dentro de la válvula, el bypass es en la válvula.',
    technicalTheory: 'La válvula inversora de 4 vías posee un pistón deslizante con zapatas de teflón que comunican la descarga del compresor con el condensador y el evaporador con la succión. Si el pistón se traba a medio recorrido o las zapatas de teflón se deforman por recalentamiento en soldadura previa, el gas caliente de descarga (a alta temperatura y presión) se filtra directamente al tubo de succión. Esto eleva la presión y temperatura de succión mientras derriba la presión de descarga.',
    recommendedSolution: '1) Medición de temperatura por termocuplas en los 4 tubos de la válvula para confirmar bypass interno. 2) Recuperar el refrigerante. 3) Desoldar la válvula dañada. 4) Presentar la nueva válvula de 4 vías cubriendo su cuerpo con abundante pasta disipadora o trapos empapados en agua fría continua durante la soldadura (el calor destruye el teflón a más de 120°C). 5) Soldar bajo atmósfera de nitrógeno seco a 2-3 psig. 6) Vacío < 500 micrones y carga por peso.'
  },

  // CASO 15: Migración de refrigerante al cárter
  {
    id: 'compressor-oil-logging',
    title: 'Migración de Refrigerante al Cárter en Parada (Golpe de Espuma)',
    category: 'Compresión y Mecánica',
    difficulty: 'Avanzado',
    systemType: 'Sistema Central Rooftop 10 TR',
    refrigerant: 'R-410A',
    description: 'En el primer arranque de la mañana tras una noche fría, el compresor emite ruidos mecánicos violentos durante los primeros 45 segundos y el visor de aceite del cárter se llena de una espuma blanca espesa.',
    symptoms: {
      suctionPressure: { value: 135, unit: 'psig (En arranque)', status: 'Alta' },
      dischargePressure: { value: 340, unit: 'psig', status: 'Normal' },
      superheat: { value: 3.0, unit: 'K / °C', status: 'Bajo' },
      subcooling: { value: 6.0, unit: 'K / °C', status: 'Normal' },
      amperage: { value: 24.0, unit: 'A (Pico excesivo en arranque)', status: 'Alto' },
      airDeltaT: { value: 12.0, unit: '°C', status: 'Normal' },
      compressorTemp: { value: 35, unit: '°C (Cárter frío en reposo)', status: 'Bajo' },
      visualNotes: [
        'Resistencia calefactora de cárter (crankcase heater) quemada o desconectada eléctricamente',
        'Visor de aceite lleno de espuma blanca densa durante el arranque matutino',
        'Nivel de aceite en el visor desciende por debajo del límite mínimo tras el arranque'
      ],
      acousticNote: 'Traqueteo metálico pesado y vibración violenta en el cuerpo del compresor al iniciarse el bombeo de espuma de aceite y líquido.'
    },
    options: [
      {
        id: 'opt1',
        text: 'Agregar dos litros de lubricante POE al cárter para compensar la caída momentánea de nivel observada en el visor durante el arranque matutino.',
        isCorrect: false,
        explanation: 'Incorrecto. El aceite fue expulsado temporalmente en forma de espuma; agregar lubricante extra saturará las líneas de refrigeración y provocará golpe de ariete.'
      },
      {
        id: 'opt2',
        text: 'Recuperar refrigerante del sistema asumiendo que la formación de espuma en el cárter durante los primeros 45 segundos se debe a sobrecarga en reposo.',
        isCorrect: false,
        explanation: 'Incorrecto. La carga del sistema en régimen es óptima; la migración ocurre por solubilidad natural del vapor de refrigerante en el aceite frío durante la parada.'
      },
      {
        id: 'opt3',
        text: 'Verificar la resistencia calefactora de cárter, reemplazarla si se halla cortada y asegurar su energización continua en parada para evitar la dilución del lubricante.',
        isCorrect: true,
        explanation: '¡Dictamen correcto! El calefactor de cárter mantiene el aceite 10-15°C por encima del ambiente en reposo, impidiendo que el refrigerante condense y se disuelva en él.'
      },
      {
        id: 'opt4',
        text: 'Desmontar el motocompresor para rectificación de cojinetes por considerar que el ruido matutino responde a holgura mecánica permanente en las bielas de empuje.',
        isCorrect: false,
        explanation: 'Incorrecto. El sonido proviene del bombeo de espuma y fricción transitoria por pérdida de viscosidad; reponer el calentamiento de cárter elimina el problema de raíz.'
      }
    ],
    educationalNote: 'El aceite y el refrigerante tienen afinidad química natural. El refrigerante siempre migra hacia la zona más fría del circuito en reposo: si el cárter está frío, el refrigerante líquido se mezclará con el aceite.',
    technicalTheory: 'Durante los períodos de inactividad, el refrigerante en forma de vapor migra y se disuelve en el aceite del cárter debido a la menor presión de vapor de la mezcla aceite-refrigerante a bajas temperaturas. Al arrancar el compresor, la presión en el cárter cae súbitamente: el refrigerante disuelto ebulle de golpe (flash), transformando el lubricante en una espuma ineficaz. La bomba de aceite bombea espuma en vez de líquido lubricante, provocando rozamiento metal-metal y expulsión del aceite hacia las tuberías.',
    recommendedSolution: '1) Inspeccionar continuidad y resistencia óhmica de la resistencia de cárter (crankcase heater). 2) Si está abierta, reemplazar por resistencia tipo abrazadera exterior con termostato integrado. 3) Comprobar que reciba alimentación continua de 220V incluso cuando el contactor principal del compresor esté en reposo. 4) En sistemas con parada prolongada, implementar ciclo de parada con recogida de gas (Pump Down) mediante electroválvula solenoide en la línea de líquido.'
  },

  // CASO 16: Retorno continuo de líquido
  {
    id: 'liquid-floodback',
    title: 'Inundación y Retorno Continuo de Refrigerante Líquido al Cárter',
    category: 'Compresión y Mecánica',
    difficulty: 'Avanzado',
    systemType: 'Cámara de Congelados -18°C con VET',
    refrigerant: 'R-404A',
    description: 'El cárter del motocompresor se encuentra completamente frío y sudando agua condensada. El nivel de aceite en el visor oscila y se observa dilución extrema.',
    symptoms: {
      suctionPressure: { value: 24, unit: 'psig', status: 'Normal' },
      dischargePressure: { value: 215, unit: 'psig', status: 'Normal' },
      superheat: { value: 1.0, unit: 'K / °C (Nom: 6-8K)', status: 'Bajo' },
      subcooling: { value: 5.5, unit: 'K / °C', status: 'Normal' },
      amperage: { value: 11.2, unit: 'A (Nom: 10.5A)', status: 'Normal' },
      airDeltaT: { value: 5.0, unit: '°C', status: 'Bajo' },
      compressorTemp: { value: 24, unit: '°C (Excesivamente frío)', status: 'Bajo' },
      visualNotes: [
        'Cárter transpirado por debajo de la temperatura de rocío del aire circundante',
        'Aceite en el visor de color transparente pálido y con espuma superficial constante en marcha',
        'Filtro separador de succión / acumulador con escarcha hasta la mitad inferior'
      ],
      acousticNote: 'Sonido sordo de líquido rompiéndose en las válvulas de succión del cilindro.'
    },
    options: [
      {
        id: 'opt1',
        text: 'Ajustar el vástago de la VET en sentido horario para aumentar la tensión del resorte y elevar el recalentamiento útil a un rango seguro de 6K a 8K.',
        isCorrect: true,
        explanation: '¡Dictamen correcto! Un recalentamiento de 1.0 K con cárter sudado indica que la VET inyecta más líquido del que el evaporador puede hervir, lavando el aceite.'
      },
      {
        id: 'opt2',
        text: 'Inyectar refrigerante R-404A en fase gaseosa para compensar la temperatura fría del cárter y elevar la presión de evaporación del motocompresor.',
        isCorrect: false,
        explanation: 'Incorrecto. Cargar más refrigerante incrementará la inundación de líquido al compresor, destruyendo la película lubricante y fundiendo los cojinetes.'
      },
      {
        id: 'opt3',
        text: 'Retirar el acumulador de succión del circuito frigorífico por presunción de pérdida de carga interna que favorece la acumulación de líquido en el retorno.',
        isCorrect: false,
        explanation: 'Incorrecto. El acumulador de succión es la protección que retiene el líquido excedente; anularlo enviará líquido masivo directo a los pistones del compresor.'
      },
      {
        id: 'opt4',
        text: 'Efectuar limpieza química del serpentín condensador para forzar una subida en la presión de alta y acelerar el secado del refrigerante en la succión.',
        isCorrect: false,
        explanation: 'Incorrecto. El condensador y el subenfriamiento operan en rangos normales; la causa directa es el ajuste de apertura excesivo en la válvula de expansión.'
      }
    ],
    educationalNote: 'El líquido refrigerante es un solvente desengrasante. Si entra al cárter en marcha continua, lava la película de aceite de las bielas y cigüeñal, fundiendo el motor en pocas semanas.',
    technicalTheory: 'El retorno de líquido ocurre cuando la tasa de alimentación de la válvula de expansión supera la capacidad del evaporador para vaporizar el fluido. El refrigerante líquido llega al cárter mezclándose con el aceite lubricante. Esto reduce drásticamente la viscosidad del aceite POE/mineral, destruyendo la película hidrodinámica entre metales y provocando desgaste prematuro de aros, pistones, bujes y muñones de cigüeñal.',
    recommendedSolution: '1) Verificar la sujeción y aislación del bulbo sensor de la VET. 2) Ajustar el tornillo de regulación del recalentamiento de la VET (girar en sentido horario para aumentar la tensión del resorte y cerrar el orificio de inyección). 3) Esperar 15 minutos entre cada cuarto de vuelta para que el sistema estabilice. 4) Constatar que el Recalentamiento útil en el evaporador alcance de 5 a 8 K y el recalentamiento total en el compresor sea superior a 11 K.'
  },

  // CASO 17: Fraccionamiento de mezcla zeotrópica
  {
    id: 'zeotropic-fractionation',
    title: 'Fraccionamiento de Mezcla Zeotrópica por Fuga en Fase Gaseosa',
    category: 'Carga de Refrigerante',
    difficulty: 'Avanzado',
    systemType: 'Sistema Central Comercial con R-407C',
    refrigerant: 'R-407C',
    description: 'El equipo sufrió una microfuga lenta en la zona alta de descarga en reposo. Se recargó gas sin evacuar el remanente. Ahora las presiones no coinciden con ninguna tabla P-T y el rendimiento térmico cayó 35%.',
    symptoms: {
      suctionPressure: { value: 72, unit: 'psig (Glide errático)', status: 'Baja' },
      dischargePressure: { value: 290, unit: 'psig', status: 'Baja' },
      superheat: { value: 18.0, unit: 'K / °C', status: 'Alto' },
      subcooling: { value: 3.0, unit: 'K / °C', status: 'Bajo' },
      amperage: { value: 7.2, unit: 'A (Nom: 10.0A)', status: 'Bajo' },
      airDeltaT: { value: 6.5, unit: '°C (Nom: 12-15°C)', status: 'Bajo' },
      compressorTemp: { value: 82, unit: '°C', status: 'Normal' },
      visualNotes: [
        'Deslizamiento de temperatura (glide) excesivo entre el inicio y final del evaporador',
        'El equipo enfría desparejo en los diferentes circuitos del serpentín',
        'La temperatura de saturación calculada por manómetro no coincide con la temperatura del termómetro'
      ],
      acousticNote: 'Comportamiento acústico normal del motor, pero sin rendimiento frigorífico eficaz.'
    },
    options: [
      {
        id: 'opt1',
        text: 'Completar la carga agregando refrigerante R-407C en fase gaseosa por la succión hasta estabilizar la presión de evaporación con la temperatura de régimen.',
        isCorrect: false,
        explanation: 'Incorrecto. Las mezclas zeotrópicas con alto glide nunca deben cargarse en fase gaseosa ni rellenarse tras fugas en vapor, ya que se altera la composición molecular.'
      },
      {
        id: 'opt2',
        text: 'Abrir el vástago de regulación de la VET para aumentar el flujo volumétrico y compensar la pérdida de rendimiento térmico en los circuitos del evaporador.',
        isCorrect: false,
        explanation: 'Incorrecto. El problema no es de caudal mecánico de expansión, sino de degradación termodinámica de la mezcla al perder su componente más volátil (R-32).'
      },
      {
        id: 'opt3',
        text: 'Sustituir el motocompresor por sospecha de desgaste mecánico en platos de válvulas ante la falta de correspondencia entre presiones y tablas P-T de saturación.',
        isCorrect: false,
        explanation: 'Incorrecto. El compresor está mecánicamente sano; la distorsión de presiones y pérdida de capacidad se debe al fraccionamiento químico del refrigerante.'
      },
      {
        id: 'opt4',
        text: 'Recuperar todo el refrigerante fraccionado, reparar la microfuga, realizar vacío profundo menor a 500 micrones y recargar gas virgen en fase líquida por balanza.',
        isCorrect: true,
        explanation: '¡Dictamen correcto! El R-407C tiene un glide de hasta 7°C; una fuga en vapor descompone la proporción de la mezcla, obligando al reemplazo completo del fluido.'
      }
    ],
    educationalNote: 'El R-407C (R-32/R-125/R-134a) tiene un glide de hasta 7°C. Si hay fuga en fase vapor, el R-32 se escapa primero y la mezcla queda desbalanceada, perdiendo capacidad termodinámica irreversiblemente.',
    technicalTheory: 'Las mezclas zeotrópicas (serie 400) están compuestas por refrigerantes con diferentes temperaturas de ebullición a una misma presión. Al producirse una fuga en fase vapor durante la parada del equipo, el componente con menor punto de ebullición y mayor presión de vapor se evapora y fuga con mayor rapidez. El remanente en el circuito cambia de composición química porcentual, perdiendo su curva termodinámica original y requiriendo reemplazo total.',
    recommendedSolution: '1) Recuperar el refrigerante fraccionado a un cilindro especial para reciclado. 2) Localizar la microfuga presurizando con nitrógeno y reparar con aporte de soldadura de plata al 5% o 15%. 3) Prueba de estanqueidad durante 1 hora a presión de prueba. 4) Vacío profundo por debajo de 350 micrones con bomba de dos etapas. 5) Cargar refrigerante virgen R-407C en FASE LÍQUIDA (garrafa invertida o con tubo de inmersión) utilizando balanza digital precisa.'
  },

  // CASO 18: Resistencia de deshielo quemada en No-Frost
  {
    id: 'defrost-heater-failure',
    title: 'Fallo de Resistencia de Deshielo en Heladera No-Frost',
    category: 'Eléctrico y Control',
    difficulty: 'Intermedio',
    systemType: 'Heladera No-Frost Electrónica Familiar',
    refrigerant: 'R-134a',
    description: 'El cliente indica que la heladera enfriaba perfecto y de pronto el refrigerador inferior dejó de enfriar por completo, mientras que el freezer superior aún mantiene algo de frío pero con ventilador ruidoso.',
    symptoms: {
      suctionPressure: { value: 1.0, unit: 'psig (Nom: 8-10)', status: 'Baja' },
      dischargePressure: { value: 110, unit: 'psig (Nom: 145)', status: 'Baja' },
      superheat: { value: 1.0, unit: 'K / °C', status: 'Bajo' },
      subcooling: { value: 4.0, unit: 'K / °C', status: 'Normal' },
      amperage: { value: 0.8, unit: 'A (Nom: 1.2A)', status: 'Bajo' },
      airDeltaT: { value: 0.0, unit: '°C (Conducto taponado de hielo)', status: 'Bajo' },
      compressorTemp: { value: 50, unit: '°C', status: 'Bajo' },
      visualNotes: [
        'Evaporador oculto detrás del panel del freezer completamente transformado en un iceberg de hielo compacto',
        'Ducto de aire (damper) hacia la parte inferior bloqueado 100% de hielo macizo',
        'Aspas del forzador rozando contra el hielo acumulado'
      ],
      acousticNote: 'Roce mecánico periódico de las aspas del ventilador contra el bloque de hielo (tac-tac-tac).'
    },
    options: [
      {
        id: 'opt1',
        text: 'Cargar refrigerante R-134a por la toma de servicio de baja presión al interpretar que la caída manométrica a 1.0 psig se debe a pérdida por fuga activa.',
        isCorrect: false,
        explanation: 'Incorrecto. La baja presión proviene del aislamiento térmico que produce el bloque compacto de hielo en el evaporador; cargar gas provocará retorno de líquido.'
      },
      {
        id: 'opt2',
        text: 'Sustituir el motocompresor hermético por sospecha de desgaste mecánico en pistón y biela ante la falta de enfriamiento en el refrigerador inferior.',
        isCorrect: false,
        explanation: 'Incorrecto. El circuito frigorífico funciona; lo que falló es el subcircuito eléctrico de desescarche que permite el paso del aire frío hacia el compartimento bajo.'
      },
      {
        id: 'opt3',
        text: 'Descongelar el serpentín, medir continuidad en resistencia de deshielo, fusible térmico y bimetal, y reemplazar el componente eléctrico que se halle abierto.',
        isCorrect: true,
        explanation: '¡Dictamen correcto! En sistemas No-Frost, la acumulación masiva de hielo que obstruye los ductos de aire hacia abajo se origina en la falla de la resistencia o fusible.'
      },
      {
        id: 'opt4',
        text: 'Recortar el conducto de poliestireno expandido del dámper termostático para forzar mecánicamente el paso de aire frío hacia el gabinete de conservación.',
        isCorrect: false,
        explanation: 'Incorrecto. Modificar el dámper no soluciona el congelamiento del serpentín y provocará condensación descontrolada y pérdida de aislamiento en el túnel de aire.'
      }
    ],
    educationalNote: 'En heladeras No-Frost: si el freezer tiene hielo en exceso y abajo no enfría, el 95% de las veces la falla es del sistema de deshielo (resistencia, fusible térmico, bimetal o sensor de descongelamiento).',
    technicalTheory: 'En una heladera No-Frost, la humedad de los alimentos y de las aperturas de puerta se condensa sobre las aletas del evaporador oculto. Un temporizador o microcontrolador activa periódicamente la resistencia eléctrica de deshielo (calefactor blindado de 150 a 300 W). Si la resistencia se interrumpe (resistencia infinita en óhmetro) o el fusible térmico de seguridad de 72°C se abre, el hielo no se derrite, acumulándose capa sobre capa hasta obturar por completo el túnel de distribución de aire hacia el refrigerador inferior.',
    recommendedSolution: '1) Desarmar la tapa trasera plástica del freezer. 2) Realizar descongelamiento térmico completo cuidando los conductos de telgopor (EPS). 3) Medir con multímetro en escala de ohms la resistencia calefactora (debe medir entre 150 y 400 ohms; si marca infinito, está abierta). 4) Medir continuidad del fusible térmico de seguridad (debe marcar 0 ohms). 5) Verificar bimetal en frío o termistor NTC de defrost. 6) Comprobar drenaje de descongelamiento despejado vertiendo agua caliente.'
  },

  // CASO 19: Capilar mal dimensionado (Retrofit R-290)
  {
    id: 'capillary-undersized-retrofit',
    title: 'Capilar con Restricción Excesiva tras Reparación/Cambio de Motor',
    category: 'Restricciones y Expansión',
    difficulty: 'Avanzado',
    systemType: 'Enfriador de Bebidas Comercial / Visicooler',
    refrigerant: 'R-290',
    description: 'Tras un reemplazo de compresor, el técnico colocó un tubo capilar más fino y largo del especificado por el fabricante. El equipo evapora a temperaturas extremadamente bajas pero tiene muy bajo rendimiento de enfriamiento.',
    symptoms: {
      suctionPressure: { value: 12, unit: 'psig (Nom: 32 psig para +2°C)', status: 'Baja' },
      dischargePressure: { value: 210, unit: 'psig (Nom: 175 psig)', status: 'Alta' },
      superheat: { value: 21.0, unit: 'K / °C', status: 'Alto' },
      subcooling: { value: 13.0, unit: 'K / °C', status: 'Alto' },
      amperage: { value: 3.2, unit: 'A (Nom: 2.3A)', status: 'Alto' },
      airDeltaT: { value: 4.0, unit: '°C', status: 'Bajo' },
      compressorTemp: { value: 85, unit: '°C', status: 'Alto' },
      visualNotes: [
        'Escarcha dura únicamente en el primer 15% del serpentín evaporador',
        'Condensador excesivamente caliente en las primeras curvas superiores',
        'Consumo eléctrico por encima del valor nominal de la placa'
      ],
      acousticNote: 'Zumbido de esfuerzo permanente en el compresor por alta relación de compresión.'
    },
    options: [
      {
        id: 'opt1',
        text: 'Cargar refrigerante R-290 adicional en fase líquida hasta que la presión de baja alcance los 32 psig requeridos para la temperatura de conservación.',
        isCorrect: false,
        explanation: 'Incorrecto. Superar la carga máxima de 150g de R-290 (hidrocarburo inflamable A3) elevará peligrosamente la presión de alta sin corregir la restricción del capilar.'
      },
      {
        id: 'opt2',
        text: 'Recalcular el tubo capilar por tabla técnica según potencia del compresor, sustituirlo por el diámetro y longitud correctos y recargar por peso en balanza.',
        isCorrect: true,
        explanation: '¡Dictamen correcto! Un capilar con restricción excesiva acumula líquido en condensador (subcooling alto) y seca el evaporador (recalentamiento 21 K y baja succión).'
      },
      {
        id: 'opt3',
        text: 'Reducir la velocidad del forzador del evaporador modificando las conexiones del motor para equilibrar el intercambio térmico con el elevado recalentamiento.',
        isCorrect: false,
        explanation: 'Incorrecto. Reducir el caudal de aire empeorará el rendimiento del visicooler y no resuelve la pérdida de carga hidráulica en el capilar mal dimensionado.'
      },
      {
        id: 'opt4',
        text: 'Sustituir el motocompresor por presunción de válvulas defectuosas que generan un consumo eléctrico superior a los 2.3A nominales especificados en la placa.',
        isCorrect: false,
        explanation: 'Incorrecto. El incremento de corriente es consecuencia directa de la altísima relación de compresión impuesta por el capilar excesivamente estrangulado.'
      }
    ],
    educationalNote: 'El tubo capilar define el caudal másico en función de la caída de presión. Si es demasiado restrictivo, la relación de compresión se dispara, el caudal cae y el equipo pierde capacidad frigorífica.',
    technicalTheory: 'El tubo capilar no tiene partes móviles y su capacidad de dosificación depende de su diámetro interior elevado a la cuarta potencia según la ley de Poiseuille ($Q \\propto D^4 / L$). Si el técnico instaló un capilar de $0.031\"$ en lugar de $0.036\"$, el área de paso se redujo casi un 30%. El caudal másico disponible no alcanza a llenar el evaporador, disparando el recalentamiento y elevando el subcooling por líquido represado en el condensador.',
    recommendedSolution: '1) Recuperar con máquina apta para hidrocarburos el gas R-290. 2) Utilizar el software de selección técnica de fabricantes (Secop/Danfoss Capillary Selector) con la potencia del compresor en W y temperatura de evaporación deseada (-5°C para visicooler). 3) Instalar capilar del diámetro y largo especificado (por ejemplo 2.2 metros de 0.036"). 4) Soldar con nitrógeno y filtro nuevo para R-290. 5) Vacío < 200 micrones y carga en fase líquida por balanza de precisión de 1 gramo respetando el límite de placa (ej. 85 gramos).'
  },

  // CASO 20: Válvula de 4 vías trabada en punto intermedio
  {
    id: 'reversing-valve-stuck-mid',
    title: 'Válvula Inversora Trabada Mecánicamente a Mitad de Carrera',
    category: 'Eléctrico y Control',
    difficulty: 'Intermedio',
    systemType: 'Bomba de Calor / Split Frío-Calor 12,000 BTU',
    refrigerant: 'R-410A',
    description: 'Al pasar de modo verano a invierno, se escuchó un golpe en la unidad exterior. Desde entonces el equipo no calienta ni enfría, y las presiones se encuentran casi ecualizadas con el compresor en marcha.',
    symptoms: {
      suctionPressure: { value: 190, unit: 'psig (Nom: 118 en frío)', status: 'Alta' },
      dischargePressure: { value: 220, unit: 'psig (Nom: 380 en calor)', status: 'Baja' },
      superheat: { value: 28.0, unit: 'K / °C', status: 'Alto' },
      subcooling: { value: 0.5, unit: 'K / °C', status: 'Bajo' },
      amperage: { value: 3.5, unit: 'A (Nom: 5.6A)', status: 'Bajo' },
      airDeltaT: { value: 0.8, unit: '°C (Sin intercambio)', status: 'Bajo' },
      compressorTemp: { value: 92, unit: '°C', status: 'Alto' },
      visualNotes: [
        'Bobina solenoide de la válvula de 4 vías energizada correctamente a 220V',
        'Toda la carcasa de latón de la válvula inversora está caliente al tacto de manera uniforme',
        'Tubos de servicio exteriores a temperatura ambiente'
      ],
      acousticNote: 'Silbido ensordecedor de gas puenteando directamente dentro de la válvula sin recorrer las unidades.'
    },
    options: [
      {
        id: 'opt1',
        text: 'Desenergizar y reenergizar la bobina solenoide aplicando suaves impactos en el cuerpo para liberar la corredera; si no conmuta, reemplazar la válvula de cuatro vías.',
        isCorrect: true,
        explanation: '¡Dictamen correcto! El siseo continuo, presiones ecualizadas y cuerpo de latón uniformemente caliente indican que la corredera quedó trabada en posición intermedia.'
      },
      {
        id: 'opt2',
        text: 'Inyectar refrigerante R-410A por la toma de servicio para generar un pulso de presión diferencial que fuerce mecánicamente el desplazamiento del émbolo.',
        isCorrect: false,
        explanation: 'Incorrecto. Si la corredera o los orificios piloto están agarrotados, agregar refrigerante no generará el diferencial requerido y elevará la presión en reposo.'
      },
      {
        id: 'opt3',
        text: 'Sustituir el motocompresor por considerar que la proximidad entre presiones de alta y baja responde a rotura de espirales en el mecanismo de compresión scroll.',
        isCorrect: false,
        explanation: 'Incorrecto. El sonido ensordecedor de bypass de gas en el cuerpo de latón y la temperatura pareja en todos sus tubos localizan la falla en la válvula de 4 vías.'
      },
      {
        id: 'opt4',
        text: 'Efectuar recalibración de pasos en la válvula de expansión electrónica mediante el menú de servicio de la plaqueta para restablecer el salto manométrico.',
        isCorrect: false,
        explanation: 'Incorrecto. El cortocircuito hidráulico ocurre entre la descarga y la succión dentro de la válvula inversora trabada, no en el dispositivo dosificador.'
      }
    ],
    educationalNote: 'La válvula de 4 vías necesita un diferencial de presión mínimo (típicamente > 30-50 psig) para que los orificios piloto muevan el pistón principal. Si el pistón queda al medio, todo el gas caliente pasa directo a succión.',
    technicalTheory: 'La válvula de 4 vías es pilotada por una electroválvula solenoide miniatura que desvía gas a alta presión hacia uno de los extremos del émbolo principal. Si una viruta de cobre o rebaba queda atrapada en los conductos capilares piloto, o si la corredera se desalinea, el pistón queda suspendido en el centro. En esta posición intermedia, todos los orificios quedan comunicados entre sí, provocando un cortocircuito hidráulico total sin transferencia de calor.',
    recommendedSolution: '1) Verificar con multímetro que la bobina reciba 220 VAC y que magnetice (con un destornillador comprobar la atracción magnética en su núcleo). 2) Conmutar varias veces modo frío y calor mientras se dan golpes suaves con el mango plástico en el cuerpo de latón para ayudar al pistón a llegar al tope. 3) Si la corredera no se mueve y las presiones siguen iguales (190 vs 220 psig), recuperar el refrigerante. 4) Cortar y reemplazar la válvula de 4 vías soldando con nitrógeno y manteniendo el cuerpo refrigerado con paños húmedos. 5) Vacío y carga por peso.'
  },

  // CASO 21: Presencia de acidez severa en aceite POE
  {
    id: 'non-condensables-and-acid',
    title: 'Contaminación por Acidez Severa en Aceite Sintético POE',
    category: 'Contaminación y Vacío',
    difficulty: 'Avanzado',
    systemType: 'Sistema Multi-Split Inverter 36,000 BTU / 3 TR',
    refrigerant: 'R-410A',
    description: 'El equipo se detiene por falla de aislamiento eléctrico en el compresor (corte de disyuntor diferencial). Al tomar una muestra de aceite, este presenta color oscuro y olor sumamente acre e irritante.',
    symptoms: {
      suctionPressure: { value: 0, unit: 'psig (Sistema inoperativo)', status: 'Baja' },
      dischargePressure: { value: 0, unit: 'psig', status: 'Baja' },
      superheat: { value: 0.0, unit: 'K / °C', status: 'Bajo' },
      subcooling: { value: 0.0, unit: 'K / °C', status: 'Bajo' },
      amperage: { value: 0.0, unit: 'A (Disparo diferencial por fuga a tierra)', status: 'Bajo' },
      airDeltaT: { value: 0.0, unit: '°C', status: 'Bajo' },
      compressorTemp: { value: 25, unit: '°C', status: 'Normal' },
      visualNotes: [
        'Kit de test de acidez químico vira a color rojo intenso (pH < 4.0 - altamente ácido)',
        'Muestra de aceite con tonalidad parduzca oscura y sedimentos de cobre cobrizado en el visor',
        'Medición de aislamiento con megóhmetro (megger) a 500V marca < 0.5 MΩ (bobinado a masa)'
      ],
      acousticNote: 'Disparo instantáneo del interruptor termomagnético y diferencial al intentar encender.'
    },
    options: [
      {
        id: 'opt1',
        text: 'Instalar de inmediato un motocompresor nuevo con aceite POE virgen y ponerlo en funcionamiento tras realizar una evacuación estándar de 15 minutos.',
        isCorrect: false,
        explanation: 'Incorrecto. La acidez residual disuelta en cañerías y serpentines atacará el barniz aislante del nuevo motocompresor, provocando su quema en menos de 48 horas.'
      },
      {
        id: 'opt2',
        text: 'Rellenar el cárter con aceite mineral nafténico y neutralizador químico alcalino para diluir los restos ácidos antes de rearmar el interruptor termomagnético.',
        isCorrect: false,
        explanation: 'Incorrecto. El aceite mineral es inmiscible con R-410A y los neutralizadores químicos no reparan la pérdida de aislamiento a masa del bobinado (< 0.5 MΩ).'
      },
      {
        id: 'opt3',
        text: 'Desconectar la toma de tierra del motocompresor y colocar un interruptor termomagnético de mayor amperaje para impedir el disparo durante el encendido.',
        isCorrect: false,
        explanation: 'Incorrecto. Anular la protección de tierra deja el chasis metálico electrificado con riesgo mortal de choque eléctrico para usuarios y técnicos.'
      },
      {
        id: 'opt4',
        text: 'Retirar el compresor, lavar el circuito con solvente específico impulsado por nitrógeno, montar nuevo compresor con filtros antiácidos y evacuar a 250 micrones.',
        isCorrect: true,
        explanation: '¡Dictamen correcto! El aceite POE hidrolizado genera ácido corrosivo; se exige descontaminación profunda con solvente y filtros de succión y líquido antiácidos.'
      }
    ],
    educationalNote: 'El aceite sintético Polioléster (POE) es 100 veces más higroscópico que el mineral. Si absorbe humedad del aire, reacciona químicamente produciendo ácido y alcohol (hidrólisis), destruyendo el aislamiento del motor.',
    technicalTheory: 'Los aceites sintéticos POE se forman mediante la reacción química de un ácido y un alcohol orgánico liberando agua. Cuando entra aire y humedad al circuito por falta de vacío adecuado, la reacción se invierte por hidrólisis: el lubricante se descompone nuevamente en ácidos orgánicos y ácido fluorhídrico/clorhídrico. Este ácido corroe el barniz aislante de poliimida de los devanados del motor y disuelve el cobre de los tubos, provocando la quemadura de la fase y cortocircuito a masa.',
    recommendedSolution: '1) Certificar quemadura por acidez con megóhmetro y test químico de aceite. 2) Extraer el compresor quemado. 3) Realizar barrido por secciones de las líneas y serpentines con agente limpiador solvente (ej. Friogas / R-141b eco) impulsado con nitrógeno hasta que salga 100% limpio y seco. 4) Instalar nuevo motocompresor con aceite POE virgen. 5) Colocar un filtro deshidratador antiácido con núcleo de carbón activado y alúmina en la línea de líquido y un filtro de succión temporal. 6) Vacío < 250 micrones y recarga por peso.'
  }
];
