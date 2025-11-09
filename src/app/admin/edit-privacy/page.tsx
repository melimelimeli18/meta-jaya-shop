'use client';

import React, { useState } from 'react';
import Container from 'react-bootstrap/Container';
import PrivacyEditor from '@/src/app/sections/admin/edit-privacy/PrivacyEditor';

// data dummy
const INITIAL_PRIVACY_CONTENT = `1. Informasi yang Kami Kumpulkan
Kami mengumpulkan informasi yang Anda berikan secara langsung kepada kami, seperti nama, alamat email, nomor telepon, dan informasi lain yang Anda berikan saat menggunakan layanan kami.

2. Penggunaan Informasi
Informasi yang kami kumpulkan digunakan untuk:
- Menyediakan dan meningkatkan layanan kami
- Mengirimkan informasi terkait produk dan promosi
- Menanggapi pertanyaan dan permintaan Anda
- Melindungi hak dan keamanan pengguna

3. Keamanan Data
Kami berkomitmen untuk melindungi informasi pribadi Anda. Kami menggunakan berbagai langkah keamanan untuk menjaga keamanan data Anda dari akses yang tidak sah.

4. Berbagi Informasi
Kami tidak akan menjual, menyewakan, atau membagikan informasi pribadi Anda kepada pihak ketiga tanpa persetujuan Anda, kecuali diwajibkan oleh hukum.

5. Hak Anda
Anda memiliki hak untuk:
- Mengakses informasi pribadi Anda
- Memperbarui atau mengoreksi informasi Anda
- Menghapus informasi pribadi Anda
- Menarik persetujuan Anda

6. Perubahan Kebijakan
Kami dapat memperbarui kebijakan privasi ini dari waktu ke waktu. Perubahan akan diposting di halaman ini dengan tanggal revisi yang diperbarui.

7. Hubungi Kami
Jika Anda memiliki pertanyaan tentang kebijakan privasi ini, silakan hubungi kami melalui:
Email: info@metajayashop.com
Telepon: (021) 1234-5678`;

export default function EditPrivacyPage() {
  const [privacyContent, setPrivacyContent] = useState(INITIAL_PRIVACY_CONTENT);

  const handleSubmit = (content: string) => {
    setPrivacyContent(content);
    
    alert('Kebijakan Privasi berhasil diupdate!');
    
    console.log('Saving privacy content:', content);
  };

  return (
    <Container fluid className="py-4">
      <div className="row justify-content-center">
        <div className="col-md-8">
          <h2 className="fw-bold mb-4 text-center">Edit Kebijakan Privasi</h2>
          
          <PrivacyEditor 
            initialContent={privacyContent}
            onSubmit={handleSubmit}
          />

          <div className="bg-white rounded-4 shadow-sm p-4 mt-4">
            <h5 className="fw-bold mb-3">Preview Kebijakan Privasi</h5>
            <div 
              className="p-3 bg-light rounded-3"
              style={{ 
                whiteSpace: 'pre-wrap',
                maxHeight: '400px',
                overflowY: 'auto'
              }}
            >
              {privacyContent || 'Konten kebijakan privasi akan muncul di sini...'}
            </div>
          </div>
        </div>
      </div>
    </Container>
  );
}