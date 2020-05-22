import { NativeModules } from 'react-native';

// const { RosenModule } = NativeModules;
const { TodoList } = NativeModules;

function addCalendar() {}

function cancelCalendar() {}

function pay(params, res) {}

function addWithCallback(params, res) {
  TodoList.addWithCallback(params, res);
}

module.exports = {
  addCalendar,
  cancelCalendar,
  pay,
  addWithCallback,
};
