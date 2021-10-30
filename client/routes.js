import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import { withRouter, Route, Switch, Redirect } from 'react-router-dom';
import Main from './components/Main';
// import { me } from './store';

/**
 * COMPONENT
 */
class Routes extends Component {
  componentDidMount() {}

  render() {
    return (
      <Fragment>
        <Switch>
          <Route path="/map" component={Main} />
          <Redirect to="/map" />
        </Switch>
      </Fragment>
    );
  }
}

/**
 * CONTAINER
 */
// const mapState = (state) => {
//   return {
//     // Being 'logged in' for our purposes will be defined has having a state.auth that has a truthy id.
//     // Otherwise, state.auth will be an empty object, and state.auth.id will be falsey
//     isLoggedIn: !!state.auth.id,
//   };
// };

// const mapDispatch = (dispatch) => {
//   return {
//     loadInitialData() {
//       dispatch(me());
//     },
//   };
// };

// The `withRouter` wrapper makes sure that updates are not blocked
// when the url changes
export default withRouter(Routes);
// export default withRouter(connect(mapState, mapDispatch)(Routes));
