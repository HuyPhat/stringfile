/* eslint no-nested-ternary: 0 */
import React, { Component, PropTypes } from 'react';
import classSet from 'classnames';
import Utils from 'react-bootstrap-table/lib/util';
import TableRow from 'react-bootstrap-table/lib/TableRow';
import { ContextMenuTrigger } from 'react-contextmenu';
export default class FSTableRow extends TableRow {
  collectRow = (props) => {
    return {row: props.children[3][0].props.row};
  }

  rowClick = e => {
    const rowIndex = this.props.index + 1;
    const cellIndex = e.target.cellIndex;
    if (this.props.onRowClick) {this.props.onRowClick(rowIndex, cellIndex);}
    const { selectRow, unselectableRow, isSelected, onSelectRow, onExpandRow } = this.props;
    if (selectRow) {
      if (selectRow.clickToSelect && !unselectableRow) {
        onSelectRow(rowIndex, !isSelected, e);
      } else if (selectRow.clickToSelectAndEditCell && !unselectableRow) {
        this.clickNum++;
        /** if clickToSelectAndEditCell is enabled,
         *  there should be a delay to prevent a selection changed when
         *  user dblick to edit cell on same row but different cell
        **/
        setTimeout(() => {
          if (this.clickNum === 1) {
            onSelectRow(rowIndex, !isSelected, e);
            onExpandRow(rowIndex, cellIndex);
          }
          this.clickNum = 0;
        }, 200);
      } else {
        this.expandRow(rowIndex, cellIndex);
      }
    }
  }

  render() {
    this.clickNum = 0;
    const { selectRow, row, isSelected, className, index, contextMenuId, id } = this.props;
    let { style } = this.props;
    let backgroundColor = null;
    let selectRowClass = null;

    if (selectRow) {
      backgroundColor = Utils.isFunction(selectRow.bgColor)
        ? selectRow.bgColor(row, isSelected) : (isSelected ? selectRow.bgColor : null);

      selectRowClass = Utils.isFunction(selectRow.className)
        ? selectRow.className(row, isSelected) : (isSelected ? selectRow.className : null);
    }

    if (Utils.isFunction(style)) {
      style = style(row, index);
    } else {
      style = { ...style } || {};
    }
    // the bgcolor of row selection always overwrite the bgcolor defined by global.
    if (style && backgroundColor && isSelected) {
      style.backgroundColor = backgroundColor;
    }
    const trCss = {
      style: { ...style },
      className: classSet(selectRowClass, className)
    };

    if (contextMenuId) {
      return <ContextMenuTrigger renderTag='tr' id={contextMenuId}
        attributes={{onMouseOver: this.rowMouseOver,
          onMouseOut: this.rowMouseOut,
          onClick: this.rowClick,
          onDoubleClick: this.rowDoubleClick,
          id: id,
          ...trCss}}
        collect={ this.collectRow }
      >{ this.props.children }

      </ContextMenuTrigger>;
    } else {
      return <tr { ...trCss }
        onMouseOver={ this.rowMouseOver }
        onMouseOut={ this.rowMouseOut }
        onClick={ this.rowClick }
        onDoubleClick={ this.rowDoubleClick }>{ this.props.children }</tr>;
    }

  }

}
