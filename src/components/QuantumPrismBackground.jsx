import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/addons/postprocessing/UnrealBloomPass.js';
import { Reflector } from 'three/addons/objects/Reflector.js';

const QuantumPrismBackground = () => {
  const mountRef = useRef(null);

  useEffect(() => {
    let animationFrameId;

    /* ───────────── Scene, Camera, Renderer ───────────── */
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x030306);
    scene.fog = new THREE.FogExp2(0x030306, 0.055);

    const camera = new THREE.PerspectiveCamera(42, window.innerWidth / window.innerHeight, 0.1, 100);
    camera.position.set(3.6, 2.9, 4.8);

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.05;
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    // For r160, use SRGBColorSpace instead of sRGBEncoding
    // renderer.outputColorSpace = THREE.SRGBColorSpace;
    mountRef.current.appendChild(renderer.domElement);

    /* ───────────── Controls ───────────── */
    const reducedMotion = window.matchMedia('(prefers-reduced-motion:reduce)').matches;
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.04;
    controls.target.set(0, 1.1, 0);
    controls.minDistance = 2.5;
    controls.maxDistance = 12;
    controls.maxPolarAngle = Math.PI * 0.82;
    controls.autoRotate = !reducedMotion;
    controls.autoRotateSpeed = 0.22;
    controls.enableZoom = false; // Disable zoom to prevent scroll issues on landing page
    controls.update();

    /* ───────────── Post-processing ───────────── */
    const composer = new EffectComposer(renderer);
    composer.addPass(new RenderPass(scene, camera));
    const bloom = new UnrealBloomPass(
        new THREE.Vector2(window.innerWidth, window.innerHeight), 1.35, 0.55, 0.62
    );
    composer.addPass(bloom);

    /* ───────────── Reflective Floor ───────────── */
    const floorGeo = new THREE.PlaneGeometry(40, 40);
    const floor = new Reflector(floorGeo, {
        clipBias: 0.003,
        textureWidth: Math.floor(window.innerWidth * window.devicePixelRatio * 0.5),
        textureHeight: Math.floor(window.innerHeight * window.devicePixelRatio * 0.5),
        color: 0x0a0a12
    });
    floor.rotation.x = -Math.PI / 2;
    scene.add(floor);

    // Tinted concrete overlay
    const floorTint = new THREE.Mesh(
        new THREE.PlaneGeometry(40, 40),
        new THREE.MeshStandardMaterial({
            color: 0x080810, roughness: 0.12, metalness: 0.85,
            transparent: true, opacity: 0.5
        })
    );
    floorTint.rotation.x = -Math.PI / 2;
    floorTint.position.y = 0.002;
    scene.add(floorTint);

    /* ───────────── Hexagonal Base ───────────── */
    const HR = 0.85, HH = 0.35;
    const hexBase = new THREE.Mesh(
        new THREE.CylinderGeometry(HR, HR * 1.06, HH, 6),
        new THREE.MeshStandardMaterial({ color: 0x080808, roughness: 0.92, metalness: 0.08 })
    );
    hexBase.position.y = HH / 2;
    hexBase.castShadow = true;
    hexBase.receiveShadow = true;
    scene.add(hexBase);

    // Glowing hex ring
    const hexRing = new THREE.Mesh(
        new THREE.RingGeometry(HR * 0.52, HR * 0.58, 6),
        new THREE.MeshBasicMaterial({ color: 0x00ddff, transparent: true, opacity: 0.3, side: THREE.DoubleSide })
    );
    hexRing.rotation.x = -Math.PI / 2;
    hexRing.position.y = HH + 0.002;
    scene.add(hexRing);

    // Subtle top face glow disc
    const topGlow = new THREE.Mesh(
        new THREE.CircleGeometry(HR * 0.48, 6),
        new THREE.MeshBasicMaterial({ color: 0x00bbff, transparent: true, opacity: 0.06, side: THREE.DoubleSide })
    );
    topGlow.rotation.x = -Math.PI / 2;
    topGlow.position.y = HH + 0.001;
    scene.add(topGlow);

    /* ───────────── Acrylic Frame ───────────── */
    const FW = 0.95, FH = 1.05, FD = 0.95;
    const frameBaseY = HH + 0.14;
    const frameGroup = new THREE.Group();
    frameGroup.position.y = frameBaseY;
    scene.add(frameGroup);

    // Transparent acrylic enclosure
    frameGroup.add((() => {
        const m = new THREE.Mesh(
            new THREE.BoxGeometry(FW, FH, FD),
            new THREE.MeshPhysicalMaterial({
                color: 0xffffff, transparent: true, opacity: 0.05,
                roughness: 0.02, metalness: 0.0,
                transmission: 0.96, thickness: 0.3, ior: 1.45,
                clearcoat: 1.0, clearcoatRoughness: 0.05,
                side: THREE.DoubleSide, depthWrite: false
            })
        );
        m.position.y = FH / 2;
        return m;
    })());

    // Helper: neon tube along an edge
    function tube(a, b, color, r = 0.013) {
        const dir = new THREE.Vector3().subVectors(b, a);
        const len = Math.max(0.001, dir.length());
        const mesh = new THREE.Mesh(
            new THREE.CylinderGeometry(r, r, len, 8, 1),
            new THREE.MeshBasicMaterial({ color })
        );
        mesh.position.copy(a).add(b).multiplyScalar(0.5);
        const up = new THREE.Vector3(0, 1, 0);
        const d = dir.clone().normalize();
        Math.abs(d.dot(up)) < 0.9999
            ? mesh.quaternion.setFromUnitVectors(up, d)
            : d.y < 0 ? mesh.rotation.z = Math.PI : 0;
        return mesh;
    }

    const hw = FW / 2, hd = FD / 2;
    const CYN = 0x00e5ff, VIO = 0x9933ff, MIX = 0x5577ff;
    const btm = [
        [[-hw,0,-hd],[hw,0,-hd]], [[hw,0,-hd],[hw,0,hd]],
        [[hw,0,hd],[-hw,0,hd]], [[-hw,0,hd],[-hw,0,-hd]]
    ];
    const top = [
        [[-hw,FH,-hd],[hw,FH,-hd]], [[hw,FH,-hd],[hw,FH,hd]],
        [[hw,FH,hd],[-hw,FH,hd]], [[-hw,FH,hd],[-hw,FH,-hd]]
    ];
    const vert = [
        [[-hw,0,-hd],[-hw,FH,-hd]], [[hw,0,-hd],[hw,FH,-hd]],
        [[hw,0,hd],[hw,FH,hd]], [[-hw,0,hd],[-hw,FH,hd]]
    ];
    btm.forEach(e => frameGroup.add(tube(new THREE.Vector3(...e[0]), new THREE.Vector3(...e[1]), CYN)));
    top.forEach(e => frameGroup.add(tube(new THREE.Vector3(...e[0]), new THREE.Vector3(...e[1]), VIO)));
    vert.forEach(e => frameGroup.add(tube(new THREE.Vector3(...e[0]), new THREE.Vector3(...e[1]), MIX)));

    /* ───────────── Holographic Cube ───────────── */
    const CS = 0.33;
    const holoMat = new THREE.ShaderMaterial({
        uniforms: { uTime: { value: 0 } },
        vertexShader: `
            varying vec3 vN, vP, vW;
            void main(){
                vN = normalize(normalMatrix * normal);
                vP = position;
                vW = (modelMatrix * vec4(position,1.0)).xyz;
                gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0);
            }`,
        fragmentShader: `
            uniform float uTime;
            varying vec3 vN, vP, vW;
            void main(){
                vec3 V = normalize(cameraPosition - vW);
                float fres = pow(1.0 - abs(dot(V, vN)), 3.0);
                // Scan lines
                float s1 = sin(vP.y * 35.0 - uTime * 3.0) * .5 + .5;
                float s2 = sin(vP.y * 90.0 + uTime * 1.8) * .5 + .5;
                float scan = smoothstep(.3,.7,s1)*.22 + smoothstep(.4,.6,s2)*.08;
                // Prismatic rainbow
                float hue = fract(fres * .7 + uTime * .12 + vP.y * .45);
                vec3 prism = .5 + .5 * cos(6.28318*(hue + vec3(0.,.33,.67)));
                // Base cyan-violet blend
                float bl = sin(uTime*.4 + vP.y*2.5)*.5+.5;
                vec3 base = mix(vec3(0.,.9,1.), vec3(.6,.2,1.), bl);
                vec3 col = mix(base, prism, .45);
                col += scan * vec3(.2,.7,1.);
                col += fres * base * 3.8;
                float a = .12 + fres * .72 + scan * .15;
                gl_FragColor = vec4(col, a);
            }`,
        transparent: true, side: THREE.DoubleSide,
        depthWrite: false, blending: THREE.AdditiveBlending
    });
    const holoCube = new THREE.Mesh(new THREE.BoxGeometry(CS, CS, CS, 2, 2, 2), holoMat);
    holoCube.position.y = FH / 2;
    frameGroup.add(holoCube);

    // Inner wireframe structure
    const wireInner = new THREE.Mesh(
        new THREE.BoxGeometry(CS * .72, CS * .72, CS * .72),
        new THREE.MeshBasicMaterial({ color: 0x00ccff, wireframe: true, transparent: true, opacity: .18 })
    );
    holoCube.add(wireInner);

    // Second inner wireframe rotated
    const wireInner2 = new THREE.Mesh(
        new THREE.BoxGeometry(CS * .5, CS * .5, CS * .5),
        new THREE.MeshBasicMaterial({ color: 0xaa44ff, wireframe: true, transparent: true, opacity: .12 })
    );
    holoCube.add(wireInner2);

    /* ───────────── Levitation Light Beam ───────────── */
    const beam = new THREE.Mesh(
        new THREE.CylinderGeometry(0.008, 0.14, FH + 0.25, 16, 1, true),
        new THREE.MeshBasicMaterial({
            color: 0x00ccff, transparent: true, opacity: 0.03,
            side: THREE.DoubleSide, depthWrite: false, blending: THREE.AdditiveBlending
        })
    );
    beam.position.y = HH + (FH + 0.25) / 2;
    scene.add(beam);

    /* ───────────── Prismatic Caustic ───────────── */
    const causticMat = new THREE.ShaderMaterial({
        uniforms: { uTime: { value: 0 } },
        vertexShader: `varying vec2 vUv; void main(){ vUv=uv; gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.); }`,
        fragmentShader: `
            uniform float uTime; varying vec2 vUv;
            void main(){
                vec2 uv = vUv - .5;
                float d = length(uv);
                float r1 = sin(d*18.-uTime*1.6)*.5+.5;
                float r2 = sin(d*30.+uTime*2.2)*.5+.5;
                float ring = (r1*.7+r2*.3)*smoothstep(.5,.12,d);
                float a = atan(uv.y,uv.x);
                vec3 c1=vec3(0.,.9,1.), c2=vec3(.6,.15,1.), c3=vec3(1.,.12,.4);
                vec3 col = mix(c1,c2,sin(a*3.+uTime)*.5+.5);
                col = mix(col,c3,sin(a*5.-uTime*1.3)*.5+.5);
                float alpha = ring * .22 * smoothstep(.5,.03,d);
                gl_FragColor = vec4(col*1.6, alpha);
            }`,
        transparent: true, depthWrite: false, blending: THREE.AdditiveBlending, side: THREE.DoubleSide
    });
    const caustic = new THREE.Mesh(new THREE.PlaneGeometry(2.8, 2.8), causticMat);
    caustic.rotation.x = -Math.PI / 2;
    caustic.position.y = 0.004;
    scene.add(caustic);

    /* ───────────── Museum Walls ───────────── */
    const wallMat = new THREE.MeshStandardMaterial({ color: 0x070709, roughness: 0.95, metalness: 0.05 });
    [[24,9,.3,0,4.5,-10],[.3,9,24,-12,4.5,0],[.3,9,24,12,4.5,0]].forEach(([w,h,d,x,y,z])=>{
        const m = new THREE.Mesh(new THREE.BoxGeometry(w,h,d), wallMat);
        m.position.set(x,y,z); m.receiveShadow = true; scene.add(m);
    });

    // Distant pedestals with accent lights
    [[-3.2,-5.5,0x4400ff],[3.8,-6.5,0x0066ff],[-5.0,-3.5,0x8800cc],[5.5,-4.0,0x0044aa]].forEach(([x,z,c])=>{
        const p = new THREE.Mesh(
            new THREE.BoxGeometry(.45,1.0,.45),
            new THREE.MeshStandardMaterial({ color: 0x0a0a0c, roughness: .88, metalness: .1 })
        );
        p.position.set(x,.5,z); p.castShadow=true; scene.add(p);
        const l = new THREE.PointLight(c, .35, 3.5);
        l.position.set(x,1.35,z); scene.add(l);
    });

    /* ───────────── Floating Particles ───────────── */
    const PC = 280;
    const pPos = new Float32Array(PC*3), pSz = new Float32Array(PC), pCol = new Float32Array(PC*3);
    for(let i=0;i<PC;i++){
        const near = Math.random()<.6, ang = Math.random()*Math.PI*2;
        const rad = near ? Math.random()*2+.4 : Math.random()*8+2;
        pPos[i*3]=Math.cos(ang)*rad; pPos[i*3+1]=Math.random()*5+.3; pPos[i*3+2]=Math.sin(ang)*rad;
        pSz[i]=Math.random()*2.5+.5;
        const t=Math.random();
        pCol[i*3]=t*.6; pCol[i*3+1]=(1-t)*.9; pCol[i*3+2]=1;
    }
    const pGeo = new THREE.BufferGeometry();
    pGeo.setAttribute('position', new THREE.BufferAttribute(pPos,3));
    pGeo.setAttribute('aSize', new THREE.BufferAttribute(pSz,1));
    pGeo.setAttribute('aColor', new THREE.BufferAttribute(pCol,3));

    const pMat = new THREE.ShaderMaterial({
        uniforms: { uTime:{value:0}, uPR:{value:Math.min(window.devicePixelRatio,2)} },
        vertexShader:`
            attribute float aSize; attribute vec3 aColor;
            varying vec3 vC; uniform float uTime,uPR;
            void main(){
                vC=aColor;
                vec3 p=position;
                p.y+=sin(uTime*.4+position.x*1.8)*.08;
                p.x+=cos(uTime*.25+position.z*1.3)*.04;
                vec4 mv=modelViewMatrix*vec4(p,1.);
                gl_PointSize=aSize*uPR*(80./-mv.z);
                gl_Position=projectionMatrix*mv;
            }`,
        fragmentShader:`
            varying vec3 vC;
            void main(){
                float d=length(gl_PointCoord-.5);
                if(d>.5)discard;
                gl_FragColor=vec4(vC, smoothstep(.5,.04,d)*.32);
            }`,
        transparent:true, depthWrite:false, blending:THREE.AdditiveBlending
    });
    scene.add(new THREE.Points(pGeo, pMat));

    /* ───────────── Lighting ───────────── */
    scene.add(new THREE.AmbientLight(0x0a0a1a, 0.35));

    const spot = new THREE.SpotLight(0xddddef, 3);
    spot.position.set(0, 7, 2);
    spot.angle = Math.PI / 7;
    spot.penumbra = 0.85;
    spot.decay = 2;
    spot.distance = 15;
    spot.castShadow = true;
    spot.shadow.mapSize.set(1024, 1024);
    spot.target.position.set(0, .5, 0);
    scene.add(spot); scene.add(spot.target);

    const cyanPL = new THREE.PointLight(0x00e5ff, 2.5, 4.5);
    cyanPL.position.set(0, frameBaseY + FH * .3, 0);
    scene.add(cyanPL);

    const vioPL = new THREE.PointLight(0x9933ff, 2.0, 4.5);
    vioPL.position.set(0, frameBaseY + FH * .7, 0);
    scene.add(vioPL);

    scene.add(new THREE.PointLight(0x3300cc, .8, 10).translateX(-3).translateY(3).translateZ(-4));

    /* ───────────── Render Loop ───────────── */
    const clock = new THREE.Clock();

    const animate = () => {
        animationFrameId = requestAnimationFrame(animate);
        const t = clock.getElapsedTime();

        // Levitate frame
        frameGroup.position.y = frameBaseY + Math.sin(t * 1.2) * 0.025;

        // Rotate holographic cube
        holoCube.rotation.y = t * 0.45;
        holoCube.rotation.x = Math.sin(t * 0.28) * 0.18;
        holoCube.rotation.z = Math.cos(t * 0.35) * 0.1;

        // Counter-rotate inner wireframes
        wireInner.rotation.y = -t * 0.7;
        wireInner.rotation.x = t * 0.3;
        wireInner2.rotation.y = t * 1.1;
        wireInner2.rotation.z = -t * 0.5;

        // Shader time
        holoMat.uniforms.uTime.value = t;
        causticMat.uniforms.uTime.value = t;
        pMat.uniforms.uTime.value = t;

        // Pulse accents
        hexRing.material.opacity = .22 + Math.sin(t * 2) * .1;
        topGlow.material.opacity = .04 + Math.sin(t * 1.8) * .02;
        cyanPL.intensity = 2.5 + Math.sin(t * 1.8) * .6;
        vioPL.intensity = 2.0 + Math.cos(t * 2.2) * .5;
        beam.material.opacity = .025 + Math.sin(t * 1.5) * .012;

        controls.update();
        composer.render();
    };
    
    animate();

    /* ───────────── Resize (Debounced) ───────────── */
    let resizeTimeout;
    const handleResize = () => {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(() => {
            if (!camera || !renderer || !composer) return;
            camera.aspect = window.innerWidth / window.innerHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(window.innerWidth, window.innerHeight);
            composer.setSize(window.innerWidth, window.innerHeight);
            
            // Re-adjust floor texture size to standard ratio to prevent GPU crash
            if (floor && floor.getRenderTarget) {
              const target = floor.getRenderTarget();
              if (target) {
                 target.setSize(
                    Math.floor(window.innerWidth * window.devicePixelRatio * 0.5),
                    Math.floor(window.innerHeight * window.devicePixelRatio * 0.5)
                 );
              }
            }
        }, 150);
    };
    window.addEventListener('resize', handleResize);

    /* ───────────── Cleanup ───────────── */
    return () => {
        window.removeEventListener('resize', handleResize);
        cancelAnimationFrame(animationFrameId);
        
        // Discard WebGL resources
        renderer.dispose();
        composer.dispose();
        controls.dispose();
        
        if (mountRef.current && renderer.domElement) {
            mountRef.current.removeChild(renderer.domElement);
        }
    };
  }, []);

  return (
    <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', zIndex: -1, background: '#000' }}>
      <div ref={mountRef} style={{ width: '100%', height: '100%' }} />
      {/* Visual Overlays from the provided code */}
      <div style={{
          position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 5,
          background: 'radial-gradient(ellipse at center, transparent 35%, rgba(0,0,0,0.75) 100%)'
      }} />
      <div style={{
          position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 6, opacity: 0.04, mixBlendMode: 'overlay',
          backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=%270 0 256 256%27 xmlns=%27http://www.w3.org/2000/svg%27%3E%3Cfilter id=%27n%27%3E%3CfeTurbulence type=%27fractalNoise%27 baseFrequency=%270.9%27 numOctaves=%274%27 stitchTiles=%27stitch%27/%3E%3C/filter%3E%3Crect width=%27100%25%27 height=%27100%25%27 filter=%27url(%23n)%27/%3E%3C/svg%3E")'
      }} />
    </div>
  );
};

export default QuantumPrismBackground;
