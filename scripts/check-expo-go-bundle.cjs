const { readFileSync, readdirSync } = require('node:fs');
const { join } = require('node:path');

const exportDir = process.argv[2];
if (!exportDir) {
  throw new Error('Android Expo export directory is required');
}

const bundleDir = join(exportDir, '_expo', 'static', 'js', 'android');
const bundles = readdirSync(bundleDir).filter((filename) => filename.endsWith('.hbc'));
if (bundles.length === 0) {
  throw new Error('Android Hermes bundle not found');
}

const required = [
  'ExpoNotificationScheduler',
  'ExpoNotificationChannelManager',
  'ExpoNotificationPermissionsModule'
];
for (const filename of bundles) {
  const bundle = readFileSync(join(bundleDir, filename));
  if (bundle.includes(Buffer.from('ExpoTopicSubscriptionModule'))) {
    throw new Error(`${filename} includes a push module missing from Expo Go 58`);
  }
  for (const moduleName of required) {
    if (!bundle.includes(Buffer.from(moduleName))) {
      throw new Error(`${filename} is missing local reminder module ${moduleName}`);
    }
  }
}

console.log('Expo Go 58 bundle contains local reminders without the unavailable push module.');
