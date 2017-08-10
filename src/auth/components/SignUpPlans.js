import React from 'react';
import PropTypes from 'prop-types';
import {Link, Route} from 'react-router-dom';
import RouteWithSubRoutes from 'components/RouteWithSubRoutes';

function SignUpPlans({match, routes}) {
  return (
    <section>
      <Route exact path={match.url} render={() => (
        <div className='container' id='plans-signup'>
          <div className='title'>
            <h2>Select a plan</h2>
          </div>
          <div className='plan-group'>
            <table className='table table-bordered'>
              <tbody>
                <tr>
                  <td className='col-xs-3 has-bg' rowSpan='2'>&nbsp;</td>
                  <td colSpan='2' rowSpan='1' className='has-bg1'><h4 className='text-center plan-title'>For
                    Individuals</h4></td>
                  <td className='col-xs-3 has-bg1'><h4 className='text-center plan-title'>For Organizations</h4></td>
                </tr>
                <tr className='align-top'>
                  <td className='col-xs-3'>
                    <div className='signup-info select-plan'>
                      <h3>Starter</h3>
                      <p className='account-info'>Protect, Distribute, and Track Confidential Files For Individual
                        Professionals</p>
                      <div className='account-info-more'><h4>Free Forever</h4>1 user, 3 Files</div>
                      <Link className='btn btn-default' to={`${match.url}/starter`}>Sign Up</Link>
                      <p className='account-info-bottom'>Sign up for a Starter account and you'll be automatically
                        upgraded to Professional until August 2015.</p>
                    </div>
                  </td>
                  <td className='col-xs-3'>
                    <div className='signup-info select-plan'>
                      <h3>Professional</h3>
                      <p className='account-info'>Protect, Distribute, and Track Confidential Files For Individual
                        Professionals</p>
                      <div className='account-info-more'><h4>Free Until August 2015</h4>1 user, Unlimited Files</div>
                      <Link className='btn btn-default' to={`${match.url}/professional`}>Sign Up</Link>
                      <p className='account-info-bottom'>Professional accounts are free until August 2015.</p>
                    </div>
                  </td>
                  <td className='col-xs-3'>
                    <div className='signup-info select-plan'>
                      <h3 className='team-icon-users'>Teams</h3>
                      <p className='account-info'>Same Features as Professional but for Multi-User Accounts with Admin
                        Console</p>
                      <div className='account-info-more'><h4>30-Day Free Trial</h4>Minimum 3 Users, Unllimited Files</div>
                      <Link className='btn btn-default' to={`${match.url}/teams`}>Sign Up</Link>
                      <p className='account-info-bottom'>
                        or <br/><Link to={'/sign-up/switch-to-team'}>Switch from an existing account</Link>
                      </p>
                    </div>
                  </td>
                </tr>
                <tr className='has-bg'>
                  <td colSpan='4' className='row-header'>
                    <strong data-toggle='collapse' data-target='.plan-group-1'><span className='glyphicon glyphicon-triangle-bottom'>&nbsp;</span> Account</strong>
                  </td>
                </tr>
                <tr className='has-bg collapse in plan-group-1'>
                  <td>
                    <label>Number of Users</label>
                  </td>
                  <td>
                    <p className='text-center'>1</p>
                  </td>
                  <td>
                    <p className='text-center'>1</p>
                  </td>
                  <td>
                    <p className='text-center'>Min 3, Max Unlimited</p>
                  </td>
                </tr>
                <tr className='has-bg collapse in plan-group-1'>
                  <td>
                    <label>Number of Strung Files <span className='glyphicon glyphicon-info-sign'>&nbsp;</span></label>
                  </td>
                  <td>
                    <p className='text-center'>3</p>
                  </td>
                  <td>
                    <p className='text-center'>Unlimited</p>
                  </td>
                  <td>
                    <p className='text-center'>Unlimited</p>
                  </td>
                </tr>
                <tr className='has-bg collapse in plan-group-1'>
                  <td>
                    <label>Number of Received Files <span className='glyphicon glyphicon-info-sign'>&nbsp;</span></label>
                  </td>
                  <td>
                    <p className='text-center'>Unlimited</p>
                  </td>
                  <td>
                    <p className='text-center'>Unlimited</p>
                  </td>
                  <td>
                    <p className='text-center'>Unlimited</p>
                  </td>
                </tr>
                <tr className='has-bg collapse in plan-group-1'>
                  <td>
                    <label>Number of Recipients per User <span
                      className='glyphicon glyphicon-info-sign'>&nbsp;</span></label>
                  </td>
                  <td>
                    <p className='text-center'>50</p>
                  </td>
                  <td>
                    <p className='text-center'>100</p>
                  </td>
                  <td>
                    <p className='text-center'>100</p>
                  </td>
                </tr>
                <tr className='has-bg collapse in plan-group-1'>
                  <td>
                    <label>Maximum Strung File Size</label>
                  </td>
                  <td>
                    <p className='text-center'>5 Megabytes</p>
                  </td>
                  <td>
                    <p className='text-center'>2 Gigabytes</p>
                  </td>
                  <td>
                    <p className='text-center'>2 Gigabytes</p>
                  </td>
                </tr>
                <tr className='no-bg'>
                  <td colSpan='4' className='row-header'>
                    <strong data-toggle='collapse' data-target='.plan-group-2'><span className='glyphicon glyphicon-triangle-bottom'>&nbsp;</span> File Control Features</strong>
                  </td>
                </tr>
                <tr className='collapse in plan-group-2'>
                  <td>
                    <label>String files to control distribution</label>
                  </td>
                  <td>
                    <p className='text-center'><span className='glyphicon glyphicon-ok'>&nbsp;</span></p>
                  </td>
                  <td>
                    <p className='text-center'><span className='glyphicon glyphicon-ok'>&nbsp;</span></p>
                  </td>
                  <td>
                    <p className='text-center'><span className='glyphicon glyphicon-ok'>&nbsp;</span></p>
                  </td>
                </tr>
                <tr className='collapse in plan-group-2'>
                  <td>
                    <label>Prevent unauthorized viewing, printing, forwarding</label>
                  </td>
                  <td>
                    <p className='text-center'><span className='glyphicon glyphicon-ok'>&nbsp;</span></p>
                  </td>
                  <td>
                    <p className='text-center'><span className='glyphicon glyphicon-ok'>&nbsp;</span></p>
                  </td>
                  <td>
                    <p className='text-center'><span className='glyphicon glyphicon-ok'>&nbsp;</span></p>
                  </td>
                </tr>
                <tr className='collapse in plan-group-2'>
                  <td>
                    <label>Receive notifications when recipients view and print</label>
                  </td>
                  <td>
                    <p className='text-center'><span className='glyphicon glyphicon-ok'>&nbsp;</span></p>
                  </td>
                  <td>
                    <p className='text-center'><span className='glyphicon glyphicon-ok'>&nbsp;</span></p>
                  </td>
                  <td>
                    <p className='text-center'><span className='glyphicon glyphicon-ok'>&nbsp;</span></p>
                  </td>
                </tr>
                <tr className='collapse in plan-group-2'>
                  <td>
                    <label>View file tracking reports</label>
                  </td>
                  <td>
                    <p className='text-center'><span className='glyphicon glyphicon-ok'>&nbsp;</span></p>
                  </td>
                  <td>
                    <p className='text-center'><span className='glyphicon glyphicon-ok'>&nbsp;</span></p>
                  </td>
                  <td>
                    <p className='text-center'><span className='glyphicon glyphicon-ok'>&nbsp;</span></p>
                  </td>
                </tr>
                <tr className='collapse in plan-group-2'>
                  <td>
                    <label>Revoke or expire recipient access to files</label>
                  </td>
                  <td>
                    <p className='text-center'><span className='glyphicon glyphicon-ok'>&nbsp;</span></p>
                  </td>
                  <td>
                    <p className='text-center'><span className='glyphicon glyphicon-ok'>&nbsp;</span></p>
                  </td>
                  <td>
                    <p className='text-center'><span className='glyphicon glyphicon-ok'>&nbsp;</span></p>
                  </td>
                </tr>
                <tr className='collapse in plan-group-2'>
                  <td>
                    <label>Push file version updates that overwrite distributed copies</label>
                  </td>
                  <td>
                    <p className='text-center'><span className='glyphicon glyphicon-ok'>&nbsp;</span></p>
                  </td>
                  <td>
                    <p className='text-center'><span className='glyphicon glyphicon-ok'>&nbsp;</span></p>
                  </td>
                  <td>
                    <p className='text-center'><span className='glyphicon glyphicon-ok'>&nbsp;</span></p>
                  </td>
                </tr>
                <tr className='has-bg'>
                  <td colSpan='4' className='row-header'>
                    <strong data-toggle='collapse' data-target='.plan-group-3'><span className='glyphicon glyphicon-triangle-bottom'>&nbsp;</span> Security and Management</strong>
                  </td>
                </tr>
                <tr className='has-bg collapse in plan-group-3'>
                  <td>
                    <label>User Management <span className='glyphicon glyphicon-info-sign'>&nbsp;</span></label>
                  </td>
                  <td>
                    &nbsp;
                  </td>
                  <td>
                    &nbsp;
                  </td>
                  <td>
                    <p className='text-center'><span className='glyphicon glyphicon-ok'>&nbsp;</span></p>
                  </td>
                </tr>
                <tr className='has-bg collapse in plan-group-3'>
                  <td>
                    <label>Admin, Sender and Recipient User Types <span
                      className='glyphicon glyphicon-info-sign'>&nbsp;</span></label>
                  </td>
                  <td>
                    &nbsp;
                  </td>
                  <td>
                    &nbsp;
                  </td>
                  <td>
                    <p className='text-center'><span className='glyphicon glyphicon-ok'>&nbsp;</span></p>
                  </td>
                </tr>
                <tr className='has-bg collapse in plan-group-3'>
                  <td>
                    <label>Reassign File Ownership <span className='glyphicon glyphicon-info-sign'>&nbsp;</span></label>
                  </td>
                  <td>
                    &nbsp;
                  </td>
                  <td>
                    &nbsp;
                  </td>
                  <td>
                    <p className='text-center'><span className='glyphicon glyphicon-ok'>&nbsp;</span></p>
                  </td>
                </tr>
                <tr className='has-bg collapse in plan-group-3'>
                  <td>
                    <label>Reset Password(s) <span className='glyphicon glyphicon-info-sign'>&nbsp;</span></label>
                  </td>
                  <td>
                    <p className='text-center'><span className='glyphicon glyphicon-ok'>&nbsp;</span></p>
                  </td>
                  <td>
                    <p className='text-center'><span className='glyphicon glyphicon-ok'>&nbsp;</span></p>
                  </td>
                  <td>
                    <p className='text-center'><span className='glyphicon glyphicon-ok'>&nbsp;</span></p>
                  </td>
                </tr>
                <tr className='has-bg collapse in plan-group-3'>
                  <td>
                    <label>Unlink Devices <span className='glyphicon glyphicon-info-sign'>&nbsp;</span></label>
                  </td>
                  <td>
                    <p className='text-center'><span className='glyphicon glyphicon-ok'>&nbsp;</span></p>
                  </td>
                  <td>
                    <p className='text-center'><span className='glyphicon glyphicon-ok'>&nbsp;</span></p>
                  </td>
                  <td>
                    <p className='text-center'><span className='glyphicon glyphicon-ok'>&nbsp;</span></p>
                  </td>
                </tr>
                <tr className='no-bg'>
                  <td colSpan='4' className='row-header'>
                    <strong data-toggle='collapse' data-target='.plan-group-4'><span className='glyphicon glyphicon-triangle-bottom'>&nbsp;</span> Applications</strong>
                  </td>
                </tr>
                <tr className='collapse in plan-group-4'>
                  <td>
                    <label>Desktop Apps - Mac and Windows</label>
                  </td>
                  <td>
                    <p className='text-center'><span className='glyphicon glyphicon-ok'>&nbsp;</span></p>
                  </td>
                  <td>
                    <p className='text-center'><span className='glyphicon glyphicon-ok'>&nbsp;</span></p>
                  </td>
                  <td>
                    <p className='text-center'><span className='glyphicon glyphicon-ok'>&nbsp;</span></p>
                  </td>
                </tr>
                <tr className='collapse in plan-group-4'>
                  <td>
                    <label>Tablet Apps - iPad and Android</label>
                  </td>
                  <td>
                    <p className='text-center'><span className='glyphicon glyphicon-ok'>&nbsp;</span></p>
                  </td>
                  <td>
                    <p className='text-center'><span className='glyphicon glyphicon-ok'>&nbsp;</span></p>
                  </td>
                  <td>
                    <p className='text-center'><span className='glyphicon glyphicon-ok'>&nbsp;</span></p>
                  </td>
                </tr>
                <tr className='collapse in plan-group-4'>
                  <td>
                    <label>Smartphone Apps - iPhone and Android</label>
                  </td>
                  <td>
                    <p className='text-center'><span className='glyphicon glyphicon-ok'>&nbsp;</span></p>
                  </td>
                  <td>
                    <p className='text-center'><span className='glyphicon glyphicon-ok'>&nbsp;</span></p>
                  </td>
                  <td>
                    <p className='text-center'><span className='glyphicon glyphicon-ok'>&nbsp;</span></p>
                  </td>
                </tr>
                <tr className='collapse in plan-group-4'>
                  <td>
                    <label>Web Browser App</label>
                  </td>
                  <td>
                    <p className='text-center'><span className='glyphicon glyphicon-ok'>&nbsp;</span></p>
                  </td>
                  <td>
                    <p className='text-center'><span className='glyphicon glyphicon-ok'>&nbsp;</span></p>
                  </td>
                  <td>
                    <p className='text-center'><span className='glyphicon glyphicon-ok'>&nbsp;</span></p>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

        </div>
      )}/>
      <div id='plans-signup' className='container'>
        <div className='row'>
          <div className='col-sm-6'>
            {routes.map((r, i) => (
              <RouteWithSubRoutes {...r} key={i}/>
            ))}
          </div>
          <div className='col-sm-1'/>
          <div className='col-sm-5'>
            <Route path={`${match.url}/:planId`} render={(props) => (
              <div className='signup-info'>
                {props.match.params.planId === 'teams' && <h3 className='team-icon-users'>Teams</h3>}
                {props.match.params.planId === 'professional' && <h3>Professional</h3>}
                {props.match.params.planId === 'starter' && (
                  <div className='starter'>
                    <h3 className={props.match.params.planId === 'starter' && 'icon-starter'}>Starter</h3>
                    <h3>Professional</h3>
                  </div>
                )}
                <p className='account-info'>
                  {props.match.params.planId === 'teams' &&
                  <span>FileString for Multi-User Accounts<br/> with Admin Console</span>}
                  {props.match.params.planId !== 'teams' &&
                  <span>Protect, Distribute and Track <br/>Sensitive and Confidential Files <br/>For Individual Users</span>}
                </p>
                <div className='account-info-more'>
                  {props.match.params.planId === 'teams' &&
                  <div><h4>30-Day Free Trial</h4>Minimum 3 Users, Unlimited Files</div>}
                  {props.match.params.planId !== 'teams' &&
                  <div><h4>Free Until August 2015*</h4>1 user, Unlimited File</div>}
                </div>
                {props.match.params.planId === 'starter' &&
                <p className='info-note'>*If your usage in August 2015 exceeds the limits of a "Starter" plan, you will
                  be prompted for payment information for a "Professional" plan.</p>}
                {props.match.params.planId === 'professional' &&
                <p className='info-note'>*You will be prompted for payment information in August 2015</p>}
              </div>
            )}/>
          </div>
        </div>
      </div>
    </section>
  );
}

SignUpPlans.propTypes = {
  match: PropTypes.object,
  routes: PropTypes.arrayOf(PropTypes.object)
};

export default SignUpPlans;
