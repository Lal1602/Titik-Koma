import { useEffect } from 'react';
import { Platform } from 'react-native';
import * as Notifications from 'expo-notifications';
import { NotificationTime } from './useAppSettings';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

export const scheduleDailyNotification = async (time: NotificationTime) => {
  if (Platform.OS === 'web') return;
  
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
};

export const cancelAllNotifications = async () => {
  if (Platform.OS === 'web') return;
  await Notifications.cancelAllScheduledNotificationsAsync();
};

export const useNotifications = (enabled: boolean, time: NotificationTime) => {
  useEffect(() => {
    const setupNotifications = async () => {
      if (Platform.OS === 'web') return;

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

    setupNotifications();
  }, [enabled, time]);
};
