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
     * @param {string} iconHtml - HTML của icon (mặc định: '<i class="fa fa-map-marker-alt"></i>')
     * @returns {Object} marker - Đối tượng marker đã tạo
     */
    viTriHienTai(lat, lng, title, content = "", options = {}, iconHtml = '<i class="fa fa-map-marker-alt"></i>') {
        // Tạo custom icon sử dụng icon HTML được truyền vào
        const customIcon = L.divIcon({
            html: iconHtml,  // Sử dụng icon HTML được truyền vào
            className: 'custom-marker-icon',
            iconSize: [30, 30],
            iconAnchor: [15, 30],
            popupAnchor: [0, -30]
        });

        // Merge custom icon với markerOptions
        const markerOptions = {
            ...options.marker,
            icon: customIcon
        };

        const popupOptions = {
            ...options.popup,
            className: 'custom-popup'
        };

        // Phần còn lại giữ nguyên
        const popupContent = `
            <div class="popup-content">
                <h3 class="popup-title">${title}</h3>
                <div class="popup-body">${content}</div>
            </div>
        `;

        const marker = L.marker([lat, lng], markerOptions)
            .addTo(this.map)
            .bindPopup(popupContent, popupOptions)
            .openPopup();

        this.markers.push(marker);
        this.map.setView([lat, lng], this.map.getZoom());
        return marker;
    }
}

// Đảm bảo export default
export default DTUAppsmithMap; 