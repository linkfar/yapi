import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Route, BrowserRouter as Router } from 'react-router-dom';
import { Home, Group, Project, Follows, AddProject, Login } from './containers/index';
import { Alert } from 'antd';
import User from './containers/User/User.js';
import Header from './components/Header/Header';
import Footer from './components/Footer/Footer';
import Loading from './components/Loading/Loading';
import MyPopConfirm from './components/MyPopConfirm/MyPopConfirm';
import { checkLoginState } from './reducer/modules/user';
import { requireAuthentication } from './components/AuthenticatedComponent';

const LOADING_STATUS = 0;

const alertContent = () => {
  const ua = window.navigator.userAgent,
        isChrome = ua.indexOf("Chrome") && window.chrome;
  if (!isChrome) {
    return <Alert style={{zIndex: 99}} message={'YApi 的接口测试等功能仅支持 Chrome 浏览器，请使用 Chrome 浏览器获得完整功能。'} banner closable />
  }
}

@connect(
  state => {
    return {
      loginState: state.user.loginState
    };
  },
  {
    checkLoginState
  }
)
export default class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      login: LOADING_STATUS
    };
  }

  static propTypes = {
    checkLoginState: PropTypes.func,
    loginState: PropTypes.number
  };


  componentDidMount() {
    this.props.checkLoginState();
  }

  route = (status) => {
    let r;
    if (status === LOADING_STATUS) {
      return <Loading visible />;
    } else {
      r = (
        <Router getUserConfirmation={(msg, callback) => {
          // 自定义 window.confirm
          // http://reacttraining.cn/web/api/BrowserRouter/getUserConfirmation-func
          let container = document.createElement('div');
          document.body.appendChild(container);
          ReactDOM.render((
            <MyPopConfirm msg={msg} callback={callback} />
          ), container);
        }}>
          <div className="g-main">
            <div className="router-main">
              {alertContent()}
              {this.props.loginState !== 1 ? <Header /> : null}
              <div className="router-container">
                <Route exact path="/" component={Home} />
                <Route path="/group" component={requireAuthentication(Group)} />
                <Route path="/project/:id" component={requireAuthentication(Project)} />
                <Route path="/user" component={requireAuthentication(User)} />
                <Route path="/follow" component={requireAuthentication(Follows)} />
                <Route path="/add-project" component={requireAuthentication(AddProject)} />
                <Route path="/login" component={Login} />
              </div>
            </div>
            <Footer/>
          </div>
        </Router>

      )
    }
    return r;
  }

  render() {
    return this.route(this.props.loginState);
  }
}
