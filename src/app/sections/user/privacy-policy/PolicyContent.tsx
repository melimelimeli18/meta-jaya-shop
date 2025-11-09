import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import Container from 'react-bootstrap/Container';

function PolicyContent() {
  return (
    <div style={{ backgroundColor: '#fff', minHeight: '100vh', paddingTop: '60px', paddingBottom: '60px' }}>
      <Container>
        {/* Header */}
        <div className="text-center mb-5">
          <h1 className="fw-bold mb-4" style={{ fontSize: '48px', color: '#333' }}>
            Privacy Policy
          </h1>
          <p style={{ fontSize: '16px', color: '#666' }}>
            Terakhir diperbarui: <span className="fw-bold" style={{ color: '#333' }}>2 November 2025</span>
          </p>
        </div>

        {/* Introduction */}
        <div className="mb-5">
          <p style={{ fontSize: '16px', color: '#666', lineHeight: '1.8' }}>
            MetaJayaShop menghargai privasi setiap pengunjung situs ini.
          </p>
          <p style={{ fontSize: '16px', color: '#666', lineHeight: '1.8' }}>
            Situs ini dibuat untuk memberikan informasi seputar produk audio yang kami sediakan dan mengarahkan pengunjung ke platform <em>e-commerce</em> resmi kami untuk pembelian.
          </p>
        </div>

        {/* Section 1 */}
        <div className="mb-5">
          <h3 className="fw-bold mb-3" style={{ fontSize: '20px', color: '#333' }}>
            1. Pengumpulan Data
          </h3>
          <p style={{ fontSize: '16px', color: '#666', lineHeight: '1.8' }}>
            MetaJayaShop tidak mengumpulkan data pribadi secara langsung dari pengunjung situs ini.
          </p>
          <p style={{ fontSize: '16px', color: '#666', lineHeight: '1.8' }}>
            Namun, kami dapat menggunakan layanan pihak ketiga untuk melihat statistik kunjungan dan meningkatkan pengalaman pengguna.
          </p>
        </div>

        {/* Section 2 */}
        <div className="mb-5">
          <h3 className="fw-bold mb-3" style={{ fontSize: '20px', color: '#333' }}>
            2. Penggunaan Informasi
          </h3>
          <p style={{ fontSize: '16px', color: '#666', lineHeight: '1.8' }}>
            Informasi yang ditampilkan di situs ini semata-mata digunakan untuk memberikan gambaran produk, pengalaman pelanggan, dan meningkatkan kualitas layanan kami. Kami tidak menggunakan informasi tersebut untuk tujuan pemasaran pribadi atau penjualan data.
          </p>
        </div>

        {/* Section 3 */}
        <div className="mb-5">
          <h3 className="fw-bold mb-3" style={{ fontSize: '20px', color: '#333' }}>
            3. Tautan Pihak Ketiga
          </h3>
          <p style={{ fontSize: '16px', color: '#666', lineHeight: '1.8' }}>
            Situs ini mungkin berisi tautan ke platform <em>e-commerce</em> seperti Shopee. Perlu diketahui bahwa aktivitas Anda di situs pihak ketiga tersebut diatur oleh kebijakan privasi masing-masing platform, bukan oleh MetaJayaShop.
          </p>
        </div>

        {/* Section 4 */}
        <div className="mb-5">
          <h3 className="fw-bold mb-3" style={{ fontSize: '20px', color: '#333' }}>
            4. Keamanan Data
          </h3>
          <p style={{ fontSize: '16px', color: '#666', lineHeight: '1.8' }}>
            Kami menjaga agar data yang ditampilkan di situs ini bersumber dari <em>platform</em> terpercaya dan tidak memuat informasi pribadi sensitif dari pelanggan.
          </p>
        </div>

        {/* Section 5 */}
        <div className="mb-5">
          <h3 className="fw-bold mb-3" style={{ fontSize: '20px', color: '#333' }}>
            5. Perubahan Kebijakan
          </h3>
          <p style={{ fontSize: '16px', color: '#666', lineHeight: '1.8' }}>
            Kami dapat memperbarui kebijakan ini sewaktu-waktu untuk menyesuaikan kebutuhan dan peraturan yang berlaku. Pembaruan akan ditampilkan pada halaman ini.
          </p>
        </div>
      </Container>
    </div>
  );
}

export default PolicyContent;