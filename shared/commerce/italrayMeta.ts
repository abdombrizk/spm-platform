export type ItalrayProductMeta = {
  handle: string;
  badge: string;
  title: string;
  headline: string;
  subheadline: string;
  leadParagraph: string;
  secondaryParagraph: string;
  brochureUrl: string;
  brochureTitle: string;
  readingMinutes: number;
  heroImage: string;
  descriptionImage: string;
  highlights: string[];
  pillars: Array<{
    number: string;
    title: string;
    description: string;
    points: string[];
  }>;
  clinicalGallery: Array<{
    title: string;
    category: string;
    image: string;
    description: string;
  }>;
  upgrades: {
    hardware: Array<{
      title: string;
      tag: string;
      description: string;
      badge?: string;
    }>;
    software: Array<{
      title: string;
      tag: string;
      description: string;
      badge?: string;
    }>;
    packages: Array<{
      title: string;
      tag: string;
      description: string;
      badge?: string;
    }>;
  };
  specifications: Array<{
    category: string;
    specs: Array<{
      label: string;
      value: string;
      tooltip?: string;
    }>;
  }>;
};

export const ITALRAY_CATALOG_REGISTRY: Record<string, ItalrayProductMeta> = {
  "italray-carmex-fp21-fp30": {
    handle: "italray-carmex-fp21-fp30",
    badge: "Mobile C-Arm • Flat Panel Fluoroscopy & Radiography",
    title: "Italray CARMEX RK FP-S",
    headline: "A compact flat-panel C-Arm built for confident surgical imaging",
    subheadline: "All-in-one design, balanced positioning and low-dose digital workflow",
    leadParagraph:
      "Carmex RK FP-S is an all-in-one mobile C-Arm for surgical teams that need dependable fluoroscopy and digital radiography without a large room footprint. Its integrated system architecture, flat-panel detector technology and intuitive controls keep image review close to the procedure.",
    secondaryParagraph:
      "The brochure specifies a rotating-anode configuration with 5 kW generator power, up to 100 mA, 300 KHU tube capacity and 21×21 cm or 30×30 cm detector formats. A fixed-anode configuration is also described with 4 kW power, 79.8 KHU tube capacity and a 21×21 cm detector. Final configuration, options and clinical use should be confirmed with Italray and SPM for each project.",
    brochureUrl: "/manus-storage/CARMEXRKFP-S_b473b80e.pdf",
    brochureTitle: "Carmex RK FP-S Official Technical Brochure",
    readingMinutes: 3,
    heroImage: "/manus-storage/carmex-rkfps-hero_a5f16085.jpg",
    descriptionImage: "/manus-storage/carmex-rkfps-detail_ff617396.jpg",
    highlights: [
      "All-in-one mobile C-Arm with a compact footprint",
      "Flat-panel detector with 21×21 cm or 30×30 cm formats, 200 µm pixel size",
      "Rotating-anode version: 5 kW generator, up to 100 mA and 300 KHU tube",
      "27-inch multi-touch monitor plus 13-inch touch control panel on the C-Arm",
      "Pulsed fluoroscopy up to 15 fps, digital radiography and optional DSA",
      "DICOM 3.0, DAP meter, dual laser and removable anti-scatter grid",
    ],
    pillars: [
      {
        number: "01",
        title: "All-in-one imaging workflow",
        description: "The system integrates the mobile C-Arm components into one compact unit, reducing the need to move separate monitor trolleys and cables around the surgical suite.",
        points: ["Integrated C-Arm and image-monitor workflow", "Small footprint for compact rooms", "27-inch multi-touch monitor for live and saved images", "Intuitive operator interface with advanced functions"],
      },
      {
        number: "02",
        title: "Flat-panel image acquisition",
        description: "The a-Si detector with CsI scintillator supports the published 21×21 cm or 30×30 cm formats with 200 µm pixel size for digital fluoroscopy and radiography.",
        points: ["21×21 cm or 30×30 cm detector format", "200 µm pixel size", "Automatic square-field and parallel-shutter collimation", "Asymmetric collimation and removable anti-scatter grid"],
      },
      {
        number: "03",
        title: "Balanced movement in the operating room",
        description: "Carmex RK FP-S is designed around balanced movements, ergonomic handles and a compact mobile base for positioning around the surgical table.",
        points: ["310 kg rotating-anode C-Arm unit", "Motorized vertical movement", "Optional lateral C-Arm movement of ±45°", "Color-coded brakes, handles and cable-sweeping wheels"],
      },
      {
        number: "04",
        title: "Dose-aware digital workflow",
        description: "The published workflow combines pulsed fluoroscopy, digital radiography, post-processing and dose-area monitoring for controlled image acquisition.",
        points: ["Pulsed fluoroscopy up to 15 fps", "High-quality, low-dose fluoroscopy modes", "DAP dose-area product meter", "DICOM 3.0 and manual or automatic image saving"],
      },
    ],
    clinicalGallery: [
      { title: "Pelvis AP", category: "General Radiography", image: "/manus-storage/pevis_AP_redacted_3c7ee11a.jpg", description: "An anonymized AP pelvis radiograph representing a general radiography workflow." },
      { title: "Knee Lateral", category: "Orthopedics", image: "/manus-storage/knee_LAT_redacted_bba9789e.jpg", description: "An anonymized lateral knee projection representing orthopedic imaging." },
      { title: "Knee AP", category: "Orthopedics", image: "/manus-storage/knee_AP_redacted_75965479.jpg", description: "An anonymized AP knee projection representing orthopedic imaging." },
      { title: "C-Arm Product View", category: "System Overview", image: "/manus-storage/carmex-rkfps-hero_a5f16085.jpg", description: "Carmex RK FP-S product view from the supplied image set." },
      { title: "Flat-Panel Detector Detail", category: "System Detail", image: "/manus-storage/carmex-rkfps-detector_58c3e6b5.jpg", description: "Close-up product detail of the flat-panel detector assembly." },
    ],
    upgrades: {
      hardware: [
        { title: "Rotating-Anode Configuration", tag: "Generator option", description: "5 kW generator, up to 100 mA and 300 KHU X-ray tube as specified in the brochure.", badge: "RK FP-S" },
        { title: "Fixed-Anode Configuration", tag: "Generator option", description: "4 kW generator, up to 100 mA and 79.8 KHU X-ray tube with 21×21 cm detector format." },
        { title: "Active Cooling", tag: "Workflow option", description: "Selectable fan speed for improved thermal workflow during demanding cases." },
        { title: "Motorized Lateral Movement", tag: "Positioning option", description: "Optional C-Arm lateral movement of ±45° for additional positioning flexibility." },
      ],
      software: [
        { title: "Digital Radiography", tag: "Imaging mode", description: "Digital radiography acquisition alongside pulsed fluoroscopy." },
        { title: "DSA", tag: "Optional clinical function", description: "Digital Subtraction Angiography is marked as an option in the brochure." },
        { title: "Post-processing toolkit", tag: "Operator workflow", description: "Virtual collimator, edge enhancement, LIH, cineloop, live drawing and adaptive ROI." },
        { title: "DICOM 3.0", tag: "Connectivity", description: "DICOM 3.0 support for a connected digital imaging workflow." },
      ],
      packages: [
        { title: "Orthopedic workflow", tag: "Clinical pathway", description: "A project configuration focused on knee, pelvis, trauma and orthopedic procedures." },
        { title: "Compact surgical suite", tag: "Room planning", description: "An all-in-one configuration for sites where footprint and cable management matter." },
        { title: "SPM lifecycle support", tag: "Service pathway", description: "Installation planning, operator training, preventive maintenance and genuine-parts coordination through SPM.", badge: "SPM Support" },
      ],
    },
    specifications: [
      { category: "Rotating-Anode Version", specs: [
        { label: "Generator Power", value: "5 kW" },
        { label: "Maximum Current", value: "100 mA" },
        { label: "X-ray Tube", value: "300 KHU" },
        { label: "Detector", value: "a-Si detector with CsI scintillator" },
        { label: "Detector Format", value: "21×21 cm or 30×30 cm" },
        { label: "Pixel Size", value: "200 µm" },
      ] },
      { category: "Fixed-Anode Version", specs: [
        { label: "Generator Power", value: "4 kW" },
        { label: "Maximum Current", value: "100 mA" },
        { label: "X-ray Tube", value: "79.8 KHU" },
        { label: "Detector Format", value: "21×21 cm" },
        { label: "Image-Intensifier Replacement", value: "Suitable for replacement 9-inch image intensifier system" },
      ] },
      { category: "Clinical Imaging & Controls", specs: [
        { label: "Fluoroscopy", value: "Pulsed fluoroscopy up to 15 fps" },
        { label: "Digital Radiography", value: "Included in published rotating-anode workflow" },
        { label: "DSA", value: "Digital Subtraction Angiography marked as optional" },
        { label: "Main Monitor", value: "27-inch multi-touch monitor" },
        { label: "C-Arm Control Panel", value: "13-inch touch screen" },
        { label: "Post-processing", value: "Virtual collimator, edge enhancement, LIH, cineloop, live drawing and adaptive ROI" },
      ] },
      { category: "Mechanical & Safety Features", specs: [
        { label: "Rotating-Anode Unit Weight", value: "310 kg" },
        { label: "Motorized Movement", value: "Vertical movement; optional lateral movement ±45°" },
        { label: "Collimation", value: "Automatic square field and parallel shutters; asymmetric collimation" },
        { label: "Dose Monitoring", value: "DAP – Dose Area Product meter" },
        { label: "Laser Guidance", value: "Dual laser modules on flat panel and monoblock" },
        { label: "Connectivity", value: "DICOM 3.0" },
      ] },
    ],
  },

  "italray-clinodigit-omega-drf": {
    handle: "italray-clinodigit-omega-drf",
    badge: "Multifunctional DR + DRF • Universal System",
    title: "Italray Clinodigit OMEGA",
    headline: "Unifying radiography and fluoroscopy on a single dynamic detector",
    subheadline: "Maximum clinical versatility with minimum room footprint",
    leadParagraph:
      "Modern radiology departments face increasing demands for cost efficiency, high patient throughput, and clinical flexibility without compromising image quality. The Italray Clinodigit OMEGA is a revolutionary multifunctional digital radiography and radio-fluoroscopy system built around an innovative tilting U-arm geometry and a single high-resolution dynamic flat-panel detector.",
    secondaryParagraph:
      "Representing the pinnacle of Italray's engineering heritage, Clinodigit OMEGA performs all general radiography studies (chest, spine, extremities, pelvis) and all radio-fluoroscopy examinations (gastrointestinal, myelography, arthrography, interventional) on a single compact system. Backed by SPM's certified engineering service throughout Egypt, it transforms departmental productivity while reducing room preparation costs.",
    brochureUrl: "/manus-storage/CLINODIGITOMEGA_eng_01_print_ae4c9fc5.pdf",
    brochureTitle: "Italray Clinodigit OMEGA Official Brochure",
    readingMinutes: 5,
    heroImage: "https://cdn.shopify.com/s/files/1/1002/9672/0673/files/CynPHMVwZLyWxJZE.jpg?v=1790775792",
    descriptionImage: "https://cdn.shopify.com/s/files/1/1002/9672/0673/files/luCkupRtQevzQFoC.jpg?v=1790775850",
    highlights: [
      "Dynamic 43×43 cm Flat-Panel Detector for both radiography and fluoroscopy",
      "Fully motorized U-arm with variable SID from 100 cm up to 180 cm",
      "Automated positioning presets for over 1,000 anatomical protocols",
      "Mobile elevating carbon-fiber patient table with zero longitudinal barrier",
      "Official SPM supply, site planning, turn-key installation, and warranty",
    ],
    pillars: [
      {
        number: "01",
        title: "One Dynamic Detector for Complete 2D & Dynamic Exams",
        description:
          "Eliminate the need for separate radiography rooms and fluoroscopy suites. The 43×43 cm active field handles full chest exposures at 180 cm SID as easily as barium swallows at 30 fps.",
        points: [
          "Seamless transition between high-dose-efficiency radiography and dynamic fluoroscopy",
          "Full 43 cm × 43 cm coverage without detector rotation",
          "16-bit contrast depth revealing micro-fractures and subtle mucosal contours",
          "Rapid auto-collimation linked to selected anatomical program (APR)",
        ],
      },
      {
        number: "02",
        title: "Motorized Tilting U-Arm with Variable Source-to-Image Distance",
        description:
          "The motorized arc rotates effortlessly from -30° through +90°, facilitating standing, seated, and recumbent patient examinations with zero physical strain on operators.",
        points: [
          "Continuous motorized SID variation between 100 cm and 180 cm",
          "Isocentric rotation maintaining the anatomical center during angle changes",
          "Proximity sensors and active anti-collision guards on all moving axes",
          "Compact footprint requiring only 4m × 4m room dimensions",
        ],
      },
      {
        number: "03",
        title: "Mobile Carbon-Fiber Table with Battery-Assisted Positioning",
        description:
          "A lightweight, fully transparent mobile patient table docks effortlessly into the U-arm field for recumbent studies and rolls away cleanly for standing chest examinations or wheelchair patients.",
        points: [
          "Motorized elevation from low transfer height (50 cm) up to 90 cm",
          "High patient weight capacity up to 250 kg without deflection",
          "Longitudinal and lateral floating table top with electromagnetic brakes",
          "Clear floor clearance for easy hoist and stretcher approach",
        ],
      },
      {
        number: "04",
        title: "Italian Industrial Craftsmanship & SPM National Service",
        description:
          "Designed and hand-assembled in Italy under rigorous European medical directives, backed by SPM's factory-trained engineers across all Egyptian governorates.",
        points: [
          "Robust steel and aviation-grade aluminum construction built for decades of service",
          "Direct teleradiology and PACS export with complete DICOM 3.0 conformance",
          "Remote diagnostics module enabling SPM engineers to monitor calibration data",
          "Locally available OEM tube and board replacements in Cairo depot",
        ],
      },
    ],
    clinicalGallery: [
      {
        title: "Full Thoracic & Chest Radiography at 180 cm SID",
        category: "General Radiography",
        image: "https://cdn.shopify.com/s/files/1/1002/9672/0673/files/CynPHMVwZLyWxJZE.jpg?v=1790775792",
        description: "Zero magnification artifact with optimal focal distance and anti-scatter grid.",
      },
      {
        title: "Upper GI & Barium Swallow Dynamic Fluoroscopy",
        category: "Radio-Fluoroscopy",
        image: "https://cdn.shopify.com/s/files/1/1002/9672/0673/files/wejcrXXYEfSGIMQj.jpg?v=1790775811",
        description: "High frame rate dynamic tracking of swallowing mechanisms at low radiation dose.",
      },
      {
        title: "Weight-Bearing Spine & Lower Limb Stitching",
        category: "Orthopedic Imaging",
        image: "https://cdn.shopify.com/s/files/1/1002/9672/0673/files/luCkupRtQevzQFoC.jpg?v=1790775850",
        description: "Automated multi-exposure acquisition with seamless software image fusion.",
      },
      {
        title: "Stretcher & Wheelchair Trauma Exams",
        category: "Emergency Medicine",
        image: "https://cdn.shopify.com/s/files/1/1002/9672/0673/files/YAxKxvwVnZrleBJR.jpg?v=1790775779",
        description: "Patient remains on their stretcher while the U-arm glides into alignment.",
      },
    ],
    upgrades: {
      hardware: [
        {
          title: "Full-Spine / Long-Leg Auto-Stitching System",
          tag: "Hardware & Software",
          description: "Motorized column travel with automated exposure sequence and seamless composite stitching.",
          badge: "Essential Ortho",
        },
        {
          title: "Elevating Patient Table with Longitudinal Float",
          tag: "Patient Comfort",
          description: "Carbon-fiber table top with 4-way float and electronic height positioning.",
        },
        {
          title: "Wireless Secondary Console Tablet",
          tag: "Operator Workflow",
          description: "Handheld operator tablet for protocol selection and patient positioning inside the room.",
        },
      ],
      software: [
        {
          title: "Advanced Bone Suppression & Soft-Tissue Filter",
          tag: "Clinical Processing",
          description: "Dual-energy simulation software enhancing retro-cardiac and lung-field nodule detection.",
          badge: "Diagnostic AI",
        },
        {
          title: "DAP Radiation Dose Management & RDSR Export",
          tag: "Quality Control",
          description: "Real-time dose-area product monitoring exported automatically to institutional PACS.",
        },
        {
          title: "Automated Grid-Sense & Anti-Scatter Software",
          tag: "Workflow Speed",
          description: "Virtual grid processing eliminating physical grid handling for bed and wheelchair patients.",
        },
      ],
      packages: [
        {
          title: "Comprehensive Turnkey Hospital Package",
          tag: "Facility Solution",
          description: "Lead-glass shielding design, electrical conditioning, HVAC consultation, installation, and acceptance.",
          badge: "Turn-Key",
        },
        {
          title: "Diagnostic Radiology High-Throughput Bundle",
          tag: "Department Setup",
          description: "Includes high-capacity 80 kW generator, dual workstations, and stitching software.",
        },
      ],
    },
    specifications: [
      {
        category: "Dynamic Detector System",
        specs: [
          { label: "Detector Technology", value: "Direct Amorphous Silicon (a-Si) with CsI Scintillator" },
          { label: "Active Field Area", value: "43 cm × 43 cm (17\" × 17\")" },
          { label: "Image Matrix", value: "3072 × 3072 pixels (9 Megapixels)" },
          { label: "Dynamic Acquisition Rate", value: "1 to 30 fps in continuous and pulsed fluoroscopy" },
          { label: "A/D Conversion", value: "16-bit true medical gray levels" },
        ],
      },
      {
        category: "Generator & Tube",
        specs: [
          { label: "High-Frequency Generator", value: "50 kW / 65 kW / 80 kW high-frequency inverter" },
          { label: "kVp Range", value: "40 to 150 kVp in 1 kV increments" },
          { label: "mA Range", value: "10 mA to 1000 mA" },
          { label: "Anode Heat Storage", value: "300,000 to 600,000 HU rotating anode" },
          { label: "Dual Focal Spot", value: "0.6 mm (fine) / 1.2 mm (broad)" },
        ],
      },
      {
        category: "Motorized U-Arm Mechanics",
        specs: [
          { label: "Variable SID Range", value: "100 cm to 180 cm fully motorized" },
          { label: "U-Arm Vertical Stroke", value: "45 cm to 170 cm above floor" },
          { label: "Arm Rotation Range", value: "-30° to +120° motorized with auto-stops" },
          { label: "Tube & Detector Angulation", value: "±45° relative angle for oblique projections" },
          { label: "Anti-Collision Protection", value: "Capacitive contact-free safety sensors" },
        ],
      },
      {
        category: "SPM Support in Egypt",
        specs: [
          { label: "Representation", value: "Sole Authorized Agency for Italray in Egypt" },
          { label: "Local Engineers", value: "Factory-trained in Florence, Italy" },
          { label: "Emergency Response", value: "Guaranteed SLA with Cairo engineering dispatch" },
          { label: "Spare Parts Availability", value: "OEM certified components stored locally in Egypt" },
        ],
      },
    ],
  },

  "italray-clinodigit-flo-radio-fluoro": {
    handle: "italray-clinodigit-flo-radio-fluoro",
    badge: "Radio-Fluoroscopy Table • Remote-Controlled",
    title: "Italray Clinodigit FLO",
    headline: "The modern standard in remote-controlled fluoroscopy",
    subheadline: "Complete versatility for gastrointestinal, vascular, and general studies",
    leadParagraph:
      "Remote-controlled radio-fluoroscopy tables are the cornerstone of clinical digestive, urological, and general diagnostic radiology. The Italray Clinodigit FLO combines complete table tilting from 90° vertical to -90° Trendelenburg with an expansive longitudinal scanning range and an ultra-low minimum patient step-height.",
    secondaryParagraph:
      "Equipped with a dynamic flat panel and an intuitive touch control desk, Clinodigit FLO delivers crisp diagnostic fluoroscopy and instant high-resolution radiography. Supported across Egypt by SPM's dedicated biomedical specialists, it ensures patient comfort, zero operator exposure from the shielded control room, and rapid clinical turnover.",
    brochureUrl: "/manus-storage/CLINODIGIT_FLO_ING_TROK_d30c23b8.pdf",
    brochureTitle: "Italray Clinodigit FLO Official Brochure",
    readingMinutes: 4,
    heroImage: "https://cdn.shopify.com/s/files/1/1002/9672/0673/files/wejcrXXYEfSGIMQj.jpg?v=1790775811",
    descriptionImage: "https://cdn.shopify.com/s/files/1/1002/9672/0673/files/CynPHMVwZLyWxJZE.jpg?v=1790775792",
    highlights: [
      "+90° to -90° motorized table tilting with continuous speed regulation",
      "Dynamic Flat-Panel Detector: 43×43 cm active field coverage",
      "Low table access height (48 cm) for pediatric, elderly, and trauma patients",
      "Lead-shielded remote control console with touch-screen workflow",
      "Backed by SPM's nationwide maintenance contracts and original parts",
    ],
    pillars: [
      {
        number: "01",
        title: "Full +90° to -90° Trendelenburg Table Movement",
        description:
          "Smooth, hydraulic-grade motorization tilts the table through full vertical and inverted Trendelenburg positions, facilitating complex myelography, barium studies, and emergency resuscitation.",
        points: [
          "Zero vibration tilting ensuring patient security during movement",
          "Adjustable footrest with safety step and motorized height calibration",
          "Lateral and longitudinal table-top glide for head-to-toe coverage without patient movement",
          "Heavy weight rating supporting bariatric patients up to 230 kg",
        ],
      },
      {
        number: "02",
        title: "Remote Console with Zero-Dose Collimation",
        description:
          "Operators control all table movements, compression cones, tube angles, and exposure parameters from behind lead-glass shielding, eliminating cumulative scatter exposure.",
        points: [
          "Color touchscreen integrated with high-definition live review monitors",
          "Virtual collimator blades adjustable on Last Image Hold (LIH)",
          "Motorized compression device with auto-pressure limitation",
          "Intercom system with two-way voice communication with the examination room",
        ],
      },
      {
        number: "03",
        title: "Large-Field 43×43 cm Dynamic Digital Detector",
        description:
          "High-efficiency Cesium Iodide flat panel captures the entire abdominal or pelvic cavity in a single shot without clipping anatomy or moving the detector during dynamic series.",
        points: [
          "Crystal-clear visualization of barium transit and urological contrast",
          "Digital spot radiography with sub-second transition from fluoroscopy",
          "Pulsed fluoroscopy modes reducing cumulative patient exposure by up to 70%",
          "Real-time recursive edge sharpening and recursive temporal filtering",
        ],
      },
      {
        number: "04",
        title: "Turnkey Installation & Certified Service by SPM",
        description:
          "SPM manages room preparation, lead shielding calculations, floor load reinforcement, delivery, and lifecycle maintenance for seamless hospital operations.",
        points: [
          "Official authorized agency partnership with Italray Italy",
          "Cairo-based stock of electronic boards, high-voltage cables, and spare components",
          "Preventive maintenance schedules adhering to ISO quality frameworks",
          "Dedicated application specialist training for radiology staff",
        ],
      },
    ],
    clinicalGallery: [
      {
        title: "Barium Meal & Double Contrast Stomach Exam",
        category: "Gastrointestinal Radiology",
        image: "https://cdn.shopify.com/s/files/1/1002/9672/0673/files/wejcrXXYEfSGIMQj.jpg?v=1790775811",
        description: "High-contrast dynamic mucosal study with motorized compression.",
      },
      {
        title: "Endoscopic Retrograde Cholangiopancreatography (ERCP)",
        category: "Interventional GI",
        image: "https://cdn.shopify.com/s/files/1/1002/9672/0673/files/CynPHMVwZLyWxJZE.jpg?v=1790775792",
        description: "Lateral access and low tabletop step allowing effortless C-arm or endoscope docking.",
      },
      {
        title: "Intravenous Urography & Cystography",
        category: "Urology",
        image: "https://cdn.shopify.com/s/files/1/1002/9672/0673/files/luCkupRtQevzQFoC.jpg?v=1790775850",
        description: "Complete full-urinary-tract visualization with rapid serial acquisition.",
      },
      {
        title: "Standing Chest & Spine Radiography",
        category: "General Radiography",
        image: "https://cdn.shopify.com/s/files/1/1002/9672/0673/files/ZQUPAJOOFlsXsxEP.jpg?v=1790775799",
        description: "Table tilts to 90° upright for natural weight-bearing spinal examinations.",
      },
    ],
    upgrades: {
      hardware: [
        {
          title: "Motorized Compressive Cone with Force Sensor",
          tag: "Gastrointestinal",
          description: "Assists barium dispersion with real-time pressure readout on the operator console.",
          badge: "Specialist",
        },
        {
          title: "Elevating Column Table Module",
          tag: "Ergonomics",
          description: "Adds motorized tabletop height variation from 48 cm up to 92 cm.",
          badge: "Recommended",
        },
        {
          title: "Secondary In-Room Operator Foot Controller",
          tag: "Interventional Use",
          description: "Allows hands-free table and exposure control for in-room interventional procedures.",
        },
      ],
      software: [
        {
          title: "Dynamic Vascular Angiography & DSA Package",
          tag: "Vascular Module",
          description: "Enables peripheral angiography on the tilting table with digital subtraction.",
        },
        {
          title: "Automated Image Stitching for Long Spines",
          tag: "Orthopedics",
          description: "Full-leg and full-spine composite acquisition with motorized longitudinal sweep.",
        },
      ],
      packages: [
        {
          title: "Complete Hospital Fluoroscopy Suite",
          tag: "Comprehensive",
          description: "Includes Clinodigit FLO, lead-glass viewing window, intercom, PACS server, and SPM SLA.",
          badge: "Hospital Turnkey",
        },
      ],
    },
    specifications: [
      {
        category: "Tilting Table Mechanics",
        specs: [
          { label: "Tilting Angle Range", value: "+90° (vertical) to -90° (Trendelenburg)" },
          { label: "Tabletop Dimensions", value: "220 cm × 70 cm carbon-fiber" },
          { label: "Tabletop Height", value: "Fixed 85 cm or motorized 48 cm to 92 cm" },
          { label: "Longitudinal Tabletop Glide", value: "90 cm motorized travel" },
          { label: "Transverse Tabletop Glide", value: "30 cm lateral travel" },
          { label: "Maximum Patient Weight", value: "230 kg (standing and recumbent)" },
        ],
      },
      {
        category: "Dynamic Digital Detector",
        specs: [
          { label: "Detector Type", value: "CsI Dynamic Flat Panel Detector" },
          { label: "Active Area", value: "43 cm × 43 cm" },
          { label: "Resolution", value: "3072 × 3072 pixels" },
          { label: "Frame Rate", value: "Up to 30 fps in continuous and pulsed modes" },
          { label: "Variable SID", value: "115 cm to 150 cm motorized" },
        ],
      },
      {
        category: "Generator & Tube",
        specs: [
          { label: "Generator Output", value: "65 kW / 80 kW High-Frequency" },
          { label: "kVp Range", value: "40 kV to 150 kV" },
          { label: "Fluoroscopy Pulse Rates", value: "1, 2, 4, 7.5, 15, 30 pulses/sec" },
          { label: "X-Ray Tube", value: "High-speed rotating anode (300 kHU / 600 kHU)" },
        ],
      },
      {
        category: "SPM Lifecycle Commitment",
        specs: [
          { label: "Egyptian Distributor", value: "SPM Systems for Projects & Maintenance" },
          { label: "Warranty", value: "Comprehensive OEM warranty with extended contract options" },
          { label: "Technical Support", value: "Certified biomedical field engineers with 24/7 hotline" },
          { label: "Original Parts", value: "Guaranteed 10-year spare parts availability in Egypt" },
        ],
      },
    ],
  },

  "italray-corsix-dr-mobile": {
    handle: "italray-corsix-dr-mobile",
    badge: "Mobile DR • Bedside & Intensive Care",
    title: "Italray CORSIX DR",
    headline: "Mobile digital radiography with motorized ease and instant results",
    subheadline: "Hospital-wide digital imaging at the patient bedside",
    leadParagraph:
      "When critical patients cannot be safely transported to the radiology department, the imaging system must travel effortlessly to their bedside. The Italray CORSIX DR is an ultra-modern motorized mobile digital radiography unit built with high-torque electric drive, a telescopic column, and wireless flat-panel detectors.",
    secondaryParagraph:
      "Engineered for ICU, emergency trauma bays, isolation wards, and operating rooms, CORSIX DR navigates narrow hospital corridors with finger-light touch control. Supported in Egypt exclusively by SPM, it provides instant wireless preview within 3 seconds, enabling critical clinical decisions at the point of care.",
    brochureUrl: "/manus-storage/CORSIXDR_ENG_00_PRINT_e141edfa.pdf",
    brochureTitle: "Italray CORSIX DR Official Brochure",
    readingMinutes: 3,
    heroImage: "https://cdn.shopify.com/s/files/1/1002/9672/0673/files/YAxKxvwVnZrleBJR.jpg?v=1790775779",
    descriptionImage: "https://cdn.shopify.com/s/files/1/1002/9672/0673/files/dnKHBpoyOLIKqRpH.jpg?v=1790775771",
    highlights: [
      "Motorized drive with independent dual-wheel electric traction",
      "Telescopic collapsible column for unobstructed forward visibility while driving",
      "Instant image preview within 3 seconds on a 19-inch anti-glare touch display",
      "Wireless Cesium Iodide (CsI) cassette-sized flat-panel detectors",
      "Certified SPM distribution, on-site commissioning, and Cairo parts inventory",
    ],
    pillars: [
      {
        number: "01",
        title: "Telescopic Column with 360° Forward Driving Visibility",
        description:
          "Traditional mobile X-rays obstruct the driver's view with tall fixed masts. CORSIX DR features a motorized collapsible column that lowers automatically during transport for zero blind spots.",
        points: [
          "Bumper touch-sensors that instantly halt the unit upon encountering any obstacle",
          "Ergonomic drive handles with dual pressure-sensitive throttle controls",
          "Compact wheelbase enabling 360° zero-radius turns inside crowded elevators",
          "High-capacity lithium/lead-acid battery pack providing up to 25 km driving range",
        ],
      },
      {
        number: "02",
        title: "High-Power 32 kW or 40 kW Monoblock Generator",
        description:
          "High power output packed into a mobile chassis delivers crisp, freeze-motion chest exposures even for uncooperative emergency patients or deep bariatric cases.",
        points: [
          "Short exposure times down to 1 millisecond preventing patient motion blur",
          "Independent capacitor storage allowing full-power exposures without wall plugs",
          "Rotating anode tube with dual focal spots for fine micro-fracture resolution",
          "Automatic anatomical programming (APR) with hundreds of preset protocols",
        ],
      },
      {
        number: "03",
        title: "Wireless Lightweight Flat-Panel Detectors",
        description:
          "IPX6 water-resistant, shock-absorbing wireless flat panels slip easily behind patients in ICU beds without disturbing infusion lines or ventilators.",
        points: [
          "Available in 35×43 cm and 24×30 cm pediatric/extremity sizes",
          "High Detective Quantum Efficiency (DQE) minimizing radiation dose in neonatology",
          "On-board detector charging bin with battery swap in under 5 seconds",
          "Seamless Wi-Fi transmission directly to the onboard console and hospital PACS",
        ],
      },
      {
        number: "04",
        title: "Point-of-Care Diagnostics Supported by SPM",
        description:
          "SPM provides end-to-end reliability with proactive battery inspections, calibration audits, radiation safety testing, and nationwide engineer coverage.",
        points: [
          "Sole authorized agent and technical partner for Italray in Egypt",
          "Guaranteed uptime contracts designed for 24/7 emergency departments",
          "Direct integration with hospital RIS/PACS via wireless DICOM 3.0",
          "Hands-on operator certification for nursing and radiographer teams",
        ],
      },
    ],
    clinicalGallery: [
      {
        title: "Intensive Care Bedside Chest & Line Verification",
        category: "ICU Radiography",
        image: "https://cdn.shopify.com/s/files/1/1002/9672/0673/files/YAxKxvwVnZrleBJR.jpg?v=1790775779",
        description: "Verify endotracheal and central venous line placement within 3 seconds.",
      },
      {
        title: "Emergency Trauma Bay Resuscitation Imaging",
        category: "Emergency Medicine",
        image: "https://cdn.shopify.com/s/files/1/1002/9672/0673/files/dnKHBpoyOLIKqRpH.jpg?v=1790775771",
        description: "Immediate pelvic and cervical spine assessment without transferring patient.",
      },
      {
        title: "Neonatal & Pediatric Low-Dose Imaging",
        category: "Pediatric Care",
        image: "https://cdn.shopify.com/s/files/1/1002/9672/0673/files/ZQUPAJOOFlsXsxEP.jpg?v=1790775799",
        description: "Ultra-low-dose pediatric APRs with 24×30 cm cassette detector in incubator tray.",
      },
      {
        title: "Orthopedic Operating Room Verification",
        category: "Surgery",
        image: "https://cdn.shopify.com/s/files/1/1002/9672/0673/files/luCkupRtQevzQFoC.jpg?v=1790775850",
        description: "Rapid post-fixation radiography on the operating table without sterile compromise.",
      },
    ],
    upgrades: {
      hardware: [
        {
          title: "Secondary Pediatric Wireless Detector (24×30 cm)",
          tag: "Detector Upgrade",
          description: "Compact CsI detector dedicated to neonatal incubator trays and small extremities.",
          badge: "Pediatric",
        },
        {
          title: "Integrated Barcode & RFID Patient Scanner",
          tag: "Workflow Speed",
          description: "Scans patient wristbands to automatically pull worklist and demographic data.",
        },
        {
          title: "Anti-Scatter Grid with Quick-Lock Frame",
          tag: "Image Quality",
          description: "Clip-on carbon-fiber grid for dense abdominal and pelvic examinations.",
        },
      ],
      software: [
        {
          title: "Virtual Grid AI Image Processing",
          tag: "Software Algorithm",
          description: "Software-based scatter reduction eliminating the need for physical grids in bed.",
          badge: "Smart Tech",
        },
        {
          title: "Pneumothorax & Tube Position Highlighting",
          tag: "Diagnostic Aid",
          description: "Image processing filter accentuating pleural line contours and catheter tip boundaries.",
        },
      ],
      packages: [
        {
          title: "ICU & Emergency Complete Mobile Solution",
          tag: "Hospital Solution",
          description: "CORSIX DR, dual wireless flat panels, barcode scanner, and SPM 24/7 SLA.",
          badge: "Turnkey",
        },
      ],
    },
    specifications: [
      {
        category: "Mobile Traction & Battery",
        specs: [
          { label: "Motor Drive", value: "Dual independent electric motors with variable speed throttle" },
          { label: "Maximum Driving Speed", value: "Up to 5 km/h with auto-brake on slope" },
          { label: "Battery Autonomy", value: "Up to 25 km driving + over 250 exposures per full charge" },
          { label: "Battery Technology", value: "High-capacity lead-crystal or optional Lithium-Iron" },
          { label: "Charging Connection", value: "Standard 220V wall socket with auto-retract cord" },
        ],
      },
      {
        category: "Generator & Tube",
        specs: [
          { label: "High-Frequency Generator", value: "32 kW or 40 kW inverter" },
          { label: "kVp Range", value: "40 kV to 150 kV in 1 kV increments" },
          { label: "mAs Range", value: "0.1 mAs to 500 mAs" },
          { label: "X-Ray Tube", value: "Rotating anode tube with 0.6 mm / 1.2 mm focal spots" },
          { label: "Collimator", value: "Manual with LED light field and electronic timer" },
        ],
      },
      {
        category: "Telescopic Arm Mechanics",
        specs: [
          { label: "Column Type", value: "Telescopic collapsible column" },
          { label: "Transport Height", value: "Under 130 cm for clear driver line of sight" },
          { label: "Maximum Focus-to-Floor", value: "210 cm for tall bedside procedures" },
          { label: "Horizontal Arm Extension", value: "Up to 125 cm outreach over wide beds" },
          { label: "Arm Rotation", value: "±315° column rotation around vertical axis" },
        ],
      },
      {
        category: "SPM Service & Support",
        specs: [
          { label: "Distributor in Egypt", value: "SPM Systems for Projects & Maintenance" },
          { label: "On-Site Response", value: "Cairo metro within 4 hours; all governorates supported" },
          { label: "Spare Batteries & Tubes", value: "Stocked locally in Egypt for zero downtime" },
          { label: "Regulatory Compliance", value: "Compliant with Egyptian radiation authority regulations" },
        ],
      },
    ],
  },

  "italray-xfm-mobile-dr": {
    handle: "italray-xfm-mobile-dr",
    badge: "Compact Mobile X-Ray • High Maneuverability",
    title: "Italray XFM Mobile DR",
    headline: "Agile, compact bedside digital radiography",
    subheadline: "Every hospital department within easy reach",
    leadParagraph:
      "For clinics, surgical wards, and regional healthcare centers seeking full digital radiography performance without the weight or footprint of heavy motorized units, the Italray XFM delivers outstanding agility. Its counterbalanced mechanical arm and featherweight chassis allow effortless manual pushing through any doorway.",
    secondaryParagraph:
      "Combined with wireless digital flat panels and high-efficiency monoblock generation, the XFM platform produces crisp diagnostic images within seconds. SPM ensures complete peace of mind through authorized supply, comprehensive application training, and rapid localized technical service throughout Egypt.",
    brochureUrl: "/manus-storage/XFM_ENG_00_PRINT_74d937f9.pdf",
    brochureTitle: "Italray XFM Technical Brochure",
    readingMinutes: 3,
    heroImage: "https://cdn.shopify.com/s/files/1/1002/9672/0673/files/dnKHBpoyOLIKqRpH.jpg?v=1790775771",
    descriptionImage: "https://cdn.shopify.com/s/files/1/1002/9672/0673/files/YAxKxvwVnZrleBJR.jpg?v=1790775779",
    highlights: [
      "Ultra-compact footprint: fits inside standard passenger elevators and tight doorways",
      "Counterbalanced spring-assisted arm with 360° positioning flexibility",
      "Wireless cassette-sized digital detector with immediate on-screen preview",
      "High-frequency 30 kW generator with standard mains plug charging",
      "Exclusively supported and maintained across Egypt by SPM",
    ],
    pillars: [
      {
        number: "01",
        title: "Featherweight Maneuverability & Compact Architecture",
        description:
          "Weighing significantly less than motorized mobile units, XFM glides smoothly over hospital thresholds and between crowded beds with zero physical exertion.",
        points: [
          "Total system weight under 180 kg for effortless single-operator handling",
          "Four swivel castors with central foot-operated brake",
          "Compact chassis profile allowing unhindered forward vision during transport",
          "Convenient integrated storage bin for wireless detectors, grids, and wipes",
        ],
      },
      {
        number: "02",
        title: "Generous Arm Reach for Difficult Patient Positioning",
        description:
          "The articulated, counterbalanced tube support arm extends easily across wide intensive-care beds and orthopedic traction frames.",
        points: [
          "Focus-to-floor distance adjustable from 40 cm up to 200 cm",
          "Tube head rotation on its own axis for cross-table lateral projections",
          "Single-hand release brake for rapid one-touch positioning",
          "Precision angle scales for reproducible anatomical alignment",
        ],
      },
      {
        number: "03",
        title: "Wireless Digital Workflow with 3-Second Review",
        description:
          "Equipped with Italray's intuitive touch workstation, examinations are initiated in seconds from patient worklists and verified instantly at the bedside.",
        points: [
          "Wireless 35×43 cm CsI flat panel detector with 16-bit dynamic depth",
          "Full battery autonomy enabling up to 150 exposures without plugging into wall",
          "Immediate image quality verification preventing unnecessary repeat shots",
          "Automatic wireless sync to PACS via DICOM Store protocol",
        ],
      },
      {
        number: "04",
        title: "SPM Authorized Quality & Lifetime Partnership",
        description:
          "Every XFM unit delivered in Egypt is supported by SPM's dedicated biomedical team, from initial lead survey to scheduled preventive maintenance.",
        points: [
          "Direct authorized partner of Italray Italy with factory-trained technicians",
          "Competitive quote-led commercial options tailored for Egyptian healthcare institutions",
          "Full warranty and availability of original consumable and spare parts",
          "Comprehensive staff operational and safety certification upon delivery",
        ],
      },
    ],
    clinicalGallery: [
      {
        title: "General Ward Bedside Chest Examination",
        category: "Ward Radiography",
        image: "https://cdn.shopify.com/s/files/1/1002/9672/0673/files/dnKHBpoyOLIKqRpH.jpg?v=1790775771",
        description: "Effortless navigation into standard patient rooms with quick wireless acquisition.",
      },
      {
        title: "Post-Operative Orthopedic Assessment",
        category: "Orthopedics",
        image: "https://cdn.shopify.com/s/files/1/1002/9672/0673/files/YAxKxvwVnZrleBJR.jpg?v=1790775779",
        description: "High-contrast bone detail across hip, knee, and extremity pin fixations.",
      },
      {
        title: "Outpatient Clinic & Emergency Triage",
        category: "Emergency & Outpatient",
        image: "https://cdn.shopify.com/s/files/1/1002/9672/0673/files/luCkupRtQevzQFoC.jpg?v=1790775850",
        description: "Rapid deployment across clinics without requiring dedicated heavy X-ray rooms.",
      },
    ],
    upgrades: {
      hardware: [
        {
          title: "Secondary Pediatric Detector (24×30 cm)",
          tag: "Detector",
          description: "Compact wireless panel for neonatal and small joint examinations.",
        },
        {
          title: "High-Luminance 17-inch Touch Display",
          tag: "Console",
          description: "Anti-reflective sunlight-readable touch panel for harsh clinical ambient light.",
        },
      ],
      software: [
        {
          title: "Gridless Scatter Correction Algorithm",
          tag: "AI Processing",
          description: "Virtual anti-scatter processing for bedbound patients without physical grid weight.",
          badge: "Popular",
        },
      ],
      packages: [
        {
          title: "Clinic & Hospital Wing Starter Bundle",
          tag: "Complete Bundle",
          description: "XFM system, wireless 35×43 cm detector, on-site training, and 2-year SPM warranty.",
        },
      ],
    },
    specifications: [
      {
        category: "Generator & Tube",
        specs: [
          { label: "Generator Output", value: "30 kW high frequency" },
          { label: "kV Range", value: "40 kV to 125 kV" },
          { label: "mAs Range", value: "0.1 mAs to 320 mAs" },
          { label: "X-Ray Tube", value: "Rotating anode with 0.6 mm / 1.3 mm focal spots" },
        ],
      },
      {
        category: "Maneuverability & Footprint",
        specs: [
          { label: "Total System Weight", value: "Approx. 175 kg manual push" },
          { label: "Transport Dimensions", value: "115 cm (L) × 65 cm (W) × 140 cm (H)" },
          { label: "Arm Vertical Reach", value: "40 cm to 200 cm from floor" },
          { label: "Arm Horizontal Outreach", value: "Up to 115 cm" },
        ],
      },
      {
        category: "Detector & Console",
        specs: [
          { label: "Detector", value: "Wireless 35×43 cm CsI Flat Panel Detector" },
          { label: "Acquisition Time", value: "Under 3 seconds to preview" },
          { label: "Console Display", value: "Integrated 15\" or 17\" touch PC with DICOM 3.0" },
        ],
      },
    ],
  },

  "italray-mammograph-ffdm-d-tomo": {
    handle: "italray-mammograph-ffdm-d-tomo",
    badge: "Digital Mammography • FFDM & Digital Breast Tomosynthesis",
    title: "Italray Mammograph FFDM & Tomo",
    headline: "Uncompromising clarity in breast cancer screening and diagnosis",
    subheadline: "Ultra-high resolution amorphous selenium direct conversion",
    leadParagraph:
      "Early detection of breast lesions requires supreme spatial resolution, low radiation exposure, and comfortable ergonomic compression. The Italray Mammograph family combines full-field digital mammography (FFDM) with state-of-the-art Digital Breast Tomosynthesis (DBT) to eliminate overlapping tissue obscurity.",
    secondaryParagraph:
      "Utilizing direct amorphous selenium (a-Se) detector technology with 85 µm pixel pitch, the Italray Mammograph produces crystal-clear micro-calcification visibility. Backed in Egypt exclusively by SPM, it provides clinical centers with Italian diagnostic elegance, gentle microprocessor compression, and turnkey QA compliance.",
    brochureUrl: "/manus-storage/MAMMO_ENG_00_PRINT_e82d1856.pdf",
    brochureTitle: "Italray Mammograph Official Brochure",
    readingMinutes: 4,
    heroImage: "https://cdn.shopify.com/s/files/1/1002/9672/0673/files/dKJcMRMKIYfePkTa.jpg?v=1790775762",
    descriptionImage: "https://cdn.shopify.com/s/files/1/1002/9672/0673/files/luCkupRtQevzQFoC.jpg?v=1790775850",
    highlights: [
      "Direct conversion Amorphous Selenium (a-Se) detector with 85 µm pixel pitch",
      "Digital Breast Tomosynthesis (DBT) with wide 50° angular sweep option",
      "Microprocessor-controlled GentleCompress with smart decelerated force",
      "High-speed Tungsten/Molybdenum bi-angular tube with Ag/Rh filtration",
      "Dedicated SPM clinical application training and preventive calibration in Egypt",
    ],
    pillars: [
      {
        number: "01",
        title: "Direct Conversion Amorphous Selenium (a-Se) Detector",
        description:
          "Unlike indirect phosphor detectors that scatter light, direct a-Se converts X-ray photons straight into electrical charge, delivering razor-sharp micro-calcification edge sharpness.",
        points: [
          "Ultra-fine 85 µm pixel pitch revealing early malignant calcification clusters",
          "High Detective Quantum Efficiency (DQE) reducing patient exposure by up to 35%",
          "Large 24×30 cm active field accommodating all patient breast sizes without clipping",
          "Instantaneous readout ready for continuous high-throughput screening sessions",
        ],
      },
      {
        number: "02",
        title: "Digital Breast Tomosynthesis (DBT) with Wide-Angle Arc",
        description:
          "Tomosynthesis acquires a rapid low-dose sequence of angular projections, reconstructed into 1 mm thin slices that peel away dense fibroglandular tissue overlapping.",
        points: [
          "Wide angular sweep up to 50° for superior depth resolution and lesion isolation",
          "Sub-4-second tomosynthesis scan time minimizing patient motion artifacts",
          "Synthesized 2D view (C-View) generated directly from 3D slices with zero extra dose",
          "Seamless viewing and slice scrolling on dedicated 5MP medical monitors",
        ],
      },
      {
        number: "03",
        title: "Smart GentleCompress Ergonomic Patient Experience",
        description:
          "Patient comfort is vital for compliance and positioning. The motorized paddle decelerates upon breast contact, applying only the exact pressure necessary for optimal image density.",
        points: [
          "Dual foot-switch and console controls with real-time pressure readouts in Newtons",
          "Ergonomic handgrips with patient relaxation contours reducing pectoral tension",
          "Curved, flexible compression paddles conforming naturally to breast anatomy",
          "Rapid decompression release instantly following exposure completion",
        ],
      },
      {
        number: "04",
        title: "Comprehensive Mammography Partnership with SPM",
        description:
          "SPM delivers turnkey mammography solutions across Egypt: clinical room layout, shielding verification, daily QA phantom protocols, and 24/7 technical service.",
        points: [
          "Sole authorized agent and service provider for Italray in Egypt",
          "MQSA and European screening protocol compliance testing included",
          "Local availability of spare compression paddles, filters, and calibration phantoms",
          "Comprehensive physician and technologist training by certified application staff",
        ],
      },
    ],
    clinicalGallery: [
      {
        title: "Dense Breast Tomosynthesis Reconstruction",
        category: "3D Tomosynthesis",
        image: "https://cdn.shopify.com/s/files/1/1002/9672/0673/files/dKJcMRMKIYfePkTa.jpg?v=1790775762",
        description: "Lesion margin visualization clearly isolated from dense overlying parenchyma.",
      },
      {
        title: "Micro-Calcification Cluster Analysis at 85 µm",
        category: "Screening FFDM",
        image: "https://cdn.shopify.com/s/files/1/1002/9672/0673/files/luCkupRtQevzQFoC.jpg?v=1790775850",
        description: "High spatial resolution displaying pleomorphic and branching calcifications.",
      },
    ],
    upgrades: {
      hardware: [
        {
          title: "Stereotactic Biopsy Device (Upright & Lateral)",
          tag: "Biopsy Add-On",
          description: "High-precision add-on unit with sub-millimeter needle localization for tissue sampling.",
          badge: "Clinical Specialty",
        },
        {
          title: "Dual 5-Megapixel Diagnostic Review Monitors",
          tag: "Reporting Station",
          description: "Medical-grade 5MP high-luminance monitors calibrated for mammography diagnosis.",
        },
        {
          title: "Full Set of Magnification & Spot Compression Paddles",
          tag: "Accessories",
          description: "Includes 1.5x and 1.8x geometric magnification stands and spot compression cones.",
        },
      ],
      software: [
        {
          title: "Synthesized 2D Mammography (C-View)",
          tag: "AI Reconstruction",
          description: "Generates standard 2D views directly from 3D data, eliminating dual-exposure radiation.",
          badge: "Standard",
        },
        {
          title: "Computer-Aided Detection (CAD) Integration",
          tag: "Diagnostic AI",
          description: "Automated lesion highlighting and density categorization assistant.",
        },
      ],
      packages: [
        {
          title: "Breast Screening Center Turnkey Package",
          tag: "Complete Center",
          description: "Mammograph with Tomo, 5MP diagnostic station, biopsy device, phantom, and SPM SLA.",
          badge: "Premium",
        },
      ],
    },
    specifications: [
      {
        category: "Detector & Imaging",
        specs: [
          { label: "Detector Technology", value: "Direct conversion Amorphous Selenium (a-Se)" },
          { label: "Active Field Size", value: "24 cm × 30 cm" },
          { label: "Pixel Size", value: "85 µm" },
          { label: "Image Matrix", value: "2816 × 3584 pixels (approx. 10 MP)" },
          { label: "A/D Conversion", value: "16-bit dynamic depth" },
        ],
      },
      {
        category: "X-Ray Tube & Generator",
        specs: [
          { label: "Tube Target Material", value: "Tungsten (W) or Molybdenum (Mo) bi-angular anode" },
          { label: "Filtration Options", value: "Rhodium (Rh), Silver (Ag), Aluminum (Al)" },
          { label: "Focal Spots", value: "0.1 mm (fine magnification) / 0.3 mm (standard)" },
          { label: "High-Frequency Generator", value: "5 kW to 7 kW high-stability inverter" },
          { label: "kV Range", value: "20 kV to 40 kV in 0.5 kV increments" },
        ],
      },
      {
        category: "Tomosynthesis Performance",
        specs: [
          { label: "Scan Angle Options", value: "Narrow 15° (rapid) or Wide 50° (high depth)" },
          { label: "Number of Projections", value: "15 to 25 low-dose projection frames" },
          { label: "Reconstructed Slices", value: "1 mm spacing with interactive scrolling" },
          { label: "Synthesized 2D Support", value: "Yes, fully integrated in acquisition station" },
        ],
      },
    ],
  },

  "italray-x-frame-dr-systems": {
    handle: "italray-x-frame-dr-systems",
    badge: "Digital Radiography • X-FRAME DR EZ / EZ@",
    title: "Italray X-FRAME DR EZ",
    headline: "Digital radiography that positions, tracks and focuses with confidence",
    subheadline: "A smarter room workflow built around automatic alignment and grid control",
    leadParagraph:
      "The Italray X-FRAME DR EZ / EZ@ family is designed for digital radiography rooms that need repeatable positioning and consistent image geometry across routine and emergency examinations. Its automation focuses the operator on the patient and the clinical workflow rather than manual system alignment.",
    secondaryParagraph:
      "The supplied DR SOLUTIONS brochure highlights four core functions: Auto Positioning, Auto Tracking, Auto Focusing and Auto Grid Alignment. Together they keep the X-ray tube, digital detector, focus-detector distance, grid and ionization chambers coordinated for correct projections, including oblique examinations and mobile-table workflows.",
    brochureUrl: "/manus-storage/DRSOLUTIONS_fab841ef.pdf",
    brochureTitle: "Italray X-FRAME DR EZ / EZ@ Solutions Brochure",
    readingMinutes: 3,
    heroImage: "/manus-storage/x-frame-dr-hero_791f595c.jpg",
    descriptionImage: "/manus-storage/x-frame-dr-room-01_c1fc77e7.jpg",
    highlights: [
      "Auto Positioning based on the selected examination and projection",
      "Auto Tracking keeps the X-ray tube and digital detector aligned",
      "Auto Focusing maintains the selected focus-detector distance as table height changes",
      "Motorized detector tilting and rotation for automatic grid alignment",
      "Designed for correct projections, oblique views and emergency mobile-table exams",
    ],
    pillars: [
      {
        number: "01",
        title: "Auto Positioning",
        description: "Fully automatic positioning is activated from the selected examination and projection, with predefined or customizable positions available from a remote control or tube-stand console.",
        points: ["Exam-driven automatic positioning", "Projection-specific presets", "Customizable system positions", "Remote control or tube-stand console activation"],
      },
      {
        number: "02",
        title: "Auto Tracking",
        description: "The X-ray tube and digital detector align automatically to support a simple and correct examination, keeping the X-ray beam centered on the detector even in oblique projections.",
        points: ["Automatic tube-to-detector alignment", "Constant beam alignment on the detector", "Supports oblique projections", "Reduces manual alignment steps"],
      },
      {
        number: "03",
        title: "Auto Focusing",
        description: "The selected focus-detector distance remains constant as the patient table height changes, helping maintain a consistent magnification factor across the examination.",
        points: ["Selected focus-detector distance is maintained", "Compensates for table-height changes", "Consistent magnification factor", "Repeatable room workflow"],
      },
      {
        number: "04",
        title: "Auto Grid Alignment",
        description: "Motorized detector tilting and rotation align the grid and ionization chambers for digital X-ray exams on mobile tables and for oblique projections.",
        points: ["Tilting and motorized grid alignment", "Detector rotation and tilt coordination", "Grid and ionization chamber alignment", "Useful for emergency and mobile-table exams"],
      },
    ],
    clinicalGallery: [
      { title: "X-FRAME DR Room View", category: "System Overview", image: "/manus-storage/x-frame-dr-hero_791f595c.jpg", description: "The supplied X-FRAME DR room image selected as the product hero." },
      { title: "X-FRAME DR Tube Stand", category: "System Overview", image: "/manus-storage/x-frame-dr-room-01_c1fc77e7.jpg", description: "Installed X-FRAME DR room view showing the tube stand and table." },
      { title: "Tube-Stand Console", category: "Operator Workflow", image: "/manus-storage/x-frame-dr-console_7ef33a6c.jpg", description: "Close view of the operator console in the supplied installation image." },
      { title: "Digital Radiography Room", category: "Room Installation", image: "/manus-storage/x-frame-dr-room-02_a5cd3e88.jpg", description: "X-FRAME DR system installed in a clinical radiography room." },
      { title: "Radiography Control Room", category: "Workflow", image: "/manus-storage/x-frame-dr-control-room_5a40337a.jpg", description: "Control-room view from the supplied X-FRAME DR image set." },
      { title: "Thorax PA", category: "Chest Radiography", image: "/manus-storage/xray-thorax-pa-redacted_41a30a8c.jpg", description: "An anonymized PA thorax radiograph for digital radiography workflow illustration." },
      { title: "Thorax Lateral", category: "Chest Radiography", image: "/manus-storage/xray-thorax-lat-redacted_0f1b64c3.jpg", description: "An anonymized lateral thorax radiograph for digital radiography workflow illustration." },
      { title: "Full-Spine Stitching AP", category: "Orthopedic Imaging", image: "/manus-storage/xray-spine-stitching-redacted_8bd92316.jpg", description: "An anonymized AP spine stitching study for long-length imaging workflow illustration." },
      { title: "Skull PA", category: "General Radiography", image: "/manus-storage/xray-skull-pa-redacted_f36b7295.jpg", description: "An anonymized skull PA study for general radiography workflow illustration." },
    ],
    upgrades: {
      hardware: [
        { title: "Motorized Detector Alignment", tag: "Grid alignment", description: "Coordinate detector tilting and rotation for automatic grid and ionization chamber alignment.", badge: "Core Function" },
        { title: "Tube-Stand Console Workflow", tag: "Operator control", description: "Activate predefined or customizable positioning from the tube-stand console." },
        { title: "Remote Positioning Control", tag: "Room workflow", description: "Use the remote control to activate the selected examination and projection position." },
      ],
      software: [
        { title: "Exam-Based Auto Positioning", tag: "Automation", description: "Select the examination and projection to call the corresponding positioning sequence." },
        { title: "Auto Focus Distance", tag: "Image geometry", description: "Maintain the selected focus-detector distance when the table height changes." },
        { title: "Auto Tracking Logic", tag: "Alignment", description: "Keep the X-ray beam correctly aligned with the digital detector during movement and oblique projections." },
      ],
      packages: [
        { title: "Standard DR Room Workflow", tag: "Room configuration", description: "A project configuration centered on automatic positioning, tracking and focus control." },
        { title: "Emergency Mobile-Table Workflow", tag: "Clinical pathway", description: "Grid alignment support for digital X-ray examinations performed on mobile tables." },
        { title: "SPM Installation & Training", tag: "Service pathway", description: "Room planning, commissioning, operator training and lifecycle support coordinated by SPM.", badge: "SPM Support" },
      ],
    },
    specifications: [
      { category: "X-FRAME DR EZ / EZ@ Family", specs: [
        { label: "System Type", value: "Digital radiography solution" },
        { label: "Published Variants", value: "X-FRAME DR EZ and X-FRAME DR EZ@-based solutions" },
        { label: "Positioning", value: "Fully automatic based on selected exam and projection" },
        { label: "Control Points", value: "Remote control or tube-stand console" },
      ] },
      { category: "Automatic Alignment Functions", specs: [
        { label: "Auto Tracking", value: "Automatic X-ray tube and digital detector alignment" },
        { label: "Oblique Projections", value: "Beam alignment remains constant on the digital detector" },
        { label: "Auto Focusing", value: "Selected focus-detector distance maintained as table height changes" },
        { label: "Magnification", value: "Consistent magnification factor during table-height changes" },
      ] },
      { category: "Motorized Grid Alignment", specs: [
        { label: "Detector Movement", value: "Automatic motorized detector tilting and rotation" },
        { label: "Grid Alignment", value: "Grid and ionization chambers kept aligned" },
        { label: "Mobile Tables", value: "Supports digital X-ray emergency exams on mobile tables" },
        { label: "Clinical Positioning", value: "Supports oblique projections with automatic alignment" },
      ] },
      { category: "SPM Project Support", specs: [
        { label: "Room Planning", value: "Site planning and installation coordination available through SPM" },
        { label: "Training", value: "Operator training and workflow orientation available through SPM" },
        { label: "Commercial Model", value: "Institutional quotation and project configuration" },
      ] },
    ],
  },

  "italray-clinodigit-c-arm": {
    handle: "italray-clinodigit-c-arm",
    badge: "Surgical C-Arm • High Precision",
    title: "Italray Clinodigit C-Arm",
    headline: "Proven intraoperative imaging for general and orthopedic surgery",
    subheadline: "Robust Italian engineering for daily surgical performance",
    leadParagraph:
      "Designed to meet the everyday imaging needs of surgical theaters, the Italray Clinodigit Mobile C-Arm provides reliable fluoroscopy and digital radiography across general surgery, traumatology, orthopedics, and endoscopy.",
    secondaryParagraph:
      "Featuring high-resolution optics, balanced orbital rotation, and intuitive operator consoles, Clinodigit delivers immediate clinical clarity. Backed by SPM's dedicated engineering network across Egypt, hospitals benefit from low total cost of ownership and dependable on-site maintenance.",
    brochureUrl: "/manus-storage/CARMEXFP_ENG_TR_6d332bd1.pdf",
    brochureTitle: "Italray Clinodigit C-Arm Brochure",
    readingMinutes: 3,
    heroImage: "https://cdn.shopify.com/s/files/1/1002/9672/0673/files/MsiwLyhyWlEjDsPK.jpg?v=1790773853",
    descriptionImage: "https://cdn.shopify.com/s/files/1/1002/9672/0673/files/ZQUPAJOOFlsXsxEP.jpg?v=1790775799",
    highlights: [
      "High-resolution digital image chain with low-dose pulsed fluoroscopy",
      "Ergonomic counterbalanced C-arm with wide orbital travel",
      "Dual medical-grade display workstation with last-image hold (LIH)",
      "Compact steering chassis for effortless maneuvering between OR suites",
      "Certified SPM distribution, on-site installation, and genuine spare parts",
    ],
    pillars: [
      {
        number: "01",
        title: "Intraoperative Imaging Clarity with Low Dose",
        description:
          "High-contrast imaging enables surgeons to visualize bone cortical boundaries, screws, and catheter guides with minimal radiation exposure.",
        points: [
          "Pulsed fluoroscopy modes reducing cumulative surgical team exposure",
          "Automatic brightness and contrast control (ABC) adapting to tissue thickness",
          "Digital snapshot radiography for high-resolution anatomical records",
          "Integrated laser guidance for fast, zero-exposure anatomical centering",
        ],
      },
      {
        number: "02",
        title: "Smooth Counterbalanced C-Arc Movement",
        description:
          "Surgical procedures require versatile angular and orbital views without disturbing the sterile field.",
        points: [
          "Over 130° of orbital rotation with precision mechanical locks",
          "Large clearance depth accommodating wide orthopedic operating tables",
          "Smooth vertical motorized travel with tactile console buttons",
          "Protective cable guards on all wheels preventing snagging on OR cables",
        ],
      },
      {
        number: "03",
        title: "Dual-Monitor Viewing Station",
        description:
          "Real-time and reference frames displayed side-by-side for immediate comparison during complex implant positioning.",
        points: [
          "Dual high-luminance anti-glare medical monitors",
          "Last Image Hold (LIH) preserving the surgical frame without active radiation",
          "Internal storage for thousands of patient frames with USB and DICOM export",
          "Intuitive icon-based user interface accessible to all OR team members",
        ],
      },
      {
        number: "04",
        title: "SPM Authorized Support in Egypt",
        description:
          "SPM guarantees clinical continuity with preventative maintenance, swift engineer response, and genuine factory replacement parts.",
        points: [
          "Exclusive authorized distributor of Italray medical systems in Egypt",
          "Factory-trained biomedical technicians based in Cairo and regional centers",
          "Turnkey delivery, testing, and comprehensive clinical staff orientation",
          "Flexible service contracts tailored for private clinics and major hospitals",
        ],
      },
    ],
    clinicalGallery: [
      {
        title: "Orthopedic Pinning & Plate Fixation",
        category: "Orthopedics",
        image: "https://cdn.shopify.com/s/files/1/1002/9672/0673/files/MsiwLyhyWlEjDsPK.jpg?v=1790773853",
        description: "Live guidance during screw placement and limb alignment.",
      },
      {
        title: "Endoscopic & Biliary Guidance",
        category: "General Surgery",
        image: "https://cdn.shopify.com/s/files/1/1002/9672/0673/files/ZQUPAJOOFlsXsxEP.jpg?v=1790775799",
        description: "Real-time tracking of contrast agents and surgical instruments.",
      },
    ],
    upgrades: {
      hardware: [
        {
          title: "Laser Centering Device",
          tag: "Guidance",
          description: "Dual crosshair lasers for quick alignment without test exposures.",
        },
      ],
      software: [
        {
          title: "DICOM 3.0 Full Suite",
          tag: "Connectivity",
          description: "Full PACS storage, worklist, and print connectivity.",
        },
      ],
      packages: [
        {
          title: "Surgical Center Package",
          tag: "Complete Package",
          description: "Includes C-arm, viewing station, protective lead aprons, and SPM 2-year warranty.",
        },
      ],
    },
    specifications: [
      {
        category: "Generator & Tube",
        specs: [
          { label: "Generator Output", value: "3.5 kW / 5 kW High-Frequency" },
          { label: "kV Range", value: "40 kV to 110 kV" },
          { label: "Fluoro Current", value: "0.2 mA to 8 mA continuous / pulsed" },
          { label: "Focal Spot", value: "0.5 mm / 1.5 mm" },
        ],
      },
      {
        category: "Mechanical Dimensions",
        specs: [
          { label: "Free Space Inside Arc", value: "78 cm" },
          { label: "Orbital Travel", value: "130° (-40° to +90°)" },
          { label: "Motorized Vertical Travel", value: "42 cm height adjustment" },
        ],
      },
    ],
  },
};

export function getItalrayProductMeta(handle: string): ItalrayProductMeta {
  if (ITALRAY_CATALOG_REGISTRY[handle]) {
    return ITALRAY_CATALOG_REGISTRY[handle];
  }
  // Fallback to CARMEX if handle not found
  return {
    ...ITALRAY_CATALOG_REGISTRY["italray-carmex-fp21-fp30"],
    handle,
    title: handle.replace(/-/g, " ").replace(/\b\w/g, l => l.toUpperCase()),
  };
}
