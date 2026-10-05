import React from 'react';

/* ------------------------------------------------------------------
 * Lightweight SVG illustrations for the home page.
 * Vector (crisp at any size), themable and with subtle motion.
 * ------------------------------------------------------------------ */

const INK = '#1f2937';
const MUTED = '#64748b';

const PTBadge: React.FC<{ x: number; y: number }> = ({ x, y }) => (
  <g>
    <rect x={x} y={y} width={26} height={15} rx={3} fill="#fff" stroke={MUTED} strokeWidth={1} />
    <text x={x + 13} y={y + 10.5} textAnchor="middle" fontSize={8} fontWeight={600} fill={INK}>P, T</text>
  </g>
);

const Chevron: React.FC<{ x: number; y: number; dir: 'up' | 'down' | 'left' | 'right'; color: string }> = ({ x, y, dir, color }) => {
  const rot = { right: 0, down: 90, left: 180, up: 270 }[dir];
  return (
    <path
      d="M-4 -4 L2 0 L-4 4"
      transform={`translate(${x} ${y}) rotate(${rot})`}
      fill="none"
      stroke={color}
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  );
};

/** Hero illustration: vapor-compression refrigeration cycle matching user reference image. */
export const CycleDiagram: React.FC = () => {
  const L = 64, R = 286, T = 46, B = 154, M = (T + B) / 2;
  return (
    <svg viewBox="0 0 350 200" className="w-full h-auto select-none" role="img" aria-label="Diagrama del circuito frigorífico">
      <rect width="350" height="200" fill="#ffffff" />

      {/* Pressure indicators top and bottom left */}
      <g fontSize={10} fontWeight={600} fontFamily="system-ui, sans-serif">
        <path d="M14 26 v-10 m-3 3 l3 -3 l3 3" stroke="#e11d48" strokeWidth={2} fill="none" strokeLinecap="round" />
        <text x={22} y={23} fill="#e11d48">Alta Presión (Gas)</text>

        <path d="M14 176 v10 m-3 -3 l3 3 l3 -3" stroke="#0284c7" strokeWidth={2} fill="none" strokeLinecap="round" />
        <text x={22} y={185} fill="#0284c7">Baja Presión (Líquido)</text>
      </g>

      {/* Piping paths: Red High Pressure (top half) */}
      <path d={`M${L} ${M} V${T} H${R} V${M}`} fill="none" stroke="#f43f5e" strokeWidth={5} strokeLinejoin="round" />
      <path d={`M${L} ${M} V${T} H${R} V${M}`} fill="none" stroke="#ffe4e6" strokeWidth={1.8} strokeLinejoin="round" className="animate-flow-line" />

      {/* Piping paths: Blue Low Pressure (bottom half) */}
      <path d={`M${R} ${M} V${B} H${L} V${M}`} fill="none" stroke="#0284c7" strokeWidth={5} strokeLinejoin="round" />
      <path d={`M${R} ${M} V${B} H${L} V${M}`} fill="none" stroke="#e0f2fe" strokeWidth={1.8} strokeLinejoin="round" className="animate-flow-line" />

      {/* Directional chevrons along pipes */}
      <Chevron x={L} y={T + 18} dir="up" color="#e11d48" />
      <Chevron x={98} y={T} dir="right" color="#e11d48" />
      <Chevron x={252} y={T} dir="right" color="#e11d48" />
      <Chevron x={R} y={T + 18} dir="down" color="#e11d48" />
      <Chevron x={R} y={B - 18} dir="down" color="#0284c7" />
      <Chevron x={252} y={B} dir="left" color="#0284c7" />
      <Chevron x={98} y={B} dir="left" color="#0284c7" />
      <Chevron x={L} y={B - 18} dir="up" color="#0284c7" />

      {/* Condenser (Top) */}
      <g>
        <text x={175} y={T - 18} textAnchor="middle" fontSize={11} fontWeight={600} fill="#1e293b" fontFamily="system-ui, sans-serif">
          Condensador
        </text>
        <rect x={126} y={T - 12} width={98} height={24} rx={5} fill="#fee2e2" stroke="#e11d48" strokeWidth={1.4} />
        {/* Double serpentine */}
        <path d={`M132 ${T - 4} H216 C220 ${T - 4}, 220 ${T + 4}, 216 ${T + 4} H132`} fill="none" stroke="#e11d48" strokeWidth={2.6} strokeLinecap="round" />
        <text x={175} y={T + 30} textAnchor="middle" fontSize={9.5} fontWeight={500} fill="#64748b" fontFamily="system-ui, sans-serif">
          Compresor
        </text>
      </g>

      {/* Evaporator (Bottom) */}
      <g>
        <rect x={126} y={B - 12} width={98} height={24} rx={5} fill="#dbeafe" stroke="#0284c7" strokeWidth={1.4} />
        <path d={`M132 ${B - 4} H216 C220 ${B - 4}, 220 ${B + 4}, 216 ${B + 4} H132`} fill="none" stroke="#0284c7" strokeWidth={2.6} strokeLinecap="round" />
        <text x={175} y={B + 26} textAnchor="middle" fontSize={11} fontWeight={600} fill="#1e293b" fontFamily="system-ui, sans-serif">
          Evaporador
        </text>
      </g>

      {/* Compressor unit (Left) */}
      <g>
        <circle cx={L} cy={M} r={17} fill="#475569" stroke="#1e293b" strokeWidth={1.8} />
        <circle cx={L} cy={M} r={12} fill="#38bdf8" />
        {/* Bolt / motor symbol */}
        <path d={`M${L + 1} ${M - 7} L${L - 3} ${M} H${L} L${L - 2} ${M + 7} L${L + 4} ${M - 1} H${L} Z`} fill="#facc15" stroke="#1e293b" strokeWidth={0.8} />
        <text x={L + 24} y={M + 4} fontSize={10.5} fontWeight={600} fill="#1e293b" fontFamily="system-ui, sans-serif">
          Compresor
        </text>
      </g>

      {/* Expansion Valve (Right) */}
      <g>
        {/* Bow-tie throttle symbol */}
        <path d={`M${R - 8} ${M - 9} L${R + 8} ${M - 9} L${R - 8} ${M + 9} L${R + 8} ${M + 9} Z`} fill="#ffffff" stroke="#1e293b" strokeWidth={1.4} strokeLinejoin="round" />
        <line x1={R} y1={M - 12} x2={R} y2={M + 12} stroke="#1e293b" strokeWidth={1.2} />
        <text x={R - 14} y={M - 3} textAnchor="end" fontSize={10} fontWeight={600} fill="#1e293b" fontFamily="system-ui, sans-serif">
          Válvula de
        </text>
        <text x={R - 14} y={M + 9} textAnchor="end" fontSize={10} fontWeight={600} fill="#1e293b" fontFamily="system-ui, sans-serif">
          Expansión
        </text>
        <text x={R + 14} y={M - 3} textAnchor="start" fontSize={10} fontWeight={600} fill="#1e293b" fontFamily="system-ui, sans-serif">
          Válvula
        </text>
        <text x={R + 14} y={M + 9} textAnchor="start" fontSize={10} fontWeight={600} fill="#1e293b" fontFamily="system-ui, sans-serif">
          de
        </text>
        <text x={R + 14} y={M + 20} textAnchor="start" fontSize={10} fontWeight={600} fill="#1e293b" fontFamily="system-ui, sans-serif">
          Expansión
        </text>
      </g>

      {/* Pressure & Temperature measurement boxes [P, T] */}
      <PTBadge x={74} y={T + 6} />
      <PTBadge x={250} y={T + 6} />
      <PTBadge x={250} y={B - 21} />
      <PTBadge x={74} y={B - 21} />
    </svg>
  );
};

