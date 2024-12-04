import L from 'leaflet';

class DTUAppsmithMap {
  constructor(containerId, options = {}) {
    if (!document.getElementById('leaflet-css')) {
      const link = document.createElement('link');
      link.id = 'leaflet-css';
      link.rel = 'stylesheet';
      link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
      link.integrity = 'sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY=';
      link.crossOrigin = '';
      document.head.appendChild(link);
    }
    
    this.map = null;
    this.markers = [];
    this.init(containerId, options);
  }

  init(containerId, options) {
    // Khởi tạo map
    this.map = L.map(containerId, options);
    
    // Thêm tile layer mặc định
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors'
    }).addTo(this.map);
  }

  // Custom methods
  addMarker(lat, lng, options = {}) {
    const marker = L.marker([lat, lng], options);
    marker.addTo(this.map);
    this.markers.push(marker);
    return marker;
  }

  // Thêm các method custom khác...
}

// Đảm bảo export default
export default DTUAppsmithMap; 