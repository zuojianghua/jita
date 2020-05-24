import { Component, Input, OnInit } from '@angular/core';
import { _HttpClient } from '@delon/theme';
import { NzModalRef, NzModalService } from 'ng-zorro-antd/modal';

@Component({
    selector: 'app-invention-modal',
    templateUrl: './invention.component.html',
})
export class InventionModalComponent implements OnInit {

    constructor(
        private http: _HttpClient,
        private modal: NzModalService,
        private modalRef: NzModalRef,
    ) {

    }

    @Input() id: any;
    inputValue: any;

    cores = [
        { id: 11496, name: '防御子系统工程' },
        { id: 20114, name: '推进子系统工程' },
        { id: 20115, name: '核心子系统工程' },
        { id: 20171, name: '磁流体物理' },
        { id: 20172, name: '米玛塔尔星舰工程' },
        { id: 20410, name: '盖伦特星舰工程' },
        { id: 20411, name: '高能物理' },
        { id: 20412, name: '等离子物理' },
        { id: 20413, name: '激光物理' },
        { id: 20414, name: '量子物理' },
        { id: 20415, name: '分子工程' },
        { id: 20416, name: '纳米工程' },
        { id: 20417, name: '电磁物理' },
        { id: 20418, name: '电子工程' },
        { id: 20419, name: '引力子物理' },
        { id: 20420, name: '火箭科学' },
        { id: 20421, name: '艾玛星舰工程' },
        { id: 20423, name: '核芯物理' },
        { id: 20424, name: '机械工程' },
        { id: 20425, name: '攻击子系统工程' },
        { id: 25887, name: '加达里星舰工程' },
        { id: 52309, name: '三神裔量子工程学' },
    ];

    decoders: any = [
        { id: 0, name: '不使用解码器' },
        { id: 34201, name: '加速装置解码器' },
        { id: 34202, name: '获取装置解码器' },
        { id: 34203, name: '放大装置解码器' },
        { id: 34204, name: '等价装置解码器' },
        { id: 34205, name: '处理装置解码器' },
        { id: 34206, name: '对称装置解码器' },
        { id: 34207, name: '优化的获取装置解码器' },
        { id: 34208, name: '优化的放大装置解码器' },
    ];

    data: any = {
        core1: null,    // 核心
        core1num: null, // 核心数量
        core2: null,    // 核心
        core2num: null, // 核心数量
        decoder: null,  // 解码器
        rate: null,     // 成功率
        output: null,   // 输出流程
    };

    costPrice = 0;

    ngOnInit() {
        console.log(this.id);
        if (this.id) { this.getData(); }
    }

    getData() {
        this.http.get(`/getInvention/${this.id}`).subscribe((result: any) => {
            if (result) { this.data = result; }
        });
    }

    // 制造成本计算并回写
    comp() {
        console.log(this.data);
        this.http.post(`/invPrice/${this.id}`, this.data).subscribe((result: any) => {
            console.log(result);
            this.modal.success({ nzTitle: '完成' });
        });
    }

    ok() {
        // this.modalRef.destroy({ inputValue: this.inputValue, num: this.num });
        this.modalRef.triggerOk();
    }

    cancel() {
        this.modalRef.triggerCancel();
    }
}
