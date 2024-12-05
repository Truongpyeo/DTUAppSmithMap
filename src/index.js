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

    // Static method để lấy vị trí mà không cần khởi tạo map
    static getLocation() {
        return new Promise((resolve, reject) => {
            if (!navigator.geolocation) {
                reject(new Error('Trình duyệt không hỗ trợ Geolocation'));
                return;
            }

            navigator.geolocation.getCurrentPosition(
                (position) => {
                    resolve({
                        lat: position.coords.latitude,
                        lng: position.coords.longitude,
                        accuracy: position.coords.accuracy,
                        timestamp: position.timestamp
                    });
                },
                (error) => {
                    let errorMessage = 'Lỗi không xác định';
                    switch(error.code) {
                        case error.PERMISSION_DENIED:
                            errorMessage = 'Người dùng từ chối cấp quyền vị trí';
                            break;
                        case error.POSITION_UNAVAILABLE:
                            errorMessage = 'Không thể lấy được vị trí';
                            break;
                        case error.TIMEOUT:
                            errorMessage = 'Hết thời gian chờ lấy vị trí';
                            break;
                    }
                    reject(new Error(errorMessage));
                },
                {
                    enableHighAccuracy: true,
                    timeout: 5000,
                    maximumAge: 0
                }
            );
        });
    }
}

// Đảm bảo export default
export default DTUAppsmithMap; 