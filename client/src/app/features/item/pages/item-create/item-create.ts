import { Component } from '@angular/core';
import { FormBuilder, Validators, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { ItemService } from '../../../../core/services/item';

@Component({
  selector: 'app-item-create',
  imports: [
    ReactiveFormsModule,
    CommonModule,
    RouterModule
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
    if (!this.form.invalid) return;

    this.saving = true;
    this.item.create(this.form.value).subscribe(() => {
      this.router.navigate(['/item']);
    });
  }
} 
