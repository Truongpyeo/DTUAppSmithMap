import L from 'leaflet';

class DTUAppsmithMap {
    constructor(containerId, options = {}) {
        this.map = null;
        this.markers = [];
        this.polylines = [];
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
        const marker = this.taoDiaDiem(lat, lng, title, content, iconClass, iconColor, options);
        this.map.setView([lat, lng], this.map.getZoom());
        return marker;
    }

    /**
     * Tính khoảng cách giữa 2 điểm (theo km)
     * @param {number} lat1 - Vĩ độ điểm 1
     * @param {number} lng1 - Kinh độ điểm 1
     * @param {number} lat2 - Vĩ độ điểm 2
     * @param {number} lng2 - Kinh độ điểm 2
     * @returns {number} Khoảng cách tính bằng km
     */
    tinhKhoangCach(lat1, lng1, lat2, lng2) {
        // Chuyển đổi độ sang radian
        const R = 6371; // Bán kính Trái Đất (km)
        const dLat = this._toRad(lat2 - lat1);
        const dLng = this._toRad(lng2 - lng1);
        const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
                 Math.cos(this._toRad(lat1)) * Math.cos(this._toRad(lat2)) * 
                 Math.sin(dLng/2) * Math.sin(dLng/2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
        const d = R * c;
        
        // Làm tròn đến 2 chữ số thập phân
        return Math.round(d * 100) / 100;
    }

    /**
     * Chuyển đổi độ sang radian
     * @private
     */
    _toRad(degrees) {
        return degrees * Math.PI / 180;
    }

    /**
     * Tính và hiển thị khoảng cách giữa 2 marker
     * @param {Object} marker1 - Marker thứ nhất
     * @param {Object} marker2 - Marker thứ hai
     * @returns {number} Khoảng cách tính bằng km
     */
    tinhKhoangCachMarker(marker1, marker2) {
        const latlng1 = marker1.getLatLng();
        const latlng2 = marker2.getLatLng();
        return this.tinhKhoangCach(
            latlng1.lat, 
            latlng1.lng, 
            latlng2.lat, 
            latlng2.lng
        );
    }

    /**
     * Vẽ đường đi giữa 2 điểm
     * @param {number} lat1 - Vĩ độ điểm 1
     * @param {number} lng1 - Kinh độ điểm 1
     * @param {number} lat2 - Vĩ độ điểm 2
     * @param {number} lng2 - Kinh độ điểm 2
     * @param {Object} options - Tùy chọn cho đường (màu sắc, độ dày,...)
     * @returns {Object} polyline - Đối tượng đường vẽ
     */
    veDuongDi(lat1, lng1, lat2, lng2, options = {}) {
        const defaultOptions = {
            color: '#003C71',     // Màu mặc định
            weight: 3,            // Độ dày đường
            opacity: 0.8,         // Độ trong suốt
            dashArray: null,      // Kiểu đường (null = nét liền)
            ...options
        };

        // Tạo mảng điểm cho đường
        const latlngs = [
            [lat1, lng1],
            [lat2, lng2]
        ];

        // Vẽ đường
        const polyline = L.polyline(latlngs, defaultOptions).addTo(this.map);
        
        // Thêm vào mảng quản lý
        this.polylines.push(polyline);

        // Tự động zoom để hiển thị toàn bộ đường
        this.map.fitBounds(polyline.getBounds(), {
            padding: [50, 50] // Thêm padding để đường không sát viền
        });

        return polyline;
    }

    /**
     * Vẽ đường đi giữa 2 marker
     * @param {Object} marker1 - Marker thứ nhất
     * @param {Object} marker2 - Marker thứ hai
     * @param {Object} options - Tùy chọn cho đường
     * @returns {Object} polyline - Đối tượng đường vẽ
     */
    veDuongDiMarker(marker1, marker2, options = {}) {
        const latlng1 = marker1.getLatLng();
        const latlng2 = marker2.getLatLng();
        return this.veDuongDi(
            latlng1.lat,
            latlng1.lng,
            latlng2.lat,
            latlng2.lng,
            options
        );
    }

    /**
     * Xóa tất cả đường đi trên bản đồ
     */
    xoaDuongDi() {
        this.polylines.forEach(polyline => {
            polyline.remove();
        });
        this.polylines = [];
    }
}

// Đảm bảo export default
export default DTUAppsmithMap; 