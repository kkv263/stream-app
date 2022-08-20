<script lang="ts">
    let twitterName:string;
    
    const  handleClick = async() => {
      try {
        const data = await fetch('/api/v1/twitter/profile-update', {
          method: 'POST',
          body: JSON.stringify({
            name: twitterName
          })
        }).then(res => res.json());
  
        if (data.errors) {
          console.log(data.errors);
          return;
        }
  
        if (data.status === 403) {
          // Create a modal for error
          console.log(data.detail);
          alert('twitter error')
          return;
        }
  
        // Update with data
        console.log(data);
        alert('success');
      }
      catch (error) {
        console.error(error);
      }
    }
  </script>
  
  <h3>Update profile (mainly name for now)</h3>
  <label for="">change name</label>
  <input type="text" bind:value={twitterName} />
  <!-- Must setup OAUTH 1.0 for this to work... is it worth it or just wait for v2 endpoint.  -->
  <!-- <button on:click={handleClick}>Update Profile</button> -->
  
  <style lang="scss">
    h3 {
      padding-bottom: 0;
    }
  </style>