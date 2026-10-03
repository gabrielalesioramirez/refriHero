import React, { useRef, useEffect, useState, useCallback } from 'react';
import { CIRCUIT_COMPONENTS } from './splitCircuitData';

interface Split3DCanvasProps {
  mode: 'summer' | 'winter';
  isRunning: boolean;
  speed: number;
  showParticles: boolean;
  showTelemetry: boolean;
  showAirflow: boolean;
  selectedComponentId: string | null;
  onSelectComponent: (id: string) => void;
}

interface Particle {
  distance: number; // 0 to 1 along the closed loop
  speedOffset: number;
  radius: number;
  wobble: number;
}

export const Split3DCanvas: React.FC<Split3DCanvasProps> = ({
  mode,
  isRunning,
  speed,
  showParticles,
  showTelemetry,
  showAirflow,
  selectedComponentId,
  onSelectComponent
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [hoveredComponentId, setHoveredComponentId] = useState<string | null>(null);
  const [fanAngle, setFanAngle] = useState<number>(0);
  const [indoorTurbineAngle, setIndoorTurbineAngle] = useState<number>(0);

  // Particles state
  const particlesRef = useRef<Particle[]>([]);

  // Initialize 160 particles
  useEffect(() => {
    const particles: Particle[] = [];
    const count = 160;
    for (let i = 0; i < count; i++) {
      particles.push({
        distance: i / count,
        speedOffset: 0.85 + Math.random() * 0.3,
        radius: 2.2 + Math.random() * 1.6,
        wobble: Math.random() * Math.PI * 2
      });
    }
    particlesRef.current = particles;
  }, []);

  // Hitbox detection regions (normalized relative to canvas width & height)
  const getClickableZones = useCallback((w: number, h: number) => {
    return [
      {
        id: 'compressor',
        x: w * 0.16,
        y: h * 0.58,
        width: w * 0.11,
        height: h * 0.28,
        label: 'Compresor'
      },
      {
        id: 'reversing_valve',
        x: w * 0.21,
        y: h * 0.38,
        width: w * 0.08,
        height: h * 0.12,
        label: 'Válvula 4 Vías'
      },
      {
        id: 'condenser',
        x: w * 0.05,
        y: h * 0.30,
        width: w * 0.08,
        height: h * 0.54,
        label: mode === 'summer' ? 'Condensador Ext.' : 'Evaporador Ext.'
      },
      {
        id: 'outdoor_fan',
        x: w * 0.13,
        y: h * 0.32,
        width: w * 0.12,
        height: h * 0.22,
        label: 'Forzador Exterior'
      },
      {
        id: 'expansion_device',
        x: w * 0.32,
        y: h * 0.72,
        width: w * 0.07,
        height: h * 0.12,
        label: 'Tubo Capilar / VET'
      },
      {
        id: 'liquid_line',
        x: w * 0.38,
        y: h * 0.69,
        width: w * 0.28,
        height: h * 0.08,
        label: 'Línea de Líquido 1/4"'
      },
      {
        id: 'suction_line',
        x: w * 0.30,
        y: h * 0.44,
        width: w * 0.36,
        height: h * 0.08,
        label: 'Línea de Succión 3/8"'
      },
      {
        id: 'evaporator',
        x: w * 0.70,
        y: h * 0.24,
        width: w * 0.24,
        height: h * 0.34,
        label: mode === 'summer' ? 'Evaporador Interior' : 'Condensador Interior'
      },
      {
        id: 'indoor_turbine',
        x: w * 0.72,
        y: h * 0.38,
        width: w * 0.20,
        height: h * 0.14,
        label: 'Turbina Tangencial'
      }
    ];
  }, [mode]);

  // Handle Mouse Click on Canvas
  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const zones = getClickableZones(canvas.width, canvas.height);
    for (const zone of zones) {
      if (
        x >= zone.x &&
        x <= zone.x + zone.width &&
        y >= zone.y &&
        y <= zone.y + zone.height
      ) {
        onSelectComponent(zone.id);
        return;
      }
    }
  };

  // Handle Mouse Move for Hover Detection
  const handleCanvasMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const zones = getClickableZones(canvas.width, canvas.height);
    let found: string | null = null;
    for (const zone of zones) {
      if (
        x >= zone.x &&
        x <= zone.x + zone.width &&
        y >= zone.y &&
        y <= zone.y + zone.height
      ) {
        found = zone.id;
        break;
      }
    }
    setHoveredComponentId(found);
  };

  // Main Render Loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;

    // Helper: interpolate point along circuit polyline
    // Circuit coordinates in normalized percentage (0 to 1)
    const getPathPoints = () => {
      if (mode === 'summer') {
        return [
          // 1. Compressor Discharge
          { x: 0.21, y: 0.60, color: '#ff2a2a', state: 'discharge_hot_gas', temp: '88°C', press: '370 psig' },
          // 2. Up to 4-Way Valve Top
          { x: 0.23, y: 0.44, color: '#ff3a20', state: 'discharge_hot_gas' },
          // 3. Out of 4-Way to Condenser Top
          { x: 0.10, y: 0.33, color: '#ff4d00', state: 'condenser_desuperheating', temp: '80°C' },
          // 4. Down through Condenser Coil
          { x: 0.08, y: 0.45, color: '#ff6200', state: 'condensing_two_phase', temp: '52°C' },
          { x: 0.10, y: 0.58, color: '#ff7700', state: 'condensing_two_phase' },
          { x: 0.08, y: 0.72, color: '#e11d48', state: 'subcooled_liquid', temp: '44°C', press: '365 psig' },
          // 5. To Expansion Valve (Capillary)
          { x: 0.33, y: 0.76, color: '#be123c', state: 'subcooled_liquid' },
          // 6. Through Capillary Loop (Drop into Flash Gas Cyan)
          { x: 0.38, y: 0.73, color: '#06b6d4', state: 'flash_gas', temp: '5°C', press: '120 psig' },
          // 7. Through Liquid Line (Wall penetration)
          { x: 0.52, y: 0.72, color: '#0ea5e9', state: 'evaporating_liquid' },
          { x: 0.70, y: 0.70, color: '#0284c7', state: 'evaporating_liquid' },
          // 8. Entering Indoor Evaporator
          { x: 0.74, y: 0.50, color: '#0284c7', state: 'evaporating_liquid', temp: '5°C' },
          { x: 0.88, y: 0.32, color: '#38bdf8', state: 'evaporating_two_phase' },
          { x: 0.76, y: 0.28, color: '#2563eb', state: 'superheated_gas', temp: '11°C', press: '118 psig' },
          // 9. Leaving Evaporator into Suction Line (Return via wall)
          { x: 0.68, y: 0.47, color: '#1d4ed8', state: 'suction_return' },
          { x: 0.48, y: 0.48, color: '#1e40af', state: 'suction_return', temp: '12°C', press: '118 psig' },
          // 10. To 4-Way Valve Suction Port
          { x: 0.24, y: 0.44, color: '#1e3a8a', state: 'suction_return' },
          // 11. Down into Compressor Suction Accumulator
          { x: 0.18, y: 0.62, color: '#1e3a8a', state: 'compressor_suction' },
          // 12. Bottom of Compressor
          { x: 0.21, y: 0.78, color: '#991b1b', state: 'compression_stroke' }
        ];
      } else {
        // Winter / Heating Mode: Reversing valve shifts!
        return [
          // 1. Compressor Discharge
          { x: 0.21, y: 0.60, color: '#ff2a2a', state: 'discharge_hot_gas', temp: '92°C', press: '400 psig' },
          // 2. Up to 4-Way Valve Top
          { x: 0.23, y: 0.44, color: '#ff3a20', state: 'discharge_hot_gas' },
          // 3. 4-Way Valve switches to Gas Line leading to Indoor Unit!
          { x: 0.48, y: 0.48, color: '#ff4d00', state: 'indoor_heating_gas', temp: '88°C', press: '395 psig' },
          { x: 0.68, y: 0.47, color: '#ff6200', state: 'indoor_heating_gas' },
          // 4. Enters Indoor Coil (now CONDENSER ceding heat to room!)
          { x: 0.76, y: 0.28, color: '#ff7700', state: 'indoor_condensing' },
          { x: 0.88, y: 0.32, color: '#e11d48', state: 'indoor_condensing' },
          { x: 0.74, y: 0.50, color: '#be123c', state: 'indoor_subcooling', temp: '40°C', press: '390 psig' },
          // 5. Leaves Indoor Unit via liquid line returning outdoors
          { x: 0.70, y: 0.70, color: '#9f1239', state: 'liquid_line_return' },
          { x: 0.52, y: 0.72, color: '#be123c', state: 'liquid_line_return' },
          { x: 0.38, y: 0.73, color: '#be123c', state: 'liquid_before_expansion' },
          // 6. Through Expansion Valve outdoors (Flash into freezing cold)
          { x: 0.33, y: 0.76, color: '#06b6d4', state: 'expansion_cold', temp: '-5°C', press: '78 psig' },
          // 7. Enters Outdoor Coil (now EVAPORATOR absorbing outdoor heat!)
          { x: 0.08, y: 0.72, color: '#0ea5e9', state: 'outdoor_evaporating' },
          { x: 0.10, y: 0.58, color: '#0284c7', state: 'outdoor_evaporating' },
          { x: 0.08, y: 0.45, color: '#38bdf8', state: 'outdoor_evaporating' },
          { x: 0.10, y: 0.33, color: '#2563eb', state: 'outdoor_superheating', temp: '2°C', press: '76 psig' },
          // 8. Returns to 4-Way Valve and into Compressor Suction
          { x: 0.24, y: 0.44, color: '#1d4ed8', state: 'suction_return' },
          { x: 0.18, y: 0.62, color: '#1e3a8a', state: 'compressor_suction' },
          { x: 0.21, y: 0.78, color: '#991b1b', state: 'compression_stroke' }
        ];
      }
    };

    const pathPoints = getPathPoints();

    // Helper: calculate total path length & interpolate position along loop
    const polyline = pathPoints.map(p => ({ x: p.x * canvas.width, y: p.y * canvas.height, color: p.color }));
    const segmentLengths: number[] = [];
    let totalLength = 0;
    for (let i = 0; i < polyline.length; i++) {
      const nextIdx = (i + 1) % polyline.length;
      const dx = polyline[nextIdx].x - polyline[i].x;
      const dy = polyline[nextIdx].y - polyline[i].y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      segmentLengths.push(dist);
      totalLength += dist;
    }

    const getPointAtDistance = (distRatio: number) => {
      let targetDist = (distRatio % 1) * totalLength;
      if (targetDist < 0) targetDist += totalLength;

      let accumulated = 0;
      for (let i = 0; i < polyline.length; i++) {
        const segLen = segmentLengths[i];
        if (accumulated + segLen >= targetDist) {
          const segRatio = (targetDist - accumulated) / (segLen || 1);
          const nextIdx = (i + 1) % polyline.length;
          const p1 = polyline[i];
          const p2 = polyline[nextIdx];
          return {
            x: p1.x + (p2.x - p1.x) * segRatio,
            y: p1.y + (p2.y - p1.y) * segRatio,
            color: p1.color
          };
        }
        accumulated += segLen;
      }
      return polyline[0];
    };

    const render = () => {
      const w = canvas.width;
      const h = canvas.height;

      ctx.clearRect(0, 0, w, h);

      // 1. Architectural Environment Background (Split Wall Installation)
      // Left = Exterior (Outdoor Patio / Balcony), Right = Interior Room
      const wallX = w * 0.46;

      // Outdoor area backdrop
      const outdoorGrad = ctx.createLinearGradient(0, 0, wallX, 0);
      outdoorGrad.addColorStop(0, '#090d16');
      outdoorGrad.addColorStop(1, '#0f172a');
      ctx.fillStyle = outdoorGrad;
      ctx.fillRect(0, 0, wallX, h);

      // Indoor room backdrop
      const indoorGrad = ctx.createLinearGradient(wallX + 40, 0, w, 0);
      indoorGrad.addColorStop(0, '#0f172a');
      indoorGrad.addColorStop(1, '#0b1120');
      ctx.fillStyle = indoorGrad;
      ctx.fillRect(wallX + 40, 0, w - (wallX + 40), h);

      // Section wall (Brick / Concrete Cutaway)
      const wallGrad = ctx.createLinearGradient(wallX, 0, wallX + 40, 0);
      wallGrad.addColorStop(0, '#334155');
      wallGrad.addColorStop(0.5, '#475569');
      wallGrad.addColorStop(1, '#334155');
      ctx.fillStyle = wallGrad;
      ctx.fillRect(wallX, 0, 40, h);

      // Wall label banners
      ctx.font = '10px monospace';
      ctx.fillStyle = '#64748b';
      ctx.fillText('PARED EXTERIOR', wallX - 95, 24);
      ctx.fillText('HABITACIÓN INTERIOR', wallX + 55, 24);

      // Wall installation pass-through hole (Pasamuros)
      ctx.fillStyle = '#1e293b';
      ctx.beginPath();
      ctx.ellipse(wallX + 20, h * 0.60, 22, 55, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = '#475569';
      ctx.lineWidth = 2;
      ctx.stroke();

      // Floor line for outdoor unit
      ctx.strokeStyle = '#334155';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(w * 0.02, h * 0.88);
      ctx.lineTo(wallX, h * 0.88);
      ctx.stroke();

      // Outdoor mounting brackets / rubber pads (Tacos antivibratorios)
      ctx.fillStyle = '#1e293b';
      ctx.fillRect(w * 0.06, h * 0.86, 32, 10);
      ctx.fillRect(w * 0.22, h * 0.86, 32, 10);

      // -------------------------------------------------------------
      // 2. CHASSIS RENDERING: OUTDOOR & INDOOR UNITS
      // -------------------------------------------------------------

      // Outdoor Condensing Unit Chassis
      const outX = w * 0.04;
      const outY = h * 0.24;
      const outW = w * 0.28;
      const outH = h * 0.62;

      // Chassis body
      ctx.fillStyle = 'rgba(15, 23, 42, 0.85)';
      ctx.strokeStyle = hoveredComponentId === 'condenser' || hoveredComponentId === 'compressor' ? '#38bdf8' : '#334155';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.roundRect(outX, outY, outW, outH, 16);
      ctx.fill();
      ctx.stroke();

      // Unit name tag
      ctx.font = 'bold 11px monospace';
      ctx.fillStyle = '#94a3b8';
      ctx.fillText('UNIDAD EXTERIOR (CONDENSADORA)', outX + 16, outY + 22);

      // Indoor Split Evaporator Chassis (High-Wall)
      const inX = w * 0.66;
      const inY = h * 0.20;
      const inW = w * 0.30;
      const inH = h * 0.44;

      ctx.fillStyle = 'rgba(15, 23, 42, 0.9)';
      ctx.strokeStyle = hoveredComponentId === 'evaporator' || hoveredComponentId === 'indoor_turbine' ? '#38bdf8' : '#334155';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.roundRect(inX, inY, inW, inH, 20);
      ctx.fill();
      ctx.stroke();

      // Indoor Unit Name tag & Digital Display
      ctx.font = 'bold 11px monospace';
      ctx.fillStyle = '#94a3b8';
      ctx.fillText('UNIDAD INTERIOR (SPLIT HIGH-WALL)', inX + 16, inY + 24);

      // Digital LED Display on Indoor Unit
      const ledX = inX + inW - 65;
      const ledY = inY + 14;
      ctx.fillStyle = '#020617';
      ctx.fillRect(ledX, ledY, 50, 22);
      ctx.strokeStyle = '#1e293b';
      ctx.strokeRect(ledX, ledY, 50, 22);

      ctx.font = 'bold 13px monospace';
      ctx.fillStyle = mode === 'summer' ? '#38bdf8' : '#f97316';
      ctx.fillText(mode === 'summer' ? '24°C' : '26°C', ledX + 8, ledY + 16);

      // -------------------------------------------------------------
      // 3. COMPONENT DETAIL RENDERING
      // -------------------------------------------------------------

      // (A) OUTDOOR CONDENSER COIL (Finned Tubes)
      const isCondSelected = selectedComponentId === 'condenser' || hoveredComponentId === 'condenser';
      ctx.fillStyle = isCondSelected ? 'rgba(249, 115, 22, 0.25)' : 'rgba(30, 41, 59, 0.6)';
      ctx.strokeStyle = isCondSelected ? '#f97316' : '#475569';
      ctx.lineWidth = isCondSelected ? 3 : 1.5;
      ctx.beginPath();
      ctx.roundRect(w * 0.05, h * 0.30, w * 0.07, h * 0.52, 10);
      ctx.fill();
      ctx.stroke();

      // Condenser Aluminum Fins representation
      ctx.strokeStyle = isCondSelected ? '#fdba74' : '#334155';
      ctx.lineWidth = 1;
      for (let finY = h * 0.32; finY < h * 0.80; finY += 10) {
        ctx.beginPath();
        ctx.moveTo(w * 0.055, finY);
        ctx.lineTo(w * 0.115, finY);
        ctx.stroke();
      }

      // (B) OUTDOOR FAN (Motor + Rotating Axial Blades)
      const fanCenterX = w * 0.18;
      const fanCenterY = h * 0.44;

      ctx.save();
      ctx.translate(fanCenterX, fanCenterY);
      ctx.rotate(fanAngle);

      // Fan hub
      ctx.fillStyle = '#1e293b';
      ctx.beginPath();
      ctx.arc(0, 0, 14, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = '#475569';
      ctx.stroke();

      // 3 Aerodynamic blades
      for (let b = 0; b < 3; b++) {
        ctx.rotate((Math.PI * 2) / 3);
        ctx.fillStyle = selectedComponentId === 'outdoor_fan' ? '#f59e0b' : 'rgba(100, 116, 139, 0.85)';
        ctx.beginPath();
        ctx.ellipse(22, 0, 18, 9, 0.3, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.restore();

      // (C) HERMETIC COMPRESSOR (Scroll / Rotary Cutaway)
      const compX = w * 0.16;
      const compY = h * 0.58;
      const compW = w * 0.10;
      const compH = h * 0.26;
      const isCompSelected = selectedComponentId === 'compressor' || hoveredComponentId === 'compressor';

      // Compressor Black Cylindrical Shell
      ctx.fillStyle = isCompSelected ? 'rgba(239, 68, 68, 0.3)' : '#0f172a';
      ctx.strokeStyle = isCompSelected ? '#ef4444' : '#64748b';
      ctx.lineWidth = isCompSelected ? 3 : 2;
      ctx.beginPath();
      ctx.roundRect(compX, compY, compW, compH, [24, 24, 12, 12]);
      ctx.fill();
      ctx.stroke();

      // Suction Accumulator (Tubo recibidor de succión al costado)
      ctx.fillStyle = '#1e293b';
      ctx.strokeStyle = '#475569';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.roundRect(compX - 18, compY + 20, 16, compH - 35, 8);
      ctx.fill();
      ctx.stroke();

      // Compressor label on body
      ctx.font = 'bold 9px monospace';
      ctx.fillStyle = isCompSelected ? '#fca5a5' : '#94a3b8';
      ctx.fillText('COMPRESOR', compX + 10, compY + compH * 0.45);
      ctx.font = '8px monospace';
      ctx.fillStyle = '#64748b';
      ctx.fillText('INVERTER', compX + 14, compY + compH * 0.58);

      // (D) 4-WAY REVERSING VALVE (Válvula Inversora)
      const vX = w * 0.21;
      const vY = h * 0.38;
      const isVSelected = selectedComponentId === 'reversing_valve' || hoveredComponentId === 'reversing_valve';

      // Brass body
      ctx.fillStyle = isVSelected ? '#a855f7' : '#d97706';
      ctx.strokeStyle = isVSelected ? '#c084fc' : '#b45309';
      ctx.lineWidth = isVSelected ? 3 : 1.5;
      ctx.beginPath();
      ctx.roundRect(vX, vY, 44, 20, 6);
      ctx.fill();
      ctx.stroke();

      // Solenoid pilot coil (electroválvula)
      ctx.fillStyle = '#3b82f6';
      ctx.fillRect(vX + 38, vY - 8, 12, 16);

      // Ports (1 top discharge, 3 bottom ports)
      ctx.fillStyle = '#78350f';
      ctx.fillRect(vX + 18, vY - 8, 8, 8);
      ctx.fillRect(vX + 6, vY + 20, 8, 8);
      ctx.fillRect(vX + 18, vY + 20, 8, 8);
      ctx.fillRect(vX + 30, vY + 20, 8, 8);

      // (E) EXPANSION DEVICE (Tubo capilar en espiral / VET)
      const capX = w * 0.32;
      const capY = h * 0.72;
      const isCapSelected = selectedComponentId === 'expansion_device' || hoveredComponentId === 'expansion_device';

      ctx.strokeStyle = isCapSelected ? '#06b6d4' : '#0891b2';
      ctx.lineWidth = isCapSelected ? 4 : 2.5;
      ctx.beginPath();
      // Capillary coils
      for (let c = 0; c < 4; c++) {
        ctx.arc(capX + c * 10, capY + 6, 8, 0, Math.PI * 2);
      }
      ctx.stroke();

      // (F) INDOOR EVAPORATOR COIL (Multi-fold Blue Hydrophilic Fins)
      const evapX = w * 0.70;
      const evapY = h * 0.24;
      const evapW = w * 0.24;
      const evapH = h * 0.34;
      const isEvapSelected = selectedComponentId === 'evaporator' || hoveredComponentId === 'evaporator';

      ctx.fillStyle = isEvapSelected ? 'rgba(59, 130, 246, 0.25)' : 'rgba(30, 58, 138, 0.2)';
      ctx.strokeStyle = isEvapSelected ? '#3b82f6' : '#1e40af';
      ctx.lineWidth = isEvapSelected ? 3 : 1.5;
      ctx.beginPath();
      ctx.roundRect(evapX, evapY, evapW, evapH, 12);
      ctx.fill();
      ctx.stroke();

      // Multi-circuit evaporator bends
      ctx.strokeStyle = isEvapSelected ? '#60a5fa' : '#2563eb';
      ctx.lineWidth = 1.5;
      for (let ey = evapY + 16; ey < evapY + evapH - 12; ey += 16) {
        ctx.beginPath();
        ctx.moveTo(evapX + 14, ey);
        ctx.lineTo(evapX + evapW - 14, ey);
        ctx.stroke();
      }

      // (G) INDOOR TANGENTIAL TURBINE (Cross-Flow Fan)
      const turbX = w * 0.73;
      const turbY = h * 0.40;
      const turbW = w * 0.18;
      const turbH = 26;
      const isTurbSelected = selectedComponentId === 'indoor_turbine' || hoveredComponentId === 'indoor_turbine';

      ctx.fillStyle = isTurbSelected ? 'rgba(16, 185, 129, 0.3)' : 'rgba(15, 23, 42, 0.9)';
      ctx.strokeStyle = isTurbSelected ? '#10b981' : '#334155';
      ctx.lineWidth = isTurbSelected ? 3 : 1.5;
      ctx.beginPath();
      ctx.roundRect(turbX, turbY, turbW, turbH, 13);
      ctx.fill();
      ctx.stroke();

      // Tangential blades pattern with animation
      ctx.strokeStyle = isTurbSelected ? '#34d399' : '#475569';
      ctx.lineWidth = 1;
      const bladeOffset = (indoorTurbineAngle * 10) % 18;
      for (let bx = turbX + 8 + bladeOffset; bx < turbX + turbW - 8; bx += 14) {
        ctx.beginPath();
        ctx.moveTo(bx, turbY + 4);
        ctx.lineTo(bx - 6, turbY + turbH - 4);
        ctx.stroke();
      }

      // Airflow motorized deflector louver at bottom of split
      ctx.fillStyle = '#334155';
      ctx.fillRect(inX + 24, inY + inH - 12, inW - 48, 6);

      // -------------------------------------------------------------
      // 4. ANIMATED AIRFLOW STREAMERS (HOT / COLD AIRFLOW)
      // -------------------------------------------------------------
      if (showAirflow) {
        // Indoor Airflow (blowing out into room)
        const airColor = mode === 'summer' ? 'rgba(56, 189, 248, 0.35)' : 'rgba(251, 146, 60, 0.4)';
        ctx.fillStyle = airColor;

        for (let af = 0; af < 3; af++) {
          const wavePhase = (Date.now() / 600 + af * 1.8) % (Math.PI * 2);
          const blowX = inX + 40 + af * 55;
          const blowY = inY + inH + 10 + Math.sin(wavePhase) * 6;

          ctx.beginPath();
          ctx.ellipse(blowX, blowY, 24, 8, 0.25, 0, Math.PI * 2);
          ctx.fill();
        }

        // Outdoor Airflow (axial discharge from condenser)
        const outAirColor = mode === 'summer' ? 'rgba(239, 68, 68, 0.3)' : 'rgba(56, 189, 248, 0.3)';
        ctx.fillStyle = outAirColor;
        for (let of = 0; of < 2; of++) {
          const wavePhaseOut = (Date.now() / 500 + of * 2.2) % (Math.PI * 2);
          const outBlowX = outX + outW * 0.4 + of * 40;
          const outBlowY = outY - 14 - Math.sin(wavePhaseOut) * 8;
          ctx.beginPath();
          ctx.ellipse(outBlowX, outBlowY, 20, 6, -0.2, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      // -------------------------------------------------------------
      // 5. COPPER PIPES & CIRCUIT PATH RENDERING
      // -------------------------------------------------------------
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';

      // Pipe glow & outline background
      ctx.beginPath();
      polyline.forEach((p, idx) => {
        if (idx === 0) ctx.moveTo(p.x, p.y);
        else ctx.lineTo(p.x, p.y);
      });
      ctx.closePath();
      ctx.strokeStyle = 'rgba(15, 23, 42, 0.95)';
      ctx.lineWidth = 14;
      ctx.stroke();

      // Colored dynamic gradient piping
      for (let i = 0; i < polyline.length; i++) {
        const nextIdx = (i + 1) % polyline.length;
        const p1 = polyline[i];
        const p2 = polyline[nextIdx];

        const grad = ctx.createLinearGradient(p1.x, p1.y, p2.x, p2.y);
        grad.addColorStop(0, p1.color);
        grad.addColorStop(1, p2.color);

        ctx.strokeStyle = grad;
        ctx.lineWidth = 7;
        ctx.beginPath();
        ctx.moveTo(p1.x, p1.y);
        ctx.lineTo(p2.x, p2.y);
        ctx.stroke();
      }

      // Pipe inner glow
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
      ctx.lineWidth = 2;
      ctx.stroke();

      // -------------------------------------------------------------
      // 6. ANIMATED REFRIGERANT PARTICLES
      // -------------------------------------------------------------
      if (showParticles) {
        particlesRef.current.forEach((particle) => {
          if (isRunning) {
            // Advance along closed path
            particle.distance += 0.0025 * speed * particle.speedOffset;
            if (particle.distance >= 1) particle.distance -= 1;
          }

          const pos = getPointAtDistance(particle.distance);

          // Render particle with radial glow
          ctx.fillStyle = pos.color;
          ctx.shadowColor = pos.color;
          ctx.shadowBlur = 8;

          ctx.beginPath();
          ctx.arc(pos.x, pos.y, particle.radius, 0, Math.PI * 2);
          ctx.fill();

          ctx.shadowBlur = 0; // reset
        });
      }

      // -------------------------------------------------------------
      // 7. TELEMETRY & PHASE CALLOUT BANNERS
      // -------------------------------------------------------------
      if (showTelemetry) {
        const renderTag = (x: number, y: number, title: string, subtitle: string, color: string) => {
          ctx.save();
          ctx.fillStyle = 'rgba(2, 6, 23, 0.85)';
          ctx.strokeStyle = color;
          ctx.lineWidth = 1.5;
          ctx.beginPath();
          ctx.roundRect(x - 4, y - 18, 140, 32, 6);
          ctx.fill();
          ctx.stroke();

          ctx.font = 'bold 9px monospace';
          ctx.fillStyle = color;
          ctx.fillText(title, x + 4, y - 6);
          ctx.font = '8px monospace';
          ctx.fillStyle = '#cbd5e1';
          ctx.fillText(subtitle, x + 4, y + 8);
          ctx.restore();
        };

        if (mode === 'summer') {
          // Discharge Tag
          renderTag(w * 0.12, h * 0.28, 'DESCARGA (ALTA)', '88°C | 370 psig | Gas', '#ef4444');
          // Liquid Line Tag
          renderTag(w * 0.44, h * 0.78, 'LÍNEA DE LÍQUIDO', '44°C | 365 psig | Líquido', '#f97316');
          // Evaporator Tag
          renderTag(w * 0.74, h * 0.18, 'EVAPORACIÓN (BAJA)', '5°C | 120 psig | Ebullición', '#38bdf8');
          // Suction Tag
          renderTag(w * 0.44, h * 0.40, 'LÍNEA DE SUCCIÓN', '11°C | 118 psig | Recalent.', '#2563eb');
        } else {
          // Winter Telemetry
          renderTag(w * 0.44, h * 0.40, 'GAS CALIENTE A CONSOLA', '90°C | 395 psig | Calefacción', '#ef4444');
          renderTag(w * 0.74, h * 0.18, 'CONSOLA INTERIOR (COND.)', '42°C | 390 psig | Cede calor', '#f97316');
          renderTag(w * 0.44, h * 0.78, 'RETORNO DE LÍQUIDO', '38°C | 388 psig | Hacia ext.', '#f59e0b');
          renderTag(w * 0.08, h * 0.28, 'SERPENTÍN EXTERIOR (EVAP.)', '2°C | 76 psig | Absorbe calor', '#38bdf8');
        }
      }

      // Update fan rotations if running
      if (isRunning) {
        setFanAngle(prev => (prev + 0.08 * speed) % (Math.PI * 2));
        setIndoorTurbineAngle(prev => (prev + 0.12 * speed) % (Math.PI * 2));
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [
    mode,
    isRunning,
    speed,
    showParticles,
    showTelemetry,
    showAirflow,
    selectedComponentId,
    hoveredComponentId,
    fanAngle,
    indoorTurbineAngle,
    getClickableZones
  ]);

  // Handle Resize smoothly
  useEffect(() => {
    const handleResize = () => {
      const container = containerRef.current;
      const canvas = canvasRef.current;
      if (!container || !canvas) return;

      const rect = container.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);

      canvas.width = rect.width * dpr;
      canvas.height = Math.max(rect.width * 0.52, 420) * dpr;

      canvas.style.width = `${rect.width}px`;
      canvas.style.height = `${Math.max(rect.width * 0.52, 420)}px`;

      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.scale(dpr, dpr);
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div ref={containerRef} className="relative w-full rounded-3xl overflow-hidden shadow-2xl border border-frost-800 bg-frost-950 select-none">
      <canvas
        ref={canvasRef}
        onClick={handleCanvasClick}
        onMouseMove={handleCanvasMouseMove}
        onMouseLeave={() => setHoveredComponentId(null)}
        className="w-full h-auto cursor-pointer block"
      />

      {/* Hover Tooltip Overlay */}
      {hoveredComponentId && CIRCUIT_COMPONENTS[hoveredComponentId] && (
        <div className="absolute top-4 left-4 z-20 pointer-events-none bg-frost-900/90 backdrop-blur-md border border-frost-700 p-3 rounded-2xl shadow-xl max-w-xs animate-fadeIn">
          <div className="flex items-center gap-2 mb-1">
            <span
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: CIRCUIT_COMPONENTS[hoveredComponentId].color }}
            />
            <span className="text-xs font-mono font-bold text-white">
              {CIRCUIT_COMPONENTS[hoveredComponentId].name}
            </span>
          </div>
          <p className="text-[11px] text-frost-300 leading-tight">
            {CIRCUIT_COMPONENTS[hoveredComponentId].role}
          </p>
          <span className="text-[10px] text-amber-400 font-mono mt-1.5 block font-semibold">
            👉 Haz clic para ver análisis termodinámico y pauta docente
          </span>
        </div>
      )}

      {/* Mode Status Pill on Bottom Right of Canvas */}
      <div className="absolute bottom-4 right-4 z-10 flex items-center gap-2 bg-frost-950/80 backdrop-blur-md border border-frost-800 px-3.5 py-1.5 rounded-full text-xs font-mono">
        <span className={`w-2.5 h-2.5 rounded-full animate-pulse ${mode === 'summer' ? 'bg-cyan-400' : 'bg-orange-500'}`} />
        <span className="text-frost-300 font-semibold">
          {mode === 'summer' ? 'CICLO FRÍO (REFRIGERACIÓN)' : 'CICLO CALOR (BOMBA DE CALOR)'}
        </span>
      </div>
    </div>
  );
};
