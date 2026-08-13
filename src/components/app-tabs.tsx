import { NativeTabs } from 'expo-router/unstable-native-tabs';

import { Colors } from '@/constants/theme';

// Catatan: ikon tab pakai src={require(png)}, BUKAN NativeTabs.Trigger.VectorIcon —
// VectorIcon memanggil expo-font.renderToImageAsync untuk rasterisasi font, yang belum
// diimplementasikan di platform web dan bikin seluruh proses Metro crash saat SSR web.
//
// Tidak mengikuti useColorScheme() sistem — GARUDA light-only, lihat CONTEXT.md.
export default function AppTabs() {
  return (
    <NativeTabs
      backgroundColor={Colors.background}
      indicatorColor={Colors.backgroundElement}
      labelStyle={{ selected: { color: Colors.text } }}>
      <NativeTabs.Trigger name="index">
        <NativeTabs.Trigger.Label>Beranda</NativeTabs.Trigger.Label>
        <NativeTabs.Trigger.Icon
          src={require('@/assets/images/tabIcons/home.png')}
          renderingMode="template"
        />
      </NativeTabs.Trigger>
    </NativeTabs>
  );
}
