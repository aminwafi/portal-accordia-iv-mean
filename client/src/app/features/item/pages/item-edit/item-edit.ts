import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ItemService } from '../../../../core/services/item';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-item-edit',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule
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

      this.item.get(this.id).subscribe((item) => {
        this.form.patchValue(item);
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
