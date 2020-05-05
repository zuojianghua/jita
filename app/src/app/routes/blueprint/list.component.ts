import { Component, OnInit, ViewChild } from '@angular/core';
import { STColumn, STComponent } from '@delon/abc/st';
import { ModalHelper, _HttpClient } from '@delon/theme';
// import { BlueprintModalComponent } from './blueprint.component';

@Component({
  selector: 'app-blueprint-list',
  templateUrl: './list.component.html',
})
export class BlueprintListComponent implements OnInit {
  params: any = { name: '', blue: true, };
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
    { title: '成品价格', index: 'saleprice' },
    { title: '成本', index: 'buyprice' },
    // { title: '常用', index: 'fav', type: 'yn', width: 60 },
    // { title: '蓝图', index: 'blue', type: 'yn', width: 60 },
    // { title: '最近更新时间', index: 'updatedAt', type: 'date' },
    {
      title: '操作',
      buttons: [
        { text: '拆分原料', type: 'link', click: (item: any) => this.updatePrice(item.id), },
        { text: '计算成本', type: 'link', click: (item: any) => this.updatePrice(item.id), },
        // { text: '常用', type: 'link', click: (item: any) => this.fav(item.id), },
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
    this.http.get(`/updatePrice/${id}`).subscribe((result: any) => {
      this.getData();
    });
  }

  fav(id) {
    this.http.get(`/fav/${id}`).subscribe((result: any) => {
      this.getData();
    });
  }

  blueprint(item) {
    // this.modalHelper.create(BlueprintModalComponent, item).subscribe(res => {
    //   const data = res.inputValue.trim().split('\n').map(m => m.split('\t'));
    //   const num = res.num;
    //   console.log(data);
    //   this.http.post(`/addBlueprint/${item.id}`, { data, num }).subscribe((result: any) => {

    //   });
    // });
  }

  lookblueprint(id){
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
