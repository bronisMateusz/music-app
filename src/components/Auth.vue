<template>
  <div id="auth-modal">
    <div>
      <div>
        <div></div>
      </div>

      <!-- This element is to trick the browser into centering the modal contents. -->
      <span>&#8203;</span>

      <div>
        <div>
          <!--Title-->
          <div>
            <p>Your Account</p>
            <!-- Modal Close Button -->
            <div>
              <!-- <i class="fas fa-times"></i> -->
            </div>
          </div>

          <!-- Tabs -->
          <ul>
            <li>
              <a href="#">Login</a>
            </li>
            <li>
              <a href="#">Register</a>
            </li>
          </ul>

          <!-- Login Form -->
          <form>
            <!-- Email -->
            <div>
              <label>Email</label>
              <input type="email" placeholder="Enter Email" />
            </div>
            <!-- Password -->
            <div>
              <label>Password</label>
              <input type="password" placeholder="Password" />
            </div>
            <button type="submit">Submit</button>
          </form>
          <!-- Registration Form -->
          <form>
            <!-- Name -->
            <div>
              <label>Name</label>
              <input type="text" placeholder="Enter Name" />
            </div>
            <!-- Email -->
            <div>
              <label>Email</label>
              <input type="email" placeholder="Enter Email" />
            </div>
            <!-- Age -->
            <div class="mb-3">
              <label>Age</label>
              <input type="number" />
            </div>
            <!-- Password -->
            <div>
              <label>Password</label>
              <input type="password" placeholder="Password" />
            </div>
            <!-- Confirm Password -->
            <div>
              <label>Confirm Password</label>
              <input type="password" placeholder="Confirm Password" />
            </div>
            <!-- Country -->
            <div>
              <label>Country</label>
              <select>
                <option value="USA">USA</option>
                <option value="Mexico">Mexico</option>
                <option value="Germany">Germany</option>
              </select>
            </div>
            <!-- TOS -->
            <div>
              <input type="checkbox" />
              <label>Accept terms of service</label>
            </div>
            <button type="submit">Submit</button>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "AppAuth",
};
</script>
