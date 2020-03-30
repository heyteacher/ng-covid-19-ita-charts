import { NestedTreeControl } from '@angular/cdk/tree';
import { Component, OnInit } from '@angular/core';
import { MatTreeNestedDataSource } from '@angular/material/tree';
import { Node } from "../app.model";
import { DataService } from '../data.service';

@Component({
  selector: 'app-tree-menu',
  templateUrl: './tree-menu.component.html',
  styleUrls: ['./tree-menu.component.css']
})

export class TreeMenuComponent implements OnInit {

  treeControl = new NestedTreeControl<Node>(node => node.children);
  dataSource = new MatTreeNestedDataSource<Node>();

  constructor(private dataService: DataService) {
  }

  async init(dataService) {
    this.dataSource.data = await dataService.getTree();
    this.treeControl.expand(this.dataSource.data[0])
  }

  hasChild = (_: number, node: Node) => !!node.children && node.children.length > 0;


  ngOnInit(): void {
    this.init(this.dataService);
  }

}