/** Pressure–enthalpy (P-h) chart with saturation dome and cycle. */
export const PhDiagram: React.FC = () => (
  <svg viewBox="0 0 240 135" className="w-full h-full select-none" preserveAspectRatio="xMidYMid meet" role="img" aria-label="Diagrama presión-entalpía">
    <rect width="240" height="135" fill="#ffffff" />
    {/* Grid lines */}
    {[25, 45, 65, 85, 105].map((y) => (
      <line key={y} x1={26} x2={220} y1={y} y2={y} stroke="#f1f5f9" strokeWidth={1} />
    ))}
    {/* Axes */}
    <line x1={26} y1={10} x2={26} y2={118} stroke="#1e293b" strokeWidth={1.5} />
    <line x1={26} y1={118} x2={225} y2={118} stroke="#1e293b" strokeWidth={1.5} />
    <text x={12} y={16} fontSize={8} fontWeight={700} fill="#334155" fontFamily="system-ui, sans-serif" transform="rotate(-90 12 16)">Pressure - enthalpy</text>
    <text x={212} y={130} fontSize={8} fontWeight={700} fill="#334155" fontFamily="system-ui, sans-serif">Enthalpy (kJ/kg)</text>
    
    {/* Saturation dome */}
    <path d="M40 118 C52 38, 96 16, 120 18 C144 20, 172 48, 185 118" fill="#dcfce7" fillOpacity={0.7} stroke="#22c55e" strokeWidth={1.6} />
    <text x={95} y={80} fontSize={7} fill="#166534" fontWeight={600} fontFamily="system-ui, sans-serif">Pressure - enthalpy</text>

    {/* Thermodynamic cycle loop */}
    <path d="M58 40 H192 L162 95 H58 Z" fill="#38bdf8" fillOpacity={0.15} stroke="#0284c7" strokeWidth={1.8} />
    {/* High pressure line */}
    <line x1={58} y1={40} x2={192} y2={40} stroke="#e11d48" strokeWidth={2} />
    {/* Expansion vertical drop */}
    <line x1={58} y1={40} x2={58} y2={95} stroke="#0284c7" strokeWidth={2} />
    {/* Evaporator low pressure */}
    <line x1={58} y1={95} x2={162} y2={95} stroke="#0284c7" strokeWidth={2} />
    {/* Compression curve */}
    <path d="M162 95 Q178 68 192 40" fill="none" stroke="#f59e0b" strokeWidth={2} />

    {/* Corner nodes */}
    {[[58, 40], [192, 40], [162, 95], [58, 95]].map(([x, y], i) => (
      <circle key={i} cx={x} cy={y} r={2.5} fill="#ffffff" stroke="#1e293b" strokeWidth={1.2} />
    ))}
  </svg>
);

