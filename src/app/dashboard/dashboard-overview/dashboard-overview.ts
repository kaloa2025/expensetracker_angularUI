import { CommonModule, NgIf } from '@angular/common';
import { Component, input } from '@angular/core';
import { flush } from '@angular/core/testing';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-dashboard-overview',
  imports: [CommonModule, NgIf, ReactiveFormsModule],
  templateUrl: './dashboard-overview.html',
  styleUrl: './dashboard-overview.css',
})
export class DashboardOverview {

  profileForm : FormGroup;
  showAddCategory = false;
  editMode = false;
  editCategoryData : any = null;
  isExpenseOpen = true;
  selectedCategoryIndex: number | null = null;
  showDeletePopup = false;

  constructor(private fb:FormBuilder)
  {
    this.profileForm=this.fb.group({
      username:[{value:'Username', disabled : true}],
      email:[{value:'Email', disabled : true}],
    });
  }

  toggleAddCategory()
  {
    this.showAddCategory=!this.showAddCategory;
  }

  editFormActivate()
  {
    this.editMode=true;
    this.profileForm.enable();
  }

  updateProfile()
  {
    this.editMode=false;
    this.profileForm.disable();
    alert("Profile Updated! " + this.profileForm.value);
  }

  scanUploadImage()
  {
    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.accept = 'image/*';
    fileInput.style.display = 'none';

    fileInput.onchange=(event:any)=>
    {
      const file = event.target.files[0];
      if(file)
      {
        console.log('selected file : ', file);
        alert("Image Added Successfully!");
      }
    };

    document.body.appendChild(fileInput);
    fileInput.click();
    document.body.removeChild(fileInput);
  }

  toggleExpense()
  {
    this.isExpenseOpen=!this.isExpenseOpen;
  }

  selectCategory(index:number)
  {
    this.selectedCategoryIndex = index;
  }

  clearCategory()
  {
    this.selectedCategoryIndex = null;
  }

  confirmDeleteCategory()
  {
    this.showDeletePopup=true;
  }

  cancelDelete()
  {
    this.showDeletePopup=false;
  }

  deleteCategory()
  {
    if(this.selectedCategoryIndex!==null)
    {
      alert("Category Deleted Successfully!");
      this.selectedCategoryIndex=null;
      this.showDeletePopup=false;
    }
  }

  editCategory()
  {
     if (this.selectedCategoryIndex !== null) {
    this.editMode = true;
    this.showAddCategory = true;
  }
  }

  saveCategory(editedCategory :any)
  {
    if (this.editMode && this.selectedCategoryIndex !== null) {
    this.editMode = false;
    this.showAddCategory = false;
    this.editCategoryData = null;
    this.selectedCategoryIndex = null;
  } else {
    // Add new category logic
  }
  }
}
