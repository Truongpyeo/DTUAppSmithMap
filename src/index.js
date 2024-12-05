import L from 'leaflet';

class DTUAppsmithMap {
    constructor(containerId, options = {}) {
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

    // Lấy vị trí hiện tại
    getCurrentLocation() {
        return new Promise((resolve, reject) => {
            if (!navigator.geolocation) {
                reject(new Error('Geolocation is not supported by your browser'));
                return;
            }

            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const lat = position.coords.latitude;
                    const lng = position.coords.longitude;
                    
                    // Di chuyển map đến vị trí hiện tại
                    this.map.setView([lat, lng], 15);
                    
                    // Thêm marker tại vị trí hiện tại
                    const marker = this.addMarker(lat, lng, {
                        title: 'Vị trí của bạn'
                    });
                    
                    // Mở popup
                    marker.bindPopup('Bạn đang ở đây!').openPopup();
                    
                    resolve({lat, lng});
                },
                (error) => {
                    reject(error);
                }
            );
        });
    }
}

// Đảm bảo export default
export default DTUAppsmithMap; 