/** Manifold gauge set (Simulador de Carga de Refrigerante style). */
export const GaugesIllustration: React.FC = () => {
  return (
    <svg viewBox="0 0 240 135" className="w-full h-full select-none" preserveAspectRatio="xMidYMid meet" role="img" aria-label="Simulador de carga">
      <rect width="240" height="135" fill="#334155" />
      {/* Software window title bar */}
      <rect x={12} y={10} width={216} height={18} rx={3} fill="#475569" />
      <circle cx={22} cy={19} r={2.5} fill="#ef4444" />
      <circle cx={29} cy={19} r={2.5} fill="#f59e0b" />
      <circle cx={36} cy={19} r={2.5} fill="#10b981" />
      <rect x={12} y={28} width={216} height={96} fill="#f8fafc" />

      {/* Gauge 1 (Low pressure / Blue) */}
      <g>
        <circle cx={58} cy={72} r={22} fill="#ffffff" stroke="#94a3b8" strokeWidth={2} />
        <circle cx={58} cy={72} r={17} fill="none" stroke="#0284c7" strokeWidth={2.5} strokeDasharray="60 30" transform="rotate(135 58 72)" />
        <line x1={58} y1={72} x2={48} y2={60} stroke="#0f172a" strokeWidth={1.6} strokeLinecap="round" />
        <circle cx={58} cy={72} r={2.5} fill="#0f172a" />
      </g>

      {/* Gauge 2 (Center main / Yellow-Gold) */}
      <g>
        <circle cx={120} cy={70} r={26} fill="#ffffff" stroke="#e2e8f0" strokeWidth={3} />
        <circle cx={120} cy={70} r={21} fill="none" stroke="#f59e0b" strokeWidth={3} strokeDasharray="80 40" transform="rotate(130 120 70)" />
        <line x1={120} y1={70} x2={124} y2={52} stroke="#dc2626" strokeWidth={1.8} strokeLinecap="round" />
        <circle cx={120} cy={70} r={3} fill="#0f172a" />
      </g>

      {/* Gauge 3 (High pressure / Red) */}
      <g>
        <circle cx={182} cy={72} r={22} fill="#ffffff" stroke="#94a3b8" strokeWidth={2} />
        <circle cx={182} cy={72} r={17} fill="none" stroke="#e11d48" strokeWidth={2.5} strokeDasharray="60 30" transform="rotate(135 182 72)" />
        <line x1={182} y1={72} x2={192} y2={62} stroke="#0f172a" strokeWidth={1.6} strokeLinecap="round" />
        <circle cx={182} cy={72} r={2.5} fill="#0f172a" />
      </g>

      {/* Control sliders/buttons row */}
      <rect x={40} y={105} width={40} height={8} rx={2} fill="#cbd5e1" />
      <rect x={100} y={105} width={40} height={8} rx={2} fill="#cbd5e1" />
      <rect x={160} y={105} width={40} height={8} rx={2} fill="#cbd5e1" />
    </svg>
  );
};

