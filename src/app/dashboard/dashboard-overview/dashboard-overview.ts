import { CommonModule, NgIf } from '@angular/common';
import { Component, input, OnDestroy, OnInit } from '@angular/core';
import { flush } from '@angular/core/testing';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AuthService } from '../../../services/auth/auth.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-dashboard-overview',
  imports: [CommonModule, NgIf, ReactiveFormsModule],
  templateUrl: './dashboard-overview.html',
  styleUrl: './dashboard-overview.css',
})
export class DashboardOverview implements OnInit, OnDestroy{

  profileForm : FormGroup;

  showAddCategory = false;
  editMode = false;
  editCategoryData : any = null;
  isExpenseOpen = false;
  selectedCategoryIndex: number | null = null;
  showDeletePopup = false;

  username : string|null = '';
  email : string|null = '';

  private authSub?: Subscription;

  constructor(private fb:FormBuilder, private authService:AuthService)
  {
    this.profileForm=this.fb.group({
      username:[{value:this.username, disabled : true}],
    });
  }

  ngOnInit(): void {
    this.authSub = this.authService.authState$.subscribe(
      state=>{
        if(!state || !state.claims) return;
        const claims = state.claims;
        this.username=claims.userName??'';
        this.email = claims.email??'';
        this.profileForm.patchValue({username : this.username});
      }
    )
  }

  ngOnDestroy(): void {
    if (this.authSub) this.authSub.unsubscribe();
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

  logout()
  {
    this.authService.logout(true);
  }
}
