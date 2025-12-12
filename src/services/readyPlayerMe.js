// Ready Player Me integration service

const READY_PLAYER_ME_URL = 'https://demo.readyplayer.me/avatar';

/**
 * Get the Ready Player Me avatar creator URL
 * @param {string} subdomain - Optional subdomain (default: 'demo')
 * @returns {string} Avatar creator URL
 */
export const getAvatarCreatorUrl = (subdomain = 'demo') => {
    return `https://${subdomain}.readyplayer.me/avatar`;
};

/**
 * Extract avatar URL from Ready Player Me callback
 * @param {string} url - Callback URL from Ready Player Me
 * @returns {string|null} Avatar GLB URL
 */
export const extractAvatarUrl = (url) => {
    try {
        // Ready Player Me returns URL in format: https://.../?url=<avatar-url>
        const urlParams = new URLSearchParams(url.split('?')[1]);
        const avatarUrl = urlParams.get('url');
        return avatarUrl;
    } catch (error) {
        console.error('Error extracting avatar URL:', error);
        return null;
    }
};

/**
 * Get avatar viewer URL for rendering in WebView
 * @param {string} avatarUrl - GLB URL of the avatar
 * @returns {string} Viewer URL
 */
export const getAvatarViewerUrl = (avatarUrl) => {
    // Create an HTML page with Three.js for full control
    const html = `
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <style>
        body { 
            margin: 0; 
            padding: 0; 
            overflow: hidden; 
            background: transparent;
        }
        #canvas {
            width: 100%;
            height: 100vh;
            display: block;
        }
    </style>
</head>
<body>
    <canvas id="canvas"></canvas>
    <script type="importmap">
    {
        "imports": {
            "three": "https://cdn.jsdelivr.net/npm/three@0.160.0/build/three.module.js",
            "three/addons/": "https://cdn.jsdelivr.net/npm/three@0.160.0/examples/jsm/"
        }
    }
    </script>
    <script type="module">
        import * as THREE from 'three';
        import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
        import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

        const canvas = document.getElementById('canvas');
        const scene = new THREE.Scene();
        
        // Transparent background
        const renderer = new THREE.WebGLRenderer({ 
            canvas: canvas,
            alpha: true,
            antialias: true 
        });
        renderer.setClearColor(0x000000, 0);
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.setPixelRatio(window.devicePixelRatio);

        const camera = new THREE.PerspectiveCamera(30, window.innerWidth / window.innerHeight, 0.1, 1000);
        camera.position.set(0, 1.5, 2.5);

        const controls = new OrbitControls(camera, renderer.domElement);
        controls.target.set(0, 1, 0);
        controls.enableDamping = true;
        controls.autoRotate = true;
        controls.autoRotateSpeed = 2;
        controls.minDistance = 1;
        controls.maxDistance = 4;

        // Lighting
        const ambientLight = new THREE.AmbientLight(0xffffff, 1.5);
        scene.add(ambientLight);
        
        const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
        directionalLight.position.set(5, 10, 7.5);
        scene.add(directionalLight);

        // Load model
        const loader = new GLTFLoader();
        loader.load('${avatarUrl}', (gltf) => {
            const model = gltf.scene;
            scene.add(model);
            
            // Center and scale model
            const box = new THREE.Box3().setFromObject(model);
            const center = box.getCenter(new THREE.Vector3());
            model.position.sub(center);
            model.position.y = 0;
        });

        function animate() {
            requestAnimationFrame(animate);
            controls.update();
            renderer.render(scene, camera);
        }
        animate();

        window.addEventListener('resize', () => {
            camera.aspect = window.innerWidth / window.innerHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(window.innerWidth, window.innerHeight);
        });
    </script>
</body>
</html>`;

    return `data:text/html;charset=utf-8,${encodeURIComponent(html)}`;
};

/**
 * Validate avatar URL format
 * @param {string} url - Avatar URL to validate
 * @returns {boolean} True if valid
 */
export const isValidAvatarUrl = (url) => {
    if (!url) return false;
    return url.includes('readyplayer.me') && url.endsWith('.glb');
};

/**
 * Get avatar configuration for health-based modifications
 * @param {number} healthScore - Health score (0-100)
 * @returns {object} Avatar configuration
 */
export const getAvatarConfig = (healthScore) => {
    // These would be used with Ready Player Me SDK if available
    // For now, we use overlay effects in the component
    return {
        mood: healthScore >= 61 ? 'happy' : healthScore >= 41 ? 'neutral' : 'sad',
        energy: healthScore >= 61 ? 'high' : healthScore >= 41 ? 'medium' : 'low',
        color: healthScore >= 61 ? 'green' : healthScore >= 41 ? 'yellow' : 'red',
    };
};

export default {
    getAvatarCreatorUrl,
    extractAvatarUrl,
    getAvatarViewerUrl,
    isValidAvatarUrl,
    getAvatarConfig,
};
