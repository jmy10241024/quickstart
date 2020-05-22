import {Easing, Animated, StyleSheet, Platform} from 'react-native';
import {connect} from 'react-redux';
import {
  StackActions,
  createStackNavigator,
  createAppContainer,
  createSwitchNavigator,
} from 'react-navigation';
import {createReduxContainer} from 'react-navigation-redux-helpers';
import CardStackStyleInterpolator from 'react-navigation-stack/src/views/StackView/StackViewStyleInterpolator';

import AuthLoading from '~/pages/AuthLoading.js';
import UI from '~/modules/UI';

// import CallNativeIos from '~/pages/MainNavigator/CallNativeIos'; // 调用原生

import PageLogin from '~/pages/LoginNavigator/PageLogin';
import PageRegister from '~/pages/LoginNavigator/PageRegister';
import TabNavigator from '~/pages/MainNavigator/TabNavigator';
// import PageBookCover from '~/pages/MainNavigator/PageBookCover';
// import BookReading from '~/pages/MainNavigator/BookReading';
// import BookQuiz from '~/pages/MainNavigator/BookQuiz';
// import BookSort from '~/pages/MainNavigator/BookSort';
// import WordLearn from '~/pages/MainNavigator/WordLearn';
// import WordStudy from '~/pages/MainNavigator/WordLearn/WordStudy';
// import WordPractice from '~/pages/MainNavigator/WordLearn/WordPractice';
// import PracticeReport from '~/pages/MainNavigator/WordLearn/PracticeReport';
// import ExamPractice from '~/pages/MainNavigator/WordLearn/ExamPractice';
// import ExamList from '~/pages/MainNavigator/WordLearn/ExamList';
// import ExamDetail from '~/pages/MainNavigator/WordLearn/ExamDetail';
// import QuestionDetail from '~/pages/MainNavigator/WordLearn/QuestionDetail';
// import EditUserInfo from '~/pages/MainNavigator/Settings/EditUserInfo'; // 编辑资料页面
// import UnitWords from '~/pages/MainNavigator/WordLearn/UnitWords';
// import AvatarChange from '~/pages/MainNavigator/Settings/EditUserInfo/AvatarChange'; // 换头像页面
// import CreditCalendar from '~/pages/MainNavigator/TabNavigator/Learn/pages/CreditCalendar'; // 积分日历
// import Rank from '~/pages/MainNavigator/TabNavigator/Learn/pages/Rank'; // 排行榜
// import NewWords from '~/pages/MainNavigator/TabNavigator/Learn/pages/NewWords'; // 生词本
// import WordDetail from '~/pages/MainNavigator/TabNavigator/Learn/pages/WordDetail'; // 单词详情
// import StudyReport from '~/pages/MainNavigator/TabNavigator/Learn/pages/StudyReport'; // 学习模块的学习报告
// import HistoryRecord from '~/pages/MainNavigator/TabNavigator/Learn/pages/HistoryRecord'; // 历史记录
// import CodeScan from '~/pages/MainNavigator/TabNavigator/Parental/CodeScan'; // 扫一扫页面
// import SettingsList from '~/pages/MainNavigator/Settings/SettingsList'; // 设置页面
// import ChangePwd from '~/pages/MainNavigator/Settings/SettingsList/ChangePwd'; // 修改密码
// import FeedBack from '~/pages/MainNavigator/Settings/SettingsList/FeedBack'; // 意见反馈
// import ContactUs from '~/pages/MainNavigator/Settings/SettingsList/ContactUs'; // 联系客服
// import AboutUs from '~/pages/MainNavigator/Settings/SettingsList/AboutUs'; // 关于我们
// import NickChange from '~/pages/MainNavigator/Settings/EditUserInfo/NickChange'; // 修改昵称
// import PurchaseRecording from '~/pages/MainNavigator/TabNavigator/Parental/PurchaseRecording'; // 购买记录
// import PageOrder from '~/pages/MainNavigator/PageOrder'; // 订单
// import GradeSelect from '~/pages/MainNavigator/GradeSelect'; // 选择年级
// import MyWeb from '~/pages/MainNavigator/TabNavigator/Parental/CodeScan/MyWeb'; // webView页面
// import VocabularyGps from '~/pages/MainNavigator/TabNavigator/Learn/pages/VocabularyGps'; // 词汇gps
// import LandspaceStudyTimeChart from '~/pages/MainNavigator/TabNavigator/Learn/pages/LandspaceStudyTimeChart'; // 横屏折线图
// import PageMap from '~/pages/MainNavigator/PageMap'; // 地图
// import MapSearch from '~/pages/MainNavigator/MapSearch'; // 位置搜索
// import VocabularyList from '~/pages/MainNavigator/TabNavigator/Learn/pages/VocabularyGps/VocabularyList'; // 词汇列表
// import ExchangeCode from '~/pages/MainNavigator/TabNavigator/Parental/ExchangeCode'; // 兑换码页面
// import BannerDetail from '~/pages/MainNavigator/TabNavigator/Lesson/BannerDetail'; // banner详情

