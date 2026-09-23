// SDK 58 Expo Go does not bundle ExpoTopicSubscriptionModule. Importing the
// expo-notifications entry point loads that unused push module and crashes at
// startup. These local-notification imports avoid the push notification entry.
import { cancelScheduledNotificationAsync } from 'expo-notifications/build/cancelScheduledNotificationAsync';
import { requestPermissionsAsync } from 'expo-notifications/build/NotificationPermissions';
import { SchedulableTriggerInputTypes } from 'expo-notifications/build/Notifications.types';
import { scheduleNotificationAsync } from 'expo-notifications/build/scheduleNotificationAsync';
import { setNotificationChannelAsync } from 'expo-notifications/build/setNotificationChannelAsync';

const CHANNEL_ID = 'dkd-zikir';

export async function requestReminderPermission() {
  // Android 13+ asks for notification permission after a channel is created.
  await setNotificationChannelAsync(CHANNEL_ID, {
    name: 'Günlük zikir hatırlatması', importance: 3
  });
  return (await requestPermissionsAsync()).granted;
}

export async function cancelReminder(identifier: string) {
  await cancelScheduledNotificationAsync(identifier);
}

export async function scheduleDailyReminder(hour: number) {
  return scheduleNotificationAsync({
    content: {
      title: 'DraBornZikir ✦',
      body: 'Bugünün zikrine birkaç dakika ayırmak ister misin?',
      sound: false
    },
    trigger: { type: SchedulableTriggerInputTypes.DAILY, hour, minute: 0, channelId: CHANNEL_ID }
  });
}
