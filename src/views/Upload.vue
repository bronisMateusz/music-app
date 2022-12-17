<template>
  <!-- Upload -->
  <section>
    <h2>Upload</h2>
    <input type="file" />
  </section>
  <!-- Upload progress -->
  <section>
    <h2>Upload progress</h2>
  </section>
  <!-- Uploaded albums -->
  <section>
    <h2>Uploaded albums</h2>
  </section>
  <!-- Uploaded songs -->
  <section>
    <h2>Uploaded songs</h2>
    <ul id="playlist">
      <li>
        <div class="song-details">
          <span class="song-cover" />
          <a href="#" class="song-title">Song Title</a>
          <span class="song-artist">Artist Name</span>
        </div>
        <eva-icon
          class="options"
          name="more-horizontal-outline"
          height="28"
          width="28"
        />
      </li>
      <li>
        <div class="song-details">
          <span class="song-cover" />
          <a href="#" class="song-title">Song Title</a>
          <span class="song-artist">Artist Name</span>
        </div>
        <eva-icon
          class="options"
          name="more-horizontal-outline"
          height="28"
          width="28"
        />
      </li>
    </ul>
  </section>
</template>
