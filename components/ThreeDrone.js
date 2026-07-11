import { useEffect, useRef } from 'react'
import * as THREE from 'three'

export default function ThreeDrone({ status, battery }) {
  const mountRef = useRef()

  useEffect(() => {
    const el = mountRef.current
    const width = el.clientWidth
    const height = 360

    const scene = new THREE.Scene()
    scene.background = new THREE.Color(0x04060a)

    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000)
    camera.position.set(0, 2, 6)

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
    renderer.setSize(width, height)
    el.appendChild(renderer.domElement)

    // lights
    const hemi = new THREE.HemisphereLight(0xffffff, 0x222244, 0.8)
    scene.add(hemi)
    const dir = new THREE.DirectionalLight(0xffffff, 0.8)
    dir.position.set(5, 10, 7)
    scene.add(dir)

    // drone body
    const bodyGeo = new THREE.BoxGeometry(1.4, 0.25, 1)
    const bodyMat = new THREE.MeshStandardMaterial({ color: 0x1f2833, metalness: 0.8, roughness: 0.2 })
    const body = new THREE.Mesh(bodyGeo, bodyMat)
    scene.add(body)

    // propellers (4)
    const propMat = new THREE.MeshStandardMaterial({ color: 0x000000, metalness: 0.6, roughness: 0.4 })
    const armLen = 1.1
    const props = []
    for (let i = 0; i < 4; i++) {
      const arm = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.05, armLen), bodyMat)
      const angle = (i / 4) * Math.PI * 2
      arm.position.set(Math.cos(angle) * 0.8, 0, Math.sin(angle) * 0.6)
      arm.rotation.z = Math.PI / 2
      scene.add(arm)

      const prop = new THREE.Mesh(new THREE.BoxGeometry(0.7, 0.02, 0.12), propMat)
      prop.position.set(Math.cos(angle) * 1.2, 0.18, Math.sin(angle) * 0.9)
      scene.add(prop)
      props.push(prop)
    }

    // status indicator (glow)
    const glowMat = new THREE.MeshBasicMaterial({ color: 0xffd54a, transparent: true, opacity: 0.12 })
    const glow = new THREE.Mesh(new THREE.SphereGeometry(1.6, 32, 32), glowMat)
    glow.position.set(0, 0.1, 0)
    scene.add(glow)

    // subtle particle network (points)
    const particles = new THREE.BufferGeometry()
    const cnt = 120
    const positions = new Float32Array(cnt * 3)
    for (let i = 0; i < cnt; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 10
      positions[i * 3 + 1] = (Math.random() - 0.5) * 3
      positions[i * 3 + 2] = (Math.random() - 0.5) * 10
    }
    particles.setAttribute('position', new THREE.BufferAttribute(positions, 3))
    const pMat = new THREE.PointsMaterial({ color: 0x2bd1ff, size: 0.03, opacity: 0.12, transparent: true })
    const points = new THREE.Points(particles, pMat)
    scene.add(points)

    let mounted = true
    const clock = new THREE.Clock()

    function animate() {
      if (!mounted) return
      requestAnimationFrame(animate)
      const t = clock.getElapsedTime()

      body.rotation.y = 0.2 * Math.sin(t / 4)
      glow.rotation.y = t * 0.02
      points.rotation.y = t * 0.02
      // spin props
      props.forEach((p, i) => (p.rotation.y = t * (8 + i)))
      // pulse glow with battery & status
      const pulse = (1 + Math.sin(t * 4)) * 0.5 * (battery / 100)
      glow.material.opacity = status === 'ALERT' ? 0.35 + pulse * 0.5 : 0.1 + pulse * 0.15

      renderer.render(scene, camera)
    }
    animate()

    const handleResize = () => {
      const w = el.clientWidth
      renderer.setSize(w, height)
      camera.aspect = w / height
      camera.updateProjectionMatrix()
    }
    window.addEventListener('resize', handleResize)

    return () => {
      mounted = false
      window.removeEventListener('resize', handleResize)
      el.removeChild(renderer.domElement)
      scene.clear()
      renderer.dispose()
    }
  }, [status, battery])

  return <div ref={mountRef} className="three-root" />
}
