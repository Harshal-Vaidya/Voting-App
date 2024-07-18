<h1> Voting Application</h1>
This is a backend application for a voting system where users can vote for candidates. It provides functionalities for user authentication, candidate management, and voting.

<h2>Features</h2>
<ul>
<li>User sign up and login with Aadhar Card Number and password</li>
<li>User can view the list of candidates</li>
<li>User can vote for a candidate (only once)</li>
<li>Admin can manage candidates (add, update, delete)</li>
<li>Admin cannot vote</li>
</ul>

<h2>Technologies Used</h2>
<ul>
<li>Node.js</li>
<li>Express.js</li>
<li>MongoDB</li>
<li>JSON Web Tokens (JWT) for authentication</li>
</ul>


<h1>API Endpoints</h1>

<h2>Authentication</h2>
<h3>Sign Up</h3>
<li><code>POST /signup</code>: Sign up a user</li>
<h3>Login</h3>
<li><code>POST /login</code>: Login a user</li>

<h2>Candidates</h2>
<h3>Get Candidates</h3>
<li><code>GET /candidates</code>: Get the list of candidates</li>
<h3>Add Candidate</h3>
<li><code>POST /candidates</code>: Add a new candidate (Admin only)</li>
<h3>Update Candidate</h3>
<li><code>PUT /candidates/:id</code>: Update a candidate by ID (Admin only)</li>
<h3>Delete Candidate</h3>
<li><code>DELETE /candidates/:id</code>: Delete a candidate by ID (Admin only)</li>

<h2>Voting</h2>
<h3>Get Vote Count</h3>
<li><code>GET /candidates/vote/count</code>: Get the count of votes for each candidate</li>
<h3>Vote for Candidate</h3>
<li><code>POST /candidates/vote/:id</code>: Vote for a candidate (User only)</li>

<h2>User Profile</h2>
<h3>Get Profile</h3>
<li><code>GET /users/profile</code>: Get user profile information</li>
<h3>Change Password</h3>
<li><code>PUT /users/profile/password</code>: Change user password</li>
