import { NativeModules } from 'react-native';

const { RosenModule } = NativeModules;

function addCalendar(params, res) {
  RosenModule.addCalendar(params, res);
}

function cancelCalendar(res) {
  RosenModule.deleteCalendar(res);
}

// 支付
function pay(params, res) {
  RosenModule.pay(params, res);
}

module.exports = {
  addCalendar,
  cancelCalendar,
  pay,
};
