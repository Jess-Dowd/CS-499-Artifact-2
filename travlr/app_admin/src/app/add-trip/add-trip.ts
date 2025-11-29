import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { TripDataService } from '../services/trip-data';

@Component({
  selector: 'app-add-trip',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './add-trip.html',
  styleUrl: './add-trip.css'
})
export class AddTrip implements OnInit {

  /* Reactive form that holds the new trip data */
  public addForm!: FormGroup;

  /* Tracks whether the user has attempted submission */
  submitted = false;

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private tripService: TripDataService
  ) {}

  ngOnInit() {
    /* Build the form with validators so required fields must be filled in */
    this.addForm = this.formBuilder.group({
      _id: [],                        // unused on creation, but included for structure
      code: ['', Validators.required],
      name: ['', Validators.required],
      length: ['', Validators.required],
      start: ['', Validators.required],
      resort: ['', Validators.required],
      perPerson: ['', Validators.required],
      image: ['', Validators.required],
      description: ['', Validators.required],
    });
  }

  /* Called when the form is submitted
   * Enhancement 2 context:
   * This page is now protected by RBAC. Only admins can create trips.
   * The backend will reject unauthorized users even if they reach this form.
   */
  public onSubmit() {
    this.submitted = true;

    if (this.addForm.valid) {
      /* Calls the backend to create the trip.
       * On success, redirect back to the main listing page.
       */
      this.tripService.addTrip(this.addForm.value).subscribe({
        next: () => this.router.navigate(['']),
        error: (error) => console.log('Error:', error)
      });
    }
  }

  /* Template helper for validation state */
  get f() { return this.addForm.controls; }
}
