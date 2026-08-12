import { fireEvent, renderRouter, waitFor } from 'expo-router/testing-library';

describe('alur Home → Result', () => {
  test('menekan "Cek Pesan Ini" atas pesan phishing menampilkan layar Result berstatus BAHAYA', async () => {
    const app = await renderRouter('src/app', { initialUrl: '/' });

    await fireEvent.changeText(
      app.getByPlaceholderText('Tempel atau ketik pesan yang mau dicek'),
      'Rekening BCA Anda akan diblokir, klik link ini untuk verifikasi',
    );
    await fireEvent.press(app.getByText('Cek Pesan Ini'));

    await waitFor(() => {
      expect(app.getByText('BAHAYA')).toBeTruthy();
    });
  });
});
