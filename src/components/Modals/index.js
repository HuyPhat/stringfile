import React from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import StringFileModal from 'files/components/StringFileModal';
import NewFolderModal from 'files/components/NewFolderModal';
import FilterPeopleModal from 'people/components/FilterPeopleModal';

const MODAL_COMPONENTS = {
  STRING_FILE_MODAL: StringFileModal,
  NEW_FOLDER_MODAL: NewFolderModal,
  FILTER_PEOPLE_MODAL: FilterPeopleModal
  /* other modals */
};

class ModalRoot extends React.Component {

  render() {
    const { modalName, modalProps, ActiveModal } = this.props.rootModal;
    if (!ActiveModal) {
      return null;
    }
    return (
      <ActiveModal modalName={modalName} {...modalProps} />
    );
  }

}
// const ModalRoot = ({ modalType, modalProps }) => {
//   if (!modalType) {
//     return null;
//   }

//   const SpecificModal = MODAL_COMPONENTS[modalType];
//   return <SpecificModal modalProps={{...modalProps}} modalType={modalType} />;
// };

ModalRoot.propTypes = {
  rootModal: PropTypes.object
};

export default connect(state => ({
  rootModal: state.componentReducer.rootModal
}))(ModalRoot);
