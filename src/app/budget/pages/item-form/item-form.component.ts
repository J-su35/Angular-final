import { Component, inject, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup, NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { JsonPipe, Location } from '@angular/common';
import { thMobile } from '../../../shared/validators/th-mobile.validator';
import { ItemService } from '../../item.service';
import { ItemStatus } from '../../models/item';
import { CanComponentDeactivate } from '../../../auth/guards/can-deactivate.guard';
import { BsModalService, BsModalRef, ModalOptions } from 'ngx-bootstrap/modal';
import { Observable } from 'rxjs';
import { ConfirmModalComponent } from '../../../shared/components/confirm-modal/confirm-modal.component';

@Component({
  selector: 'app-item-form',
  standalone: true,
  imports: [ReactiveFormsModule, JsonPipe],
  templateUrl: './item-form.component.html',
  styleUrl: './item-form.component.scss'
})
// export class ItemFormComponent {
  export class ItemFormComponent implements OnInit, CanComponentDeactivate {

  // edit item
  @Input()
  id: number | null = null;

  location = inject(Location);
  fb = inject(NonNullableFormBuilder)

  itemService = inject(ItemService)

  // formControls
  title = new FormControl<string>('', { nonNullable: true, validators: [Validators.required] })
  // contactMobileNo = new FormControl<string>('', { nonNullable: true })
  contactMobileNo = this.fb.control<string>('', { validators: [Validators.required, thMobile] });
  // amount = this.fb.control<number | null>(null, { validators: [Validators.required, Validators.min(1)] });
  // price = this.fb.control<number | null>(null, { validators: [Validators.required, Validators.min(0.5)] });
  amount = this.fb.control<number>(null!, { validators: [Validators.required, Validators.min(1)] });
  price = this.fb.control<number>(null!, { validators: [Validators.required, Validators.min(0.5)] });

  // formGroup old
  // fg = new FormGroup({
  //   title: this.title,
  //   contactMobileNo: this.contactMobileNo
  // })

  // formGroup new
  fg = this.fb.group({
    title: this.title,
    contactMobileNo: this.contactMobileNo,
    amount: this.amount,
    price: this.price
  })

  // add new last day
  modalService = inject(BsModalService)
  bsModalRef?: BsModalRef;

  ngOnInit() {
    console.log('id', this.id) // ???
    if (this.id) {
      this.itemService.get(this.id).subscribe(v => this.fg.patchValue(v))
    }
  }

  onBack(): void {
    this.location.back();
  }

  // onSubmit(): void {
  //   console.log(this.fg.getRawValue())
  // }

  onSubmit(): void {
    const item = {...this.fg.getRawValue(), status: ItemStatus.PENDING };
    this.itemService.add(item).subscribe(v => this.onBack())
  }

  canDeactivate(): boolean | Observable<boolean> {
    // check is dirty-form
    const isFormDirty = this.fg.dirty
    console.log('isFormDirty', isFormDirty)
    if (!isFormDirty) {
      return true;
    }

    // init confirm modal
    const initialState: ModalOptions = {
      initialState: {
        title: `Confirm to leave" ?`
      }
    };
    this.bsModalRef = this.modalService.show(ConfirmModalComponent, initialState);

    return new Observable<boolean>((observer) => {
      this.bsModalRef?.onHidden?.subscribe(() => {
        observer.next(this.bsModalRef?.content?.confirmed);
        observer.complete()
      })  
    })
  }
}
