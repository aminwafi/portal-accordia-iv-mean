import { Component } from '@angular/core';
import { FormBuilder, Validators, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { ItemService } from '../../../../core/services/item';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-item-create',
  imports: [
    ReactiveFormsModule,
    CommonModule,
    RouterModule,
    MatToolbarModule,
    MatIconModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule
  ],
  templateUrl: './item-create.html',
  styleUrl: './item-create.scss',
})
export class ItemCreateComponent {
  form!: FormGroup;

  saving = false;

  constructor(
    private item: ItemService,
    private fb: FormBuilder,
    private router: Router
  ) {
    this.form = this.fb.group({
      name: ['', Validators.required],
      description: ['']
    });
  }

  submit() {
    if (this.form.invalid) return;

    this.saving = true;
    this.item.create(this.form.value).subscribe(() => {
      this.router.navigate(['/item']);
    });
  }
} 
