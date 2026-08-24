/* ==========================================================================
   Planta Cabudare CCTV Croquis - Core Logic
   Lácteos Los Andes - Interactive Security Blueprint
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
    // --- STATE MANAGEMENT ---
    const state = {
        zoom: 0.95,
        panX: 30,
        panY: 20,
        isPanning: false,
        startPanX: 0,
        startPanY: 0,
        
        showCameras: true,
        selectedCameraId: null,
        selectedZoneId: null,
        draggingHandle: null, // 'move', 'rotate', 'resize'
        dragTargetId: null,
        
        snapToGrid: true,
        gridSize: 10,
        showBgPhoto: false,
        theme: 'theme-blueprint',

        // Plant Zones & Blueprint Layout - EXACT ACCORDING TO USER DIRECTIVES & CLOSE-UP
        zones: [
            // Top Highway
            { id: 'z-intercomunal', name: 'AVENIDA INTERCOMUNAL', type: 'road', x: 40, y: 40, w: 1920, h: 60, color: 'rgba(30, 41, 59, 0.7)' },
            
            // Left Vertical Building: Servicios Médicos (Top edge aligns to y = 300)
            { id: 'z-servicios-medicos', name: 'SERVICIOS MEDICOS', type: 'building', verticalText: true, x: 40, y: 300, w: 100, h: 740, color: 'rgba(15, 23, 42, 0.85)' },
            
            // Portón de acceso on left street (Aligned to y = 300)
            { id: 'z-gate-top-left', name: 'PORTON DE ACCESO', type: 'security', x: 140, y: 300, w: 100, h: 40, fontSize: 8, color: 'rgba(239, 68, 68, 0.35)' },
            { id: 'z-barrera-left', name: 'BARRERA VEHICULAR', type: 'security', verticalText: true, x: 250, y: 120, w: 35, h: 90, fontSize: 8, color: 'rgba(59, 130, 246, 0.3)' },

            // --- LEFT PARKING LOTS ---
            { id: 'z-estac-top-left', name: 'ESTACIONAMIENTO', type: 'parking', x: 240, y: 100, w: 520, h: 200, color: 'rgba(15, 23, 42, 0.5)' },
            { id: 'z-estac-mid-left', name: 'ESTACIONAMIENTO', type: 'parking', x: 240, y: 300, w: 420, h: 240, color: 'rgba(15, 23, 42, 0.5)' },
            
            // Motos Area (L-shaped notch right of middle parking)
            { id: 'z-motos-l', name: 'MOTOS', type: 'parking', x: 560, y: 500, w: 100, h: 40, color: 'rgba(31, 41, 55, 0.9)' },
            { id: 'z-gate-motos-top', name: 'PORTON DE ACCESO', type: 'security', x: 580, y: 300, w: 80, h: 40, fontSize: 8, color: 'rgba(239, 68, 68, 0.35)' },
            { id: 'z-barrera-motos', name: 'BARRERA VEHICULAR', type: 'security', verticalText: true, x: 620, y: 120, w: 35, h: 90, fontSize: 8, color: 'rgba(59, 130, 246, 0.3)' },

            // Áreas Verdes (Bottom strip of middle parking)
            { id: 'z-green-mid-left', name: 'AREAS VERDES', type: 'green', x: 240, y: 540, w: 420, h: 60, color: 'rgba(16, 185, 129, 0.12)' },
            
            // Stacked boxes inside Áreas Verdes (Trailer Médico & Bodega)
            { id: 'z-trailer-medico', name: 'TRAILER MEDICO', type: 'small-box', x: 400, y: 545, w: 90, h: 22, fontSize: 8, color: 'rgba(255,255,255,0.08)' },
            { id: 'z-bodega', name: 'BODEGA', type: 'small-box', x: 400, y: 572, w: 90, h: 22, fontSize: 8, color: 'rgba(255,255,255,0.08)' },

            // --- CENTRAL MAIN ENTRANCE SECTION (Top to Bottom) ---
            // 1. Blank box under Av. Intercomunal between the two top parking lots
            { id: 'z-blank-box-center', name: '', type: 'small-box', x: 660, y: 105, w: 100, h: 40, color: 'rgba(255, 255, 255, 0.08)' },
            
            // 2. Middle Portón de Acceso (Main Plant Gate)
            { id: 'z-gate-center-main', name: 'PORTON DE ACCESO', type: 'security', x: 660, y: 300, w: 100, h: 40, fontSize: 8, color: 'rgba(239, 68, 68, 0.35)' },
            
            // 3. Nómina booth attached to left wall of the main entrance street
            { id: 'z-nomina', name: 'NOMINA', type: 'small-box', verticalText: true, x: 660, y: 390, w: 35, h: 100, fontSize: 9, color: 'rgba(255,255,255,0.1)' },

            // 4. PCP Column (Right side of central entrance street)
            { id: 'z-pcp', name: 'PCP', type: 'small-box', x: 760, y: 300, w: 100, h: 60, fontSize: 9, color: 'rgba(255, 255, 255, 0.08)' },
            { id: 'z-facturacion', name: 'FACTURACION', type: 'small-box', x: 760, y: 360, w: 100, h: 50, fontSize: 8, color: 'rgba(255,255,255,0.08)' },
            { id: 'z-green-under-pcp', name: 'AREAS VERDES', type: 'green', x: 760, y: 410, w: 100, h: 130, fontSize: 9, color: 'rgba(16, 185, 129, 0.12)' },

            // --- RIGHT TRANSPORT PARKING & RIGHT WING SECTION ---
            { id: 'z-estac-top-right', name: 'ESTACIONAMIENTO', type: 'parking', x: 860, y: 100, w: 680, h: 200, color: 'rgba(15, 23, 42, 0.5)' },
            { id: 'z-blank-box-top-right', name: '', type: 'small-box', x: 1540, y: 100, w: 400, h: 200, color: 'rgba(255, 255, 255, 0.05)' },

            { id: 'z-gate-right-transp', name: 'PORTON DE ACCESO', type: 'security', x: 860, y: 300, w: 100, h: 40, fontSize: 8, color: 'rgba(239, 68, 68, 0.35)' },
            { id: 'z-barrera-right', name: 'BARRERA VEHICULAR', type: 'security', verticalText: true, x: 860, y: 120, w: 35, h: 90, fontSize: 8, color: 'rgba(59, 130, 246, 0.3)' },
            
            { id: 'z-green-transp-top', name: 'AREAS VERDES', type: 'green', x: 960, y: 300, w: 580, h: 40, color: 'rgba(16, 185, 129, 0.12)' },
            { id: 'z-estac-transporte', name: 'ESTACIONAMIENTO DE TRANSPORTE', type: 'parking', x: 860, y: 340, w: 680, h: 200, color: 'rgba(15, 23, 42, 0.6)' },
            
            // Bottom Áreas Verdes Strip (Joins PCP green area!)
            { id: 'z-green-transp-bot-full', name: 'AREAS VERDES', type: 'green', x: 760, y: 540, w: 780, h: 60, color: 'rgba(16, 185, 129, 0.12)' },
            
            // --- RIGHT MOST COMPLEX (TRAILER INCES / CALLE INTERNA / BOMBONAS DE GAS) ---
            // 1. Trailer Inces zone (Gate covers only half of top entrance, inner box smaller)
            { id: 'z-inces-outer', name: '', type: 'small-box', x: 1540, y: 300, w: 140, h: 300, color: 'rgba(255, 255, 255, 0.05)' },
            { id: 'z-gate-inces', name: 'PORTON DE ACCESO', type: 'security', x: 1540, y: 300, w: 70, h: 35, fontSize: 7, color: 'rgba(239, 68, 68, 0.35)' },
            { id: 'z-trailer-inces', name: 'TRAILER INCES', type: 'small-box', verticalText: true, x: 1585, y: 370, w: 45, h: 140, fontSize: 8, color: 'rgba(255,255,255,0.08)' },

            // 2. Internal plant street gate at top of right continuous street (x: 1680..1760)
            { id: 'z-gate-internal-road', name: 'PORTON DE ACCESO', type: 'security', x: 1680, y: 300, w: 80, h: 35, fontSize: 8, color: 'rgba(239, 68, 68, 0.35)' },

            // 3. Bombonas de Gas zone (NO portón de acceso per user directive)
            { id: 'z-gas-outer', name: '', type: 'small-box', x: 1760, y: 300, w: 180, h: 300, color: 'rgba(255, 255, 255, 0.05)' },
            { id: 'z-gas-1', name: 'BOMBONA DE GAS', type: 'hazard', x: 1780, y: 355, w: 140, h: 50, fontSize: 9, color: 'rgba(185, 28, 28, 0.3)' },
            { id: 'z-gas-2', name: 'BOMBONA DE GAS', type: 'hazard', x: 1780, y: 425, w: 140, h: 50, fontSize: 9, color: 'rgba(185, 28, 28, 0.3)' },

            // --- MAIN LOWER COMPLEX (y: 680 to 1040) ---
            { id: 'z-planta-cabudare', name: 'PLANTA CABUDARE', type: 'building', x: 240, y: 680, w: 1440, h: 360, color: 'rgba(30, 58, 138, 0.4)' },
            { id: 'z-almacen-uht', name: 'ALMACEN UHT', type: 'building', verticalText: true, x: 1760, y: 680, w: 180, h: 360, color: 'rgba(30, 58, 138, 0.6)' }
        ],

        // Default Cameras configuration matching camarasbuild.json!
        cameras: [
            {
                id: 'cam-1',
                name: 'CAM-01: Estacionamiento Sup / Mid',
                x: 650,
                y: 300,
                angle: 216,
                reach: 207,
                fov: 65,
                type: 'Fija',
                status: 'active',
                zone: 'Estacionamiento',
                conduit: 'Caja Condulet LL = 1'
            },
            {
                id: 'cam-2',
                name: 'CAM-02: Trailer Médico / Bodega (Izq)',
                x: 490,
                y: 540,
                angle: 215,
                reach: 170,
                fov: 65,
                type: 'Fija',
                status: 'active',
                zone: 'Áreas Verdes / Estacionamiento',
                conduit: 'Caja Condulet LR = 1'
            },
            {
                id: 'cam-3',
                name: 'CAM-03: Trailer Médico / Motos (Der)',
                x: 490,
                y: 540,
                angle: 313,
                reach: 174,
                fov: 65,
                type: 'Fija',
                status: 'active',
                zone: 'Áreas Verdes / Motos',
                conduit: 'Manguera Metálica 3/4"'
            },
            {
                id: 'cam-4',
                name: 'CAM-04: Portón PCP / Nómina',
                x: 850,
                y: 290,
                angle: 211,
                reach: 208,
                fov: 65,
                type: 'PTZ',
                status: 'active',
                zone: 'Portón Acceso PCP',
                conduit: 'Caja Condulet Tipo T = 1+1'
            },
            {
                id: 'cam-5',
                name: 'CAM-05: PCP Av. Intercomunal',
                x: 860,
                y: 290,
                angle: 328,
                reach: 208,
                fov: 65,
                type: 'PTZ',
                status: 'active',
                zone: 'PCP / Entrada',
                conduit: 'Caja Condulet T'
            },
            {
                id: 'cam-6',
                name: 'CAM-06: Entrada Estac. Transporte',
                x: 860,
                y: 300,
                angle: 45,
                reach: 220,
                fov: 70,
                type: 'Domo',
                status: 'active',
                zone: 'Estacionamiento Transporte',
                conduit: 'Tubo Metálico 3/4"'
            },
            {
                id: 'cam-7',
                name: 'CAM-07: Estac. Transporte Norte-Der',
                x: 1540,
                y: 300,
                angle: 205,
                reach: 160,
                fov: 70,
                type: 'Domo',
                status: 'active',
                zone: 'Estacionamiento Transporte',
                conduit: 'Caja Condulet LR'
            },
            {
                id: 'cam-8',
                name: 'CAM-08: Estac. Transporte Sur-Der',
                x: 1540,
                y: 330,
                angle: 135,
                reach: 155,
                fov: 70,
                type: 'Domo',
                status: 'active',
                zone: 'Estacionamiento Transporte',
                conduit: 'Caja Condulet LL'
            },
            {
                id: 'cam-9',
                name: 'CAM-09: Bombonas de Gas',
                x: 1610,
                y: 320,
                angle: 16,
                reach: 160,
                fov: 60,
                type: 'Térmica',
                status: 'active',
                zone: 'Bombonas de Gas',
                conduit: 'Caja Condulet T'
            },
            {
                id: 'cam-1787583753374',
                name: 'CAM-10: Nueva Cámara',
                x: 660,
                y: 310,
                angle: 136,
                reach: 160,
                fov: 60,
                type: 'Fija',
                status: 'active',
                zone: 'Planta Cabudare',
                conduit: 'Caja Condulet T'
            },
            {
                id: 'cam-1787583771299',
                name: 'CAM-11: Nueva Cámara',
                x: 760,
                y: 350,
                angle: 125,
                reach: 130,
                fov: 40,
                type: 'Fija',
                status: 'active',
                zone: 'Planta Cabudare',
                conduit: 'Caja Condulet T'
            },
            {
                id: 'cam-1787583812963',
                name: 'CAM-12: Nueva Cámara',
                x: 490,
                y: 560,
                angle: 119,
                reach: 109,
                fov: 60,
                type: 'Fija',
                status: 'active',
                zone: 'Planta Cabudare',
                conduit: 'Caja Condulet T'
            }
        ]
    };

    // --- DOM ELEMENTS ---
    const viewport = document.getElementById('canvas-viewport');
    const transformWrapper = document.getElementById('canvas-transform-wrapper');
    const svg = document.getElementById('croquis-svg');
    
    const zonesLayer = document.getElementById('zones-layer');
    const mapLabelsLayer = document.getElementById('map-labels-layer');
    const fovLayer = document.getElementById('fov-layer');
    const camerasNodesLayer = document.getElementById('cameras-nodes-layer');
    const handlesLayer = document.getElementById('interactive-handles-layer');
    
    const cameraListContainer = document.getElementById('camera-list');
    const cameraCountBadge = document.getElementById('camera-count-badge');
    const cameraSearchInput = document.getElementById('camera-search');
    
    const inspectorEmptyState = document.getElementById('inspector-empty-state');
    const inspectorForm = document.getElementById('inspector-form');
    const zoneInspectorForm = document.getElementById('zone-inspector-form');

    // Form Controls
    const inspCamBadge = document.getElementById('insp-cam-id-badge');
    const inspCamName = document.getElementById('insp-cam-name');
    const inspAngleSlider = document.getElementById('insp-angle-slider');
    const inspAngleVal = document.getElementById('insp-angle-val');
    const inspReachSlider = document.getElementById('insp-reach-slider');
    const inspReachVal = document.getElementById('insp-reach-val');
    const inspFovSlider = document.getElementById('insp-fov-slider');
    const inspFovVal = document.getElementById('insp-fov-val');
    const inspCamType = document.getElementById('insp-cam-type');
    const inspCamStatus = document.getElementById('insp-cam-status');
    const inspCamZone = document.getElementById('insp-cam-zone');
    const inspCamConduit = document.getElementById('insp-cam-conduit');

    // Buttons & Toggles
    const btnToggleCameras = document.getElementById('btn-toggle-cameras');
    const btnAddCam = document.getElementById('btn-add-camera');
    const btnAddZone = document.getElementById('btn-add-zone');
    const btnBgToggle = document.getElementById('btn-bg-toggle');
    const btnResetView = document.getElementById('btn-reset-view');
    const btnSnap = document.getElementById('btn-snap');
    const themeSelector = document.getElementById('theme-selector');
    
    const btnZoomIn = document.getElementById('btn-zoom-in');
    const btnZoomOut = document.getElementById('btn-zoom-out');
    const btnZoomFit = document.getElementById('btn-zoom-fit');
    const zoomLevelText = document.getElementById('zoom-level-text');

    const btnExportJson = document.getElementById('btn-export-json');
    const fileImportJson = document.getElementById('file-import-json');
    const btnReloadBuild = document.getElementById('btn-reload-build');
    const btnExportPng = document.getElementById('btn-export-png');
    const btnDuplicateCam = document.getElementById('btn-duplicate-cam');
    const btnDeleteCam = document.getElementById('btn-delete-cam');

    // --- LOCALSTORAGE PERSISTENCE HELPERS ---
    function saveStateToLocalStorage() {
        try {
            localStorage.setItem('cctv_saved_cameras', JSON.stringify(state.cameras));
        } catch (e) {
            console.error('Error saving cameras to localStorage:', e);
        }
    }

    function loadInitialCameras() {
        try {
            const saved = localStorage.getItem('cctv_saved_cameras');
            if (saved) {
                const parsed = JSON.parse(saved);
                if (Array.isArray(parsed) && parsed.length > 0) {
                    state.cameras = parsed;
                }
            }
        } catch (e) {
            console.error('Error loading cameras from localStorage:', e);
        }
    }

    // Modal
    const modalAddZone = document.getElementById('modal-add-zone');
    const btnCloseZoneModal = document.getElementById('btn-close-zone-modal');
    const btnCancelAddZone = document.getElementById('btn-cancel-add-zone');
    const btnConfirmAddZone = document.getElementById('btn-confirm-add-zone');

    // --- GEOMETRY HELPER FUNCTIONS ---
    function degToRad(deg) { return (deg * Math.PI) / 180; }
    function radToDeg(rad) { return ((rad * 180) / Math.PI + 360) % 360; }

    function getConePath(x, y, angleDeg, reach, fovDeg) {
        const halfFov = fovDeg / 2;
        const startAngle = degToRad(angleDeg - halfFov);
        const endAngle = degToRad(angleDeg + halfFov);

        const x1 = x + reach * Math.cos(startAngle);
        const y1 = y + reach * Math.sin(startAngle);
        const x2 = x + reach * Math.cos(endAngle);
        const y2 = y + reach * Math.sin(endAngle);

        const largeArcFlag = fovDeg > 180 ? 1 : 0;
        return `M ${x} ${y} L ${x1} ${y1} A ${reach} ${reach} 0 ${largeArcFlag} 1 ${x2} ${y2} Z`;
    }

    function getCanvasCoordinates(e) {
        const rect = svg.getBoundingClientRect();
        return {
            x: (e.clientX - rect.left) / state.zoom,
            y: (e.clientY - rect.top) / state.zoom
        };
    }

    function snap(val) {
        if (!state.snapToGrid) return Math.round(val);
        return Math.round(val / state.gridSize) * state.gridSize;
    }

    // --- RENDER FUNCTIONS ---
    function renderAll() {
        renderZones();
        renderCameras();
        renderCameraList();
        renderInspector();
        updateTransform();
    }

    function renderZones() {
        zonesLayer.innerHTML = '';
        mapLabelsLayer.innerHTML = '';

        // 1. UNIFIED CONTINUOUS STREET NETWORK (Left street + Central Entrance + Right Street + Bottom Main Street)
        const streetPath = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        const streetD = `
            M 140 100 
            L 140 1040 
            L 240 1040 
            L 240 680 
            L 1680 680 
            L 1680 1040 
            L 1760 1040 
            L 1760 300 
            L 1680 300 
            L 1680 600 
            L 760 600
            L 760 100
            L 660 100
            L 660 600
            L 240 600 
            L 240 100 
            Z
        `;
        streetPath.setAttribute('d', streetD);
        streetPath.setAttribute('fill', 'rgba(30, 41, 59, 0.85)');
        streetPath.setAttribute('stroke', 'var(--border-accent)');
        streetPath.setAttribute('stroke-width', '2');
        zonesLayer.appendChild(streetPath);

        // Street Text Labels
        const labelVert = document.createElementNS('http://www.w3.org/2000/svg', 'text');
        labelVert.setAttribute('x', '190');
        labelVert.setAttribute('y', '500');
        labelVert.setAttribute('transform', 'rotate(-90 190 500)');
        labelVert.setAttribute('class', 'zone-label-text');
        labelVert.setAttribute('font-size', '14');
        labelVert.setAttribute('fill', '#94a3b8');
        labelVert.textContent = 'CALLE INTERNA';
        mapLabelsLayer.appendChild(labelVert);

        const labelHoriz = document.createElementNS('http://www.w3.org/2000/svg', 'text');
        labelHoriz.setAttribute('x', '450');
        labelHoriz.setAttribute('y', '645');
        labelHoriz.setAttribute('class', 'zone-label-text');
        labelHoriz.setAttribute('font-size', '16');
        labelHoriz.setAttribute('font-weight', '700');
        labelHoriz.setAttribute('fill', '#ffffff');
        labelHoriz.textContent = 'CALLES INTERNAS DE PLANTA';
        mapLabelsLayer.appendChild(labelHoriz);

        // 2. DIBUJAR ZONAS Y EDIFICIOS
        state.zones.forEach(zone => {
            const rect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
            rect.setAttribute('x', zone.x);
            rect.setAttribute('y', zone.y);
            rect.setAttribute('width', zone.w);
            rect.setAttribute('height', zone.h);
            rect.setAttribute('class', 'zone-shape');
            rect.setAttribute('fill', zone.color || 'rgba(30, 58, 138, 0.5)');
            rect.setAttribute('stroke', 'var(--border-accent)');
            rect.setAttribute('stroke-width', zone.type === 'small-box' ? '1.5' : '2');

            rect.addEventListener('click', (e) => {
                e.stopPropagation();
                selectZone(zone.id);
            });
            zonesLayer.appendChild(rect);

            // Zone Text Label (Only if name is not empty!)
            if (zone.name) {
                const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
                const fontSz = zone.fontSize || (zone.h > 150 ? 16 : 12);
                
                if (zone.verticalText) {
                    text.setAttribute('x', zone.x + zone.w / 2);
                    text.setAttribute('y', zone.y + zone.h / 2);
                    text.setAttribute('transform', `rotate(-90 ${zone.x + zone.w / 2} ${zone.y + zone.h / 2})`);
                } else {
                    text.setAttribute('x', zone.x + zone.w / 2);
                    text.setAttribute('y', zone.y + zone.h / 2 + fontSz / 3);
                }

                text.setAttribute('class', 'zone-label-text');
                text.setAttribute('font-size', fontSz);
                text.setAttribute('font-weight', '600');
                text.setAttribute('fill', '#ffffff');
                text.textContent = zone.name;
                mapLabelsLayer.appendChild(text);
            }
        });

        // Technical Conduit Notes inside PLANTA CABUDARE block
        const notesGroup = document.createElementNS('http://www.w3.org/2000/svg', 'g');
        notesGroup.setAttribute('transform', 'translate(280, 740)');

        const notes = [
            'Caja condulet LL = 1',
            'LR = 1',
            'Manguera metalica 3/4"',
            'Caja condulet tipo T = 1 + 1'
        ];

        notes.forEach((note, idx) => {
            const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
            text.setAttribute('x', '0');
            text.setAttribute('y', idx * 35);
            text.setAttribute('font-family', 'JetBrains Mono, monospace');
            text.setAttribute('font-size', '20');
            text.setAttribute('fill', '#93c5fd');
            text.textContent = note;
            notesGroup.appendChild(text);
        });

        mapLabelsLayer.appendChild(notesGroup);
    }

    function renderCameras() {
        fovLayer.innerHTML = '';
        camerasNodesLayer.innerHTML = '';
        handlesLayer.innerHTML = '';

        const displayVal = state.showCameras ? 'block' : 'none';
        fovLayer.style.display = displayVal;
        camerasNodesLayer.style.display = displayVal;
        handlesLayer.style.display = displayVal;

        if (!state.showCameras) return;

        state.cameras.forEach(cam => {
            const isSelected = cam.id === state.selectedCameraId;
            
            // 1. FOV Cone Path (Triangle) with Dynamic Status Colors!
            const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
            const dStr = getConePath(cam.x, cam.y, cam.angle, cam.reach, cam.fov);
            path.setAttribute('d', dStr);
            path.setAttribute('class', 'camera-cone');
            
            if (isSelected) {
                path.setAttribute('fill', 'url(#fov-gradient-selected)');
                path.setAttribute('stroke', '#10b981');
                path.setAttribute('stroke-width', '2.5');
            } else if (cam.status === 'warning') {
                path.setAttribute('fill', 'url(#fov-gradient-warning)');
                path.setAttribute('stroke', '#f59e0b');
                path.setAttribute('stroke-width', '1.8');
            } else if (cam.status === 'offline' || cam.status === 'inactive') {
                path.setAttribute('fill', 'url(#fov-gradient-offline)');
                path.setAttribute('stroke', '#ef4444');
                path.setAttribute('stroke-width', '1.8');
            } else {
                path.setAttribute('fill', 'url(#fov-gradient-active)');
                path.setAttribute('stroke', '#3b82f6');
                path.setAttribute('stroke-width', '1.5');
            }

            path.addEventListener('click', (e) => {
                e.stopPropagation();
                selectCamera(cam.id);
            });
            fovLayer.appendChild(path);

            // 2. Camera Node Icon
            const gNode = document.createElementNS('http://www.w3.org/2000/svg', 'g');
            gNode.setAttribute('transform', `translate(${cam.x}, ${cam.y})`);
            gNode.setAttribute('class', 'camera-node');

            let nodeFill = '#1e3a8a';
            if (isSelected) {
                nodeFill = '#10b981';
            } else if (cam.status === 'warning') {
                nodeFill = '#d97706';
            } else if (cam.status === 'offline' || cam.status === 'inactive') {
                nodeFill = '#dc2626';
            }

            const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
            circle.setAttribute('r', isSelected ? '13' : '10');
            circle.setAttribute('fill', nodeFill);
            circle.setAttribute('stroke', '#ffffff');
            circle.setAttribute('stroke-width', '2');
            gNode.appendChild(circle);

            const arrow = document.createElementNS('http://www.w3.org/2000/svg', 'polygon');
            arrow.setAttribute('points', '-4,-4 7,0 -4,4');
            arrow.setAttribute('fill', '#ffffff');
            arrow.setAttribute('transform', `rotate(${cam.angle})`);
            gNode.appendChild(arrow);

            const labelText = document.createElementNS('http://www.w3.org/2000/svg', 'text');
            labelText.setAttribute('x', '0');
            labelText.setAttribute('y', '-16');
            labelText.setAttribute('text-anchor', 'middle');
            labelText.setAttribute('font-size', '11');
            labelText.setAttribute('font-weight', 'bold');
            labelText.setAttribute('fill', isSelected ? '#10b981' : '#f8fafc');
            labelText.textContent = cam.name.split(':')[0];
            gNode.appendChild(labelText);

            gNode.addEventListener('click', (e) => {
                e.stopPropagation();
                selectCamera(cam.id);
            });

            gNode.addEventListener('mousedown', (e) => {
                if (e.button !== 0) return;
                e.stopPropagation();
                selectCamera(cam.id);
                state.draggingHandle = 'move';
                state.dragTargetId = cam.id;
            });
            camerasNodesLayer.appendChild(gNode);

            // 3. Handles for Selected Camera
            if (isSelected) {
                // ROTATION HANDLE (Green circle)
                const rotDistance = cam.reach + 25;
                const rotRad = degToRad(cam.angle);
                const rotX = cam.x + rotDistance * Math.cos(rotRad);
                const rotY = cam.y + rotDistance * Math.sin(rotRad);

                const rotLine = document.createElementNS('http://www.w3.org/2000/svg', 'line');
                rotLine.setAttribute('x1', cam.x);
                rotLine.setAttribute('y1', cam.y);
                rotLine.setAttribute('x2', rotX);
                rotLine.setAttribute('y2', rotY);
                rotLine.setAttribute('class', 'handle-line');
                rotLine.setAttribute('stroke', '#10b981');
                handlesLayer.appendChild(rotLine);

                const rotHandle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
                rotHandle.setAttribute('cx', rotX);
                rotHandle.setAttribute('cy', rotY);
                rotHandle.setAttribute('r', '8');
                rotHandle.setAttribute('class', 'handle-node handle-rotate');
                rotHandle.addEventListener('mousedown', (e) => {
                    if (e.button !== 0) return;
                    e.stopPropagation();
                    state.draggingHandle = 'rotate';
                    state.dragTargetId = cam.id;
                });
                handlesLayer.appendChild(rotHandle);

                // RESIZE HANDLE (Orange circle)
                const arcRad = degToRad(cam.angle + cam.fov / 2);
                const resX = cam.x + cam.reach * Math.cos(arcRad);
                const resY = cam.y + cam.reach * Math.sin(arcRad);

                const resHandle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
                resHandle.setAttribute('cx', resX);
                resHandle.setAttribute('cy', resY);
                resHandle.setAttribute('r', '8');
                resHandle.setAttribute('class', 'handle-node handle-resize');
                resHandle.addEventListener('mousedown', (e) => {
                    if (e.button !== 0) return;
                    e.stopPropagation();
                    state.draggingHandle = 'resize';
                    state.dragTargetId = cam.id;
                });
                handlesLayer.appendChild(resHandle);
            }
        });
    }

    function renderCameraList() {
        cameraListContainer.innerHTML = '';
        const search = cameraSearchInput.value.toLowerCase();
        const filteredCams = state.cameras.filter(c => c.name.toLowerCase().includes(search) || c.zone.toLowerCase().includes(search));
        cameraCountBadge.textContent = state.cameras.length;

        filteredCams.forEach(cam => {
            const isSelected = cam.id === state.selectedCameraId;
            const card = document.createElement('div');
            card.className = `camera-card ${isSelected ? 'active' : ''}`;
            card.innerHTML = `
                <div class="cam-card-info">
                    <div class="cam-card-title">
                        <span class="status-dot ${cam.status}"></span>
                        <span>${cam.name}</span>
                    </div>
                    <div class="cam-card-sub">
                        <i class="fa-solid fa-compass"></i> ${cam.angle}° • Alcance: ${cam.reach}px • Apertura: ${cam.fov}°
                    </div>
                </div>
            `;
            card.addEventListener('click', () => {
                selectCamera(cam.id);
                centerCameraOnView(cam);
            });
            cameraListContainer.appendChild(card);
        });
    }

    function renderInspector() {
        if (!state.selectedCameraId) {
            inspectorEmptyState.classList.remove('hidden');
            inspectorForm.classList.add('hidden');
            zoneInspectorForm.classList.add('hidden');
            return;
        }

        const cam = state.cameras.find(c => c.id === state.selectedCameraId);
        if (!cam) return;

        inspectorEmptyState.classList.add('hidden');
        zoneInspectorForm.classList.add('hidden');
        inspectorForm.classList.remove('hidden');

        inspCamBadge.textContent = cam.name.split(':')[0];
        inspCamName.value = cam.name;
        inspAngleSlider.value = cam.angle;
        inspAngleVal.textContent = `${cam.angle}°`;
        inspReachSlider.value = cam.reach;
        inspReachVal.textContent = `${cam.reach} px`;
        inspFovSlider.value = cam.fov;
        inspFovVal.textContent = `${cam.fov}°`;
        inspCamType.value = cam.type || 'Fija';
        inspCamStatus.value = cam.status || 'active';
        inspCamZone.value = cam.zone || '';
        inspCamConduit.value = cam.conduit || '';
    }

    function selectCamera(id) {
        state.selectedCameraId = id;
        state.selectedZoneId = null;
        renderAll();
    }

    function selectZone(id) {
        state.selectedZoneId = id;
        state.selectedCameraId = null;
        renderAll();
    }

    function centerCameraOnView(cam) {
        const viewportRect = viewport.getBoundingClientRect();
        state.zoom = 1.0;
        state.panX = (viewportRect.width / 2) - (cam.x * state.zoom);
        state.panY = (viewportRect.height / 2) - (cam.y * state.zoom);
        updateTransform();
    }

    function updateTransform() {
        transformWrapper.style.transform = `translate(${state.panX}px, ${state.panY}px) scale(${state.zoom})`;
        zoomLevelText.textContent = `${Math.round(state.zoom * 100)}%`;
    }

    // --- TOGGLE CAMERAS BUTTON EVENT ---
    btnToggleCameras.addEventListener('click', () => {
        state.showCameras = !state.showCameras;
        btnToggleCameras.classList.toggle('active', state.showCameras);
        
        if (state.showCameras) {
            btnToggleCameras.innerHTML = `<i class="fa-solid fa-eye"></i><span>Cámaras: VISIBLES</span>`;
        } else {
            btnToggleCameras.innerHTML = `<i class="fa-solid fa-eye-slash"></i><span>Cámaras: OCULTAS</span>`;
        }

        renderCameras();
    });

    // --- FORM EVENTS WITH AUTO-SAVE ---
    inspCamName.addEventListener('input', (e) => {
        const cam = state.cameras.find(c => c.id === state.selectedCameraId);
        if (cam) { cam.name = e.target.value; renderCameras(); renderCameraList(); saveStateToLocalStorage(); }
    });

    inspAngleSlider.addEventListener('input', (e) => {
        const cam = state.cameras.find(c => c.id === state.selectedCameraId);
        if (cam) {
            cam.angle = parseInt(e.target.value);
            inspAngleVal.textContent = `${cam.angle}°`;
            renderCameras(); renderCameraList(); saveStateToLocalStorage();
        }
    });

    document.querySelectorAll('.quick-angle-buttons .btn-chip').forEach(btn => {
        btn.addEventListener('click', () => {
            const angle = parseInt(btn.dataset.angle);
            const cam = state.cameras.find(c => c.id === state.selectedCameraId);
            if (cam) {
                cam.angle = angle;
                inspAngleSlider.value = angle;
                inspAngleVal.textContent = `${angle}°`;
                renderCameras(); renderCameraList(); saveStateToLocalStorage();
            }
        });
    });

    inspReachSlider.addEventListener('input', (e) => {
        const cam = state.cameras.find(c => c.id === state.selectedCameraId);
        if (cam) {
            cam.reach = parseInt(e.target.value);
            inspReachVal.textContent = `${cam.reach} px`;
            renderCameras(); renderCameraList(); saveStateToLocalStorage();
        }
    });

    inspFovSlider.addEventListener('input', (e) => {
        const cam = state.cameras.find(c => c.id === state.selectedCameraId);
        if (cam) {
            cam.fov = parseInt(e.target.value);
            inspFovVal.textContent = `${cam.fov}°`;
            renderCameras(); renderCameraList(); saveStateToLocalStorage();
        }
    });

    inspCamType.addEventListener('change', (e) => {
        const cam = state.cameras.find(c => c.id === state.selectedCameraId);
        if (cam) { cam.type = e.target.value; saveStateToLocalStorage(); }
    });

    inspCamStatus.addEventListener('change', (e) => {
        const cam = state.cameras.find(c => c.id === state.selectedCameraId);
        if (cam) { cam.status = e.target.value; renderAll(); saveStateToLocalStorage(); }
    });

    inspCamZone.addEventListener('input', (e) => {
        const cam = state.cameras.find(c => c.id === state.selectedCameraId);
        if (cam) { cam.zone = e.target.value; saveStateToLocalStorage(); }
    });

    inspCamConduit.addEventListener('input', (e) => {
        const cam = state.cameras.find(c => c.id === state.selectedCameraId);
        if (cam) { cam.conduit = e.target.value; saveStateToLocalStorage(); }
    });

    btnDuplicateCam.addEventListener('click', () => {
        const cam = state.cameras.find(c => c.id === state.selectedCameraId);
        if (!cam) return;
        const newId = `cam-${Date.now()}`;
        state.cameras.push({ ...cam, id: newId, name: `${cam.name} (Copia)`, x: cam.x + 30, y: cam.y + 30 });
        selectCamera(newId);
        saveStateToLocalStorage();
    });

    btnDeleteCam.addEventListener('click', () => {
        if (!state.selectedCameraId) return;
        state.cameras = state.cameras.filter(c => c.id !== state.selectedCameraId);
        state.selectedCameraId = null;
        renderAll();
        saveStateToLocalStorage();
    });

    btnAddCam.addEventListener('click', () => {
        const nextNum = state.cameras.length + 1;
        const newId = `cam-${Date.now()}`;
        const newCam = {
            id: newId,
            name: `CAM-${nextNum < 10 ? '0' + nextNum : nextNum}: Nueva Cámara`,
            x: snap(850 + Math.random() * 100),
            y: snap(400 + Math.random() * 100),
            angle: 45,
            reach: 160,
            fov: 60,
            type: 'Fija',
            status: 'active',
            zone: 'Planta Cabudare',
            conduit: 'Caja Condulet T'
        };
        state.cameras.push(newCam);
        selectCamera(newId);
        centerCameraOnView(newCam);
        saveStateToLocalStorage();
    });

    // --- CANVAS INTERACTION (SMOOTH & PRECISE PAN + ZOOM TO MOUSE CURSOR) ---
    let isPanning = false;
    let startX = 0;
    let startY = 0;
    let initialPanX = 0;
    let initialPanY = 0;

    viewport.addEventListener('mousedown', (e) => {
        if (e.button !== 0) return;
        if (e.target.closest('.camera-node') || e.target.closest('.handle-node') || e.target.closest('.zone-shape')) return;
        
        state.selectedCameraId = null;
        state.selectedZoneId = null;
        renderAll();

        isPanning = true;
        startX = e.clientX;
        startY = e.clientY;
        initialPanX = state.panX;
        initialPanY = state.panY;
        viewport.style.cursor = 'grabbing';
    });

    window.addEventListener('mousemove', (e) => {
        if (isPanning) {
            const dx = e.clientX - startX;
            const dy = e.clientY - startY;
            state.panX = initialPanX + dx;
            state.panY = initialPanY + dy;
            updateTransform();
            return;
        }

        if (state.draggingHandle && state.dragTargetId) {
            const cam = state.cameras.find(c => c.id === state.dragTargetId);
            if (!cam) return;
            const coords = getCanvasCoordinates(e);

            if (state.draggingHandle === 'move') {
                cam.x = snap(coords.x);
                cam.y = snap(coords.y);
            } else if (state.draggingHandle === 'rotate') {
                const dx = coords.x - cam.x;
                const dy = coords.y - cam.y;
                cam.angle = Math.round(radToDeg(Math.atan2(dy, dx)));
                inspAngleSlider.value = cam.angle;
                inspAngleVal.textContent = `${cam.angle}°`;
            } else if (state.draggingHandle === 'resize') {
                const dx = coords.x - cam.x;
                const dy = coords.y - cam.y;
                cam.reach = Math.max(30, Math.min(400, Math.round(Math.sqrt(dx * dx + dy * dy))));
                inspReachSlider.value = cam.reach;
                inspReachVal.textContent = `${cam.reach} px`;
            }

            renderCameras();
            renderCameraList();
        }
    });

    window.addEventListener('mouseup', () => {
        if (isPanning) {
            isPanning = false;
            viewport.style.cursor = 'grab';
        }
        if (state.draggingHandle) {
            saveStateToLocalStorage();
        }
        state.draggingHandle = null;
        state.dragTargetId = null;
    });

    // Touch support for tablets / touchscreens
    viewport.addEventListener('touchstart', (e) => {
        if (e.touches.length === 1) {
            const touch = e.touches[0];
            if (touch.target.closest('.camera-node') || touch.target.closest('.handle-node') || touch.target.closest('.zone-shape')) return;
            isPanning = true;
            startX = touch.clientX;
            startY = touch.clientY;
            initialPanX = state.panX;
            initialPanY = state.panY;
        }
    }, { passive: true });

    viewport.addEventListener('touchmove', (e) => {
        if (isPanning && e.touches.length === 1) {
            const touch = e.touches[0];
            const dx = touch.clientX - startX;
            const dy = touch.clientY - startY;
            state.panX = initialPanX + dx;
            state.panY = initialPanY + dy;
            updateTransform();
        }
    }, { passive: true });

    viewport.addEventListener('touchend', () => {
        isPanning = false;
    });

    // Zoom directly focused on mouse cursor position!
    viewport.addEventListener('wheel', (e) => {
        e.preventDefault();
        const rect = viewport.getBoundingClientRect();
        const mouseX = e.clientX - rect.left;
        const mouseY = e.clientY - rect.top;

        const oldZoom = state.zoom;
        const zoomFactor = e.deltaY < 0 ? 1.12 : 0.88;
        const newZoom = Math.max(0.3, Math.min(3.5, oldZoom * zoomFactor));

        if (newZoom !== oldZoom) {
            state.panX = mouseX - (mouseX - state.panX) * (newZoom / oldZoom);
            state.panY = mouseY - (mouseY - state.panY) * (newZoom / oldZoom);
            state.zoom = newZoom;
            updateTransform();
        }
    }, { passive: false });

    btnZoomIn.addEventListener('click', () => { state.zoom = Math.min(3.0, state.zoom * 1.2); updateTransform(); });
    btnZoomOut.addEventListener('click', () => { state.zoom = Math.max(0.3, state.zoom / 1.2); updateTransform(); });
    btnZoomFit.addEventListener('click', () => { state.zoom = 0.8; state.panX = 30; state.panY = 20; updateTransform(); });
    btnResetView.addEventListener('click', () => { state.zoom = 1; state.panX = 30; state.panY = 20; updateTransform(); });
    btnSnap.addEventListener('click', () => { state.snapToGrid = !state.snapToGrid; btnSnap.classList.toggle('active', state.snapToGrid); });
    
    btnBgToggle.addEventListener('click', () => {
        state.showBgPhoto = !state.showBgPhoto;
        document.getElementById('reference-photo-layer').style.display = state.showBgPhoto ? 'block' : 'none';
        btnBgToggle.classList.toggle('active', state.showBgPhoto);
    });

    themeSelector.addEventListener('change', (e) => { document.body.className = e.target.value; });
    cameraSearchInput.addEventListener('input', renderCameraList);

    btnExportJson.addEventListener('click', () => {
        const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(state, null, 2));
        const anchor = document.createElement('a');
        anchor.setAttribute("href", dataStr);
        anchor.setAttribute("download", "planta_cabudare_cctv_plan.json");
        document.body.appendChild(anchor);
        anchor.click();
        anchor.remove();
    });

    fileImportJson.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = (event) => {
            try {
                const imported = JSON.parse(event.target.result);
                if (imported.cameras) {
                    state.cameras = imported.cameras;
                    if (imported.zones) state.zones = imported.zones;
                    renderAll();
                    saveStateToLocalStorage();
                }
            } catch (err) {}
        };
        reader.readAsText(file);
    });

    if (btnReloadBuild) {
        btnReloadBuild.addEventListener('click', async () => {
            try {
                const res = await fetch('camarasbuild.json');
                if (res.ok) {
                    const data = await res.json();
                    if (data.cameras) {
                        state.cameras = data.cameras;
                        saveStateToLocalStorage();
                        renderAll();
                        return;
                    }
                }
            } catch (err) {}
            localStorage.removeItem('cctv_saved_cameras');
            location.reload();
        });
    }

    btnExportPng.addEventListener('click', () => {
        const svgString = new XMLSerializer().serializeToString(svg);
        const svgBlob = new Blob([svgString], { type: "image/svg+xml;charset=utf-8" });
        const URL = window.URL || window.webkitURL || window;
        const blobURL = URL.createObjectURL(svgBlob);
        
        const image = new Image();
        image.onload = () => {
            const canvas = document.createElement("canvas");
            canvas.width = 2200;
            canvas.height = 1400;
            const ctx = canvas.getContext("2d");
            ctx.fillStyle = "#0b1329";
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            ctx.drawImage(image, 0, 0);

            const png = canvas.toDataURL("image/png");
            const a = document.createElement('a');
            a.setAttribute("href", png);
            a.setAttribute("download", "Planta_Cabudare_CCTV_Croquis.png");
            document.body.appendChild(a);
            a.click();
            a.remove();
        };
        image.src = blobURL;
    });

    btnAddZone.addEventListener('click', () => modalAddZone.classList.remove('hidden'));
    btnCloseZoneModal.addEventListener('click', () => modalAddZone.classList.add('hidden'));
    btnCancelAddZone.addEventListener('click', () => modalAddZone.classList.add('hidden'));

    btnConfirmAddZone.addEventListener('click', () => {
        const name = document.getElementById('new-zone-name').value || '';
        const type = document.getElementById('new-zone-type').value;
        const newZone = {
            id: `zone-${Date.now()}`,
            name: name,
            type: type,
            x: snap(500 + Math.random() * 100),
            y: snap(400 + Math.random() * 100),
            w: 200,
            h: 120,
            color: type === 'green' ? 'rgba(16, 185, 129, 0.15)' : 'rgba(30, 58, 138, 0.5)'
        };
        state.zones.push(newZone);
        modalAddZone.classList.add('hidden');
        renderZones();
    });

    // --- INITIALIZE ---
    loadInitialCameras();
    renderAll();
});
