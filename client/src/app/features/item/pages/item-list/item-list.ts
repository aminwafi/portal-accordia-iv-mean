import { Component, OnInit } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ItemService } from "../../../../core/services/item";
import { Item } from '../../item.model';
import { AuthService } from '../../../../core/services/auth';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatTooltipModule } from '@angular/material/tooltip';

@Component({
  selector: 'app-item-list',
  standalone: true,
  imports: [
    CommonModule,
    DatePipe,
    RouterModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule,
    MatToolbarModule,
    MatTooltipModule
  ],
  templateUrl: './item-list.html',
  styleUrl: './item-list.scss',
})
export class ItemListComponent implements OnInit {
  items: Item[] = [];
  loading = false;

  displayedColumns: string[] = [];

  constructor(
    public auth: AuthService,
    private item: ItemService
  ) {}
  
  ngOnInit(): void {
    this.displayedColumns = ['name', 'description', 'createdAt'];

    if (this.auth.getRole() === 'admin') {
      this.displayedColumns.push('actions');
    }

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
