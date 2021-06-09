import { ValueMonitor } from '../stores/ValueMonitor';
import useObservable from './useObservable';

export function useMonitor<T>(monitor: ValueMonitor<T>): T {
  return useObservable(monitor.getState(), monitor.getValue());
}

export default useMonitor;
