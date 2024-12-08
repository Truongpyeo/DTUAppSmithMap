# DTUAppSmithMap

[![npm version](https://img.shields.io/npm/v/dtuappsmithmap.svg)](https://www.npmjs.com/package/dtuappsmithmap)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

Thư viện wrapper cho Leaflet, được tùy chỉnh đặc biệt cho Appsmith với các chức năng GIS của DTU.

## 📦 Cài đặt

### NPM

```bash
npm install dtuappsmithmap
```

### CDN

```html
<script src="https://cdn.jsdelivr.net/npm/dtuappsmithmap@2.2.20/dist/index.umd.js"></script>
```

  - AppSmith
    - Thêm URL sau vào Resource của Appsmith:
```
  https://cdn.jsdelivr.net/npm/dtuappsmithmap@2.2.20/dist/index.umd.js
```

Tìm hiểu thêm về plugin tại [DTUAppSmithMap](https://www.npmjs.com/package/dtuappsmithmap)

Tìm hiểu chi tiết hướng dẫn tại [Appsmith](https://docs.appsmith.com/core-concepts/writing-code/ext-libraries#prerequisites)

## 🚀 Tính năng

- Tạo và quản lý marker với icon tùy chỉnh từ Font Awesome
- Hiển thị popup thông tin với style DTU
- Vẽ đường đi theo đường phố thực tế
- Tính khoảng cách giữa các điểm
- Vẽ vùng ảnh hưởng với gradient
- Theo dõi vị trí hiện tại

## 🎯 Sử dụng

### Khởi tạo bản đồ

```javascript
const map = new DTUAppsmithMap('map-container', {
    center: [16.0544, 108.2022],
    zoom: 13
});
```

### Tạo địa điểm với marker

```javascript
map.taoDiaDiem(
    16.0544,                    // latitude
    108.2022,                   // longitude
    "Đại học Duy Tân",         // title
    "254 Nguyễn Văn Linh",     // content
    "fas fa-university",        // icon class (Font Awesome)
    "#003C71",                  // icon color
    {                          // options
        marker: {},
        popup: {}
    }
);
```

### Cập nhật vị trí hiện tại

```javascript
map.capNhatViTriHienTai(
    16.0544,
    108.2022,
    "Vị trí của bạn",
    "Current location"
);
```

### Vẽ đường đi

```javascript
// Vẽ đường đi giữa 2 điểm
await map.veDuongDi(
    16.0544, 108.2022,     // điểm bắt đầu
    16.0464, 108.2326,     // điểm kết thúc
    {
        color: '#FF0000',   // màu đường
        weight: 3,          // độ dày
        opacity: 0.8        // độ trong suốt
    }
);

// Vẽ đường đi giữa 2 marker
await map.veDuongDiMarker(marker1, marker2, options);
```

### Tính khoảng cách

```javascript
// Tính khoảng cách giữa 2 điểm
const distance = map.tinhKhoangCach(
    16.0544, 108.2022,     // điểm 1
    16.0464, 108.2326      // điểm 2
);

// Tính khoảng cách từ vị trí hiện tại đến một điểm
const distance = map.tinhKhoangCachDenDiem(16.0464, 108.2326);

// Lấy danh sách khoảng cách đến tất cả các điểm
const distances = map.tinhKhoangCachDenCacDiem();
```

### Vẽ vùng tròn

```javascript
map.veVungTron(
    16.0544,        // latitude
    108.2022,       // longitude
    1000,           // bán kính (mét)
    '#003C71',      // màu
    {               // options
        weight: 2,
        opacity: 1,
        fillOpacity: 0.2
    }
);
```

## 📝 API Reference

### Khởi tạo
- `constructor(containerId, options)`: Khởi tạo bản đồ

### Marker và Địa điểm
- `taoDiaDiem(lat, lng, title, content, iconClass, iconColor, options)`: Tạo marker với popup
- `capNhatViTriHienTai(lat, lng, title, content)`: Cập nhật vị trí hiện tại

### Đường đi
- `veDuongDi(lat1, lng1, lat2, lng2, options)`: Vẽ đường đi giữa 2 điểm
- `veDuongDiMarker(marker1, marker2, options)`: Vẽ đường đi giữa 2 marker
- `xoaDuongDi()`: Xóa tất cả đường đi

### Khoảng cách
- `tinhKhoangCach(lat1, lng1, lat2, lng2)`: Tính khoảng cách giữa 2 điểm
- `tinhKhoangCachMarker(marker1, marker2)`: Tính khoảng cách giữa 2 marker
- `tinhKhoangCachDenDiem(lat, lng)`: Tính khoảng cách từ vị trí hiện tại
- `tinhKhoangCachDenCacDiem()`: Lấy danh sách khoảng cách đến tất cả điểm

### Vùng ảnh hưởng
- `veVungTron(lat, lng, radius, color, options)`: Vẽ vùng tròn với gradient
- `xoaVungTron()`: Xóa tất cả vùng tròn

### Tìm kiếm
- `timKiemDiaChi(address)`: Tìm kiếm địa điểm và trả về tọa độ
javascript
// Tìm kiếm địa chỉ
const coords = await map.timKiemDiaChi("254 Nguyễn Văn Linh");
// Kết quả: {lat: 16.0544, lng: 108.2022}
```

- `timVaDanhDau(address, options)`: Tìm kiếm và đánh dấu địa điểm trên bản đồ
```javascript
// Tìm và đánh dấu địa điểm
const marker = await map.timVaDanhDau(
    "Đại học Duy Tân",
    {
        iconClass: 'fa-university',
        iconColor: '#003C71'
    }
);
```
```
## 🎨 Tùy chỉnh Style

### Custom Marker Icon

```javascript
const options = {
    marker: {
        draggable: true,
        title: 'Marker title'
    },
    popup: {
        maxWidth: 300,
        className: 'custom-popup'
    }
};
```

### Custom Route Style

```javascript
const routeOptions = {
    color: '#FF0000',
    weight: 3,
    opacity: 0.8,
    dashArray: '10, 10'  // đường nét đứt
};
```

### Custom Circle Style

```javascript
const circleOptions = {
    stroke: true,
    color: '#003C71',
    weight: 2,
    opacity: 1,
    fillOpacity: 0.2
};
```


## Các Hàm Mới

### getLocationInfo(locationId)
Trả về thông tin chi tiết về một địa điểm dựa trên ID.


## 💡Nhà phát triển

- 📧 Email: thanhtruong23111999@gmail.com

- 📱 Hotline: 0376 659 652

*" 🏫 DTU_DZ - DUY TAN UNIVERSITY - SCS ✨"*

## 📞 Liên hệ
- Lê Thanh Trường       :  <u>thanhtruong23111999@gmail.com</u>
- Võ Văn Việt           :  <u>vietvo371@gmail.com</u>
- Nguyễn Ngọc Duy Thái  :  <u>kkdn011@gmail.com</u>

## 📚 Tài liệu
- [Hướng dẫn cài đặt](docs/setup.md)
- [Hướng dẫn đóng góp](/CONTRIBUTING.md)

## 🤝 Đóng góp
Chúng tôi rất hoan nghênh mọi đóng góp! Xem [CONTRIBUTING](CONTRIBUTING.md) để biết thêm chi tiết.

## 🔄 Quy trình phát triển
1. Fork repo này
2. Tạo branch mới (`git checkout -b feature/AmazingFeature`)
3. Commit thay đổi (`git commit -m 'Add some AmazingFeature'`)
4. Push lên branch (`git push origin feature/AmazingFeature`) 
5. Tạo Pull Request

## 🐛 Báo lỗi
Nếu bạn phát hiện lỗi, vui lòng tạo issue mới với:
- Mô tả chi tiết lỗi
- Các bước tái hiện
- Screenshots nếu có
- Môi trường (browser, OS...)

## 📜 Changelog
Xem [CHANGELOG](CHANGELOG.md) để biết lịch sử thay đổi.

## ⚖️ Code of Conduct
Xem [CODE_OF_CONDUCT](CODE_OF_CONDUCT.md) để biết các quy tắc và hành vi được chấp nhận.

## Báo cáo lỗi & Góp ý
- Issues: [GitHub Issues](https://github.com/Truongpyeo/DTURelifeLink/issues)
- Security: Đối với các vấn đề bảo mật nhạy cảm, vui lòng liên hệ trực tiếp qua email: <u>thanhtruong23111999@gmail.com</u>


### 📝 License
Dự án được phân phối dưới giấy phép [MIT License](LICENSE)