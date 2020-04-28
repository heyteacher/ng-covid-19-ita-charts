import { NestedTreeControl } from '@angular/cdk/tree';
import { Component, OnInit } from '@angular/core';
import { MatTreeNestedDataSource } from '@angular/material/tree';
import { Node, generateRegionProvinceTree } from "../app.model";
import { DataService } from '../data.service';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-tree-menu',
  templateUrl: './tree-menu.component.html',
  styleUrls: ['./tree-menu.component.css']
})

export class TreeMenuComponent implements OnInit {

  treeControl = new NestedTreeControl<Node>(node => node.children);
  dataSource = new MatTreeNestedDataSource<Node>();

  constructor(private dataService: DataService) { }

  hasChild = (_: number, node: Node) => !!node.children && node.children.length > 0;

  ngOnInit(): void {
    this.dataService.getProvincialData()
      .pipe(map((data: any[]) => generateRegionProvinceTree(data)))
      .subscribe((data) => {
        this.dataSource.data = data
        this.treeControl.expand(data[0])
      })
  }

}