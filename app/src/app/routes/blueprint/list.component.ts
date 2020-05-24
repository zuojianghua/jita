import { Component, OnInit, ViewChild } from '@angular/core';
import { STColumn, STComponent } from '@delon/abc/st';
import { ModalHelper, _HttpClient } from '@delon/theme';
import { InventionModalComponent } from './invention.component';
import { MaterialModalComponent } from './material.component';

@Component({
  selector: 'app-blueprint-list',
  templateUrl: './list.component.html',
})
export class BlueprintListComponent implements OnInit {
  params: any = { name: '', blue: true, };
  data: any[] = [];
  page: any = {
    pi: 1,
    ps: 20,
  };
  total = 0;

  @ViewChild('st', { static: false }) private st: STComponent;
  columns: STColumn[] = [
    { title: '编号', index: 'id', default: '-' },
    { title: '名称', index: 'name', },
    { title: '成品价格', index: 'saleprice', type: 'currency' },
    { title: '制造成本', index: 'makeprice', type: 'currency' },
    { title: '发明成本', index: 'invprice', type: 'currency' },
    // { title: '常用', index: 'fav', type: 'yn', width: 60 },
    // { title: '蓝图', index: 'blue', type: 'yn', width: 60 },
    // { title: '最近更新时间', index: 'updatedAt', type: 'date' },
    {
      title: '操作',
      buttons: [
        { text: '拆分原料', type: 'link', click: (item: any) => this.blueprint(item.id), },
        { text: '制造成本', type: 'link', click: (item: any) => this.updatePrice(item.id), },
        { text: '发明成本', type: 'link', click: (item: any) => this.invention(item.id), },
        // { text: '登记蓝图', type: 'link', click: (item: any) => this.blueprint(item), },
        // { text: '查看蓝图', type: 'link', click: (item: any) => this.lookblueprint(item.id), },
      ],
    },
  ];

  constructor(
    private http: _HttpClient,
    private modalHelper: ModalHelper,
  ) { }

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
    this.http.get(`/compPrice/${id}`).subscribe((result: any) => {
      this.getData();
    });
  }

  fav(id) {
    this.http.get(`/fav/${id}`).subscribe((result: any) => {
      this.getData();
    });
  }

  // 拆分材料
  blueprint(id) {
    this.modalHelper.create(MaterialModalComponent, { id }).subscribe(res => {});
  }

  // 设定发明成本
  invention(id){
    this.modalHelper.create(InventionModalComponent, { id }).subscribe(res => {
      console.log('发明成本设定完毕');
    });
  }

  lookblueprint(id) {
    // this.modalHelper.create(BlueprintModalComponent, {id, look: true}).subscribe(res => {

    // });
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
