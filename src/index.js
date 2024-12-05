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

    /**
     * Hiển thị địa điểm với marker và popup
     * @param {number} lat - Vĩ độ
     * @param {number} lng - Kinh độ 
     * @param {string} title - Tiêu đề popup
     * @param {string} content - Nội dung popup
     * @param {Object} options - Tùy chọn cho marker và popup
     * @returns {Object} marker - Đối tượng marker đã tạo
     */
    viTriHienTai(lat, lng, title, content = null, options = {}) {
        const markerOptions = options.marker || {};
        const popupOptions = options.popup || {};

        // Tạo nội dung HTML cho popup
        const popupContent = `
            <div class="custom-popup">
                <h3>${title}</h3>
                <div>${content}</div>
            </div>
        `;

        // Tạo marker và thêm vào map
        const marker = L.marker([lat, lng], markerOptions)
            .addTo(this.map)
            .bindPopup(popupContent, popupOptions)
            .openPopup();

        // Thêm vào mảng markers để quản lý
        this.markers.push(marker);

        // Di chuyển map đến vị trí marker
        this.map.setView([lat, lng], this.map.getZoom());
        return marker;
    }
}

// Đảm bảo export default
export default DTUAppsmithMap; 