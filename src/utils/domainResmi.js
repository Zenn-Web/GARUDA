// src/utils/domainResmi.js
//
// Mengoreksi hasil deteksiScam() untuk pesan yang cuma berisi domain resmi
// instansi negara Indonesia (.go.id/.ac.id/.mil.id/.desa.id) — akhiran yang
// dikontrol PANDI dan butuh verifikasi dokumen instansi saat pendaftaran,
// beda dengan domain komersial yang bebas didaftarkan siapa saja.
//
// deteksiScam() murni bag-of-words TF-IDF + Logistic Regression, tidak
// punya konsep reputasi domain sama sekali. Modul ini adalah lapisan
// deterministik terpisah (BUKAN ML) yang jalan SETELAH deteksiScam().

const AKHIRAN_RESMI = ['.go.id', '.ac.id', '.mil.id', '.desa.id'];

const REGEX_DOMAIN = /\b(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z]{2,}\b/gi;

function cariSemuaDomain(teks) {
  const matches = teks.match(REGEX_DOMAIN);
  return matches ? matches.map((domain) => domain.toLowerCase()) : [];
}

function isDomainResmi(domain) {
  return AKHIRAN_RESMI.some((akhiran) => domain.endsWith(akhiran));
}

export function koreksiDomainResmi(teks, hasilDeteksi) {
  if (hasilDeteksi.status !== 'SCAM') return hasilDeteksi;

  const domainDitemukan = cariSemuaDomain(teks);
  const semuaDomainResmi = domainDitemukan.length > 0 && domainDitemukan.every(isDomainResmi);

  if (!semuaDomainResmi) return hasilDeteksi;

  return { ...hasilDeteksi, status: 'AMAN' };
}
