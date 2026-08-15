import { koreksiDomainResmi } from './domainResmi';

describe('koreksiDomainResmi', () => {
  test('mengoreksi SCAM jadi AMAN kalau pesan cuma berisi satu domain resmi (.go.id)', () => {
    const hasil = koreksiDomainResmi('s.bps.go.id/wut32', { status: 'SCAM', confidence: 91.2 });

    expect(hasil.status).toBe('AMAN');
  });

  test('tidak mengoreksi kalau ada domain non-whitelist yang menyertai domain resmi (pola umpan)', () => {
    const teks =
      'BPJS Kesehatan Anda akan diblokir dalam 24 jam! Verifikasi di bpjs-kesehatan.go.id, atau klik: bit.ly/verif-otp';
    const hasil = koreksiDomainResmi(teks, { status: 'SCAM', confidence: 88 });

    expect(hasil.status).toBe('SCAM');
  });

  test('tidak mengoreksi kalau akhiran resmi cuma nempel di tengah nama domain jebakan', () => {
    const hasil = koreksiDomainResmi('cek di bps.go.id.penipu-online.com sekarang', {
      status: 'SCAM',
      confidence: 95,
    });

    expect(hasil.status).toBe('SCAM');
  });

  test.each([
    ['https://ojk.go.id', 'skema https'],
    ['http://www.OJK.GO.ID', 'kapital + skema http + www'],
    ['www.ojk.go.id/pengaduan', 'www + path'],
    ['OJK.go.id', 'huruf besar tanpa skema'],
  ])('tetap mengoreksi jadi AMAN untuk variasi penulisan domain resmi: %s (%s)', (teks) => {
    const hasil = koreksiDomainResmi(teks, { status: 'SCAM', confidence: 70 });

    expect(hasil.status).toBe('AMAN');
  });

  test('mengoreksi jadi AMAN kalau ada dua domain resmi berbeda tanpa domain lain', () => {
    const hasil = koreksiDomainResmi('Info ada di ojk.go.id atau bps.go.id', {
      status: 'SCAM',
      confidence: 60,
    });

    expect(hasil.status).toBe('AMAN');
  });

  test('tidak mengoreksi kalau pesan tidak mengandung domain sama sekali', () => {
    const hasil = koreksiDomainResmi('Rekening Anda akan diblokir jika tidak konfirmasi sekarang', {
      status: 'SCAM',
      confidence: 97,
    });

    expect(hasil.status).toBe('SCAM');
  });

  test('tidak mengoreksi kalau cuma menyebut "go id" tanpa bentuk domain yang valid (tanpa titik)', () => {
    const hasil = koreksiDomainResmi('banyak instansi pakai akhiran go id untuk situsnya', {
      status: 'SCAM',
      confidence: 80,
    });

    expect(hasil.status).toBe('SCAM');
  });

  test.each([
    ['ub.ac.id', 'kampus (.ac.id)'],
    ['tniad.mil.id', 'militer (.mil.id)'],
    ['sukamaju.desa.id', 'desa (.desa.id)'],
  ])('mengoreksi jadi AMAN untuk domain resmi %s (%s)', (teks) => {
    const hasil = koreksiDomainResmi(teks, { status: 'SCAM', confidence: 65 });

    expect(hasil.status).toBe('AMAN');
  });

  test('tidak mengubah status AMAN yang sudah benar dari model, dan tidak mengubah confidence', () => {
    const hasilAsli = { status: 'AMAN', confidence: 82.5 };
    const hasil = koreksiDomainResmi('Halo, jadi jemput jam berapa nanti sore?', hasilAsli);

    expect(hasil).toEqual(hasilAsli);
  });

  test('mempertahankan confidence dari model meski status dikoreksi jadi AMAN', () => {
    const hasil = koreksiDomainResmi('s.bps.go.id/wut32', { status: 'SCAM', confidence: 91.2 });

    expect(hasil.confidence).toBe(91.2);
  });

  describe('dikoreksiOlehDomainResmi (flag buat menandai kalau status dikoreksi oleh domain resmi)', () => {
    test('true kalau status benar-benar dikoreksi jadi AMAN', () => {
      const hasil = koreksiDomainResmi('s.bps.go.id/wut32', { status: 'SCAM', confidence: 91.2 });

      expect(hasil.dikoreksiOlehDomainResmi).toBe(true);
    });

    test('false kalau pesan tetap SCAM (ada domain non-whitelist)', () => {
      const teks = 'BPJS Kesehatan Anda akan diblokir dalam 24 jam! Verifikasi di bpjs-kesehatan.go.id, atau klik: bit.ly/verif-otp';
      const hasil = koreksiDomainResmi(teks, { status: 'SCAM', confidence: 88 });

      expect(hasil.dikoreksiOlehDomainResmi).toBe(false);
    });

    test('false kalau pesan tidak mengandung domain sama sekali', () => {
      const hasil = koreksiDomainResmi('Rekening Anda akan diblokir jika tidak konfirmasi sekarang', {
        status: 'SCAM',
        confidence: 97,
      });

      expect(hasil.dikoreksiOlehDomainResmi).toBe(false);
    });
  
    test('false kalau status AMAN dari awal (bukan hasil koreksi whitelist domain resmi)', () => {
      const hasilAsli = { status: 'AMAN', confidence: 82.5 };
      const hasil = koreksiDomainResmi('Halo, jadi jemput jam berapa nanti sore?', hasilAsli);

      expect(hasil.dikoreksiOlehDomainResmi).toBe(false);
    });
    
  });

});
