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
        // 2-无人机
        2: [2175, 2185, 2195, 2205, 2436, 2446, 2456, 2466, 2478, 2488, 10250, 21638, 21640, 28209, 28211, 28213, 28215, 43700],
        // 3-采集
        3: [482, 17912, 18068, 22229, 24305, 25812, 28576, 28578, 30836, 37451],
        // 4-装甲
        4: [1183, 1198, 1266, 1276, 1286, 1296, 1306, 1319, 1335, 2048, 2355, 2605, 3530, 3540, 3655, 3665, 3986, 4296, 4299, 11219, 11229, 11239, 11249, 11259, 11269, 11642, 11644, 11646, 11648, 20345, 20347, 20349, 20351, 20353, 26912, 26913, 26914, 47257],
        // 5-护盾
        5: [380, 394, 400, 1256, 1422, 2281, 2297, 2299, 2301, 2303, 2531, 2539, 2547, 2553, 3588, 3598, 3608, 3831, 3841, 10850, 10858, 24443],
        // 6-武器升级
        6: [519, 1978, 1999, 2104, 2364, 10190, 22291, 35771, 35790, 4405, 24417, 24427, 24438, 33824],
        // 7-炮台
        7: [1877, 2404, 2410, 2420, 2865, 2873, 2881, 2889, 2897, 2905, 2913, 2921, 2929, 2937, 2945, 2953, 2961, 2969, 2977, 2985, 2993, 3001, 3009, 3017, 3025, 3033, 3041, 3049, 3057, 3065, 3074, 3082, 3090, 3098, 3106, 3114, 3122, 3130, 3138, 3146, 3154, 3162, 3170, 3178, 3186, 3285, 3512, 3520, 4147, 4256, 10631, 10680, 12346, 12356, 19739, 25715, 33450],
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
        this.route.paramMap.subscribe(params => {
            const id = params.get('type');
            console.log(id);
            if (id) { this.type = this.types[id]; }
            this.getData();
        });
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
