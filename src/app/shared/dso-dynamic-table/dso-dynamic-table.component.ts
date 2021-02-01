import { Component, EventEmitter, Input, OnChanges, OnInit, Output, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import {MatTableDataSource} from '@angular/material/table';
import {SelectionModel} from '@angular/cdk/collections';
import {MatDialog, MatDialogConfig} from "@angular/material/dialog";
import { DsoCustomDialogComponent } from '../dso-custom-dialog/dso-custom-dialog.component';

@Component({
  selector: 'app-dso-dynamic-table',
  templateUrl: './dso-dynamic-table.component.html',
  styleUrls: ['./dso-dynamic-table.component.scss']
})
export class DsoDynamicTableComponent implements OnInit, OnChanges {
  @Input()
  resultSet;
  @Input()
  config;
  @Input()
  enableFilter = false;
  @Output()
  postData = new EventEmitter();
  @Output()
  putData = new EventEmitter();
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  dataSource: MatTableDataSource<any>;
  displayedColumns = [];
  filterValue = '';
  selection = new SelectionModel<any>(true, []);
  constructor(private dialog: MatDialog) {
    this.dataSource = new MatTableDataSource();
  }

  ngOnInit() {

  }

  ngOnChanges() {
  if (this.resultSet && this.config) {
  this.displayedColumns = this.config['config']['column-config'].map(res => res.attribute);
  if (this.config['config']['extra-config']) {
      if ( this.config['config']['extra-config']['table-select'] ) {
      this.displayedColumns.unshift('select');
      
      }
      if ( this.config['config']['extra-config']['row-edit'] ) {
        this.displayedColumns.unshift('edit');
      }
   }
  this.dataSource = new MatTableDataSource(this.resultSet);
  this.selection = new SelectionModel<any>(true, []);
  setTimeout(() => {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }, 400)
  }
 }
 

 isAllSelected() {
  const numSelected = this.selection.selected.length;
  const numRows = this.dataSource.data.length;
  return numSelected === numRows;
}

masterToggle() {
  this.isAllSelected() ?
      this.selection.clear() :
      this.dataSource.data.forEach(row => this.selection.select(row));
}

checkboxLabel(row?: any): string {
  if (!row) {
    return `${this.isAllSelected() ? 'select' : 'deselect'} all`;
  }
  return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${row.position + 1}`;
}

openUpdateDialog(row) {

  const dialogConfig = new MatDialogConfig();

  dialogConfig.disableClose = true;
  dialogConfig.autoFocus = true;

  dialogConfig.data = {
    title: 'Update UDA Mappings',
    config: this.config['config']['extra-config']['row-edit-config'],
    rowData: row
 };
  const dialogRef = this.dialog.open(DsoCustomDialogComponent, dialogConfig);
  
  dialogRef.afterClosed().subscribe(res => {
    if (res && Object.keys(res).length > 0)
    this.putData.emit(res);
  });
}

openAddDialog() {

  const dialogConfig = new MatDialogConfig();

  dialogConfig.disableClose = true;
  dialogConfig.autoFocus = true;

  dialogConfig.data = {
    title: 'Add UDA Mappings',
    config: this.config['config']['extra-config']['row-add-config'],
    rowData: {}
 };

 const dialogRef =this.dialog.open(DsoCustomDialogComponent, dialogConfig);

  dialogRef.afterClosed().subscribe(res => {
    if (res && Object.keys(res).length > 0)
    this.postData.emit(res);
  });
}

applyFilter(event: Event) {
  const filterValue = (event.target as HTMLInputElement).value;
  this.dataSource.filter = filterValue.trim().toLowerCase();

  if (this.dataSource.paginator) {
    this.dataSource.paginator.firstPage();
  }

  console.log(this.dataSource);
}

}
