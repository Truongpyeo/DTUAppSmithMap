import L from 'leaflet';

class DTUAppsmithMap {
    constructor(containerId, options = {}) {
        this.map = null;
        this.markers = [];
        this.init(containerId, options);
    }

    async init(containerId, options) {
        // Xử lý center mặc định
        if (!options.center || options.center.length === 0) {
            try {
                const position = await this.getCurrentPosition();
                options.center = [position.lat, position.lng];
            } catch (error) {
                console.error('Không thể lấy vị trí hiện tại:', error);
                options.center = [16.0544, 108.2022]; // Vị trí mặc định nếu không lấy được GPS
            }
        }

        // Đảm bảo có zoom mặc định
        if (!options.zoom) {
            options.zoom = 13;
        }

        // Khởi tạo map với options đã xử lý
        this.map = L.map(containerId, options);
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '© OpenStreetMap DTUDZ'
        }).addTo(this.map);
    }

    // Hàm private để lấy vị trí hiện tại
    getCurrentPosition() {
        return new Promise((resolve, reject) => {
            if (!navigator.geolocation) {
                reject(new Error('Trình duyệt không hỗ trợ Geolocation'));
                return;
            }

            navigator.geolocation.getCurrentPosition(
                (position) => {
                    resolve({
                        lat: position.coords.latitude,
                        lng: position.coords.longitude
                    });
                },
                (error) => {
                    reject(error);
                },
                {
                    enableHighAccuracy: true,
                    timeout: 5000,
                    maximumAge: 0
                }
            );
        });
    }

    // Custom methods
    addMarker(lat, lng, options = {}) {
        const marker = L.marker([lat, lng], options);
        marker.addTo(this.map);
        this.markers.push(marker);
        return marker;
    }
}

// Đảm bảo export default
export default DTUAppsmithMap; 