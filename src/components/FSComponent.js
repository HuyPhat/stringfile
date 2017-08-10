import React from 'react';
import PropTypes from 'prop-types';

const TEXT = {
  sent: 'Sent',
  reshared: 'Re-Shared',
  received: 'Received',
  unique_recipients: 'Unique Recipients',
  job_title: 'Job Title',
  joined: 'Joined',
  resend_email: 'Resend email success.',
  new_email_address: 'New Email Address',
  resend_invitation: 'Resend Invitation',
  invitation_sent: 'Invitation Sent',
  verificaton_email_sent: 'Verification Email Sent',
  resend_vefification: 'Resend Verification Email',
  new_password_requested: 'New Password Requested',
  password_last_changed: 'Password Last Changed',
  resend_password_request: 'Resend Request',
  status: 'Status',
  role: 'Role',
  created: 'Created',
  first_name: 'First Name',
  last_name: 'Last Name',
  email_address: 'Email Address',
  select_user_type: 'Select User Type',
  type: 'Type',
  items_num: 'Number of items',
  last_modified: 'Last Modified',
  last_updated: 'Last Updated',
  name: 'Name',
  details: 'Details',
  size: 'Size',
  owner: 'Owner',
  created_time: 'Created',
  last_push_updated: 'Last Push Updated',
  last_shared: 'Last Shared',
  last_viewed: 'Last Viewed',
  views: 'Views',
  viewers: 'Viewers',
  total_view_time: 'Total View Time',
  average_view_time: 'Average View Time',
  link_copied_clipboard: 'Link copied to clipboard.',
  copy_to_clipboard: 'Copy to clipboard',
  only_specified_access: 'Only sepecified recipients can access',
  recipient: 'Recipient',
  delete_folder_question: 'Delete this folder?',
  delete: 'Delete',
  cancel: 'Cancel',
  folder_input_label: 'Folder Name',
  file_input_label: 'File Name',
  create: 'Create',
  folder_name_required: 'Folder name is required.',
  rename: 'Rename',
  shared_to: 'Shared to'
};

export default class FSComponent extends React.Component {
    static defaultProps = {

    }
    constructor(props, text) {
      super(props);
      this.text = Object.assign(TEXT, text);
    }
}

