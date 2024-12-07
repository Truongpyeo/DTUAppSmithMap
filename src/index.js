import L from 'leaflet';

class DTUAppsmithMap {
    constructor(containerId, options = {}) {
        this.map = null;
        this.markers = [];
        this.polylines = [];
        this.currentLocation = null;
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
     * Vẽ đường đi theo đường phố giữa 2 điểm
     * @param {number} lat1 - Vĩ độ điểm 1
     * @param {number} lng1 - Kinh độ điểm 1
     * @param {number} lat2 - Vĩ độ điểm 2
     * @param {number} lng2 - Kinh độ điểm 2
     * @param {Object} options - Tùy chọn cho đường
     * @returns {Promise} Promise với đối tượng polyline
     */
    async veDuongDi(lat1, lng1, lat2, lng2, options = {}) {
        const defaultOptions = {
            color: '#003C71',     // Màu mặc định
            weight: 3,            // Độ dày đường
            opacity: 0.8,         // Độ trong suốt
            dashArray: null,      // Kiểu đường (null = nét liền)
            ...options
        };

        try {
            // Gọi OSRM API để lấy đường đi
            const response = await fetch(
                `https://router.project-osrm.org/route/v1/driving/${lng1},${lat1};${lng2},${lat2}?overview=full&geometries=geojson`
            );
            const data = await response.json();

            if (data.code !== 'Ok' || !data.routes.length) {
                throw new Error('Không thể tìm được đường đi');
            }

            // Lấy tọa độ đường đi từ response
            const coordinates = data.routes[0].geometry.coordinates;
            
            // Chuyển đổi [lng, lat] sang [lat, lng] cho Leaflet
            const latlngs = coordinates.map(coord => [coord[1], coord[0]]);

            // Xóa đường cũ nếu có
            this.xoaDuongDi();

            // Vẽ đường mới
            const polyline = L.polyline(latlngs, defaultOptions).addTo(this.map);
            
            // Thêm vào mảng quản lý
            this.polylines.push(polyline);

            // Tự động zoom để hiển thị toàn bộ đường
            this.map.fitBounds(polyline.getBounds(), {
                padding: [50, 50]
            });

            return polyline;
        } catch (error) {
            console.error('Lỗi khi vẽ đường:', error);
            return null;
        }
    }

    /**
     * Vẽ đường đi giữa 2 marker
     * @param {Object} marker1 - Marker thứ nhất
     * @param {Object} marker2 - Marker thứ hai
     * @param {Object} options - Tùy chọn cho đường
     * @returns {Promise} Promise với đối tượng polyline
     */
    async veDuongDiMarker(marker1, marker2, options = {}) {
        const latlng1 = marker1.getLatLng();
        const latlng2 = marker2.getLatLng();
        return await this.veDuongDi(
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

    /**
     * Cập nhật vị trí hiện tại
     * @param {number} lat - Vĩ độ
     * @param {number} lng - Kinh độ
     * @param {string} title - Tiêu đề (mặc định: "Vị trí hiện tại")
     * @param {string} content - Nội dung mô tả
     * @returns {Object} marker - Marker vị trí hiện tại
     */
    capNhatViTriHienTai(lat, lng, title = "Vị trí hiện tại", content = "Current location") {
        // Xóa marker vị trí hiện tại cũ nếu có
        if (this.currentLocation) {
            this.currentLocation.remove();
            this.markers = this.markers.filter(m => m !== this.currentLocation);
        }

        // Tạo marker mới cho vị trí hiện tại
        this.currentLocation = this.taoDiaDiem(
            lat, 
            lng, 
            title, 
            content,
            'fa-solid fa-location-dot', // Icon khác để phân biệt
            '#FF0000'          // Màu đỏ cho vị trí hiện tại
        );

        return this.currentLocation;
    }

    /**
     * Tính khoảng cách từ vị trí hiện tại đến một điểm
     * @param {number} lat - Vĩ độ điểm đích
     * @param {number} lng - Kinh độ điểm đích
     * @returns {number|null} Khoảng cách (km) hoặc null nếu chưa có vị trí hiện tại
     */
    tinhKhoangCachDenDiem(lat, lng) {
        if (!this.currentLocation) {
            console.warn('Chưa có vị trí hiện t���i');
            return null;
        }

        const currentLatLng = this.currentLocation.getLatLng();
        return this.tinhKhoangCach(
            currentLatLng.lat,
            currentLatLng.lng,
            lat,
            lng
        );
    }

    /**
     * Tính khoảng cách từ vị trí hiện tại đến tất cả các marker
     * @returns {Array} Mảng các khoảng cách đến từng marker
     */
    tinhKhoangCachDenCacDiem() {
        if (!this.currentLocation) {
            console.warn('Chưa có vị trí hiện tại');
            return [];
        }

        return this.markers
            .filter(marker => marker !== this.currentLocation) // Loại bỏ marker vị trí hiện tại
            .map(marker => {
                const latLng = marker.getLatLng();
                const distance = this.tinhKhoangCachDenDiem(latLng.lat, latLng.lng);
                const title = marker.getPopup()?.getContent()?.match(/<h3[^>]*>(.*?)<\/h3>/)?.[1] || 'Không có tiêu đề';
                
                return {
                    marker: marker,
                    title: title,
                    distance: distance
                };
            })
            .sort((a, b) => a.distance - b.distance); // Sắp xếp theo khoảng cách tăng dần
    }

    /**
     * Vẽ vùng tròn với gradient
     * @param {number} lat - Vĩ độ tâm
     * @param {number} lng - Kinh độ tâm
     * @param {number} radius - Bán kính vòng tròn (mét)
     * @param {string} color - Màu chính của vòng tròn (mặc định: '#003C71')
     * @param {Object} options - Tùy chọn thêm
     * @returns {Object} circle - Đối tượng vòng tròn
     */
    veVungTron(lat, lng, radius = 1000, color = '#003C71', options = {}) {
        // Xử lý màu cho gradient
        const rgbaColor = (hexColor, opacity) => {
            const hex = hexColor.replace('#', '');
            const r = parseInt(hex.substring(0, 2), 16);
            const g = parseInt(hex.substring(2, 4), 16);
            const b = parseInt(hex.substring(4, 6), 16);
            return `rgba(${r}, ${g}, ${b}, ${opacity})`;
        };

        const defaultOptions = {
            stroke: true,
            color: color,          // Màu viền
            weight: 2,            // Độ dày viền
            opacity: 1,           // Độ đậm viền
            fillColor: color,     // Màu nền
            fillOpacity: 0.2,     // Độ trong suốt nền
            ...options
        };

        // Tạo gradient radial cho fill
        const circle = L.circle([lat, lng], {
            radius: radius,
            ...defaultOptions,
            gradient: true,
            fillGradient: {
                radial: true,
                colors: [
                    { offset: 0, color: rgbaColor(color, 0.1) },    // Tâm trong suốt hơn
                    { offset: 0.5, color: rgbaColor(color, 0.2) },  // Giữa
                    { offset: 1, color: rgbaColor(color, 0.3) }     // Viền đậm hơn
                ]
            }
        }).addTo(this.map);

        // Thêm vào mảng quản lý nếu cần
        if (!this.circles) this.circles = [];
        this.circles.push(circle);

        // Tự động zoom đến vùng tròn
        this.map.fitBounds(circle.getBounds(), {
            padding: [50, 50]
        });

        return circle;
    }

    /**
     * Xóa tất cả vùng tròn trên bản đồ
     */
    xoaVungTron() {
        if (this.circles) {
            this.circles.forEach(circle => {
                circle.remove();
            });
            this.circles = [];
        }
    }

    /**
     * Tìm kiếm địa điểm và trả về tọa độ
     * @param {string} address - Địa chỉ cần tìm
     * @returns {Promise<{lat: number, lng: number} | null>} Tọa độ của địa điểm
     */
    async timKiemDiaChi(address) {
        try {
            const response = await fetch(
                `https://nominatim.openstreetmap.org/search?` + 
                `q=${encodeURIComponent(address)}&format=json&addressdetails=1`
            );
            
            const data = await response.json();
            
            if (data && data.length > 0) {
                return {
                    lat: parseFloat(data[0].lat),
                    lng: parseFloat(data[0].lon)
                };
            }
            
            return null;
        } catch (error) {
            console.error('Lỗi khi tìm kiếm địa chỉ:', error);
            return null;
        }
    }

    /**
     * Tìm kiếm và đánh dấu địa điểm trên bản đồ
     * @param {string} address - Địa chỉ cần tìm
     * @param {Object} options - Tùy chọn cho marker
     * @returns {Promise<Object|null>} Marker đ�� tạo hoặc null nếu không tìm thấy
     */
    async timVaDanhDau(address, options = {}) {
        const coords = await this.timKiemDiaChi(address);
        
        if (coords) {
            const marker = this.taoDiaDiem(
                coords.lat,
                coords.lng,
                address,  // Sử dụng địa chỉ làm title
                '',      // Content trống
                options.iconClass || 'fa-map-marker-alt',
                options.iconColor || '#003C71',
                options
            );
            
            // Di chuyển map đến vị trí tìm được
            this.map.setView([coords.lat, coords.lng], 16);
            
            return marker;
        }
        
        return null;
    }
}

// Đảm bảo export default
export default DTUAppsmithMap; 