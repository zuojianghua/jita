import { Component, Input, OnInit } from '@angular/core';
import { _HttpClient } from '@delon/theme';
import { NzModalRef, NzModalService } from 'ng-zorro-antd/modal';

@Component({
    selector: 'app-material-modal',
    templateUrl: './material.component.html',
})
export class MaterialModalComponent implements OnInit {

    constructor(
        private http: _HttpClient,
        private modal: NzModalService,
        private modalRef: NzModalRef,
    ) {

    }

    @Input() id: any;
    @Input() look: any = false;
    inputValue: any;
    num: any = 1;
    listData: any[] = [];

    costPrice = 0;

    ngOnInit() {
        console.log(this.id);
        if (this.id) { this.getData(); }
    }

    getData() {
        this.http.get(`/getMaterial/${this.id}`).subscribe((result: any) => {
            this.listData = result;
        });
    }

    // 从蓝图导入原材料
    resetMaterial() {
        console.log(this.id);
        this.http.get(`/resetMaterial/${this.id}`).subscribe((result: any) => {
            console.log(result);
            this.modal.success({ nzTitle: '完成' });
            this.getData();
        });
    }

    // 拆分某项原料
    splitMaterial(id) {
        this.http.get(`/splitMaterial/${this.id}/${id}`).subscribe((result: any) => {
            console.log(result);
            this.getData();
        });
    }

    // 制造成本计算并回写
    comp() {
        this.http.get(`/compPrice/${this.id}`).subscribe((result: any) => {
            console.log(result);
            this.modal.success({ nzTitle: '完成' });
            this.getData();
        });
    }

    ok() {
        this.modalRef.destroy({ inputValue: this.inputValue, num: this.num });
        // this.modalRef.triggerOk();
    }

    cancel() {
        this.modalRef.triggerCancel();
    }
}
