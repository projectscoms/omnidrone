import { useEffect, useRef } from 'react'
import mapboxgl from 'mapbox-gl'

export default function MapboxMap({ lat = 37.7749, lng = -122.4194, heading = 0 }) {
  const mapContainer = useRef(null)
  const mapRef = useRef(null)
  const markerRef = useRef(null)

  useEffect(() => {
    const token = process.env.NEXT_PUBLIC_MAPBOX_TOKEN || ''
    mapboxgl.accessToken = token
    const map = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/dark-v11',
      center: [lng, lat],
      zoom: 13
    })
    map.addControl(new mapboxgl.NavigationControl({ showCompass: false }), 'top-right')

    const el = document.createElement('div')
    el.className = 'drone-marker'
    el.innerHTML = '⦿'
    const marker = new mapboxgl.Marker(el).setLngLat([lng, lat]).addTo(map)

    mapRef.current = map
    markerRef.current = marker

    return () => map.remove()
  }, [])

  useEffect(() => {
    if (!mapRef.current) return
    mapRef.current.easeTo({ center: [lng, lat], duration: 800 })
    if (markerRef.current) markerRef.current.setLngLat([lng, lat])
  }, [lat, lng])

  return <div ref={mapContainer} className="map-container" />
}
