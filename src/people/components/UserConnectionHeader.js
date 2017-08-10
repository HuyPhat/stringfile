import React, { Component } from 'react';
import PropTypes from 'prop-types';

export default function PeopleInfo(props) {
  const menuBtnClass = props.expanded ? 'menu-btn reversed' : 'menu-btn';
  const { people, sent, received } = props;
  return (
    <div className='accordion-toggle people-info'>
      <span>
        <span className='avatar sm display'>{people.name ? people.name[0] : people.email[0]}</span>
        <span className='name'>
          <p>
            {people.name &&
              <strong>{people.name}</strong>
            }
            {people.email}
          </p>
        </span>
        <a className='sent'>{sent}</a>
        <a className='received disabled'>{received}</a>
        <a className={menuBtnClass}/>
      </span>
    </div>
  );
}
PeopleInfo.propTypes = {
  people: PropTypes.obj,
  sent: PropTypes.number,
  received: PropTypes.number
};
