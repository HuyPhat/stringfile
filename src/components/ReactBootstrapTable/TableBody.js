import React, { Component, PropTypes } from 'react';
import classSet from 'classnames';
import Utils from 'react-bootstrap-table/lib/util';
import Const from 'react-bootstrap-table/lib/Const';
import TableBody from 'react-bootstrap-table/lib/TableBody';
import TableRow from './TableRow';
import TableColumn from 'react-bootstrap-table/lib/TableColumn';
import TableEditColumn from 'react-bootstrap-table/lib/TableEditColumn';
import ExpandComponent from 'react-bootstrap-table/lib/ExpandComponent';

export default class TableBodyWithContextMenu extends TableBody {

  onClickMenuItem = () => {

  }

  collectRow = (props) => {
    console.log(props);
  }

  render() {
    const { cellEdit, beforeShowError, x, y, keyBoardNav, trStyle, contextMenuId } = this.props;
    const tableClasses = classSet('table', {
      'table-striped': this.props.striped,
      'table-bordered': this.props.bordered,
      'table-hover': this.props.hover,
      'table-condensed': this.props.condensed
    }, this.props.tableBodyClass);

    const noneditableRows = (cellEdit.nonEditableRows && cellEdit.nonEditableRows()) || [];
    const unselectable = this.props.selectRow.unselectable || [];
    const isSelectRowDefined = this._isSelectRowDefined();
    const tableHeader = Utils.renderColGroup(this.props.columns,
      this.props.selectRow, this.props.expandColumnOptions);
    const inputType = this.props.selectRow.mode === Const.ROW_SELECT_SINGLE ? 'radio' : 'checkbox';
    const CustomComponent = this.props.selectRow.customComponent;
    const enableKeyBoardNav = (keyBoardNav === true || typeof keyBoardNav === 'object');
    const customEditAndNavStyle = typeof keyBoardNav === 'object'
      ? keyBoardNav.customStyleOnEditCell
      : null;
    const customNavStyle = typeof keyBoardNav === 'object'
      ? keyBoardNav.customStyle
      : null;
    const ExpandColumnCustomComponent = this.props.expandColumnOptions.expandColumnComponent;
    let expandColSpan = this.props.columns.filter(col => col && !col.hidden).length;
    if (isSelectRowDefined && !this.props.selectRow.hideSelectColumn) {
      expandColSpan += 1;
    }
    let tabIndex = 1;
    if (this.props.expandColumnOptions.expandColumnVisible) {
      expandColSpan += 1;
    }
    // if (contextMenu) {
    //   const contextMenuItem = contextMenu.items.map((item, i) => {
    //     return <MenuItem key={i} onClick={this.onClickMenuItem}>{item}</MenuItem>;
    //   });
    //   // const contextMenuTrigger = <ContextMenuTrigger id={contextMenu.id} collect={this.collectRow} />;
    // }
    let tableRows = this.props.data.map((data, r) => {
      const tableColumns = this.props.columns.filter(_ => _ !== null).map((column, i) => {
        const fieldValue = data[column.name];
        const isFocusCell = r === y && i === x;
        if (column.name !== this.props.keyField && // Key field can't be edit
          column.editable && // column is editable? default is true, user can set it false
          column.editable.readOnly !== true &&
          this.state.currEditCell !== null &&
          this.state.currEditCell.rid === r &&
          this.state.currEditCell.cid === i &&
          noneditableRows.indexOf(data[this.props.keyField]) === -1) {
          let editable = column.editable;
          const format = column.format ? (value) => {
            return column.format(value, data, column.formatExtraData, r).replace(/<.*?>/g, '');
          } : false;
          if (Utils.isFunction(column.editable)) {
            editable = column.editable(fieldValue, data, r, i);
          }

          return (
            <TableEditColumn
              completeEdit={ this.handleCompleteEditCell }
              // add by bluespring for column editor customize
              editable={ editable }
              customEditor={ column.customEditor }
              format={ column.format ? format : false }
              key={ i }
              blurToSave={ cellEdit.blurToSave }
              onTab={ this.handleEditCell }
              rowIndex={ r }
              colIndex={ i }
              row={ data }
              fieldValue={ fieldValue }
              className={ column.editClassName }
              invalidColumnClassName={ column.invalidEditColumnClassName }
              beforeShowError={ beforeShowError }
              isFocus={ isFocusCell }
              customStyleWithNav={ customEditAndNavStyle } />
          );
        } else {
          // add by bluespring for className customize
          let columnChild = fieldValue && fieldValue.toString();
          let columnTitle = null;
          let tdClassName = column.className;
          if (Utils.isFunction(column.className)) {
            tdClassName = column.className(fieldValue, data, r, i);
          }

          if (typeof column.format !== 'undefined') {
            const formattedValue = column.format(fieldValue, data, column.formatExtraData, r);
            if (!React.isValidElement(formattedValue)) {
              columnChild = (
                <div dangerouslySetInnerHTML={ { __html: formattedValue } } />
              );
            } else {
              columnChild = formattedValue;
              columnTitle = column.columnTitle && formattedValue ? formattedValue.toString() : null;
            }
          } else {
            columnTitle = column.columnTitle && fieldValue ? fieldValue.toString() : null;
          }
          return (
            <TableColumn key={ i }
              rIndex={ r }
              dataAlign={ column.align }
              className={ tdClassName }
              columnTitle={ columnTitle }
              cellEdit={ cellEdit }
              hidden={ column.hidden }
              onEdit={ this.handleEditCell }
              width={ column.width }
              onClick={ this.handleClickCell }
              attrs={ column.attrs }
              style={ column.style }
              tabIndex={ (tabIndex++) + '' }
              isFocus={ isFocusCell }
              keyBoardNav={ enableKeyBoardNav }
              onKeyDown={ this.handleCellKeyDown }
              customNavStyle={ customNavStyle }
              row={ data }
              withoutTabIndex={ this.props.withoutTabIndex }>
              { columnChild }
            </TableColumn>
          );
        }
      }, this);
      const key = data[this.props.keyField];
      const disable = unselectable.indexOf(key) !== -1;
      const selected = this.props.selectedRowKeys.indexOf(key) !== -1;
      const selectRowColumn = isSelectRowDefined && !this.props.selectRow.hideSelectColumn
        ? this.renderSelectRowColumn(selected, inputType, disable, CustomComponent, r, data) : null;
      const expandedRowColumn = this.renderExpandRowColumn(
        this.props.expandableRow && this.props.expandableRow(data),
        this.props.expanding.indexOf(key) > -1,
        ExpandColumnCustomComponent, r, data
      );
      const haveExpandContent = this.props.expandableRow && this.props.expandableRow(data);
      const isExpanding = haveExpandContent && this.props.expanding.indexOf(key) > -1;

      // add by bluespring for className customize
      let trClassName = this.props.trClassName;
      if (Utils.isFunction(this.props.trClassName)) {
        trClassName = this.props.trClassName(data, r);
      }
      if (isExpanding && this.props.expandParentClass) {
        trClassName += Utils.isFunction(this.props.expandParentClass)
          ? this.props.expandParentClass(data, r)
          : this.props.expandParentClass;
      }

      const result = [<TableRow isSelected={ selected } key={ key } className={ trClassName }
        id={key}
        index={ r }
        row={ data }
        contextMenuId={contextMenuId}
        selectRow={ isSelectRowDefined ? this.props.selectRow : undefined }
        enableCellEdit={ cellEdit.mode !== Const.CELL_EDIT_NONE }
        onRowClick={ this.handleRowClick }
        onRowDoubleClick={ this.handleRowDoubleClick }
        onRowMouseOver={ this.handleRowMouseOver }
        onRowMouseOut={ this.handleRowMouseOut }
        onSelectRow={ this.handleSelectRow }
        onExpandRow={ this.handleClickCell }
        unselectableRow={ disable }
        style={ trStyle }>
        { this.props.expandColumnOptions.expandColumnVisible &&
                this.props.expandColumnOptions.expandColumnBeforeSelectColumn &&
                expandedRowColumn }
        { selectRowColumn }
        { this.props.expandColumnOptions.expandColumnVisible &&
                !this.props.expandColumnOptions.expandColumnBeforeSelectColumn &&
                expandedRowColumn }
        { tableColumns }
      </TableRow>];

      if (haveExpandContent) {
        const expandBodyClass = Utils.isFunction(this.props.expandBodyClass)
          ? this.props.expandBodyClass(data, r, isExpanding)
          : this.props.expandBodyClass;
        result.push(
          <ExpandComponent
            key={ key + '-expand' }
            row={ data }
            className={ expandBodyClass }
            bgColor={ this.props.expandRowBgColor || this.props.selectRow.bgColor || undefined }
            hidden={ !isExpanding }
            colSpan={ expandColSpan }
            width={ '100%' }>
            { this.props.expandComponent(data) }
          </ExpandComponent>
        );
      }
      return (result);
    }, this);

    if (tableRows.length === 0 && !this.props.withoutNoDataText) {
      const colSpan = this.props.columns.filter(c => !c.hidden).length +
        ((isSelectRowDefined && !this.props.selectRow.hideSelectColumn) ? 1 : 0) +
        (this.props.expandColumnOptions.expandColumnVisible ? 1 : 0);
      tableRows = [
        <TableRow key='##table-empty##' style={ trStyle }>
          <td data-toggle='collapse'
            colSpan={ colSpan }
            className='react-bs-table-no-data'>
            { this.props.noDataText || Const.NO_DATA_TEXT }
          </td>
        </TableRow>
      ];
    }

    return (
      <div ref='container'
        className={ classSet('react-bs-container-body', this.props.bodyContainerClass) }
        style={ this.props.style }>
        <table className={ tableClasses }>
          { React.cloneElement(tableHeader, { ref: 'header' }) }
          <tbody ref='tbody'>
            { tableRows }
          </tbody>
        </table>
      </div>
    );
  }
}
