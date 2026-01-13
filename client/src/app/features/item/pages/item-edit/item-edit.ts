import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ItemService } from '../../../../core/services/item';
import { CommonModule } from '@angular/common';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-item-edit',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule,
    MatToolbarModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule
  ],
  templateUrl: './item-edit.html',
  styleUrl: './item-edit.scss',
})
export class ItemEditComponent implements OnInit {
  id!: string;
  loading = true;

  form!: FormGroup; 

  constructor(
    private item: ItemService,
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private router: Router
  ){
    this.form = this.fb.group({
      name: ['', Validators.required],
      description: ['']
    })
  }

  ngOnInit(): void {
      const id = this.route.snapshot.paramMap.get('id');

      if (!id) {
        console.error('Parameter id is missing');
        return;
      }

      this.id = id;

      this.item.get(this.id).subscribe((res) => {
        this.form.patchValue(res.item);
        this.loading = false
      });
  }

  submit() {
    if (this.form.invalid) return;

    this.item.update(this.id, this.form.value).subscribe(() => {
      this.router.navigate(['/item']);
    })
  }
}
