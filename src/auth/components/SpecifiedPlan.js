import React from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import ConnectedSignUpForm from 'auth/containers/ConnectedSignUpForm';
import Alert from 'components/Alert';
import { connect } from 'react-redux';
import actions from 'auth/actions';
import { bindActionCreators } from 'redux';

const headerColor = '#2b5a94';
const errorColor = '#FF0000';

function SpecifiedPlan({className, match, errorMessage, action, successSignedUp}) {
  return (
    <section id='sign-up-starter' className={className}>
      {errorMessage && <Alert onClose={() => action.resetSignUp({})}>{errorMessage}</Alert>}
      <h2>{match.path === '/sign-up/switch-to-team' && 'Switching to a team account'}</h2>
      <h2>{match.path !== '/sign-up/switch-to-team' && !successSignedUp && 'Set up your account'}</h2>
      {/*<h2>{match.path === '/sign-up/switch-to-team' ? 'Switching to a team account' : 'Set up your account'}</h2>*/}
      {match.path === '/sign-up/teams' &&
        <div><p>You are signing up for a team account. As the owner of this account, you will be able to add additional users to the account and control their access to the FileString service. <br/><br/>(<Link to='/sign-up/switch-to-team'>Switch from an existing account?</Link>)</p><p><strong>About you</strong></p></div>
      }
      {match.path === '/sign-up/switch-to-team' &&
      <div>
        <p>You are switching from an existing account to a team account. As the owner of this account, you will be able to add additional users to the account and control their access to the FileString service.</p>
        <p>All files from your existing account will be moved to your team account.</p>
      </div>
      }
      <ConnectedSignUpForm path={match.path}/>
    </section>
  );
}

SpecifiedPlan.propTypes = {
  className: PropTypes.string,
  match: PropTypes.object,
  errorMessage: PropTypes.string,
  action: PropTypes.object,
  successSignedUp: PropTypes.bool
};

const mapStateToProps = state => {
  return {
    errorMessage: (state.signupReducer.error === 3 || state.signupReducer.error === 5) ? 'Someone has registered with this email.' : '',
    successSignedUp: !state.signupReducer.error && (state.signupReducer.payload === 1 || state.signupReducer.payload === 2)
  };
};

const mapDispatchToProps = (dispatch, ownProps) => ({
  action: bindActionCreators({resetSignUp: actions.resetSignUp}, dispatch)
});

export default connect(mapStateToProps, mapDispatchToProps)(styled(SpecifiedPlan)`
  h2 {
    margin: 0 0 15px 0;
    padding: 20px 0 0;
    color: ${headerColor};
  }
  .has-error {
    .form-control {
      border-color: ${errorColor};
      ::-webkit-input-placeholder { /* WebKit, Blink, Edge */
        color:    ${errorColor};
      }
      :-moz-placeholder { /* Mozilla Firefox 4 to 18 */
         color:    ${errorColor};
         opacity:  1;
      }
      ::-moz-placeholder { /* Mozilla Firefox 19+ */
         color:    ${errorColor};
         opacity:  1;
      }
      :-ms-input-placeholder { /* Internet Explorer 10-11 */
         color:    ${errorColor};
      }
      ::-ms-input-placeholder { /* Microsoft Edge */
         color:    ${errorColor};
      }
    }
    .help-block {
      color: ${errorColor};
    }
  }
`);
