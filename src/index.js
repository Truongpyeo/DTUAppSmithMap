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

    /**
     * Thêm marker với popup tùy chỉnh
     * @param {number} lat - Vĩ độ
     * @param {number} lng - Kinh độ 
     * @param {string} title - Tiêu đề popup
     * @param {string} content - Nội dung popup
     * @param {string} iconClass - Font Awesome class (mặc định: 'fa-map-marker-alt')
     * @param {string} iconColor - Màu của icon (mặc định: '#003C71')
     * @param {Object} options - Tùy chọn cho marker và popup
     * @returns {Object} marker - Đối tượng marker đã tạo
     */
    taoDiaDiem(lat, lng, title = "", content = "", iconClass = 'fa-map-marker-alt', iconColor = '#003C71', options = {}) {
        const customIcon = L.divIcon({
            html: `
                <span class="fa-stack fa-lg" style="font-size: 20px;">
                    <i class="fa-regular fa-circle fa-stack-2x" style="color: ${iconColor}; opacity: 0.8;"></i>
                    <i class="${iconClass} fa-stack-1x" style="color: ${iconColor};"></i>
                </span>
            `,
            className: 'custom-marker-icon',
            iconSize: [40, 40],
            iconAnchor: [20, 20],
            popupAnchor: [0, -20]
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

        // Tạo nội dung HTML cho popup
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
        return marker;
    }

    // Giữ lại viTriHienTai nhưng sử dụng addMarker
    viTriHienTai(lat, lng, title, content = "", iconClass = 'fa-map-marker-alt', iconColor = '#003C71', options = {}) {
        const marker = this.addMarker(lat, lng, title, content, iconClass, iconColor, options);
        this.map.setView([lat, lng], this.map.getZoom());
        return marker;
    }
}

// Đảm bảo export default
export default DTUAppsmithMap; 