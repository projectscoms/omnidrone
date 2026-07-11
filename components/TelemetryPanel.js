import { jsPDF } from 'jspdf'

export default function TelemetryPanel({ telemetry }) {
  const downloadReport = () => {
    const doc = new jsPDF({ unit: 'pt', format: 'a4' })
    doc.setFontSize(18)
    doc.text('OmniDrone — Incident Report', 40, 60)
    doc.setFontSize(12)
    doc.text(`Timestamp: ${new Date().toLocaleString()}`, 40, 90)
    doc.text(`Status: ${telemetry.status}`, 40, 120)
    doc.text(`Battery: ${telemetry.battery}%`, 40, 140)
    doc.text(`Location: ${telemetry.lat.toFixed(6)}, ${telemetry.lng.toFixed(6)}`, 40, 160)
    doc.text('AI Detections:', 40, 190)
    telemetry.aiDetections.forEach((d, i) => {
      doc.text(`${i + 1}. ${d.label} — confidence ${d.confidence}`, 60, 210 + i * 18)
    })
    doc.save(`omnidrone_report_${Date.now()}.pdf`)
  }

  return (
    <div className="card telemetry">
      <h3>Dashboard — Live</h3>

      <div className="status-row">
        <div className="status-item">
          <div className="label">Status</div>
          <div className={`value ${telemetry.status === 'ALERT' ? 'alert' : ''}`}>{telemetry.status}</div>
        </div>
        <div className="status-item">
          <div className="label">Battery</div>
          <div className="value">{telemetry.battery}%</div>
        </div>
        <div className="status-item">
          <div className="label">Speed</div>
          <div className="value">{telemetry.speed} m/s</div>
        </div>
      </div>

      <div className="detections">
        <h4>AI Detections</h4>
        <ul>
          {telemetry.aiDetections.map(d => (
            <li key={d.id}>
              <span className="tag">{d.label}</span>
              <span className="conf">{Math.round(d.confidence * 100)}%</span>
            </li>
          ))}
        </ul>
      </div>

      <div className="alerts">
        <h4>Alerts</h4>
        {telemetry.alerts.length === 0 ? <div className="muted">No active alerts</div> : telemetry.alerts.map(a => (
          <div key={a.id} className={`alert-item ${a.level}`}>{a.text}</div>
        ))}
      </div>

      <div className="panel-actions">
        <button className="btn cta" onClick={downloadReport}>Generate Report (PDF)</button>
        <button className="btn outline">Acknowledge Alerts</button>
      </div>
    </div>
  )
}