/** Diagnostic decision flowchart matching 'Fuga en Cámara Frigorífica'. */
export const FlowchartIllustration: React.FC = () => (
  <svg viewBox="0 0 240 135" className="w-full h-full select-none" preserveAspectRatio="xMidYMid meet" role="img" aria-label="Diagrama de flujo de diagnóstico">
    <rect width="240" height="135" fill="#ffffff" />
    {/* Connector Lines */}
    <path d="M120 28 V46" stroke="#94a3b8" strokeWidth={1.5} fill="none" />
    <path d="M120 70 V82 M120 82 H60 V95 M120 82 H180 V95" stroke="#94a3b8" strokeWidth={1.5} fill="none" />

    {/* Top node: Diagnóstico (Blue Pill) */}
    <rect x={88} y={12} width={64} height={18} rx={9} fill="#3b82f6" />
    <text x={120} y={24} textAnchor="middle" fontSize={8} fontWeight={600} fill="#ffffff" fontFamily="system-ui, sans-serif">
      Diagnóstico
    </text>

    {/* Mid node: Decision diamond/hexagon (Green) */}
    <polygon points="120,44 150,58 120,72 90,58" fill="#dcfce7" stroke="#16a34a" strokeWidth={1.4} />
    <text x={120} y={57} textAnchor="middle" fontSize={7} fontWeight={600} fill="#166534" fontFamily="system-ui, sans-serif">
      Válvula / P
    </text>
    <text x={120} y={65} textAnchor="middle" fontSize={6} fill="#166534" fontFamily="system-ui, sans-serif">
      Evaporador
    </text>

    {/* Yes / No tags */}
    <text x={84} y={80} fontSize={6.5} fontWeight={600} fill="#64748b" fontFamily="system-ui, sans-serif">Sí</text>
    <text x={152} y={80} fontSize={6.5} fontWeight={600} fill="#64748b" fontFamily="system-ui, sans-serif">No</text>

    {/* Bottom Left: Outcome 1 (Cyan) */}
    <rect x={28} y={95} width={64} height={20} rx={4} fill="#e0f2fe" stroke="#0284c7" strokeWidth={1.2} />
    <text x={60} y={108} textAnchor="middle" fontSize={7} fontWeight={600} fill="#0369a1" fontFamily="system-ui, sans-serif">
      Cámara Frig.
    </text>

    {/* Bottom Right: Outcome 2 (Light Green/Olive) */}
    <rect x={148} y={95} width={64} height={20} rx={4} fill="#dcfce7" stroke="#16a34a" strokeWidth={1.2} />
    <text x={180} y={108} textAnchor="middle" fontSize={7} fontWeight={600} fill="#15803d" fontFamily="system-ui, sans-serif">
      Revisar Gas
    </text>
  </svg>
);
