import { deteksiScam } from './GarudaBrain';

describe('deteksiScam', () => {
  test('mendeteksi pesan phishing yang jelas sebagai SCAM', () => {
    const hasil = deteksiScam('Rekening BCA Anda akan diblokir, klik link ini untuk verifikasi');

    expect(hasil.status).toBe('SCAM');
  });

  test('mendeteksi pesan obrolan biasa sebagai AMAN', () => {
    const hasil = deteksiScam('Halo, jadi jemput jam berapa nanti sore?');

    expect(hasil.status).toBe('AMAN');
  });

  test('tidak crash dan tetap mengembalikan confidence valid untuk teks tanpa kata dikenal', () => {
    const hasil = deteksiScam('asdf qwer zxcv');

    expect(hasil.status === 'SCAM' || hasil.status === 'AMAN').toBe(true);
    expect(Number.isFinite(hasil.confidence)).toBe(true);
    expect(hasil.confidence).toBeGreaterThanOrEqual(0);
    expect(hasil.confidence).toBeLessThanOrEqual(100);
  });
});
