import { useEffect, useState } from 'react'
import ThreeDrone from '../components/ThreeDrone'
import MapboxMap from '../components/MapboxMap'
import LiveCamera from '../components/LiveCamera'
import TelemetryPanel from '../components/TelemetryPanel'

export default function Home() {
  // simulated telemetry
  const [telemetry, setTelemetry] = useState({
    lat: 37.7749,
    lng: -122.4194,
    battery: 92,
    status: 'IDLE',
    speed: 0,
    heading: 0,
    aiDetections: [
      { id: 1, label: 'Person', confidence: 0.81 },
    ],
    alerts: []
  })

  useEffect(() => {
    // simple simulator: update position and battery
    const id = setInterval(() => {
      setTelemetry(t => {
        const heading = (t.heading + Math.random() * 6 - 3) % 360
        const speed = Math.max(0, (t.speed + (Math.random() - 0.5) * 0.2))
        const lat = t.lat + (Math.random() - 0.5) * 0.0006 * (speed + 0.5)
        const lng = t.lng + (Math.random() - 0.5) * 0.0006 * (speed + 0.5)
        const battery = Math.max(5, t.battery - 0.02 - Math.random() * 0.05)
        const status = battery < 10 ? 'RETURNING' : (Math.random() > 0.995 ? 'ALERT' : 'IN-FLIGHT')
        const aiDetections = Math.random() > 0.985 ? [{ id: Date.now(), label: 'Vehicle', confidence: +(0.6 + Math.random() * 0.4).toFixed(2) }] : t.aiDetections
        const alerts = status === 'ALERT' ? [{ id: Date.now(), level: 'high', text: 'Unexpected obstacle detected' }] : []
        return { ...t, lat, lng, heading, speed: +(speed.toFixed(2)), battery: +(battery.toFixed(1)), status, aiDetections, alerts }
      })
    }, 1000)
    return () => clearInterval(id)
  }, [])

  return (
    <div className="app">
      <header className="header">
        <div className="brand">
          <div className="logo">OmniDrone</div>
          <div className="tag">AI Drone Command Center</div>
        </div>
        <nav>
          <button className="btn">Dashboard</button>
          <button className="btn outline">Reports</button>
        </nav>
      </header>

      <main className="main-grid">
        <section className="left-col">
          <div className="hero">
            <h1>OmniDrone — Intelligent Decision Support</h1>
            <p>AI-powered situational awareness & autonomous decision support for multi-drone operations.</p>
            <div className="hero-actions">
              <button className="cta">Go to Dashboard</button>
              <button className="ghost">Watch Demo</button>
            </div>
          </div>

          <div className="card threecard">
            <ThreeDrone status={telemetry.status} battery={telemetry.battery} />
          </div>

          <div className="card">
            <h3>Live Camera</h3>
            <LiveCamera />
          </div>
        </section>

        <section className="right-col">
          <div className="card mapcard">
            <MapboxMap lat={telemetry.lat} lng={telemetry.lng} heading={telemetry.heading} />
          </div>

          <TelemetryPanel telemetry={telemetry} />
        </section>
      </main>

      <footer className="footer">
        <div>© {new Date().getFullYear()} OmniDrone • Designed with futuristic, premium dark theme</div>
      </footer>
    </div>
  )
}
