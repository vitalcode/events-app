import Config from "react-native-config";

export default function Logger(context) {
  function log(fn, ...message) {
    Config.logger === 'true' && fn(`%c${context}`, "font-weight: bold", ...message);
  }
  return {
    debug(...message) {
      log(console.debug, ...message);
    },
    info(...message) {
      log(console.info, ...message);
    },
    warn(...message) {
      log(console.warn, ...message);
    },
    error(...message) {
      log(console.error, ...message);
    },
    log(...message) {
      log(console.log, ...message);
    }
  }
}
