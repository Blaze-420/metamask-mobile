/* eslint-disable no-console */
import performance, { PerformanceObserver } from 'react-native-performance';
import {
  getFirstInstallTime,
  getLastUpdateTime,
} from 'react-native-device-info';
import {
  EXISTING_USER,
  FRESH_INSTALL_CHECK_DONE,
} from '../../constants/storage';
import Logger from '../../util/Logger';
import AsyncStorage from '@react-native-async-storage/async-storage';
import StorageWrapper from '../../store/storage-wrapper';
import { TraceName, TraceOperation, endTrace, trace } from '../../util/trace';
import getUIStartupSpan from './UIStartup';
import { isTest } from '../../util/test/utils';

/**
 * Service for measuring app performance
 */

async function setPerformanceValues(appStartTime: number) {
  await StorageWrapper.setItem('appStartTime', appStartTime.toString());
}

class Performance {
  static appLaunchTime: number;

  /**
   * Checks if this is a fresh install with restored MMKV data from a backup.
   * If so, clears the MMKV storage to ensure a clean state.
   */
  static handleFreshInstallWithRestoredData = () => {
    (async () => {
      try {
        // Check if we've already performed this check
        const freshInstallCheckDone = await AsyncStorage.getItem(
          FRESH_INSTALL_CHECK_DONE,
        );

        if (!freshInstallCheckDone) {
          // Check if this is a fresh install
          const firstInstallTime = await getFirstInstallTime();
          const lastUpdateTime = await getLastUpdateTime();
          const isFreshInstall = firstInstallTime === lastUpdateTime;

          if (isFreshInstall) {
            const existingUser = await StorageWrapper.getItem(EXISTING_USER);

            if (existingUser) {
              // This is a fresh install but we have an existing user flag. This indicates restored data from a backup
              await StorageWrapper.clearAll();
            }
          }

          await AsyncStorage.setItem('FRESH_INSTALL_CHECK_DONE', 'true');
        }
      } catch (error) {
        Logger.error(
          error as Error,
          'Error checking for fresh install with restored data',
        );
      }
    })();
  };

  /**
   * Measures app start and JS bundle loading times
   */
  static setupPerformanceObservers = () => {
    new PerformanceObserver((list) => {
      // Get measurement entries
      const entries = list.getEntries();

      if (entries.find((entry) => entry.name === 'runJsBundleEnd')) {
        // Measure app start
        performance.measure(
          'nativeLaunch',
          'nativeLaunchStart',
          'nativeLaunchEnd',
        );
        // Measure JS bundle load
        performance.measure(
          'runJsBundle',
          'runJsBundleStart',
          'runJsBundleEnd',
        );
        // Retrieve the measurements
        const nativeLaunchEntry = performance.getEntriesByName('nativeLaunch');
        const runJsBundleEntry = performance.getEntriesByName('runJsBundle');

        // Get the duration
        const nativeLaunchDuration = nativeLaunchEntry[0].duration;
        const jsBundleDuration = runJsBundleEntry[0].duration;
        // Assuming JS bundle loads in parallel with launch start
        // the total app start time is then the maximum of the two durations
        const appStartTime = Math.max(nativeLaunchDuration, jsBundleDuration);

        if (isTest) {
          // eslint-disable-next-line no-console
          console.info(
            `-------------------------------------------------------`,
          );
          console.info(
            `---------------🕙 PERFORMANCE NUMBERS 🕙---------------`,
          );
          console.info(
            `-------------------------------------------------------`,
          );
          console.info(`NATIVE LAUNCH TIME - ${nativeLaunchDuration}ms`);
          console.info(`JS BUNDLE LOAD TIME - ${jsBundleDuration}ms`);
          console.info(
            `APP START TIME = MAX(NATIVE LAUNCH TIME, JS BUNDLE LOAD TIME) - ${appStartTime}ms`,
          );
          console.info(
            `-------------------------------------------------------`,
          );
          console.info(
            `-------------------------------------------------------`,
          );

          setPerformanceValues(appStartTime);
        }
        const now = Date.now();

        const appLaunchTime = now - appStartTime;
        this.appLaunchTime = appLaunchTime;

        const parentSpan = getUIStartupSpan(appLaunchTime);

        trace({
          name: TraceName.LoadScripts,
          startTime: appLaunchTime,
          parentContext: parentSpan,
          op: TraceOperation.LoadScripts,
        });
        endTrace({
          name: TraceName.LoadScripts,
          timestamp: now,
        });
      }
    }).observe({ type: 'react-native-mark', buffered: true });
  };
}

export default Performance;
