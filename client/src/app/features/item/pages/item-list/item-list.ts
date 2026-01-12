import { Component, OnInit } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ItemService } from "../../../../core/services/item";
import { Item } from '../../item.model';

@Component({
  selector: 'app-item-list',
  standalone: true,
  imports: [
    CommonModule,
    DatePipe,
    RouterModule
  ],
  templateUrl: './item-list.html',
  styleUrl: './item-list.scss',
})
export class ItemListComponent implements OnInit {
  items: Item[] = [];
  loading = false;

  constructor(private item: ItemService) {}
  
  ngOnInit(): void {
    this.load();
  }

  load() {
    this.loading = true;
    this.item.list().subscribe({
      next: res => {
        this.items = res.items;
        this.loading = false;
      },
      error: () => (this.loading = false)
    })
  }

  delete(item: Item) {
    if (!confirm(`Delete ${item.name}?`)) return;

    this.item.delete(item.id).subscribe(() => {
      this.load();
    });
  }
}
