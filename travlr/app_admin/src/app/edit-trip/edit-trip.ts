import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { TripDataService } from '../services/trip-data';
import type { Trip } from '../models/trip';

@Component({
  selector: 'app-edit-trip',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './edit-trip.html',
  styleUrls: ['./edit-trip.css']
})
export class EditTripComponent implements OnInit {

  /* Reactive form used to display and edit the selected trip */
  public editForm!: FormGroup;

  /* Holds the trip retrieved from the API */
  trip!: Trip;

  submitted = false;
  message = '';

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private tripDataService: TripDataService
  ) {}

  ngOnInit(): void {
    /* Enhancement 2:
     * Editing is now admin-only. The backend will block non-admins.
     * The front-end loads the trip details into a form for editing.
     */

    // Trip code stored earlier when clicking "Edit Trip"
    const tripCode = localStorage.getItem('tripCode');
    if (!tripCode) {
      alert("Couldn't find tripCode");
      this.router.navigate(['']);
      return;
    }

    // Build the form structure
    this.editForm = this.formBuilder.group({
      _id: [],
      code:        [tripCode, Validators.required],
      name:        ['', Validators.required],
      length:      ['', Validators.required],
      start:       ['', Validators.required],
      resort:      ['', Validators.required],
      perPerson:   ['', Validators.required],
      image:       ['', Validators.required],
      description: ['', Validators.required]
    });

    // Load the trip from the API and populate the form fields
    this.tripDataService.getTrip(tripCode).subscribe({
      next: (value: Trip) => {
        this.trip = value;

        // Convert trip.start into yyyy-mm-dd format for <input type="date">
        const startStr = value.start
          ? new Date(value.start).toISOString().slice(0, 10)
          : '';

        this.editForm.patchValue({ ...value, start: startStr });
        this.message = `Trip: ${tripCode} retrieved`;
        console.log(this.message);
      },
      error: (err) => {
        console.log('Error:', err);
        this.message = 'No Trip Retrieved!';
      }
    });
  }

  /* Called when the user submits the edited trip */
  public onSubmit(): void {
    this.submitted = true;

    if (this.editForm.valid) {
      const payload: Trip = this.editForm.value;

      // Update trip in backend (admin-only, enforced by Enhancement 2)
      this.tripDataService.updateTrip(payload).subscribe({
        next: (resp) => {
          console.log('Updated:', resp);
          this.router.navigate(['']);
        },
        error: (err) => console.log('Error:', err)
      });
    }
  }

  // Helper for form validation in the template
  get f() { return this.editForm.controls; }
}
