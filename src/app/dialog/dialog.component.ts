import { Component, Inject } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ApiService } from '../services/api.service';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-dialog',
  templateUrl: './dialog.component.html',
  styleUrl: './dialog.component.scss'
})
export class DialogComponent {
  conditionProduct: string[] = ["New", "Second Hand", "B/Y"]
  productForm !: FormGroup
  actionBtn: string = "Save"

  constructor(
    private formBuilder: FormBuilder,
    private api: ApiService,
    private dialogRef: MatDialogRef<DialogComponent>,
    @Inject(MAT_DIALOG_DATA) public editData: any
  ) { }

  ngOnInit(): void {
    this.productForm = this.formBuilder.group({
      productName: ["", Validators.required],
      category: ["", Validators.required],
      condition: ["", Validators.required],
      price: ["", Validators.required],
      comment: ["", Validators.required],
      date: ["", Validators.required],
    })
    if (this.editData) {
      this.actionBtn = "Update"
      this.productForm.controls['productName'].setValue(this.editData.productName);
      this.productForm.controls['category'].setValue(this.editData.category);
      this.productForm.controls['condition'].setValue(this.editData.condition);
      this.productForm.controls['price'].setValue(this.editData.price);
      this.productForm.controls['comment'].setValue(this.editData.comment);
      this.productForm.controls['date'].setValue(this.editData.date);
    }

  }
  addProduct() {
    if (!this.editData) {
      if (this.productForm.valid) {
        this.api.postProduct(this.productForm.value)
          .subscribe({
            next: (res) => {
              this.productForm.reset()
              this.dialogRef.close("save")
              alert('Product was added succesfully');
            },
            error: () => {
              alert("Something went wrong while ading")
            }
          })
      }
    } else {
      this.updateProduct()
    }

  }
  updateProduct() {
    this.api.putProduct(this.productForm.value, this.editData.id)
      .subscribe({
        next: (res) => {
          alert("Product updated successfully")
          this.productForm.reset()
          this.dialogRef.close('update')
        },
        error: () => {
          alert("Something went wrong  while update")
        }
      })
  }
}
