import { Component, OnInit, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-trip-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './trip-card.html',
  styleUrls: ['./trip-card.css']   // ← plural
})
export class TripCard implements OnInit {
  @Input('trip') trip: any;
  constructor() {}
  ngOnInit(): void {}
}


