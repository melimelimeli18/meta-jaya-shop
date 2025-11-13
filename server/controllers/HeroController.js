// controllers/HeroController.js
const supabase = require('../config/supabase');

class HeroController {
  // GET - Ambil data hero section
  static async getHero(req, res) {
    try {
      const { data, error } = await supabase
        .from('hero_section')
        .select('*')
        .eq('is_active', true)
        .single();

      if (error) {
        if (error.code === 'PGRST116') {
          return res.status(200).json({
            success: true,
            data: {
              headline: 'Selamat Datang di MetaJaya Shop',
              sub_headline: 'Toko Audio Profesional Terlengkap di Indonesia',
              banner_image_url: null
            }
          });
        }
        throw error;
      }

      return res.status(200).json({
        success: true,
        data: data
      });

    } catch (error) {
      console.error('Error fetching hero:', error);
      return res.status(500).json({
        success: false,
        message: 'Gagal mengambil data hero section',
        error: error.message
      });
    }
  }

  // PUT - Update hero section
  static async updateHero(req, res) {
    try {
      const { headline, sub_headline, banner_image_url } = req.body;

      const { data: existingHero, error: fetchError } = await supabase
        .from('hero_section')
        .select('*')
        .eq('is_active', true)
        .single();

      let result;

      if (fetchError && fetchError.code === 'PGRST116') {
        const { data, error } = await supabase
          .from('hero_section')
          .insert([{
            headline,
            sub_headline,
            banner_image_url,
            is_active: true
          }])
          .select()
          .single();

        if (error) throw error;
        result = data;

      } else if (existingHero) {
        const { data, error } = await supabase
          .from('hero_section')
          .update({
            headline,
            sub_headline,
            banner_image_url,
          })
          .eq('id', existingHero.id)
          .select()
          .single();

        if (error) throw error;
        result = data;
      }

      return res.status(200).json({
        success: true,
        message: 'Hero section berhasil diupdate',
        data: result
      });

    } catch (error) {
      console.error('Error updating hero:', error);
      return res.status(500).json({
        success: false,
        message: 'Gagal mengupdate hero section',
        error: error.message
      });
    }
  }

  // POST - Upload banner image dan langsung update hero
  static async uploadBanner(req, res) {
    try {
      if (!req.file) {
        return res.status(400).json({
          success: false,
          message: 'Tidak ada file yang diupload'
        });
      }

      const file = req.file;
      const fileName = `hero-banner-${Date.now()}.${file.originalname.split('.').pop()}`;

      // 1. Upload ke Supabase Storage
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('hero-images')
        .upload(fileName, file.buffer, {
          contentType: file.mimetype,
          upsert: false
        });

      if (uploadError) throw uploadError;

      // 2. Get public URL
      const { data: publicUrlData } = supabase.storage
        .from('hero-images')
        .getPublicUrl(fileName);

      const imageUrl = publicUrlData.publicUrl;

      // 3. Update hero section dengan URL gambar baru
      const { data: existingHero, error: fetchError } = await supabase
        .from('hero_section')
        .select('*')
        .eq('is_active', true)
        .single();

      let heroResult;

      if (fetchError && fetchError.code === 'PGRST116') {
        // Belum ada hero, buat baru
        const { data, error } = await supabase
          .from('hero_section')
          .insert([{
            headline: 'Selamat Datang di MetaJaya Shop',
            sub_headline: 'Toko Audio Profesional Terlengkap di Indonesia',
            banner_image_url: imageUrl,
            is_active: true
          }])
          .select()
          .single();

        if (error) throw error;
        heroResult = data;

      } else if (existingHero) {
        // Sudah ada hero, update banner_image_url saja
        const { data, error } = await supabase
          .from('hero_section')
          .update({
            banner_image_url: imageUrl
          })
          .eq('id', existingHero.id)
          .select()
          .single();

        if (error) throw error;
        heroResult = data;
      }

      return res.status(200).json({
        success: true,
        message: 'Banner berhasil diupload dan hero section diupdate',
        data: {
          url: imageUrl,
          hero: heroResult
        }
      });

    } catch (error) {
      console.error('Error uploading banner:', error);
      return res.status(500).json({
        success: false,
        message: 'Gagal mengupload banner',
        error: error.message
      });
    }
  }
}

module.exports = HeroController;