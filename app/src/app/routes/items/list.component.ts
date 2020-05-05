import { Component, OnInit, ViewChild } from '@angular/core';
import { STColumn, STComponent } from '@delon/abc/st';
import { _HttpClient } from '@delon/theme';
import { pipe } from 'rxjs';

@Component({
  selector: 'app-items-list',
  templateUrl: './list.component.html',
})
export class ItemsListComponent implements OnInit {
  params: any = { name: '' };
  data: any[] = [];
  page: any = {
    pi: 1,
    ps: 10,
  };
  total = 0;

  @ViewChild('st', { static: false }) private st: STComponent;
  columns: STColumn[] = [
    { title: '编号', index: 'id', default: '-' },
    { title: '名称', index: 'name', },
    { title: '吉它卖价', index: 'saleprice' },
    { title: '吉它收价', index: 'buyprice' },
    { title: '常用', index: 'fav', type: 'yn', width: 60 },
    { title: '最近更新时间', index: 'updatedAt' },
    {
      title: '操作',
      buttons: [
        { text: '更新', type: 'link', click: (item: any) => this.updatePrice(item.id), },
        { text: '常用', type: 'link', click: (item: any) => this.fav(item.id), },
      ],
    },
  ];

  constructor(private http: _HttpClient) { }

  ngOnInit() {
    this.getData();
  }

  getData() {
    this.http.get(`/items`, { ...this.params, ...this.page }).subscribe((result: any) => {
      // console.log(result)
      this.data = result.rows;
      this.total = result.count;
    });
  }

  updatePrice(id) {
    this.http.get(`/updatePrice/${id}`).subscribe((result: any) => {
      this.getData();
    });
  }

  fav(id) {
    this.http.get(`/fav/${id}`).subscribe((result: any) => {
      this.getData();
    });
  }

  onChange(e) {
    // console.log(this.page)
    switch (e.type) {
      // 翻页
      case 'pi':
        this.page.pi = e.pi;
        this.getData();
        break;
      case 'ps':
        this.page.ps = e.ps;
        this.getData();
        break;
    }
  }
}
