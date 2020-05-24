import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { STColumn, STComponent } from '@delon/abc/st';
import { ModalHelper, _HttpClient } from '@delon/theme';
import { InventionModalComponent } from '../blueprint/invention.component';
import { MaterialModalComponent } from '../blueprint/material.component';
import { BlueprintModalComponent } from './blueprint.component';
const _ = require('lodash');

@Component({
    selector: 'app-pick-list',
    templateUrl: './pick.component.html',
})
export class PickListComponent implements OnInit {
    params: any = {};
    data: any[] = [];
    types: any = {
        // 1-高级小型舰船  34317, 34562, 34828, 35683,  52250, 52254
        1: [11172, 11174, 11176, 11178, 11182, 11184, 11186, 11188, 11190, 11192, 11194, 11196, 11198, 11200, 11202, 11365, 11371, 11377, 11379, 11381, 11387, 11393, 11400, 12032, 12034, 12038, 12042, 12044, 22452, 22456, 22460, 22464, 33697, 37135, 37457, 37458, 37459, 37460, 37480, 37481, 37482, 37483],
    };
    type: any[] = [];

    @ViewChild('st', { static: false }) private st: STComponent;
    columns: STColumn[] = [
        { title: '编号', index: 'id', default: '-' },
        { title: '名称', index: 'name', },
        { title: '吉它卖价', index: 'saleprice', type: 'currency' },
        { title: '成本', index: 'cost', type: 'currency' },
        { title: '利润', index: 'profit', type: 'currency' },
        { title: '利润率', index: 'rate', type: 'number' },
        // { title: '常用', index: 'fav', type: 'yn', width: 60 },
        // { title: '蓝图', index: 'blue', type: 'yn', width: 60 },
        // { title: '最近更新时间', index: 'updatedAt', type: 'date' },
        {
            title: '操作',
            buttons: [
                { text: '更新', type: 'link', click: (item: any) => this.updatePrice(item.id), },
                { text: '登记蓝图', type: 'link', click: (item: any) => this.blueprint(item), },
                { text: '拆分原料', type: 'link', click: (item: any) => this.material(item.id), },
                { text: '发明成本', type: 'link', click: (item: any) => this.invention(item.id), },
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
        const id = this.route.snapshot.paramMap.get('type');
        this.type = this.types[id];
        this.getData();
    }

    getData() {
        this.http.post(`/pick`, this.type).subscribe((result: any) => {
            const data = result.map(item => {
                item.cost = item.makeprice + item.invprice;
                item.profit = item.saleprice - item.cost;
                item.rate = item.profit / item.cost;
                return item;
            });
            this.data = _.orderBy(data, ['profit'], ['desc']);
        });
    }

    updatePrice(id) {
        this.http.get(`/updatePrice/${id}`).subscribe((result: any) => {
            this.getData();
        });
    }

    blueprint(item) {
        this.modalHelper.create(BlueprintModalComponent, item).subscribe(res => {
            const data = res.inputValue.trim().split('\n').map(m => m.split('\t')).filter(f => f[0] !== '总共：');
            const num = res.num;
            console.log(data);
            this.http.post(`/addBlueprint/${item.id}`, { data, num }).subscribe((result: any) => { });
        });
    }

    // 拆分材料
    material(id) {
        this.modalHelper.create(MaterialModalComponent, { id }).subscribe(res => { });
    }

    // 设定发明成本
    invention(id) {
        this.modalHelper.create(InventionModalComponent, { id }).subscribe(res => { });
    }
}
