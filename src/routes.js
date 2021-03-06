import UserProfile from "views/UserProfile.jsx";
import Login from "views/Login.jsx";
import Expired from "views/Expired.jsx";
import Dashboard from "views/Dashboard.jsx";
import ForgotPassword from "views/ForgotPassword.jsx";
import Descriptive from "views/EsDescriptive.jsx";
import About from "views/About.jsx";
import icons from "views/Icons.jsx";
import CorrelationRegression from "views/CorrelationRegression.jsx";
import Probability from "views/Probability.jsx";
import Talk from "views/Talk.jsx";
var defaultMessage = localStorage.getItem('defaultLanguage') !== 'pt-br' ? require('./locales/en-us.js') : require('./locales/pt-br.js');

var routes = [
  {
    path: "/dashboard",
    name: defaultMessage.Menu.Dash,
    icon: "tim-icons icon-chart-pie-36",
    component: Dashboard,
    layout: "/admin"
  },
  {
    path: "/descriptive",
    name: defaultMessage.Descriptive.title,
    icon: "tim-icons icon-notes",
    component: Descriptive,
    layout: "/admin"
  },
  {
    path: "/Probability",
    name: defaultMessage.Probability.title,
    icon: "tim-icons icon-chart-bar-32",
    component: Probability,
    layout: "/admin"
  },
  {
    path: "/CorrelationRegression",
    name: defaultMessage.Menu.Correg,
    icon: "tim-icons icon-vector",
    component: CorrelationRegression,
    layout: "/admin"
  },
  {
    path: "/icons",
    name: "Dashboard",
    icon: "tim-icons icon-chart-pie-36",
    component: icons,
    layout: "/admin",
    invisible: true
  },
  {
    path: "/login",
    name: "Log In",
    rtlName: "ملف تعريفي للمستخدم",
    icon: "tim-icons icon-single-02",
    component: Login,
    layout: "/auth",
    invisible: true
  },
  {
    path: "/about",
    name: "About",
    icon: "tim-icons icon-single-02",
    component: About,
    layout: "/auth",
    invisible: true
  },
  {
    path: "/talkwithus",
    name: "Talk with us",
    icon: "tim-icons icon-single-02",
    component: Talk,
    layout: "/auth",
    invisible: true
  },
  {
    path: "/forgotpassword",
    name: "Forgot my password",
    icon: "tim-icons icon-single-02",
    component: ForgotPassword,
    layout: "/auth",
    invisible: true
  }, {
    path: "/expired",
    component: Expired,
    layout: "/auth",
    invisible: true
  },
  {
    path: "/user-profile",
    name: defaultMessage.Menu.profile,
    component: UserProfile,
    layout: "/admin",
    invisible: true
  }
];

export default routes;