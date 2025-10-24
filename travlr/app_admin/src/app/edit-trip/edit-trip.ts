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
  public editForm!: FormGroup;
  trip!: Trip;
  submitted = false;
  message = '';

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private tripDataService: TripDataService
  ) {}

  ngOnInit(): void {
    // get tripCode stashed by the card
    const tripCode = localStorage.getItem('tripCode');
    if (!tripCode) {
      alert("Couldn't find tripCode");
      this.router.navigate(['']);
      return;
    }

    // build form
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

    // load trip and patch into form
    this.tripDataService.getTrip(tripCode).subscribe({
      next: (value: Trip) => {
        this.trip = value;

        // If API returns Date, convert to yyyy-mm-dd for the <input type="date">
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

  public onSubmit(): void {
    this.submitted = true;
    if (this.editForm.valid) {
      const payload: Trip = this.editForm.value;
      this.tripDataService.updateTrip(payload).subscribe({
        next: (resp) => {
          console.log('Updated:', resp);
          this.router.navigate(['']);
        },
        error: (err) => console.log('Error:', err)
      });
    }
  }

  get f() { return this.editForm.controls; }
}
