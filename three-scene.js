// three-scene.js
// Gen-Z Professional: Electric Blue Particle Flow Background

const init3D = () => {
    const container = document.getElementById('canvas-container');
    if (!container || typeof THREE === 'undefined') return;

    // Detect low-end device by pixel ratio and screen size
    const isMobile = window.innerWidth <= 768;
    const dpr = window.devicePixelRatio || 1;
    // Cap pixel ratio to 1 for better performance on low end devices
    const pixelRatio = isMobile ? 1 : Math.min(dpr, 1.5);

    // Scene setup
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x030305, 0.001);

    // Camera setup
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 50;
    camera.position.y = 10;
    camera.rotation.x = -0.2;

    // Renderer setup
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: !isMobile });
    renderer.setPixelRatio(pixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);
    container.appendChild(renderer.domElement);

    // Geometry & Material: Particle Grid
    const particleCount = isMobile ? 2000 : 8000;
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const phases = new Float32Array(particleCount);

    // Create a vast grid of particles
    let idx = 0;
    for (let i = 0; i < particleCount; i++) {
        // Distribute particles in a wide flat plane
        positions[idx] = (Math.random() - 0.5) * 200; // x
        positions[idx + 1] = (Math.random() - 0.5) * 10 - 20; // y (bottom focused)
        positions[idx + 2] = (Math.random() - 0.5) * 200; // z
        
        phases[i] = Math.random() * Math.PI * 2; // Random starting phase for animation

        idx += 3;
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('phase', new THREE.BufferAttribute(phases, 1));

    // Helper function to create a circular texture
    function createCircleTexture() {
        const canvas = document.createElement('canvas');
        canvas.width = 64;
        canvas.height = 64;
        const ctx = canvas.getContext('2d');
        ctx.beginPath();
        ctx.arc(32, 32, 30, 0, Math.PI * 2);
        ctx.fillStyle = '#ffffff';
        ctx.fill();
        return new THREE.CanvasTexture(canvas);
    }

    // Particle material - Electric Cyan
    const material = new THREE.PointsMaterial({
        color: 0x00f0ff,
        size: isMobile ? 1.0 : 0.6,
        map: createCircleTexture(),
        transparent: true,
        alphaTest: 0.1,
        opacity: 0.8,
        blending: THREE.AdditiveBlending
    });

    const particles = new THREE.Points(geometry, material);
    scene.add(particles);

    // Interaction Variables
    let mouseX = 0;
    let mouseY = 0;
    let targetX = 0;
    let targetY = 0;
    const windowHalfX = window.innerWidth / 2;
    const windowHalfY = window.innerHeight / 2;

    // Event Listeners
    if (!isMobile) {
        document.addEventListener('mousemove', onDocumentMouseMove, false);
    }

    function onDocumentMouseMove(event) {
        mouseX = (event.clientX - windowHalfX);
        mouseY = (event.clientY - windowHalfY);
    }

    window.addEventListener('resize', onWindowResize, false);

    function onWindowResize() {
        const width = window.innerWidth;
        const height = window.innerHeight;
        
        camera.aspect = width / height;
        camera.updateProjectionMatrix();
        
        renderer.setSize(width, height);
    }

    // Animation Loop
    let clock = new THREE.Clock();
    let time = 0;

    function animate() {
        requestAnimationFrame(animate);

        const delta = clock.getDelta();
        time += delta * 0.5;

        // Wave animation logic
        const positions = particles.geometry.attributes.position.array;
        const phases = particles.geometry.attributes.phase.array;

        let j = 0;
        for (let i = 0; i < particleCount; i++) {
            // Animate Y position based on sine wave of X/Z coordinates
            const x = positions[j];
            const z = positions[j + 2];
            
            // Create a flowing wave effect
            positions[j + 1] = Math.sin((x * 0.05) + time) * 3 + 
                               Math.cos((z * 0.05) + time) * 3 - 20;

            j += 3;
        }
        particles.geometry.attributes.position.needsUpdate = true;

        // Smooth camera movement based on mouse (Parallax)
        if (!isMobile) {
            targetX = mouseX * 0.05;
            targetY = mouseY * 0.05;
            
            camera.position.x += (targetX - camera.position.x) * 0.02;
            camera.position.y += (-targetY + 10 - camera.position.y) * 0.02;
            camera.lookAt(scene.position);
        } else {
            // Slow auto-rotation on mobile
            camera.position.x = Math.sin(time * 0.5) * 10;
            camera.position.z = Math.cos(time * 0.5) * 10 + 40;
            camera.lookAt(scene.position);
        }

        renderer.render(scene, camera);
    }

    animate();
};

// Initialize when DOM is ready
document.addEventListener("DOMContentLoaded", init3D);
