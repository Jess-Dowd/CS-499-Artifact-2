// Represents a user record returned from the backend.
export class User {

  // User email (used for login and display).
  email: string;

  // User's display name.
  name: string;

  // User role (admin or viewer).
  // Enhancement 3: Needed for the new admin directory page.
  role?: string;

  // MongoDB document ID.
  // Enhancement 3: Required so the admin page can send PUT /api/users/:id.
  _id?: string; 

  constructor() {
    this.email = '';
    this.name = '';
    this.role = '';
    this._id = '';
  }
}
