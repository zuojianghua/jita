import { Component, OnInit, ViewChild } from '@angular/core';
import { STColumn, STComponent } from '@delon/abc/st';
import { ModalHelper, _HttpClient } from '@delon/theme';
import { NzMessageService } from 'ng-zorro-antd/message';

@Component({
    selector: 'app-product',
    templateUrl: './product.component.html',
})
export class ProductComponent implements OnInit {

    // 输入的制造物品组合
    inputValue: string;
    // 导出到剪贴板的数据
    outputValue: string;

    // 商品列表
    items: any[] = [];
    // 原材料列表
    materialsData: any[] = [];
    // 组件内容
    zujian: any[] = [];

    totalSaleprice = 0;
    totalBuyprice = 0;

    @ViewChild('st', { static: false }) private st: STComponent;
    columns: STColumn[] = [
        { title: '编号', index: 'id', default: '-' },
        { title: '名称', index: 'name', },
        { title: '数量', index: 'num', },
        { title: '吉它卖价', index: 'saleprice', type: 'currency' },
        { title: '预计成本', index: 'saleprice', type: 'currency' },
    ];

    constructor(
        private http: _HttpClient,
        private modalHelper: ModalHelper,
        private message: NzMessageService,
    ) { }

    ngOnInit() {
    }

    submit() {
        const data = this.inputValue.trim().split('\n').map(m => m.split('\t')).filter(f => f[0] !== '总共：');
        console.log(data);
        this.http.post('/product', data).subscribe((result: any) => {
            this.totalSaleprice = result.totalSaleprice;
            this.totalBuyprice = result.totalBuyprice;
            this.items = result.items;
            this.materialsData = result.data;
            this.zujian = result.zujian;

            this.outputValue = result.data.map(m => `${m.SubItem.name}\t${Math.ceil(m.num)}`).join(`\r\n`);
            
        });
    }



    updatePriceAll() {
        this.items.forEach(f => {
            this.updatePrice(f.ItemId);
        });
    }

    updatePrice(id) {
        this.http.get(`/updatePrice/${id}`).subscribe((result: any) => {
            this.message.success(`${id}更新完成`);
        });
    }
}
