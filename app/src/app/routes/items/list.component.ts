import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { STColumn, STComponent } from '@delon/abc/st';
import { ModalHelper, _HttpClient } from '@delon/theme';
import { switchMap } from 'rxjs/operators';
import { MaterialModalComponent } from '../blueprint/material.component';
import { BlueprintModalComponent } from './blueprint.component';

@Component({
  selector: 'app-items-list',
  templateUrl: './list.component.html',
})
export class ItemsListComponent implements OnInit {
  params: any = { name: '', fav: false, blue: false, ids: [] };
  data: any[] = [];
  page: any = { pi: 1, ps: 20, };
  total = 0;
  types = {
    1: [34, 35, 36, 37, 38, 39, 40, 11399],
    2: [11530, 11531, 11532, 11533, 11534, 11535, 11536, 11537, 11538, 11539, 11540, 11541, 11542, 11543, 11544, 11545, 11547, 11548, 11549, 11550, 11551, 11552, 11553, 11554, 11555, 11556, 11557, 11558, 11688, 11689, 11690, 11691, 11692, 11693, 11694, 11695],
  };

  @ViewChild('st', { static: false }) private st: STComponent;
  columns: STColumn[] = [
    { title: '编号', index: 'id', default: '-' },
    { title: '名称', index: 'name', },
    { title: '吉它卖价', index: 'saleprice', type: 'currency' },
    { title: '吉它收价', index: 'buyprice', type: 'currency' },
    { title: '常用', index: 'fav', type: 'yn', width: 60 },
    { title: '蓝图', index: 'blue', type: 'yn', width: 60 },
    { title: '最近更新时间', index: 'updatedAt', type: 'date' },
    {
      title: '操作',
      buttons: [
        { text: '更新', type: 'link', click: (item: any) => this.updatePrice(item.id), },
        { text: '常用', type: 'link', click: (item: any) => this.fav(item.id), },
        { text: '登记蓝图', type: 'link', click: (item: any) => this.blueprint(item), },
        { text: '查看蓝图', type: 'link', click: (item: any) => this.lookblueprint(item), },
        { text: '拆分材料', type: 'link', click: (item: any) => this.material(item.id), },
      ],
    },
  ];


  constructor(
    private http: _HttpClient,
    private modalHelper: ModalHelper,
    private route: ActivatedRoute,
    private router: Router,
  ) { }

  ngOnInit() {
    // const id = this.route.snapshot.paramMap.get('id');
    // console.log(id);
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      console.log(id);
      if (id) { this.params.ids = this.types[id]; }
      this.getData();
    });
    
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
    this.modalHelper.create(BlueprintModalComponent, item).subscribe(res => {
      const data = res.inputValue.trim().split('\n').map(m => m.split('\t')).filter(f => f[0] !== '总共：');
      const num = res.num;
      console.log(data);
      this.http.post(`/addBlueprint/${item.id}`, { data, num }).subscribe((result: any) => {

      });
    });
  }

  lookblueprint(item) {
    this.modalHelper.create(BlueprintModalComponent, { id: item.id, saleprice: item.saleprice, name: item.name, look: true }).subscribe(res => {

    });
  }

  // 拆分材料
  material(id) {
    this.modalHelper.create(MaterialModalComponent, { id }).subscribe(res => { });
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
