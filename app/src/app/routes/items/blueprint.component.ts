import { Component, Input, OnInit } from '@angular/core';
import { STColumn, STComponent } from '@delon/abc/st';
import { _HttpClient } from '@delon/theme';
import { NzModalRef, NzModalService } from 'ng-zorro-antd/modal';

@Component({
    selector: 'app-blueprint-modal',
    templateUrl: './blueprint.component.html',
})
export class BlueprintModalComponent implements OnInit {

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
        this.http.get(`/getBlueprint/${this.id}`).subscribe((result: any) => {
            this.listData = result.Blueprints;
            this.comp();
        });
    }

    updatePriceAll() {
        this.listData.forEach(f => {
            this.updatePrice(f.ItemId);
        })
    }

    updatePrice(id) {
        this.http.get(`/updatePrice/${id}`).subscribe((result: any) => {
            this.getData();
        });
    }

    comp() {
        this.costPrice = 0;
        this.listData.forEach(f => this.costPrice = this.costPrice + (f.input * f.SubItem.saleprice));
    }

    ok() {
        this.modalRef.destroy({ inputValue: this.inputValue, num: this.num });
        // this.modalRef.triggerOk();
    }

    cancel() {
        this.modalRef.triggerCancel();
    }
}
