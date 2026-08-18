import { useEffect } from 'react';
import { Platform } from 'react-native';
import Constants from 'expo-constants';
import { NotificationTime } from './useAppSettings';

let Notifications: any = null;

// Expo Go SDK 53+ tidak mendukung expo-notifications secara penuh dan auto-registration-nya menyebabkan crash.
// Kita hanya memuatnya secara dinamis jika berjalan di APK/Standalone (bukan Expo Go).
const isExpoGo = Constants.appOwnership === 'expo';

if (!isExpoGo && Platform.OS !== 'web') {
  try {
    Notifications = require('expo-notifications');
    Notifications.setNotificationHandler({
      handleNotification: async () => ({
        shouldShowAlert: true,
        shouldPlaySound: true,
        shouldSetBadge: false,
      }),
    });
  } catch (error) {
    console.warn("expo-notifications gagal dimuat", error);
  }
}

export const scheduleDailyNotification = async (time: NotificationTime) => {
  if (Platform.OS === 'web' || isExpoGo || !Notifications) return;
  
  try {
    await Notifications.cancelAllScheduledNotificationsAsync();

    const [hourStr, minuteStr] = time.split(':');
    const hour = parseInt(hourStr, 10);
    const minute = parseInt(minuteStr, 10);

    await Notifications.scheduleNotificationAsync({
      content: {
        title: "Kutipan Hari Ini ✨",
        body: "Buka Titik-Koma untuk membaca kalimat estetik yang pas untukmu hari ini.",
        sound: true,
      },
      trigger: {
        type: Notifications.SchedulableTriggerInputTypes.DAILY,
        hour,
        minute,
      } as any,
    });
  } catch (error) {
    console.error("Gagal menjadwalkan notifikasi:", error);
  }
};

export const cancelAllNotifications = async () => {
  if (Platform.OS === 'web' || isExpoGo || !Notifications) return;
  await Notifications.cancelAllScheduledNotificationsAsync();
};

export const useNotifications = (enabled: boolean, time: NotificationTime) => {
  useEffect(() => {
    const setupNotifications = async () => {
      if (Platform.OS === 'web' || isExpoGo || !Notifications) return;

      if (!enabled) {
        await cancelAllNotifications();
        return;
      }

      const { status: existingStatus } = await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;
      if (existingStatus !== 'granted') {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }
      
      if (finalStatus !== 'granted') {
        return;
      }

      if (Platform.OS === 'android') {
        await Notifications.setNotificationChannelAsync('default', {
          name: 'Pengingat Harian',
          importance: Notifications.AndroidImportance.MAX,
          vibrationPattern: [0, 250, 250, 250],
          lightColor: '#208AEF',
        });
      }

      await scheduleDailyNotification(time);
    };

    setupNotifications().catch(error => console.error("Error setting up notifications:", error));
  }, [enabled, time]);
};
