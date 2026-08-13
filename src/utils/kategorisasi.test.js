import { kategorikanPesan } from './kategorisasi';

describe('kategorikanPesan', () => {
  test('mendeteksi ancaman pemblokiran akun sebagai link_pemblokiran_akun', () => {
    const kategori = kategorikanPesan('Rekening Anda akan diblokir jika tidak konfirmasi sekarang');

    expect(kategori).toBe('link_pemblokiran_akun');
  });

  test('mendeteksi modus paket/kurir palsu sebagai link_verifikasi_pihak_ketiga', () => {
    const kategori = kategorikanPesan('Paket Anda tertahan di gudang, cek resi kurir sekarang');

    expect(kategori).toBe('link_verifikasi_pihak_ketiga');
  });

  test('mendeteksi modus hadiah/undian sebagai link_hadiah_undian', () => {
    const kategori = kategorikanPesan('Selamat! Anda menang hadiah undian, klaim sekarang juga');

    expect(kategori).toBe('link_hadiah_undian');
  });

  test('mendeteksi permintaan OTP sebagai otp_pretext', () => {
    const kategori = kategorikanPesan('Tolong kirim kode OTP yang barusan masuk, itu punya saya');

    expect(kategori).toBe('otp_pretext');
  });

  test('fallback ke umum kalau tidak ada kata kunci kategori manapun yang cocok', () => {
    const kategori = kategorikanPesan('Halo, apa kabar? Semoga harimu menyenangkan');

    expect(kategori).toBe('umum');
  });
});
