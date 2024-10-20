import { Component, inject } from '@angular/core';
import { Item, ItemStatus } from '../../models/item';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { map } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { ItemService } from '../../item.service';
import { MobileFormatPipe } from '../../../shared/pipes/mobile-format.pipe';
import { DecimalPipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { BsModalRef, BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
import { ConfirmModalComponent } from '../../../shared/components/confirm-modal/confirm-modal.component';
import { BudgetPlanComponent } from "../../components/budget-plan/budget-plan.component";

@Component({
  selector: 'app-item-entry',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule, MobileFormatPipe, DecimalPipe, RouterLink, BudgetPlanComponent],
  templateUrl: './item-entry.component.html',
  styleUrl: './item-entry.component.scss'
})
export class ItemEntryComponent {
  // items: Item[] = [
  //   {
  //     title: "Gaming Laptop",
  //     amount: 3,
  //     price: 3200,
  //     contactMobileNo: "0812345678",
  //     status: ItemStatus.APPROVED,
  //     id: 1
  //   },
  //   {
  //     title: "Desktop Tower",
  //     amount: 7,
  //     price: 2500,
  //     contactMobileNo: "0823456789",
  //     status: ItemStatus.PENDING,
  //     id: 2
  //   },
  //   {
  //     title: "Mechanical Keyboard",
  //     amount: 6,
  //     price: 750,
  //     contactMobileNo: "0834567890",
  //     status: ItemStatus.REJECTED,
  //     id: 3
  //   }
  // ];
  items: Item[] = [];
  // httpClient = inject(HttpClient)
  itemService = inject(ItemService);

  isSmallTable = false;
  filterItems = this.items;
  filterInput = new FormControl<string>('', { nonNullable: true })

  modalService = inject(BsModalService)
  bsModalRef?: BsModalRef;

  constructor() {

    // this.httpClient.get<Item[]>('http://localhost:3000/items').subscribe(vs => {
    this.itemService.list().subscribe(vs => {
      this.items = vs;
      this.filterItems = vs;
    })

    this.filterInput.valueChanges
    .pipe(
      map(keyword => keyword.toLocaleLowerCase())
    )
    .subscribe(keyword => {
      this.filterItems = this.items.filter(item => item.title.toLocaleLowerCase().includes(keyword))
    })
  }

  onConfirm(item: Item) {
    const initialState: ModalOptions = {
      initialState: {
        title: `Confirm to delete "${item.title}" ?`
      }
    };
    this.bsModalRef = this.modalService.show(ConfirmModalComponent, initialState);
    this.bsModalRef?.onHidden?.subscribe(() => {
      if (this.bsModalRef?.content?.confirmed) {
        this.onDelete(item.id)
      }
    })

  }

  onDelete(id: number) {
    return this.itemService.delete(id).subscribe(v => {
      this.items = this.items.filter(item => item.id != id)
      this.filterItems = this.items
    });
  } 
}

