import React from 'react';
import classSet from 'classnames';
import { BootstrapTable } from 'react-bootstrap-table';
import Const from 'react-bootstrap-table/lib/Const';
import TableHeader from 'react-bootstrap-table/lib/TableHeader';
import PaginationList from 'react-bootstrap-table/lib/pagination/PaginationList';
import ToolBar from 'react-bootstrap-table/lib/toolbar/ToolBar';
import TableFilter from 'react-bootstrap-table/lib/TableFilter';
import { TableDataStore } from 'react-bootstrap-table/lib/store/TableDataStore';
import Util from 'react-bootstrap-table/lib/util';
import exportCSVUtil from 'react-bootstrap-table/lib/csv_export_util';
import { Filter } from 'react-bootstrap-table/lib/Filter';
import TableHeaderColumn from 'react-bootstrap-table/lib/TableHeaderColumn';
import TableBodyWithContextMenu from './TableBody';
const TableBody = TableBodyWithContextMenu;
export default class FSTable extends BootstrapTable {
  render() {
    const style = {
      height: this.props.height,
      maxHeight: this.props.maxHeight
    };

    const columns = this.getColumnsDescription(this.props);
    const sortList = this.store.getSortInfo();
    const pagination = this.renderPagination();
    const toolBar = this.renderToolBar();
    const tableFilter = this.renderTableFilter(columns);
    const isSelectAll = this.isSelectAll();
    const expandColumnOptions = this.props.expandColumnOptions;
    if (typeof expandColumnOptions.expandColumnBeforeSelectColumn === 'undefined') {
      expandColumnOptions.expandColumnBeforeSelectColumn = true;
    }
    const colGroups = Util.renderColGroup(columns, this.props.selectRow, expandColumnOptions);
    let sortIndicator = this.props.options.sortIndicator;
    if (typeof this.props.options.sortIndicator === 'undefined') {sortIndicator = true;}
    const { paginationPosition = Const.PAGINATION_POS_BOTTOM } = this.props.options;
    const showPaginationOnTop = paginationPosition !== Const.PAGINATION_POS_BOTTOM;
    const showPaginationOnBottom = paginationPosition !== Const.PAGINATION_POS_TOP;
    const selectRow = { ...this.props.selectRow };
    if (this.props.cellEdit && this.props.cellEdit.mode !== Const.CELL_EDIT_NONE) {
      selectRow.clickToSelect = false;
    }

    return (
      <div className={ classSet('react-bs-table-container', this.props.className, this.props.containerClass) }
        style={ this.props.containerStyle }>
        { toolBar }
        { showPaginationOnTop ? pagination : null }
        <div ref='table'
          className={ classSet('react-bs-table', { 'react-bs-table-bordered': this.props.bordered }, this.props.tableContainerClass) }
          style={ { ...style, ...this.props.tableStyle } }
          onMouseEnter={ this.handleMouseEnter }
          onMouseLeave={ this.handleMouseLeave }>
          <TableHeader
            ref='header'
            colGroups={ colGroups }
            headerContainerClass={ this.props.headerContainerClass }
            tableHeaderClass={ this.props.tableHeaderClass }
            style={ this.props.headerStyle }
            rowSelectType={ this.props.selectRow.mode }
            customComponent={ this.props.selectRow.customComponent }
            hideSelectColumn={ this.props.selectRow.hideSelectColumn }
            sortList={ sortList }
            sortIndicator={ sortIndicator }
            onSort={ this.handleSort }
            onSelectAllRow={ this.handleSelectAllRow }
            bordered={ this.props.bordered }
            condensed={ this.props.condensed }
            isFiltered={ this.filter ? true : false }
            isSelectAll={ isSelectAll }
            reset={ this.state.reset }
            expandColumnVisible={ expandColumnOptions.expandColumnVisible }
            expandColumnComponent={ expandColumnOptions.expandColumnComponent }
            expandColumnBeforeSelectColumn={ expandColumnOptions.expandColumnBeforeSelectColumn }>
            { this.props.children }
          </TableHeader>
          <TableBody ref='body'
            bodyContainerClass={ this.props.bodyContainerClass }
            tableBodyClass={ this.props.tableBodyClass }
            contextMenuId={ this.props.contextMenuId }
            style={ { ...style, ...this.props.bodyStyle } }
            data={ this.state.data }
            expandComponent={ this.props.expandComponent }
            expandableRow={ this.props.expandableRow }
            expandRowBgColor={ this.props.options.expandRowBgColor }
            expandBy={ this.props.options.expandBy || Const.EXPAND_BY_ROW }
            expandBodyClass={ this.props.options.expandBodyClass }
            expandParentClass={ this.props.options.expandParentClass }
            columns={ columns }
            trClassName={ this.props.trClassName }
            trStyle={ this.props.trStyle }
            striped={ this.props.striped }
            bordered={ this.props.bordered }
            hover={ this.props.hover }
            keyField={ this.store.getKeyField() }
            condensed={ this.props.condensed }
            selectRow={ selectRow }
            expandColumnOptions={ this.props.expandColumnOptions }
            cellEdit={ this.props.cellEdit }
            selectedRowKeys={ this.state.selectedRowKeys }
            onRowClick={ this.handleRowClick }
            onRowDoubleClick={ this.handleRowDoubleClick }
            onRowMouseOver={ this.handleRowMouseOver }
            onRowMouseOut={ this.handleRowMouseOut }
            onSelectRow={ this.handleSelectRow }
            noDataText={ this.props.options.noDataText }
            withoutNoDataText={ this.props.options.withoutNoDataText }
            expanding={ this.state.expanding }
            onExpand={ this.handleExpandRow }
            onlyOneExpanding={ this.props.options.onlyOneExpanding }
            beforeShowError={ this.props.options.beforeShowError }
            keyBoardNav={ this.props.keyBoardNav }
            onNavigateCell={ this.handleNavigateCell }
            x={ this.state.x }
            y={ this.state.y }
            withoutTabIndex={ this.props.withoutTabIndex }
            onEditCell={ this.handleEditCell } />
        </div>
        { tableFilter }
        { showPaginationOnBottom ? pagination : null }
      </div>
    );
  }
}