const TransitionConfiguration = () => ({
  screenInterpolator: (sceneProps) => {
    const {scene} = sceneProps;
    const {route} = scene;
    const params = route.params || {};
    const transition = params.transition || 'forHorizontal'; // forVertical
    return CardStackStyleInterpolator[transition](sceneProps);
  },
  transitionSpec: {
    duration: 200,
    easing: Easing.linear,
    timing: Animated.timing,
  },
});

// 登录模块路由
const LoginNavigator = createStackNavigator(
  {
    pageLogin: {screen: PageLogin},
    pageRegister: {screen: PageRegister},
  },
  {
    initialRouteName: 'pageRegister',
    headerMode: 'screen',
    mode: 'card',
    headerLayoutPreset: 'center',
    navigationOptions: {
      gesturesEnabled: false,
      headerStyle: {
        elevation: 0,
        shadowOpacity: 0,
      },
    },
  },
);

export const MainNavigator = createStackNavigator(
  {
    tab: {screen: TabNavigator},
    // cover: { screen: PageBookCover },
    // reading: { screen: BookReading },
    // quiz: { screen: BookQuiz },
    // sort: { screen: BookSort },
    // word: { screen: WordLearn },
    // study: { screen: WordStudy },
    // practice: { screen: WordPractice },
    // examPractice: { screen: ExamPractice },
    // practiceReport: { screen: PracticeReport },
    // examList: { screen: ExamList },
    // examDetail: { screen: ExamDetail },
    // questionDetail: { screen: QuestionDetail },
    // editUserInfo: { screen: EditUserInfo },
    // unitWords: { screen: UnitWords },
    // avatarChange: { screen: AvatarChange },
    // creditCalendar: { screen: CreditCalendar },
    // rank: { screen: Rank },
    // newWords: { screen: NewWords },
    // wordDetail: { screen: WordDetail },
    // studyReport: { screen: StudyReport },
    // codeScan: { screen: CodeScan },
    // settingsList: { screen: SettingsList },
    // changePwd: { screen: ChangePwd },
    // feedBack: { screen: FeedBack },
    // contactUs: { screen: ContactUs },
    // nickChange: { screen: NickChange },
    // purchaseRecording: { screen: PurchaseRecording },
    // order: { screen: PageOrder },
    // historyRecord: { screen: HistoryRecord },
    // grade: { screen: GradeSelect },
    // myWeb: { screen: MyWeb },
    // vocabularyGps: { screen: VocabularyGps },
    // map: { screen: PageMap },
    // mapSearch: { screen: MapSearch },
    // landspaceChart: { screen: LandspaceStudyTimeChart },
    // vocabularyList: { screen: VocabularyList },
    // callNativeIos: { screen: CallNativeIos },
    // exchangeCode: { screen: ExchangeCode },
    // bannerDetail: { screen: BannerDetail },
    // aboutUs: { screen: AboutUs },
  },
  {
    initialRouteName: 'tab',
    headerMode: 'float',
    mode: 'card',
    transitionConfig: TransitionConfiguration,
    headerLayoutPreset: 'center',
    navigationOptions: {
      gesturesEnabled: true,
    },
    defaultNavigationOptions: {
      headerStyle: {
        height: UI.size.statusBarHeight + UI.scaleSize(50),
        paddingTop: UI.size.statusBarHeight,
      },
    },
  },
);

const appRouteParams = {
  initialRouteName: 'auth',
  headerMode: 'none',
  mode: 'modal',
  headerLayoutPreset: 'center',
};
export const AppNavigator = createSwitchNavigator(
  {
    login: {screen: LoginNavigator},
    main: {screen: MainNavigator},
    auth: {screen: AuthLoading},
  },
  appRouteParams,
);

// 处理一个页面重复跳转的问题
const navigateOnce = (getStateForAction) => (action, lastState) => {
  const {type, routeName, params} = action;
  //此处需要注意，使用了createSwitchNavigator后，lastState.routes[lastState.routes.length - 1]拿不到我们想要的那个对象
  const mainStackRoutes =
    lastState && lastState.routes.find((item) => item.key === 'main'); //拿到我们想要的那个对象

  return mainStackRoutes &&
  type === StackActions.PUSH && //此处原先使用NavigationActions.NAVIGATE
    routeName ===
      mainStackRoutes.routes[mainStackRoutes.routes.length - 1].routeName &&
    JSON.stringify(params) ===
      JSON.stringify(
        mainStackRoutes.routes[mainStackRoutes.routes.length - 1].params,
      )
    ? null
    : getStateForAction(action, lastState);
};

//使用，MainNavigator是主导航页面通过createAppContainer方法的返回值
AppNavigator.router.getStateForAction = navigateOnce(
  AppNavigator.router.getStateForAction,
);

const App = createReduxContainer(AppNavigator);
const mapStateToProps = (state) => ({
  state: state.nav,
});
const AppWithNavigationState = connect(mapStateToProps)(App);

export default AppWithNavigationState;
