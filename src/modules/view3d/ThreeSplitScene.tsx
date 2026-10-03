import React, { useRef, useEffect, useState, useCallback } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { RotateCcw } from 'lucide-react';

interface ThreeSplitSceneProps {
  mode: 'summer' | 'winter';
  isRunning: boolean;
  speed: number;
  showParticles: boolean;
  showAirflow: boolean;
  selectedComponentId: string | null;
  onSelectComponent: (id: string | null) => void;
  cameraPreset: string;
  resetTrigger?: number;
}

interface ComponentTarget {
  id: string;
  name: string;
  center: THREE.Vector3;
  cameraPos: THREE.Vector3;
}

interface HudAnchor {
  id: string;
  label: string;
  sublabel: string;
  worldPos: THREE.Vector3;
  screenX: number;
  screenY: number;
  visible: boolean;
  type?: 'primary' | 'secondary';
  secondaryWorldPos?: THREE.Vector3;
}

export const ThreeSplitScene: React.FC<ThreeSplitSceneProps> = ({
  mode,
  isRunning,
  speed,
  showParticles,
  showAirflow,
  selectedComponentId,
  onSelectComponent,
  cameraPreset,
  resetTrigger
}) => {
  const mountRef = useRef<HTMLDivElement | null>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const controlsRef = useRef<OrbitControls | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);

  // Targets for raycasting & component clicking
  const interactiveMeshesRef = useRef<THREE.Mesh[]>([]);
  const componentTargetsRef = useRef<Record<string, ComponentTarget>>({});

  // Animation references
  const outdoorFanMeshRef = useRef<THREE.Object3D | null>(null);
  const indoorTurbineMeshRef = useRef<THREE.Object3D | null>(null);
  const scrollOrbitRef = useRef<THREE.Group | null>(null);
  const compressorShaftRef = useRef<THREE.Object3D | null>(null);
  const airflowGroupRef = useRef<THREE.Group | null>(null);

  // Refrigerant Particles & Bubbles
  const particlesMeshRef = useRef<THREE.InstancedMesh | null>(null);
  const particleColorsRef = useRef<THREE.Color[]>([]);
  const particleDistancesRef = useRef<number[]>([]);

  // Two-phase effervescent expanding bubbles (post-expansion)
  const bubblesMeshRef = useRef<THREE.InstancedMesh | null>(null);
  const bubbleOffsetsRef = useRef<{ t: number; wobbleSpeed: number; wobblePhase: number; maxRadius: number }[]>([]);

  // Curves
  const curveSummerRef = useRef<THREE.CatmullRomCurve3 | null>(null);
  const curveWinterRef = useRef<THREE.CatmullRomCurve3 | null>(null);

  // 1. Initial / Default camera and target positions stored in refs upon mounting
  const defaultCameraPosition = useRef<THREE.Vector3>(new THREE.Vector3(16, 14, 20));
  const defaultTarget = useRef<THREE.Vector3>(new THREE.Vector3(0, 3.5, 0));
  const transitionAnimIdRef = useRef<number | null>(null);

  // HUD 2D Screen-projected Leader Labels
  const [hudLabels, setHudLabels] = useState<HudAnchor[]>([
    {
      id: 'compressor',
      label: 'COMPRESOR',
      sublabel: 'Scroll Mechanism Cutaway',
      worldPos: new THREE.Vector3(-7.5, 3.5, 1.2),
      secondaryWorldPos: new THREE.Vector3(-7.5, 2.0, 1.2),
      screenX: 0,
      screenY: 0,
      visible: true
    },
    {
      id: 'condenser',
      label: 'CONDENSER COIL',
      sublabel: 'Heat Rejection (Finned Coil)',
      worldPos: new THREE.Vector3(-11.5, 3.8, 0),
      screenX: 0,
      screenY: 0,
      visible: true
    },
    {
      id: 'expansion_device',
      label: 'METERING DEVICE',
      sublabel: 'Capillary Tube (Flash Gas)',
      worldPos: new THREE.Vector3(-6.0, 1.5, -1.6),
      screenX: 0,
      screenY: 0,
      visible: true
    },
    {
      id: 'evaporator',
      label: 'EVAPORATOR COIL',
      sublabel: 'Heat Absorption (Indoor)',
      worldPos: new THREE.Vector3(8.5, 6.2, 0),
      screenX: 0,
      screenY: 0,
      visible: true
    }
  ]);

  // 1. Define 3D CatmullRom curves for refrigerant circuits
  useEffect(() => {
    // Summer Loop Points (Cooling Mode)
    const ptsSummer = [
      new THREE.Vector3(-7.5, 3.3, 1.2), // Compressor discharge
      new THREE.Vector3(-7.2, 4.4, 0.4), // 4-way valve top
      new THREE.Vector3(-9.2, 4.8, 0.4),
      new THREE.Vector3(-11.2, 4.8, 0.2), // Condenser top
      new THREE.Vector3(-11.5, 4.0, 1.8),
      new THREE.Vector3(-11.5, 3.0, -1.8),
      new THREE.Vector3(-11.5, 2.0, 1.8),
      new THREE.Vector3(-11.0, 1.4, -0.5), // Condenser bottom (subcooled amber liquid)
      new THREE.Vector3(-6.5, 1.3, -1.6),
      new THREE.Vector3(-6.0, 1.6, -1.6), // Expansion device / Capillary
      // Post-expansion line (Two-phase mixture & bubbles)
      new THREE.Vector3(-3.0, 2.0, -1.2),
      new THREE.Vector3(0.0, 2.4, -0.8), // Through wall sleeve
      new THREE.Vector3(4.0, 3.4, -0.6),
      new THREE.Vector3(7.0, 4.8, -0.6),
      // Evaporator entrance & passes
      new THREE.Vector3(8.5, 5.0, 0.8),
      new THREE.Vector3(9.5, 6.2, -0.8),
      new THREE.Vector3(10.5, 5.2, 0.8),
      // Suction Line (Gas saturado/recalentado vapor brumoso azul claro)
      new THREE.Vector3(8.2, 6.2, 0.5),
      new THREE.Vector3(6.8, 5.4, 0.5),
      new THREE.Vector3(3.5, 4.2, 0.6),
      new THREE.Vector3(0.0, 3.6, 0.6), // Wall sleeve
      new THREE.Vector3(-4.0, 3.8, 0.6),
      new THREE.Vector3(-7.2, 3.9, 0.4), // 4-way suction port
      new THREE.Vector3(-8.3, 2.5, 1.4), // Accumulator
      new THREE.Vector3(-7.8, 1.4, 1.2),
      new THREE.Vector3(-7.5, 2.2, 1.2)
    ];

    // Winter Loop Points (Heating Mode)
    const ptsWinter = [
      new THREE.Vector3(-7.5, 3.3, 1.2),
      new THREE.Vector3(-7.2, 4.4, 0.4),
      new THREE.Vector3(-4.0, 3.8, 0.6),
      new THREE.Vector3(0.0, 3.6, 0.6),
      new THREE.Vector3(3.5, 4.2, 0.6),
      new THREE.Vector3(6.8, 5.4, 0.5),
      new THREE.Vector3(8.2, 6.2, 0.5),
      new THREE.Vector3(10.5, 5.2, 0.8),
      new THREE.Vector3(9.5, 6.2, -0.8),
      new THREE.Vector3(8.5, 5.0, 0.8),
      new THREE.Vector3(7.0, 4.8, -0.6),
      new THREE.Vector3(4.0, 3.4, -0.6),
      new THREE.Vector3(0.0, 2.4, -0.8),
      new THREE.Vector3(-3.0, 2.0, -1.2),
      new THREE.Vector3(-6.0, 1.6, -1.6),
      new THREE.Vector3(-6.5, 1.3, -1.6),
      new THREE.Vector3(-11.0, 1.4, -0.5),
      new THREE.Vector3(-11.5, 2.0, 1.8),
      new THREE.Vector3(-11.5, 3.0, -1.8),
      new THREE.Vector3(-11.5, 4.0, 1.8),
      new THREE.Vector3(-11.2, 4.8, 0.2),
      new THREE.Vector3(-9.2, 4.8, 0.4),
      new THREE.Vector3(-7.2, 3.9, 0.4),
      new THREE.Vector3(-8.3, 2.5, 1.4),
      new THREE.Vector3(-7.8, 1.4, 1.2),
      new THREE.Vector3(-7.5, 2.2, 1.2)
    ];

    curveSummerRef.current = new THREE.CatmullRomCurve3(ptsSummer, true, 'centripetal', 0.15);
    curveWinterRef.current = new THREE.CatmullRomCurve3(ptsWinter, true, 'centripetal', 0.15);
  }, []);

  // Smooth camera transition function using controls.object.position.set, controls.target.set, and controls.update()
  const transitionCamera = useCallback(
    (
      destPos: THREE.Vector3,
      destTarget: THREE.Vector3,
      duration = 600,
      onComplete?: () => void
    ) => {
      if (!controlsRef.current || !cameraRef.current) return;
      const controls = controlsRef.current;

      if (transitionAnimIdRef.current) {
        cancelAnimationFrame(transitionAnimIdRef.current);
        transitionAnimIdRef.current = null;
      }

      // Asegurar que los controles estén habilitados
      controls.enabled = true;

      const startPos = controls.object.position.clone();
      const startTarget = controls.target.clone();
      const startTime = performance.now();

      const step = (now: number) => {
        const elapsed = now - startTime;
        const progress = Math.min(elapsed / duration, 1);

        // Smooth cubic ease-in-out curve
        const ease =
          progress < 0.5
            ? 4 * progress * progress * progress
            : 1 - Math.pow(-2 * progress + 2, 3) / 2;

        const curX = startPos.x + (destPos.x - startPos.x) * ease;
        const curY = startPos.y + (destPos.y - startPos.y) * ease;
        const curZ = startPos.z + (destPos.z - startPos.z) * ease;

        const curTgtX = startTarget.x + (destTarget.x - startTarget.x) * ease;
        const curTgtY = startTarget.y + (destTarget.y - startTarget.y) * ease;
        const curTgtZ = startTarget.z + (destTarget.z - startTarget.z) * ease;

        // Reset using controls.object.position.set, controls.target.set, and controls.update()
        controls.object.position.set(curX, curY, curZ);
        controls.target.set(curTgtX, curTgtY, curTgtZ);
        controls.update();

        if (progress < 1) {
          transitionAnimIdRef.current = requestAnimationFrame(step);
        } else {
          controls.object.position.set(destPos.x, destPos.y, destPos.z);
          controls.target.set(destTarget.x, destTarget.y, destTarget.z);
          controls.update();
          transitionAnimIdRef.current = null;
          if (onComplete) onComplete();
        }
      };

      transitionAnimIdRef.current = requestAnimationFrame(step);
    },
    []
  );

  // 2. Función para restablecer la cámara a los valores iniciales por defecto
  const resetCamera = useCallback(
    (smooth = true) => {
      if (!controlsRef.current) return;
      const controls = controlsRef.current;
      const defPos = defaultCameraPosition.current;
      const defTgt = defaultTarget.current;

      // Asegurar que enabled no esté bloqueado en false
      controls.enabled = true;

      if (smooth) {
        transitionCamera(defPos, defTgt, 600);
      } else {
        // Reseteo directo usando controls.object.position.set, controls.target.set y controls.update()
        controls.object.position.set(defPos.x, defPos.y, defPos.z);
        controls.target.set(defTgt.x, defTgt.y, defTgt.z);
        controls.update();
      }
    },
    [transitionCamera]
  );

  // 3. Manejo de presets de cámara
  const setCameraPreset = useCallback(
    (preset: string) => {
      switch (preset) {
        case 'overview':
          resetCamera(true);
          break;
        case 'outdoor':
          transitionCamera(new THREE.Vector3(-5, 8.5, 12), new THREE.Vector3(-8.5, 3.2, 0));
          break;
        case 'indoor':
          transitionCamera(new THREE.Vector3(7, 9.5, 13), new THREE.Vector3(9.0, 5.5, 0));
          break;
        case 'compressor':
          transitionCamera(new THREE.Vector3(-4.5, 4.0, 4.8), new THREE.Vector3(-7.5, 2.4, 1.2));
          break;
        case 'wall':
          transitionCamera(new THREE.Vector3(0, 7.0, 9.0), new THREE.Vector3(0, 3.0, 0));
          break;
        default:
          resetCamera(true);
      }
    },
    [resetCamera, transitionCamera]
  );

  useEffect(() => {
    if (cameraPreset) {
      setCameraPreset(cameraPreset);
    }
  }, [cameraPreset, setCameraPreset]);

  // Manejar el trigger explícito de reseteo de cámara desde View3DModule
  useEffect(() => {
    if (resetTrigger !== undefined && resetTrigger > 0) {
      resetCamera(true);
    }
  }, [resetTrigger, resetCamera]);

  // Manejar selección de componentes para enfocar cámara
  useEffect(() => {
    if (selectedComponentId && componentTargetsRef.current[selectedComponentId]) {
      const target = componentTargetsRef.current[selectedComponentId];
      transitionCamera(target.cameraPos, target.center);
    }
  }, [selectedComponentId, transitionCamera]);

  // 3. Initialize Three.js Scene, Meshes, Lights, and Animation Loop
  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const width = container.clientWidth;
    const height = Math.max(container.clientHeight, 580);

    // Scene
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x060913); // dark studio backdrop
    sceneRef.current = scene;

    // Camera (Isometric 3D Perspective angle)
    const camera = new THREE.PerspectiveCamera(38, width / height, 0.5, 200);
    camera.position.set(16, 14, 20);
    cameraRef.current = camera;

    // Renderer with antialias & studio shadows
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFShadowMap;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.1;
    rendererRef.current = renderer;

    container.replaceChildren(renderer.domElement);

    // OrbitControls
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.08;
    controls.maxPolarAngle = Math.PI / 2 - 0.04;
    controls.minDistance = 5;
    controls.maxDistance = 55;
    controls.target.set(0, 3.5, 0);
    controlsRef.current = controls;

    // 1. Guardar valores iniciales de la cámara y controles al montar el componente
    defaultCameraPosition.current.copy(camera.position);
    defaultTarget.current.copy(controls.target);

    // Cancelar cualquier transición de cámara en curso si el usuario manipula manualmente los controles
    controls.addEventListener('start', () => {
      if (transitionAnimIdRef.current) {
        cancelAnimationFrame(transitionAnimIdRef.current);
        transitionAnimIdRef.current = null;
      }
    });

    // -------------------------------------------------------------
    // STUDIO LIGHTING: Key, Rim, Fill, and Emissive Points
    // -------------------------------------------------------------
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.75);
    scene.add(ambientLight);

    // Key Light with soft shadows
    const keyLight = new THREE.DirectionalLight(0xffffff, 1.4);
    keyLight.position.set(16, 26, 18);
    keyLight.castShadow = true;
    keyLight.shadow.mapSize.width = 2048;
    keyLight.shadow.mapSize.height = 2048;
    keyLight.shadow.bias = -0.0001;
    scene.add(keyLight);

    // Rim light for glass transparency highlights
    const rimLight = new THREE.DirectionalLight(0x38bdf8, 0.9);
    rimLight.position.set(-20, 18, -15);
    scene.add(rimLight);

    // Warm high-pressure glow light (Amber/Red near compressor & condenser)
    const warmLight = new THREE.PointLight(0xf59e0b, 2.2, 18);
    warmLight.position.set(-8, 3.5, 1);
    scene.add(warmLight);

    // Cold low-pressure glow light (Cyan/Blue near evaporator & suction)
    const coldLight = new THREE.PointLight(0x06b6d4, 2.5, 18);
    coldLight.position.set(8.5, 5.5, 0);
    scene.add(coldLight);

    // -------------------------------------------------------------
    // ARCHITECTURAL VOLUMES: FLOORS & CENTRAL DIVIDING WALL
    // -------------------------------------------------------------
    const outdoorFloorGeo = new THREE.BoxGeometry(16, 0.4, 20);
    const outdoorFloorMat = new THREE.MeshStandardMaterial({ color: 0x111827, roughness: 0.8, metalness: 0.2 });
    const outdoorFloor = new THREE.Mesh(outdoorFloorGeo, outdoorFloorMat);
    outdoorFloor.position.set(-8, -0.2, 0);
    outdoorFloor.receiveShadow = true;
    scene.add(outdoorFloor);

    const outdoorGrid = new THREE.GridHelper(16, 16, 0x374151, 0x1f2937);
    outdoorGrid.position.set(-8, 0.01, 0);
    scene.add(outdoorGrid);

    const indoorFloorGeo = new THREE.BoxGeometry(16, 0.4, 20);
    const indoorFloorMat = new THREE.MeshStandardMaterial({ color: 0x0f172a, roughness: 0.6, metalness: 0.1 });
    const indoorFloor = new THREE.Mesh(indoorFloorGeo, indoorFloorMat);
    indoorFloor.position.set(8, -0.2, 0);
    indoorFloor.receiveShadow = true;
    scene.add(indoorFloor);

    const indoorGrid = new THREE.GridHelper(16, 16, 0x2563eb, 0x1e293b);
    indoorGrid.position.set(8, 0.01, 0);
    scene.add(indoorGrid);

    // Central Dividing Wall (Architectural Cutaway with translucent glass-plaster)
    const wallGeo = new THREE.BoxGeometry(1.2, 11, 18);
    const wallMat = new THREE.MeshPhysicalMaterial({
      color: 0x334155,
      transparent: true,
      opacity: 0.32,
      roughness: 0.25,
      metalness: 0.15,
      transmission: 0.55
    });
    const wall = new THREE.Mesh(wallGeo, wallMat);
    wall.position.set(0, 5.5, 0);
    wall.receiveShadow = true;
    scene.add(wall);

    const sleeveGeo = new THREE.CylinderGeometry(1.1, 1.1, 1.4, 24);
    sleeveGeo.rotateZ(Math.PI / 2);
    const sleeveMat = new THREE.MeshStandardMaterial({ color: 0x1e293b, roughness: 0.5, metalness: 0.5 });
    const sleeve = new THREE.Mesh(sleeveGeo, sleeveMat);
    sleeve.position.set(0, 3.0, 0);
    scene.add(sleeve);

    interactiveMeshesRef.current = [];
    const registerTarget = (mesh: THREE.Mesh, id: string, name: string, center: THREE.Vector3, cameraPos: THREE.Vector3) => {
      mesh.userData = { componentId: id, name };
      interactiveMeshesRef.current.push(mesh);
      componentTargetsRef.current[id] = { id, name, center, cameraPos };
    };

    // -------------------------------------------------------------
    // VOLUMETRIC OUTDOOR UNIT: TRANSPARENT CASING & MACHINERY
    // -------------------------------------------------------------
    const outdoorGroup = new THREE.Group();
    outdoorGroup.position.set(-8.5, 0, 0);

    // Translucent Outdoor Chassis (Allows internal machinery to be visible at all times!)
    const outdoorChassisGeo = new THREE.BoxGeometry(5.4, 5.6, 4.6);
    const outdoorChassisMat = new THREE.MeshPhysicalMaterial({
      color: 0x94a3b8,
      transparent: true,
      opacity: 0.18,
      roughness: 0.05,
      transmission: 0.82,
      ior: 1.45,
      metalness: 0.1
    });
    const outdoorChassis = new THREE.Mesh(outdoorChassisGeo, outdoorChassisMat);
    outdoorChassis.position.set(0, 3.1, 0);
    outdoorChassis.castShadow = true;
    outdoorGroup.add(outdoorChassis);

    // Chassis Structural Outline Edges
    const chassisEdges = new THREE.LineSegments(
      new THREE.EdgesGeometry(outdoorChassisGeo),
      new THREE.LineBasicMaterial({ color: 0x64748b, linewidth: 2 })
    );
    chassisEdges.position.copy(outdoorChassis.position);
    outdoorGroup.add(chassisEdges);

    // 1. MOTOMCOMPRESOR WITH CUTAWAY & ORBITING SCROLL MECHANISM
    const compGroup = new THREE.Group();
    compGroup.position.set(1.0, 0.4, 1.2);

    // Outer Cutaway Shell (90° open window revealing internal scroll mechanism)
    const compShellGeo = new THREE.CylinderGeometry(1.0, 1.0, 2.3, 32, 1, false, Math.PI * 0.25, Math.PI * 1.5);
    const compShellMat = new THREE.MeshStandardMaterial({
      color: 0x18181b,
      metalness: 0.88,
      roughness: 0.2,
      side: THREE.DoubleSide
    });
    const compShell = new THREE.Mesh(compShellGeo, compShellMat);
    compShell.position.y = 1.15;
    compShell.castShadow = true;
    compGroup.add(compShell);

    // Top Dome with matching cutaway
    const compDomeGeo = new THREE.SphereGeometry(1.0, 32, 16, Math.PI * 0.25, Math.PI * 1.5, 0, Math.PI / 2);
    const compDome = new THREE.Mesh(compDomeGeo, compShellMat);
    compDome.position.y = 2.3;
    compDome.castShadow = true;
    compGroup.add(compDome);

    // Electric Motor Stator & Rotor inside lower chamber
    const motorStatorGeo = new THREE.CylinderGeometry(0.85, 0.85, 0.9, 24);
    const motorStatorMat = new THREE.MeshStandardMaterial({ color: 0xb45309, roughness: 0.4 }); // copper windings
    const motorStator = new THREE.Mesh(motorStatorGeo, motorStatorMat);
    motorStator.position.y = 0.65;
    compGroup.add(motorStator);

    // Rotating Vertical Shaft
    const shaftGeo = new THREE.CylinderGeometry(0.14, 0.14, 1.8, 16);
    const shaftMat = new THREE.MeshStandardMaterial({ color: 0xd4d4d8, metalness: 0.9, roughness: 0.1 });
    const shaft = new THREE.Mesh(shaftGeo, shaftMat);
    shaft.position.y = 1.2;
    compressorShaftRef.current = shaft;
    compGroup.add(shaft);

    // SCROLL COMPRESSOR MECHANISM: Fixed Scroll & Orbiting Scroll Spirals
    const scrollChamber = new THREE.Group();
    scrollChamber.position.y = 1.8;

    // Fixed Scroll (Upper static involute spiral plate)
    const fixedScrollBaseGeo = new THREE.CylinderGeometry(0.88, 0.88, 0.15, 24);
    const scrollMatSteel = new THREE.MeshStandardMaterial({ color: 0xe4e4e7, metalness: 0.9, roughness: 0.2 });
    const fixedScrollBase = new THREE.Mesh(fixedScrollBaseGeo, scrollMatSteel);
    fixedScrollBase.position.y = 0.35;
    scrollChamber.add(fixedScrollBase);

    // Fixed Scroll Spiral Vanes (Archimedean spiral ribbon)
    const spiralPtsFixed: THREE.Vector3[] = [];
    for (let theta = 0; theta < Math.PI * 4; theta += 0.2) {
      const r = 0.12 + 0.12 * (theta / (Math.PI * 2));
      spiralPtsFixed.push(new THREE.Vector3(Math.cos(theta) * r, 0.18, Math.sin(theta) * r));
    }
    const fixedSpiralGeo = new THREE.TubeGeometry(new THREE.CatmullRomCurve3(spiralPtsFixed), 64, 0.05, 8, false);
    const fixedSpiralMesh = new THREE.Mesh(fixedSpiralGeo, scrollMatSteel);
    scrollChamber.add(fixedSpiralMesh);

    // Orbiting Scroll (Lower moving involute spiral plate)
    const orbitingGroup = new THREE.Group();
    const orbitingScrollBaseGeo = new THREE.CylinderGeometry(0.84, 0.84, 0.15, 24);
    const scrollMatBronze = new THREE.MeshStandardMaterial({ color: 0xf59e0b, metalness: 0.85, roughness: 0.25 });
    const orbitingScrollBase = new THREE.Mesh(orbitingScrollBaseGeo, scrollMatBronze);
    orbitingGroup.add(orbitingScrollBase);

    const spiralPtsOrbit: THREE.Vector3[] = [];
    for (let theta = Math.PI; theta < Math.PI * 5; theta += 0.2) {
      const r = 0.12 + 0.12 * ((theta - Math.PI) / (Math.PI * 2));
      spiralPtsOrbit.push(new THREE.Vector3(Math.cos(theta) * r, 0.16, Math.sin(theta) * r));
    }
    const orbitingSpiralGeo = new THREE.TubeGeometry(new THREE.CatmullRomCurve3(spiralPtsOrbit), 64, 0.05, 8, false);
    const orbitingSpiralMesh = new THREE.Mesh(orbitingSpiralGeo, scrollMatBronze);
    orbitingGroup.add(orbitingSpiralMesh);

    scrollOrbitRef.current = orbitingGroup;
    scrollChamber.add(orbitingGroup);
    compGroup.add(scrollChamber);

    // Suction Accumulator
    const accumGeo = new THREE.CylinderGeometry(0.4, 0.4, 1.8, 24);
    const accumMat = new THREE.MeshStandardMaterial({ color: 0x27272a, metalness: 0.7, roughness: 0.3 });
    const accum = new THREE.Mesh(accumGeo, accumMat);
    accum.position.set(-1.0, 1.2, 0.4);
    compGroup.add(accum);

    outdoorGroup.add(compGroup);
    registerTarget(
      compShell,
      'compressor',
      'Motocompresor Scroll (Cutaway)',
      new THREE.Vector3(-7.5, 2.4, 1.2),
      new THREE.Vector3(-4.5, 4.5, 5.0)
    );

    // 2. BATERÍA CONDENSADORA (Serpentín detallado con aletas de aluminio en relieve)
    const condGroup = new THREE.Group();
    condGroup.position.set(-2.5, 3.1, 0);

    const condBlockGeo = new THREE.BoxGeometry(0.8, 4.6, 4.0);
    const condBlockMat = new THREE.MeshStandardMaterial({ color: 0x334155, metalness: 0.6, roughness: 0.3 });
    const condBlock = new THREE.Mesh(condBlockGeo, condBlockMat);
    condBlock.castShadow = true;
    condGroup.add(condBlock);

    // Realistic Aluminum Fins Stack
    const finMat = new THREE.MeshStandardMaterial({ color: 0xd1d5db, metalness: 0.95, roughness: 0.15 });
    for (let fz = -1.85; fz <= 1.85; fz += 0.22) {
      const finMesh = new THREE.Mesh(new THREE.BoxGeometry(0.84, 4.5, 0.025), finMat);
      finMesh.position.set(0, 0, fz);
      condGroup.add(finMesh);
    }

    // Copper return hairpin U-bends
    const bendMat = new THREE.MeshStandardMaterial({ color: 0xd97706, metalness: 0.85, roughness: 0.2 });
    for (let by = -1.8; by <= 1.8; by += 0.55) {
      const bendGeo = new THREE.TorusGeometry(0.18, 0.065, 12, 16, Math.PI);
      bendGeo.rotateZ(Math.PI / 2);
      const bend = new THREE.Mesh(bendGeo, bendMat);
      bend.position.set(-0.43, by, 0);
      condGroup.add(bend);
    }

    outdoorGroup.add(condGroup);
    registerTarget(
      condBlock,
      'condenser',
      'Batería Condensadora Exterior',
      new THREE.Vector3(-11.0, 3.1, 0),
      new THREE.Vector3(-8.0, 5.5, 4.5)
    );

    // 3. FORZADOR AXIAL EXTERIOR
    const fanGroup = new THREE.Group();
    fanGroup.position.set(0, 3.4, -1.9);

    const fanHubGeo = new THREE.CylinderGeometry(0.55, 0.55, 0.4, 24);
    fanHubGeo.rotateX(Math.PI / 2);
    const fanHubMat = new THREE.MeshStandardMaterial({ color: 0x1e293b, metalness: 0.7, roughness: 0.3 });
    const fanHub = new THREE.Mesh(fanHubGeo, fanHubMat);
    fanGroup.add(fanHub);

    // 3 Aerodynamic blades
    const fanBladeGeo = new THREE.BoxGeometry(0.38, 1.55, 0.06);
    const fanBladeMat = new THREE.MeshStandardMaterial({ color: 0x334155, roughness: 0.5 });
    for (let a = 0; a < 3; a++) {
      const blade = new THREE.Mesh(fanBladeGeo, fanBladeMat);
      blade.position.y = 0.85;
      blade.rotation.z = (a * Math.PI * 2) / 3;
      blade.rotation.x = 0.35;
      fanHub.add(blade);
    }
    outdoorFanMeshRef.current = fanHub;
    outdoorGroup.add(fanGroup);
    registerTarget(
      fanHub,
      'outdoor_fan',
      'Forzador Axial Exterior',
      new THREE.Vector3(-8.5, 3.4, -1.9),
      new THREE.Vector3(-6.0, 5.0, 2.5)
    );

    // 4. METERING DEVICE: CAPILLARY TUBE (Tubo Capilar en Espiral)
    const capGroup = new THREE.Group();
    capGroup.position.set(2.2, 1.5, -1.5);
    const capPts = [];
    for (let sp = 0; sp < 14; sp++) {
      const ang = (sp / 14) * Math.PI * 4;
      capPts.push(new THREE.Vector3(Math.cos(ang) * 0.3, sp * 0.08, Math.sin(ang) * 0.3));
    }
    const capGeo = new THREE.TubeGeometry(new THREE.CatmullRomCurve3(capPts), 36, 0.07, 12, false);
    const capMat = new THREE.MeshStandardMaterial({ color: 0x06b6d4, metalness: 0.85, roughness: 0.25 });
    const capMesh = new THREE.Mesh(capGeo, capMat);
    capGroup.add(capMesh);
    outdoorGroup.add(capGroup);
    registerTarget(
      capMesh,
      'expansion_device',
      'Dispositivo de Expansión (Capilar)',
      new THREE.Vector3(-6.3, 1.5, -1.5),
      new THREE.Vector3(-3.5, 3.2, 1.5)
    );

    scene.add(outdoorGroup);

    // -------------------------------------------------------------
    // VOLUMETRIC INDOOR UNIT: TRANSLUCENT SPLIT & MACHINERY
    // -------------------------------------------------------------
    const indoorGroup = new THREE.Group();
    indoorGroup.position.set(8.5, 5.5, 0);

    // Transparent / Translucent Indoor Split Casing
    const indoorCasingGeo = new THREE.BoxGeometry(5.0, 2.3, 2.2);
    const indoorCasingMat = new THREE.MeshPhysicalMaterial({
      color: 0xf8fafc,
      transparent: true,
      opacity: 0.22,
      roughness: 0.08,
      transmission: 0.85,
      ior: 1.45,
      metalness: 0.05
    });
    const indoorCasing = new THREE.Mesh(indoorCasingGeo, indoorCasingMat);
    indoorCasing.castShadow = true;
    indoorGroup.add(indoorCasing);

    // Floating Digital Display ("26°C" clear floating element)
    const ledCanvas = document.createElement('canvas');
    ledCanvas.width = 160;
    ledCanvas.height = 70;
    const ledCtx = ledCanvas.getContext('2d');
    if (ledCtx) {
      ledCtx.fillStyle = '#020617';
      ledCtx.fillRect(0, 0, 160, 70);
      ledCtx.font = 'bold 42px monospace';
      ledCtx.fillStyle = '#38bdf8';
      ledCtx.fillText('26°C', 24, 52);
    }
    const ledTexture = new THREE.CanvasTexture(ledCanvas);
    const ledPlateGeo = new THREE.PlaneGeometry(1.0, 0.45);
    const ledPlateMat = new THREE.MeshBasicMaterial({ map: ledTexture });
    const ledPlate = new THREE.Mesh(ledPlateGeo, ledPlateMat);
    ledPlate.position.set(1.5, 0.3, 1.12);
    indoorGroup.add(ledPlate);

    // Detailed Evaporator Coil (Angled blue hydrophilic finned mesh)
    const evapGeo = new THREE.BoxGeometry(4.4, 1.4, 1.2);
    const evapMat = new THREE.MeshStandardMaterial({ color: 0x2563eb, metalness: 0.75, roughness: 0.25 });
    const evapMesh = new THREE.Mesh(evapGeo, evapMat);
    evapMesh.position.set(0, 0.2, 0.1);
    indoorGroup.add(evapMesh);

    // Hydrophilic fin texture lines on evaporator
    const evapFinMat = new THREE.MeshStandardMaterial({ color: 0x60a5fa, metalness: 0.85, roughness: 0.2 });
    for (let ez = -0.5; ez <= 0.5; ez += 0.15) {
      const eFin = new THREE.Mesh(new THREE.BoxGeometry(4.35, 1.35, 0.02), evapFinMat);
      eFin.position.set(0, 0.2, ez);
      indoorGroup.add(eFin);
    }

    // Tangential Turbine (Squirrel-Cage Crossflow Fan) animated spinning!
    const turbineGroup = new THREE.Group();
    turbineGroup.position.set(0, -0.4, 0.1);
    const turbineShaftGeo = new THREE.CylinderGeometry(0.12, 0.12, 4.2, 16);
    turbineShaftGeo.rotateZ(Math.PI / 2);
    const turbineShaft = new THREE.Mesh(turbineShaftGeo, new THREE.MeshStandardMaterial({ color: 0x94a3b8 }));
    turbineGroup.add(turbineShaft);

    // Slotted squirrel-cage vanes around perimeter
    const vaneMat = new THREE.MeshStandardMaterial({ color: 0x10b981, roughness: 0.4 });
    for (let v = 0; v < 12; v++) {
      const vAng = (v / 12) * Math.PI * 2;
      const vane = new THREE.Mesh(new THREE.BoxGeometry(4.1, 0.06, 0.15), vaneMat);
      vane.position.set(0, Math.cos(vAng) * 0.38, Math.sin(vAng) * 0.38);
      vane.rotation.x = vAng + 0.3;
      turbineGroup.add(vane);
    }
    indoorTurbineMeshRef.current = turbineGroup;
    indoorGroup.add(turbineGroup);

    scene.add(indoorGroup);

    registerTarget(
      evapMesh,
      'evaporator',
      'Batería Evaporadora Interior',
      new THREE.Vector3(8.5, 5.5, 0),
      new THREE.Vector3(6.0, 7.5, 5.5)
    );

    // -------------------------------------------------------------
    // ADVANCED REFRIGERANT VISUALIZATION (PHYSICALLY CORRECT)
    // -------------------------------------------------------------
    const activeCurve = mode === 'summer' ? curveSummerRef.current! : curveWinterRef.current!;

    // 1. PIPES AS TRANSPARENT GLASS TUBES (Outer clear glass cylinder)
    const glassPipeGeo = new THREE.TubeGeometry(activeCurve, 200, 0.22, 18, true);
    const glassPipeMat = new THREE.MeshPhysicalMaterial({
      color: 0xffffff,
      transparent: true,
      opacity: 0.36,
      roughness: 0.05,
      transmission: 0.92,
      ior: 1.52,
      thickness: 0.35,
      metalness: 0.1
    });
    const glassPipeMesh = new THREE.Mesh(glassPipeGeo, glassPipeMat);
    scene.add(glassPipeMesh);
    registerTarget(
      glassPipeMesh,
      'liquid_line',
      'Cañerías de Vidrio Transparente',
      new THREE.Vector3(0, 3.0, 0),
      new THREE.Vector3(0, 6.5, 8.5)
    );

    // 2. SUBCOOLED LIQUID DENSE AMBER CORE (Líquido denso ámbar brillante sin burbujas)
    // Segment from condenser bottom through liquid line to expansion
    const amberLiquidCurve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(-11.0, 1.4, -0.5),
      new THREE.Vector3(-6.5, 1.3, -1.6),
      new THREE.Vector3(-6.0, 1.6, -1.6)
    ]);
    const amberLiquidGeo = new THREE.TubeGeometry(amberLiquidCurve, 32, 0.13, 14, false);
    const amberLiquidMat = new THREE.MeshStandardMaterial({
      color: 0xf59e0b,
      emissive: 0xd97706,
      emissiveIntensity: 0.75,
      roughness: 0.1,
      metalness: 0.2
    });
    const amberLiquidMesh = new THREE.Mesh(amberLiquidGeo, amberLiquidMat);
    scene.add(amberLiquidMesh);

    // 3. SATURATED / SUPERHEATED GAS MISTY LIGHT-BLUE CORE (Línea de succión baja presión)
    const suctionGasCurve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(8.2, 6.2, 0.5),
      new THREE.Vector3(6.8, 5.4, 0.5),
      new THREE.Vector3(3.5, 4.2, 0.6),
      new THREE.Vector3(0.0, 3.6, 0.6),
      new THREE.Vector3(-4.0, 3.8, 0.6),
      new THREE.Vector3(-7.2, 3.9, 0.4),
      new THREE.Vector3(-8.3, 2.5, 1.4)
    ]);
    const suctionGasGeo = new THREE.TubeGeometry(suctionGasCurve, 64, 0.15, 14, false);
    const suctionGasMat = new THREE.MeshStandardMaterial({
      color: 0x38bdf8,
      emissive: 0x0284c7,
      emissiveIntensity: 0.65,
      transparent: true,
      opacity: 0.7,
      roughness: 0.4
    });
    const suctionGasMesh = new THREE.Mesh(suctionGasGeo, suctionGasMat);
    scene.add(suctionGasMesh);

    // 4. TWO-PHASE EFFERVESCENT BUBBLES (Burbujas en ebullición turbulenta post-capilar)
    // 48 animated bubble spheres expanding and wobbling inside the post-expansion glass tube
    const bubbleCount = 48;
    const bubbleGeo = new THREE.SphereGeometry(0.1, 10, 10);
    const bubbleMat = new THREE.MeshStandardMaterial({
      color: 0xecfeff,
      emissive: 0x06b6d4,
      emissiveIntensity: 0.9,
      roughness: 0.1
    });
    const bubblesMesh = new THREE.InstancedMesh(bubbleGeo, bubbleMat, bubbleCount);
    bubblesMesh.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
    scene.add(bubblesMesh);
    bubblesMeshRef.current = bubblesMesh;

    const bubbleOffsets = [];
    for (let b = 0; b < bubbleCount; b++) {
      bubbleOffsets.push({
        t: b / bubbleCount,
        wobbleSpeed: 4.0 + Math.random() * 6.0,
        wobblePhase: Math.random() * Math.PI * 2,
        maxRadius: 0.06 + Math.random() * 0.08
      });
    }
    bubbleOffsetsRef.current = bubbleOffsets;

    // 5. REGULAR REFRIGERANT PARTICLES (160 Spheres moving with differential velocity)
    const particleCount = 160;
    const sphereGeo = new THREE.SphereGeometry(0.12, 12, 12);
    const sphereMat = new THREE.MeshStandardMaterial({
      color: 0xffffff,
      emissive: 0xffffff,
      emissiveIntensity: 0.95,
      roughness: 0.2
    });
    const instancedMesh = new THREE.InstancedMesh(sphereGeo, sphereMat, particleCount);
    instancedMesh.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
    scene.add(instancedMesh);
    particlesMeshRef.current = instancedMesh;

    const distances: number[] = [];
    const colors: THREE.Color[] = [];
    for (let i = 0; i < particleCount; i++) {
      distances.push(i / particleCount);
      colors.push(new THREE.Color());
    }
    particleDistancesRef.current = distances;
    particleColorsRef.current = colors;

    // 6. AIRFLOW PARTICLES
    const airflowGroup = new THREE.Group();
    const airParticleGeo = new THREE.SphereGeometry(0.08, 8, 8);
    const airParticleMat = new THREE.MeshBasicMaterial({ color: 0x38bdf8, transparent: true, opacity: 0.45 });
    for (let a = 0; a < 36; a++) {
      const airMesh = new THREE.Mesh(airParticleGeo, airParticleMat);
      airMesh.position.set(7.0 + Math.random() * 3.0, 4.4 - Math.random() * 3.5, (Math.random() - 0.5) * 4.0);
      airflowGroup.add(airMesh);
    }
    scene.add(airflowGroup);
    airflowGroupRef.current = airflowGroup;

    // -------------------------------------------------------------
    // RAYCASTING
    // -------------------------------------------------------------
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();

    let pointerDownPos = { x: 0, y: 0 };
    const handlePointerDown = (event: MouseEvent) => {
      pointerDownPos = { x: event.clientX, y: event.clientY };
    };

    const handlePointerUp = (event: MouseEvent) => {
      const dist = Math.hypot(event.clientX - pointerDownPos.x, event.clientY - pointerDownPos.y);
      if (dist > 6) return; // Arrastre de órbita con el ratón, ignorar raycasting de clic

      const rect = renderer.domElement.getBoundingClientRect();
      mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

      raycaster.setFromCamera(mouse, camera);
      const intersects = raycaster.intersectObjects(interactiveMeshesRef.current, true);

      if (intersects.length > 0) {
        let hitMesh: THREE.Object3D | null = intersects[0].object;
        while (hitMesh && !hitMesh.userData.componentId && hitMesh.parent) {
          hitMesh = hitMesh.parent;
        }
        if (hitMesh && hitMesh.userData.componentId) {
          onSelectComponent(hitMesh.userData.componentId);
        }
      }
    };

    renderer.domElement.addEventListener('pointerdown', handlePointerDown);
    renderer.domElement.addEventListener('pointerup', handlePointerUp);

    // -------------------------------------------------------------
    // ANIMATION & RENDER LOOP
    // -------------------------------------------------------------
    let animationFrameId: number;
    let animTime = 0;
    const dummy = new THREE.Object3D();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);

      // Actualizar OrbitControls con amortiguación suave
      controls.update();

      const dt = 0.016 * speed;
      if (isRunning) {
        animTime += dt;
      }

      // 1. Animate Scroll Compressor Mechanism!
      // Orbiting scroll plate wobbles eccentrically against the fixed scroll
      if (isRunning && scrollOrbitRef.current && compressorShaftRef.current) {
        const orbitAngle = animTime * 14.0;
        scrollOrbitRef.current.position.x = Math.cos(orbitAngle) * 0.12;
        scrollOrbitRef.current.position.z = Math.sin(orbitAngle) * 0.12;
        compressorShaftRef.current.rotation.y += 0.25 * speed;
      }

      // 2. Animate Rotating Fans
      if (isRunning && outdoorFanMeshRef.current) {
        outdoorFanMeshRef.current.rotation.z += 0.09 * speed;
      }
      if (isRunning && indoorTurbineMeshRef.current) {
        indoorTurbineMeshRef.current.rotation.x += 0.14 * speed;
      }

      const currentCurve = mode === 'summer' ? curveSummerRef.current : curveWinterRef.current;

      // 3. Animate 3D Particles with Physically Correct Phase Colors & Differential Velocity
      if (currentCurve && particlesMeshRef.current && showParticles) {
        for (let i = 0; i < particleCount; i++) {
          const t = particleDistancesRef.current[i];
          // Differential velocity: faster in high-pressure vapor/liquid, adjusted in expansion
          const isHighPressure = t < 0.4;
          const step = (isHighPressure ? 0.0022 : 0.0016) * speed;
          if (isRunning) {
            particleDistancesRef.current[i] = (t + step) % 1;
          }

          const pos = currentCurve.getPointAt(t);
          dummy.position.copy(pos);
          dummy.scale.setScalar(1);
          dummy.updateMatrix();
          particlesMeshRef.current.setMatrixAt(i, dummy.matrix);

          // Physically correct colors:
          // t < 0.28: High pressure hot vapor (Red/Orange)
          // 0.28 < t < 0.40: Dense subcooled amber liquid
          // 0.40 < t < 0.65: Two-phase ebullition cyan/electric blue
          // 0.65 < t < 1.0: Misty cold blue suction vapor
          const col = particleColorsRef.current[i];
          if (mode === 'summer') {
            if (t < 0.28) {
              col.setHex(0xff3b30); // Red/Orange Hot Gas
            } else if (t < 0.40) {
              col.setHex(0xf59e0b); // Dense Subcooled Amber Liquid
            } else if (t < 0.65) {
              col.setHex(0x06b6d4); // Two-phase Turbulent Cyan Flash Gas
            } else {
              col.setHex(0x38bdf8); // Misty Light Blue Suction Vapor
            }
          } else {
            // Winter mode
            if (t < 0.35) col.setHex(0xff4500);
            else if (t < 0.55) col.setHex(0x06b6d4);
            else col.setHex(0x38bdf8);
          }
          particlesMeshRef.current.setColorAt(i, col);
        }
        particlesMeshRef.current.instanceMatrix.needsUpdate = true;
        if (particlesMeshRef.current.instanceColor) {
          particlesMeshRef.current.instanceColor.needsUpdate = true;
        }
      }

      // 4. Animate Post-Expansion Two-Phase Bubbles (Effervescence inside glass tube)
      if (currentCurve && bubblesMeshRef.current && showParticles) {
        // Post expansion segment lies between t = 0.40 and t = 0.58
        const bubbleStartT = 0.40;
        const bubbleEndT = 0.58;
        const bubbleSpan = bubbleEndT - bubbleStartT;

        for (let b = 0; b < bubbleCount; b++) {
          const bo = bubbleOffsetsRef.current[b];
          if (isRunning) {
            bo.t = (bo.t + 0.0035 * speed) % 1;
          }
          const actualT = bubbleStartT + bo.t * bubbleSpan;
          const pos = currentCurve.getPointAt(actualT);

          // Add turbulent wobble across tube radius
          const wobble = Math.sin(animTime * bo.wobbleSpeed + bo.wobblePhase) * 0.07;
          dummy.position.set(pos.x + wobble, pos.y + wobble, pos.z + wobble);

          // Bubbles expand rapidly as pressure drops (Flash gas expansion)
          const scale = 0.5 + bo.t * 1.4;
          dummy.scale.setScalar(scale);
          dummy.updateMatrix();
          bubblesMeshRef.current.setMatrixAt(b, dummy.matrix);
        }
        bubblesMeshRef.current.instanceMatrix.needsUpdate = true;
      }

      // 5. Airflow drift
      if (airflowGroupRef.current && showAirflow) {
        airflowGroupRef.current.children.forEach((p) => {
          if (isRunning) {
            p.position.y -= 0.025 * speed;
            if (p.position.y < 0.5) p.position.y = 4.4;
          }
        });
      }

      // 6. Update 2D Screen Projection of HUD Leader Labels
      const canvasEl = renderer.domElement;
      if (canvasEl) {
        const cW = canvasEl.clientWidth;
        const cH = canvasEl.clientHeight;

        setHudLabels((prev) =>
          prev.map((hud) => {
            const tempVec = hud.worldPos.clone().project(camera);
            const isBehind = tempVec.z > 1;
            const x = (tempVec.x * 0.5 + 0.5) * cW;
            const y = (-tempVec.y * 0.5 + 0.5) * cH;
            return {
              ...hud,
              screenX: Math.round(x),
              screenY: Math.round(y),
              visible: !isBehind && x > 20 && x < cW - 20 && y > 20 && y < cH - 20
            };
          })
        );
      }

      renderer.render(scene, camera);
    };

    animate();

    const handleResize = () => {
      if (!container || !renderer || !camera) return;
      const w = container.clientWidth;
      const h = Math.max(container.clientHeight, 580);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animationFrameId);
      if (transitionAnimIdRef.current) {
        cancelAnimationFrame(transitionAnimIdRef.current);
        transitionAnimIdRef.current = null;
      }
      window.removeEventListener('resize', handleResize);
      renderer.domElement.removeEventListener('pointerdown', handlePointerDown);
      renderer.domElement.removeEventListener('pointerup', handlePointerUp);
      renderer.dispose();
    };
  }, [mode, isRunning, speed, showParticles, showAirflow, onSelectComponent]);

  return (
    <div className="relative w-full h-[620px] rounded-3xl overflow-hidden shadow-2xl border border-frost-800 bg-frost-950 select-none">
      {/* Three.js Canvas Container */}
      <div ref={mountRef} className="w-full h-full cursor-grab active:cursor-grabbing" />

      {/* Interactive HUD Leader Labels (Pinned to 3D World Objects) */}
      <div className="absolute inset-0 pointer-events-none">
        {hudLabels.map((hud) => {
          if (!hud.visible) return null;
          const isSelected = selectedComponentId === hud.id;

          return (
            <div
              key={hud.id}
              style={{
                transform: `translate(${hud.screenX}px, ${hud.screenY}px)`
              }}
              className="absolute pointer-events-auto transition-transform duration-75"
            >
              {/* Leader Dot on 3D Object */}
              <span className="absolute -left-1.5 -top-1.5 w-3 h-3 rounded-full bg-cyan-400 ring-4 ring-cyan-500/30 animate-pulse" />

              {/* Angled SVG Leader Line */}
              <svg className="absolute -left-2 -top-10 w-24 h-12 overflow-visible pointer-events-none">
                <polyline
                  points="2,10 14,0 70,0"
                  fill="none"
                  stroke={isSelected ? '#38bdf8' : 'rgba(148, 163, 184, 0.6)'}
                  strokeWidth="1.5"
                />
              </svg>

              {/* Technical Badge Card */}
              <button
                onClick={() => onSelectComponent(hud.id)}
                className={`absolute left-16 -top-14 px-3 py-1.5 rounded-xl border text-left backdrop-blur-md transition-all whitespace-nowrap shadow-xl flex flex-col ${
                  isSelected
                    ? 'bg-cyan-500/25 border-cyan-400 text-white ring-2 ring-cyan-400/40 shadow-cyan-500/20'
                    : 'bg-frost-950/85 border-frost-700 text-frost-200 hover:border-cyan-400 hover:bg-frost-900'
                }`}
              >
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-cyan-400">
                  {hud.label}
                </span>
                <span className="text-[9px] font-mono text-frost-400">
                  {hud.sublabel}
                </span>
              </button>
            </div>
          );
        })}
      </div>

      {/* Floating 3D Navigation Guide Pill */}
      <div className="absolute top-4 left-4 z-10 bg-frost-950/85 backdrop-blur-md border border-frost-800 px-3.5 py-1.5 rounded-2xl shadow-lg pointer-events-none flex items-center gap-2">
        <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
        <span className="text-xs font-mono text-frost-300">
          <strong>Perspectiva Isométrica 3D Activa:</strong> Clic y arrastrar para orbitar | Clic en etiqueta para zoom
        </span>
      </div>

      {/* Fluid State Indicator Pill at Bottom Right */}
      <div className="absolute bottom-4 right-4 z-10 flex items-center gap-3 bg-frost-950/90 backdrop-blur-md border border-frost-800 px-3.5 py-2 rounded-2xl shadow-xl text-xs font-mono">
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-amber-400 shadow-sm shadow-amber-400/50" />
          <span className="text-[11px] text-amber-300">Líquido Subenfriado</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-pulse shadow-sm shadow-cyan-400/50" />
          <span className="text-[11px] text-cyan-300">Mezcla Bifásica (Flash)</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-blue-400 shadow-sm shadow-blue-400/50" />
          <span className="text-[11px] text-blue-300">Gas Recalentado</span>
        </div>
      </div>

      {/* Quick Camera Preset Bar */}
      <div className="absolute bottom-4 left-4 z-10 flex flex-wrap items-center gap-1.5 bg-frost-950/85 backdrop-blur-md border border-frost-800 p-1.5 rounded-2xl shadow-xl">
        <span className="text-[10px] font-mono text-frost-400 uppercase font-bold px-2">Cámara:</span>
        <button
          type="button"
          onClick={() => {
            onSelectComponent(null);
            resetCamera(true);
          }}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-mono font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 hover:bg-cyan-500/30 active:scale-95 transition-all cursor-pointer shadow-sm"
          title="Restablecer vista isométrica general predeterminada"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Restablecer Cámara</span>
        </button>
        <button
          onClick={() => setCameraPreset('compressor')}
          className="px-2.5 py-1 rounded-xl text-xs font-mono font-bold bg-frost-900 text-rose-300 border border-frost-800 hover:bg-frost-800 transition-colors"
        >
          🔩 Scroll Cutaway
        </button>
        <button
          onClick={() => setCameraPreset('outdoor')}
          className="px-2.5 py-1 rounded-xl text-xs font-mono font-bold bg-frost-900 text-amber-300 border border-frost-800 hover:bg-frost-800 transition-colors"
        >
          💨 Condensador
        </button>
        <button
          onClick={() => setCameraPreset('indoor')}
          className="px-2.5 py-1 rounded-xl text-xs font-mono font-bold bg-frost-900 text-cyan-300 border border-frost-800 hover:bg-frost-800 transition-colors"
        >
          ❄️ Evaporador Split
        </button>
        <button
          onClick={() => setCameraPreset('wall')}
          className="px-2.5 py-1 rounded-xl text-xs font-mono font-bold bg-frost-900 text-purple-300 border border-frost-800 hover:bg-frost-800 transition-colors"
        >
          🧱 Pasamuros
        </button>
      </div>
    </div>
  );
};
